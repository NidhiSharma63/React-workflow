import React, { useCallback, useState } from "react";
import ReactFlow, {
  Controls,
  ReactFlowInstance,
  addEdge,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Start" } },
  { id: "2", position: { x: 0, y: 50 }, data: { label: "Filter Data" } },
  { id: "3", position: { x: 0, y: 100 }, data: { label: "Wait" } },
  { id: "4", position: { x: 0, y: 150 }, data: { label: "Convert Format" } },
  { id: "5", position: { x: 0, y: 200 }, data: { label: "Send Post Request" } },
  { id: "6", position: { x: 0, y: 250 }, data: { label: "End" } },
];

// initialEdges is an array that defines the connections between the nodes in the flow diagram
// id: A unique identifier for the edge. This should be different for each edge.
// source: The id of the node where the edge starts.
// target: The id of the node where the edge ends.
const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
  { id: "e3-5", source: "4", target: "5" },
  { id: "e3-6", source: "5", target: "6" },
];
const ReactWorkFlowComponent = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const onConnect = useCallback(
    (params) => {
      const { source, target } = params;

      // Check for self connections.
      if (source === target) {
        console.log("Cannot connect node to itself.");
        return;
      }

      // Check for existing connections from the source node.
      const sourceHasConnection = edges.some((edge) => edge.source === source);
      if (sourceHasConnection) {
        console.log("This node already has an outgoing connection.");
        return;
      }

      // Check for existing connections to the target node.
      const targetHasConnection = edges.some((edge) => edge.target === target);
      if (targetHasConnection) {
        console.log("This node already has an incoming connection.");
        return;
      }

      // If all checks pass, add the new edge.
      setEdges((eds) => addEdge(params, eds));
    },
    [edges, setEdges]
  );

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes, nodes]
  );

  const saveWorkFlow = useCallback(() => {
    // console.log("Nodes:", nodes);
    // console.log("Edges:", edges);

    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log({ flow });
      // localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [nodes, edges]);

  return (
    <>
      <div style={{ width: "500px", height: "500px", border: "1px solid red", overflow: "hidden" }}>
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
          onInit={setRfInstance}
          edgesUpdatable={true}
          nodesDraggable={true}
          // onNodeDrag={onNodeDrag}
        >
          <Controls />
        </ReactFlow>
      </div>
      <button onClick={saveWorkFlow}>Save WorkFlow</button>
    </>
  );
};

export default ReactWorkFlowComponent;

/** needs to refactor it */
//   const onNodeDrag = useCallback(
//     (event, node) => {
//       setNodes((nds) =>
//         nds.map((n) => {
//           if (n.id === node.id) {
//             // Maan lijiye ki aapke node ka size 100x50 pixels hai
//             const nodeWidth = 100;
//             const nodeHeight = 50;

//             // Aapke parent container ke dimensions
//             const maxWidth = 300 - nodeWidth;
//             const maxHeight = 300 - nodeHeight;

//             // Calculate new x and y within the boundaries
//             let newX = Math.min(Math.max(node.position.x, 0), maxWidth);
//             let newY = Math.min(Math.max(node.position.y, 0), maxHeight);

//             return {
//               ...n,
//               position: { x: newX, y: newY },
//             };
//           }
//           return n;
//         })
//       );
//     },
//     [setNodes]
//   );
