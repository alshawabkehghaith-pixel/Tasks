## How Ethical AI Principles Are Applied Across the AI Lifecycle Gates

---

### Principle 1 — Accountability

Accountability ensures that every AI output has a named human owner at every stage
of the lifecycle. No decision produced or informed by an AI system is ownerless —
a responsible individual must be identifiable, reachable, and answerable for it.

**Gate 2 — AI Solution Design**
Assign a named AI Owner, Model Owner, and Data Owner with distinct responsibilities
before design begins. Define the RACI and approval authority for each lifecycle gate,
and establish the AI Ethics governance body responsible for independent review.
Specify that all model development decisions will be tracked using a version-controlled
decision log — tools such as MLflow, DVC, or Weights & Biases support this in practice,
where applicable. Document that no AI output will trigger an autonomous external-facing
action without an explicit, recorded human approval step.

**Gate 3 — AI Solution Development**
Track every significant development decision — algorithm selection, threshold settings,
data choices — against the named accountable person using the project's agreed tracking
tool (Jira, Azure DevOps, or equivalent). Enforce model versioning through MLflow or a
comparable experiment tracking platform, where applicable, so any output can be traced
back to the exact model state and dataset version that produced it. Build Accept / Reject
/ Override controls into the UI for Advisory and Critical outputs, with override actions
logged with the reviewer's identity and reasoning in a queryable audit log.

**Gate 4 — Pre-Deployment Review and Approval**
Obtain documented sign-off from all named owners and the governance body — this should
be a formal record, not an email thread. Verify the audit trail from Gate 2 is complete
and accessible. Confirm in UAT that the override log is capturing all required fields and
that no system pathway can trigger an external-facing action without a recorded human
approval step.

**Gate 5 — Go-Live and Monitoring**
Named owners remain accountable after go-live — this does not transfer to an operations
team. Define and document incident ownership before deployment so response roles are
pre-assigned, not improvised. Review override log activity in the first monthly
operations review — a pattern of overrides on a specific output type is an early signal
of a model issue worth investigating.

---

### Principle 2 — Data Protection

Data protection ensures that all data used by an AI system — including documents,
datasets, and any derived representations such as vector embeddings — is handled
lawfully, classified appropriately, and kept within authorised boundaries.

**Gate 2 — AI Solution Design**
Classify every proposed data source before the ingestion architecture is designed.
If the system handles personal data, define the anonymisation approach — tools such
as Microsoft Presidio or AWS Comprehend support automated PII detection and masking
at pipeline level. Specify data lineage tracking as a design requirement, where
applicable; platforms such as Apache Atlas, DataHub, or Azure Purview provide this
in practice. If the system handles data of multiple classification levels, design
vector store isolation as a technical requirement. Document the lawful basis for
processing each data type.

**Gate 3 — AI Solution Development**
If the system handles personal data, implement PII detection and masking in the
ingestion pipeline using the tool selected at Gate 2. Implement encryption at rest
(AES-256) and in transit (TLS 1.2+) for all components handling sensitive or
classified data. Build data lineage records for every ingested document — source,
classification, ingestion timestamp, and destination — where data lineage tracking
is required. Confirm through pipeline inspection that no sensitive content routes
outside approved infrastructure boundaries.

**Gate 4 — Pre-Deployment Review and Approval**
Verify encryption configuration and access controls in the pre-production environment
— this is a pass/fail requirement for systems handling sensitive data. If the system
handles data of multiple classification levels, run synthetic queries to confirm a
lower-clearance user cannot receive outputs derived from higher-classification sources.
Obtain formal written authorisation for processing sensitive or classified data before
the production system is activated.

**Gate 5 — Go-Live and Monitoring**
Implement scheduled data access audits — tools such as Azure Purview or AWS Macie
provide automated access anomaly detection, where applicable. Any anomaly in access
patterns triggers an alert and investigation. Apply the data retention and disposal
schedule from day one. Conduct a data protection review as part of the quarterly
ethics review.

---

### Principle 3 — Reliability

Reliability ensures that an AI system performs consistently and predictably within
its intended scope. Reliability is defined at design stage, validated during
development through structured testing, and actively monitored in production.

