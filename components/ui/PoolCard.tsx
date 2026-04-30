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
      <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h3 className="h5 fw-bold text-white">{name}</h3>
            {isGenesis && (
              <span className="inline-block mt-1 px-2 py-px rounded-pill bg-[#00ff88]/20 text-[#00ff88] xsmall fw-bold">
                100% BONUS
              </span>
            )}
          </div>
          <div className="w-36px h-36px rounded-3 bg-[#00d2ff]/10 d-flex align-items-center justify-content-center">
            <TrendingUp className="w-5 h-5 text-[#00d2ff]" />
          </div>
        </div>

        <p className="text-muted small mb-4 line-clamp-2">
          {description || "No description available."}
        </p>

        <div className="row row-cols-2 g-3 mb-4">
          <div>
            <p className="xsmall text-muted uppercase tracking-wider">Daily Return</p>
            <p className="fs-4 fw-bold text-[#00ff88]">{dailyReturn}%</p>
          </div>
          <div>
            <p className="xsmall text-muted uppercase tracking-wider">Duration</p>
            <p className="fs-4 fw-bold text-[#00d2ff]">{durationDays}d</p>
          </div>
          <div>
            <p className="xsmall text-muted uppercase tracking-wider">Min</p>
            <p className="small fw-semibold text-white">${minimumInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="xsmall text-muted uppercase tracking-wider">Max</p>
            <p className="small fw-semibold text-white">
              {maximumInvestment ? `$${maximumInvestment.toLocaleString()}` : "Unlimited"}
            </p>
          </div>
        </div>

        <div className="p-2 bg-white/[0.03] rounded-3 mb-3">
          <p className="xsmall text-muted mb-1">Referral Commissions</p>
          <div className="d-flex gap-2">
            <span className="flex-1 text-center xsmall fw-bold text-[#00d2ff]">{level1Commission}%</span>
            <span className="flex-1 text-center xsmall fw-bold text-[#00ff88]">{level2Commission}%</span>
            <span className="flex-1 text-center xsmall fw-bold text-purple-400">{level3Commission}%</span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-center gap-1 xsmall text-[#00d2ff] fw-medium">
          Click to invest <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

