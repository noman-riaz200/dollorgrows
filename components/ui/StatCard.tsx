"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: "cyan" | "green";
  className?: string;
  neonBorder?: "cyan" | "green" | "none";
}

export function StatCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  accent = "cyan",
  className,
  neonBorder = "none",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 glass-hover",
        neonBorder === "cyan" && "neon-border-cyan",
        neonBorder === "green" && "neon-border-green",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            accent === "cyan" ? "bg-[#00d2ff]/10" : "bg-[#00ff88]/10"
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              accent === "cyan" ? "text-[#00d2ff]" : "text-[#00ff88]"
            )}
          />
        </div>
        {change && (
          <span
            className={cn(
              "text-sm font-medium",
              positive ? "text-[#00ff88]" : "text-red-400"
            )}
          >
            {positive ? "+" : ""}
            {change}
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}