**Gate 2 — AI Solution Design**
Define performance KPIs — accuracy, latency, throughput, and availability — as
measurable acceptance criteria. Thresholds should reflect the decision type: outputs
informing policy-level decisions require a higher bar than operational queries. Define
failure modes, fallback behaviour, and the rollback procedure including a target
recovery time. Specify which testing approaches will apply at Gate 3 based on system
complexity: smoke tests, regression tests, load tests, and edge case tests, as applicable.

**Gate 3 — AI Solution Development**
Run a structured test suite against the Gate 2 acceptance criteria:
- **Smoke testing** after each significant build to confirm the core pipeline is
  functional before deeper testing begins
- **Regression testing** after each model update to detect performance degradation
  before it reaches pre-deployment review
- **Load testing**, where applicable, using tools such as Locust or k6 to simulate
  expected and peak query volumes
- **Edge case testing** targeting inputs the model is least likely to handle well —
  sparse data, out-of-distribution queries, and adversarial inputs, where relevant

Build and test the rollback procedure. Demonstrate it executes within the target
recovery time using the actual model registry (MLflow, SageMaker Model Registry,
or equivalent), where applicable.

**Gate 4 — Pre-Deployment Review and Approval**
KPIs must be met and stable across repeated test runs — a single passing run is not
sufficient for approval. Run a final load test at expected production volumes, where
applicable. Test the rollback procedure in the pre-production environment and record
the result. Confirm that automated performance alerts are correctly configured.

**Gate 5 — Go-Live and Monitoring**
Monitor performance metrics in production using an observability platform — Grafana
with Prometheus for infrastructure metrics, or a dedicated ML monitoring tool such as
Evidently AI, Arize AI, or WhyLabs, where applicable. Track against the go-live
baseline. Define the threshold at which degradation triggers a retraining decision —
this requires re-entry into the governance cycle. Include a performance health check
in the monthly review.

---

### Principle 4 — Security

Security ensures AI systems are protected against conventional and AI-specific
threats. For LLM and RAG-based systems, adversarial attacks — particularly prompt
injection and data extraction attempts — are active production risks, not
theoretical ones.

**Gate 2 — AI Solution Design**
Define the secure architecture: access controls, encryption, and component isolation.
For LLM and RAG-based systems, conduct AI-specific threat modelling using the OWASP
LLM Top 10 as a reference framework — it covers prompt injection, insecure output
handling, training data poisoning, and sensitive information disclosure, among others.
Specify that CVE scanning will be integrated into the CI/CD pipeline using tools such
as Snyk, Dependabot, or Trivy, where applicable.

**Gate 3 — AI Solution Development**
Implement the secure architecture and verify controls are functioning. For LLM and
RAG-based systems, conduct adversarial prompt testing during development using
red-teaming tools such as Garak or PyRIT — findings addressed in development are
less costly than gate-blocking issues at pre-deployment. Implement input validation
and rate limiting on all inference endpoints. Integrate CVE scanning into the pipeline
with blocking rules for critical-severity findings, where applicable.

**Gate 4 — Pre-Deployment Review and Approval**
Complete a formal security review of all pipeline components. For systems handling
sensitive data, penetration testing is a mandatory gate requirement — covering the
full inference pipeline, not just the application layer. Review CVE scan results and
confirm no unresolved critical vulnerabilities are present. For LLM and RAG-based
systems, confirm the output filtering layer is active and correctly configured.

**Gate 5 — Go-Live and Monitoring**
Activate security monitoring from day one — SIEM integration, API anomaly detection,
and access monitoring should all be live at deployment, where applicable. Maintain a
tested incident response runbook. Schedule recurring CVE scans — monthly for active
production systems. Conduct a post-go-live security review within 30 days.

---

### Principle 5 — Transparency

Transparency ensures that AI systems are open about what they do, how they work,
and what their limitations are — to the people who use them and the people who
are accountable for them.

**Gate 2 — AI Solution Design**
Define the disclosure level for each user type — what information must accompany
each AI output. Produce a system purpose statement as part of the solution design.
Specify inference logging requirements — query, output, model version, and timestamp
— as a functional requirement. For RAG-based systems, specify that source attribution
must be returned as part of every response.

