## How Ethical AI Principles Are Applied Across the AI Lifecycle Gates

---

### Gate 2 — AI Solution Design

---

#### Accountability

At the design stage, accountability means ensuring that every AI output has a named human owner before 
the system is built. Governance structures and decision rights must be established here — they cannot 
be defined retroactively once the system is live.

1. Assign a named AI Owner, Model Owner, and Data Owner. Each carries distinct responsibilities: 
   the AI Owner is accountable for outcomes and use; the Model Owner for technical behaviour; 
   the Data Owner for data quality, classification, and permissibility.
2. Define the RACI and approval authority for each lifecycle gate, including who holds the 
   authority to block deployment if ethical requirements are not satisfied.
3. Establish the AI Ethics governance structure — the body or officer responsible for 
   independent review at each gate, with formal independence from the delivery team.

---

#### Data Protection

Data protection at the design stage means establishing the rules and constraints that govern 
how data will be handled before any pipeline or architecture is built. Decisions made here 
determine what data can enter the system, how it must be stored, and who can access it.

1. Classify every proposed data source and document before the ingestion architecture is 
   designed. Classification level drives infrastructure requirements, encryption standards, 
   and access controls — all of which must be built in from the start.
2. Document the lawful basis for processing each data type. For government data, confirm 
   the legal authority for AI processing exists. For personal data, confirm the basis under 
   applicable data protection law.
3. Define the anonymisation and data minimisation approach: specify which fields require 
   masking or removal before ingestion and enforce the principle that only data necessary 
   for the AI's stated function should enter the pipeline.

---

#### Reliability

Reliability at the design stage means setting measurable standards that the system must 
meet before it can be deployed. Without defined thresholds, Gate 4 has no objective basis 
on which to approve or reject the system.

1. Define performance KPIs — accuracy, latency, and availability — as acceptance criteria 
   in the design document. Thresholds should reflect the decision type the system supports: 
   policy-level decisions require a higher reliability bar than operational queries.
2. Define failure modes and fallback behaviour: specify how the system responds when it 
   cannot produce a reliable output — whether that is a low-confidence flag, an escalation 
   to a human reviewer, or a safe null response.

---

#### Security

Security at the design stage is an architectural obligation. Controls that are not designed 
into the system from the start are either expensive to retrofit or absent entirely by the 
time the system reaches production.

1. Define the secure architecture: specify access controls, encryption at rest and in transit, 
   and isolation requirements between data stores of different classification levels.
2. Conduct threat modelling covering AI-specific attack surfaces — prompt injection, 
   data poisoning, model inversion, and embedding extraction — and use the outputs to 
   shape security requirements in the technical design.

---

#### Transparency

Transparency at the design stage means deciding what the system will disclose about itself 
and to whom. These decisions shape the user experience and the auditability of the system 
in production.

1. Define the disclosure level for each user type: internal government analysts may require 
   full source attribution and model limitations; external-facing outputs require a clear 
   disclosure that AI was used. Define this distinction in the design document.
2. Produce a system purpose statement that documents what the system is designed to do, 
   what it is not designed to do, and what conditions may cause it to perform unreliably. 
   This becomes the foundation of the model documentation produced at Gate 3.

---

#### Explainability

Explainability at the design stage requires selecting the right method for the model type 
and defining the explanation requirements for each stakeholder group. Both decisions have 
architectural implications and cannot be deferred to development.

1. Select the explainability method appropriate to the model architecture: SHAP or LIME 
   for ML classification and scoring models; citation-backed generation for RAG and LLM 
   systems. This choice must be made at design stage.
2. Define the required explanation depth per stakeholder: technical reviewers need 
   feature-level attribution; decision-makers need a plain-language rationale; auditors 
   need a traceable log. The explanation layer must be designed to meet each of these needs.

---

#### Fairness

Fairness at the design stage means identifying bias risks before data is assembled and 
establishing the metrics against which the system will be judged. A fairness-aware design 
anticipates harm rather than discovering it during testing.

