# Instructions for Coding Agent

## Mission
Build AWS Lab Studio, a local-first visual learning environment for AWS Solutions Architect Associate preparation. Users assemble AWS-like architectures, configure resources, run deterministic simulations, inject faults, troubleshoot, complete guided labs, and practice original exam-style questions.

## Work rules
1. Inspect the existing repository and report its current state before editing.
2. If the repository is empty, scaffold the project using the stack in `ARCHITECTURE.md`.
3. Read all specification files before implementing.
4. Implement incrementally by milestone. Do not attempt the entire product in one change.
5. Keep simulation logic independent from UI components and graph-library types.
6. Every simulation rule must have positive and negative tests.
7. Never label unsupported behavior as accurately simulated AWS behavior.
8. Do not require AWS credentials or create cloud resources in the default mode.
9. Do not use real AWS account identifiers, secrets, or credentials in fixtures.
10. Use original exam-style questions. Never import exam dumps or claim questions are actual AWS exam questions.
11. Prefer simple, typed, testable code over premature abstraction.
12. Avoid adding an LLM dependency to the core simulation path. AI can be considered later as an optional explanation layer.
13. Do not silently add authentication, billing, analytics, cloud deployment, or other out-of-scope features.
14. Keep accessibility, keyboard operation, readable errors, and responsive layout in mind.
15. Do not claim a command or test passed unless it was actually run.

## Required workflow for every milestone
- State intended files and scope.
- Implement the smallest complete vertical slice.
- Run relevant tests, lint, type checks, and build.
- Fix failures caused by the change.
- Update docs if implementation decisions changed.
- Summarize files changed, tests run and results, known limitations, and next milestone.
- Stop at the milestone boundary and wait for approval unless explicitly instructed to continue.

## First task
Implement Milestone 0 and Milestone 1 from `IMPLEMENTATION_PLAN.md`:
- project scaffold;
- editor shell;
- resource palette with the initial resource types;
- canvas with add/move/select/connect/delete behavior;
- inspector for resource name and a minimal typed config;
- save/load local project JSON;
- basic tests and development instructions.

Do not implement the full simulation engine in the first task. Add clear interfaces/stubs only where needed, and do not fake simulation results.
