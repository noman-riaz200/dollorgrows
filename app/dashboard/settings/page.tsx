"use client";

import { Settings } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences.</p>
      </div>

      <GlassCard>
        <div className="flex items-center gap-4 py-12 flex-col">
          <Settings className="w-12 h-12 text-[#00d2ff]" />
          <p className="text-gray-400">Settings page coming soon...</p>
        </div>
      </GlassCard>
    </div>
  );
}