1. Identify the sensitive attributes — sector type, entity size, geographic region, time 
   period — that could introduce bias if underrepresented or over-weighted in training 
   data or the document corpus.
2. Define the fairness metrics relevant to this system and set the acceptable thresholds. 
   This gives bias testing at Gate 3 an objective standard to measure against rather than 
   a subjective assessment.

---

#### Compliance

Compliance at the design stage means mapping every applicable legal and regulatory 
obligation to a specific design decision. Requirements that are not addressed in the 
design will not be consistently implemented in development.

1. Produce a Compliance Requirements Map listing every applicable obligation — Qatar PDPL, 
   QNCSF, ISO/IEC 42001, ISO/IEC 27001, and any sector-specific regulations — and map 
   each requirement to the design decision or control that will satisfy it.
2. Identify whether any planned components (e.g. external LLM APIs) are prohibited due 
   to data classification or sovereignty requirements. Resolve these at design stage, 
   not during development.

---

#### Human Oversight

Human oversight at the design stage means building review checkpoints into the system 
architecture before a single line of code is written. Oversight that is designed in is 
enforceable; oversight that is added later is discretionary.

1. Define human-in-the-loop gates for all output types classified as Advisory or Critical. 
   Specify the gate position in the workflow, the required reviewer role, and the maximum 
   turnaround time for a review decision.
2. Define escalation triggers: the conditions under which a reviewer must escalate rather 
   than resolve independently, including low-confidence outputs, anomalous results, and 
   outputs derived from data above the reviewer's clearance level.

---

### Gate 3 — AI Solution Development

---

#### Accountability

At the development stage, accountability means creating a traceable record of the decisions 
made in building the system. Every significant technical choice — algorithm selection, 
threshold setting, data inclusion or exclusion — must be attributed to a named decision-maker.

1. Maintain a development decision log capturing key choices made during model development, 
   the reasoning behind each, and the name of the person accountable for it.
2. Enforce version control on all model artefacts — training data snapshots, model weights, 
   pipeline configurations — so that any output produced by the system can be traced back 
   to the exact model state that produced it.

---

#### Data Protection

At the development stage, data protection controls move from design decisions to working 
implementations. The standard is not that controls were planned — it is that they are 
built, tested, and evidenced.

1. Implement anonymisation, masking, and encryption as active pipeline controls. Before 
   any data is ingested, validate that its usage is consistent with the permissions and 
   lawful basis documented at Gate 2.
2. Implement access controls at the data retrieval layer to enforce classification-level 
   isolation: a lower-clearance user must not be able to retrieve content derived from 
   a higher-classification data source.

---

#### Reliability

At the development stage, reliability means validating the system against the acceptance 
criteria set at Gate 2 under realistic and adverse conditions. Testing must go beyond 
normal-use scenarios to include the edge cases most likely to cause failure in production.

1. Run performance validation against the KPIs defined at Gate 2 under normal conditions, 
   high load, and edge cases. Document results as part of the development exit evidence.
2. Test failure modes and fallback behaviour: confirm that the system responds as designed 
   when it cannot produce a reliable output, and that fallback behaviour is consistent 
   across different failure types.

---

#### Security

At the development stage, security controls are implemented and validated against the 
architecture defined at Gate 2. Adversarial testing during development is more effective 
than testing conducted only at pre-deployment — findings can be addressed before they 
become gate-blocking issues.

1. Implement the secure architecture defined at Gate 2: access controls, encryption, and 
   data store isolation. Verify these are functioning as specified, not assumed by default.
2. Conduct systematic adversarial prompt testing for LLM and RAG components during 
   development. Record the prompts tested, the system's responses, and the mitigations applied.

---

#### Transparency

At the development stage, transparency is implemented through model documentation, source 
attribution, and inference logging. These are functional components of the system, not 
documentation tasks completed after development.

1. Produce the draft model documentation during development, covering training data 
   provenance, known data limitations, and the assumptions the model relies on.
