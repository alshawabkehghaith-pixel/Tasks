## How Ethical AI Principles Are Applied Across the AI Lifecycle Gates

---

### Principle 1 — Accountability

Accountability ensures that every AI output has a named human owner at every stage of 
the lifecycle. No decision produced or informed by an AI system is ownerless — a 
responsible individual must be identifiable, reachable, and answerable for it. 
Accountability is not established at deployment; it is defined at design and maintained 
continuously through the system's operational life.

---

**Gate 2 — AI Solution Design**

Accountability structures must be established before the system is built. Without named 
owners and defined governance at design stage, accountability defaults to whoever is most 
available rather than whoever is most responsible.

1. Assign a named AI Owner, Model Owner, and Data Owner. Each carries distinct 
   obligations: the AI Owner is accountable for the system's outcomes and use; the 
   Model Owner for its technical behaviour; the Data Owner for data quality, 
   classification, and permissibility.
2. Define the RACI and approval authority for each lifecycle gate, including who holds 
   the authority to block deployment if ethical requirements are not met.
3. Establish the AI Ethics governance structure — the body or officer responsible for 
   independent review at each gate, with formal independence from the delivery team.
4. Document that no AI output will trigger an autonomous external-facing action — 
   publishing, filing, sending — without an explicit human approval step built into 
   the workflow.

---

**Gate 3 — AI Solution Development**

At the development stage, accountability means creating a traceable record of the 
decisions made in building the system. Every significant technical choice must be 
attributed to a named decision-maker, and the system must enforce oversight through 
its architecture — not rely on it as a post-deployment policy.

1. Maintain a development decision log capturing key choices — algorithm selection, 
   threshold settings, data inclusion or exclusion — with the reasoning behind each 
   and the name of the person accountable for it.
2. Enforce version control on all model artefacts so that any output produced by the 
   system can be traced back to the exact model state that produced it.
3. Build Accept / Reject / Override controls into the system UI for every AI 
   recommendation. Override actions must be logged with a mandatory reason field 
   and the reviewer's identity.

---

**Gate 4 — Pre-Deployment Review and Approval**

Gate 4 is a formal accountability checkpoint. Sign-off here is not a formality — each 
owner is confirming that their domain of responsibility meets the framework's requirements 
before the system is authorised for production use.

1. Obtain documented sign-off from the AI Owner, Model Owner, Data Owner, and the 
   AI Ethics governance body. Each confirms their respective obligations have been met.
2. Verify that a complete and unbroken audit trail exists from Gate 2 to this point: 
   design decisions, development decisions, test results, and approval records. Gaps 
   in the trail are a gate-blocking finding.
3. Confirm that no system function can publish, send, or file any output to an 
   external-facing channel without explicit human approval — test this in UAT.

---

**Gate 5 — Go-Live and Monitoring**

Go-live does not transfer accountability to an operations team. Named owners remain 
accountable, and the Decision Classification Matrix transitions from a design document 
to an operational one with active individuals responsible for each output class.

1. Confirm that named owners are active and reachable for each output class from 
   day one of production.
2. Define incident ownership before go-live: who owns an AI-related incident — a 
   biased output, a data breach, a reliability failure — must be established in 
   advance, not determined at the time of the incident.
3. Audit override log activity in the first monthly review to confirm the 
   no-autonomous-action rule is being enforced in production.

---
---

### Principle 2 — Data Protection

Data protection ensures that all data used by an AI system — including documents, 
datasets, and any derived representations such as vector embeddings — is handled 
lawfully, classified appropriately, and kept within authorised boundaries. For AI 
systems operating on sensitive government data, data protection is not a compliance 
checkbox but a foundational architectural requirement that shapes every component 
of the system.

---

**Gate 2 — AI Solution Design**

Data protection at the design stage means establishing the rules and constraints that 
govern data handling before any pipeline is built. Classification level drives 
infrastructure requirements, access controls, and permissible processing — all of which 
must be designed in from the start.

1. Classify every proposed data source before the ingestion architecture is designed. 
   Classification level determines what infrastructure is required, what encryption 
   standards apply, and who can access derived outputs.
