# Data Model

This document defines the logical model. Implementation may normalize these objects into relational tables while preserving the documented JSON export format.

## 1. Architecture document

```json
{
  "schemaVersion": 1,
  "projectId": "project-demo",
  "name": "Three-tier web application",
  "region": "ap-northeast-1",
  "nodes": [
    {
      "id": "vpc-main",
      "type": "VPC",
      "label": "Main VPC",
      "config": { "cidr": "10.0.0.0/16" },
      "position": { "x": 80, "y": 80 },
      "parentId": null
    },
    {
      "id": "subnet-app-a",
      "type": "Subnet",
      "label": "App subnet A",
      "config": {
        "cidr": "10.0.1.0/24",
        "availabilityZone": "ap-northeast-1a",
        "publicIpOnLaunch": false
      },
      "position": { "x": 240, "y": 180 },
      "parentId": "vpc-main"
    }
  ],
  "edges": [
    {
      "id": "edge-subnet-vpc",
      "source": "subnet-app-a",
      "target": "vpc-main",
      "relationType": "CONTAINED_IN"
    }
  ]
}
```

## 2. Core entities
### Project
- `id: UUID/string`
- `name`
- `description`
- `createdAt`, `updatedAt`
- `schemaVersion`
- `architectureDocument`

### ResourceDefinition
- `type`
- `displayName`
- `category`
- `configSchema`
- `allowedParentTypes`
- `allowedRelationships`
- `supportedSimulationCapabilities`
- `validationRuleIds`

### ArchitectureNode
- `id`
- `type`
- `label`
- `config`
- `position`
- `parentId`
- `metadata`

### ArchitectureEdge
- `id`
- `source`
- `target`
- `relationType`
- `sourceHandle`
- `targetHandle`
- `metadata`

### Scenario
- `id`
- `title`
- `domainIds`
- `objectiveIds`
- `startingArchitecture`
- `faultDefinitions`
- `tasks`
- `hints`
- `rubric`
- `expectedOutcomes`
- `contentVersion`

### FaultDefinition
- `id`
- `name`
- `description`
- `preconditions`
- `statePatch`
- `expectedSymptoms`
- `rootCause`
- `acceptedFixes`
- `regressionChecks`
- `severity`

### SimulationRun
- `id`
- `architectureSnapshot`
- `snapshotHash`
- `simulationType`
- `input`
- `status`
- `traceSteps`
- `ruleEngineVersion`
- `createdAt`

### LearningObjective
- `id`
- `domainId`
- `title`
- `description`
- `prerequisites`
- `serviceTags`
- `sourceReferences`

### Question
- `id`
- `domainId`
- `objectiveIds`
- `format`: `single` or `multiple`
- `difficulty`
- `stem`
- `options`
- `correctOptionIds`
- `rationale`
- `distractorRationales`
- `references`
- `relatedLabIds`
- `reviewStatus`: `draft` or `verified`
- `contentVersion`

### LabAttempt
- `id`
- `scenarioId`
- `startedAt`
- `completedAt`
- `actions`
- `hintsUsed`
- `score`
- `passed`
- `rootCauseIdentified`
- `simulationRunIds`

### QuestionAttempt
- `id`
- `questionId`
- `selectedOptionIds`
- `isCorrect`
- `timeSpentSeconds`
- `answeredAt`

## 3. Relationship rules
- `parentId` expresses containment/grouping only.
- `relationType` expresses a typed domain relationship.
- A relationship edge does not imply that packets can flow between resources.
- Network reachability must be computed by the simulation engine from network configuration and supported rules.
- Deleting a node must handle incident edges and child resources predictably.
- Imported documents must reject duplicate IDs, dangling edge references, invalid parent references, and unsupported schema versions.

## 4. Initial resource configs
### VPC
`cidr`, `enableDnsSupport`, `enableDnsHostnames`

### Subnet
`cidr`, `availabilityZone`, `publicIpOnLaunch`, `parentVpcId`

### RouteTable
`routes[]`, `associatedSubnetIds[]`

### InternetGateway
`attachedVpcId`

### NatGateway
`subnetId`, `elasticIpPresent`, `state`

### SecurityGroup
`vpcId`, `inboundRules[]`, `outboundRules[]`

### EC2
`instanceType`, `state`, `subnetId`, `securityGroupIds[]`, `iamRoleId`, `privateIp`, `publicIpPresent`

### ALB
`scheme`, `subnetIds[]`, `listenerRules[]`, `targetIds[]`, `healthCheck`

### RDS
`engine`, `port`, `subnetGroupIds[]`, `securityGroupIds[]`, `publiclyAccessible`, `multiAz`, `state`, `encryptionEnabled`

### S3
`blockPublicAccess`, `bucketPolicy`, `versioningEnabled`, `encryptionMode`

### IAM Role/Policy
A documented subset of policy statements: `effect`, `actions`, `resources`, and supported condition keys. Unsupported IAM semantics must return `UNSUPPORTED`, not a false allow/deny conclusion.
