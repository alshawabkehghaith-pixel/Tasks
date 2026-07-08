# DocChecker — Presentation Prep Guide

---

## Part 1: High-Level Overview

### What Is DocChecker?

DocChecker is an AI-powered compliance verification platform that automates the review of vendor proposals against RFP (Request for Proposal) requirements. Instead of manually cross-referencing a proposal against an RFP page by page, the platform does it in seconds and produces a structured compliance report.

### The Problem It Solves

- Manual compliance review is slow, error-prone, and inconsistent
- Reviewers can miss requirements or apply subjective judgment
- No standardized output format for compliance findings

### What It Does (One-Liner)

Takes an RFP and a proposal, extracts every requirement from the RFP, then analyzes the proposal section-by-section to determine what's complete, incomplete, or missing — with a compliance score, gaps, and actionable suggestions.

### General Flow (Talking Points)

> "The user uploads two documents — an RFP and a vendor proposal. The platform first reads the RFP and extracts all requirements organized by proposal section. Then it reads the proposal and checks each section against those rules. The output is a structured compliance report with a score, section-by-section analysis, identified gaps, and suggestions for remediation. The user can view the results in a dashboard and export them as a PDF."

---

## Part 2: Demo (Self-Prepared)

Key things the audience will see:

- The upload step (two files: RFP + Proposal)
- The processing/polling (status updates with stages)
- The results (overview score, section cards with Complete/Incomplete/Missing, gaps, suggestions)
- The PDF export

---

## Part 3: Technical Details

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend Framework | FastAPI | Async REST API |
| ASGI Server | Uvicorn | Serves the FastAPI app |
| Data Validation | Pydantic | Request/response models, LLM output schemas |
| LLM Provider | Azure OpenAI | Hosted GPT model (deployment-configured) |
| LLM Orchestration | LangChain (`AzureChatOpenAI`, `JsonOutputParser`) | Manages prompts, calls, structured output parsing |
| PDF Parsing | pypdf (`PdfReader`) | Extracts text page-by-page |
| DOCX Parsing | docx2txt (via LangChain `Docx2txtLoader`) | Extracts text from Word docs |
| PPTX Parsing | python-pptx (`Presentation`) | Extracts text slide-by-slide |
| Session Management | In-memory Python dict | Tracks processing state per session |
| Async Processing | `asyncio.create_task()` + `ThreadPoolExecutor` | Non-blocking background pipeline |
| Frontend | React | Results dashboard + PDF export |

### Model Details

- Uses **Azure OpenAI** — the specific model depends on the Azure deployment configured via the `AZURE_OPENAI_DEPLOYMENT` environment variable
- Temperature: **0.2** (low for deterministic, consistent output)
- Two LLM calls per analysis, both using the same deployment (singleton `AzureChatOpenAI` instance)
- Output is **structured JSON** enforced via Pydantic schemas + LangChain's `JsonOutputParser`

---

## Part 4: Solution Architecture Walkthrough

Walk through the diagram box by box in this order:

### 1. User / UI

> "The user interacts through a React frontend. They upload two documents and poll for results. They can also export the final analysis as PDF."

### 2. Application Box

> "The upload hits a FastAPI endpoint. It validates the file types — we support PDF, DOCX, and PPTX. It generates a UUID session ID, saves the initial state to our session store, and kicks off a background async task for processing."

### 3. In-Memory Session Store Dictionary

> "This is a Python dictionary keyed by session UUID. It tracks the processing status, the current stage, filenames, and eventually stores the rules and compliance results. The polling endpoint reads from this store to return progress or final results."

### 4. Document Ingestion Pipeline

> "The background task writes uploaded files to ephemeral temp directories, then runs our StreamingLoader. It detects the file type and uses the appropriate parser — PdfReader for PDFs, Docx2txtLoader for DOCX, Presentation for PPTX. Each parser yields Document objects with extracted text and metadata like page numbers and detected section headings. The text is concatenated and passed downstream."

### 5. Azure (LLM Calls)

