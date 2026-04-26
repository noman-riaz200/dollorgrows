"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "green" | "none";
  padding?: "sm" | "md" | "lg";
  neonBorder?: "cyan" | "green" | "none";
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
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "glass rounded-xl",
        paddingClasses[padding],
        hover && "glass-hover",
        glow === "cyan" && "glow-cyan",
        glow === "green" && "glow-green",
        neonBorder === "cyan" && "neon-border-cyan",
        neonBorder === "green" && "neon-border-green",
        className
      )}
    >
      {children}
    </div>
  );
}
