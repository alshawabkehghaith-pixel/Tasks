## How Ethical AI Principles Are Applied Across the AI Lifecycle Gates

---

### Principle 1 — Accountability

Accountability ensures that every AI output has a named human owner at every stage 
of the lifecycle. No decision produced or informed by an AI system is ownerless — 
a responsible individual must be identifiable, reachable, and answerable for it.

**Gate 2 — AI Solution Design**
Accountability structures must be established before the system is built. Assign a 
named AI Owner, Model Owner, and Data Owner with distinct responsibilities. Define 
the RACI and approval authority for each lifecycle gate, and establish the AI Ethics 
governance body responsible for independent review. Document that no AI output will 
trigger an autonomous external-facing action without an explicit human approval step.

**Gate 3 — AI Solution Development**
Every significant development decision — algorithm selection, threshold settings, 
data choices — must be logged with the name of the person accountable for it. 
Enforce version control on all model artefacts so any output can be traced back to 
the exact model state that produced it. Build Accept / Reject / Override controls 
into the UI, with override actions logged with the reviewer's identity and reasoning.

**Gate 4 — Pre-Deployment Review and Approval**
Obtain documented sign-off from all named owners and the governance body before 
deployment is approved. Verify that a complete audit trail exists from Gate 2 to 
this point — gaps are a gate-blocking finding. Confirm in UAT that no system 
function can trigger an external-facing action without a recorded human approval.

**Gate 5 — Go-Live and Monitoring**
Named owners remain accountable after go-live — this does not transfer to an 
operations team. Define incident ownership before go-live so that who owns an 
AI-related incident is established in advance, not determined at the time of the 
incident. Audit override log activity in the first monthly review.

---

### Principle 2 — Data Protection

Data protection ensures that all data used by an AI system — including documents, 
datasets, and any derived representations — is handled lawfully, classified 
appropriately, and kept within authorised boundaries. For AI systems operating on 
sensitive government data, this is a foundational architectural requirement, not 
a compliance checkbox.

**Gate 2 — AI Solution Design**
Classify every proposed data source before the ingestion architecture is designed — 
classification level determines infrastructure requirements, encryption standards, 
and access controls. Document the lawful basis for processing each data type and 
define the anonymisation and data minimisation approach. Design vector store 
isolation for different classification levels as a technical requirement.

**Gate 3 — AI Solution Development**
Implement classification tagging in the ingestion pipeline, encryption at rest and 
in transit, and classification-level isolation at the retrieval layer. Build data 
lineage records for every ingested document. Verify that no sensitive content routes 
to any external service or infrastructure outside approved boundaries.

**Gate 4 — Pre-Deployment Review and Approval**
Verify encryption and access controls under production-equivalent conditions — this 
is a pass/fail requirement. Test classification-level controls with synthetic queries 
to confirm lower-clearance users cannot access outputs derived from higher-classification 
sources. Obtain formal written authorisation for processing sensitive documents before 
the production system goes live.

**Gate 5 — Go-Live and Monitoring**
Implement scheduled checks to confirm data access patterns remain consistent with 
permissions defined at Gate 2 — any anomaly triggers an immediate alert. Maintain 
active breach detection covering AI-specific vectors. Apply the data retention and 
disposal schedule from day one.

---

### Principle 3 — Reliability

Reliability ensures that an AI system performs consistently and predictably within 
its intended scope. An unreliable system cannot safely inform decisions. Reliability 
is defined at design stage, evidenced during development, and actively maintained 
in production.

**Gate 2 — AI Solution Design**
Define performance KPIs — accuracy, latency, and availability — as acceptance 
criteria in the design document. Thresholds should reflect the decision type: 
policy-level outputs require a higher bar than operational queries. Define failure 
modes, fallback behaviour, and the rollback procedure including a target recovery time.

**Gate 3 — AI Solution Development**
Run performance validation against the Gate 2 acceptance criteria under normal 
conditions, high load, and edge cases. Test failure modes and confirm fallback 
behaviour is consistent across different failure types. Build and test the rollback 
procedure — demonstrate it can be executed within the target recovery time.

**Gate 4 — Pre-Deployment Review and Approval**
KPIs must be met and stable across repeated test runs — inconsistent results are 
not sufficient for approval. Run load and stress testing at expected and peak volumes. 
Test the rollback procedure in the pre-production environment and document the result.

**Gate 5 — Go-Live and Monitoring**
Track performance metrics against the go-live baseline from day one. Define the 
threshold at which degradation triggers a retraining decision — retraining requires 
re-entry into the governance cycle, not a unilateral technical call. Include a 
performance health check in the monthly review.

---

### Principle 4 — Security

Security ensures AI systems are protected against conventional and AI-specific 
threats, including adversarial inputs designed to manipulate model behaviour or 
extract sensitive content. Security is an architectural obligation — controls not 
designed in from the start are difficult to retrofit.