2. Implement inference logging from the start of development testing. Logs must capture 
   every query, output, model version, and timestamp, and must be verified as complete 
   before Gate 4 review.

---

#### Explainability

At the development stage, the explainability method selected at Gate 2 is integrated as a 
functional output of the system. Explanation outputs must accompany every model response 
automatically — they are not a reporting feature added at the end of development.

1. Integrate the chosen explainability method — SHAP, LIME, or citation-backed generation — 
   as part of the standard API response. Explanation must be produced alongside every output.
2. Validate explanation outputs with representative users before Gate 4. Explanations must 
   be accurate — correctly reflecting model behaviour — and interpretable by a non-technical 
   government analyst.

---

#### Fairness

At the development stage, fairness is measured and evidenced against the metrics and 
thresholds defined at Gate 2. Any bias identified during testing must be addressed before 
the system reaches pre-deployment review.

1. Run the bias audit using the fairness metrics defined at Gate 2. Test across all 
   sensitive attributes identified at design stage and document results, including any 
   groups where the model falls below the acceptable threshold.
2. Where bias is found, apply mitigations — resampling, re-weighting, threshold adjustment 
   — and re-test. Any residual known bias must be documented in the model documentation 
   with a clear statement of what mitigation was applied and what trade-off was accepted.

---

#### Compliance

At the development stage, every compliance requirement identified at Gate 2 must be 
implemented and evidenced. Compliance mapping is a development deliverable, not a 
retrospective Gate 4 exercise.

1. For each regulatory requirement in the Compliance Requirements Map, document which 
   code component or configuration satisfies it. This evidence package is a Gate 3 output.
2. Verify in code that no pipeline component routes sensitive or classified content to 
   any external service, API, or infrastructure outside approved boundaries.

---

#### Human Oversight

At the development stage, oversight mechanisms are built as blocking workflow logic. 
Human review is not a UI feature — it is a functional constraint that prevents the 
system from proceeding without a recorded approval where one is required.

1. Build human-in-the-loop gates as blocking logic for all Advisory and Critical output 
   workflows. The system must be functionally incapable of proceeding past a required 
   review step without a recorded human approval.
2. Implement the override log with mandatory reason capture and reviewer identity. Verify 
   the log is accessible to the governance body and internal auditors before Gate 4.

---

### Gate 4 — Pre-Deployment Review and Approval

---

#### Accountability

Gate 4 is a formal governance checkpoint. Its purpose is independent verification that 
what was designed at Gate 2 was built at Gate 3. Sign-off here is not a formality — 
each owner is confirming that their domain of responsibility meets the framework's requirements.

1. Obtain documented sign-off from the AI Owner, Model Owner, Data Owner, and the AI 
   Ethics governance body. Each confirms their respective obligations have been met.
2. Verify that a complete and unbroken audit trail exists from Gate 2 to this point. 
   Gaps in the trail are a gate-blocking finding.

---

#### Data Protection

At Gate 4, data protection controls are independently verified in the pre-production 
environment. The standard is higher than development testing — controls must be confirmed 
under production-equivalent conditions.

1. Verify encryption at rest and in transit for all components handling sensitive or 
   classified data. Confirm that no sensitive content is routed to any external service 
   or infrastructure outside approved boundaries.
2. Confirm that data usage for every source is consistent with the permissions and lawful 
   basis documented at Gate 2. Any gap must be resolved before deployment is approved.

---

#### Reliability

At Gate 4, reliability is confirmed against the acceptance criteria defined at Gate 2. 
KPIs must not only be met — they must be stable across repeated test runs, and the 
rollback procedure must be tested, not just documented.

1. Review validation test results against all performance acceptance criteria. A system 
   that meets its thresholds inconsistently is not ready for deployment.
2. Test the rollback procedure in the pre-production environment and document the result. 
   Rollback must be a verified capability before go-live is approved.

---

#### Security

At Gate 4, the security review is formal and independent. For systems handling sensitive 
data, penetration testing and adversarial prompt testing are mandatory gate requirements — 
not optional steps that can be deferred to post-deployment.

