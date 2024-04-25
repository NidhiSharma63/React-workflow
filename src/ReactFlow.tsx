import React, { useCallback } from "react";
import ReactFlow, { Controls, addEdge, useEdgesState, useNodesState } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", type: "input", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "Node 2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

const ReactWorkFlowComponent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onNodeDrag = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            // Maan lijiye ki aapke node ka size 100x50 pixels hai
            const nodeWidth = 100;
            const nodeHeight = 50;

            // Aapke parent container ke dimensions
            const maxWidth = 300 - nodeWidth;
            const maxHeight = 300 - nodeHeight;

            // Calculate new x and y within the boundaries
            let newX = Math.min(Math.max(node.position.x, 0), maxWidth);
            let newY = Math.min(Math.max(node.position.y, 0), maxHeight);

            return {
              ...n,
              position: { x: newX, y: newY },
            };
          }
          return n;
        })
      );
    },
    [setNodes]
  );

  return (
    <div style={{ width: "300px", height: "300px", border: "1px solid red", overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        minZoom={1}
        maxZoom={1}
        // onNodeDragStop={onNodeDragStop}
        nodesDraggable={true}
        onNodeDrag={onNodeDrag}>
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactWorkFlowComponent;

// const onNodeDragStop = (event, node) => {
//     console.log(node.position.x, "x posiiton");
//     setNodes((nds) =>
//       nds.map((n) => {
//         if (n.id === node.id) {
//           // yahaan aapki boundary logic hogi
//           // maan lijiye parent container ka size width: 300px, height: 300px hai
//           const parentWidth = 300;
//           const parentHeight = 300;

//           // node ko boundary ke andar fit karne ke liye x aur y ko adjust karenge
//           const adjustedX = Math.min(Math.max(node.position.x, 0), parentWidth - node.width);
//           const adjustedY = Math.min(Math.max(node.position.y, 0), parentHeight - node.height);

//           return {
//             ...n,
//             position: {
//               x: adjustedX,
//               y: adjustedY,
//             },
//           };
//         }
//         return n;
//       })
//     );
//   };
