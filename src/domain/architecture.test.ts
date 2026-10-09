import { describe, expect, it } from 'vitest';
import { canConnect, parseArchitectureJson, validateArchitecture, type ArchitectureDocument } from './architecture';

const sample: ArchitectureDocument = {
  schemaVersion: 1,
  projectId: 'project-local',
  name: 'Starter',
  region: 'ap-northeast-1',
  nodes: [
    { id: 'vpc', type: 'VPC', label: 'Main VPC', config: { cidr: '10.0.0.0/16' }, position: { x: 20, y: 30 }, parentId: null },
    { id: 'subnet', type: 'Subnet', label: 'App subnet', config: { cidr: '10.0.1.0/24' }, position: { x: 200, y: 30 }, parentId: 'vpc' },
  ],
  edges: [{ id: 'edge-1', source: 'subnet', target: 'vpc', relationType: 'CONTAINED_IN' }],
};

describe('architecture documents', () => {
  it('round-trips a valid architecture JSON document', () => {
    expect(parseArchitectureJson(JSON.stringify(sample))).toEqual({ success: true, data: sample });
  });

  it('rejects unsupported schema versions, duplicate IDs, dangling edges, invalid relationships, and parent cycles', () => {
    expect(validateArchitecture({ ...sample, schemaVersion: 2 }).success).toBe(false);
    const duplicate: ArchitectureDocument = { ...sample, nodes: [...sample.nodes, sample.nodes[0]] };
    const duplicateResult = validateArchitecture(duplicate);
    expect(duplicateResult.success).toBe(false);
    if (!duplicateResult.success) expect(duplicateResult.errors.join(' ')).toMatch(/duplicate node id/i);

    const invalid: ArchitectureDocument = {
      ...sample,
      nodes: sample.nodes.map((node) => ({ ...node, parentId: node.id === 'vpc' ? 'subnet' : 'vpc' })),
      edges: [
        { id: 'edge-1', source: 'subnet', target: 'missing', relationType: 'CONTAINED_IN' },
        { id: 'edge-2', source: 'subnet', target: 'vpc', relationType: 'ROUTES_TO' },
      ],
    };
    const result = validateArchitecture(invalid);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.join(' ')).toMatch(/missing endpoint|cycle|not allowed/i);
  });

  it('rejects credential-like keys and malformed or oversized JSON', () => {
    const withSecret = { ...sample, nodes: [{ ...sample.nodes[0], config: { password: 'not-a-real-secret' } }] };
    expect(validateArchitecture(withSecret).success).toBe(false);
    expect(parseArchitectureJson('{').success).toBe(false);
    expect(parseArchitectureJson(' '.repeat(1_000_001)).success).toBe(false);
  });

  it('allows only compatible typed relationships', () => {
    expect(canConnect('Subnet', 'VPC', 'CONTAINED_IN')).toBe(true);
    expect(canConnect('EC2', 'RDS', 'CONNECTS_TO')).toBe(true);
    expect(canConnect('S3', 'VPC', 'CONTAINED_IN')).toBe(false);
  });
});