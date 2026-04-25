"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, ArrowRight } from "lucide-react";

interface PoolCardProps {
  name: string;
  description?: string | null;
  minimumInvestment: number;
  maximumInvestment?: number | null;
  dailyReturn: number;
  durationDays: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
  bonusPercent: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function PoolCard({
  name,
  description,
  minimumInvestment,
  maximumInvestment,
  dailyReturn,
  durationDays,
  level1Commission,
  level2Commission,
  level3Commission,
  bonusPercent,
  isSelected,
  onSelect,
}: PoolCardProps) {
  const isGenesis = bonusPercent === 100;

  return (
    <div
      onClick={onSelect}
      className={cn(
        "glass rounded-xl overflow-hidden cursor-pointer transition-all duration-300 glass-hover",
        isSelected && "border-[#00d2ff]/40 glow-cyan"
      )}
    >
      <div
        className={cn(
          "h-1",
          isGenesis
            ? "bg-gradient-to-r from-[#00d2ff] via-[#00ff88] to-[#00d2ff]"
            : "bg-gradient-to-r from-[#00d2ff] to-[#00ff88]"
        )}
      />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{name}</h3>
            {isGenesis && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs font-bold">
                100% BONUS
              </span>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#00d2ff]" />
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {description || "No description available."}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Daily Return</p>
            <p className="text-xl font-bold text-[#00ff88]">{dailyReturn}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Duration</p>
            <p className="text-xl font-bold text-[#00d2ff]">{durationDays}d</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Min</p>
            <p className="text-sm font-semibold text-white">${minimumInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Max</p>
            <p className="text-sm font-semibold text-white">
              {maximumInvestment ? `$${maximumInvestment.toLocaleString()}` : "Unlimited"}
            </p>
          </div>
        </div>

        <div className="p-2.5 bg-white/[0.03] rounded-lg mb-3">
          <p className="text-[10px] text-gray-500 mb-1.5">Referral Commissions</p>
          <div className="flex gap-2">
            <span className="flex-1 text-center text-xs font-bold text-[#00d2ff]">{level1Commission}%</span>
            <span className="flex-1 text-center text-xs font-bold text-[#00ff88]">{level2Commission}%</span>
            <span className="flex-1 text-center text-xs font-bold text-purple-400">{level3Commission}%</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-[#00d2ff] font-medium">
          Click to invest <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

