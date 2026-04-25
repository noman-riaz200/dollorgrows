"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "cyan" | "green" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function NeonButton({
  children,
  className,
  variant = "gradient",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  type = "button",
}: NeonButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    cyan: "bg-[#00d2ff]/10 text-[#00d2ff] border-[#00d2ff]/30 hover:bg-[#00d2ff]/20 hover:glow-cyan-sm",
    green: "bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/30 hover:bg-[#00ff88]/20 hover:glow-green-sm",
    gradient: "bg-gradient-to-r from-[#00d2ff] to-[#00ff88] text-black font-bold hover:opacity-90 hover:glow-cyan-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border transition-all duration-300 font-medium",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
