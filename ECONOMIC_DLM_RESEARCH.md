# Economic Domain-Specific Language Models (DLMs)
**Prepared for:** EY Internal — Client AI Use Case Assessment
**Client Context:** Government Economic Entity, Doha, Qatar
**Use Case:** Sector-level Economic AI Assistant — RAG-grounded, forecasting-capable, cross-dataset reasoning
**Document Purpose:** Identify the most viable economic DLMs, understand their feasibility for this use case, and define what to investigate before a recommendation can be made

---

## Important Framing

No single DLM on the market today is purpose-built for macroeconomic government advisory out of the box. The realistic system is always:

> **Domain model (or strong frontier model) + RAG pipeline over the client's own economic data**

The DLM choice affects how well the model *reasons* about economics. The RAG layer provides *factual grounding* in the client's actual numbers. Both layers matter equally. The DLM options below are grouped by enterprise availability — a critical filter given that the client's economic data is confidential.

---

## Models Without Enterprise Availability

> These have no commercial licensing, no SLAs, and no data confidentiality guarantees. They are research or open-source releases only. They are included for completeness and because some are relevant as fine-tuning bases or retrieval components — but none should be deployed as-is for a government client handling confidential data.

---

### BloombergGPT

- Trained from scratch on 363 billion tokens including macro reports, country analyses, central bank publications, sector coverage, and financial news — the closest any model has come to true economic domain training
- Demonstrated that a domain-trained model outperforms general-purpose models of the same size on economic and financial NLP tasks — validates the premise that model training data matters for this use case
- Relevant for tasks like sector trend interpretation, economic indicator narration, and policy document summarization
- Has never been released externally — no API, no license, no partner access — Bloomberg uses it internally only
- **Not deployable. Referenced as a benchmark of what is theoretically achievable with purpose-built economic training**

---

### FinGPT

- Fine-tuned on financial and economic tasks including earnings analysis, macroeconomic sentiment classification, and economic news headline interpretation
- Has variants trained for forward-looking economic signals — sentiment from central bank statements, earnings call tone analysis — relevant for a system that needs to flag economic risk or momentum in sector reporting
- Finance-oriented in training (equities, corporate events) rather than government macroeconomics — would not natively understand concepts like non-hydrocarbon GDP contribution, QNV sector targets, or trade balance decomposition without further fine-tuning
- No enterprise support, no SLAs, no data confidentiality guarantees — raw HuggingFace weights only
- Usable as a **base for custom fine-tuning** on the client's macroeconomic corpus, but requires ML engineering investment and cannot be handed to a government client as-is

---

### FinBERT

- Encoder-only model trained on financial and economic text — understands economic terminology, sector classifications, and indicator language well
- Cannot generate responses or produce analysis — it classifies, scores, and tags text only
- Useful inside the RAG pipeline as an **economic relevance scorer**: when the system retrieves 20 chunks from a 300-page sector report, FinBERT can rank which chunks are most economically relevant to the user's specific question before passing them to the generative model
- No enterprise version; open source only — not a concern given its limited role as a retrieval component rather than the core assistant

---

### FinMA / PIXIU

- Instruction-tuned on a structured set of financial and economic reasoning tasks including numerical reasoning over financial statements, Q&A over economic reports, and named entity recognition in economic text
- The PIXIU benchmark it was built around is the most rigorous evaluation framework available for economic AI — covers sentiment, classification, summarization, and question answering across financial and economic documents
- Primarily finance-domain; limited coverage of macroeconomic government contexts such as sector national accounts, fiscal policy, and trade statistics
- No enterprise support; academic release only
- Primary value for this engagement: use the **PIXIU/FLARE benchmark methodology** as a template to build an internal evaluation suite — test any deployed model against 50–100 real sector questions drawn from the client's own reports before going live

---

### FinTral

