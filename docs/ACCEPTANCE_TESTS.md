# Acceptance Tests

## 1. Editor
- [ ] User can add each initial resource type to the canvas.
- [ ] User can move, select, rename, configure, and delete a node.
- [ ] User can create a typed edge only when the relationship is allowed, or receives a clear validation message.
- [ ] Parent/child grouping is visually distinct from data-flow/network edges.
- [ ] Deleting a node handles incident edges and children predictably.
- [ ] Undo/redo restores graph and configuration state if included in the milestone.
- [ ] Save, close/reload, and reopen preserve nodes, edges, config, and positions.
- [ ] Import rejects malformed JSON, duplicate IDs, dangling edges, invalid parent links, oversized documents, and unsupported schema versions.
- [ ] Exported JSON contains no credentials or secrets.

## 2. Validation
- [ ] Invalid CIDR is rejected with a field-specific message.
- [ ] Subnet CIDR outside the VPC is rejected for supported IPv4 cases.
- [ ] Overlapping subnet CIDRs in the same VPC are rejected for supported IPv4 cases.
- [ ] Invalid relationship types are reported.
- [ ] Missing required references are reported.
- [ ] Unsupported validation semantics are not silently treated as valid.

## 3. Simulation
- [ ] A valid modeled connectivity path returns PASS with an ordered trace.
- [ ] A route failure returns FAIL and the correct rule ID.
- [ ] A Security Group ingress failure returns FAIL and identifies the affected resource.
- [ ] A NACL return-path failure can be reproduced for a supported scenario.
- [ ] Same snapshot/request/seed/engine version produces the same semantic result.
- [ ] The engine does not mutate the saved architecture.
- [ ] Unsupported IAM conditions return UNSUPPORTED rather than a false authorization result.
- [ ] Trace contains evidence and explains the modeled assumptions.
- [ ] UI distinguishes FAIL from UNSUPPORTED.

## 4. Fault lab
- [ ] Starting a lab creates an isolated attempt state.
- [ ] Injecting a fault does not mutate the source project.
- [ ] Reset restores the exact initial scenario state.
- [ ] Replay produces the same semantic trace.
- [ ] A correct fix passes the relevant regression checks.
- [ ] A broad/insecure fix such as opening a database to the internet is rejected or penalized by rubric.
- [ ] Hints are progressive and answer keys are not returned by the public lab endpoint before completion.

## 5. Exam practice
- [ ] Single-choice question accepts exactly one selected option.
- [ ] Multiple-response question validates the selected option set.
- [ ] Correct answer is not exposed before submission in an active session.
- [ ] Every verified question has a rationale and distractor rationales.
- [ ] Attempts persist and appear in progress summaries.
- [ ] Questions can be filtered by domain/topic/difficulty.
- [ ] No imported proprietary exam dumps are included.

## 6. Dashboard
- [ ] Domain/topic statistics derive from actual attempts.
- [ ] Empty state is useful for a new learner.
- [ ] Recommendations reference real weak topics or incomplete labs.
- [ ] The app does not claim a guaranteed pass probability.

## 7. Engineering quality
- [ ] Backend unit tests run offline.
- [ ] Frontend tests, type check, lint, and production build pass.
- [ ] API validation errors use a consistent envelope.
- [ ] No credentials are needed for core flows.
- [ ] All simulation rules have pass/fail/unsupported tests as applicable.
- [ ] README setup instructions work on a clean checkout.