**Gate 2 — AI Solution Design**
Define the secure architecture: access controls, encryption, and component isolation. 
Conduct threat modelling covering AI-specific attack surfaces — prompt injection, 
data poisoning, and embedding extraction — and use the outputs to shape the 
technical design. Specify that CVE scanning will be integrated into the build pipeline.

**Gate 3 — AI Solution Development**
Implement the secure architecture and verify controls are functioning as specified. 
Conduct adversarial prompt testing during development — findings addressed early 
are less costly than gate-blocking issues at pre-deployment. Implement input 
validation, rate limiting, and integrate CVE scanning with blocking rules for 
critical-severity findings.

**Gate 4 — Pre-Deployment Review and Approval**
Complete a formal security review of all pipeline components. For systems handling 
sensitive data, penetration testing is a mandatory gate requirement. Confirm no 
unresolved critical vulnerabilities are present and that the output filtering layer 
is active and correctly configured.

**Gate 5 — Go-Live and Monitoring**
Activate all security monitoring from day one. Maintain a tested incident response 
protocol — including the authority to suspend sensitive data retrieval if needed — 
that can be executed without delay. Schedule recurring CVE scans and conduct a 
post-go-live security review within 30 days.

---

### Principle 5 — Transparency

Transparency ensures that AI systems are open about what they do, how they work, 
and what their limitations are. An AI system that produces outputs without disclosing 
its basis or constraints undermines the ability of decision-makers to exercise 
informed judgement.

**Gate 2 — AI Solution Design**
Define the disclosure level for each user type and produce a system purpose statement 
documenting what the system is and is not designed to do. Specify inference logging 
requirements — query, output, model version, and timestamp — as a functional 
requirement, not a monitoring add-on.

**Gate 3 — AI Solution Development**
Produce the draft model documentation during development covering training data 
provenance, known limitations, and model assumptions. Implement source attribution 
where the system retrieves information from a document corpus. Activate inference 
logging from the start of testing and verify completeness before Gate 4.

**Gate 4 — Pre-Deployment Review and Approval**
Publish and version-control the final model documentation — this is a pass/fail 
gate requirement. Confirm user disclosures are accurate and appropriate for each 
user type. Verify inference logging is producing complete records in the 
pre-production environment.

**Gate 5 — Go-Live and Monitoring**
Update model documentation at least quarterly with current performance metrics and 
any new limitations identified in production. Maintain a user feedback channel for 
flagging incorrect or unexplainable outputs, and ensure feedback is reviewed 
regularly and fed into the improvement cycle.

---

### Principle 6 — Explainability

Explainability ensures that AI outputs can be understood by the people who rely on 
them and the people responsible for them. An output that cannot be explained cannot 
be effectively challenged, corrected, or audited.

**Gate 2 — AI Solution Design**
Select the explainability method appropriate to the model type — SHAP or LIME for 
ML models; citation-backed generation for RAG and LLM systems. Define the required 
explanation depth per stakeholder: feature-level attribution for technical reviewers, 
plain-language rationale for decision-makers, and traceable logs for auditors.

**Gate 3 — AI Solution Development**
Integrate the chosen explainability method as part of the standard API response — 
explanations must accompany every output automatically, not be generated on request. 
Validate explanation outputs with representative users to confirm they are accurate 
and interpretable by non-technical stakeholders.

**Gate 4 — Pre-Deployment Review and Approval**
Have at least one non-technical government analyst review a sample of explanation 
outputs and confirm they are understandable. Record this validation as a gate 
sign-off item. Confirm explanation output is present for every output type across 
all output classifications.

**Gate 5 — Go-Live and Monitoring**
Ensure explanations are accessible at the point of interaction — not as a separate 
support request. Maintain an explanation log so that the rationale behind any past 
AI-informed decision can be reconstructed. Re-validate explanation accuracy whenever 
the model or data corpus changes.

---

### Principle 7 — Fairness

Fairness ensures that AI systems do not produce outputs that systematically favour 
or disadvantage any individual, group, sector, or entity. Bias can be introduced 
through data, algorithm design, or deployment conditions — and a fairness-aware 
approach anticipates it at design stage rather than discovering it after deployment.

**Gate 2 — AI Solution Design**
Identify the sensitive attributes that could introduce bias — sector type, entity 
size, geographic region, time period — and define the fairness metrics and acceptable 
thresholds before data is assembled. Specify corpus representativeness requirements 
so that the target balance across groups is a defined standard, not an assumption.

**Gate 3 — AI Solution Development**
Conduct a corpus audit before data ingestion to assess representational balance. 
Run the bias audit against the fairness metrics defined at Gate 2, testing across 
all sensitive attributes. Where bias is found, apply and document mitigations. Any 
residual known bias must be disclosed — not left as an undocumented design choice.

