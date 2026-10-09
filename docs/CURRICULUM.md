# Initial Curriculum — SAA-C03

## Important
Use the current official AWS exam guide as the source of truth for domains and objectives before publishing content. Domain weights can change. Keep question/lab content versioned and review it when the exam guide changes.

The curriculum should map each lab/question to:
- exam domain;
- objective(s);
- AWS service tags;
- prerequisite concepts;
- difficulty;
- references to official AWS documentation.

## 12 initial labs

### Domain 1 — Design Secure Architectures
#### LAB-SEC-01: S3 AccessDenied
- Objective: reason about identity policy, bucket policy, explicit deny, and Block Public Access in the supported subset.
- Start state: user/role requests `GetObject`; bucket has a restrictive policy.
- Task: identify the policy layer causing denial and implement least-privilege access.
- Fault: required action/resource does not match an allow, or an explicit deny exists.
- Pass: intended principal can perform only the required action; public access is not introduced.
- Tests: allowed object; denied unrelated object; explicit deny wins in supported subset; unsupported condition returns UNSUPPORTED.

#### LAB-SEC-02: EC2 access to S3
- Objective: understand IAM role credentials conceptually and private access patterns.
- Start state: EC2 has no appropriate role or modeled access path.
- Task: configure role/policy and, optionally, a modeled S3 VPC endpoint path.
- Pass: access works within the modeled assumptions without hard-coded user keys.
- Note: endpoint policy behavior must be explicitly modeled or marked unsupported.

#### LAB-SEC-03: Protect an RDS database
- Objective: private database placement, security group source restrictions, encryption setting.
- Start state: RDS has an unsafe exposure or an overly broad inbound rule.
- Task: restrict access to application tier and enable modeled encryption configuration.
- Pass: app can connect; arbitrary internet source cannot connect under the modeled network rules.

### Domain 2 — Design Resilient Architectures
#### LAB-RES-01: Single EC2 failure
- Objective: compare single instance with ALB + Auto Scaling across multiple AZs.
- Fault: one instance stops or becomes unhealthy.
- Pass: remaining healthy target serves the request when modeled capacity and health checks allow it.

#### LAB-RES-02: RDS Multi-AZ versus read replica
- Objective: distinguish high availability/failover from read scaling.
- Task: choose a design based on a stated requirement.
- Pass: explanation matches the requirements; do not imply a read replica is automatically equivalent to Multi-AZ failover.

#### LAB-RES-03: Traffic spike and queueing
- Objective: decouple request ingestion and processing with SQS.
- Fault: consumer capacity is reduced and queue depth rises.
- Pass: producer remains decoupled under the simplified model; learner identifies backlog and recovery considerations.

### Domain 3 — Design High-Performing Architectures
#### LAB-PERF-01: Static content latency
- Objective: compare direct S3 origin access with CloudFront.
- Task: add a CDN and choose a cache policy at a conceptual level.
- Pass: modeled cache hits reduce origin requests; no claim of real latency measurements.

#### LAB-PERF-02: Read-heavy database workload
- Objective: compare caching, read replicas, and DynamoDB based on access pattern.
- Task: select an architecture given data shape, consistency, and access pattern.
- Pass: learner justification matches stated constraints; simulator uses a simplified workload model.

#### LAB-PERF-03: S3 versus EBS versus EFS
- Objective: select object, block, or shared file storage.
- Task: match requirements to storage model.
- Pass: correct fit for access pattern, sharing, and durability/availability requirements.

### Domain 4 — Design Cost-Optimized Architectures
#### LAB-COST-01: Compute purchasing options
- Objective: compare On-Demand, Savings Plans, and Spot conceptually.
- Task: choose based on interruption tolerance and predictable usage.
- Pass: no unsupported claim of current exact pricing; prices must be versioned if estimates are shown.

#### LAB-COST-02: S3 storage classes
- Objective: select a storage class using access pattern, retrieval needs, and minimum-duration considerations.
- Task: optimize a stated archive workload.
- Pass: learner explains cost and retrieval trade-offs; current pricing details link to official pricing pages.

#### LAB-COST-03: Lambda versus EC2
- Objective: compare operational overhead and cost for intermittent versus steady workloads.
- Task: choose a service given duration, concurrency, execution model, and runtime constraints.
- Pass: recommendation states assumptions and does not rely on a universal “serverless is always cheaper” rule.

## Question bank
Start with 60–100 original questions, but publish only reviewed questions.
Each question must:
- be authored from learning objectives, not copied from exam dumps;
- state constraints precisely (availability, RTO/RPO, cost, operations, performance, security);
- have one defensible best answer or a clearly specified multiple-response answer;
- explain why every distractor is less suitable;
- cite official documentation or a stable reference;
- link to a lab when useful;
- carry `draft` or `verified` status.

## Study sequencing
1. Networking and IAM foundations.
2. Security labs.
3. Resilience and recovery.
4. Performance and storage.
5. Cost trade-offs.
6. Mixed-domain practice.
7. Revisit weak topics based on attempts.

Do not infer exam readiness from one short quiz. Show domain trends, recency, number of attempts, and coverage.
