"use client";

import { useState } from "react";
import { Lock, Check, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface Plan {
  id: number;
  name: string;
  price: number;
  returnAmount: number;
  returnPercent: number;
}

const plans: Plan[] = [
  { id: 1, name: "Grower", price: 10, returnAmount: 20, returnPercent: 200 },
  { id: 2, name: "Builder", price: 25, returnAmount: 50, returnPercent: 200 },
  { id: 3, name: "Starter", price: 50, returnAmount: 110, returnPercent: 220 },
  { id: 4, name: "Accelerator", price: 100, returnAmount: 240, returnPercent: 240 },
  { id: 5, name: "Booster", price: 250, returnAmount: 650, returnPercent: 260 },
  { id: 6, name: "Catalyst", price: 500, returnAmount: 1400, returnPercent: 280 },
  { id: 7, name: "Visionary", price: 1000, returnAmount: 3000, returnPercent: 300 },
  { id: 8, name: "Pioneer", price: 2500, returnAmount: 8000, returnPercent: 320 },
  { id: 9, name: "Navigator", price: 5000, returnAmount: 17500, returnPercent: 350 },
  { id: 10, name: "Innovator", price: 10000, returnAmount: 38000, returnPercent: 380 },
  { id: 11, name: "Champion", price: 25000, returnAmount: 100000, returnPercent: 400 },
  { id: 12, name: "Elite", price: 50000, returnAmount: 210000, returnPercent: 420 },
  { id: 13, name: "Titan", price: 75000, returnAmount: 337500, returnPercent: 450 },
  { id: 14, name: "Legend", price: 90000, returnAmount: 423000, returnPercent: 470 },
  { id: 15, name: "Supreme", price: 100000, returnAmount: 500000, returnPercent: 500 },
];

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [success, setSuccess] = useState("");

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan.id);
    setSuccess(`Plan "${plan.name}" selected successfully!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Investment Plans</h1>
          <div className="flex items-center gap-2 text-[#00ff88]">
            <Sparkles className="w-4 h-4" />
            <p className="text-sm font-medium">Step by step unlock after admin approval</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl text-[#00ff88] flex items-center gap-2">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, index) => {
            const isFirst = index === 0;
            const isSelected = selectedPlan === plan.id;

            return (
              <GlassCard
                key={plan.id}
                hover
                glow={isFirst ? "green" : "none"}
                neonBorder={isFirst ? "green" : "none"}
                className="flex flex-col"
              >
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isFirst
                          ? "bg-[#00ff88]/10 text-[#00ff88]"
                          : "bg-white/[0.03] text-gray-400"
                      }`}
                    >
                      <span className="text-sm font-bold">{plan.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  </div>
                  {isFirst && (
                    <span className="px-2 py-1 text-xs font-medium bg-[#00ff88]/10 text-[#00ff88] rounded-full border border-[#00ff88]/20">
                      Active
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Investment Amount</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#00d2ff]" />
                    <span className="text-2xl font-bold text-white">
                      {plan.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Return Details */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Total Return</p>
                    <p className="text-lg font-bold text-[#00ff88]">
                      ${plan.returnAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-white/[0.03] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">ROI</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-[#00d2ff]" />
                      <p className="text-lg font-bold text-[#00d2ff]">
                        {plan.returnPercent}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {isFirst ? (
                  <NeonButton
                    variant="green"
                    fullWidth
                    onClick={() => handleSelectPlan(plan)}
                    className="flex items-center justify-center gap-2"
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      "Select Plan"
                    )}
                  </NeonButton>
                ) : (
                  <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border bg-red-500/10 text-red-400 border-red-500/30 cursor-not-allowed opacity-70"
                  >
                    <Lock className="w-4 h-4" />
                    Locked
                  </button>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