2. Document the lawful basis for processing each data type. For government data, 
   confirm the legal authority for AI processing exists. For personal data, confirm 
   the basis under applicable data protection legislation.
3. Define the anonymisation and data minimisation approach: specify which fields 
   require masking or removal before ingestion, and enforce the principle that only 
   data necessary for the AI's stated function should enter the pipeline.
4. Design vector store isolation: physically or logically separate stores for each 
   classification level must be specified in the technical design before development begins.

---

**Gate 3 — AI Solution Development**

At the development stage, data protection controls are implemented and verified. The 
standard is not that controls were planned — it is that they are built, tested, and 
evidenced.

1. Implement document classification tagging in the ingestion pipeline. Every document 
   entering the system must be tagged with its classification level before it reaches 
   the processing layer.
2. Implement encryption at rest and in transit for all components handling sensitive 
   data. Verify these are functioning as specified — not assumed by infrastructure defaults.
3. Enforce classification-level isolation at the retrieval layer: a lower-clearance 
   user must not be able to access content derived from a higher-classification source.
4. Build data lineage records for every document ingested: source location, 
   classification level, ingestion date, and destination store.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, data protection controls are independently verified under production-equivalent 
conditions. Formal authorisation for processing sensitive documents must be obtained 
before any classified content enters the production system.

1. Verify encryption at rest and in transit for all components handling sensitive data. 
   Confirm that no sensitive content is routed to any external service or infrastructure 
   outside approved boundaries — this is a pass/fail gate requirement.
2. Test classification-level access controls with synthetic queries: confirm that a 
   lower-clearance user cannot receive an output informed by higher-classification content.
3. Confirm data usage for every source is consistent with the permissions documented 
   at Gate 2. Obtain formal written authorisation for processing sensitive documents 
   before the production system goes live.

---

**Gate 5 — Go-Live and Monitoring**

In production, data protection moves from implementation verification to continuous 
enforcement. Access patterns, routing, and data usage must be monitored on a recurring 
basis — not assumed to be correct because they passed Gate 4.

1. Implement scheduled checks to confirm that data access patterns remain consistent 
   with the permissions defined at Gate 2. Any anomaly triggers an immediate alert and 
   investigation.
2. Maintain active breach detection covering AI-specific vectors: unauthorised access 
   to stored data or embeddings, bulk retrieval behaviour, and inference patterns that 
   may indicate an attempt to extract sensitive content.
3. Apply the data retention and disposal schedule for AI outputs and inference logs 
   from day one of production in accordance with applicable retention requirements.

---
---

### Principle 3 — Reliability

Reliability ensures that an AI system performs consistently and predictably within its 
intended scope. An unreliable system — one that performs well in testing but degrades 
in production, or that behaves differently across similar inputs — cannot be safely 
used to inform decisions. Reliability is defined at design stage, evidenced during 
development, and actively maintained through the system's operational life.

---

**Gate 2 — AI Solution Design**

Reliability at the design stage means setting measurable standards the system must meet 
before it can be deployed. Without defined thresholds, Gate 4 has no objective basis on 
which to approve or reject the system.

1. Define performance KPIs — accuracy, latency, and availability — as acceptance 
   criteria in the design document. Thresholds should reflect the decision type the 
   system supports: policy-level outputs require a higher reliability bar than 
   operational queries.
2. Define failure modes and fallback behaviour: specify how the system responds when 
   it cannot produce a reliable output — whether that is a low-confidence flag, an 
   escalation to a human reviewer, or a safe null response.
3. Specify the model versioning strategy and define the rollback procedure, including 
   a target recovery time for rollback to the previous stable version.

---

**Gate 3 — AI Solution Development**

At the development stage, reliability is validated against the acceptance criteria set 
at Gate 2. Testing must go beyond normal-use scenarios to cover the conditions most 
likely to cause failure in production.

1. Run performance validation under normal conditions, high load, and edge cases. 
   Document results against the acceptance criteria defined at Gate 2.
2. Test failure modes and fallback behaviour: confirm the system responds as designed 
   when it cannot produce a reliable output, and that behaviour is consistent across 
   different failure types.