- Built on Mistral-7B with continuous pre-training on economic and financial corpora followed by instruction tuning — one of the few small models that genuinely understands macroeconomic document structure
- **Can read and reason over economic tables and charts natively** — directly relevant for a government entity whose data includes structured sector accounts, quarterly national accounts tables, and statistical annexes in PDF reports
- Benchmarked at GPT-4 level on economic and financial reasoning tasks despite being a 7B model — small enough to run on modest GPU infrastructure in a government data center
- No enterprise support; academic and open-source release only
- The most practical recipe for a **custom economic model build**: take FinTral's methodology, apply it to the client's own economic corpus (QSA reports, QCB bulletins, ministry sector reviews), and produce a domain-trained model that understands Qatar's specific economic structure — requires ML engineering capacity from EY or the delivery partner

---

### Falcon (Technology Innovation Institute — Abu Dhabi)

- General-purpose 7B–180B LLM family developed by Technology Innovation Institute in Abu Dhabi — not economics-specialized but trained on high-quality multilingual web data with reasonable economic text coverage
- Its GCC origin is politically and commercially relevant: TII actively partners with Gulf government entities, making a supported deployment more accessible than a comparable Western open-source model
- At 180B scale, Falcon has sufficient capacity to handle complex cross-sector economic reasoning when grounded via RAG in the client's actual data
- No formal enterprise support structure — TII engagement is project-based and partnership-driven rather than a standard commercial license
- Worth pursuing as a **GCC government-to-government conversation** with TII rather than a commercial procurement — terms may be significantly more favorable than any Western vendor for a Qatar government entity

---

## Models With Enterprise Availability

> These have commercial licensing, vendor support, SLAs, and viable data confidentiality paths. These are the viable options for a government client handling confidential economic data.

---

### Palmyra-Fin (Writer Inc.)

- Purpose-built finance and economics LLM — trained on economic reports, regulatory filings, policy documents, financial analysis, and sector commentary — the only domain-specific economic model on this list with a genuine enterprise offering
- Designed for tasks directly relevant to this use case: economic report generation, sector analysis narration, regulatory and policy document Q&A, and cross-indicator synthesis
- **Writer On-Prem deployment option** means the model runs entirely within the client's infrastructure in Doha — confidential economic data (pre-publication statistics, budget working documents, internal sector forecasts) never touches an external server
- Comes with enterprise SLAs, dedicated support, and data processing agreements — the commercial infrastructure a government client procurement requires
- **Arabic language support is unconfirmed** — this is the critical qualification question before recommending it; must be verified directly with Writer's enterprise team
- If Arabic is confirmed, this becomes the strongest single-vendor answer to the economic DLM question for this engagement

---

### Jais (MBZUAI / G42 — Abu Dhabi)

- Arabic-English bilingual LLM developed by Mohamed bin Zayed University of AI and G42 — the most capable Arabic-first model available in the GCC, trained on Arabic news, government publications, web content, and cultural text
- For a Qatar government entity where leadership and sector documents may be Arabic-primary, Jais provides materially better Arabic economic terminology handling than any Western model
- G42's enterprise arm offers deployment services across the Gulf — a GCC government-to-GCC AI partnership conversation is commercially and politically more natural than procuring from a US or European vendor
- Not trained on economics specifically — requires a **supervised fine-tuning step** on macroeconomic Arabic instruction data (IMF Article IVs in Arabic, Qatar Planning Ministry publications, QCB Arabic bulletins) to reach the depth of economic reasoning this use case demands
- Self-hostable on client infrastructure once fine-tuned — full data confidentiality combined with the Arabic language quality advantage
- **Recommended path if Arabic-primary response quality is a hard client requirement**

---

### Gemini 1.5 Pro / 2.0 (Google — Enterprise)

- Frontier model with strong economic reasoning capability — handles cross-sector analysis, indicator interpretation, policy narrative generation, and forward-looking commentary when grounded in retrieved economic data via RAG
- Hosted on **Google Cloud's Doha region** — the only hyperscaler option that physically keeps government economic data within Qatar's borders without requiring on-premise infrastructure
- Understands Arabic well and can produce bilingual economic analysis (Arabic and English) with consistent quality — relevant for reports intended for both leadership and international audiences
- Google Cloud enterprise agreement includes data processing addendum, no model training on customer data, and public sector SLAs — meets government procurement requirements
- Does not require fine-tuning for economic tasks if the RAG pipeline is well-engineered — the model's general economic knowledge combined with retrieved client data is sufficient for sector Q&A, trend narration, and forecast contextualization
- **Fastest path to a production-ready economic assistant** with sovereign data handling — no ML engineering investment required beyond building the RAG pipeline

