# Implementation Plan

## Milestone 0 — Repository and engineering foundation
- Inspect repo; document current state.
- Scaffold frontend/backend and shared development scripts.
- Add formatting, lint, test, type-check, and build commands.
- Add a root README and `.env.example` with no secrets.
- Establish API error format and health endpoint.
Definition of done: clean install and all initial checks pass.

## Milestone 1 — Visual editor vertical slice
- Create application shell: project list or starter project, canvas, palette, inspector.
- Add resource nodes for VPC, Subnet, Route Table, IGW, NAT Gateway, Security Group, EC2, ALB, RDS, S3, IAM Role/Policy.
- Support add, move, select, rename, configure minimal fields, connect, delete.
- Add parent grouping for VPC/subnet where practical.
- Save/load/export/import architecture JSON.
- Validate imported document.
Definition of done: a user can create, save, reload, and export a sample architecture; tests cover serialization and import validation.

## Milestone 2 — Registry and validation
- Implement resource definition registry.
- Add schema validation and typed relationships.
- Add CIDR and dependency validation for supported IPv4 cases.
- Expose validation panel with rule IDs and remediation text.
Definition of done: every implemented validation rule has passing, failing, and edge-case tests.

## Milestone 3 — Deterministic network simulation
- Implement route selection and subnet route-table association.
- Implement modeled IGW/NAT paths.
- Implement supported Security Group/NACL rule evaluation.
- Return immutable ordered trace.
Definition of done: end-to-end tests cover at least 5 connectivity scenarios; unsupported cases are explicit.

## Milestone 4 — IAM/S3 subset and fault injection
- Implement only documented IAM/S3 policy subset.
- Add scenario state isolation, fault definitions, inject/reset/replay.
- Add 4–6 initial fault labs.
Definition of done: fixes can be verified by regression checks and source architecture remains unchanged.

## Milestone 5 — Guided labs
- Add objectives, hints, checkpoints, rubrics, lab attempts.
- Complete 12 initial labs progressively; prioritize correctness over quantity.
Definition of done: at least 4 polished labs (one per domain) are fully playable; remaining labs can be staged for next release if necessary.

## Milestone 6 — Exam practice and progress
- Add original questions, session flow, scoring, rationales.
- Add domain/topic dashboard and weak-topic recommendations.
Definition of done: question answers persist and correct answers are hidden until submission.

## Milestone 7 — QA and local release
- Add Docker Compose and clean setup guide.
- Test import/export, regression, persistence, accessibility basics.
- Verify content against current official exam guide.
- Publish simulation limitations clearly.
Definition of done: acceptance checklist passes and no critical issue remains.

## Schedule suggestion
An 8-week full-time plan is a target, not a guarantee:
- W1: foundation + editor shell
- W2: resource model + validation
- W3: network simulation
- W4: faults + first labs
- W5: guided labs
- W6: exam practice + progress
- W7: regression and user testing
- W8: packaging and release

For one developer working part-time, allow roughly 10–14 weeks or reduce scope.

## Recommended MVP release gate
Release only when:
- the editor reliably saves/loads projects;
- core network rules are covered by tests;
- at least 4 end-to-end labs work, one per exam domain;
- every released question is reviewed and original;
- limitations are visible in the UI and documentation.
