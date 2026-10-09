# AWS Lab Studio — Coding Agent Pack

This repository contains the initial product and engineering specification for an MVP that helps learners prepare for AWS Certified Solutions Architect – Associate (SAA-C03) through visual architecture building, deterministic simulation, fault injection, guided labs, and exam practice.

## Documents
- `AGENT_INSTRUCTIONS.md` — execution contract for the coding agent; read first.
- `PRD.md` — product scope, users, journeys, and MVP boundaries.
- `ARCHITECTURE.md` — proposed application architecture and technology choices.
- `DATA_MODEL.md` — domain entities and JSON examples.
- `API_CONTRACT.md` — initial REST API contract.
- `SIMULATION_RULES.md` — supported behavior, assumptions, and rule-engine design.
- `CURRICULUM.md` — SAA-C03-aligned initial learning plan and 12 labs.
- `ACCEPTANCE_TESTS.md` — functional and technical acceptance criteria.
- `IMPLEMENTATION_PLAN.md` — staged delivery plan and definition of done.

## Recommended first run
1. Give the entire pack to the coding agent.
2. Ask the agent to inspect the repository before making changes.
3. Have it implement Milestone 0 and Milestone 1 only.
4. Require tests and a short implementation report before proceeding.
5. Do not build all milestones in one giant change.

## Product principles
1. Local-first; no AWS credentials required for default mode.
2. Deterministic rule-based simulation before AI-generated explanations.
3. Explicitly label what is simulated and what is not supported.
4. No claim of exact parity with AWS.
5. Original practice questions only; no exam dumps or copyrighted question banks.
6. A successful UI demo is not sufficient without tested behavior.

## Suggested stack
- Frontend: React + TypeScript + Vite, `@xyflow/react`, Zustand, React Hook Form, Zod.
- Backend: FastAPI + Pydantic.
- Persistence: SQLite for MVP, with a repository layer that can later support PostgreSQL.
- Tests: Pytest for backend, Vitest + React Testing Library for frontend.
- Local runtime: Docker Compose, with optional non-Docker development instructions.

The coding agent may propose alternatives, but must document the reason and preserve the product boundaries and acceptance criteria.
