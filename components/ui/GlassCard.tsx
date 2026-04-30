"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
glow?: "blue" | "mint" | "lavender" | "none";
  padding?: "sm" | "md" | "lg";
neonBorder?: "blue" | "mint" | "lavender" | "none";
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  padding = "md",
  neonBorder = "none",
}: GlassCardProps) {
  const paddingClasses = {
    sm: "p-3",
    md: "p-4 p-md-5",
    lg: "p-5",
  };

  return (
    <div
      className={cn(
        "glass rounded-4",
        paddingClasses[padding],
        hover && "glass-hover",
        glow === "blue" && "glow-blue",
        glow === "mint" && "glow-mint",
        glow === "lavender" && "glow-lavender",
        neonBorder === "blue" && "neon-border-blue",
        neonBorder === "mint" && "neon-border-mint",
        neonBorder === "lavender" && "neon-border-lavender",
        className
      )}
    >
      {children}
    </div>
  );
}
