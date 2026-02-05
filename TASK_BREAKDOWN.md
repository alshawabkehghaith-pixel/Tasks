# Backend Implementation Task Breakdown - AI-Assisted Compliance Checker

---

## **Person A & B (Team: Document Processing)**

**Combined Responsibility**: Extract, parse, and clean all document formats end-to-end

### **Person A - File Parser Lead**
- Build multi-format parser: PDF, DOCX, DOC, PPTX
- For **PPTX**: Extract slide titles as section identifiers, map content to slides
- For **PDF**: Detect text-based vs scanned (flag for OCR)
- For **DOCX/DOC**: Extract heading hierarchy to identify sections
- Output standardized format: `List[{"content": str, "section_name": str, "source_file": str, "metadata": {...}}]`
- Handle edge cases: corrupted files, empty sections, unsupported formats

### **Person B - Text Cleaner & Validator**
- Remove formatting noise (whitespace, unicode artifacts, headers/footers)
- Preserve document structure (lists, tables, bullet points as markdown)
- Clean OCR output if flagged by Person A
- Implement intelligent chunking: keep section context, don't split mid-requirement
- Validate output: ensure text is LLM-ready, no corruption
- Add quality scoring: confidence in extraction accuracy

### **Collaboration Points**
- Person A identifies section boundaries → Person B validates they make sense contextually
- Person A flags suspicious PDFs → Person B decides if OCR preprocessing needed
- Joint testing: ensure output quality across all file types

### **Deliverable**
End-to-end `DocumentProcessor` module that ingests any file → returns cleaned, structured text with section markers

### **Dependencies**
None (foundation)

---

## **Person C & E (Team: LLM Integration & Prompting)**

**Combined Responsibility**: Build all LLM interaction logic, prompt engineering, and response handling

### **Person E - LLM Infrastructure**
- Build Azure OpenAI wrapper class with:
  - Connection management (API key, endpoint, model selection)
  - Call methods: `call_llm(system_prompt, user_prompt, response_format)` (generic)
  - Error handling: rate limiting, retries, timeouts
  - Token counting: ensure prompts don't exceed limits
  - Logging: track all calls for debugging/cost
- Implement response validation: check if LLM returned valid JSON/structure
- Add fallback logic: if parsing fails, retry with simplified prompt

### **Person C - Rules Generator & Prompt Engineer**
- Design comprehensive system prompt for rules extraction:
  - Instruct LLM to identify ALL sections in compliance document
  - Extract key requirements/rules per section
  - Output MUST be JSON: `{ "SectionName": "Detailed requirements text", "SubSections": {...} }`
- Implement section name normalization: handle variations ("Executive Summary" vs "Summary")
- Design validation prompts: if rules look incomplete, ask LLM to clarify
- Handle complex documents: multi-part requirements, nested sections
- Create fallback prompts: simpler versions if LLM struggles

### **Collaboration Points**
- Person E builds `call_llm()` method → Person C uses it with custom prompts
- Person C designs prompts → Person E tests and optimizes for Azure OpenAI
- Joint debugging: if LLM output is malformed, decide if it's prompt issue or response parsing issue
- Together design the rules dictionary schema and validation

### **Deliverable**
`RulesGeneratorService` (uses LLM handler) that reliably extracts compliance rules into structured dictionary

### **Dependencies**
Requires Person A & B output

---

## **Person D & F (Team: Compliance Analysis & API Orchestration)**

**Combined Responsibility**: Compare proposals to rules and expose via API endpoints

### **Person D - Compliance Checker & Prompt Engineer**
- Design comprehensive comparison prompt:
  - System prompt: "You are a compliance auditor. Given rules and a proposal, assess completeness."
  - User prompt: includes rules dictionary + proposal text
  - Output format: `{ "SectionName": { "status": "complete/incomplete/missing", "gaps": [...], "suggestions": [...], "confidence": 0-1 } }`
- Implement section matching: map proposal sections to RFP sections (handle naming variations)
- Design incremental LLM calls: process proposal section-by-section for better accuracy
- Create multi-level analysis:
  - Level 1: Does section exist in proposal?
  - Level 2: Do key requirements match?
  - Level 3: Is implementation complete/sufficient?
- Handle special cases: proposal has extra sections, proposal uses different terminology

### **Person F - API Endpoints & Workflow Orchestration**
- Build two main endpoints:
  - `POST /api/compliance/upload-rfp` → RFP ingestion workflow
  - `POST /api/compliance/upload-proposal` → Proposal analysis workflow
- Implement session management: store rules dictionary between requests (in-memory or Redis-ready)
- Handle file uploads: validation, temporary storage, cleanup
- Orchestrate workflow: call Person A/B → Person C → store rules → wait for proposal
- Design second workflow: retrieve rules → call Person A/B on proposal → Person D comparison → return report
- Error handling: clear error messages at each step
- Response formatting: standardized JSON for all endpoints

