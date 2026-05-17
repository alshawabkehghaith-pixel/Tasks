## Ethical AI Principles by Gate

---

### Gate 2 — AI Solution Design

| Principle | Application at This Gate |
|---|---|
| **Accountability** | Define who is accountable for each type of AI output before design begins. Establish escalation paths in the solution design so ownership is never ambiguous. |
| **Data Protection** | Classify all data sources and documents that the AI will use. Determine what infrastructure is required based on sensitivity levels and design data handling accordingly. |
| **Reliability** | Set clear performance expectations and define what acceptable system behaviour looks like. Include a versioning and rollback approach in the design. |
| **Security** | Design protections against adversarial inputs and data leakage into the architecture from the start. Define how inputs will be validated and access controlled. |
| **Transparency** | Specify what information the system must provide alongside its outputs — confidence levels, data sources, limitations. Design this as a requirement, not an afterthought. |
| **Explainability** | Choose the explanation approach suitable for the model type at design stage. Define what level of explanation is needed for each type of output. |
| **Fairness** | Identify potential sources of bias in the data and define how representativeness will be assessed. Set the fairness metrics that will be tracked. |
| **Compliance** | Map the applicable regulations and standards to this solution. Identify any data or component restrictions early to avoid costly redesign. |
| **Human Oversight** | Design human review checkpoints into all workflows involving significant or sensitive outputs. Define reviewer roles and the capacity needed to support them. |
| **Monitoring** | Design the monitoring architecture: what gets tracked, at what frequency, and by whom. This is part of the solution scope, not an operational add-on. |

---

### Gate 3 — AI Solution Development

| Principle | Application at This Gate |
|---|---|
| **Accountability** | Build the accept/reject/override controls into the interface. Ensure all decision actions are logged with the reviewer's identity and reasoning. |
| **Data Protection** | Implement data classification tagging, encryption, access controls, and PII handling in the ingestion and storage pipeline. Verify no sensitive data routes to unauthorised destinations. |
| **Reliability** | Run baseline performance tests against the criteria set at Gate 2. Build and verify the rollback mechanism before testing concludes. |
| **Security** | Implement prompt injection defences, output filtering, input validation, and rate limiting. Integrate vulnerability scanning into the build pipeline. |
| **Transparency** | Produce the draft model documentation. Implement source attribution and output logging as functional components, not documentation tasks. |
| **Explainability** | Integrate the chosen explainability method into the system. Explanation must be part of every output response, not a separate feature. |
| **Fairness** | Conduct the corpus audit and bias assessment before data is ingested. Record the fairness baseline. Surface any known data gaps to users in the interface. |
| **Compliance** | Implement the required legal and regulatory controls. Produce evidence that each compliance requirement has been addressed in the build. |
| **Human Oversight** | Build the human review gates as blocking workflow logic — the system cannot proceed without a recorded approval where required. Implement the notification mechanism for escalations. |
| **Monitoring** | Build and test all monitoring dashboards and alert pipelines. Monitoring must be producing data before pre-deployment testing starts. |

---

### Gate 4 — Pre-Deployment Review and Approval

| Principle | Application at This Gate |
|---|---|
| **Accountability** | Validate human review gates work correctly in testing. Get formal sign-off on the output classification approach from the relevant stakeholders. |
| **Data Protection** | Verify encryption, access controls, and data routing in the pre-production environment. Obtain formal authorisation for processing sensitive documents before they enter production. |
| **Reliability** | Confirm the system meets all performance thresholds. Test the rollback procedure and document the result. |
| **Security** | Complete penetration testing and adversarial prompt testing. Review and sign off the security test reports as a condition of go-live approval. |
| **Transparency** | Publish the final model documentation before go-live. Validate that source attribution and output classification markers are working correctly. |
| **Explainability** | Have a domain expert or end-user representative review a sample of explanations and confirm they are accurate and understandable. |
| **Fairness** | Review and formally accept the corpus and bias audit reports. Confirm that data gaps are disclosed in the model documentation and visible to users. |
| **Compliance** | Conduct a structured compliance review against all requirements identified at Gate 2. Obtain the formal compliance sign-off as a gate passage condition. |
| **Human Oversight** | Test human review workflows with realistic scenarios. Confirm reviewer capacity is in place for the live system. |
| **Monitoring** | Confirm all monitoring is active and alert thresholds are correctly configured before approving go-live. Record the monitoring baseline. |

---

### Gate 5 — Deployment (Go-Live)

| Principle | Application at This Gate |
|---|---|
| **Accountability** | Override logs are live. Named owners are active. Escalation paths are tested in the production environment within the first week. |
| **Data Protection** | Data sovereignty controls are enforced in production and verified on a recurring basis. Retention and disposal schedules are applied from day one. |
| **Reliability** | Performance is tracked against agreed targets from go-live. Rollback remains available at all times. Degradation triggers a formal review before any changes are deployed. |
| **Security** | Security monitoring is active from go-live. Incident response procedures are in place and tested. Vulnerability scanning continues on a scheduled basis. |
| **Transparency** | Model documentation is kept current, updated at least quarterly. Inference logs are maintained and accessible to authorised oversight bodies. |
| **Explainability** | Live explanations are audited in the first monthly review. User feedback on explanation quality is collected and acted on. |
| **Fairness** | The fairness dashboard is live from day one. Bias alerts are triaged within five business days. Any change to the data corpus triggers a re-assessment before it affects outputs. |
| **Compliance** | Compliance obligations are actively maintained, not assumed to be satisfied from Gate 4. Any regulatory change triggers a formal review within 30 days. |
| **Human Oversight** | Human review gates are enforced in production. Override patterns are reviewed monthly. Reviewer capacity is monitored and any shortfall is formally documented. |
| **Monitoring** | Monthly health reports, quarterly reviews, and an annual compliance assessment are issued on schedule. Any significant system or context change triggers an immediate review cycle. |
