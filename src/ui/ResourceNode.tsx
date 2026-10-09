import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { EditorNode } from '../state/editorStore';
import { getResourceDefinition } from '../domain/resources';

function ResourceNode({ data, selected }: NodeProps<EditorNode>) {
  const definition = getResourceDefinition(data.resourceType);
  return (
    <div className={`resource-node ${definition.color}${selected ? ' selected' : ''}`}>
      <Handle type="target" position={Position.Left} />
      <span className="resource-node-category">{definition.category}</span>
      <strong>{data.label}</strong>
      <span className="resource-node-type">{definition.label}</span>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(ResourceNode);