"use client";

import { useEffect, useState } from "react";
import { Wallet, Check, X } from "lucide-react";
import { PoolCard } from "@/components/ui/PoolCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface Pool {
  id: string;
  name: string;
  description: string;
  minimumInvestment: number;
  maximumInvestment: number | null;
  dailyReturn: number;
  durationDays: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
  bonusPercent: number;
  totalInvested: number;
  totalCapacity: number | null;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const res = await fetch("/api/pools");
      const data = await res.json();
      setPools(data.pools || []);
    } catch (error) {
      console.error("Failed to fetch pools:", error);
    }
  };

  const handleInvest = async () => {
    if (!selectedPool || !investAmount) return;

    setIsInvesting(true);
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poolId: selectedPool.id,
          amount: parseFloat(investAmount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(`Successfully invested $${investAmount} in ${selectedPool.name}!`);
        setInvestAmount("");
        setSelectedPool(null);
        fetchPools();
      } else {
        alert(data.error || "Investment failed");
      }
    } catch (error) {
      console.error("Investment error:", error);
      alert("Failed to process investment");
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Investment Pools</h1>
          <p className="text-gray-400">
            Choose from 15 carefully crafted investment pools with varying returns and durations.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-[#00ff88] flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pools.map((pool) => (
            <PoolCard
              key={pool.id}
              name={pool.name}
              description={pool.description}
              minimumInvestment={pool.minimumInvestment}
              maximumInvestment={pool.maximumInvestment}
              dailyReturn={pool.dailyReturn}
              durationDays={pool.durationDays}
              level1Commission={pool.level1Commission}
              level2Commission={pool.level2Commission}
              level3Commission={pool.level3Commission}
              bonusPercent={pool.bonusPercent}
              isSelected={selectedPool?.id === pool.id}
              onSelect={() => setSelectedPool(pool)}
            />
          ))}
        </div>

        {/* Investment Modal */}
        {selectedPool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <GlassCard className="max-w-md w-full" glow="cyan">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Invest in {selectedPool.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedPool(null);
                    setInvestAmount("");
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-400 mb-6">{selectedPool.description}</p>

              {/* Investment Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-xs text-gray-500">Daily Return</p>
                  <p className="text-lg font-bold text-[#00ff88]">{selectedPool.dailyReturn}%</p>
                </div>
                <div className="p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-lg font-bold text-[#00d2ff]">{selectedPool.durationDays} days</p>
                </div>
                <div className="p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-xs text-gray-500">Matrix Bonus</p>
                  <p className={`text-lg font-bold ${selectedPool.bonusPercent === 100 ? "text-[#00ff88]" : "text-[#00d2ff]"}`}>
                    {selectedPool.bonusPercent}%
                  </p>
                </div>
                <div className="p-3 bg-white/[0.03] rounded-lg">
                  <p className="text-xs text-gray-500">Min Investment</p>
                  <p className="text-lg font-bold text-white">${selectedPool.minimumInvestment.toLocaleString()}</p>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Investment Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min={selectedPool.minimumInvestment}
                    max={selectedPool.maximumInvestment || undefined}
                    placeholder={`${selectedPool.minimumInvestment}`}
                    className="w-full pl-8 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Min: ${selectedPool.minimumInvestment.toLocaleString()}</span>
                  <span>Max: {selectedPool.maximumInvestment ? `$${selectedPool.maximumInvestment.toLocaleString()}` : "No Limit"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedPool(null);
                    setInvestAmount("");
                  }}
                  className="flex-1 py-3 glass rounded-lg text-white hover:bg-white/[0.06] transition-colors"
                >
                  Cancel
                </button>
                <NeonButton
                  fullWidth
                  onClick={handleInvest}
                  disabled={isInvesting || !investAmount}
                  className="flex items-center justify-center gap-2"
                >
                  {isInvesting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Wallet className="w-4 h-4" />
                      Confirm
                    </>
                  )}
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}