---

### GPT-4o (OpenAI via Azure Enterprise)

- Frontier model with deep economics coverage in training data — handles macroeconomic concepts, sector classification frameworks (ISIC, NACE), fiscal policy analysis, trade balance decomposition, and cross-indicator reasoning natively
- Available under **Azure OpenAI enterprise agreements** with contractual commitments that data is not used for model training and does not leave the contracted Azure region — satisfies government data confidentiality requirements at the API level
- No Qatar Azure region exists; nearest is UAE North — data residency gap that must be addressed contractually before recommending to a Qatar government client
- If the client is already in the Microsoft 365 ecosystem (highly likely for a Qatar government entity), GPT-4o as the underlying model in a Copilot Studio deployment is a natural fit — the platform and model layer come from the same vendor with unified governance
- Strong Arabic support — handles both Modern Standard Arabic and Gulf-register Arabic better than most alternatives
- **Best positioned as the model layer if Microsoft is selected as the conversational platform**

---

### Mistral Large (Mistral AI — Enterprise)

- Strong general-purpose frontier model with particularly good coverage of European economic institutions, fiscal frameworks, and policy documents — relevant given the IMF, World Bank, and EU economic policy text in its training data
- One of the few models that offers both an **enterprise API** (EU-hosted, with formal DPAs and SLAs) and **fully self-hostable commercial weights** — the client can start on the managed API and migrate to on-premise if data sensitivity requirements tighten
- Self-hosted deployment under enterprise license keeps all confidential economic data within client infrastructure while retaining vendor support and SLA coverage
- Moderate Arabic support — sufficient for bilingual RAG retrieval but weaker than GPT-4o or Gemini for Arabic-primary economic report generation
- Good candidate for a **hybrid architecture**: Mistral Large handling English-language economic analysis and document processing, with Jais handling Arabic-language query understanding and response generation

---

### Llama 3.3 70B (via IBM watsonx / Azure AI / AWS Bedrock — Enterprise)

- Meta does not sell enterprise support directly, but Llama 3.3 70B is available as an enterprise-supported model through IBM watsonx, Azure AI Studio, and AWS Bedrock — each providing SLAs, data confidentiality guarantees, and vendor support
- At 70B parameters it has the strongest open-model economic reasoning capability available — handles complex multi-step questions such as comparing the growth trajectory of Qatar's manufacturing sector against financial services since 2018 and assessing alignment with QNV 2030 targets
- If **IBM watsonx is selected as the platform** (the on-premise recommendation from the vendor research), Llama 3.3 70B running within watsonx on client infrastructure is a fully sovereign, enterprise-backed economic reasoning model with zero external data dependency
- Can be fine-tuned on the client's macroeconomic corpus under the IBM enterprise agreement — combining enterprise support with the ability to specialize the model on Qatar-specific economic data over time
- **Best long-term flexibility**: open weights mean no vendor lock-in on the model layer even if the enterprise platform changes in the future

---

## Summary Table

