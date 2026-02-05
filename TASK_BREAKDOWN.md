# Backend Implementation Task Breakdown - AI-Assisted Compliance Checker

---

## **Person A (Document Extraction & Parsing)**

**Responsibility**: Extract and parse all document formats uniformly

### **Detailed Tasks**
- Build multi-format parser: PDF, DOCX, DOC, PPTX
- For **PPTX**: Extract slide titles as section identifiers, map content to slides
- For **PDF**: Detect text-based vs scanned (flag for OCR)
- For **DOCX/DOC**: Extract heading hierarchy to identify sections
- Output standardized format: `List[{"content": str, "section_name": str, "source_file": str, "metadata": {...}}]`
- Handle edge cases: corrupted files, empty sections, unsupported formats
- Provide reusable parsing interface for both compliance docs and proposals

### **Deliverable**
`DocumentExtractor` module used by both compliance and proposal workflows

### **Dependencies**
None (foundation)

---

## **Person B & C (Team: Compliance Documents & Rules Generation)**

**Combined Responsibility**: Extract compliance docs, generate rules dictionary, design prompts

### **Person B - Compliance Document Processor & Rules Extractor**
- Integrate with Person A's document extractor for RFP/RFI/RFC files
- Build preprocessing pipeline: remove noise, normalize text, preserve structure
- Design section detection logic for compliance documents
- Implement text chunking: intelligent chunks by requirement/section
- Build rules extraction orchestration: prepare text for LLM
- Validate rules dictionary output: ensure all sections captured, rules non-empty
- Handle edge cases: multi-part requirements, nested sections, complex formatting

### **Person C - LLM Handler & Compliance Prompt Engineer**
- Build Azure OpenAI wrapper class with generic call methods
- Design comprehensive prompts for rules extraction from compliance docs:
  - System prompt: "You are a compliance requirements analyzer"
  - Output format: `{ "SectionName": "Requirements text", "SubSections": {...} }`
- Implement section name normalization: handle naming variations
- Design validation/retry prompts: if rules incomplete, clarify with LLM
- Create fallback prompts for complex documents
- Implement error handling: rate limiting, retries, token management, response parsing
- Add logging: track all LLM calls for debugging

### **Collaboration Points**
- Person B prepares text → Person C sends to LLM with optimized prompts
- Joint prompt testing: iterate on prompt quality with real compliance docs
- Together design rules dictionary schema and validation criteria
- Error handling: decide if malformed output is prompt issue or response parsing

### **Deliverable**
`RulesGeneratorService` + `ComplianceLLMHandler` that converts RFP → structured rules dictionary

### **Dependencies**
Requires Person A (document extractor)

---

## **Person D & E (Team: Proposal Analysis & Compliance Checking)**

**Combined Responsibility**: Extract proposals, compare against rules, design comparison prompts

### **Person D - Proposal Document Processor & Compliance Analyzer**
- Integrate with Person A's document extractor for proposal files (PDF, DOCX, PPTX)
- Build preprocessing pipeline: clean, normalize, preserve structure for comparison
- Implement section-by-section processing: iterate through proposal sections
- Build section matching logic: map proposal sections to RFP sections (handle naming variations)
- Implement multi-level analysis orchestration:
  - Level 1: Does section exist in proposal?
  - Level 2: Do key requirements match?
  - Level 3: Is implementation complete/sufficient?
- Handle special cases: extra sections in proposal, missing major sections
- Prepare proposal text for LLM comparison

### **Person E - LLM Handler & Compliance Prompt Engineer**
- Extend Azure OpenAI wrapper (coordinate with Person C) for proposal comparison
- Design comprehensive comparison prompts:
  - System prompt: "You are a compliance auditor assessing proposal completeness"
  - User prompt: includes rules dictionary + proposal text
  - Output format: `{ "SectionName": { "status": "complete/incomplete/missing", "gaps": [...], "suggestions": [...], "confidence": 0-1 } }`
- Design incremental LLM calls: process proposal section-by-section for accuracy
- Implement gap analysis prompts: what specifically is missing/incomplete?
- Create suggestion generation prompts: recommend improvements
- Add token optimization: handle long proposals efficiently
- Implement response parsing and validation

### **Collaboration Points**
- Person D prepares proposal text → Person E sends to LLM with comparison prompts
- Joint prompt testing: iterate on compliance checking accuracy
- Together design compliance report schema and gap definitions
- Share LLM handler interface with Team B & C for consistency
- Error handling: decide if comparison errors are prompt or parsing issues

### **Deliverable**
`ComplianceCheckerService` + `ProposalLLMHandler` that compares proposals against rules

### **Dependencies**
Requires Person A (document extractor), Team B & C output (rules dictionary)

---

## **Person F (API Endpoints & Dynamic Routing)**

**Responsibility**: Expose all services via REST API with orchestrated workflows

### **Detailed Tasks**
- Build two main endpoints:
  - `POST /api/compliance/upload-rfp` → RFP ingestion and rules generation workflow
  - `POST /api/compliance/upload-proposal` → Proposal analysis workflow
