"use client";

import { cn } from "@/lib/utils";

interface MatrixSlot {
  position: number;
  isFilled: boolean;
  filledBy?: string;
  bonusAmount?: number;
}

interface MatrixGridProps {
  slots: MatrixSlot[];
  className?: string;
}

export function MatrixGrid({ slots, className }: MatrixGridProps) {
  const levels = [
    [1],
    [2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14, 15],
  ];

  const getSlot = (pos: number) => slots.find((s) => s.position === pos);

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {levels.map((level, levelIdx) => (
        <div key={levelIdx} className="flex gap-2 justify-center">
          {level.map((pos) => {
            const slot = getSlot(pos);
            const filled = slot?.isFilled;
            return (
              <div
                key={pos}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                  filled
                    ? "bg-gradient-to-br from-[#00d2ff] to-[#00ff88] text-black glow-cyan-sm"
                    : "bg-white/5 border border-white/10 text-gray-500"
                )}
                title={filled ? `Filled by ${slot?.filledBy}` : `Slot ${pos} - Empty`}
              >
                {pos}
              </div>
            );
          })}
        </div>
      ))}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400 w-full">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gradient-to-br from-[#00d2ff] to-[#00ff88]" />
          Filled
        </span>
        <span>
          {slots.filter((s) => s.isFilled).length} / 15 filled
        </span>
      </div>
    </div>
  );
}

