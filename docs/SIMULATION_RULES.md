# Simulation Rules and Supported Semantics

## 1. Purpose
Provide deterministic, educationally useful explanations of a documented subset of AWS behavior. This is not a full AWS emulator and must not claim exact parity with AWS.

## 2. Result statuses
- `PASS`: all modeled checks for the requested operation passed.
- `FAIL`: a modeled rule definitively failed.
- `WARN`: architecture has a concern but the request may still work.
- `DEGRADED`: modeled operation works under reduced availability/capacity.
- `UNSUPPORTED`: engine cannot safely determine the outcome from implemented semantics.

## 3. Rule result schema
Each rule result includes:
- `ruleId`
- `status`
- `summary`
- `details`
- `affectedResourceIds`
- `evidence` (configuration fields used)
- `suggestedNextChecks`
- `suggestedFix` (optional)
- `limitations` (optional)

The rule engine should return structured results. UI text is a presentation layer, not the source of truth.

## 4. Determinism
Given the same architecture snapshot, simulation request, fault state, rule-engine version, and seed, the semantic result must be identical. Do not use random behavior without a seed. Do not base pass/fail on wall-clock timings.

## 5. Initial supported rules
### Architecture validation
- required resource fields exist and match schema;
- node IDs are unique;
- edge endpoints exist;
- parent references are valid and acyclic;
- relation types are allowed for source/target types;
- Subnet CIDRs are contained within the referenced VPC CIDR and do not overlap within that VPC (for supported IPv4 CIDR cases);
- required VPC/subnet references exist.

### Basic routing
For the documented IPv4 subset:
- select the most specific matching route;
- detect local VPC route;
- detect route to Internet Gateway or NAT Gateway when configured;
- check subnet route-table association;
- distinguish route reachability from security permission;
- public IPv4 internet reachability requires the relevant route and appropriate public addressing assumptions;
- private subnet egress through NAT requires a valid NAT path and public-subnet route to IGW;
- do not infer that placing a resource in a subnet alone makes it public.

### Security Group / NACL
- Security Groups are stateful; NACLs are stateless.
- Evaluate only the supported protocol/port/CIDR/source-SG rule subset.
- For NACLs, evaluate inbound and outbound rules and ephemeral-port assumptions only when those assumptions are explicit in the scenario.
- Do not model every AWS packet-processing nuance in the first release.
- Missing/unsupported rule semantics should produce `UNSUPPORTED` or a limitation note rather than a confident but incorrect answer.

### IAM and S3 (limited subset)
- Evaluate simple Allow/Deny statements for explicit action/resource matches.
- Explicit Deny takes precedence within the modeled policy subset.
- Distinguish identity policy and bucket policy as separate inputs.
- Do not claim full IAM evaluation. Unsupported conditions, permission boundaries, SCPs, session policies, access points, ACL interactions, or cross-account details must be identified as unsupported unless implemented and tested.
- S3 public access block, bucket policy, and identity policy must not be collapsed into one simplistic boolean.

### Service behavior
- EC2 states are scenario states, not actual instances.
- ALB/target group health is a simplified state model.
- RDS Multi-AZ models failover availability concepts, not exact failover timing.
- SQS models decoupling/retry/DLQ concepts, not real delivery guarantees at protocol depth.
- CloudFront models cache hit/miss and origin dependency at a conceptual level.
- Cost calculations are illustrative estimates using a versioned price dataset, if implemented; never represent estimates as a live AWS bill.

## 6. Fault lifecycle
A fault definition must include:
- `id`, `name`, `description`
- `preconditions`
- `statePatch` or deterministic fault handler
- `expectedSymptoms`
- `rootCause`
- `acceptedFixes`
- `regressionChecks`
- `severity`
- `supportedEngineVersion`

Fault injection must operate on a scenario copy. The original project architecture must not be mutated unless the user explicitly chooses to apply the changes.

## 7. Example rule IDs
- `ARCH_NODE_ID_UNIQUE`
- `VPC_CIDR_VALID`
- `SUBNET_CIDR_WITHIN_VPC`
- `SUBNET_CIDR_NO_OVERLAP`
- `ROUTE_TABLE_ASSOCIATION_REQUIRED`
- `ROUTE_NO_MATCH`
- `IGW_ATTACHMENT_REQUIRED`
- `NAT_EGRESS_PATH_INVALID`
- `SG_INGRESS_PORT_BLOCKED`
- `NACL_RETURN_TRAFFIC_BLOCKED`
- `IAM_ACTION_NOT_ALLOWED`
- `S3_PUBLIC_ACCESS_BLOCKED`
- `RDS_PUBLIC_EXPOSURE_WARNING`
- `ALB_NO_HEALTHY_TARGETS`

## 8. Required tests per rule
For every rule:
- one minimal passing test;
- one minimal failing test;
- boundary/edge test where applicable;
- test for unsupported semantics;
- stable expected rule ID and status;
- no reliance on network access or AWS credentials.

## 9. Educational quality
A remediation must be narrow and context-sensitive. For example, fixing app-to-RDS access should prefer allowing the app Security Group on the database port rather than opening the database to `0.0.0.0/0`. Explain why the fix works and which assumptions were modeled.
