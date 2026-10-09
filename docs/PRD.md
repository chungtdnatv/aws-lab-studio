# Product Requirements Document

## 1. Product summary
AWS Lab Studio is a visual, local-first AWS learning simulator for people preparing for AWS Certified Solutions Architect – Associate (SAA-C03). It combines architecture building, configuration validation, deterministic simulation, fault injection, guided labs, and original exam-style practice.

## 2. Problem
Learners often memorize service definitions and answer multiple-choice questions without understanding why a design works, where requests fail, or how to compare solutions against requirements such as high availability, low operational overhead, security, performance, and cost.

## 3. Product goals
- Make AWS architecture concepts visible and manipulable.
- Let learners see deterministic explanations for supported configuration failures.
- Provide repeatable fault scenarios and recovery workflows.
- Connect labs to SAA-C03 learning objectives.
- Help learners identify weak domains and revisit relevant topics.
- Run locally without an AWS account or cloud costs.

## 4. Non-goals for MVP
- Full AWS service emulation or exact parity with AWS.
- Provisioning resources in a real AWS account.
- A general-purpose IaC authoring platform.
- Multi-user collaboration, public template marketplace, or social features.
- AI deciding whether a simulation passes.
- Claiming an estimated score guarantees exam success.
- Importing real exam dumps or proprietary question banks.

## 5. Primary persona
A learner with basic cloud concepts who is studying SAA-C03 and wants to practice architecture trade-offs visually. The learner may have limited hands-on AWS experience and needs explanations that connect configuration to outcomes.

## 6. Main user journeys
### Journey A — Build
1. Create a project or load a template.
2. Add resources from a palette.
3. connect resources with typed relationships.
4. Place resources inside logical groups such as VPC, subnet, and Availability Zone.
5. Configure each resource in an inspector.
6. Validate and save the architecture.

### Journey B — Simulate
1. Choose a supported simulation action, such as test connectivity from an application node to a database.
2. Engine validates the architecture snapshot.
3. Engine evaluates applicable rules in a deterministic order.
4. UI shows PASS/BLOCKED/DEGRADED/UNSUPPORTED steps with explanations.
5. Learner changes configuration and runs again.
6. Learner compares run traces.

### Journey C — Troubleshoot
1. Start a lab with a known initial architecture and one or more hidden faults.
2. Observe symptoms without immediately seeing the answer.
3. Inspect resources and run diagnostics.
4. Choose a hypothesis or change configuration.
5. Run the scenario again.
6. Receive root cause, acceptable fixes, and regression results.

### Journey D — Exam practice
1. Select a domain, topic, difficulty, and question format.
2. Answer single-choice or multiple-response question.
3. Receive explanation for the correct answer and each distractor.
4. Open an associated lab or architecture when available.
5. Save the result and schedule/recommend review.

## 7. MVP scope
### Must have
- Visual canvas with node palette, edges, grouping, select/move/delete, zoom/pan, undo/redo if feasible, and JSON save/load.
- Typed resource schemas and inspector forms.
- Initial resource types: VPC, Subnet, Route Table, Internet Gateway, NAT Gateway, Security Group, EC2, ALB, RDS, S3, IAM Role/Policy. Other services can be represented in content before they are fully simulated.
- Deterministic validation engine with explicit support boundaries.
- Network reachability checks for a documented subset of VPC routing and security controls.
- Basic IAM/S3 policy scenarios with clearly documented simplifications.
- Fault injection, reset, replay, and immutable simulation traces.
- Guided labs with objectives, hints, checkpoints, rubric, and expected outcome.
- Original exam-style questions, rationale for all options, and domain/topic tags.
- Progress dashboard by exam domain and topic.
- Local-first persistence and project export/import.

### Later
- LocalStack integration.
- IaC export/import.
- More service models and rules.
- AI tutor as a separate, non-authoritative explanation layer.
- Real AWS sandbox mode with explicit user consent, cost warnings, least-privilege IAM, and cleanup automation.

## 8. UX requirements
- Separate Learn, Troubleshoot, and Exam modes.
- Keep the inspector contextual to the selected node or edge.
- Use clear visual status labels: PASS, FAIL, WARN, DEGRADED, UNSUPPORTED.
- A rule failure must identify the rule, affected resource, observed condition, and next diagnostic step.
- Hints should reveal progressively more detail.
- Distinguish “invalid architecture” from “unsupported by simulator”.
- Provide undo/reset and a clear warning before discarding work.
- Use AWS service names accurately but do not imply endorsement by AWS.

## 9. Success metrics for initial validation
- A new user can build and save a small architecture without instructions.
- A learner can complete a lab and explain the root cause in their own words.
- Every supported rule has automated tests for pass and fail conditions.
- Learners can identify weakest exam domain from dashboard.
- No AWS account or credentials are required for the default experience.

These are product validation goals, not claims of exam pass prediction.