> "We make two calls to a single Azure OpenAI deployment. The first call takes the full RFP text and extracts a per-section rules dictionary — every requirement organized by the proposal sections they apply to. The second call takes the proposal text plus those rules, and performs a semantic section-by-section compliance analysis. Both calls use JsonOutputParser to enforce structured output matching our Pydantic schemas."

### 6. Data Flow Back

> "The results flow back into the session store. The compliance analysis includes an overview with a score, a list of analyzed sections each marked Complete/Incomplete, and any missing sections. The user polls for this and the frontend renders it."

---

## Part 5: All Backend Endpoints

There are 6 endpoints across 3 router files, all under the `/api` prefix:

### Core Endpoints (`router/core.py`)

| Method | Path | What It Does |
|--------|------|-------------|
| `GET` | `/api/` | Returns a welcome message + `version` (from `BUILD_TAG` env var) |
| `GET` | `/api/healthz` | Returns `{ success: true }` — used for health/liveness checks |

### Full Pipeline Endpoints (`router/full_pipeline.py`)

| Method | Path | What It Does |
|--------|------|-------------|
| `POST` | `/api/test/full-pipeline/upload` | Accepts two files (`rfp` + `proposal` as multipart). Validates extensions, generates session ID, saves initial state, kicks off background task. Returns `{ session_id, status, message }` |
| `GET` | `/api/test/full-pipeline/status/{session_id}` | Polls session state. If `completed`, returns `{ session_id, compliance_analysis }`. If still processing, returns the full session dict (with `stage`, filenames, etc.). If failed, returns the `error`. 404 if session doesn't exist |

### Standalone RFP Testing Endpoints (`router/rules_generator_test.py`)

| Method | Path | What It Does |
|--------|------|-------------|
| `POST` | `/api/test/rfp-upload` | Accepts a single file (RFP only). Same validation + session ID pattern, but only runs rules extraction (LLM Call 1). Returns `{ session_id, status }` |
| `GET` | `/api/test/rfp-rules/{session_id}` | Returns the full session dict — contains `rules` on success, `error` on failure |

The standalone RFP routes are useful for testing rules extraction in isolation without needing a proposal document.

---

## Part 6: Ingestion Pipeline Deep Dive

### Step 1: File Lands in a Temp Directory

Before ingestion starts, the background task (`_process_full_pipeline`) writes the uploaded bytes to an ephemeral temp directory:

```python
rfp_temp_dir = tempfile.mkdtemp()
rfp_file_path = Path(rfp_temp_dir) / rfp_filename
rfp_file_path.write_bytes(rfp_content)
```

### Step 2: StreamingLoader is Created

The pipeline service calls `stream_documents(folder_path)` which creates a `StreamingLoader` and iterates:

```python
def stream_documents(source_path: str) -> Generator[Document, None, None]:
    loader = StreamingLoader(source_path)
    yield from loader.stream_documents()
```

### Step 3: Iterate Over Files in the Folder

`stream_documents()` lists every file in the folder and checks the extension to determine which parser to use.

### Step 4: File-Type-Specific Processing

| Extension | Library | How It Works | Yields |
|-----------|---------|-------------|--------|
| `.pdf` | `pypdf.PdfReader` | Opens the PDF, iterates page by page, calls `page.extract_text()` on each page | One `Document` per page |
| `.docx` | LangChain `Docx2txtLoader` | Loads all content from the Word document | One `Document` (whole file) |
| `.pptx` | `python-pptx.Presentation` | Iterates slide by slide, extracts text from every shape (text boxes, titles, etc.), joins with newlines | One `Document` per slide |
| Anything else | — | Silently skipped (`continue`) | Nothing |

### Step 5: Section Detection (Metadata Enrichment)

All three loaders call `extract_section_from_text()` on the extracted text. This is a regex helper that detects section/chapter/article numbers:

- `Section 3.2`
- `Chapter 5`
- `Article 12.1`
- Numbered headings like `3.2 Technical Approach`

The result goes into the `section` metadata field. It's not a loader — it's metadata enrichment.

