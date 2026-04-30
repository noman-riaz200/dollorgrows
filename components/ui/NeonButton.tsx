"use client";

import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "cyan" | "green" | "gradient";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e?: unknown) => void;
  type?: "button" | "submit";
  animate?: boolean;
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
  animate = false,
}: NeonButtonProps) {
const sizeClasses = {
    sm: "btn-sm",
    md: "btn-md",
    lg: "btn-lg",
  };

  const variantClasses = {
    cyan: "btn-cyan",
    green: "btn-green",
    gradient: "btn-gradient",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-base ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'btn-full' : ''} ${disabled ? 'btn-disabled' : ''} ${className || ''}`}
    >
      {children}
    </button>
  );
}
