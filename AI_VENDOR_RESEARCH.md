# AI Chatbot Vendor Research
**Prepared for:** EY Internal — Client AI Use Case Assessment
**Client Context:** Government Economic Entity, Doha, Qatar
**Use Case:** Complex leadership-facing conversational AI assistant
**Research Focus:** Which vendors can realistically implement this use case — covering platform capability, implementation model, regional delivery partners, and local deployment

---

## Background and Research Objective

The client is a government economic entity based in Doha, Qatar. The use case is a sophisticated conversational AI assistant intended for leadership — meaning it must handle complex, multi-turn dialogue, connect to internal data sources (reports, dashboards, policy documents), respond with high accuracy, support Arabic, and meet strict security and data governance requirements.

The goal of this research is not simply to identify which vendors sell chatbot licenses. It is to identify **which vendors can actually deliver this use case** in Doha — factoring in the complexity of the chatbot, the availability of local implementation partners, the deployment model, and any constraints around data sovereignty. Licensing and pricing are included to inform commercial discussions but are not the primary lens.

I reviewed: **Infobip**, **Twilio**, **Salesforce (Agentforce)**, **Microsoft Copilot Studio**, **IBM watsonx Assistant**, **Google Cloud CCAI / Dialogflow CX**, **Kore.ai**, **Genesys**, **Cognigy**, and **Yellow.ai**.

