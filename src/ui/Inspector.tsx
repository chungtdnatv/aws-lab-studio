import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trash2 } from 'lucide-react';
import { getResourceDefinition } from '../domain/resources';
import { useEditorStore } from '../state/editorStore';

interface InspectorValues {
  label: string;
  config: Record<string, string | number | boolean>;
}

export default function Inspector() {
  const node = useEditorStore((state) => state.nodes.find((item) => item.id === state.selectedNodeId));
  const updateNode = useEditorStore((state) => state.updateNode);
  const deleteNode = useEditorStore((state) => state.deleteNode);
  const form = useForm<InspectorValues>({ defaultValues: { label: '', config: {} } });

  useEffect(() => {
    form.reset(node ? { label: node.data.label, config: node.data.config } : { label: '', config: {} });
  }, [form, node]);

  if (!node) {
    return <aside className="inspector-pane"><div className="pane-heading"><span>Inspector</span><span className="eyebrow">NO SELECTION</span></div><div className="inspector-empty"><span className="empty-mark">+</span><strong>Select a resource</strong><p>Choose a node on the canvas to inspect its name and starter configuration.</p></div></aside>;
  }

  const definition = getResourceDefinition(node.data.resourceType);
  const saveField = (values: InspectorValues) => updateNode(node.id, { label: values.label || definition.label, config: values.config });

  return (
    <aside className="inspector-pane">
      <div className="pane-heading"><span>Inspector</span><span className="eyebrow">{node.data.resourceType}</span></div>
      <form className="inspector-form" onChange={form.handleSubmit(saveField)}>
        <label className="field-label" htmlFor="resource-label">Resource name</label>
        <input id="resource-label" {...form.register('label')} />
        <div className="config-heading"><span>Configuration</span><span className="config-badge">STARTER FIELDS</span></div>
        {definition.fields.map((configField) => (
          <label className={`config-field${configField.input === 'checkbox' ? ' checkbox-field' : ''}`} key={configField.key}>
            <span>{configField.label}</span>
            {configField.input === 'checkbox' ? (
              <input type="checkbox" {...form.register(`config.${configField.key}`)} />
            ) : (
              <input
                type={configField.input}
                step={configField.input === 'number' ? 1 : undefined}
                {...form.register(`config.${configField.key}`, configField.input === 'number' ? { valueAsNumber: true } : {})}
              />
            )}
          </label>
        ))}
        <div className="inspector-note">These are editable learning fields, not a complete AWS resource schema.</div>
      </form>
      <button className="danger-button" onClick={() => deleteNode(node.id)} type="button"><Trash2 size={15} /> Delete resource</button>
    </aside>
  );
}