### Step 6: Document Object Structure

Each yielded `Document` has:

- `page_content`: the extracted text
- `metadata`:
  - `document_name`: original filename
  - `file_path`: full path to the temp file
  - `page`: page/slide number (string)
  - `total_pages`: total pages/slides (string)
  - `section`: detected section number or `None`
  - `type`: defaults to `hr_policy`

### Step 7: Text Concatenation in the Service Layer

All `Document` objects get their text concatenated in the service layer:

```python
parts: List[str] = []
for d in docs:
    text = (getattr(d, "page_content", "") or "").strip()
    if text:
        parts.append(text)
prompt_text = "\n\n".join(parts).strip()
```

A 20-page PDF becomes one big string with double-newlines between pages. This is what gets sent to the LLM.

### Step 8: Temp Directory Cleanup

After processing completes (success or failure), temp files are deleted in the `finally` block:

```python
finally:
    for temp_dir in [rfp_temp_dir, proposal_temp_dir]:
        if temp_dir and os.path.exists(temp_dir):
            for f in os.listdir(temp_dir):
                os.remove(os.path.join(temp_dir, f))
            os.rmdir(temp_dir)
```

### Visual Summary

```
Upload (bytes in memory)
    │
    ▼
tempfile.mkdtemp() → write bytes to disk
    │
    ▼
StreamingLoader(folder_path).stream_documents()
    │
    ├── .pdf  → PdfReader      → 1 Document per PAGE
    ├── .docx → Docx2txtLoader → 1 Document (whole file)
    ├── .pptx → Presentation   → 1 Document per SLIDE
    └── else  → skip
    │
    │   Each Document has:
    │   ├── page_content: extracted text
    │   └── metadata: document_name, file_path, page,
    │                  total_pages, section (regex), type
    │
    ▼
Concatenate all page_content with "\n\n"
    │
    ▼
Single text string → sent to LLM
    │
    ▼
Cleanup: delete temp files + rmdir
```

---

## Part 7: Q&A Prep — Anticipated Technical Questions

### "How do you handle large documents?"

- The entire document text is concatenated and sent in a single LLM call
- No chunking or RAG strategy currently — relies on the model's context window
- Azure OpenAI models have context limits (e.g. 128K tokens for GPT-4o). Very large documents could hit this, but typical RFPs and proposals fit within the window
- **Future improvement:** could add chunking, summarization, or a map-reduce approach for very large docs

### "How do you ensure the LLM output is structured/reliable?"

- Pydantic schemas define the exact output structure (`RulesOutput`, `ComplianceAnalysisOutput`)
- LangChain's `JsonOutputParser` injects format instructions into the prompt and parses the response
- The prompt itself has strict instructions: "Output MUST be valid JSON ONLY. No Markdown. No code blocks."
- Temperature is set to **0.2** for consistency

### "What happens if the LLM call fails or returns bad output?"

- The background task has a try/except that catches any exception
- On failure, the session is updated with `status: "failed"` and an `error` message
- The polling endpoint returns this error state to the client
- The parser would throw if the LLM returns invalid JSON, which gets caught by the same handler

### "Why in-memory session store and not a database?"

- This is a POC/MVP architecture — fast to build, no infrastructure dependencies
- Trade-off: sessions are lost on restart, no horizontal scaling (each instance has its own dict)
- **Production path:** swap `SessionClient` with Redis or a database — the interface is already abstracted through the `SessionClient` class, so it's a clean swap

### "How does the async processing work?"

- The upload endpoint uses `asyncio.create_task()` to fire off `_process_full_pipeline()` as a background coroutine
- The endpoint immediately returns the `session_id` without waiting for processing
- The client polls `GET /status/{session_id}` to check progress
- LLM Call 2 (`compliance_analysis`) is synchronous in LangChain, so it's wrapped in `ThreadPoolExecutor` via `loop.run_in_executor()` to avoid blocking the event loop

### "Why two LLM calls instead of one?"