### **Collaboration Points**
- Person D designs comparison logic → Person F orchestrates it via API
- Person F identifies what rules need to be passed to Person D → Person D designs prompts around that format
- Together design session structure: how are rules stored/retrieved between requests?
- Joint testing: end-to-end workflow validation

### **Deliverable**
`ComplianceCheckerService` + fully functional REST API (`/upload-rfp`, `/upload-proposal`)

### **Dependencies**
Requires Person A & B output, Person C & E output

---

## **Prompting & LangChain Strategy (Across All Teams)**

### **Shared Prompting Framework**
- Use **LangChain's PromptTemplate** for all prompts (centralized, version-controlled)
- Design prompt hierarchy:
  - **System prompts**: Define role ("You are a compliance auditor")
  - **Few-shot examples**: Include 1-2 examples of expected output format
  - **User prompts**: Dynamic context (rules dict, document text)

### **Person C & D Collaborate on Prompt Library**
```
prompts/
├── rules_extraction.py
│   ├── SystemPrompt
│   ├── ExtractionTemplate
│   └── ValidationTemplate
├── compliance_checking.py
│   ├── SystemPrompt
│   ├── ComparisonTemplate
│   ├── IncompleteAnalysisTemplate
│   └── SuggestionTemplate
└── shared_templates.py
```

### **LangChain Integration**
- Use `LangChain OutputParser` to parse LLM JSON responses reliably
- Implement `LangChain Chains`:
  - Chain 1: RFP → Rules (RFP text → LLM → parse rules dict)
  - Chain 2: Proposal → Compliance (rules dict + proposal text → LLM → parse compliance report)
- Use `LangChain Memory` or custom session handler for storing rules between requests

### **Error Recovery**
- Design "retry prompts": if LLM response doesn't match schema, use simpler prompt
- Implement prompt versioning: A/B test different prompt styles

---

## **Workflow & Dependencies**

```
Days 1-2:
  ├─ Person A & B: File parsing + cleaning foundation
  └─ Person E: LLM infrastructure setup

Days 2-3:
  ├─ Person C & E: Rules extraction pipeline (test with sample RFP)
  └─ (Person A & B: Final testing, edge cases)

Days 3-4:
  ├─ Person D & F: Compliance checking + API skeleton
  └─ (Person C & E: Prompt optimization)

Days 4-5:
  ├─ Person F: Final API integration, session management
  ├─ Person D: Final compliance logic refinement
  └─ All: End-to-end testing, bug fixes

Day 5-6:
  └─ All: Integration testing, documentation
```

---

## **Key Collaboration Checkpoints**

| **Checkpoint** | **People** | **What to Agree On** |
|---|---|---|
| **Day 1 End** | A, B, E | Output formats (parsed doc structure, LLM method signatures) |
| **Day 2 Mid** | C, E | Rules dict schema, prompt structure, validation rules |
| **Day 3 Mid** | D, F | Compliance report schema, endpoint contracts, session storage |
| **Day 3 End** | C, D | How rules dict is passed to compliance checker, gap definition |
| **Day 4 End** | F, (C, D, E) | Full workflow testing, error scenarios |

---

## **Shared Deliverables (Collaborative)**

1. **Input/Output Contracts** (All): Define exact JSON schemas for each module
2. **Prompt Library** (C & D): Centralized, tested prompts with LangChain templates
3. **Error Codes** (F, E): Standardized error responses across API
4. **Testing Suite** (All): Unit tests for each service + integration tests

---

## **Code Structure (Collaborative Awareness)**

```
/backend
├── /services
│   ├── document_processor.py          ← Person A & B
│   ├── rules_generator.py             ← Person C & E
│   ├── compliance_checker.py           ← Person D & E
│   ├── llm_handler.py                 ← Person E
│   └── session_manager.py             ← Person F & E (shared)
├── /routes
│   └── compliance.py                  ← Person F
├── /prompts (LangChain)
│   ├── rules_extraction_prompts.py    ← Person C
│   ├── compliance_prompts.py          ← Person D
│   └── base_templates.py              ← Shared
├── /utils
│   ├── file_handlers.py               ← Person A
│   ├── text_cleaning.py               ← Person B
│   └── response_parsers.py            ← Person E
└── main.py                            ← Person F
```

---

## **Summary: Team Pairings**

- **Team A & B**: Document Processing (end-to-end extraction & cleaning)
- **Team C & E**: LLM Integration (prompts, chains, Azure OpenAI handler)
- **Team D & F**: Compliance Analysis & API (comparison logic + REST endpoints)

Each pair has clear handoff points and can work semi-independently while maintaining alignment on data formats and schemas.
