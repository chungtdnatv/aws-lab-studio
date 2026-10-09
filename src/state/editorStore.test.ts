import { beforeEach, describe, expect, it } from 'vitest';
import { useEditorStore, type EditorEdge, type EditorNode } from './editorStore';

describe('editor store', () => {
  beforeEach(() => {
    useEditorStore.setState({ nodes: [], edges: [], selectedNodeId: null, notice: '' });
  });

  it('adds a resource with its starter configuration and selects it', () => {
    useEditorStore.getState().addResource('VPC');
    const state = useEditorStore.getState();

    expect(state.nodes).toHaveLength(1);
    expect(state.nodes[0].data.config).toMatchObject({ cidr: '10.0.0.0/16' });
    expect(state.selectedNodeId).toBe(state.nodes[0].id);
  });

  it('deletes descendants and every relationship touching the deleted group', () => {
    const nodes: EditorNode[] = [
      { id: 'vpc', type: 'resource', position: { x: 0, y: 0 }, data: { resourceType: 'VPC', label: 'VPC', config: {} } },
      { id: 'subnet', type: 'resource', parentId: 'vpc', position: { x: 0, y: 0 }, data: { resourceType: 'Subnet', label: 'Subnet', config: {} } },
      { id: 'instance', type: 'resource', parentId: 'subnet', position: { x: 0, y: 0 }, data: { resourceType: 'EC2', label: 'EC2', config: {} } },
      { id: 'bucket', type: 'resource', position: { x: 0, y: 0 }, data: { resourceType: 'S3', label: 'Bucket', config: {} } },
    ];
    const edges: EditorEdge[] = [
      { id: 'contained', source: 'subnet', target: 'vpc', data: { relationType: 'CONTAINED_IN' } },
      { id: 'unrelated', source: 'instance', target: 'bucket', data: { relationType: 'CONNECTS_TO' } },
    ];
    useEditorStore.setState({ nodes, edges, selectedNodeId: 'instance' });

    useEditorStore.getState().deleteNode('vpc');
    const state = useEditorStore.getState();

    expect(state.nodes.map((node) => node.id)).toEqual(['bucket']);
    expect(state.edges).toHaveLength(0);
    expect(state.selectedNodeId).toBeNull();
  });
});