> **Important Clarification — "Cequence":** Cequence was listed as a vendor to evaluate in the initial briefing. Upon research, **Cequence Security** ([cequence.ai](https://www.cequence.ai)) is an API security and bot *protection* company — their products cover API threat management and AI gateway security. They do not build or implement chatbots. This is likely a naming mix-up; the intended vendor may be **Genesys** or **Cognigy**, both of which are assessed below. Recommend confirming with the manager before any client-facing discussion.

---

## What "Implementing This Use Case" Requires

Before reviewing vendors, it is worth being explicit about what this use case demands from an implementation standpoint. A leadership-facing chatbot for a government economic entity is not a standard FAQ bot. Based on the use case description, the implementation will likely require:

- **Deep data integration** — connecting to internal systems (reports, economic data, policy documents, dashboards) so the bot can retrieve and reason over live or near-live information
- **RAG (Retrieval-Augmented Generation)** — the ability to ground LLM responses in the client's own documents and databases, rather than relying on generic model knowledge
- **Arabic language support** — both Modern Standard Arabic and potentially Gulf dialect understanding
- **Multi-turn, complex dialog management** — leadership users will ask layered, context-dependent questions rather than simple single queries
- **Access control and audit logging** — leadership use implies the system must know who is asking what, and maintain a full log for governance
- **High availability and resilience** — a leadership tool cannot have downtime
- **In-country or private deployment** — given the government entity context, data sovereignty is a mandatory constraint, not a preference

Any vendor shortlist should be evaluated against all of these requirements, not just the platform features.

---

## Vendor 1 — Infobip

**Category:** Communications Platform + Conversational AI
**Products:** Answers (chatbot builder), AgentOS (agentic AI suite)
**Website:** https://www.infobip.com/conversational-ai-platform
**Pricing:** https://www.infobip.com/agentos/pricing

### What the Platform Does

Infobip is primarily a cloud communications platform (CPaaS) that has expanded into conversational AI through its AgentOS product line. The platform allows enterprises to build chatbots and AI-driven engagement flows across channels including WhatsApp, SMS, voice, and web. The chatbot builder is low-code and suited for structured conversation flows and customer service automation.

### Can It Handle This Use Case?

Infobip's strength is in customer-facing, channel-heavy communication workflows — think omnichannel messaging, notifications, and transactional bots. It is not designed or marketed for complex leadership-facing assistants requiring deep data integration, RAG over internal documents, or sophisticated reasoning. There is no documented case study of Infobip being used in a context resembling a senior executive AI assistant. The platform handles volume well but not depth.

### Implementation Model

Infobip is primarily a self-serve or partner-assisted model. There is no large professional services arm. Implementations are delivered either by Infobip's internal onboarding team for standard configurations, or by regional communication technology partners for more complex setups. They do not publish a named SI partner network equivalent to Microsoft, IBM, or Google.

### Regional Delivery and Data Residency

Infobip opened a sovereign data center in **Saudi Arabia (Riyadh)** in 2024, targeting government, finance, and healthcare organizations. **No Qatar-specific data center has been announced.** A Doha-based government client would have data processed outside Qatar's borders under the current infrastructure.

Sources:
- https://www.middleeastainews.com/p/infobip-opens-sovereign-data-centre
- https://intlbm.com/2026/03/06/infobip-launches-its-in-kingdom-data-centre-to-boost-saudi-arabias-ai-ecosystem/

### Licensing

Consumption-based pricing tied to conversation and message volume. Enterprise tiers require direct sales engagement. No public pricing for government or complex AI deployments.

### Overall Assessment

Infobip is not a strong fit for this use case. The platform is well suited to high-volume customer communication workflows, but it lacks the depth required for a complex leadership assistant with data integration and reasoning requirements. The absence of a Qatar data center compounds the risk. This vendor would be more relevant if the use case were expanded to include mass citizen communication or omnichannel messaging, rather than a precision tool for leadership.

---

## Vendor 2 — Twilio

**Category:** Developer-first CPaaS + Contact Center AI
**Products:** Twilio Flex, Twilio AI Assistants
**Website:** https://www.twilio.com/docs/flex/ai

### What the Platform Does

Twilio is a developer-focused communications API platform. Flex is their programmable contact center product, and their AI layer includes Agent Copilot features (post-call summaries, sentiment analysis) and AI Assistants that can be embedded in conversation flows. Building anything non-trivial on Twilio requires significant custom development work.

### Can It Handle This Use Case?

Technically, a sufficiently skilled engineering team could build almost anything on Twilio's API layer. However, this would be a custom build — not a platform implementation. There are no out-of-the-box leadership chatbot templates, no RAG integration framework, and no government-sector deployment models. Twilio requires developers to construct the AI logic themselves using external LLMs and custom integration code. This makes it high-effort, high-risk, and slow to implement for a complex use case with a government client.

### Implementation Model

Twilio is entirely developer-led. There is no Twilio professional services team that delivers chatbot implementations. The client or their SI must supply all engineering resources. This means EY or a third-party development firm would be responsible for the entire build on top of Twilio's APIs — a significant scope that goes well beyond vendor pairing.

### Regional Delivery and Data Residency

Twilio is cloud-only, hosted on AWS. There is no Middle East or Qatar cloud region, no sovereign deployment option, and no government-specific infrastructure model. All data processes through Twilio's international cloud.

### Licensing

Twilio Flex charges $1/hour per active user for contact center use. AI Assistant features are priced separately on a consumption basis.

### Overall Assessment

Not recommended for this engagement. Twilio is a developer toolkit, not an enterprise AI platform. It would require EY to effectively build the chatbot from scratch, and there is no path to in-country deployment in Qatar. The effort, risk, and data sovereignty gaps disqualify it for a government entity use case at this complexity level.

---

## Vendor 3 — Salesforce (Agentforce / Einstein AI)

**Category:** CRM + Agentic AI Platform
**Products:** Agentforce for Public Sector, Einstein AI, Data Cloud
**Website:** https://www.salesforce.com/news/stories/agentforce-for-public-sector-announcement/
**Pricing:** https://salesforce.com/government/pricing-routing
**Licensing Guide:** https://redresscompliance.com/salesforce-agentforce-licensing-guide-2026.html

### What the Platform Does

Salesforce launched Agentforce for Public Sector in August 2025 as a dedicated government AI product. It allows agencies to deploy custom AI agents that reason across Salesforce-managed data to handle complex tasks. The platform runs on the Salesforce CRM infrastructure with Einstein AI and is built around trusted, auditable agent interactions grounded in the organization's own data via Data Cloud.

### Can It Handle This Use Case?

Agentforce is technically capable of handling a complex leadership assistant — particularly if the client already has structured data in a Salesforce CRM or Data Cloud environment. The platform supports multi-step reasoning, data retrieval, and conversation grounding. However, a critical finding from 2026 implementation data is that **approximately 70% of Agentforce projects face delays due to data readiness challenges**. The platform's intelligence depends heavily on clean, unified data architecture. If the client's data is spread across disconnected systems (common for government entities), significant pre-work is required before the chatbot itself can be built.

### Implementation Model

Agentforce implementations are delivered by Salesforce-certified SI partners. A standard production deployment takes approximately **15 weeks** with a team of four specialists (AI specialist, developer, project manager, product designer). The primary bottleneck is data curation and architecture, not the chatbot configuration itself.

### Regional Delivery Partners

**ConX Digital** is the most relevant implementation partner for this engagement. They are a Salesforce Summit Partner (highest tier) and Platinum Partner operating across UAE, Saudi Arabia, Qatar, Bahrain, Oman, and Iraq. They hold 41+ certified experts, 165+ Salesforce certifications, and were named Digital Partner of the Year in both 2024 and 2025. They specialize in Data Cloud and Agentforce implementations.

Source: https://appexchange.salesforce.com/appxConsultingListingDetail?listingId=ae59b4d6-451a-433f-8de0-87e07084b67a

In Qatar specifically, the **Communications Regulatory Authority (CRA)** and **QRDI Council** signed an agreement in February 2026 to deploy a generative AI chatbot on Salesforce technology — a direct precedent for government deployment in-country.

Source: https://www.telecompaper.com/news/qatars-cra-adopts-ai-service-bot-in-pilot-with-qrdi-council--1561282

### Data Residency

Salesforce has no Qatar-local cloud region. Data processes on Salesforce's international infrastructure (EU or US regions). The GovCloud option is US-hosted and designed for US federal agencies. For a Qatari government client, this is a significant gap unless Salesforce can provide contractual data residency commitments.

### Licensing

Agentforce for Public Sector costs approximately **$700/user/month** billed annually, with additional per-conversation pricing at **$2 per conversation** and Flex Credits at $500 per 100,000 credits. The platform requires Sales Cloud or Service Cloud at Enterprise Edition or higher as a prerequisite — meaning organizations without an existing Salesforce footprint face a substantial baseline investment before Agentforce becomes accessible.

### Overall Assessment

Salesforce has real implementation momentum in Qatar and a capable regional SI in ConX Digital. However, it is only appropriate if the client already has a Salesforce CRM investment or is willing to adopt one. The data readiness burden is significant, the per-user licensing cost is high, and there is no Qatar-local cloud region. Best suited as a recommendation if the client's existing technology stack includes Salesforce or if Data Cloud integration is already part of a broader digital transformation initiative.

---

## Vendor 4 — Microsoft Copilot Studio

**Category:** Low-code Conversational AI / Enterprise AI Agents
**Products:** Copilot Studio, Microsoft 365 Copilot, Azure AI
**Website:** https://learn.microsoft.com/en-us/microsoft-copilot-studio/geo-data-residency-security
**Qatar Government Programme:** https://windowsforum.com/threads/qatar-scales-microsoft-copilot-in-government-with-training-and-governance.392296/

### What the Platform Does

Microsoft Copilot Studio is a low-code platform for building custom AI agents that operate within the Microsoft ecosystem — integrating natively with Teams, SharePoint, Dynamics 365, OneDrive, and Microsoft 365. Agents can be no-code configured or extended with custom code via Power Platform connectors and Azure services. The platform uses Azure OpenAI (GPT-4 class models) as its reasoning backbone, with RAG built in through SharePoint and Dataverse connectors. For a leadership chatbot connected to internal reports and documents stored in SharePoint or Teams, this is a direct native integration requiring minimal custom engineering.

### Can It Handle This Use Case?

Yes — this is one of the stronger fits for the complexity described. Copilot Studio natively supports:
- RAG over SharePoint documents and organizational knowledge bases (no custom data pipeline needed if content is in M365)
- Multi-turn, context-aware dialogue using GPT-4 class models
- Role-based access control tied to the organization's existing Azure Active Directory
- Audit logging through Microsoft Purview
- Arabic language support through Azure AI language services
- Integration with Dynamics 365, Power BI, and external APIs through connectors

The platform is designed precisely for the kind of internal, data-grounded assistant this use case describes.

### Implementation Model

Microsoft Copilot Studio is implemented by Microsoft-certified partners. The local partner ecosystem in Doha is well-established. Typical enterprise deployment timelines range from **4 to 10 weeks** depending on complexity:
- Simple pilot (1 week): 3–5 users, basic agent setup
- Multi-department (4–6 weeks): 10–20 users, 5–10 custom agents, ERP/CRM integration
- Enterprise rollout (6–10 weeks): 10+ advanced agents, full governance, enterprise system integration

For a complex leadership assistant with deep data integration and governance requirements, 8–12 weeks is a realistic target.

### Regional Delivery Partners in Doha

**Qatar Datamation Systems (QDS)** — Certified Microsoft partner in Doha offering a 4-week Copilot implementation engagement from approximately $5,000. Covers assessment, technical readiness, phased deployment, and post-implementation support.
Source: https://appsource.microsoft.com/en-us/marketplace/consulting-services/qatar-datamation-systems.qdscopilot

**Team Academy (Doha)** — Provides Microsoft Copilot implementation and consulting with structured packages up to enterprise-scale rollouts, including compliance frameworks (ISO 27001) and governance setup.
Source: https://teamacademy.qa/products/microsoft-copilot-implementation-consulting

In addition, global SIs including EY itself operates a significant Microsoft practice — this is relevant because EY could serve as the implementation partner directly, rather than subcontracting to a local firm.

### Qatar Government Partnership

Qatar's MCIT launched the "Adopt Microsoft Copilot" national programme in 2025, scaling AI agent deployment across government entities through the Qatar Digital Academy and a formal AI governance council. An AI Agent Factory was established in partnership with Microsoft to modernize government services. This is the most direct institutional precedent for this use case in Qatar.

Sources:
- https://longbridge.com/en/news/275224186
- https://windowsforum.com/threads/qatar-scales-microsoft-copilot-in-government-with-training-and-governance.392296/

### Data Residency

Microsoft does not have an Azure data center inside Qatar. The nearest region is **UAE North (Abu Dhabi)**. Microsoft announced in-country data processing for Microsoft 365 Copilot across 15 countries by end of 2026 — the UAE is included but Qatar is not listed. However, the depth of Qatar's government partnership with Microsoft suggests this gap may be commercially addressable. EY should raise this directly with Microsoft's Public Sector team in the region.

Source: https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/04/microsoft-offers-in-country-data-processing-to-15-countries-to-strengthen-sovereign-controls-for-microsoft-365-copilot/

### Licensing

Microsoft 365 E3 (~$36/user/month) or E5 is the typical baseline. Copilot Studio is an add-on priced per tenant per month with per-message charges at scale. Licensing costs are generally lower per user than Salesforce, and the platform scales across a large user base on a single tenant subscription. Government-specific licensing tiers exist though they are currently US-oriented.

### Overall Assessment

Microsoft is the strongest recommendation if the client operates within the Microsoft 365 ecosystem (highly likely for a Qatar government entity). The combination of native RAG over M365 content, a direct Qatar government AI programme, an active Doha SI partner ecosystem, and EY's own Microsoft practice makes this the most practical and fastest path to delivery. The data residency situation is the primary open item and should be formally addressed with Microsoft before presenting to the client.

---

## Vendor 5 — IBM watsonx Assistant

**Category:** Enterprise Conversational AI + AI Orchestration
**Products:** watsonx Assistant, watsonx Orchestrate
**Website:** https://www.ibm.com/products/watsonx-assistant/government
**Pricing:** https://ibm.com/products/watsonx-orchestrate/pricing

### What the Platform Does

IBM watsonx Assistant is IBM's enterprise conversational AI platform, designed for complex, multi-turn dialogue in regulated industries. The platform supports intent recognition, entity extraction, dialog flow management, and RAG integration via watsonx.data and enterprise document connectors. watsonx Orchestrate extends this into multi-agent orchestration, where AI can coordinate tasks across multiple backend systems — directly relevant for a leadership assistant that needs to pull from various data sources simultaneously.

### Can It Handle This Use Case?

Yes — IBM watsonx is specifically engineered for high-complexity, regulated enterprise deployments. Key capabilities relevant to this use case:
- **RAG with enterprise data**: watsonx can be connected to internal document repositories, structured databases, and APIs. IBM provides a native document ingestion and retrieval pipeline.
- **Multi-agent orchestration**: watsonx Orchestrate can route queries to specialized agents (e.g., one for economic reports, one for policy documents, one for HR data) and synthesize responses — a strong architectural fit for a leadership tool accessing diverse data sources.
- **On-premise deployment**: The entire platform can be self-hosted on the client's own infrastructure in Doha with no external cloud dependency. This is a genuine full deployment, not a containerized SaaS wrapper.
- **Access control and audit**: Enterprise-grade RBAC and audit logging built in.

### Implementation Model

IBM watsonx deployments are delivered by IBM's own Global Business Services (GBS) team or by certified IBM Business Partners. For complex government implementations, IBM GBS often leads the engagement with local partners supporting delivery. IBM has a long track record of managing complex, multi-year government AI programmes globally.

### Regional Delivery Partners in Doha

Three IBM-certified partners with Qatar-based operations were identified:

**Qatar Business Systems (QBS)** — 16 years of SI experience in Qatar, described as one of the most experienced IBM Security implementers in the country. Locally-based certified engineers covering watsonx Orchestrate, watsonx.ai, watsonx.data, and watsonx.governance.
Source: https://www.ibm.com/partnerplus/directory/company/7900

**BIT Advanced Technology (BATEC)** — Silver IBM Partner Plus member based in Doha. Consulting and implementation services with resale authorization for watsonx.ai, watsonx Orchestrate, and watsonx.data.
Source: https://www.ibm.com/partnerplus/directory/company/8904

**malomatia** — A Qatari digital transformation company founded in 2008 with deep government sector relationships. IBM-certified for watsonx Orchestrate and managed services. Malomatia is also a Google Cloud partner (see Vendor 6), making them a dual-platform implementer in the Qatar market.
Source: https://www.ibm.com/partnerplus/directory/company/8160

A recent ME-region example: IBM and **Elsewedy Electric** advanced enterprise-scale agentic AI using watsonx across operations, supply chain, HR, finance, and legal — with over 10 use cases in advanced delivery. This mirrors the data integration breadth this use case demands.
Source: https://www.intelligentcio.com/me/2026/04/01/elsewedy-electric-and-ibm-advance-enterprise-scale-agentic-ai-adoption-using-watsonx-portfolio/

### Government Credentials

IBM expanded its FedRAMP portfolio in April 2026 to include 11 watsonx solutions (watsonx Assistant, Orchestrate, and others). While FedRAMP is a US federal certification, it reflects the depth of IBM's investment in government-grade security architecture. IBM has government AI deployments across multiple GCC countries.

Source: https://www.prnewswire.com/news-releases/ibm-expands-fedramp-portfolio-with-authorization-of-11-software-solutions-including-watsonx-302730758.html

### Data Residency

IBM's on-premise deployment model fully resolves the data sovereignty question. The client hosts watsonx on their own infrastructure in Doha — no data leaves the building. For a government entity with strict sovereignty requirements, this is the cleanest technical answer available. IBM Cloud and AWS hosting options also exist for clients who prefer managed infrastructure.

### Licensing

Annual subscription model, structured around monthly active users and interaction volume. A Standard Subscription offers a promotional 30% discount on initial annual commitment. Enterprise pricing is negotiated directly. The on-premise deployment carries additional infrastructure and professional services costs compared to cloud tiers.

### Overall Assessment

IBM watsonx is the strongest recommendation where the client demands full on-premise control in Doha with no external cloud dependency. The platform is technically capable of handling the full complexity of this use case — multi-agent orchestration, RAG over internal data, enterprise governance. The local SI ecosystem in Qatar (QBS, BATEC, malomatia) provides a credible delivery foundation. The primary risk is implementation timeline and cost for a fully on-premise deployment, which is typically longer and more resource-intensive than cloud-based alternatives. EY should engage IBM GBS directly to understand whether they would co-deliver or hand off to a local partner.

---

## Vendor 6 — Google Cloud CCAI / Dialogflow CX

**Category:** Conversational AI + Contact Center AI
**Products:** Dialogflow CX, CCAI Platform, Vertex AI Conversation (Gemini)
**Website:** https://docs.cloud.google.com/contact-center/ccai-platform/docs
**Qatar Partnership:** https://www.zawya.com/en/press-release/companies-news/google-cloud-and-mcit-qatar-forge-renewed-strategic-alliance-at-mwc-doha-dcgv30cv

### What the Platform Does

Google Cloud's conversational AI stack combines **Dialogflow CX** (structured dialog management) with **Vertex AI Conversation** (Gemini-powered generative AI). CCAI Platform integrates these with Speech-to-Text, Text-to-Speech, and Agent Assist for full contact center deployments. For a leadership chatbot, the relevant architecture is Dialogflow CX for conversation flow control, grounded by Gemini through Vertex AI with RAG over internal documents stored in Google Cloud Storage or a connected knowledge base.

### Can It Handle This Use Case?

Yes — Google's stack is technically robust for this use case. Specific capabilities relevant here:
- **Gemini integration via Vertex AI**: Generative responses grounded in the organization's documents using Google's native RAG framework (Vertex AI Search and Conversation)
- **Dialogflow CX**: Handles complex, multi-turn conversations with conditional branching, parameter capture, and context management
- **Arabic NLU**: Google Cloud Natural Language and Speech APIs support Arabic, and Dialogflow CX supports Arabic as a primary language
- **Security**: Data Loss Prevention APIs, VPC Service Controls, and Customer-Managed Encryption Keys (CMEK) available for sensitive government deployments
- **In-country hosting**: All of the above can run on the Google Cloud **Doha region** — this is the only hyperscaler option that physically keeps data within Qatar

### Implementation Model

Google Cloud implementations are delivered by Google's Professional Services team or by Google Cloud Partners. Google typically co-sells with a regional SI for government accounts. The CCAI Platform specifically requires Google Cloud Partner involvement for enterprise deployment — it is not a self-serve product.

### Regional Delivery Partners in Doha

**malomatia** — Qatar's leading Google Cloud partner for AI and digital transformation. In December 2025, malomatia announced a strategic collaboration with Google Cloud covering Vertex AI, Gemini Enterprise, and Dialogflow CX deployments across government, healthcare, energy, and education in Qatar. They provide knowledge transfer, talent development, and full delivery capability for the Qatar National Vision 2030 initiative.
Source: https://www.malomatia.com/news/malomatia-partners-with-google-cloud-to-accelerate-national-ai-innovation-and-digital-transformation-in-qatar/

**Ooredoo Qatar** — Qatar's national telco became the first Middle East operator to offer Google Cloud CCAI as a managed service, meaning enterprise and government customers can procure CCAI through Ooredoo with local operational support.
Source: https://www.ooredoo.qa/web/en/press-release/ooredoo-sends-top-level-delegation-on-visit-to-google-cloud-headquarters-in-usa-as-new-collaboration-to-enhance-business-customer-experience/

**Servion** (UAE-based, regional coverage) — Specialized Google CCAI implementation partner with documented Dialogflow CX deployments across the Middle East.
Source: https://servion.com/ae/google-ccai-solutions/

### Qatar Government Relationship

Google Cloud and Qatar's MCIT signed a renewed Master Framework Agreement at MWC Doha, covering AI, digital transformation, cybersecurity, and data analytics under Qatar National Vision 2030. Google Cloud already serves government ministries and enterprises through the Doha region. This is a strategic government relationship, not a commercial sales relationship — it carries meaningful weight in procurement conversations.

### Data Residency

Google Cloud's Doha region is the definitive answer to data sovereignty for this engagement. Data processed through Dialogflow CX, Vertex AI, and CCAI Platform on the Doha region stays within Qatar's borders. This is the cleanest, most technically verifiable solution to the data residency requirement — the client does not need to rely on contractual commitments or geographic routing agreements. The infrastructure physically exists in Qatar.

### Licensing

Dialogflow CX: approximately **$0.007 per text session request**, **$0.06 per voice minute** at standard rates. Vertex AI Conversation and CCAI Platform pricing is separate and typically negotiated as part of enterprise Google Cloud agreements. Committed use discounts and MCIT strategic partnership terms may unlock preferential pricing for this client.

### Overall Assessment

Google Cloud is the top recommendation for data sovereignty. A Gemini-powered Dialogflow CX assistant, hosted in the Google Cloud Doha region and implemented by malomatia (or co-delivered with EY's Google practice), is technically sound, strategically aligned with Qatar government policy, and physically in-country. The main consideration is whether EY has a Google Cloud practice that can lead this engagement, and whether the client's preference is cloud-based (Google-managed, Doha-hosted) versus truly on-premise (IBM/Kore.ai). If cloud in Doha is acceptable, this is the strongest recommendation on this list.

---

## Vendor 7 — Kore.ai

**Category:** Enterprise Conversational AI Platform
**Products:** XO Platform, SmartAssist, AgentAssist
**Website:** https://rfi.kore.ai/
**ME Partner:** https://squareonemea.com/partners/kore-ai/
**Government Solutions:** https://www.carahsoft.com/kore-ai/solutions

### What the Platform Does

Kore.ai's XO (Experience Optimization) Platform is a purpose-built enterprise conversational AI platform covering the full lifecycle of building, training, testing, deploying, and managing AI-powered virtual assistants. It blends generative AI (LLM integration) with structured conversational AI through a low-code interface. The platform supports 30+ voice and digital channels, 100+ languages including Arabic, and is built around an enterprise-grade multi-engine NLP architecture for handling complex intent and context.

### Can It Handle This Use Case?

Yes — Kore.ai is specifically positioned for complex enterprise AI assistants, not simple FAQ bots. Relevant capabilities:
- **LLM-powered RAG**: Kore.ai integrates with external LLMs (OpenAI, Azure OpenAI, AWS Bedrock, others) and provides a native RAG framework for grounding responses in organizational knowledge bases
- **Multi-turn dialog management**: The XO Platform's dialog task framework handles conditional branching, slot-filling, and multi-step reasoning
- **Enterprise integrations**: Pre-built connectors for Salesforce, SAP, ServiceNow, and custom API integration for internal data sources
- **Private cloud deployment**: The platform can be deployed on customer-owned infrastructure — a genuine on-premise option for government clients
- **Arabic language support**: Confirmed multi-language support including Arabic
- **Proven enterprise complexity**: 400+ enterprise implementations including Pfizer, Morgan Stanley, Citibank. Average reported ROI of 600%.

### Implementation Model

Kore.ai offers a combination of platform-guided self-deployment (for technical teams) and professional services delivery through their SI partner network. For complex government implementations, the engagement is typically partner-led with Kore.ai's professional services team providing oversight and LLM configuration support.

### Regional Delivery Partners

**SquareOne** (UAE/KSA) — Kore.ai's named regional partner in the Middle East covering UAE and Saudi Arabia. While not based in Doha, SquareOne has worked on enterprise deployments in the GCC. A Doha-based implementation would likely be executed by SquareOne with on-site delivery.

No Doha-specific Kore.ai partner was identified. This is a risk — the delivery partner would be traveling in rather than locally based. EY could itself serve as the SI for a Kore.ai deployment, which is worth exploring given the platform's openness to partner-led delivery.

Source: https://www.kore.ai/customer-stories/emea-bank-reimagines-banking-journeys

### Data Residency

Kore.ai supports private cloud deployment on customer-owned infrastructure. This means the platform can be deployed inside the client's own Doha data center — fully air-gapped if required. This is a strong differentiator for government clients needing complete control over where their data lives.

### Licensing

Session and interaction-based pricing with enterprise volume agreements. Middle East enterprise pricing is negotiated through SquareOne. Private cloud deployment carries additional infrastructure and professional services costs on top of the platform license.

### Overall Assessment

Kore.ai is technically one of the strongest fits for this use case. The platform handles enterprise complexity well, supports Arabic, offers genuine private cloud deployment, and has a documented Middle East banking deployment at scale. The gap is the implementation partner ecosystem in Doha — there is no locally-based Kore.ai partner. EY positioning itself as the primary SI for a Kore.ai deployment would address this but requires internal capability development. A proof of concept is the recommended next step.

---

## Vendor 8 — Genesys Cloud CX

**Category:** Cloud Contact Center + Conversational AI
**Products:** Genesys Cloud CX, AI Studio, Virtual Agent
**Website:** https://genesys.com/company/newsroom/announcements/genesys-announces-first-middle-east-genesys-cloud-cx-region-in-the-united-arab-emirates
**Arabic AI Expansion:** https://www.intelligentcio.com/me/2025/10/15/genesys-expands-agentic-ai-capabilities-to-the-middle-east-with-arabic-support-for-genesys-cloud-ai-studio/

### What the Platform Does

Genesys is one of the leading enterprise contact center platforms globally. Genesys Cloud CX has expanded into AI-native territory with an AI Studio for building virtual agents and automating self-service flows. Arabic language support was added to Genesys AI Studio in October 2025. Their strength is omnichannel contact center operations — voice, chat, email, and social — with AI layered on top for automation and agent assistance.

### Can It Handle This Use Case?

Partially. Genesys can build a conversational AI layer, but the platform is architecturally designed around contact center operations — routing, queuing, agent workload management, and customer service automation. A leadership-facing internal assistant is not a contact center use case. Genesys does not natively support the kind of internal knowledge base RAG, multi-agent data orchestration, or sensitive internal document integration that a leadership chatbot requires. Adapting Genesys to this use case would involve significant custom development work that the platform was not designed to support.

### Implementation Model

Genesys is implemented through a network of certified contact center technology partners. The regional ME presence is anchored in the UAE (Dubai Health Authority deployment). Implementation typically requires a Genesys-certified contact center SI.

### Regional Delivery and Data Residency

Genesys launched its first Middle East cloud region in the **UAE** in 2023. A Saudi Arabia region is planned for end of 2026. **No Qatar cloud region has been announced.** Data from a Doha client would route to the UAE region.

Sources:
- https://www.qatarnews.net/news/278182214/dubai-health-becomes-first-government-entity-in-middle-east-to-leverage-ai-powered-genesys-system
- https://menafn.com/1110715211/Full-Service-Genesys-Cloud-Region-In-Saudi-Arabia-To-Accelerate-AI-Adoption

### Licensing

Per-seat and usage model bundled into Agent, Voice, and Digital tiers. Enterprise agreements available. Pricing is higher than pure-play chatbot platforms given the full contact center suite bundled in.

### Overall Assessment

Genesys is not a good fit for the described use case. The platform is purpose-built for contact center operations, not internal leadership tools. The absence of a Qatar cloud region adds a data residency concern on top of the use case mismatch. Genesys becomes relevant only if the client's vision expands to include a citizen-facing or employee service center deployment alongside the leadership assistant — in which case it could handle the broader contact center layer while a different platform handles the leadership chatbot specifically.

---

## Vendor 9 — Cognigy

**Category:** Enterprise Conversational AI
**Products:** Cognigy.AI, Cognigy Voice Gateway
**Website:** https://docs.cognigy.com/ai/administer/installation/about

### What the Platform Does

Cognigy is a German-founded enterprise conversational AI platform with a strong European enterprise reputation. Cognigy.AI supports voice and digital channels, integrates with SAP, Salesforce, and ServiceNow, and includes both no-code and developer tools for complex conversation flows. It was historically positioned as a strong on-premise option for enterprises needing full infrastructure control.

### Can It Handle This Use Case?

The platform itself is technically capable of complex enterprise conversational AI. However, the critical issue is what Cognigy recently changed about their deployment model.

### Critical Deployment Update

Cognigy has **discontinued on-premise installations for new customers**. Existing customers on on-premise deployments continue to be supported, but new organizations can no longer purchase an on-premise license. Cognigy now operates as a managed SaaS platform only for new deployments.

Source: https://docs.cognigy.com/ai/administer/installation/about

There is no Middle East cloud region identified, no documented Qatar or GCC government deployment, and no named regional implementation partner found. For a new Doha-based government client, this creates two simultaneous blockers: no local deployment option and no regional implementation track record.

### Overall Assessment

**Not recommended.** The on-premise discontinuation is a hard blocker for a Qatari government entity requiring local deployment. Cognigy would need to be re-evaluated if the client's posture changes to accept SaaS hosting outside Qatar — but even then, the lack of Middle East presence and government track record in the region makes it a weaker option than IBM, Google, or Microsoft. Clarification is still needed from the manager on whether Cognigy was the intended vendor in the original briefing.

---

## Vendor 10 — Yellow.ai

**Category:** Conversational AI / Customer Experience Automation
**Products:** Dynamic AI Agents
**Website:** https://old.yellow.ai/government-psu-chatbots/
**GCC Partner:** https://www.zawya.com/uae/en/story/amp/ZAWYA20220209070807/

### What the Platform Does

Yellow.ai is a conversational AI platform focused on customer service automation and employee engagement. Their Dynamic AI Agents handle multi-turn conversations across WhatsApp, web, and voice. They have a dedicated government sector focus with documented deployments in citizen engagement, service booking, complaint handling, and document filing.

### Can It Handle This Use Case?

Yellow.ai is optimized for citizen-facing or employee self-service use cases — high-volume, relatively structured interactions. The platform's strength is scale and channel breadth. A complex leadership assistant requiring sophisticated data integration, multi-source RAG, and high-accuracy reasoning over internal organizational knowledge is a different and more demanding challenge than what Yellow.ai's typical government deployments demonstrate. No documented leadership-level or executive assistant implementation was found.

### Implementation Model

Yellow.ai is implemented through regional SI partners. In the GCC, their primary partner is **Raqmiyat** (UAE/KSA-based system integrator). No Doha-specific implementation partner was identified.

### Regional Delivery and Data Residency

Yellow.ai served over 222,000 unique users for UAE government clients with 13 million messages and a CSAT of 4.56/5. This demonstrates platform reliability at government scale. However, Yellow.ai is cloud-only with no Qatar infrastructure identified — data would process outside Qatar for a Doha client.

Source: https://gecnewswire.com/yellow-ai-serves-222000-unique-users-in-uae-government-services-over-13m-messages/

### Overall Assessment

Yellow.ai has solid UAE government credentials and is viable for a citizen-facing or employee service chatbot. For a complex leadership assistant with deep data integration requirements in Doha, it is not the right tool — the use case complexity and the data residency gap both work against it. If the engagement scope expands to include a wider government service chatbot layer (separate from the leadership tool), Yellow.ai could be reconsidered for that specific component.

---

## Consolidated Assessment

### Implementation Readiness for This Use Case

| Vendor | Can Implement This Use Case? | In-Qatar Deployment | Doha-Based Delivery Partner | Estimated Timeline |
|---|---|---|---|---|
| **Google Cloud CCAI** | Yes — full complexity fit | Google Cloud Doha region | malomatia (Qatar), Ooredoo | 8–14 weeks |
| **Microsoft Copilot Studio** | Yes — best fit if M365 in use | UAE region (Qatar MCIT partnership) | QDS, Team Academy, EY MS practice | 6–12 weeks |
| **IBM watsonx** | Yes — on-prem, full complexity | On-premise in client's Doha DC | QBS, BATEC, malomatia | 12–20 weeks |
| **Kore.ai** | Yes — technically strong | Private cloud in client infra | SquareOne (UAE, travel-in) | 10–16 weeks |
| **Salesforce Agentforce** | Yes — if CRM footprint exists | No Qatar region | ConX Digital (Qatar office) | 15+ weeks |
| **Genesys** | Partially — contact center fit only | UAE region only | UAE-based SIs | 10–16 weeks |
| **Yellow.ai** | Partially — citizen-facing only | UAE/KSA only | Raqmiyat (UAE) | 6–10 weeks |
| **Infobip** | No — wrong complexity tier | KSA only | No named Doha partner | N/A |
| **Twilio** | No — requires full custom build | No regional infra | None (developer-only) | N/A |
| **Cognigy** | No — on-prem discontinued | No ME region | No regional partner | N/A |
| **Cequence** | N/A — API security vendor | N/A | N/A | N/A |

### Data Sovereignty vs. Implementation Complexity Trade-off

| Vendor | Data Sovereignty | Implementation Complexity Handled | Trade-off |
|---|---|---|---|
| Google Cloud CCAI | Best (Doha region) | High | Best balance for cloud-tolerant client |
| IBM watsonx | Best (true on-prem) | High | Longer delivery, higher infra cost |
| Microsoft Copilot Studio | Good (UAE, contractual) | High (native M365 RAG) | Best if M365 ecosystem exists |
| Kore.ai | Good (private cloud) | High | Weak Doha delivery partner ecosystem |
| Salesforce Agentforce | Poor (no Qatar region) | Medium-High (data readiness risk) | Only viable with existing SF investment |
| Others | Poor | Low-Medium | Deprioritize |

---

## EY Shortlist Recommendation

### Tier 1 — Present to Client

**Google Cloud CCAI / Dialogflow CX + Vertex AI (Gemini)**
The only vendor with a live Doha cloud region, a formal Qatar government strategic alliance, and a named local implementation partner (malomatia). A Gemini-powered Dialogflow CX agent hosted in the Google Cloud Doha region is technically capable of the full use case, physically in-country, and strategically aligned with Qatar's national digital agenda. EY should confirm its own Google Cloud practice capability before positioning this as the primary recommendation.

**Microsoft Copilot Studio + Azure AI**
Qatar's government has made an institutional commitment to Microsoft Copilot at ministerial level. If the client organization is in the Microsoft 365 ecosystem (the most likely scenario for a government entity), Copilot Studio offers the fastest time to value with the least custom engineering — native RAG over SharePoint, Teams, and Dynamics 365 is built-in. EY's Microsoft practice could directly deliver this engagement without subcontracting. The data residency gap (UAE vs. Qatar) should be formally raised with Microsoft's public sector team before client presentation.

**IBM watsonx Assistant + Orchestrate**
The definitive recommendation if the client requires zero cloud dependency and full on-premise control of data in Doha. IBM has three named implementation partners in Qatar (QBS, BATEC, malomatia), FedRAMP authorization, and a proven multi-agent orchestration architecture suitable for the data integration complexity this use case demands. Delivery is longer and more infrastructure-intensive, but the sovereignty position is unmatched.

### Tier 2 — Include in RFI

**Kore.ai**
Technically strong, private cloud capable, Arabic-confirmed, and proven at scale in the ME banking sector. The gap is a thin Doha delivery partner ecosystem. EY taking the SI role directly on a Kore.ai implementation is worth exploring as it would give EY more control over the delivery and differentiate the engagement.

### Deprioritize

- **Salesforce**: Only viable if the client already has a Salesforce investment. Licensing prerequisites and data readiness burden make greenfield expensive and slow.
- **Genesys**: Contact center architecture, wrong use case fit, no Qatar region.
- **Yellow.ai / Infobip**: Not the right complexity tier for a leadership assistant.
- **Twilio**: Requires a full custom build with no government model. Not appropriate.
- **Cognigy**: On-premise discontinued. Hard blocker for new customers.
- **Cequence**: Not a chatbot vendor.

---

## Open Items and Next Steps for EY

1. **Clarify "Cequence"** — Confirm with manager which vendor was intended. Most likely Genesys or Cognigy. Both are assessed above.
2. **Determine client's data posture** — Does the client accept cloud in-country (Google Doha region), nearest region cloud (Microsoft, UAE), or require full on-premise (IBM/Kore.ai)? This single question narrows the shortlist significantly.
3. **Confirm client's existing technology stack** — If Microsoft 365 is already in use, Copilot Studio is the fastest path. If the client has Salesforce CRM, Agentforce becomes relevant. Existing footprint changes the recommendation.
4. **Identify EY's internal practice capabilities** — Which of Google Cloud, Microsoft, or IBM does EY have an active delivery practice for? EY's own SI capability should factor into the recommendation — positioning EY as the implementation partner is a commercial opportunity.
5. **Engage Microsoft Public Sector Qatar** — Given the MCIT national programme, Microsoft may have a pre-negotiated government framework in Qatar that EY can leverage for a faster procurement path.
6. **Engage Google Cloud Qatar** — Confirm CCAI and Vertex AI availability and enterprise pricing within the Doha region. Malomatia should be contacted as the in-country delivery partner.
7. **Engage IBM Qatar (QBS / malomatia)** — For the on-premise scenario, confirm implementation timelines, infrastructure requirements, and whether IBM GBS would co-lead the engagement.
8. **Define use case scope precisely** — The leadership chatbot complexity must be defined before vendor selection is finalized. Key questions: What internal data sources must the chatbot access? Will it be Arabic-primary or bilingual? How many concurrent leadership users? What are the SLA requirements for uptime and response accuracy?

---

*Research conducted April 2026. Sources linked inline throughout. All vendor information should be verified directly with vendor sales and public sector teams before presenting to the client.*
