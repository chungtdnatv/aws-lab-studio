import { useCallback, useRef, useState } from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
} from '@xyflow/react';
import { Activity, ArrowDownToLine, Cloud, Download, FileUp, Plus, Save, Workflow } from 'lucide-react';
import { canConnect, parseArchitectureJson, RELATION_TYPES, type ArchitectureDocument, type ResourceType } from '../domain/architecture';
import { RESOURCE_DEFINITIONS } from '../domain/resources';
import { useEditorStore, type EditorEdge, type EditorNode } from '../state/editorStore';
import Inspector from './Inspector';
import ResourceNode from './ResourceNode';

const nodeTypes = { resource: ResourceNode };
const LOCAL_PROJECT_KEY = 'aws-lab-studio.architecture.v1';

export default function App() {
  const nodes = useEditorStore((state) => state.nodes);
  const edges = useEditorStore((state) => state.edges);
  const relationType = useEditorStore((state) => state.relationType);
  const notice = useEditorStore((state) => state.notice);
  const addResource = useEditorStore((state) => state.addResource);
  const selectNode = useEditorStore((state) => state.selectNode);
  const setNotice = useEditorStore((state) => state.setNotice);
  const setRelationType = useEditorStore((state) => state.setRelationType);
  const toDocument = useEditorStore((state) => state.toDocument);
  const loadDocument = useEditorStore((state) => state.loadDocument);
  const [paletteFilter, setPaletteFilter] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const handleConnect = useCallback((connection: Connection) => {
    const state = useEditorStore.getState();
    const source = state.nodes.find((node) => node.id === connection.source);
    const target = state.nodes.find((node) => node.id === connection.target);
    if (!source || !target || !canConnect(source.data.resourceType, target.data.resourceType, state.relationType)) {
      setNotice(`The ${state.relationType.replaceAll('_', ' ').toLowerCase()} relationship is not allowed for these resource types.`);
      return;
    }
    const edge: EditorEdge = {
      id: crypto.randomUUID(),
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: 'smoothstep',
      label: state.relationType.replaceAll('_', ' '),
      data: { relationType: state.relationType },
    };
    state.setEdges(addEdge(edge as Edge, state.edges) as EditorEdge[]);
    setNotice('Typed relationship added');
  }, [setNotice]);

  const currentDocument = (): ArchitectureDocument => toDocument();

  const saveLocal = () => {
    const document = currentDocument();
    localStorage.setItem(LOCAL_PROJECT_KEY, JSON.stringify(document, null, 2));
    setNotice('Saved in this browser');
  };

  const loadLocal = () => {
    const saved = localStorage.getItem(LOCAL_PROJECT_KEY);
    if (!saved) {
      setNotice('No saved architecture in this browser yet');
      return;
    }
    const result = parseArchitectureJson(saved);
    if (!result.success) {
      setNotice(`Saved architecture could not be loaded: ${result.errors[0]}`);
      return;
    }
    loadDocument(result.data);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(currentDocument(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'aws-lab-architecture.json';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Architecture exported as JSON');
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    const result = parseArchitectureJson(await file.text());
    if (!result.success) {
      setNotice(`Import rejected: ${result.errors.join(' ')}`);
      return;
    }
    loadDocument(result.data);
  };

  const filteredDefinitions = RESOURCE_DEFINITIONS.filter((definition) =>
    `${definition.label} ${definition.category}`.toLowerCase().includes(paletteFilter.toLowerCase()));

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark"><Cloud size={19} /></div><div><strong>LAB / STUDIO</strong><span>ARCHITECTURE WORKBENCH</span></div></div>
        <div className="project-title"><span className="project-dot" /><input aria-label="Project name" value={useEditorStore.getState().projectName} readOnly /><span className="local-tag">LOCAL PROJECT</span></div>
        <div className="top-actions">
          <button className="quiet-button" onClick={loadLocal} title="Load saved project"><ArrowDownToLine size={16} /><span>Load</span></button>
          <button className="quiet-button" onClick={saveLocal} title="Save project"><Save size={16} /><span>Save</span></button>
          <button className="quiet-button" onClick={() => fileInput.current?.click()} title="Import architecture JSON"><FileUp size={16} /><span>Import</span></button>
          <button className="export-button" onClick={exportJson}><Download size={15} /><span>Export JSON</span></button>
          <input ref={fileInput} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => void importJson(event.target.files?.[0])} />
        </div>
      </header>

      <section className="workspace">
        <aside className="palette-pane">
          <div className="pane-heading"><span>Resources</span><span className="count-pill">{RESOURCE_DEFINITIONS.length}</span></div>
          <label className="search-wrap"><Activity size={14} /><input aria-label="Filter resources" placeholder="Filter resources" value={paletteFilter} onChange={(event) => setPaletteFilter(event.target.value)} /></label>
          <div className="resource-list">
            {(['Network', 'Compute', 'Storage', 'Identity'] as const).map((category) => {
              const group = filteredDefinitions.filter((definition) => definition.category === category);
              if (!group.length) return null;
              return <div className="resource-group" key={category}><span className="group-label">{category}</span>{group.map((definition) => <button className="resource-option" key={definition.type} onClick={() => addResource(definition.type as ResourceType)}><span className={`resource-glyph ${definition.color}`}><Plus size={13} /></span><span>{definition.label}</span><span className="add-hint">+</span></button>)}</div>;
            })}
          </div>
          <div className="palette-footer"><Workflow size={14} /><span>Drag from handles to connect</span></div>
        </aside>

        <section className="canvas-column">
          <div className="canvas-toolbar">
            <div className="canvas-heading"><span className="eyebrow">DESIGN SURFACE</span><strong>Architecture canvas</strong></div>
            <label className="relation-picker"><span>Relationship</span><select aria-label="Relationship type" value={relationType} onChange={(event) => setRelationType(event.target.value as typeof relationType)}>{RELATION_TYPES.map((type) => <option key={type} value={type}>{type.replaceAll('_', ' ')}</option>)}</select></label>
            <div className="canvas-readout"><span className="live-dot" />{nodes.length} resources <i /> {edges.length} relationships</div>
          </div>
          <div className="flow-stage">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={(changes) => {
                const state = useEditorStore.getState();
                state.setNodes(applyNodeChanges(changes, state.nodes) as EditorNode[]);
              }}
              onEdgesChange={(changes) => {
                const state = useEditorStore.getState();
                state.setEdges(applyEdgeChanges(changes, state.edges) as EditorEdge[]);
              }}
              onConnect={handleConnect}
              onNodeClick={(_, node) => selectNode(node.id)}
              onPaneClick={() => selectNode(null)}
              fitView
              nodesDraggable
              elementsSelectable
              deleteKeyCode={['Backspace', 'Delete']}
            >
              <Background color="#c9d1ca" gap={22} size={1} />
              <MiniMap zoomable pannable nodeColor={(node) => {
                const color = RESOURCE_DEFINITIONS.find((item) => item.type === (node.data as { resourceType?: string }).resourceType)?.color;
                return color === 'teal' ? '#287f78' : color === 'coral' ? '#d66e55' : color === 'gold' ? '#cf9b3b' : '#6685a4';
              }} />
              <Controls position="bottom-left" showInteractive={false} />
            </ReactFlow>
            {!nodes.length && <div className="canvas-empty"><div className="empty-icon"><Cloud size={21} /></div><span className="eyebrow">START WITH A RESOURCE</span><strong>Your architecture takes shape here.</strong><p>Add a resource from the palette. Move it freely, then connect compatible resources with a typed relationship.</p><button onClick={() => addResource('VPC')}><Plus size={15} /> Add a VPC</button></div>}
          </div>
          <div className="canvas-status"><span className="status-message" role="status">{notice || 'Editor ready · structural editing only'}</span><span className="status-boundary">SIMULATION NOT AVAILABLE IN THIS MILESTONE</span></div>
        </section>

        <Inspector />
      </section>
    </main>
  );
}