3. Build and test the rollback procedure during development. Demonstrate that rollback 
   to the previous stable version is executable within the target recovery time.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, reliability is confirmed against the acceptance criteria through independent 
review. KPIs must not only be met — they must be stable across repeated test runs.

1. Review validation test results against all performance acceptance criteria. A system 
   that meets its thresholds inconsistently is not ready for deployment.
2. Run load and stress testing to verify the system performs reliably at expected and 
   peak usage volumes.
3. Test the rollback procedure in the pre-production environment and document the 
   result. Rollback must be a verified capability before go-live is approved.

---

**Gate 5 — Go-Live and Monitoring**

In production, reliability is monitored continuously against the go-live baseline. 
Degradation is expected over time as real-world data distributions shift — the 
obligation is to detect it early and respond through the governance cycle.

1. Track model performance metrics against the go-live baseline from day one. Drift 
   in output distributions or accuracy degradation are early indicators that model 
   behaviour has changed and requires investigation.
2. Define the threshold at which performance degradation triggers a retraining 
   decision. Retraining is not a unilateral technical decision — it requires re-entry 
   into the governance cycle before the updated model is deployed.
3. Include a performance health check in the monthly ethics review so reliability 
   is assessed alongside ethical and compliance obligations.

---
---

### Principle 4 — Security

Security ensures that AI systems are protected against both conventional and 
AI-specific threats. AI systems that process sensitive data face a distinct class 
of risk: adversarial inputs designed to manipulate model behaviour, extract sensitive 
content, or bypass access controls. Security is an architectural obligation — controls 
not designed into the system from the start are either expensive to retrofit or absent 
by the time the system reaches production.

---

**Gate 2 — AI Solution Design**

Security at the design stage means specifying the controls and architecture required 
to protect the system before a single component is built.

1. Define the secure architecture: access controls, encryption at rest and in transit, 
   and isolation requirements between components handling data of different sensitivity levels.
2. Conduct threat modelling covering AI-specific attack surfaces — prompt injection, 
   data poisoning, model inversion, and embedding extraction — and use the outputs to 
   shape security requirements in the technical design.
3. Specify that CVE scanning of all model dependencies and container images will be 
   integrated into the build pipeline, with blocking rules for critical-severity findings.

---

**Gate 3 — AI Solution Development**

At the development stage, security controls defined at Gate 2 are implemented and 
validated. Adversarial testing during development is more effective than testing 
conducted only at pre-deployment — findings can be addressed before they become 
gate-blocking issues.

1. Implement the secure architecture: access controls, encryption, and data store 
   isolation. Verify these are functioning as specified, not assumed by default.
2. Conduct systematic adversarial prompt testing for LLM and RAG components during 
   development. Record the prompts tested, the system's responses, and the 
   mitigations applied.
3. Implement input validation and rate limiting on all inference endpoints. Integrate 
   CVE scanning into the build pipeline and address any critical-severity findings 
   before Gate 4.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, the security review is formal and independent. For systems handling 
sensitive data, penetration testing is a mandatory gate requirement — not an 
optional step that can be deferred.

1. Complete a formal security review covering all pipeline components: access controls, 
   infrastructure configuration, and data routing. All findings must be resolved or 
   formally risk-accepted before go-live.
2. Review CVE scan results and confirm no unresolved critical-severity vulnerabilities 
   are present. For LLM and RAG systems, confirm penetration testing has been completed 
   and results have been reviewed and signed off.
3. Validate that the output filtering layer is active and correctly preventing sensitive 
   content from surfacing in response to adversarial or out-of-scope queries.

---

**Gate 5 — Go-Live and Monitoring**

In production, security monitoring is active and continuous. The controls validated 
at Gate 4 must be confirmed as operational in the live environment, and the 
organisation must be ready to respond to incidents without delay.

1. Maintain active monitoring for AI-specific threats from day one: unusual query 
   patterns, bulk retrieval behaviour, and access anomalies must trigger automated alerts.
2. Maintain a tested incident response protocol — including the authority to 
   temporarily suspend sensitive data retrieval if needed — that can be executed 
   without delay if an adversarial pattern is detected.
