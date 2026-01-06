import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  Panel,
  type Connection,
  type Edge,
  type Node
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Layer (Batch, 28, 28, 1)' },
    position: { x: 250, y: 5 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
  },
  {
    id: '2',
    data: { label: 'Conv2D (32 filters, 3x3)' },
    position: { x: 250, y: 100 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
  },
  {
    id: '3',
    data: { label: 'MaxPooling2D (2x2)' },
    position: { x: 250, y: 200 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
  },
  {
    id: '4',
    data: { label: 'Flatten' },
    position: { x: 250, y: 300 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #3b82f6' }
  },
  {
    id: '5',
    type: 'output',
    data: { label: 'Dense (10, Softmax)' },
    position: { x: 250, y: 400 },
    style: { background: '#1e293b', color: '#fff', border: '1px solid #10b981' }
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
];

const VisualBuilder: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
      >
        <Background color="#334155" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'input') return '#3b82f6';
            if (n.type === 'output') return '#10b981';
            return '#64748b';
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          style={{ background: '#020617' }}
        />
        <Panel position="top-left" className="bg-slate-900 p-2 border border-slate-700 rounded shadow-lg">
          <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Components</div>
          <div className="space-y-2">
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs cursor-move hover:border-blue-500">Convolutional</div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs cursor-move hover:border-blue-500">Pooling</div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs cursor-move hover:border-blue-500">Dense</div>
            <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs cursor-move hover:border-blue-500">Activation</div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default VisualBuilder;
