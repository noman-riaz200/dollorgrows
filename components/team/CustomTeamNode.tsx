"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { User, Calendar, Hash } from "lucide-react";
import { format } from "date-fns";

interface TeamNodeData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isRoot?: boolean;
  downlineCount: number;
}

function CustomTeamNode({ data }: { data: TeamNodeData }) {
  const { name, id, createdAt, isRoot, downlineCount } = data;

  return (
    <div
      className={`relative min-w-[180px] max-w-[220px] rounded-xl border transition-all duration-300 ${
        isRoot
          ? "bg-gradient-to-br from-[#00d2ff]/20 to-[#00ff88]/20 border-[#00d2ff]/50 shadow-[0_0_20px_rgba(0,210,255,0.25)]"
          : "bg-white/[0.05] backdrop-blur-xl border-white/[0.12] hover:border-[#00d2ff]/40 hover:bg-white/[0.08]"
      }`}
    >
      {/* Top handle for parent connection */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#00d2ff] !border-2 !border-[#0a0a0f]"
      />

      <div className="p-4">
        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isRoot
                ? "bg-gradient-to-br from-[#00d2ff] to-[#00ff88]"
                : "bg-gradient-to-br from-[#00d2ff]/30 to-[#00ff88]/30"
            }`}
          >
            <User className={`w-5 h-5 ${isRoot ? "text-black" : "text-[#00d2ff]"}`} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-sm truncate leading-tight">
              {name}
            </p>
            {isRoot && (
              <span className="text-[10px] text-[#00ff88] font-medium uppercase tracking-wider">
                You
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Hash className="w-3 h-3 text-[#00d2ff]/70" />
            <span className="font-mono truncate">{id.slice(0, 8)}...</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3 text-[#00ff88]/70" />
            <span>{format(new Date(createdAt), "MMM dd, yyyy")}</span>
          </div>
          {downlineCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-1 border-t border-white/[0.06] mt-2">
              <span className="text-[#00d2ff]">{downlineCount}</span>
              <span>downline member{downlineCount !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom handles for children connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#00ff88] !border-2 !border-[#0a0a0f]"
      />
    </div>
  );
}

export default memo(CustomTeamNode);

