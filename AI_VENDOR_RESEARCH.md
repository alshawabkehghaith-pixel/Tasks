# AI Chatbot Vendor Research
**Prepared for:** EY Internal — Client AI Use Case Assessment
**Client Context:** Government Economic Entity, Doha, Qatar
**Use Case:** Complex leadership-facing conversational AI assistant
**Research Focus:** Vendor capabilities, licensing, and local/in-country deployment options in Doha

---

## Background

The client is a government economic entity based in Doha, Qatar, and the use case is a sophisticated conversational AI assistant intended for use by leadership. Given the sensitivity of the end user and the regulatory environment, the primary evaluation criteria are: (1) whether the vendor can deploy within Qatar's borders or as close to them as possible, (2) the availability of on-premise or private cloud deployment options, (3) Arabic language support, and (4) the vendor's track record with government organizations.

I reviewed the following vendors against these criteria: **Infobip**, **Twilio**, **Salesforce (Agentforce)**, **Microsoft Copilot Studio**, **IBM watsonx Assistant**, **Google Cloud CCAI / Dialogflow CX**, **Kore.ai**, **Genesys**, **Cognigy**, and **Yellow.ai**.

> **Important Clarification — "Cequence":** During the initial briefing, Cequence was listed as a vendor to evaluate. Upon research, **Cequence Security** ([cequence.ai](https://www.cequence.ai)) is an API security and bot *protection* company, not a conversational AI or chatbot vendor. Their products cover API threat protection, bot management, and AI gateway security. They do not offer a chatbot builder or conversational AI platform. This likely needs to be clarified with the manager — the intended vendor may have been **Genesys** or **Cognigy**, both of which I have included below.

---

## Vendor 1 — Infobip

**Category:** Communications Platform + Conversational AI
**Products:** Answers (chatbot builder), AgentOS (agentic AI suite)
**Website:** https://www.infobip.com/conversational-ai-platform
**Pricing Page:** https://www.infobip.com/agentos/pricing

### What They Do

Infobip is primarily a cloud communications platform (CPaaS) that has expanded into conversational AI through its **AgentOS** product line. The platform allows enterprises to build chatbots and AI-driven customer engagement flows across multiple channels including WhatsApp, SMS, voice, and web. Their AI offering is marketed as an agentic suite where bots can handle complex multi-step conversations.

### Deployment Model

Infobip is cloud-first and does not offer a traditional on-premise deployment for new customers. Their notable regional move is the launch of a **sovereign data center in Saudi Arabia (Riyadh)** in 2024, which was specifically designed to meet the data residency requirements of government, finance, and healthcare organizations in the Kingdom. The facility ensures that AI workloads stay within Saudi borders with no cross-border data transfer.

As of my research, **no equivalent Qatar-specific data center has been announced**. This means that for a Doha-based government client, data processed through Infobip would likely route through their nearest region, which is the KSA facility or a broader international node — neither of which satisfies strict Qatari data sovereignty requirements.

Sources:
- https://www.middleeastainews.com/p/infobip-opens-sovereign-data-centre
- https://intlbm.com/2026/03/06/infobip-launches-its-in-kingdom-data-centre-to-boost-saudi-arabias-ai-ecosystem/

### Licensing

Infobip uses a consumption-based model tied to the number of conversations, messages, or interactions processed. Enterprise customers negotiate custom volume contracts. Pricing is not publicly listed for enterprise tiers — it requires direct engagement with their sales team. The AgentOS product line has a separate pricing page for its agentic capabilities.

### Assessment for This Use Case

The data center gap is the core issue here. Infobip is relevant and credible for a KSA-based project, but for Doha, there is no clear path to in-country data residency at this time. Unless they commit contractually to routing through the KSA sovereign DC with acceptable cross-border terms, this vendor carries data sovereignty risk for a Qatari government client.

---

## Vendor 2 — Twilio

**Category:** Developer-first CPaaS + Contact Center AI
**Products:** Twilio Flex (contact center), Twilio AI Assistants
**Website:** https://www.twilio.com/docs/flex/ai

### What They Do

Twilio is a developer-focused communications platform that allows organizations to build voice, messaging, and AI-powered applications through APIs. Their **Flex** product is a programmable cloud contact center, and their AI layer includes features like Agent Copilot (post-call summaries, sentiment analysis), Unified Profiles (real-time customer data), and AI Assistants that can be embedded into conversation flows.

### Deployment Model

Twilio is **entirely cloud-based**, hosted on AWS infrastructure. There is no on-premise option and no private cloud deployment model offered to customers. Twilio has voice pricing and telephony support in Qatar, indicating regional service availability, but this is purely network routing — not a local data center. There is no Twilio cloud region in Qatar or the broader GCC area.

### Licensing

Twilio Flex charges per active user per hour ($1/hour) for the contact center product, with additional consumption charges for AI features. AI Assistants are priced separately. There are no public enterprise licensing tiers for government use — contracts are negotiated directly.

### Assessment for This Use Case

Twilio is not a suitable fit for this engagement. The absence of any local deployment option, combined with its developer-first positioning and lack of a government-grade cloud model for the region, makes it unsuitable for a government economic entity in Doha. Twilio's strengths are in commercial CPaaS for tech-forward organizations building custom communication flows, not in regulated government deployments with sovereignty requirements.

---

## Vendor 3 — Salesforce (Agentforce / Einstein AI)

**Category:** CRM + Agentic AI Platform
**Products:** Agentforce for Public Sector, Einstein AI
**Website:** https://www.salesforce.com/news/stories/agentforce-for-public-sector-announcement/
**Pricing:** https://salesforce.com/government/pricing-routing
**Licensing Guide:** https://redresscompliance.com/salesforce-agentforce-licensing-guide-2026.html

### What They Do

Salesforce launched **Agentforce for Public Sector** in August 2025 as a dedicated government AI product. It allows agencies to deploy custom and out-of-the-box AI agents for complex tasks — handling benefit applications, code compliance, service routing, and citizen queries. The platform runs on top of Salesforce's broader CRM infrastructure and Einstein AI layer, with a focus on trusted, auditable AI interactions.

### Regional Activity

Salesforce is actively expanding in the GCC. As of April 2026, Salesforce launched Agentforce integrations across Salesforce Suites throughout the Gulf Cooperation Council, making enterprise-grade AI accessible to smaller organizations at no added cost. In Qatar specifically, the **Communications Regulatory Authority (CRA)** and **QRDI Council** signed a cooperation agreement in February 2026 to deploy a generative AI-powered chatbot built on Salesforce technology for multi-channel consumer engagement. This is a direct precedent for government AI deployment in Qatar.

Sources:
- https://techafricanews.com/2026/04/17/salesforce-launches-agentforce-integration-to-support-sme-digital-transformation-in-gcc/
- https://www.telecompaper.com/news/qatars-cra-adopts-ai-service-bot-in-pilot-with-qrdi-council--1561282
- https://www.envisionsfc.com/blog/salesforce-trends-in-the-middle-east-what-to-expect-in-2026/

### Deployment Model

Salesforce is a SaaS platform. Their **GovCloud** option provides additional compliance controls and isolated infrastructure, but it is hosted in the **United States** and designed for US federal government use. There is no Qatar-local Salesforce cloud region. For a Doha client, data would be processed on Salesforce's standard international cloud infrastructure, likely in the EU or US regions.

### Licensing

Salesforce Agentforce Public Sector pricing is approximately **$700 USD/user/month** billed annually. This applies to both the standard commercial infrastructure tier and the GovCloud tier. There is also per-conversation pricing at **$2 per conversation** for AI agent interactions, plus **Flex Credits** at $500 per 100,000 credits for usage-based consumption. The licensing structure is notably complex — it requires either Sales Cloud or Service Cloud at Enterprise Edition or higher as a prerequisite, meaning organizations without existing Salesforce licenses face substantial baseline investment before Agentforce becomes available.

### Assessment for This Use Case

Salesforce has clear government momentum in Qatar, which is a strong signal. However, the lack of a local Qatar cloud region is a gap, and the licensing prerequisites mean cost can escalate quickly if the client does not already have a Salesforce footprint. Best positioned for a client that already runs Salesforce CRM and wants to extend AI capabilities into a leadership assistant, rather than a greenfield deployment.

---

## Vendor 4 — Microsoft Copilot Studio

**Category:** Low-code Conversational AI / Enterprise AI Agents
**Products:** Copilot Studio (formerly Power Virtual Agents), Microsoft 365 Copilot
**Website:** https://learn.microsoft.com/en-us/microsoft-copilot-studio/geo-data-residency-security
**Qatar Government Programme:** https://windowsforum.com/threads/qatar-scales-microsoft-copilot-in-government-with-training-and-governance.392296/

### What They Do

Microsoft Copilot Studio is a low-code platform for building custom AI agents and chatbots that sit within the Microsoft ecosystem — integrating with Teams, SharePoint, Dynamics 365, and Microsoft 365. It is the successor to Power Virtual Agents and positions itself as the enterprise standard for conversational AI, especially for organizations already invested in the Microsoft stack. Agents can be built with no-code tools or extended with custom code, and they connect to enterprise data sources through Power Platform connectors.

### Qatar Government Partnership

This is where Microsoft stands apart from most other vendors on this list. Qatar's **Ministry of Communications and Information Technology (MCIT)** launched the "Adopt Microsoft Copilot" programme in 2025, embedding Microsoft 365 Copilot into government workflows across the country. MCIT partnered with Microsoft to build an **AI Agent Factory** — a digital platform using AI agents to modernize government services. The programme includes role-based training through the Qatar Digital Academy and a formal governance structure with AI Champions and an AI Council overseeing deployment. A second phase launched in late 2025, scaling beyond the pilot cohort.

This level of institutional buy-in is significant. It means the Qatari government is not just evaluating Microsoft — they are actively deploying and governing it at scale.

Sources:
- https://longbridge.com/en/news/275224186
- https://windowsforum.com/threads/qatar-scales-microsoft-copilot-in-government-with-training-and-governance.392296/

### Deployment Model and Data Residency

Microsoft does not have an Azure data center in Qatar. The nearest committed region is **UAE North (Abu Dhabi)**. In November 2025, Microsoft announced in-country data processing for Microsoft 365 Copilot across 15 countries by end of 2026 — this list includes the **UAE** but **Qatar is not yet included**. However, given the active MCIT partnership and Qatar's role as a strategic government customer, this gap may be addressable through contractual commitments or direct negotiation with Microsoft's public sector team.

Source: https://www.microsoft.com/en-us/microsoft-365/blog/2025/11/04/microsoft-offers-in-country-data-processing-to-15-countries-to-strengthen-sovereign-controls-for-microsoft-365-copilot/

### Licensing

Microsoft Copilot Studio is licensed per tenant per month with additional per-message charges. Microsoft 365 E3 (~$36/user/month) or E5 licenses are the typical baseline, with Copilot Studio as an add-on. For government, Microsoft has specific government licensing tiers (GCC, GCC High) though these are US-focused. The per-conversation cost is generally lower than Salesforce and the platform can scale across many users within a single tenant subscription.

### Assessment for This Use Case

Microsoft is a top-tier recommendation. The Qatar government has made a clear and formal commitment to this platform at the ministerial level, which provides political alignment for any EY engagement. The data residency situation is the primary open item — EY should confirm with Microsoft whether Qatar government data can be committed to the UAE region or whether a Qatar-specific arrangement is possible. For a leadership chatbot inside an organization already using Microsoft 365, this is likely the most defensible and fastest-to-deploy option.

---

## Vendor 5 — IBM watsonx Assistant

**Category:** Enterprise Conversational AI + AI Orchestration
**Products:** watsonx Assistant, watsonx Orchestrate
**Website:** https://www.ibm.com/products/watsonx-assistant/government
**Pricing:** https://ibm.com/products/watsonx-orchestrate/pricing

### What They Do

IBM watsonx Assistant is IBM's enterprise conversational AI platform, designed for complex, multi-turn dialogue in regulated industries. It supports intent recognition, entity extraction, dialog management, and integration with backend enterprise systems. The broader watsonx Orchestrate product extends this into multi-agent orchestration, allowing AI to coordinate tasks across multiple systems — relevant for a leadership assistant that may need to pull from various data sources.

### Deployment Model

IBM's deployment model is the most flexible on this list. watsonx products can be deployed on:
- **IBM Cloud** (managed SaaS)
- **Amazon Web Services** (hosted on AWS infrastructure)
- **Customer-owned on-premise infrastructure** (fully self-hosted)

The on-premise option is a genuine full deployment — not a containerized SaaS wrapper — meaning the client can run the platform entirely within their own data center in Doha with no dependency on any external cloud provider. This is a meaningful differentiator for a government entity with strict data sovereignty requirements.

### Government Credentials

IBM expanded its FedRAMP portfolio in April 2026, adding authorization for 11 watsonx software solutions, including watsonx Assistant and Orchestrate. While FedRAMP is a US federal standard, it signals the depth of IBM's investment in government-grade security controls. IBM has a long history of government AI deployments globally and operates a formal government solutions practice.

Source: https://www.prnewswire.com/news-releases/ibm-expands-fedramp-portfolio-with-authorization-of-11-software-solutions-including-watsonx-302730758.html

### Licensing

IBM uses an annual subscription model. A Standard Subscription offers consumption-based pricing with a notable promotional period offering 30% savings on annual commitment. Enterprise licensing is negotiated directly with IBM and typically structured around number of monthly active users and interaction volume. IBM's regional presence in the Gulf is established, and EY is likely to have an existing relationship with IBM that could facilitate commercial terms.

### Assessment for This Use Case

IBM watsonx is the strongest recommendation for any scenario where the client requires **zero cloud dependency** — full on-premise deployment in a Doha data center. The compliance credentials, enterprise heritage, and hybrid deployment flexibility make it well suited to a government economic entity. The main watch-out is that IBM's regional SI and support ecosystem in Qatar is narrower than Microsoft's or Google's, so delivery risk needs to be managed carefully.

---

## Vendor 6 — Google Cloud CCAI / Dialogflow CX

**Category:** Conversational AI + Contact Center AI
**Products:** Dialogflow CX, CCAI Platform, Vertex AI Conversation
**Website:** https://docs.cloud.google.com/contact-center/ccai-platform/docs
**Qatar Partnership:** https://www.zawya.com/en/press-release/companies-news/google-cloud-and-mcit-qatar-forge-renewed-strategic-alliance-at-mwc-doha-dcgv30cv

### What They Do

Google Cloud's conversational AI stack is built around **Dialogflow CX** for dialog management and the **Contact Center AI (CCAI) Platform** for contact center deployments. CCAI combines Dialogflow, Speech-to-Text, Text-to-Speech, and Agent Assist into a unified platform. More recently, Google has integrated its Gemini models into this stack through **Vertex AI Conversation**, enabling large language model-powered responses within structured conversation flows. For a leadership chatbot, this means combining the precision of dialog management with the generative flexibility of Gemini.

### Qatar Cloud Infrastructure

Google Cloud operates an **active cloud region in Doha, Qatar**. This is unique on this list — Google is the only major hyperscaler with live, in-country infrastructure in Qatar. This means that a Dialogflow CX or CCAI Platform deployment can be hosted entirely within Qatar's borders, satisfying even the most stringent data residency requirements without routing through UAE, EU, or US regions.

Beyond infrastructure, Google Cloud and Qatar's MCIT signed a renewed strategic alliance at **MWC Doha**, covering digital transformation, AI, cybersecurity, and data analytics under the Qatar National Vision 2030 framework. Google Cloud also supports government ministries and enterprises in Qatar directly.

Sources:
- https://www.zawya.com/en/press-release/companies-news/google-cloud-and-mcit-qatar-forge-renewed-strategic-alliance-at-mwc-doha-dcgv30cv

### Deployment Model

Google Cloud is a managed cloud service. The Doha region means data stays in Qatar, but the client is still using Google's cloud infrastructure rather than owning hardware. For organizations that can accept cloud but need geographic residency, this is the cleanest solution. For organizations that require fully air-gapped on-premise deployment, Google Cloud does not address that requirement.

### Licensing

Dialogflow CX pricing is consumption-based: approximately **$0.007 per text interaction** and **$0.06 per voice minute** at standard rates. The CCAI Platform has separate enterprise licensing. Google offers committed use discounts and enterprise agreements for high-volume government deployments. Qatar's MCIT strategic partnership may open preferential commercial arrangements.

### Assessment for This Use Case

Google is the strongest option for **in-country data residency** in Qatar. The live Doha cloud region combined with a formal government partnership makes it the most structurally clean answer to the client's sovereignty requirement. For a leadership chatbot built on Gemini-powered Dialogflow CX, hosted in the Doha region, this is a highly defensible recommendation. The main consideration is whether the client's IT posture accepts cloud-hosted (Google-managed) infrastructure, even if it is physically in Doha.

---

## Vendor 7 — Kore.ai

**Category:** Enterprise Conversational AI Platform
**Products:** XO Platform, SmartAssist, AgentAssist
**Website:** https://rfi.kore.ai/
**ME Partner:** https://squareonemea.com/partners/kore-ai/
**Government Solutions:** https://www.carahsoft.com/kore-ai/solutions

### What They Do

Kore.ai is a purpose-built enterprise conversational AI platform. Their **XO (Experience Optimization) Platform** supports the full lifecycle of building, training, testing, and deploying AI agents across voice and digital channels. SmartAssist is their AI-native Contact Center as a Service offering, and AgentAssist provides real-time support to human agents during live interactions. The platform supports over 100 languages out of the box, including Arabic, and offers a no-code conversation builder as well as developer APIs for custom extensions.

### Deployment Model

Kore.ai explicitly supports **private cloud, hybrid cloud, and public cloud deployment**. For government and regulated enterprise clients, the platform can be deployed on a customer-owned private cloud environment — including on-premise infrastructure — without requiring connectivity back to Kore.ai's SaaS environment for runtime operations. This flexibility is a key differentiator compared to vendors like Cognigy (which discontinued new on-premise licenses) and cloud-only vendors like Twilio.

### Middle East Presence

Kore.ai has an active regional partner in the Middle East through **SquareOne**, a system integrator covering UAE and KSA. A documented case study shows a leading Middle Eastern bank processing over **150,000 daily AI agent conversations** using Kore.ai, with 15–40% high-volume automation and multilingual support in English and Arabic. Government sector deployments are also listed through their partnership with Carahsoft, which distributes Kore.ai to US federal and state governments.

Sources:
- https://www.kore.ai/customer-stories/emea-bank-reimagines-banking-journeys
- https://squareonemea.com/partners/kore-ai/

### Licensing

Kore.ai uses a session and interaction-based pricing model with enterprise volume agreements. Government pricing is available through Carahsoft for US clients; Middle East enterprise pricing would be negotiated directly or through SquareOne. Custom deployment (private cloud) carries additional infrastructure and professional services costs on top of platform licensing.

### Assessment for This Use Case

Kore.ai is a strong technical fit that often gets overlooked relative to the larger platform vendors. The private cloud deployment model directly addresses the sovereignty requirement, the Arabic support is confirmed, and the ME regional presence (even if primarily UAE/KSA-based) demonstrates operational maturity in the region. The main risk is that Kore.ai is less known to Qatari government decision-makers, which could create procurement friction. An EY-led proof of concept could help validate the platform before full commitment.

---

## Vendor 8 — Genesys Cloud CX

**Category:** Cloud Contact Center + Conversational AI
**Products:** Genesys Cloud CX, AI Studio, Virtual Agent
**Website:** https://genesys.com/company/newsroom/announcements/genesys-announces-first-middle-east-genesys-cloud-cx-region-in-the-united-arab-emirates
**Arabic AI Expansion:** https://www.intelligentcio.com/me/2025/10/15/genesys-expands-agentic-ai-capabilities-to-the-middle-east-with-arabic-support-for-genesys-cloud-ai-studio/

### What They Do

Genesys is one of the leading enterprise contact center platforms globally. Their **Genesys Cloud CX** product has expanded into AI-native territory with an **AI Studio** that allows organizations to build virtual agents, automate self-service flows, and layer AI on top of agent-assisted interactions. Their agentic AI expansion into Arabic (announced October 2025) signals a deliberate investment in the Middle East market specifically.

### Middle East Infrastructure

Genesys launched its first Middle East cloud region in the **UAE** in 2023, specifically to allow organizations to keep sensitive data in-region. A full-service cloud region in **Saudi Arabia** is on their roadmap for launch by end of 2026, subject to AWS availability. The **Dubai Health Authority** became the first government entity in the Middle East to go live with Genesys AI — processing over 72,000 digital and voice interactions from January to March 2025, across 96 topics in Arabic and English.

There is **no confirmed Qatar cloud region** for Genesys, and none announced.

Sources:
- https://www.qatarnews.net/news/278182214/dubai-health-becomes-first-government-entity-in-middle-east-to-leverage-ai-powered-genesys-system
- https://menafn.com/1110715211/Full-Service-Genesys-Cloud-Region-In-Saudi-Arabia-To-Accelerate-AI-Adoption

### Licensing

Genesys uses a per-seat and usage model bundled into Agent, Voice, and Digital tiers. Enterprise agreements are available. Their pricing is generally higher than pure-play chatbot platforms given the full contact center suite included.

### Assessment for This Use Case

Genesys is credible in the Middle East and has a documented government deployment in the region. However, it is fundamentally a **contact center platform** — its strength lies in omnichannel agent-assisted service rather than a standalone leadership chatbot. For this use case, the platform may be heavier than needed, and the absence of a Qatar cloud region remains a gap. More relevant if the client's use case expands to include a broader citizen or employee service center in addition to the leadership assistant.

---

## Vendor 9 — Cognigy

**Category:** Enterprise Conversational AI
**Products:** Cognigy.AI, Cognigy Voice Gateway
**Website:** https://docs.cognigy.com/ai/administer/installation/about

### What They Do

Cognigy is a German-founded enterprise conversational AI platform with a strong reputation in Europe and select global deployments. Cognigy.AI supports voice and digital channels, integrates with major enterprise systems (SAP, Salesforce, ServiceNow), and includes both no-code and developer tools for building complex conversation flows. It has historically been positioned as a strong on-premise-capable vendor.

### Critical Deployment Update

As of their current documentation, **Cognigy has discontinued on-premise installations for new customers**. Existing customers on on-premise deployments continue to be supported and receive updates, but new organizations cannot purchase an on-premise license. Cognigy now primarily offers its platform as a **managed SaaS** product.

Source: https://docs.cognigy.com/ai/administer/installation/about

### Regional and Government Considerations

No Middle East-specific cloud region was identified. No documented Qatar or GCC government deployments were found in the research. Cognigy holds SOC 2 Type II and ISO 27001 certifications, which are relevant for enterprise compliance, but do not address Qatari data sovereignty in the absence of local infrastructure.

### Assessment for This Use Case

**Not recommended for this engagement.** The discontinuation of new on-premise licenses is a hard blocker for a Qatari government client requiring local deployment. If the client were purely cloud-tolerant and data residency were not a concern, Cognigy would be a technically capable option — but that scenario does not match this use case. Clarification from the manager is still needed on whether Cognigy was the intended vendor or a different name was meant.

---

## Vendor 10 — Yellow.ai

**Category:** Conversational AI / Customer Experience Automation
**Products:** Dynamic AI Agents
**Website:** https://old.yellow.ai/government-psu-chatbots/
**GCC Partner:** https://www.zawya.com/uae/en/story/amp/ZAWYA20220209070807/

### What They Do

Yellow.ai is a conversational AI platform positioned at the intersection of customer service automation and employee experience. Their **Dynamic AI Agents** handle multi-turn conversations across WhatsApp, web, voice, and other channels. They have a specific focus on government and public sector use cases, with documented deployments in citizen engagement, documentation filing, complaint handling, and service bookings.

### Middle East Government Activity

Yellow.ai has served over **222,000 unique users** for government sector clients in the UAE region, with over 13 million messages processed. In one specific UAE government deployment, over 4,000 users interact daily with their AI agent, achieving 99.7% accuracy and a CSAT of 4.56/5. Their GCC expansion is anchored through a partnership with **Raqmiyat**, a UAE/KSA-based system integrator.

Sources:
- https://gecnewswire.com/yellow-ai-serves-222000-unique-users-in-uae-government-services-over-13m-messages/

### Deployment and Residency

Yellow.ai is a cloud-based platform. No on-premise or private cloud deployment option was confirmed in the research. No Qatar-specific cloud infrastructure was identified. Regional deployments go through their UAE/KSA partner network, meaning data would likely be processed outside Qatar for a Doha-based client.

### Assessment for This Use Case

Yellow.ai has strong UAE government credentials and demonstrates the platform can handle large-scale government deployments in the region. However, the absence of confirmed Qatar infrastructure and no on-premise option means data residency is an open risk. Yellow.ai is more suitable if the client is open to a UAE-hosted cloud deployment, or if the use case is primarily citizen-facing rather than leadership-facing with sensitive data.

---

## Consolidated Assessment

### By Data Residency / Local Deployment

| Vendor | In-Qatar Infrastructure | On-Premise Option | Notes |
|---|---|---|---|
| Google Cloud CCAI | **Yes — Doha region live** | Cloud (in-Qatar) | Only hyperscaler with Qatar data center |
| IBM watsonx | Deployable on client infra | **Yes — full on-prem** | Client owns hardware in Doha |
| Kore.ai | Deployable on client infra | **Yes — private cloud** | Requires internal infra |
| Microsoft Copilot Studio | UAE only (Qatar MCIT partnership) | Cloud-only | Data residency gap vs. active gov partnership |
| Salesforce Agentforce | GCC presence, no Doha region | Cloud-only | Qatar CRA pilot ongoing |
| Genesys | UAE region only | Cloud-only | KSA by end 2026 |
| Infobip | KSA sovereign DC only | Cloud-only | No Qatar DC |
| Yellow.ai | UAE/KSA only | Cloud-only | GCC SI partnership |
| Twilio | No regional infra | Cloud-only | Not government-oriented |
| Cognigy | No ME region | **Discontinued** | Hard blocker |
| Cequence | N/A | N/A | Not a chatbot vendor — API security |

### By Government Suitability

| Vendor | Gov Track Record | Arabic Support | Relevant Qatar Activity |
|---|---|---|---|
| Microsoft Copilot Studio | High | Yes | MCIT national programme active |
| Google Cloud CCAI | High | Yes | MCIT strategic alliance, Doha region |
| IBM watsonx | High | Yes | FedRAMP + global gov deployments |
| Kore.ai | High | Yes | ME bank (150k daily conversations) |
| Salesforce Agentforce | High | Yes | Qatar CRA live pilot |
| Genesys | Moderate | Yes | Dubai Health Authority |
| Yellow.ai | Moderate | Yes | UAE gov (4,000+ daily users) |
| Infobip | Low-Moderate | Yes | KSA sovereign DC |
| Twilio | Low | Limited | No gov focus |
| Cognigy | Moderate | Limited | No ME gov deployments found |

---

## Recommended Shortlist for EY

### Tier 1 — Recommend to Present to Client

**Google Cloud CCAI / Dialogflow CX**
The only vendor with a live, in-country Qatar cloud region. Combined with a formal MCIT strategic partnership, this is the most structurally clean answer to the client's data sovereignty requirement. A Gemini-powered Dialogflow CX agent, hosted in the Google Cloud Doha region, is a highly defensible architecture for a government economic entity.

**Microsoft Copilot Studio**
Qatar's government has already made a formal institutional commitment to Microsoft Copilot at the ministerial level. If the client's organization uses Microsoft 365 (extremely likely for a government entity), Copilot Studio is the path of least resistance and highest political alignment. The data residency gap (UAE vs. Qatar) should be addressed in commercial negotiations with Microsoft's public sector team.

**IBM watsonx Assistant**
The only vendor offering full on-premise deployment, meaning the client can host the entire platform within their own data center in Doha with no external cloud dependency. For a government entity with the highest tier of data sovereignty requirements or limited appetite for any cloud model, IBM is the answer.

### Tier 2 — Include in RFI / Request Demo

**Kore.ai**
Private cloud deployment option, proven Arabic-language deployments at scale in the ME, and flexible architecture for complex use cases. Less brand recognition in Qatar government circles but technically strong. Worth running a proof of concept.

### Deprioritize for This Use Case

- **Salesforce:** Strong if existing CRM footprint exists; otherwise licensing prerequisites make greenfield expensive.
- **Genesys:** Better for contact center expansion than a standalone leadership chatbot.
- **Infobip / Yellow.ai / Twilio:** Cloud-only, no Qatar infra, lower government orientation.
- **Cognigy:** On-premise discontinued — hard blocker.
- **Cequence:** Incorrect vendor category — not a chatbot platform.

---

## Open Items / Follow-Up Actions

1. **Clarify "Cequence"** with manager — likely meant Genesys or Cognigy, both of which are assessed above.
2. **Confirm client's data residency posture** — can they accept in-Qatar cloud (Google), nearest-region cloud (Microsoft/UAE), or do they require full on-premise (IBM/Kore.ai)?
3. **Check existing vendor relationships** — does the client already use Microsoft 365, Salesforce CRM, or any Google Workspace products? Existing footprint significantly changes the recommendation.
4. **Engage Microsoft Public Sector** — given MCIT's national Copilot programme, Microsoft may have a pre-negotiated government framework in Qatar that EY can leverage.
5. **Engage Google Cloud Qatar** — confirm CCAI/Dialogflow CX availability and pricing within the Doha cloud region.
6. **Verify IBM Gulf presence** — confirm whether IBM has a local team in Qatar or Doha that can support a watsonx on-premise delivery.
7. **Leadership chatbot complexity** — the intended users are senior leadership, which implies the chatbot must be highly accurate, possibly connected to internal data sources (reports, dashboards, policy documents), and held to a high standard of response quality. This is relevant for assessing which vendor's LLM stack (Gemini, GPT-4, Llama, etc.) is most suitable.

---

*Research conducted April 2026. Sources linked inline throughout. All vendor information should be verified directly with vendor sales/public sector teams prior to presenting to the client.*