3. Schedule recurring CVE scans and conduct a post-go-live security review within 
   30 days to confirm all controls are operating as validated at Gate 4.

---
---

### Principle 5 — Transparency

Transparency ensures that AI systems are open about what they do, how they work, 
and what their limitations are — to the people who use them, oversee them, and are 
affected by them. An AI system that produces outputs without disclosing its basis, 
its confidence, or its constraints undermines the ability of decision-makers to 
exercise informed judgement. Transparency is designed at Gate 2, implemented at 
Gate 3, verified at Gate 4, and maintained throughout the operational life of the system.

---

**Gate 2 — AI Solution Design**

Transparency at the design stage means deciding what the system will disclose about 
itself, to whom, and in what form. These decisions shape the user experience and 
the auditability of every output the system produces.

1. Define the disclosure level for each user type: internal analysts may require 
   full source attribution and model limitations; external-facing outputs require 
   a clear disclosure that AI was used. Specify this in the design document.
2. Produce a system purpose statement documenting what the system is designed to do, 
   what it is not designed to do, and what conditions may cause unreliable outputs. 
   This becomes the foundation of the model documentation produced at Gate 3.
3. Specify inference logging requirements: every query, output, model version, and 
   timestamp must be captured as a functional requirement — not a monitoring add-on.

---

**Gate 3 — AI Solution Development**

At the development stage, transparency is implemented through model documentation, 
source attribution, and inference logging. These are functional components of the 
system, not documentation tasks completed after development.

1. Produce the draft model documentation during development, covering training data 
   provenance, known data limitations, and the assumptions the model relies on.
2. Implement source attribution for systems that retrieve information from a document 
   corpus: every response must identify which sources informed it.
3. Activate inference logging from the start of development testing and verify that 
   logs are complete and accessible before Gate 4 review begins.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, model documentation and user disclosures are finalised and independently 
reviewed. No system may pass Gate 4 without an approved, version-controlled model 
document that accurately reflects the system as built.

1. Publish and version-control the final model documentation. This is a pass/fail 
   gate requirement.
2. Confirm that user disclosures — AI usage, confidence levels, source attribution, 
   known limitations — are accurate, complete, and appropriate for each user type.
3. Verify that inference logging is active and producing complete records in the 
   pre-production environment.

---

**Gate 5 — Go-Live and Monitoring**

In production, transparency is maintained through current model documentation, 
accessible inference logs, and open feedback channels. Users must be clearly 
informed that outputs are AI-generated and must have a way to raise concerns.

1. Update model documentation at least quarterly with current performance metrics, 
   any changes to the data corpus, and any new limitations identified in production.
2. Maintain a feedback channel for users to flag outputs they believe are incorrect, 
   biased, or unexplainable. Feedback must be reviewed regularly and fed into the 
   continuous improvement cycle.
3. Confirm that inference logs remain complete and are retained in accordance with 
   applicable record-keeping requirements.

---
---

### Principle 6 — Explainability

Explainability ensures that AI outputs can be understood by the people who rely on 
them and the people who are responsible for them. An output that cannot be explained 
cannot be effectively challenged, corrected, or audited. The level of explanation 
required varies by stakeholder and by the type of decision the output informs — 
but the obligation to provide it does not.

---

**Gate 2 — AI Solution Design**

Explainability at the design stage requires selecting the right method for the model 
type and defining what level of explanation each stakeholder needs. Both decisions 
have architectural implications and cannot be deferred to development.

1. Select the explainability method appropriate to the model architecture: SHAP or 
   LIME for ML classification and scoring models; citation-backed generation for 
   RAG and LLM systems.
2. Define the required explanation depth per stakeholder type: technical reviewers 
   need feature-level attribution; decision-makers need a plain-language rationale; 
   auditors need a traceable log. The explanation layer must be designed to meet 
   each of these needs.

---

**Gate 3 — AI Solution Development**

At the development stage, the explainability method is integrated as a functional 
output of the system. Explanation must accompany every model response automatically 
— it is not a reporting feature added at the end of development.

1. Integrate the chosen explainability method as part of the standard API response. 
   Explanation outputs must be produced alongside every inference output.