- **Separation of concerns:** extracting rules from an RFP is a fundamentally different task from analyzing compliance
- **Better accuracy:** each call gets a focused, specialized prompt rather than one overloaded prompt trying to do everything
- **Reusability:** the rules extraction can be used independently (there's a standalone `/api/test/rfp-upload` endpoint for just rules extraction)
- **Debuggability:** you can inspect the intermediate rules output to verify correctness before the compliance step runs

### "How does the compliance analysis handle sections that don't match by name?"

- The prompt explicitly instructs **semantic/content-based matching**, not title matching
- Example from the prompt: "A section titled 'Our Team' may actually be the PROJECT ORGANIZATION STRUCTURE if it contains org charts, roles, and responsibilities"
- It reads the entire proposal first, maps content to rules by meaning, and only marks something as "Missing" if the content is truly absent everywhere

### "What file types are supported?"

- `.pdf`, `.docx`, `.pptx` — all three are fully implemented with dedicated parsers
- `.doc` is accepted by the API validator but **not handled** by the ingestion pipeline (known gap)
- `.txt` is not supported
- Scanned/image-only PDFs won't produce text (no OCR) — the code raises an error: "No extractable text found (may require OCR)"

### "What does the output schema look like?"

**`ComplianceAnalysisOutput`:**

- **`overview`** (`ComplianceOverview`):
  - `total_sections_analyzed`: int
  - `complete_sections`: int
  - `incomplete_sections`: int
  - `missing_sections`: int
  - `compliance_score`: int (0-100)
  - `summary`: string (3-4 sentences)
- **`sections`** (array of `SectionAnalysis`):
  - `section_name`: string
  - `status`: "Complete" | "Incomplete"
  - `urgency`: "High" | "Medium" | "Low"
  - `compliance_gap`: string (2-3 sentences)
  - `suggestion`: string (2-3 sentences)
- **`missing_sections`** (array of `SectionAnalysis`):
  - Same structure with `status: "Missing"`

### "What about security / data handling?"

- Files are written to **ephemeral temp directories** and deleted immediately after processing in a `finally` block
- No persistent storage of uploaded documents
- Azure OpenAI handles data in transit — governed by your Azure subscription's data policies
- CORS is currently locked to `http://localhost:3000`

### "What would you change for production?"

1. Swap in-memory dict for **Redis or a database** for session persistence
2. Add **OCR support** (e.g., Azure Document Intelligence) for scanned PDFs
3. Add **chunking/RAG** for documents that exceed context window limits
4. Add **authentication** and proper CORS configuration
5. Add **.doc** support or remove it from accepted types
6. Add **retry logic** for LLM calls
7. Add **logging and observability** (structured logs, tracing LLM calls)
8. Move from `/test/` routes to production-ready routes

---

## Key File Reference

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app setup, CORS, exception handler, auto-mounts routers |
| `server.py` | Uvicorn entry point |
| `config.py` | Environment variables + config.ini loading |
| `schema.py` | Pydantic models: `RulesOutput`, `ComplianceAnalysisOutput`, `SectionAnalysis`, `ComplianceOverview` |
| `ingestion.py` | `StreamingLoader` — PDF/DOCX/PPTX text extraction |
| `router/core.py` | Root + health endpoints |
| `router/full_pipeline.py` | Upload + status endpoints for full pipeline |
| `router/rules_generator_test.py` | Standalone RFP-only rules extraction endpoints |
| `services/Pipeline.py` | `RfpRulesConnector` + `ProposalExtractor` service classes |
| `services/compliance_doc_llm.py` | Singleton `AzureChatOpenAI` with `extract_rules()` + `compliance_analysis()` |
| `prompts/rules_extraction_prompts.py` | System prompt for LLM Call 1 (rules extraction) |
| `prompts/CompliancePrompt.py` | System + user prompts for LLM Call 2 (compliance analysis) |
| `utils/session_id_client.py` | `SessionClient` — in-memory session store |
| `utils/fast_api.py` | Auto-discovers and mounts router modules |
| `utils/error_handler.py` | JSON error handler for `RaisedException` |
