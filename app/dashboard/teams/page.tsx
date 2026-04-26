"use client";

import { Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
        <p className="text-gray-400">Manage and view your team structure.</p>
      </div>

      <GlassCard>
        <div className="flex items-center gap-4 py-12 flex-col">
          <Users className="w-12 h-12 text-[#00d2ff]" />
          <p className="text-gray-400">Teams page coming soon...</p>
        </div>
      </GlassCard>
    </div>
  );
}