2. Validate explanation outputs with representative users — ideally domain experts 
   or government analysts. Explanations must be accurate (correctly reflecting model 
   behaviour) and interpretable by a non-technical user.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, explanation outputs are validated by business users — not just the technical 
team. The test is whether a non-technical decision-maker can understand and act on 
the explanations the system provides.

1. Have at least one non-technical government analyst or domain expert review a 
   representative sample of explanation outputs and confirm they are accurate and 
   understandable. Record this validation as a gate sign-off item.
2. Confirm that explanation output is present in every API response and in the system 
   UI for every output type — test systematically across all output classifications.

---

**Gate 5 — Go-Live and Monitoring**

In production, explanations must be available at the point of use and logged for 
audit purposes. The quality of explanations must be actively monitored — particularly 
when the model or its data changes.

1. Ensure any user receiving an AI output can access an explanation at the point of 
   interaction, not as a separate support request.
2. Maintain a log of explanation outputs alongside inference records so that the 
   rationale behind any past AI-informed decision can be reconstructed for audit 
   or appeal.
3. If the model is updated or the data corpus changes, re-validate that explanations 
   remain accurate and reflect current model behaviour.

---
---

### Principle 7 — Fairness

Fairness ensures that AI systems do not produce outputs that systematically favour or 
disadvantage any individual, group, sector, or entity. Bias can be introduced through 
training data, document corpus composition, algorithm design, or deployment conditions 
— and can cause real harm to underrepresented or historically disadvantaged groups. 
A fairness-aware approach anticipates bias at design stage rather than discovering it 
after deployment.

---

**Gate 2 — AI Solution Design**

Fairness at the design stage means identifying bias risks before data is assembled and 
establishing the metrics against which the system will be measured. Without defined 
thresholds, bias testing at Gate 3 has no objective standard.

1. Identify the sensitive attributes — sector type, entity size, geographic region, 
   time period — that could introduce bias if underrepresented or over-weighted in 
   training data or the document corpus.
2. Define the fairness metrics relevant to this system and set the acceptable 
   thresholds. Specify which metrics apply to which sensitive attributes and at 
   what point a deviation becomes unacceptable.
3. Design the corpus representativeness requirements: specify the target balance 
   across sectors, entity types, and time periods before data ingestion begins.

---

**Gate 3 — AI Solution Development**

At the development stage, fairness is tested and evidenced against the metrics and 
thresholds defined at Gate 2. Any bias identified must be addressed before the 
system reaches pre-deployment review.

1. Conduct a corpus audit before data ingestion to assess representational balance 
   across all sensitive attributes. Document any known gaps.
2. Run the bias audit using the fairness metrics defined at Gate 2. Test across all 
   sensitive attributes and document results, including any groups where the model 
   falls below the acceptable threshold.
3. Where bias is found, apply mitigations and re-test. Any residual known bias must 
   be documented with a clear statement of what mitigation was applied and what 
   trade-off was accepted.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, bias test results are formally reviewed and accepted by the governance 
body. No deviation beyond the defined thresholds may pass without documented 
justification and formal risk acceptance.

1. Review bias audit results against the thresholds defined at Gate 2. Any metric 
   outside the acceptable range must be resolved before go-live, or documented with 
   a risk acceptance and a remediation timeline.
2. Where fairness trade-offs have been accepted, document these explicitly in the 
   model documentation and obtain sign-off from the governance body. Undisclosed 
   trade-offs are not acceptable.

---

**Gate 5 — Go-Live and Monitoring**

In production, fairness is monitored continuously against real-world output 
distributions. Fairness drift can emerge gradually as data distributions and usage 
patterns change — it must be detected and addressed through the monitoring cycle.

1. Run fairness metrics against live output data on a monthly basis. Production 
   monitoring addresses conditions that test environments cannot fully replicate.
2. Set automated alerts for metric deviations beyond acceptable thresholds. Any 
   triggered alert must be triaged within five business days with a documented 
   root cause and remediation action.
3. If the data corpus is updated, re-run the representativeness assessment before 
   the updated corpus is used to inform significant decisions.

---
---

### Principle 8 — Compliance

