"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "cyan" | "green" | "none";
  padding?: "sm" | "md" | "lg";
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow = "none",
  padding = "md",
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
        className
      )}
    >
      {children}
    </div>
  );
}