**Gate 4 — Pre-Deployment Review and Approval**
Review bias audit results against defined thresholds. Any metric outside the 
acceptable range must be resolved before go-live, or formally risk-accepted with a 
documented remediation timeline. Fairness trade-offs must be disclosed in the model 
documentation and signed off by the governance body.

**Gate 5 — Go-Live and Monitoring**
Run fairness metrics against live output data monthly — production conditions differ 
from test environments and fairness drift can emerge gradually. Set automated alerts 
for threshold deviations, with a five-business-day triage requirement. Re-run the 
corpus assessment whenever the data is updated.

---

### Principle 8 — Compliance

Compliance ensures that AI systems are designed, built, and operated in accordance 
with applicable laws, regulations, and standards. In a government context, this 
extends beyond data protection law to cybersecurity frameworks, AI governance 
standards, and sector-specific obligations.

**Gate 2 — AI Solution Design**
Produce a Compliance Requirements Map listing every applicable obligation — Qatar 
PDPL, QNCSF, ISO/IEC 42001, ISO/IEC 27001, and sector-specific regulations — and 
map each to the design decision or control that will satisfy it. Identify any 
prohibited components early and resolve them at design stage, not during development.

**Gate 3 — AI Solution Development**
For each regulatory requirement, document which component or configuration satisfies 
it. Maintain this as a compliance mapping log throughout development. Verify in code 
that no pipeline component routes sensitive content outside approved boundaries.

**Gate 4 — Pre-Deployment Review and Approval**
Conduct a structured compliance review against every requirement in the Compliance 
Requirements Map. Obtain formal sign-off from the relevant legal or regulatory 
authority — this is a gate passage condition.

**Gate 5 — Go-Live and Monitoring**
Conduct scheduled compliance reviews at minimum quarterly. Monitor for regulatory 
changes — any update to applicable laws or standards triggers a formal review within 
30 days. Issue a formal annual compliance statement from the governance body confirming 
the system remains aligned with all applicable requirements.

---

### Principle 9 — Human Oversight

Human oversight ensures that consequential decisions informed by AI remain under 
meaningful human control. AI systems provide analysis and recommendations — they 
do not make decisions. Oversight mechanisms must be built into the system 
architecture; they cannot be enforced through policy alone.

**Gate 2 — AI Solution Design**
Classify every planned AI output as Informational, Advisory, or Critical and define 
the human review requirement for each class. Design Human-in-the-Loop gates as 
blocking workflow logic for Advisory and Critical outputs, and define escalation 
triggers for outputs that exceed the reviewer's authority to act on independently.

**Gate 3 — AI Solution Development**
Build HITL gates as blocking functional logic — the system must be architecturally 
incapable of proceeding past a required review step without a recorded human approval. 
Implement the override log with mandatory reason capture and confirm it is accessible 
to the governance body and auditors.

**Gate 4 — Pre-Deployment Review and Approval**
Test all HITL gates with realistic decision scenarios in UAT — confirm they are 
genuinely blocking and that all required log fields are captured. Confirm reviewer 
capacity is in place before go-live is approved. Verify that escalation paths are 
documented and notification mechanisms are functioning.

**Gate 5 — Go-Live and Monitoring**
Monitor HITL gate completion rates monthly — a decline in review activity may 
indicate oversight is being bypassed. Review the override log monthly for patterns 
indicating systematic model errors or user trust issues. Formally document any 
capacity shortfall as an exception with a remediation date.

---

### Principle 10 — Monitoring

Monitoring is the mechanism by which all other principles are sustained after 
deployment. An AI system that was sound at go-live can drift — in performance, 
fairness, or compliance. Monitoring is not a passive dashboard; it is an active, 
scheduled obligation that surfaces problems before they cause harm.

**Gate 2 — AI Solution Design**
Define the full monitoring architecture as part of the system's functional scope: 
what will be monitored, at what frequency, and by whom. Set metric thresholds and 
alert conditions. Specify the monthly, quarterly, and annual review schedule and 
assign them as operational obligations from the outset.

**Gate 3 — AI Solution Development**
Build monitoring dashboards and automated alert pipelines alongside the AI system — 
not after it. Test each alert type to confirm it reaches the correct recipient within 
the required timeframe. Monitoring must be producing data before pre-deployment 
testing begins.

**Gate 4 — Pre-Deployment Review and Approval**
Confirm all monitoring is active in the production environment before go-live is 
approved. Run test alerts for all alert types. Record the monitoring baseline — 
current fairness metrics, performance benchmarks, and access patterns — against 
which all future monitoring will be compared.

**Gate 5 — Go-Live and Monitoring**
Issue a monthly Ethics Health Report covering fairness, model drift, access anomalies, 
override patterns, and any incidents. Conduct a quarterly review and an annual ethical 
impact review producing a formal compliance statement. Re-enter the governance cycle 
immediately for any significant trigger event — a data change, an adversarial incident, 
a regulatory change, or a material shift in how the system is being used.