Compliance ensures that AI systems are designed, built, and operated in accordance 
with applicable laws, regulations, and standards. For AI systems operating in a 
government context, compliance is not limited to data protection law — it extends 
to cybersecurity frameworks, AI governance standards, and sector-specific obligations. 
Compliance requirements identified late are expensive to address; identified at design 
stage, they shape the system correctly from the start.

---

**Gate 2 — AI Solution Design**

Compliance at the design stage means mapping every applicable obligation to a 
specific design decision before any component is built.

1. Produce a Compliance Requirements Map listing every applicable obligation — 
   Qatar PDPL, QNCSF, ISO/IEC 42001, ISO/IEC 27001, and any sector-specific 
   regulations — and map each requirement to the design decision or control 
   that will satisfy it.
2. Identify whether any planned components are prohibited due to data sovereignty 
   or classification requirements. Resolve these at design stage, not during 
   development.
3. Confirm the lawful authority for AI processing of each data type exists before 
   the pipeline architecture is designed.

---

**Gate 3 — AI Solution Development**

At the development stage, every compliance requirement in the Compliance Requirements 
Map must be implemented and evidenced. This is a development deliverable — not a 
retrospective Gate 4 exercise.

1. For each regulatory requirement, document which code component or configuration 
   satisfies it. Maintain this as a compliance mapping log throughout development.
2. Verify in code that no pipeline component routes sensitive or classified content 
   to any external service or infrastructure outside approved boundaries.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, formal legal and regulatory clearance is obtained. Compliance is confirmed 
through independent review — not assumed from development testing.

1. Conduct a structured compliance review against every requirement in the Compliance 
   Requirements Map. Confirm each is satisfied by the system as built.
2. Obtain formal compliance sign-off from the relevant legal or regulatory authority. 
   This is a gate passage condition — not a best-efforts step.

---

**Gate 5 — Go-Live and Monitoring**

In production, compliance is an active obligation. Regulatory requirements change, 
and the system must continue to meet them throughout its operational life.

1. Conduct scheduled compliance reviews — at minimum quarterly — to confirm the 
   system continues to satisfy all regulatory obligations in its current operational state.
2. Monitor for regulatory changes. Any change to applicable laws or standards triggers 
   a formal compliance review within 30 days and re-entry into the governance cycle 
   at the appropriate stage.
3. Issue a formal annual compliance statement from the AI Ethics governance body 
   confirming the system remains aligned with all applicable requirements.

---
---

### Principle 9 — Human Oversight

Human oversight ensures that consequential decisions informed by AI systems remain 
under meaningful human control. AI systems provide analysis and recommendations — 
they do not make decisions. The degree of oversight required is proportional to the 
significance of the decision: informational outputs require awareness; advisory and 
critical outputs require an explicit human approval step before any action is taken. 
Oversight mechanisms must be built into the system architecture — they cannot be 
enforced through policy alone.

---

**Gate 2 — AI Solution Design**

Human oversight at the design stage means building review checkpoints into the 
system architecture before a single line of code is written.

1. Classify every planned AI output as Informational, Advisory, or Critical. 
   Define the human review requirement for each class and specify the reviewer 
   role and maximum turnaround time for Advisory and Critical outputs.
2. Design Human-in-the-Loop gates as blocking workflow logic for all Advisory 
   and Critical output types — specify the gate position in the workflow and 
   the action required to proceed.
3. Define escalation triggers: the conditions under which a reviewer must escalate 
   rather than resolve independently, including low-confidence outputs, anomalous 
   results, and any output outside the reviewer's authority to act on.

---

**Gate 3 — AI Solution Development**

At the development stage, oversight mechanisms are built as functional, blocking 
constraints — not UI features. The system must be architecturally incapable of 
proceeding past a required review step without a recorded human approval.

1. Build HITL gates as blocking workflow logic: no downstream action is possible 
   without a recorded human approval where one is required.
2. Implement the override log with mandatory reason capture and reviewer identity. 
   Verify the log is accessible to the governance body and internal auditors.
3. Implement the escalation notification mechanism: automated alerts when output 
   confidence falls below threshold or when anomalous behaviour is detected.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, oversight mechanisms are tested with realistic scenarios. The test is 
