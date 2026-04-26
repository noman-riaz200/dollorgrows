"use client";

import { ZoomIn, ZoomOut, Maximize, Crosshair } from "lucide-react";

interface FlowControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onCenter: () => void;
}

export function FlowControls({
  onZoomIn,
  onZoomOut,
  onFit,
  onCenter,
}: FlowControlsProps) {
  return (
    <div className="flex items-center gap-2 p-2 glass rounded-xl border border-white/[0.08]">
      <ControlButton onClick={onZoomIn} title="Zoom In">
        <ZoomIn className="w-4 h-4" />
      </ControlButton>
      <div className="w-px h-5 bg-white/[0.08]" />
      <ControlButton onClick={onZoomOut} title="Zoom Out">
        <ZoomOut className="w-4 h-4" />
      </ControlButton>
      <div className="w-px h-5 bg-white/[0.08]" />
      <ControlButton onClick={onFit} title="Fit View">
        <Maximize className="w-4 h-4" />
      </ControlButton>
      <div className="w-px h-5 bg-white/[0.08]" />
      <ControlButton onClick={onCenter} title="Center on Me" accent>
        <Crosshair className="w-4 h-4" />
      </ControlButton>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  title,
  accent = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
        accent
          ? "bg-[#00d2ff]/15 text-[#00d2ff] hover:bg-[#00d2ff]/25 hover:shadow-[0_0_12px_rgba(0,210,255,0.3)]"
          : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      {children}
    </button>
  );
}