**Gate 3 — AI Solution Development**
Produce the draft Model Card during development using a structured template —
Google's Model Card format provides a practical baseline. For RAG-based systems,
implement source attribution in the API response layer; tools such as LangChain
and LlamaIndex support citation tracking natively. Activate inference logging from
the start of development testing — LangSmith or Helicone for LLM-based systems,
or a custom logging layer where applicable — and verify log completeness before Gate 4.

**Gate 4 — Pre-Deployment Review and Approval**
Publish and version-control the final Model Card — this is a pass/fail gate
requirement. Confirm user disclosures are accurate and appropriate for each user
type. Verify inference logging is producing complete records in the pre-production
environment and that logs are accessible to the governance body.

**Gate 5 — Go-Live and Monitoring**
Update the Model Card at least quarterly with current performance metrics and any
new limitations identified in production. Maintain a user feedback mechanism for
flagging incorrect or unexplainable outputs, and ensure feedback is reviewed
regularly and fed into the improvement cycle.

---

### Principle 6 — Explainability

Explainability ensures that AI outputs can be understood by the people who rely on
them and the people responsible for them. An output that cannot be explained cannot
be effectively challenged, corrected, or audited.

**Gate 2 — AI Solution Design**
Select the explainability method based on model type:
- **SHAP** or **LIME** for ML classification, regression, and scoring models
- **Microsoft InterpretML** for gradient boosting and linear models, where applicable
- **IBM AI Explainability 360** for a broader range of ML model types, where applicable
- **Citation-backed generation** for RAG and LLM systems — every response cites
  the source documents that informed it

Define the required explanation depth per stakeholder: feature-level attribution
for technical reviewers, plain-language rationale for decision-makers, and
traceable logs for auditors.

**Gate 3 — AI Solution Development**
Integrate the chosen explainability method as part of the standard inference pipeline
— explanations must accompany every output automatically. For RAG systems, implement
and test citation return in the API response. Validate explanation outputs with a
representative user — ideally a domain expert or government analyst — to confirm
they are interpretable before Gate 4.

**Gate 4 — Pre-Deployment Review and Approval**
Have at least one non-technical stakeholder review a sample of explanation outputs
and confirm they are understandable and sufficient for the decisions they support.
Record this as a gate sign-off item. Confirm explanations are present for every
output type across all output classifications.

**Gate 5 — Go-Live and Monitoring**
Ensure explanations are surfaced at the point of interaction — not behind a separate
request. Maintain an explanation log alongside inference logs. Re-validate explanation
accuracy whenever the model or data corpus changes.

---

### Principle 7 — Fairness

Fairness ensures that AI systems do not produce outputs that systematically favour
or disadvantage any individual, group, sector, or entity. Bias can be introduced
through data composition, algorithm design, or deployment conditions.

**Gate 2 — AI Solution Design**
Identify the sensitive attributes relevant to this system — sector type, entity size,
geographic region, or time period — and define the fairness metrics and acceptable
thresholds before data is assembled. Select the fairness assessment tooling, where
applicable:
- **IBM AI Fairness 360 (AIF360)** for ML models
- **Microsoft Fairlearn** for scikit-learn-based workflows
- **Aequitas** for classification model bias auditing
- **Google's What-If Tool** for interactive fairness exploration, where applicable

For RAG and LLM systems, define corpus representativeness requirements — the target
balance across sectors, entity types, and time periods is a stated standard,
not an assumption.

**Gate 3 — AI Solution Development**
For ML models, run the bias audit using the selected tool against the fairness metrics
defined at Gate 2. Test across all identified sensitive attributes and document results.
Apply mitigations where thresholds are not met — resampling, re-weighting, or threshold
adjustment, as appropriate — and re-test. For RAG systems, conduct a corpus audit
before ingestion to assess representational balance, where applicable. Any residual
known bias must be disclosed in the Model Card.

**Gate 4 — Pre-Deployment Review and Approval**
Review bias audit results against the defined thresholds. Any metric outside the
acceptable range must be resolved or formally risk-accepted with a documented
remediation timeline before go-live is approved. Fairness trade-offs must be disclosed
in the Model Card and signed off by the governance body.

**Gate 5 — Go-Live and Monitoring**
Monitor fairness metrics against live output data monthly using the production
monitoring platform — Evidently AI, Arize AI, or WhyLabs all support fairness
monitoring in production, where applicable. Set automated drift alerts tied to the
thresholds defined at Gate 2, with a five-business-day triage requirement. Re-run
the corpus assessment whenever the data is updated, where applicable.

