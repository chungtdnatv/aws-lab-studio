# AWS Lab Studio

AWS Lab Studio is a local-first visual architecture editor for AWS learning. The current release implements Milestones 0 and 1: a resource canvas, typed relationships, a configuration inspector, browser-local save/load, and JSON import/export.

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

## Current implementation status

- Frontend: React, TypeScript, Vite, React Flow, Zustand, React Hook Form, and Zod.
- Backend: FastAPI health endpoint only; architecture editing and persistence run in the browser.
- Tests/tooling: Vitest, ESLint, TypeScript checks, Vite production build, Pytest, Ruff, and mypy configuration.
- Simulation, AWS provisioning, cloud credentials, and learning/exam workflows are not implemented.

## Setup

Requirements: Node.js 20+ with npm, and Python 3.11+ with pip for the optional API.

```powershell
npm install
npm run dev
```

Open the Vite URL printed in the terminal (normally `http://localhost:5173`). The editor works without starting the API. To run the local health endpoint in another terminal:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -e ".[dev]"
uvicorn app.main:app --reload
```

## Checks

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Backend checks (from `backend` after installing development dependencies):

```powershell
python -m pytest
ruff check app tests
mypy app
```

## Editor behavior

- Add the 12 initial resource types from the palette; drag, select, rename, configure, connect, or delete resources on the canvas.
- Choose a relationship type before connecting. Incompatible source/target types are rejected with a visible message.
- Save and load one architecture in browser local storage, or import/export the versioned JSON format.
- Import checks schema version, field types, node and edge limits, duplicate IDs, dangling references, parent cycles, malformed JSON, and credential-like configuration keys. These are document integrity checks, not AWS architecture validation.
- Project data stays in browser storage or in files explicitly exported by the user. Do not put secrets in project files.

## Known limitations

- Save/load is browser-local and currently stores one project; there is no project list or backend database.
- Resource forms contain a small set of editable starter fields, not complete AWS schemas.
- Relationship compatibility is a small editor allowlist; edges do not indicate packet reachability.
- No CIDR, dependency, or AWS behavior validation is provided yet. The UI explicitly does not offer simulation.
- No undo/redo, grouping controls, zoom/pan shortcuts beyond React Flow defaults, or mobile drag-and-drop palette are included.

## Next milestone

Milestone 2: resource registry and domain validation, including supported IPv4 CIDR checks and rule-level tests. Work stops here until that milestone is approved.

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
