# ETHICAL AND RESPONSIBLE AI FRAMEWORK
## Qatar Economic Government — AI-Powered Economic Solutions Programme

---

| | |
|---|---|
| **Document Title** | Ethical and Responsible AI Framework for AI-Powered Economic Solutions |
| **Prepared For** | Qatar Economic Government |
| **Prepared By** | [Firm Name] |
| **Document Version** | 1.0 |
| **Classification** | Confidential |
| **Date** | April 2026 |
| **Programme Reference** | [Project Code] |

---

## Document Control

| Version | Date | Author | Description |
|---|---|---|---|
| 0.1 | [Date] | [Name] | Initial draft |
| 1.0 | [Date] | [Name] | Approved for client review |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background and Context](#2-background-and-context)
3. [Objectives of the Framework](#3-objectives-of-the-framework)
4. [Framework Scope and Coverage](#4-framework-scope-and-coverage)
5. [Framework Elements — The Seven Pillars](#5-framework-elements--the-seven-pillars)
6. [Accepted Standards and Document References](#6-accepted-standards-and-document-references)
7. [Assumptions](#7-assumptions)
8. [The Ethical AI Governance Cycle](#8-the-ethical-ai-governance-cycle)
   - [Phase 1 — Classify AI/ML Model Type](#phase-1--classify-aiml-model-type)
   - [Phase 2 — Define AI Policy](#phase-2--define-ai-policy)
   - [Phase 3 — Identify AI Risks](#phase-3--identify-ai-risks)
   - [Phase 4 — Apply Controls](#phase-4--apply-controls)
   - [Phase 5 — Monitor Outcomes](#phase-5--monitor-outcomes)
   - [Phase 6 — Continuously Improve](#phase-6--continuously-improve)
9. [Trigger Conditions and On-Ground Outcomes](#9-trigger-conditions-and-on-ground-outcomes)
10. [Roles and Responsibilities](#10-roles-and-responsibilities)
11. [Framework Artefacts](#11-framework-artefacts)

---

## 1. Executive Summary

Qatar's economic government is undertaking a significant programme of AI-enabled transformation, deploying five Proof-of-Concept (POC) AI systems to support economic analysis, sector intelligence, and strategic decision-making. These systems operate on sensitive and classified government data — including economic intelligence documents, sector reports, policy briefs, and restricted datasets — making ethical governance not a peripheral concern but a foundational programme requirement.

This document establishes the Ethical and Responsible AI Framework that governs how AI systems are designed, built, tested, deployed, operated, and retired within this programme. It defines seven pillars spanning both ethical and responsible AI dimensions, a six-phase governance cycle, clear accountability structures, and concrete technical requirements — with particular attention to the handling, ingestion, processing, and storage of classified and sensitive government documents.

**Ethical AI** and **Responsible AI** are related but distinct obligations that this framework addresses together. Ethical AI is concerned with the values and principles that should guide AI — fairness, transparency, privacy, human dignity, and non-maleficence. Responsible AI is concerned with the organisational practices that make those values operational — governance structures, legal compliance, accountability mechanisms, reliability, and stakeholder trust. Neither is sufficient without the other: a system can be technically fair but ungoverned, or well-governed but built on flawed values. This framework requires both.

This framework is intentionally distinct from a risk register or risk management plan. Risk management asks: *what could go wrong and how do we contain it?* Ethical and Responsible AI governance asks: *what kind of AI actor do we intend to be, and how do we ensure our systems consistently reflect that intent?* The two are complementary. This document addresses the latter.

At the operational core of the framework is a six-phase governance cycle: **Classify AI/ML Model Type → Define AI Policy → Identify AI Risks → Apply Controls → Monitor Outcomes → Continuously Improve**. Every AI system in the programme passes through this cycle at inception and re-enters it whenever the system, its data, or its operating context changes materially.

The framework is designed to govern the current five POCs and to serve as a reusable institutional standard for any future AI initiative across the economic government — including those procured from third-party vendors.

---

## 2. Background and Context

### 2.1 The Programme

The Qatar Economic Government is developing five AI Proof-of-Concept systems as part of its digital transformation mandate. These include, but are not limited to, an AI-Driven Sector Insights system — a solution that processes economic data and government documents to generate intelligence and recommendations for decision-makers.

A central and technically significant characteristic of this programme is that the AI systems will **ingest, process, and reason over classified and sensitive government documents**. These documents include economic intelligence reports, sector assessments, investment analyses, policy drafts, and restricted statistical datasets. The AI frameworks used — including Retrieval-Augmented Generation (RAG) pipelines, large language models (LLMs), and vector search systems — will embed, store, and query the content of these documents as part of their normal operation.

This creates a distinct class of ethical obligation that goes beyond standard AI deployments. The framework must address not only what the AI recommends, but how classified content flows through the system, where it is stored, who can access AI-derived outputs from it, and what happens to embedded representations of classified documents after the system is retired.

### 2.2 Strategic Alignment

This framework aligns with Qatar National Vision 2030, which defines four national pillars: Human Development, Social Development, Economic Development, and Environmental Development. AI systems deployed in economic governance directly intersect all four pillars and carry an obligation to accelerate the vision without creating unintended institutional, social, or data sovereignty harm.

### 2.3 Ethical AI vs. Responsible AI — How This Framework Addresses Both

These two terms are frequently used interchangeably, but they represent distinct and complementary obligations. This framework is structured to address both explicitly.

| Dimension | Ethical AI | Responsible AI |
|---|---|---|
| **Focus** | The values and principles that should guide AI | The governance practices that make those values operational |
| **Asks** | Is this AI system fair, transparent, and respectful of human dignity? | Is this AI system governed, accountable, compliant, and trustworthy in practice? |
| **Concerned with** | What the AI does and how it affects people | How the organisation builds, deploys, and oversees the AI |
| **Failure looks like** | A biased model, an opaque decision, a privacy violation | No governance process, no accountability, no audit trail, no human oversight |
| **Addressed by** | Pillars 1, 2, 3, and 7 of this framework (Transparency, Fairness, Privacy, Inclusivity) | Pillars 4, 5, and 6 of this framework (Accountability, Robustness, Sustainability) and the six-phase governance cycle |

In the context of this programme, both dimensions are elevated by the fact that the AI systems ingest classified government documents. Ethical AI requires that access to, and derivation from, those documents respects individual and institutional rights. Responsible AI requires that the organisation has the governance structures in place to enforce that — through defined roles, auditable processes, classified document ingestion authorisation, and continuous monitoring.

Neither dimension is optional. A system that is ethically designed but has no governance process to maintain those properties over time will drift. A system that is well-governed but built on biased or opaque foundations will produce harmful outcomes despite its process rigour. This framework requires both, simultaneously, throughout the AI lifecycle.

### 2.4 What This Framework Is Not

This framework is not:

- A risk register (that is a separate, complementary document)
- A cybersecurity policy (though it references and aligns with the Qatar National Cybersecurity Framework)
- A data management policy (though it defines requirements that should be reflected in the programme's data management plan)
- A vendor contract (though its requirements should be incorporated into vendor agreements)

---

## 3. Objectives of the Framework

Each objective is tagged to indicate whether it primarily serves the **Ethical AI** dimension (values and principles), the **Responsible AI** dimension (governance and practice), or **Both**.

**OBJ-01 — Institutionalise AI Governance** `Responsible AI`
Establish a repeatable, documented governance process that any team within the economic government can apply when initiating, building, or procuring an AI system — regardless of vendor, technology stack, or use case.

**OBJ-02 — Define Accountable Ownership** `Responsible AI`
Assign explicit roles and responsibilities across the AI lifecycle so that every decision — from data ingestion to model deployment to decommissioning — has a named accountable owner, and no decision is attributed solely to the AI system.

**OBJ-03 — Protect Classified and Sensitive Government Documents** `Both`
Ensure that AI systems ingesting classified documents operate under strict data sovereignty, access control, and information security requirements. Classified content — including its vector embeddings and indexed representations — must never leave Qatar's authorised infrastructure, and access to AI outputs derived from classified documents must be controlled at least as rigorously as access to the source documents themselves.

**OBJ-04 — Ensure Explainability and Auditability of AI Outputs** `Both`
Mandate that AI outputs used to inform economic decisions — including outputs generated from classified source documents — are explainable to authorised non-technical stakeholders and traceable back to their source inputs. Decision-makers must be able to understand why a recommendation was made and which documents or data points informed it.

**OBJ-05 — Prevent Bias in Economic Analysis and Recommendations** `Ethical AI`
Establish bias detection and mitigation requirements to prevent AI systems from systematically skewing analysis or recommendations based on imbalances in the training data, document corpus, or retrieval pipeline — including imbalances created by the selective availability of classified documents.

**OBJ-06 — Uphold Privacy, Dignity, and Data Sovereignty** `Ethical AI`
Ensure that the use of personal, institutional, and classified data in AI systems respects the rights of individuals and entities, complies with Qatar's legal framework, and does not treat data as a commodity to be freely exploited.

**OBJ-07 — Enable Continuous Ethical and Responsible Review** `Both`
Build a structured feedback loop where AI systems are reviewed for ethical drift, performance degradation, data sovereignty risks, and changed classification conditions — not only at launch but throughout their operational life.

**OBJ-08 — Provide a Reusable Institutional Standard** `Responsible AI`
Produce a framework portable enough to govern the five current POCs and extensible enough to apply to future AI systems, including those that ingest different classes of sensitive or classified content.

---

## 4. Framework Scope and Coverage

### 4.1 What the Framework Covers

The framework covers five dimensions.

#### 4.1.1 The Full AI Lifecycle

The framework applies at every stage from the moment a use case is proposed to the moment the system is retired:

- **Ideation** — Is the use case ethically appropriate for AI? Is there lawful authority to use the required data?
- **Data Collection and Preparation** — How documents and datasets are sourced, classified, ingested, cleaned, and prepared. This includes the governance of classified document ingestion pipelines.
- **Model Design and Training** — Algorithm selection, objective setting, training data composition, and embedding model selection — all of which carry ethical implications.
- **Evaluation and Testing** — Performance evaluation for accuracy and for fairness, robustness, explainability, and data leakage risk.
- **Deployment and Integration** — How outputs are surfaced to users, what context is provided, what human oversight is built in, and how access to outputs derived from classified content is controlled.
- **Operations and Monitoring** — Ongoing monitoring for ethical drift, bias shift, access anomalies, and classification boundary violations.
- **Decommissioning** — Responsible retirement of the system including disposal of classified document embeddings and vector store data.

#### 4.1.2 The Ethical Themes

The framework covers seven ethical themes. Each represents a class of harm or obligation that the framework is designed to address:

| Theme | What It Covers |
|---|---|
| Transparency | Whether AI logic, source documents, and limitations are visible and understandable to authorised users |
| Fairness | Whether outputs treat different sectors, entities, and populations equitably |
| Privacy and Data Sovereignty | Whether personal, sensitive, and classified data is handled lawfully and kept within Qatar's control |
| Accountability | Whether humans retain decision ownership and cannot fully delegate to the AI system |
| Robustness and Security | Whether the system performs reliably, resists adversarial use, and prevents classified data exfiltration |
| Sustainability | Whether the computational footprint is measured and managed responsibly |
| Inclusivity and Cultural Alignment | Whether outputs are meaningful and appropriate in the Qatar context |

#### 4.1.3 The Types of AI Systems

The framework covers any system that uses machine learning, statistical modelling, or language AI to produce outputs that influence economic decisions, including:

- **Retrieval-Augmented Generation (RAG) pipelines** — Systems that embed classified documents into vector stores and use them as context for LLM-generated responses
- **Large Language Models (LLMs)** — Used for document analysis, summarisation, Q&A over government documents, and report generation
- **Predictive and forecasting models** — Sector growth forecasts, economic risk indicators, investment signals
- **Classification and categorisation models** — Entity classification, document routing, risk tiering
- **Recommendation systems** — Policy action suggestions, sector intervention recommendations
- **Anomaly detection systems** — Unusual pattern flagging in economic activity or document usage

The framework does not cover pure rule-based automation systems with no statistical or learning component, unless such systems are integrated with an AI component that falls within the above categories.

#### 4.1.4 The Decision Types

The framework applies with varying intensity based on the type of decision the AI output feeds into:

| Decision Type | Description | Framework Intensity |
|---|---|---|
| Operational | Internal processing, automated data routing | Standard — transparency and audit requirements apply |
| Advisory | AI output informs a recommendation to a manager or director | Elevated — explainability, human review, and override capability required |
| Policy-level | AI output shapes economic policy, strategy, or public investment priorities | Maximum — multi-stakeholder sign-off, full audit trail, bias documentation required |
| Public-facing | AI output is published or communicated externally | Maximum — additional accuracy, fairness, and legal compliance review required |

#### 4.1.5 The Stakeholder Obligations

The framework covers the responsibilities of every party involved in an AI system:

- **The Government Entity (Client)** — As owner and operator, accountable for governance and for ensuring AI outputs are used responsibly
- **The Development Team** — Responsible for implementing technical ethical requirements
- **Data and Document Owners** — Responsible for classifying documents before ingestion and confirming lawful authority for AI processing
- **Third-Party Vendors** — Must attest compliance with relevant framework pillars; classified document handling requirements are non-negotiable
- **End Users (Government Analysts, Decision-Makers)** — Responsible for applying human oversight and using AI outputs within their authorised scope

### 4.2 What the Framework Does Not Cover

- Purely rule-based automation (no machine learning or statistical modelling component)
- AI systems operated entirely by third parties with no government data input and no government-facing output
- Offline, air-gapped experimental research with no production deployment path in the current programme
- Ad hoc use of general-purpose AI tools by individual staff members — this is addressed by a separate acceptable use policy

---

## 5. Framework Elements — The Seven Pillars

The seven pillars form the value and governance backbone of the framework. Each pillar is tagged to show its primary dimension. Pillars tagged **Ethical AI** address values and principles. Pillars tagged **Responsible AI** address governance, practice, and accountability. Several pillars serve both.

| Pillar | Primary Dimension |
|---|---|
| 1 — Transparency | Both |
| 2 — Fairness and Non-Discrimination | Ethical AI |
| 3 — Privacy and Data Sovereignty | Both |
| 4 — Accountability and Human Oversight | Responsible AI |
| 5 — Robustness and Security | Responsible AI |
| 6 — Sustainability and Environmental Responsibility | Responsible AI |
| 7 — Inclusivity and Cultural Alignment | Ethical AI |

---

### Pillar 1 — Transparency `Both`

**Principle:** AI systems must make their logic, data sources, and limitations visible to authorised users and decision-makers. When AI outputs are derived from classified documents, the source classification level must be disclosed to the user alongside the output.

**Technical Requirements:**

- All production models must have a published and version-controlled **Model Card** documenting: training data provenance, document corpus composition and classification levels, performance metrics, known failure modes, and intended use boundaries.
- Inference APIs must return a **confidence or relevance score** alongside each output.
- For RAG-based systems, every AI-generated response must include **source attribution** — identifying which document(s) or document sections informed the output, including the classification level of those sources.
- When an AI output is derived in part from a classified document, the output must carry a **classification marker** at least equivalent to the highest classification level of its source documents.
- The explainability layer must use SHAP values, LIME, or equivalent attribution techniques for ML models, and citation-backed generation for LLM/RAG systems.
- All inference calls must be logged with: input query, output, model version, source documents referenced (by ID, not content), and timestamp.

**Measurable Criteria:**

- 100% of models have a published Model Card before go-live
- Source attribution active in all RAG-based POCs at go-live
- Classification markers applied to AI outputs wherever classified source documents are used
- Audit logs retained for a minimum of five years, consistent with government document retention requirements

---

### Pillar 2 — Fairness and Non-Discrimination `Ethical AI`

**Principle:** AI systems must not produce outputs that systematically favour or disadvantage any economic sector, business entity class, or population segment. Bias can be introduced not only through training data but through the selective availability of classified documents — if certain sectors are better represented in the classified document corpus than others, the AI's outputs will reflect that imbalance.

**Technical Requirements:**

- **Pre-ingestion corpus audit:** Before documents are ingested into any vector store or training pipeline, analyse the document corpus for representational balance across sectors, entity types, geographic focus within Qatar, and time periods. Document any known gaps.
- **Bias audit on training data** for all ML models: check for imbalanced sector representation, entity size class imbalances, and geographic distribution.
- Fairness metrics to be computed and tracked: demographic parity, equalised odds, and individual fairness scores where applicable.
- **Corpus gap disclosure:** Where the classified document corpus is known to have gaps (e.g. fewer documents on SMEs than on large enterprises), this must be disclosed in the Model Card and flagged to users in the system interface.
- Automated bias monitoring deployed in the inference pipeline — alerting when output distributions shift beyond a defined threshold relative to the baseline.
- Adversarial testing specifically targeting edge cases that could produce unfair outputs, including testing with queries about underrepresented sectors.

**Measurable Criteria:**

- Corpus audit report produced and documented before any RAG system goes live
- Bias audit report produced and signed off before any ML model enters user acceptance testing
- Corpus gap disclosures present in all Model Cards where applicable
- Fairness monitoring dashboard active within 30 days of production deployment
- No untriaged bias alerts older than five business days

---

### Pillar 3 — Privacy and Data Sovereignty `Both`

**Principle:** All personal, sensitive, and classified data used by AI systems — including data ingested from government documents — must be handled in compliance with Qatar's legal framework and kept within Qatar's authorised infrastructure. The vector embeddings and indexed representations of classified documents are themselves classified assets and must be governed accordingly.

**Technical Requirements:**

**Document Classification Schema** — applied to all documents before ingestion into any AI pipeline:

| Classification Level | Definition | AI Handling Requirement |
|---|---|---|
| Public | Non-sensitive, publicly available | Standard handling |
| Internal | Non-classified government working documents | In-country infrastructure; internal access controls |
| Confidential | Sensitive but not formally classified | In-country infrastructure; role-based access; encrypted at rest and in transit |
| Classified | Formally classified government documents | In-country infrastructure only; strict need-to-know access; embeddings encrypted; no external API calls |
| Top Secret | Highest classification | Requires formal approval to use in AI system; air-gapped deployment may be required |

- **No classified or confidential document — and no vector embedding derived from such a document — may be transmitted to any external service, API, or cloud region outside Qatar's authorised infrastructure.** This includes LLM inference API calls: if a classified document chunk would be included in the context window of an LLM call, that call must be made to a model hosted within Qatar's authorised infrastructure, not to an external cloud API.
- **Vector store encryption:** All vector databases containing embeddings derived from classified documents must be encrypted at rest using AES-256 or equivalent.
- **Embedding isolation:** Vector stores containing different classification levels must be physically or logically isolated. A query from a user with Internal clearance must not be able to retrieve chunks from a Classified vector store.
- **Data lineage tracking:** All documents ingested into the AI pipeline must have a documented lineage record from source to vector store — no untracked or manually uploaded files.
- **Inference-time access control:** The retrieval layer of any RAG system must enforce the user's clearance level before returning document chunks as context. A user with Internal clearance must never receive an AI-generated response that was informed by Classified document content.
- **Differential privacy** applied to any model trained on aggregated citizen-linked or entity-linked economic data.
- **PII handling:** Where documents contain personal data, PII fields must be identified, flagged, and either masked or subject to explicit data processing authority before ingestion.

**Measurable Criteria:**

- Document classification completed for all corpus documents before ingestion begins
- Zero production inference calls transmitting classified content to external APIs
- Vector store encryption verified before go-live
- Clearance-level access controls tested as part of the pre-deployment audit
- Data lineage documented in the Model Card for each POC

---

### Pillar 4 — Accountability and Human Oversight `Responsible AI`

**Principle:** Every AI-assisted decision that affects economic policy, resource allocation, or public-facing outputs must have a human decision-maker who owns the outcome. The AI system provides analysis and recommendation; it does not make decisions. This is especially critical when the AI's analysis is derived from classified documents that the human decision-maker may not have directly read.

**Technical Requirements:**

- **Decision Classification Matrix** produced for each POC, classifying every output type as one of:
  - **Informational** — Human reviews and may act without formal approval
  - **Advisory** — Human must explicitly approve before any action is taken
  - **Critical** — Multi-stakeholder sign-off required before action
- **Human-in-the-Loop (HITL) gates** built into all workflows where outputs are classified as Advisory or Critical.
- **Override and rejection mechanism:** Every AI recommendation surfaced in the system UI must have an explicit Accept / Reject / Override control. Override actions must be logged with the reason and the human's decision. This log must be available to auditors.
- **Classified source disclosure:** When an AI recommendation is based on classified source documents, the human reviewer must be informed of this — even if they cannot see the document content directly — so they understand the basis of the recommendation and can seek access through proper channels if needed.
- **Escalation paths** defined and documented for: AI output outside expected confidence range, high-confidence anomaly flags, system failure or silent degradation, and outputs that appear inconsistent with known classified document content.
- **No autonomous action:** No AI system in this programme may take autonomous external-facing action (e.g. publishing, sending, filing) without explicit human approval.

**Measurable Criteria:**

- Decision Classification Matrix produced for each POC and approved by client stakeholders before deployment
- HITL gates implemented and tested in all Advisory and Critical workflows
- Override log functional and accessible to auditors before go-live
- Classified source disclosure feature implemented in all RAG-based POC interfaces

---

### Pillar 5 — Robustness and Security `Responsible AI`

**Principle:** AI systems must perform reliably under expected and adversarial conditions. Systems that ingest classified documents face a specific class of threat: adversarial prompts designed to extract classified content from the AI, either directly or through inference. This must be actively defended against.

**Technical Requirements:**

- **Prompt injection testing** for all LLM and RAG-based POCs: systematic testing of adversarial prompts designed to bypass access controls, cause the model to reveal classified document content, or manipulate the retrieval pipeline.
- **Output filtering layer:** An output review layer that detects and blocks responses that may contain direct excerpts from classified documents, particularly in response to adversarial or out-of-scope queries.
- **Input validation:** All inference endpoints validate and sanitise input before it reaches the model or retrieval layer.
- **Rate limiting and anomaly detection** on all inference APIs: detect automated probing, unusual query patterns, or bulk retrieval attempts that may indicate an attempt to extract classified content through repeated queries.
- **Model versioning and rollback:** All models stored with semantic versioning; rollback to the previous stable version executable within four hours.
- **Dependency scanning:** All model dependencies and container images scanned for CVEs as part of the CI/CD pipeline, with blocking rules for Critical severity vulnerabilities.
- **Penetration testing** of the full RAG pipeline (embedding → vector store → retrieval → LLM → output) before any classified documents are ingested into a production system.

**Measurable Criteria:**

- Prompt injection test report produced and signed off before any RAG system goes live with classified documents
- Output filtering layer active in all LLM/RAG-based POCs at go-live
- CVE scan integrated into the deployment pipeline
- Penetration test of the classified document pipeline completed before production ingestion begins
- Rollback procedure tested at least once before go-live

---

### Pillar 6 — Sustainability and Environmental Responsibility `Responsible AI`

**Principle:** AI systems should be designed and operated with awareness of their computational and environmental footprint, consistent with Qatar's sustainability commitments and the efficiency obligations of responsible government technology procurement.

**Technical Requirements:**

- **Compute efficiency assessment** documented in the Model Card for each POC: training compute (GPU/CPU hours, estimated kWh), inference compute per query, and total estimated operational footprint at expected usage volumes.
- Prefer smaller, fine-tuned models over general-purpose large models where the task permits, to reduce inference energy cost. For classified document RAG systems, this is also a security preference: smaller, locally hosted models reduce the attack surface compared to large external API-dependent models.
- **Model compression evaluation** (quantisation, pruning) conducted before any model is scaled to production.
- Infrastructure hosting should align with the government's preferred in-country or low-emission infrastructure providers.

**Measurable Criteria:**

- Compute footprint documented in all Model Cards
- At least one model compression evaluation conducted per POC before production scaling

---

### Pillar 7 — Inclusivity and Cultural Alignment `Ethical AI`

**Principle:** AI systems serving Qatar's economic government must be designed with awareness of linguistic, cultural, and domain-specific nuances. Outputs must be meaningful and actionable for the local context, and the classified document corpus must be representative of Qatar's full economic landscape — not just the sectors with the most documentation.

**Technical Requirements:**

- **Arabic language support** evaluated for all user-facing AI outputs. Where Arabic is required, model performance in Arabic must be benchmarked separately from English performance, including retrieval quality from Arabic-language classified documents.
- For RAG systems, the embedding model used must be evaluated for its Arabic language embedding quality — many standard embedding models are significantly weaker in Arabic than in English, which would systematically degrade the quality of outputs derived from Arabic classified documents.
- **Domain expert validation:** Outputs from all sector intelligence POCs must be reviewed by domain experts — economists, sector analysts — from within the government before models are approved for advisory use. This is the primary quality gate for cultural and domain alignment.
- **Corpus representativeness review:** The classified document corpus must be assessed to confirm it includes documents relevant to all major economic sectors, including emerging sectors (technology, tourism, creative industries) not just historically dominant sectors.

**Measurable Criteria:**

- Arabic performance benchmark included in the Model Card for any POC with Arabic language requirements
- Embedding model Arabic quality evaluation documented before corpus ingestion begins
- Domain expert sign-off documented in the go-live checklist for each POC

---

## 6. Accepted Standards and Document References

The following standards and documents form the normative basis of this framework. All requirements in the framework are consistent with and traceable to one or more of these references.

| Reference | Relevance to This Framework |
|---|---|
| **UNESCO Recommendation on the Ethics of AI (2021)** | Global ethical principles baseline; adopted by 193 member states including Qatar; foundational to the seven pillars |
| **OECD AI Principles (2019, updated 2023)** | Core principles of inclusive growth, human-centred values, transparency, robustness, and accountability |
| **EU AI Act (2024)** | Risk classification model (limited / high / unacceptable risk) adopted as a reference standard; relevant to the classification of AI systems processing classified government documents as high-risk |
| **NIST AI Risk Management Framework (AI RMF 1.0, 2023)** | Technical framework for managing AI risk across the lifecycle: Govern, Map, Measure, Manage — directly maps to the gated lifecycle in Section 9 |
| **ISO/IEC 42001:2023 — AI Management System** | International standard for AI governance management systems; the framework's governance structure aligns with this standard |
| **ISO/IEC 27001:2022 — Information Security Management** | Baseline for data and infrastructure security requirements; specifically relevant to classified document handling under Pillar 3 and Pillar 5 |
| **ISO/IEC 27701:2019 — Privacy Information Management** | Extension of 27001 for privacy; relevant to PII handling requirements under Pillar 3 |
| **Qatar Personal Data Protection Law (PDPL) — Law No. 13 of 2016** | Legal basis for all personal data handling requirements in the framework |
| **Qatar National Cybersecurity Framework (QNCSF)** | Security baseline for government digital systems; Pillar 5 requirements align with QNCSF controls |
| **Qatar National Vision 2030** | Strategic alignment baseline; all seven pillars are designed to support rather than undermine the vision's four development pillars |
| **Qatar Government Document Classification Policy** | [Reference to the applicable government classification policy] — directly governs the document classification schema in Pillar 3 |
| **Model Cards for Model Reporting — Mitchell et al. (2019)** | Technical standard for AI model documentation; the Model Card artefact in this framework follows this specification |
| **Datasheets for Datasets — Gebru et al. (2021)** | Technical standard for dataset documentation; the Dataset Datasheet artefact follows this specification |
| **SHAP: A Game Theory Approach to Explainability — Lundberg & Lee (2017)** | Technical reference for the explainability method required under Pillar 1 |

---

## 7. Assumptions

The following assumptions define the conditions under which this framework operates. Where an assumption does not hold, a formal compensating control or documented exception is required.

**A-01 — Institutional Sponsorship and Enforcement Authority**
The framework assumes that a senior sponsor within the economic government has the authority and mandate to enforce compliance with the lifecycle gates defined in Section 7. Without this authority, the framework becomes advisory rather than binding. The framework's effectiveness is directly proportional to the institutional will behind it.

**A-02 — Appointment of an Ethical AI Officer**
The framework assumes that a named individual or team is designated as the Ethical AI Officer — responsible for reviewing and signing off on Gate Reviews. This role does not require a new hire; it may be assigned to an existing senior technical or governance role. The role must have independence from the delivery team whose work they are reviewing.

**A-03 — Document Classification Before Ingestion**
The framework assumes that all documents proposed for ingestion into AI systems are classified before the ingestion pipeline is built. Classification is the responsibility of the document owner or the government's classification authority, not the development team. If documents arrive unclassified, they must be treated as Confidential by default and formally classified before ingestion into any production system.

**A-04 — In-Country Infrastructure for Classified Document Processing**
The framework assumes that in-country or formally approved in-region infrastructure is available for all AI components that handle Classified or Confidential documents — including the LLM inference layer, the embedding layer, and the vector store. If this infrastructure is not available for a given POC, no Classified or Confidential documents may be ingested until it is in place. No exception to this assumption may be compensated by encryption alone.

**A-05 — Human Reviewer Capacity for HITL Gates**
The framework assumes that human reviewers — government analysts or domain experts — have allocated capacity to perform advisory reviews within the agreed service level. If reviewer capacity is insufficient, Advisory-class outputs may need to be temporarily reclassified as Informational with this exception formally documented and time-bound.

**A-06 — Vendor Cooperation with Framework Requirements**
Where third-party AI components are used, the framework assumes vendors can provide technical documentation equivalent to a Model Card and can attest to compliance with the privacy, security, and classified document handling requirements. Vendors who cannot provide this attestation must not be used for any component that touches Classified or Confidential data without a formal waiver approved by the Ethical AI Officer and the classification authority.

**A-07 — Iterative Application to POCs**
The five systems in the current programme are Proof-of-Concept systems. The framework assumes that an agreed Ethics Scope Statement is produced for each POC, specifying which gates are mandatory for the POC phase, which are deferred to a production phase, and what compensating controls cover any deferral. POC-phase classified document ingestion must still satisfy the full requirements of Pillar 3 (Privacy and Data Sovereignty) and Pillar 5 (Robustness and Security) — these cannot be deferred regardless of POC status.

**A-08 — Embedding Models Are Evaluated for Arabic Quality**
Where Arabic-language documents are part of the corpus, the framework assumes that the embedding model selection process includes an explicit Arabic language quality evaluation. If this evaluation has not been conducted, outputs derived from Arabic-language classified documents cannot be relied upon for Advisory or Critical decisions.

---

## 8. The Ethical and Responsible AI Governance Cycle

The governance cycle is the operational engine of this framework. It is a six-phase continuous loop — not a one-time project checklist. Every AI system in the programme enters the cycle at Phase 1 and, once deployed, continuously re-enters at the appropriate phase whenever the system, its data, its classification context, or its operating environment changes materially.

The cycle is designed to serve both framework dimensions simultaneously. The early phases (1–2) establish the ethical and responsible foundation: what kind of system this is, and what obligations attach to it. The middle phases (3–4) operationalise those obligations into concrete risk identification and technical controls. The later phases (5–6) ensure the system continues to live up to both its ethical values and its responsible governance commitments over time — not just at go-live.

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║      QATAR ECONOMIC GOVERNMENT — ETHICAL & RESPONSIBLE AI GOVERNANCE CYCLE      ║
╚══════════════════════════════════════════════════════════════════════════════════╝

                         ┌─────────────────────────┐
                    ┌───▶│  PHASE 6                 │───┐
                    │    │  CONTINUOUSLY IMPROVE    │   │
                    │    └─────────────────────────┘   │
                    │                                   ▼
         ┌──────────────────┐               ┌─────────────────────────┐
         │  PHASE 5         │               │  PHASE 1                │
         │  MONITOR         │               │  CLASSIFY AI/ML         │
         │  OUTCOMES        │               │  MODEL TYPE             │
         └──────────────────┘               └─────────────────────────┘
                    ▲                                   │
                    │                                   ▼
         ┌──────────────────┐               ┌─────────────────────────┐
         │  PHASE 4         │               │  PHASE 2                │
         │  APPLY           │◀──────────────│  DEFINE AI POLICY       │
         │  CONTROLS        │               └─────────────────────────┘
         └──────────────────┘                           │
                    ▲                                   ▼
                    │               ┌─────────────────────────┐
                    └───────────────│  PHASE 3                │
                                    │  IDENTIFY AI RISKS      │
                                    └─────────────────────────┘
```

---

### Phase 1 — Classify AI/ML Model Type `Both`

**Purpose:** Different AI model types carry fundamentally different ethical risks and responsible governance requirements. The classification step determines which ethical considerations are primary for this system, shapes the risk identification in Phase 3, and determines the intensity of controls required in Phase 4. No two model types are governed identically.

#### AI/ML Model Type Classification Table

| Model Type | Description | Primary Ethical Considerations |
|---|---|---|
| **Generative AI / LLM** | Text generation, summarisation, Q&A, report drafting | Hallucination of facts, prompt injection attacks, output unpredictability, classified content leakage through generation, attribution accuracy |
| **RAG Pipeline** | Retrieval-Augmented Generation over a document corpus | Retrieval bias (what gets retrieved determines what the model reasons over), classified document exposure, corpus representativeness, source attribution accuracy, clearance-level access enforcement |
| **Predictive / Forecasting Model** | Time-series forecasting, regression, economic projections | Historical bias perpetuation, false confidence in projections, uncertainty quantification, sector imbalance in training data |
| **Classification Model** | Entity/document categorisation, risk tiering, routing | Demographic and sector bias in class assignments, threshold fairness (false positive vs. false negative harm asymmetry), explainability of classification decisions |
| **Recommendation System** | Policy/action suggestions, investment recommendations, sector intervention proposals | Feedback loop bias (recommendations reinforce existing patterns), explainability of why a recommendation was made, disproportionate influence on resource allocation |
| **Anomaly Detection** | Unusual pattern flagging in economic activity or document usage | False positive harm (incorrectly flagging legitimate activity), disproportionate flagging of smaller or underrepresented entities, opacity of anomaly definition |

#### Classification Outputs

At the end of Phase 1, two things are produced:

1. **Model Type Classification Record** — Documents which model type(s) apply to the system (a single system may combine types, e.g. a RAG pipeline using an LLM for generation), and which primary ethical considerations are therefore active.

2. **Ethical Risk Intensity Rating** — A preliminary rating (Low / Medium / High) based on model type and intended use:

| Combination | Default Intensity |
|---|---|
| LLM or RAG + Classified document ingestion | High |
| LLM or RAG + Internal/Confidential documents only | Medium–High |
| Predictive or Forecasting + Policy-level output | High |
| Classification + Advisory or Critical decision | Medium–High |
| Recommendation + Policy-level output | High |
| Anomaly Detection + Operational output only | Medium |
| Any model type + Public-facing output | Elevated by one level |

---

### Phase 2 — Define AI Policy `Responsible AI`

**Purpose:** Based on the model type and its ethical risk intensity, define the specific policy that governs this AI system. This is the primary Responsible AI phase — it translates the values identified in Phase 1 into concrete organisational commitments, legal compliance obligations, and governance rules. Policy is not generic — it is tailored to the model type, the data it uses, the decisions it informs, and the users it serves.

#### Policy Definition Areas

**Data and Document Policy**
- Which document classification levels are permitted as input to this system?
- What is the legal authority for AI processing of each document class?
- Where must inference, embedding, and storage occur (in-country infrastructure requirements)?
- What data retention and disposal rules apply to this system's outputs and to the vector embeddings of its source documents?

**Access and Clearance Policy**
- Who is permitted to query this system?
- What clearance level is required to receive outputs derived from Classified or Confidential source documents?
- How is clearance enforced at the retrieval layer (for RAG systems) and at the output layer?

**Output and Decision Policy**
- What is the Decision Classification Matrix for this system? Which outputs are Informational, Advisory, or Critical?
- What human oversight is mandatory before an Advisory or Critical output can be acted upon?
- Must AI-generated outputs carry a classification marker inherited from their source documents?

**Explainability Policy**
- What level of explanation must accompany each output? (Confidence score only / feature attribution / full source citation)
- For RAG systems: must source documents be cited, and must their classification level be disclosed alongside the output?

**Vendor and Third-Party Policy**
- If the system uses third-party model components, what attestation must the vendor provide?
- Are there any model components (e.g. external LLM APIs) that are prohibited due to classified data handling requirements?

#### Policy Output

**AI System Policy Document** — A concise, system-specific policy document (distinct from this framework) that records all decisions made in Phase 2. This document is reviewed and signed off by the Ethical AI Officer before Phase 3 begins.

---

### Phase 3 — Identify AI Risks `Both`

**Purpose:** With the model type known and the policy defined, systematically identify the ethical risks (bias, opacity, privacy violation, cultural harm) and responsible AI risks (governance gaps, compliance failures, reliability issues, security vulnerabilities) specific to this system. Risk identification is structured by the active ethical pillars and informed by the model type classification from Phase 1.

#### Risk Identification by Model Type

**Risks specific to LLM / Generative AI systems:**
- Model hallucination: generating plausible but factually incorrect economic figures or policy statements
- Prompt injection: adversarial inputs manipulating the model to produce harmful, biased, or classified outputs
- Output unpredictability: outputs that are inconsistent across similar queries, undermining trust in advisory use
- Over-reliance: users treating generated content as authoritative without applying critical review

**Risks specific to RAG pipelines over classified documents:**
- Retrieval bias: the retrieval mechanism systematically returning documents that favour certain sectors, periods, or viewpoints, skewing the model's reasoning
- Classified content leakage: LLM generating responses that include verbatim or near-verbatim excerpts from classified documents, surfacing to users without appropriate clearance
- Corpus gap risk: underrepresented sectors or topics in the document corpus leading to systematic blind spots in AI outputs
- Clearance bypass: a user with lower clearance accessing AI outputs that were informed by documents above their clearance level
- Embedding exfiltration: vector embeddings of classified documents being accessed or extracted outside authorised channels

**Risks specific to predictive / forecasting models:**
- Historical bias: models trained on historical economic data perpetuating past sector imbalances into future forecasts
- False precision: forecast outputs presented with unjustified confidence, leading to over-reliance in policy decisions
- Data staleness: model trained on data that no longer reflects the current economic environment

**Risks specific to classification models:**
- Sector or entity bias: classification outcomes systematically disadvantaging certain sectors, SMEs vs. large entities, or geographic regions within Qatar
- Threshold inequity: the chosen decision threshold producing asymmetric harm (e.g. higher false positive rates for smaller entities)

**Risks specific to recommendation systems:**
- Feedback amplification: recommendations that reinforce existing resource concentrations, making the rich-get-richer dynamic worse
- Opacity: decision-makers unable to understand or challenge why a recommendation was made

**Risks specific to anomaly detection:**
- False positive harm: legitimate economic activity being incorrectly flagged, triggering unnecessary scrutiny of entities
- Definition opacity: what counts as anomalous is not transparent to the people being monitored

#### Risk Register Output

A **System-Specific AI Risk Register** is produced at the end of Phase 3. It records:
- Risk ID and description
- Model type it originates from
- Ethical pillar it falls under
- Likelihood and impact rating
- Mapped control (to be confirmed in Phase 4)
- Owner

---

### Phase 4 — Apply Controls `Both`

**Purpose:** For each risk identified in Phase 3, apply the appropriate technical and governance control. Ethical AI controls address values-based risks (bias, opacity, privacy). Responsible AI controls address governance and operational risks (accountability gaps, security vulnerabilities, compliance deficiencies). Controls are drawn from the seven pillars defined in Section 5. This phase is where the pillars become concrete implementation tasks.

#### Control Categories

**Transparency Controls**
- Publish and version-control the Model Card before deployment
- Integrate explainability layer (SHAP for ML models; citation-backed generation for RAG/LLM systems)
- Implement source attribution in RAG pipeline outputs — each response cites the document IDs and classification levels that informed it
- Apply classification markers to AI outputs derived from classified source documents
- Activate inference logging (query, output, model version, source document IDs, timestamp)

**Fairness Controls**
- Execute pre-ingestion corpus audit — assess representational balance across sectors, entity types, and time periods
- Run bias audit on training data for all ML models
- Compute and baseline fairness metrics (demographic parity, equalised odds, individual fairness)
- Document corpus gaps in the Model Card and surface them to users in the system interface

**Privacy and Data Sovereignty Controls**
- Apply document classification schema to all corpus documents before ingestion
- Enforce infrastructure routing: Classified and Confidential documents processed only on in-country infrastructure
- Implement vector store encryption (AES-256 or equivalent) for all stores containing classified embeddings
- Enforce physical or logical isolation between vector stores of different classification levels
- Implement clearance-level access control at the retrieval layer of all RAG systems
- Document data lineage for all ingested documents

**Accountability Controls**
- Build Human-in-the-Loop (HITL) gates into all Advisory and Critical output workflows
- Implement Accept / Reject / Override controls on all AI recommendation interfaces, with logged justification
- Implement classified source disclosure: inform human reviewers when an AI recommendation is based on classified documents, even if they cannot see the document content directly
- Define and document escalation paths for anomalous outputs, silent failures, and adversarial activity

**Robustness and Security Controls**
- Conduct prompt injection and adversarial testing before any RAG or LLM system goes live with classified documents
- Deploy output filtering layer to detect and block responses containing direct excerpts from classified documents
- Implement input validation and sanitisation on all inference endpoints
- Deploy rate limiting and anomaly detection on inference APIs
- Conduct penetration test of the full classified document pipeline (embedding → vector store → retrieval → LLM → output)
- Scan all model dependencies and container images for CVEs in the CI/CD pipeline

**Sustainability Controls**
- Document compute footprint (GPU/CPU hours, estimated kWh) in the Model Card
- Evaluate model compression options (quantisation, pruning) before production scaling

**Inclusivity and Cultural Alignment Controls**
- Benchmark embedding model Arabic language quality before corpus ingestion begins
- Run Arabic performance benchmark for all user-facing outputs where Arabic is required
- Obtain domain expert sign-off on sample outputs before go-live

#### Go-Live Clearance

At the conclusion of Phase 4, before the system is deployed to production:

- Final Model Card published and version-controlled
- System-Specific AI Risk Register reviewed and all High risks confirmed as mitigated or formally accepted
- Decision Classification Matrix approved by client stakeholders
- Classified document ingestion formally authorised in writing by the Classification Authority
- Monitoring dashboards confirmed active
- Rollback procedure tested

**Output:** Signed Go-Live Ethics Clearance

---

### Phase 5 — Monitor Outcomes `Responsible AI`

**Purpose:** Verify that the controls applied in Phase 4 are working as intended in the live environment. Monitoring is the primary ongoing Responsible AI obligation — it is the mechanism by which the organisation demonstrates that its ethical commitments are not theoretical but actively maintained. It also surfaces ethical drift: cases where a system that was ethically sound at launch has degraded over time. Monitoring is not passive — it is an active process of detecting ethical drift, performance degradation, access anomalies, and changed risk conditions.

#### Monitoring Schedule

**Monthly:**
- Fairness monitoring dashboard review — track output distribution across sectors, entity types, and query types against the established baseline
- Bias alert triage — any automated alert from the fairness monitoring system must be triaged within five business days
- Model drift detection — detect shifts in output patterns that may indicate the model is behaving differently from its evaluated state
- Access anomaly review — review any unusual patterns in query volumes, retrieval behaviour, or bulk access attempts that may indicate adversarial use or classified content extraction attempts

**Quarterly:**
- Model Card review and update — update performance metrics, known issues, and corpus composition
- HITL override log review — analyse patterns in human overrides to identify systematic model errors or user trust issues
- Corpus update review — if new documents have been ingested, re-run the corpus audit and bias assessment

**Annually:**
- Full Ethical Impact Review — comprehensive review of all seven pillars against the live system
- Ethical Compliance Certificate — issued by the Ethical AI Officer confirming the system remains compliant with the framework

#### Monitoring Outputs

| Frequency | Output |
|---|---|
| Monthly | Ethics Health Report (automated dashboard + written summary) |
| Quarterly | Quarterly Review Record |
| Annually | Ethical Compliance Certificate |
| On-demand | Incident Report (for any triggered mid-cycle event) |

#### Mid-Cycle Trigger Events

The following events trigger an immediate re-entry into the cycle at the specified phase, outside the normal monitoring schedule:

| Trigger Event | Re-entry Point | Required Response |
|---|---|---|
| Classified document corpus updated with new or reclassified documents | Phase 3 | Corpus audit re-run; bias assessment updated; Model Card updated |
| A document in the corpus is reclassified to a higher level | Phase 4 | Immediate access control review; confirm embeddings are now restricted to higher clearance level |
| Bias alert generated | Phase 4 | Triage within five business days; document response |
| Adversarial query pattern detected | Phase 4 | Security review within 24 hours; consider temporary suspension of classified document retrieval |
| Model performance degrades below agreed thresholds | Phase 3 | Re-run risk assessment before any retraining is deployed |
| Regulatory change (PDPL update, classification policy revision) | Phase 2 | Policy review within 30 days; update affected controls |
| System decommissioned or replaced | Decommission | Classified embedding disposal; vector store purge; output archiving; lessons learned |

---

### Phase 6 — Continuously Improve `Both`

**Purpose:** Feed the findings from monitoring back into the cycle to make each iteration of the system — and each new AI system — both more ethically sound and more responsibly governed than the last. Continuous improvement is what distinguishes a living framework from a one-time compliance exercise. Continuous improvement is what transforms the framework from a compliance checkbox into a genuine institutional capability.

#### Improvement Inputs

- Findings from monthly, quarterly, and annual monitoring reviews
- Patterns identified in HITL override logs (systematic model errors that humans are consistently correcting)
- Bias alerts and their root cause analyses
- Adversarial test results and security incident reports
- Feedback from domain experts and system users
- Changes in the external standards landscape (updated OECD principles, new ISO standards, PDPL amendments)
- Lessons learned from decommissioned systems

#### Improvement Actions

| Finding Type | Improvement Action | Re-entry Phase |
|---|---|---|
| Model producing systematically biased outputs | Update training data or corpus; retrain or fine-tune model | Phase 1 (re-classify if model type changes) or Phase 3 |
| Policy found to be insufficient (e.g. new classification level introduced) | Update the AI System Policy Document | Phase 2 |
| New risk identified not in original risk register | Add to risk register; identify and apply new control | Phase 3 → Phase 4 |
| Control found to be ineffective | Strengthen or replace the control | Phase 4 |
| Monitoring gap identified | Add new monitoring metric or alert | Phase 5 |
| Framework pillar found to be inapplicable or missing | Update this framework document | All phases |

#### Improvement Governance

- Improvement actions are tracked in a **Framework Improvement Log** maintained by the Ethical AI Officer.
- Any change to a deployed system's controls or policy triggered by Phase 6 requires sign-off by the Ethical AI Officer before implementation.
- Framework-level changes (updates to the pillars, standards references, or cycle structure) require sign-off by the Senior Sponsor.
- The Framework Improvement Log is reviewed at the Annual Ethical Impact Review.

---

## 9. Trigger Conditions and On-Ground Outcomes

### 9.1 What Stakeholders Actually See On the Ground

| Stakeholder | What They Receive |
|---|---|
| Ministry Decision-Maker | AI recommendations arrive with a plain-language explanation, a confidence level, source attribution (document IDs and classification levels), and a human reviewer's approval stamp before any action is taken |
| Government Analyst (system user) | AI outputs are clearly labelled with their classification level; source documents are cited; an Accept / Reject / Override control is present on every recommendation; clearance-level filtering is automatic |
| Technical Team | A structured six-phase cycle with documented tooling requirements per phase (explainability library, bias scanner, vector store encryption, output filter, monitoring dashboard), Model Card template, and Dataset Datasheet template |
| Information Security / Classification Authority | A formal Go-Live Ethics Clearance document authorising AI processing of each document class; access control test results; penetration test report; annual compliance certificate |
| Procurement Team | A vendor ethics attestation form to be included in future AI procurement tenders |
| Internal Audit | A complete, auditable trail: Model Cards, AI System Policy Documents, Risk Registers, Go-Live Clearances, override logs, corpus audit records, access anomaly logs, classified document disposal records |

### 9.2 Mid-Cycle Trigger Summary

The cycle is also triggered — and re-entered at the appropriate phase — by any of the following operational events:

| Event | Phase Re-entry |
|---|---|
| New AI use case initiated | Phase 1 |
| Existing model retrained on new data | Phase 3 |
| Document corpus updated or reclassified | Phase 3 |
| New risk identified in live system | Phase 3 |
| Control found ineffective | Phase 4 |
| Regulatory or policy change | Phase 2 |
| Adversarial incident detected | Phase 4 |
| System decommissioned | Decommission procedure |

---

## 10. Roles and Responsibilities

*R = Responsible, A = Accountable, C = Consulted, I = Informed*

| Activity | Ethical AI Officer | Technical Lead | Data / Doc Engineer | Domain Expert | Classification Authority | Senior Sponsor |
|---|---|---|---|---|---|---|
| Phase 1 — Model Type Classification | A | R | C | C | C | I |
| Phase 2 — AI Policy Definition | A | R | C | C | R | I |
| Phase 3 — Risk Identification | A | R | R | C | C | I |
| Phase 4 — Control Implementation | A | R | R | C | C | I |
| Phase 4 — Classified Ingestion Authorisation | R | C | I | I | A | I |
| Phase 4 — Go-Live Ethics Clearance | R | R | I | I | C | A |
| Phase 5 — Monthly Monitoring | R | R | R | C | I | I |
| Phase 5 — Annual Ethical Impact Review | R | C | C | C | C | A |
| Phase 5 — Corpus Update Review | A | R | R | C | C | I |
| Phase 5 — Adversarial / Anomaly Response | A | R | R | I | I | I |
| Phase 6 — Continuous Improvement Actions | A | R | C | C | C | I |
| Decommission Review | A | R | R | I | R | I |

**Ethical AI Officer** — The designated individual or team responsible for framework sign-off at each phase. Must have independence from the delivery team.

**Classification Authority** — The government-designated authority responsible for document classification decisions. Must formally authorise the ingestion of classified documents into any AI system.

---

## 11. Framework Artefacts

Every AI system governed by this framework produces the following documented artefact set. These artefacts constitute the formal record of ethical governance for the system.

| Artefact | Produced At | Owner | Retention |
|---|---|---|---|
| Model Type Classification Record | Phase 1 | Technical Lead | Programme duration + 5 years |
| Ethical Risk Intensity Rating | Phase 1 | Ethical AI Officer | Programme duration + 5 years |
| AI System Policy Document | Phase 2 | Ethical AI Officer | System life + 5 years |
| System-Specific AI Risk Register | Phase 3 | Technical Lead + Ethical AI Officer | System life + 5 years |
| Corpus Classification and Representativeness Report | Phase 3 | Data Engineer | Programme duration + 5 years |
| Bias Audit Report | Phase 3 | Technical Lead | Programme duration + 5 years |
| Dataset / Corpus Datasheet | Phase 3 | Data Engineer | Programme duration + 5 years |
| Model Card (versioned) | Phase 4 → updated quarterly | Technical Lead | Programme duration + 5 years |
| Pre-Deployment Ethics Audit Checklist | Phase 4 | Technical Lead | Programme duration + 5 years |
| Penetration Test Report (classified pipeline) | Phase 4 | Security Lead | Programme duration + 5 years |
| Decision Classification Matrix | Phase 4 | Ethical AI Officer + Domain Expert | System life + 5 years |
| Classified Document Ingestion Authorisation | Phase 4 | Classification Authority | System life + 5 years |
| Go-Live Ethics Clearance | Phase 4 | Ethical AI Officer + Senior Sponsor | System life + 5 years |
| Monthly Ethics Health Report | Phase 5 (monthly) | Technical Lead | 5 years |
| Quarterly Review Record | Phase 5 (quarterly) | Ethical AI Officer | 5 years |
| Annual Ethical Compliance Certificate | Phase 5 (annual) | Ethical AI Officer | 10 years |
| HITL Override Log | Phase 5 (ongoing) | System Administrator | System life + 5 years |
| Framework Improvement Log | Phase 6 (ongoing) | Ethical AI Officer | Permanent |
| Decommission Ethics Checklist | Decommission | Ethical AI Officer | 10 years |
| Classified Embedding Disposal Verification | Decommission | Classification Authority + Technical Lead | 10 years |
| Lessons Learned Brief | Decommission | Ethical AI Officer | Permanent |

---

*End of Document*

---

*Document Classification: Confidential*
*Version 1.0 — Qatar Economic Government — Ethical and Responsible AI Framework — April 2026*
