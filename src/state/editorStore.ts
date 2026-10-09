import { create } from 'zustand';
import type { ArchitectureDocument, RelationType, ResourceType } from '../domain/architecture';
import { getResourceDefinition } from '../domain/resources';
import type { Edge, Node } from '@xyflow/react';

export interface ResourceNodeData extends Record<string, unknown> {
  resourceType: ResourceType;
  label: string;
  config: Record<string, string | number | boolean>;
}

export type EditorNode = Node<ResourceNodeData, 'resource'>;
export type EditorEdge = Edge<{ relationType: RelationType }>;

interface EditorState {
  projectName: string;
  projectId: string;
  nodes: EditorNode[];
  edges: EditorEdge[];
  selectedNodeId: string | null;
  relationType: RelationType;
  notice: string;
  addResource: (type: ResourceType) => void;
  setNodes: (nodes: EditorNode[]) => void;
  setEdges: (edges: EditorEdge[]) => void;
  selectNode: (id: string | null) => void;
  updateNode: (id: string, changes: Partial<Pick<ResourceNodeData, 'label' | 'config'>>) => void;
  deleteNode: (id: string) => void;
  setRelationType: (relation: RelationType) => void;
  setNotice: (notice: string) => void;
  toDocument: () => ArchitectureDocument;
  loadDocument: (document: ArchitectureDocument) => void;
}

const createId = () => crypto.randomUUID();

export const useEditorStore = create<EditorState>((set, get) => ({
  projectName: 'Untitled architecture',
  projectId: createId(),
  nodes: [],
  edges: [],
  selectedNodeId: null,
  relationType: 'CONTAINED_IN',
  notice: '',
  addResource: (type) => {
    const definition = getResourceDefinition(type);
    const count = get().nodes.length;
    const node: EditorNode = {
      id: createId(),
      type: 'resource',
      position: { x: 100 + (count % 3) * 245, y: 100 + Math.floor(count / 3) * 150 },
      data: { resourceType: type, label: definition.label, config: { ...definition.defaults } },
    };
    set((state) => ({ nodes: [...state.nodes, node], selectedNodeId: node.id, notice: `${definition.label} added` }));
  },
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  selectNode: (id) => set({ selectedNodeId: id }),
  updateNode: (id, changes) => set((state) => ({
    nodes: state.nodes.map((node) => node.id === id ? { ...node, data: { ...node.data, ...changes } } : node),
  })),
  deleteNode: (id) => set((state) => {
    const deletedIds = new Set([id]);
    let foundChild = true;
    while (foundChild) {
      foundChild = false;
      for (const node of state.nodes) {
        if (node.parentId && deletedIds.has(node.parentId) && !deletedIds.has(node.id)) {
          deletedIds.add(node.id);
          foundChild = true;
        }
      }
    }
    return {
      nodes: state.nodes.filter((node) => !deletedIds.has(node.id)),
      edges: state.edges.filter((edge) => !deletedIds.has(edge.source) && !deletedIds.has(edge.target)),
      selectedNodeId: state.selectedNodeId && deletedIds.has(state.selectedNodeId) ? null : state.selectedNodeId,
      notice: 'Resource, descendants, and connected relationships deleted',
    };
  }),
  setRelationType: (relationType) => set({ relationType }),
  setNotice: (notice) => set({ notice }),
  toDocument: () => {
    const state = get();
    return {
      schemaVersion: 1,
      projectId: state.projectId,
      name: state.projectName,
      region: 'ap-northeast-1',
      nodes: state.nodes.map((node) => ({
        id: node.id,
        type: node.data.resourceType,
        label: node.data.label,
        config: node.data.config,
        position: node.position,
        parentId: node.parentId ?? null,
      })),
      edges: state.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        relationType: edge.data?.relationType ?? 'CONNECTS_TO',
      })),
    };
  },
  loadDocument: (document) => set({
    projectName: document.name,
    projectId: document.projectId,
    nodes: document.nodes.map((node) => ({
      id: node.id,
      type: 'resource',
      position: node.position,
      parentId: node.parentId ?? undefined,
      data: { resourceType: node.type, label: node.label, config: node.config },
    })),
    edges: document.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      label: edge.relationType.replaceAll('_', ' '),
      data: { relationType: edge.relationType },
      animated: false,
    })),
    selectedNodeId: null,
    notice: 'Architecture loaded',
  }),
}));