whether human reviewers can perform their function effectively in the actual system 
— not whether the feature exists.

1. Test all HITL gates with realistic decision scenarios in UAT. Confirm they are 
   genuinely blocking and that override logs capture all required fields.
2. Confirm that reviewer capacity is in place for the live system: sufficient human 
   reviewer time must be allocated before go-live is approved.
3. Confirm that escalation paths are documented and that notification mechanisms 
   are functioning.

---

**Gate 5 — Go-Live and Monitoring**

In production, human oversight is enforced — not assumed. The obligation does not 
diminish as the system gains user familiarity, and HITL gate completion must be 
monitored as an operational metric.

1. Monitor HITL gate completion rates monthly. A decline in review activity may 
   indicate oversight mechanisms are being bypassed and must be investigated.
2. Review the override log monthly to identify patterns that may indicate systematic 
   model errors, user trust issues, or ambiguities in how output types are classified 
   in practice.
3. If reviewer capacity falls below the agreed level, formally document this as an 
   exception with a remediation date — do not silently bypass the oversight requirement.

---
---

### Principle 10 — Monitoring

Monitoring is the mechanism by which all other principles are sustained after 
deployment. An AI system that was ethically sound at go-live can drift — in its 
performance, its fairness, its data handling, or its alignment with changed 
regulatory requirements. Monitoring is not a passive dashboard; it is an active, 
scheduled obligation that surfaces problems before they cause harm and feeds 
findings back into the governance cycle.

---

**Gate 2 — AI Solution Design**

Monitoring at the design stage means specifying the full monitoring architecture as 
part of the system's functional scope. What gets monitored, at what frequency, and 
by whom must be defined before development begins.

1. Define what will be monitored: fairness metrics, model drift, access anomalies, 
   inference performance, and human oversight completion rates.
2. Define monitoring thresholds and alert conditions for each metric: the point at 
   which an automated alert is generated and the response timeframe required.
3. Specify the monitoring schedule: monthly ethics health reviews, quarterly model 
   documentation updates, and an annual ethical impact review. Assign these as 
   operational obligations, not optional reporting.

---

**Gate 3 — AI Solution Development**

At the development stage, monitoring infrastructure is built and tested alongside the 
AI system itself. Monitoring must be producing data before pre-deployment testing begins 
— it is not an operational add-on activated after go-live.

1. Build the monitoring dashboards specified at Gate 2: fairness metrics, model drift 
   detection, access anomaly monitoring, and inference performance tracking.
2. Implement automated alert generation for all defined threshold breaches. Test each 
   alert type to confirm it reaches the correct recipient within the required timeframe.
3. Verify that all monitoring components are functioning correctly before Gate 4 review.

---

**Gate 4 — Pre-Deployment Review and Approval**

At Gate 4, monitoring is confirmed as active and correctly configured. Monitoring 
must be live at the moment of deployment — not activated afterward.

1. Confirm all monitoring dashboards are active in the production environment before 
   go-live is approved.
2. Run test alerts for all alert types and confirm each reaches the correct recipient 
   within the defined response window.
3. Record the monitoring baseline: current fairness metrics, performance benchmarks, 
   and access patterns against which future monitoring reviews will be compared.
4. Confirm that the monthly, quarterly, and annual monitoring schedules are formally 
   assigned to named owners before go-live.

---

**Gate 5 — Go-Live and Monitoring**

In production, monitoring is the primary mechanism that keeps every other principle 
active. Findings from monitoring feed back into the governance cycle — triggering 
re-assessment, remediation, or retraining as required.

1. Issue a monthly Ethics Health Report covering fairness metrics, bias alert status, 
   model drift, access anomaly events, HITL override patterns, and any compliance or 
   security incidents.
2. Conduct a quarterly review covering model documentation updates, override log 
   analysis, and corpus re-assessment where new data has been ingested.
3. Conduct an annual ethical impact review across all ten principles, producing a 
   formal compliance statement confirming the system remains aligned with the framework.
4. Re-enter the governance cycle immediately for any significant trigger event — a 
   material change to the data, a detected adversarial incident, a regulatory change, 
   or a significant shift in how the system is being used in practice.