---

### Principle 8 — Compliance

Compliance ensures that AI systems are designed, built, and operated in accordance
with applicable laws, regulations, and standards. In a government context this extends
beyond data protection law to cybersecurity frameworks and AI governance standards.

**Gate 2 — AI Solution Design**
Produce a Compliance Requirements Map listing every applicable obligation — Qatar
PDPL, QNCSF, ISO/IEC 42001, ISO/IEC 27001, and any sector-specific regulations —
and map each to the design decision or control that will satisfy it. Identify any
prohibited components — such as external LLM APIs that would receive sensitive data,
if applicable — and resolve these at design stage, not during development.

**Gate 3 — AI Solution Development**
For each regulatory requirement in the Compliance Requirements Map, document the
specific component, configuration, or test that satisfies it. Maintain this as a
living compliance log throughout development — it becomes the primary evidence package
for the Gate 4 review. Verify through pipeline inspection that no component routes
sensitive content outside approved infrastructure.

**Gate 4 — Pre-Deployment Review and Approval**
Conduct a structured compliance review against every item in the Compliance
Requirements Map. Obtain formal sign-off from the relevant legal or regulatory
authority — this is a gate passage condition.

**Gate 5 — Go-Live and Monitoring**
Conduct scheduled compliance reviews at minimum quarterly. Assign a named person to
monitor for regulatory changes — any update to applicable laws or standards triggers
a formal review within 30 days. Issue a formal annual compliance statement from the
governance body confirming the system remains aligned with all applicable requirements.

---

### Principle 9 — Human Oversight and Monitoring

Human oversight ensures that consequential decisions informed by AI remain under
meaningful human control. Monitoring is the mechanism by which oversight, along with
all other principles, is sustained after deployment. Together they form a continuous
control loop: oversight defines the human checkpoints built into the system, and
monitoring verifies they are working as intended in the live environment.

**Gate 2 — AI Solution Design**
Classify every planned AI output as Informational, Advisory, or Critical and define
the human review requirement for each class. Design Human-in-the-Loop gates as
blocking workflow logic for Advisory and Critical outputs — specify the gate position,
required reviewer role, and maximum turnaround time. Define escalation triggers for
outputs that exceed a reviewer's authority to act on independently. In parallel,
define the monitoring architecture: specify what will be monitored — fairness metrics,
model drift, HITL completion rates, access anomalies — at what frequency, and using
which platform. Practical options include Grafana with Prometheus for infrastructure
metrics, and Evidently AI, Arize AI, or WhyLabs for ML-specific monitoring,
where applicable.

**Gate 3 — AI Solution Development**
Build HITL gates as blocking functional logic for Advisory and Critical outputs —
the system must be architecturally incapable of proceeding past a required review
step without a recorded approval. Implement the override log with mandatory reason
capture and confirm it is accessible to the governance body and auditors. Build
monitoring dashboards and configure automated alerts using the platform selected at
Gate 2. Test each alert end-to-end — confirm it fires correctly and reaches the right
recipient within the required response window. Monitoring must be producing data
before pre-deployment testing begins.

**Gate 4 — Pre-Deployment Review and Approval**
Test all HITL gates with realistic decision scenarios in UAT — confirm they are
genuinely blocking and that all required log fields are captured. Confirm reviewer
capacity is allocated before go-live is approved. Run test alerts for all monitoring
alert types and confirm each reaches the correct recipient. Record the monitoring
baseline — current fairness metrics, performance benchmarks, and access patterns —
against which all future reviews will be compared. Confirm escalation paths and
notification mechanisms are functioning end-to-end.

**Gate 5 — Go-Live and Monitoring**
Monitor HITL gate completion rates monthly — a decline may indicate oversight is
being bypassed and must be investigated. Review the override log monthly for patterns
indicating systematic model errors or user trust issues. Formally document any reviewer
capacity shortfall as a time-bound exception with a remediation date. Issue a monthly
Ethics Health Report covering fairness, model drift, access anomalies, override
patterns, and any incidents. Conduct a quarterly review and an annual ethical impact
review producing a formal compliance statement. Re-enter the governance cycle
immediately for any significant trigger event — a data change, adversarial incident,
regulatory update, or material shift in system usage.