| Model | Enterprise | On-Prem Option | Arabic | Macro-Economic Fit |
|---|---|---|---|---|
| BloombergGPT | No — inaccessible | — | No | Highest — finance + macro trained |
| FinGPT | No | Self-host, no support | Limited | Moderate — finance primary |
| FinBERT | No | Self-host, no support | No | Low — classifier/retrieval only |
| FinMA | No | Self-host, no support | No | Moderate — benchmark value only |
| FinTral | No | Self-host, no support | Limited | Moderate + table and chart reading |
| Falcon | No formal enterprise | Self-host, TII partnership | Moderate | Low — general purpose, GCC origin |
| **Palmyra-Fin** | **Yes** | **Yes — Writer On-Prem** | **Unconfirmed** | **High — economics trained** |
| **Jais** | **Yes — G42 enterprise** | **Yes — self-hostable** | **Excellent** | **Low — needs fine-tuning** |
| **Gemini 1.5 Pro / 2.0** | **Yes — Google Cloud** | **No — Doha cloud region** | **Strong** | **High with RAG** |
| **GPT-4o** | **Yes — Azure enterprise** | **No — UAE region** | **Strong** | **High with RAG** |
| **Mistral Large** | **Yes — API + self-host** | **Yes — commercial license** | **Moderate** | **High with RAG** |
| **Llama 3.3 70B** | **Yes — via IBM / Azure / AWS** | **Yes — via IBM watsonx** | **Moderate** | **High with RAG** |

---

## Key Questions to Resolve Before Model Selection

### On the Client's Data
- What economic datasets does the client own — sector national accounts, employment by sector, trade statistics, budget execution, price indices?
- Are datasets structured (tables, databases) or unstructured (PDF reports, Word documents)? Mixed datasets require a more sophisticated retrieval architecture
- What languages are the source documents in — Arabic only, English only, or bilingual? This directly determines whether Jais is necessary or whether a multilingual model suffices
- Does the client publish internal economic analysis — sector outlooks, annual reviews, policy briefs? These are the ideal fine-tuning and RAG corpus

### On the Use Case Scope
- Which economic sectors must the assistant cover? Qatar's economy spans hydrocarbons, financial services, real estate, construction, tourism, manufacturing, and QNV 2030 diversification sectors
- What question types are in scope — descriptive, comparative, analytical, forecasting, or policy-impact simulation? Each requires progressively more model capability; policy simulation is the hardest
- Is forecasting expected to be model-generated, or should the assistant narrate and contextualize official forecasts from trusted sources such as IMF Article IVs, QCB projections, and Planning Ministry data? The latter is significantly safer for a government deployment
- Is cross-dataset reasoning a core feature or a stretch goal? Connecting labor data to GDP data to trade data in a single response requires multi-agent orchestration, not just standard RAG

### On Deployment Constraints
- Is there internal ML engineering capacity at the client or at EY for this engagement? Fine-tuning and custom RAG pipeline work requires ML engineers, not platform configurators — if not, the recommendation must default to managed API options
- What is the sensitivity classification of the data the assistant will access? Pre-publication statistics or budget working documents may rule out any API-based option entirely
- What is the acceptable response latency? Large models on-premise require significant GPU infrastructure; smaller fine-tuned models run faster on less hardware

---

## Recommended Paths by Scenario

| Scenario | Recommended Model | Rationale |
|---|---|---|
| Fastest to deploy, data sovereign in Qatar | Gemini 1.5 Pro — Google Cloud Doha | Sovereign, managed, no fine-tuning needed, strong Arabic |
| On-premise, strongest Arabic response quality | Jais fine-tuned on economic instruction data | Arabic-first, GCC-origin, G42 enterprise support |
| On-premise, strongest economic reasoning | Llama 3.3 70B via IBM watsonx | Best open-model reasoning, IBM enterprise backing, fully sovereign |
| Custom domain model, lower infrastructure cost | FinTral or Mistral-7B fine-tuned on macro corpus | 7B size reduces GPU cost; table and chart reading adds value |
| Purpose-built economics model, enterprise supported | Palmyra-Fin — Writer On-Prem | Only enterprise economics DLM; pending Arabic qualification |
| Microsoft ecosystem already in use | GPT-4o via Azure / Copilot Studio | Unified platform and model governance; strong Arabic |

---

*Research compiled April 2026. Model landscape is evolving rapidly — any selection should be validated against the latest HuggingFace Open LLM Leaderboard, Arabic LLM benchmarks, and financial and economic NLP benchmark results at the time of implementation. All open-source models referenced are available via HuggingFace; enterprise models require direct vendor engagement.*
