import { z } from 'zod';

export const RESOURCE_TYPES = [
  'VPC',
  'Subnet',
  'RouteTable',
  'InternetGateway',
  'NatGateway',
  'SecurityGroup',
  'EC2',
  'ALB',
  'RDS',
  'S3',
  'IAMRole',
  'IAMPolicy',
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];
export type ResourceConfig = Record<string, string | number | boolean>;

export const RELATION_TYPES = [
  'CONTAINED_IN',
  'ASSOCIATED_WITH',
  'ROUTES_TO',
  'ATTACHED_TO',
  'PROTECTS',
  'TARGETS',
  'USES_ROLE',
  'CONNECTS_TO',
  'POLICY_FOR',
] as const;

export type RelationType = (typeof RELATION_TYPES)[number];

export interface ArchitectureNode {
  id: string;
  type: ResourceType;
  label: string;
  config: ResourceConfig;
  position: { x: number; y: number };
  parentId: string | null;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  relationType: RelationType;
}

export interface ArchitectureDocument {
  schemaVersion: 1;
  projectId: string;
  name: string;
  region: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

const configSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]));

const architectureSchema = z.object({
  schemaVersion: z.literal(1),
  projectId: z.string().min(1),
  name: z.string().min(1),
  region: z.string().min(1),
  nodes: z.array(z.object({
    id: z.string().min(1),
    type: z.enum(RESOURCE_TYPES),
    label: z.string().min(1),
    config: configSchema,
    position: z.object({ x: z.number().finite(), y: z.number().finite() }),
    parentId: z.string().nullable(),
  })),
  edges: z.array(z.object({
    id: z.string().min(1),
    source: z.string().min(1),
    target: z.string().min(1),
    relationType: z.enum(RELATION_TYPES),
  })),
});

const SECRET_KEY = /(secret|password|credential|access.?key|token)/i;
const MAX_DOCUMENT_LENGTH = 1_000_000;
const MAX_NODES = 250;
const MAX_EDGES = 500;

export type ArchitectureValidation =
  | { success: true; data: ArchitectureDocument }
  | { success: false; errors: string[] };

function containsSecretKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsSecretKey);
  if (value === null || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) => SECRET_KEY.test(key) || containsSecretKey(child));
}

export function validateArchitecture(value: unknown): ArchitectureValidation {
  const parsed = architectureSchema.safeParse(value);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues.map((issue) => `${issue.path.join('.') || 'document'}: ${issue.message}`) };
  }

  const document = parsed.data;
  const errors: string[] = [];
  if (document.nodes.length > MAX_NODES) errors.push(`Document exceeds the ${MAX_NODES}-node limit.`);
  if (document.edges.length > MAX_EDGES) errors.push(`Document exceeds the ${MAX_EDGES}-edge limit.`);

  const nodeIds = new Set<string>();
  const nodeById = new Map(document.nodes.map((node) => [node.id, node]));
  for (const node of document.nodes) {
    if (nodeIds.has(node.id)) errors.push(`Duplicate node id: ${node.id}.`);
    nodeIds.add(node.id);
    if (node.parentId && !document.nodes.some((candidate) => candidate.id === node.parentId)) {
      errors.push(`Node ${node.id} refers to missing parent ${node.parentId}.`);
    }
    if (containsSecretKey(node.config)) errors.push(`Node ${node.id} contains a credential-like field.`);
  }

  const edgeIds = new Set<string>();
  for (const edge of document.edges) {
    if (edgeIds.has(edge.id)) errors.push(`Duplicate edge id: ${edge.id}.`);
    edgeIds.add(edge.id);
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) {
      errors.push(`Edge ${edge.id} refers to a missing endpoint.`);
    } else if (!canConnect(sourceNode.type, targetNode.type, edge.relationType)) {
      errors.push(`Relationship ${edge.relationType} is not allowed from ${sourceNode.type} to ${targetNode.type}.`);
    }
  }

  const parentById = new Map(document.nodes.map((node) => [node.id, node.parentId]));
  for (const node of document.nodes) {
    const visited = new Set<string>([node.id]);
    let parentId = node.parentId;
    while (parentId) {
      if (visited.has(parentId)) {
        errors.push(`Parent relationship cycle includes node ${node.id}.`);
        break;
      }
      visited.add(parentId);
      parentId = parentById.get(parentId) ?? null;
    }
  }

  if (errors.length) return { success: false, errors: [...new Set(errors)] };
  return { success: true, data: document as ArchitectureDocument };
}

export function parseArchitectureJson(text: string): ArchitectureValidation {
  if (text.length > MAX_DOCUMENT_LENGTH) {
    return { success: false, errors: ['Architecture JSON exceeds the 1 MB size limit.'] };
  }
  try {
    return validateArchitecture(JSON.parse(text) as unknown);
  } catch {
    return { success: false, errors: ['File is not valid JSON.'] };
  }
}

export function canConnect(source: ResourceType, target: ResourceType, relation: RelationType): boolean {
  const allowedPairs: Record<RelationType, Array<[ResourceType, ResourceType]>> = {
    CONTAINED_IN: [['Subnet', 'VPC']],
    ASSOCIATED_WITH: [['RouteTable', 'Subnet'], ['SecurityGroup', 'VPC']],
    ROUTES_TO: [['RouteTable', 'InternetGateway'], ['RouteTable', 'NatGateway']],
    ATTACHED_TO: [['InternetGateway', 'VPC'], ['NatGateway', 'Subnet']],
    PROTECTS: [['SecurityGroup', 'EC2'], ['SecurityGroup', 'RDS'], ['SecurityGroup', 'ALB']],
    TARGETS: [['ALB', 'EC2']],
    USES_ROLE: [['EC2', 'IAMRole']],
    CONNECTS_TO: [['EC2', 'RDS']],
    POLICY_FOR: [['IAMPolicy', 'IAMRole'], ['IAMPolicy', 'S3']],
  };
  return allowedPairs[relation].some(([allowedSource, allowedTarget]) => source === allowedSource && target === allowedTarget);
}