"use client";

import { Percent } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function CommissionPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Team Commission</h1>
        <p className="text-gray-400">View your team commission earnings.</p>
      </div>

      <GlassCard>
        <div className="flex items-center gap-4 py-12 flex-col">
          <Percent className="w-12 h-12 text-[#00ff88]" />
          <p className="text-gray-400">Team Commission page coming soon...</p>
        </div>
      </GlassCard>
    </div>
  );
}