1. Complete a formal security review covering all pipeline components: access controls, 
   infrastructure configuration, and data routing. All findings must be resolved or 
   formally risk-accepted before go-live.
2. Review CVE scan results for all model dependencies and container images. For LLM and 
   RAG systems, confirm that penetration testing and prompt injection testing have been 
   completed and that results have been reviewed and signed off.

---

#### Transparency

At Gate 4, user disclosures and model documentation are finalised and independently 
reviewed. No system may pass Gate 4 without an approved, version-controlled model document 
that accurately reflects the system as built.

1. Confirm that user disclosures — AI usage, confidence levels, source attribution, 
   known limitations — are accurate, complete, and appropriate for each user type.
2. Publish and version-control the final model documentation. This is a pass/fail gate 
   requirement.

---

#### Explainability

At Gate 4, explanation outputs are validated by business users — not just the technical 
team. The test is whether a non-technical decision-maker can understand and act on the 
explanations the system provides.

1. Have at least one non-technical government analyst or domain expert review a sample 
   of explanation outputs and confirm they are accurate and understandable. Record this 
   validation as a gate sign-off item.

---

#### Fairness

At Gate 4, bias test results from Gate 3 are formally reviewed and accepted. Any 
fairness deviation beyond the defined thresholds must be resolved or formally 
risk-accepted with documented justification before the system is approved for deployment.

1. Review bias audit results against the thresholds defined at Gate 2. Any metric 
   outside the acceptable range must be resolved before go-live, or the deviation 
   must be formally documented with a risk acceptance and a remediation timeline.
2. Where fairness trade-offs have been accepted, document these explicitly in the model 
   documentation and obtain sign-off from the governance body. Undisclosed trade-offs 
   are not acceptable.

---

#### Compliance

At Gate 4, formal legal and regulatory clearance is obtained. Compliance is not 
assumed from development testing — it is confirmed through an independent review 
and documented sign-off.

1. Conduct a structured compliance review against every requirement in the Gate 2 
   Compliance Requirements Map. Confirm that each requirement is satisfied by the 
   system as built.
2. Obtain formal compliance sign-off from the relevant legal or regulatory authority. 
   This is a gate passage condition.

---

#### Human Oversight

At Gate 4, oversight mechanisms are tested with realistic scenarios, not synthetic ones. 
The test is whether human reviewers can perform their function effectively in the 
actual system — not whether the feature exists.

1. Test all HITL gates with realistic decision scenarios in UAT. Confirm that the 
   override mechanism works correctly and that all required fields are captured in the 
   audit log.
2. Confirm that reviewer capacity is in place for the live system: sufficient human 
   reviewer time must be allocated for the expected advisory review volume before 
   go-live is approved.

---

### Gate 5 — Go-Live and Monitoring

---

#### Accountability

Go-live does not transfer accountability from the named owners to an operations team. 
Ownership persists, and the Decision Classification Matrix transitions from a design 
document to an operational one with named, active individuals responsible for each 
output class.

1. Confirm that named owners are active and reachable for each output class from day one.
2. Define incident ownership before go-live: who owns an AI-related incident — a biased 
   output, a data breach, a reliability failure — must be established in advance, not 
   determined at the time of the incident.

---

#### Data Protection

In production, data protection moves from implementation verification to continuous 
enforcement. Access patterns, routing, and data usage must be monitored on a recurring 
basis — not assumed to be correct because they passed Gate 4.

1. Implement scheduled checks to confirm that data access patterns remain consistent 
   with the permissions defined at Gate 2. Any anomaly triggers an immediate alert.
2. Maintain an active breach detection capability covering AI-specific vectors: 
   unauthorised access to stored embeddings, bulk retrieval behaviour, and inference 
   patterns that may indicate an attempt to extract sensitive data.

---

#### Reliability

In production, reliability is monitored continuously against the go-live baseline. 
Degradation is expected over time as real-world data distributions shift — the 
obligation is to detect it early and respond through the governance cycle, not 
to retrain unilaterally.

