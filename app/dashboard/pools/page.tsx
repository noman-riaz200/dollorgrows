"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, ArrowRight, Check } from "lucide-react";

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
    const loadPools = async () => {
      try {
        const res = await fetch("/api/pools");
        const data = await res.json();
        setPools(data.pools || []);
      } catch (error) {
        console.error("Failed to fetch pools:", error);
      }
    };
    loadPools();
  }, []);

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
        fetchPools(); // Refresh pool data
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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Investment Pools</h1>
        <p className="text-gray-400">
          Choose from 15 carefully crafted investment pools with varying returns and durations.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            onClick={() => setSelectedPool(pool)}
            className={`cursor-pointer transition-all duration-300 bg-gray-900/60 backdrop-blur-md border rounded-xl overflow-hidden ${
              selectedPool?.id === pool.id
                ? "border-cyan-500 neon-cyan"
                : "border-gray-800 hover:border-gray-700"
            }`}
          >
            {/* Pool Header with gradient */}
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-emerald-500" />

            <div className="p-6">
              {/* Pool Name */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{pool.name}</h3>
                  <p className="text-xs text-gray-400">Investment Pool</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {pool.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Daily Return</p>
                  <p className="text-2xl font-bold text-emerald-400">{pool.dailyReturn}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                  <p className="text-2xl font-bold text-cyan-400">{pool.durationDays} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Min Investment</p>
                  <p className="text-lg font-semibold text-white">${pool.minimumInvestment.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Max Investment</p>
                  <p className="text-lg font-semibold text-white">
                    {pool.maximumInvestment ? `$${pool.maximumInvestment.toLocaleString()}` : "Unlimited"}
                  </p>
                </div>
              </div>

              {/* Commission Levels */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Referral Commissions</p>
                <div className="flex gap-3">
                  <div className="flex-1 text-center">
                    <div className="text-sm font-bold text-cyan-400">L1: {pool.level1Commission}%</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-bold text-emerald-400">L2: {pool.level2Commission}%</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-sm font-bold text-purple-400">L3: {pool.level3Commission}%</div>
                  </div>
                </div>
              </div>

              {/* Invest Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPool(pool);
                }}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              >
                Invest Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Invest in {selectedPool.name}
            </h2>
            <p className="text-gray-400 mb-6">{selectedPool.description}</p>

            {/* Investment Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">Daily Return</p>
                <p className="text-lg font-bold text-emerald-400">{selectedPool.dailyReturn}%</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-lg font-bold text-cyan-400">{selectedPool.durationDays} days</p>
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
                  className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={isInvesting || !investAmount}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isInvesting ? (
                  "Processing..."
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Confirm Investment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
