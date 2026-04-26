"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  type Node,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CustomTeamNode from "./CustomTeamNode";
import { FlowControls } from "./FlowControls";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  downlineCount: number;
  children?: TeamMember[] | null;
}

interface TeamFlowGraphProps {
  rootUser: TeamMember;
  children: TeamMember[] | null;
}

const nodeTypes = {
  teamNode: CustomTeamNode,
};

function buildFlowElements(
  root: TeamMember,
  children: TeamMember[] | null
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Root node at center
  nodes.push({
    id: root.id,
    type: "teamNode",
    position: { x: 0, y: 0 },
    data: {
      id: root.id,
      name: root.name,
      email: root.email,
      createdAt: root.createdAt,
      isRoot: true,
      downlineCount: root.downlineCount,
    },
  });

  if (!children || children.length === 0) {
    return { nodes, edges };
  }

  // Layout children in a horizontal tree below root
  const levelHeight = 180;
  const nodeWidth = 220;
  const gap = 40;

  function layoutLevel(
    members: TeamMember[],
    parentId: string,
    level: number,
    startX: number
  ): number {
    if (members.length === 0) return startX;

    const totalWidth =
      members.length * nodeWidth + (members.length - 1) * gap;
    let currentX = startX - totalWidth / 2;

    for (const member of members) {
      const nodeX = currentX + nodeWidth / 2;
      const nodeY = level * levelHeight;

      nodes.push({
        id: member.id,
        type: "teamNode",
        position: { x: nodeX, y: nodeY },
        data: {
          id: member.id,
          name: member.name,
          email: member.email,
          createdAt: member.createdAt,
          isRoot: false,
          downlineCount: member.downlineCount,
        },
      });

      edges.push({
        id: `e-${parentId}-${member.id}`,
        source: parentId,
        target: member.id,
        type: "smoothstep",
        style: { stroke: "rgba(0, 210, 255, 0.4)", strokeWidth: 2 },
        animated: true,
      });

      if (member.children && member.children.length > 0) {
        layoutLevel(
          member.children,
          member.id,
          level + 1,
          nodeX + nodeWidth / 2
        );
      }

      currentX += nodeWidth + gap;
    }

    return startX + totalWidth / 2;
  }

  layoutLevel(children, root.id, 1, 0);

  return { nodes, edges };
}

function ControlsPanel({ rootUserId }: { rootUserId: string }) {
  const { zoomIn, zoomOut, fitView, setCenter, getNodes } = useReactFlow();

  const handleCenterOnMe = useCallback(() => {
    const nodes = getNodes();
    const rootNode = nodes.find((n) => n.id === rootUserId);
    if (rootNode) {
      setCenter(rootNode.position.x + 110, rootNode.position.y + 60, {
        zoom: 1.2,
        duration: 800,
      });
    }
  }, [getNodes, setCenter, rootUserId]);

  return (
    <Panel position="top-center">
      <FlowControls
        onZoomIn={() => zoomIn({ duration: 300 })}
        onZoomOut={() => zoomOut({ duration: 300 })}
        onFit={() => fitView({ padding: 0.3, duration: 800 })}
        onCenter={handleCenterOnMe}
      />
    </Panel>
  );
}

function FlowGraphInner({
  rootUser,
  children,
}: TeamFlowGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildFlowElements(rootUser, children),
    [rootUser, children]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    instance.fitView({ padding: 0.3, duration: 800 });
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      nodeTypes={nodeTypes}
      fitView
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      className="bg-transparent"
    >
      <Background
        color="rgba(0, 210, 255, 0.08)"
        gap={24}
        size={1}
      />
      <ControlsPanel rootUserId={rootUser.id} />
    </ReactFlow>
  );
}

export default function TeamFlowGraph(props: TeamFlowGraphProps) {
  return (
    <div className="w-full h-[600px] rounded-xl border border-white/[0.08] overflow-hidden">
      <FlowGraphInner {...props} />
    </div>
  );
}

