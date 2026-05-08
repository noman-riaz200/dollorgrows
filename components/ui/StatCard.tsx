"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  accent?: "blue" | "mint" | "cyan" | "green";
  className?: string;
  neonBorder?: "cyan" | "green" | "none";
}

export function StatCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
accent = "blue",
  className,
  neonBorder = "none",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-4 p-4 p-md-5 glass-hover",
        neonBorder === "cyan" && "neon-border-cyan",
        neonBorder === "green" && "neon-border-green",
        className
      )}
    >
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div
          className={cn(
            "w-48px h-48px rounded-3 d-flex align-items-center justify-content-center",
            accent === "cyan" ? "bg-[#00d2ff]/10" :
            accent === "blue" ? "bg-blue-500/10" : "bg-[#00ff88]/10"
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              accent === "cyan" ? "text-[#00d2ff]" :
              accent === "blue" ? "text-blue-400" : "text-[#00ff88]"
            )}
          />
        </div>
        {change && (
          <span
            className={cn(
              "small fw-medium",
              positive ? "text-[#00ff88]" : "text-danger"
            )}
          >
            {positive ? "+" : ""}
            {change}
          </span>
        )}
      </div>
      <p className="fs-4 fs-md-3 fw-bold text-yellow mb-1">{value}</p>
      <p className="text-white small">{title}</p>
    </div>
  );
}