1. Track model performance metrics against the go-live baseline. Drift in output 
   distributions or accuracy degradation are indicators that the model's behaviour 
   has changed and requires investigation.
2. Define the threshold at which degradation triggers a retraining decision. Retraining 
   requires re-entry into the governance cycle — it is not a unilateral technical decision.

---

#### Security

In production, security monitoring is active and continuous. Adversarial threats do 
not stop at deployment, and the controls validated at Gate 4 must be confirmed as 
operational and effective in the live environment.

1. Maintain active monitoring for AI-specific threats: prompt injection attempts, unusual 
   query patterns, bulk retrieval behaviour, and access anomalies. Security monitoring 
   must be live from the first day of operation.
2. Maintain a tested incident response protocol — including the authority to temporarily 
   suspend sensitive data retrieval — that can be executed without delay if an adversarial 
   pattern is detected.

---

#### Transparency

In production, transparency is maintained through current model documentation and 
accessible inference logs. Users must be clearly informed that outputs are AI-generated 
and must have a mechanism to raise concerns.

1. Update model documentation at least quarterly with current performance metrics, 
   corpus changes, and any new known limitations identified in production.
2. Maintain a feedback channel allowing users to flag outputs they believe are incorrect 
   or unexplainable. Feedback must be reviewed on a regular schedule and fed into the 
   continuous improvement process.

---

#### Explainability

In production, explanations must be available at the point of use and logged for 
audit purposes. The obligation is not just to provide explanations — it is to ensure 
they remain accurate as the model evolves.

1. Ensure that any user receiving an AI output can access an explanation at the point 
   of interaction — not as a separate support request.
2. Maintain a log of explanation outputs alongside inference logs so that the rationale 
   behind any past AI-informed decision can be reconstructed for audit or appeal purposes.

---

#### Fairness

In production, fairness is monitored against real-world output distributions, which 
will differ from test conditions. Fairness drift can emerge gradually and must be 
detected and addressed through the monitoring cycle.

1. Run fairness metrics against live output data on a monthly basis. Production 
   monitoring is not a substitute for pre-deployment testing — it is a separate, 
   ongoing obligation.
2. Set automated alerts for deviations beyond acceptable thresholds. Any triggered 
   alert must be triaged within five business days with a documented root cause 
   assessment and remediation action.

---

#### Compliance

In production, compliance is an active obligation — not a state achieved at Gate 4. 
Regulatory requirements change, and the system must continue to meet them throughout 
its operational life.

1. Conduct scheduled compliance reviews — at minimum quarterly — to confirm the system 
   continues to satisfy all regulatory obligations in its current operational state.
2. Monitor for regulatory changes. Any change to applicable laws or standards triggers 
   a formal compliance review within 30 days and re-entry into the governance cycle 
   at the appropriate stage.

---

#### Human Oversight

In production, human oversight is enforced — not assumed. HITL gate completion rates 
must be monitored, override patterns must be reviewed for systemic issues, and the 
oversight obligation does not diminish as the system gains user familiarity.

1. Monitor HITL gate completion rates monthly. A decline in human review activity may 
   indicate that oversight mechanisms are being bypassed and must be investigated.
2. Review the override log monthly to identify patterns that may indicate systematic 
   model errors, user trust issues, or ambiguities in how output types are being 
   classified in practice.

---

#### Monitoring

Monitoring at Gate 5 is the primary mechanism by which all other principles are 
sustained in production. It is not a passive dashboard — it is an active obligation 
that surfaces ethical drift, performance degradation, and emerging risks before 
they cause harm.

1. Issue a monthly Ethics Health Report covering fairness metrics, bias alert status, 
   model drift, access anomaly events, HITL override patterns, and any compliance or 
   security incidents.
2. Conduct a quarterly review covering model documentation updates, override log 
   analysis, and corpus re-assessment where new data has been ingested.
3. Conduct an annual ethical impact review across all principles, producing a formal 
   compliance certificate confirming the system remains aligned with the framework.