- Implement session management: store rules dictionary between requests
- Handle file uploads: validation, temporary storage, cleanup
- Orchestrate RFP workflow: call Person A → Team B & C → store rules
- Orchestrate Proposal workflow: retrieve rules → call Person A → Team D & E → return report
- Design dynamic routing: handle different proposal file types appropriately
- Implement error responses: clear error messages at each step
- Response formatting: standardized JSON for all endpoints
- Handle edge cases: proposal before RFP uploaded, RFP re-upload, concurrent requests
- Add logging/monitoring: track request flow, processing time, failures

### **Deliverable**
Fully functional REST API endpoints with complete workflow orchestration

### **Dependencies**
Requires all other services (Person A, Teams B & C, Teams D & E)

---

## **Prompting & LangChain Strategy (Person C & E Collaboration)**

### **Shared Prompting Framework**
- Use **LangChain's PromptTemplate** for all prompts (centralized, version-controlled)
- Design prompt hierarchy:
  - **System prompts**: Define role and context
  - **Few-shot examples**: 1-2 examples of expected output format
  - **User prompts**: Dynamic context (rules dict, document text)

### **Person C & E Coordinate on Prompt Library**
```
prompts/
├── rules_extraction.py              ← Person C
│   ├── SystemPrompt
│   ├── ExtractionTemplate
│   ├── ValidationTemplate
│   └── NormalizationTemplate
├── compliance_checking.py            ← Person E
│   ├── SystemPrompt
│   ├── ComparisonTemplate
│   ├── GapAnalysisTemplate
│   ├── SuggestionTemplate
│   └── IncompleteAnalysisTemplate
└── base_templates.py                ← Shared
```

### **LangChain Integration**
- Use `LangChain OutputParser` to parse LLM JSON responses reliably
- Implement `LangChain Chains`:
  - Chain 1: RFP text → extract rules (Person C)
  - Chain 2: Proposal text + rules → compliance report (Person E)
- Use `LangChain Memory` or custom session handler for storing rules between requests (Person F)

### **Error Recovery Strategy**
- Design "retry prompts": if LLM response doesn't match schema, use simpler prompt
- Implement prompt versioning: A/B test different prompt styles
- Fallback logic: simplified prompts for complex documents

---

## **Workflow & Dependencies**

```
Days 1-2:
  ├─ Person A: Document extraction foundation
  ├─ Person C: LLM infrastructure setup
  └─ (Person B: Compliance preprocessing prep)

Days 2-3:
  ├─ Person B & C: Rules extraction pipeline (test with sample RFP)
  ├─ Person D & E: Setup proposal processing foundation
  └─ Person F: API skeleton with endpoints

Days 3-4:
  ├─ Person D & E: Compliance checking + comparison prompts
  ├─ Person F: Workflow orchestration integration
  └─ (Person B & C: Prompt optimization)

Days 4-5:
  ├─ Person F: Final API integration, session management, dynamic routing
  ├─ Person B & C: Rules extraction refinement, edge case handling
  ├─ Person D & E: Compliance checking refinement, accuracy testing
  └─ All: End-to-end testing, bug fixes

Day 5-6:
  └─ All: Integration testing, documentation, final validation
```

---

## **Key Collaboration Checkpoints**

| **Checkpoint** | **People** | **What to Agree On** |
|---|---|---|
| **Day 1 End** | A, B, C, D | Document extraction output format, section identification |
| **Day 2 Mid** | B, C, F | Rules dict schema, endpoint contracts, session storage |
| **Day 3 Mid** | D, E, F | Compliance report schema, how rules passed to proposal checker |
| **Day 3 End** | C, E | Shared LLM handler interface, prompt structure consistency |
| **Day 4 End** | F, (B, C, D, E) | Full workflow testing, error scenarios, edge cases |

---

## **Shared Deliverables**

1. **Input/Output Contracts** (All): Define exact JSON schemas for each module
2. **Prompt Library** (C & E): Centralized, tested prompts with LangChain templates
3. **Error Codes** (F, C, E): Standardized error responses across API
4. **Testing Suite** (All): Unit tests for each service + integration tests

---

## **Code Structure**

```
/backend
├── /services
│   ├── document_extractor.py         ← Person A
│   ├── compliance_processor.py        ← Person B
│   ├── rules_generator.py            ← Person B & C
│   ├── proposal_processor.py          ← Person D
│   ├── compliance_checker.py          ← Person D & E
│   ├── llm_handler.py                ← Person C & E
│   └── session_manager.py            ← Person F
├── /routes
│   └── compliance.py                 ← Person F
├── /prompts (LangChain)
│   ├── rules_extraction_prompts.py   ← Person C
│   ├── compliance_checking_prompts.py ← Person E
│   └── base_templates.py             ← Shared
├── /utils
│   ├── file_handlers.py              ← Person A
│   ├── response_formatters.py        ← Person F
│   ├── error_handlers.py             ← Person F
│   ├── text_processors.py            ← Person B & D
│   └── response_parsers.py           ← Person C & E
└── main.py                           ← Person F
```

---

## **Summary: 6-Person Team Structure**

- **Person A**: Document extraction & parsing (used by both compliance and proposal workflows)
- **Person B & C**: Compliance documents side (extraction, rules generation, LLM prompting)
- **Person D & E**: Proposal documents side (extraction, compliance checking, LLM prompting)
- **Person F**: REST API endpoints + dynamic routing (orchestrates everything)

Clear separation of concerns with RFP and Proposal workflows developed in parallel, coordinating through shared document extraction and LLM infrastructure.
