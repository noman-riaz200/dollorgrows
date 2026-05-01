"use client";

import { useState } from "react";
import { Lock, Check, Sparkles, TrendingUp, DollarSign } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

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
    <div className="plans-page">
      {/* Header */}
      <div className="page-header">
        <h1>Investment Plans</h1>
        <div className="page-subtitle">
          <Sparkles className="subtitle-icon" />
          <p>Step by step unlock after admin approval</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="success-message">
          <Check className="success-icon" />
          {success}
        </div>
      )}

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan, index) => {
          const isFirst = index === 0;
          const isSelected = selectedPlan === plan.id;

          return (
            <GlassCard
              key={plan.id}
              hover
              glow={isFirst ? "mint" : "none"}
              neonBorder={isFirst ? "mint" : "none"}
              className="plan-card"
            >
              {/* Plan Header */}
              <div className="plan-header">
                <div className="plan-title-wrapper">
                  <div className={`plan-number ${isFirst ? "active" : ""}`}>
                    <span>{plan.id}</span>
                  </div>
                  <h3 className="plan-name">{plan.name}</h3>
                </div>
                {isFirst && (
                  <span className="plan-badge active">Active</span>
                )}
              </div>

              {/* Price */}
              <div className="plan-price-section">
                <p className="plan-label">Investment Amount</p>
                <div className="price-display">
                  <DollarSign className="price-icon" />
                  <span className="price-amount">${plan.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Return Details */}
              <div className="plan-details-grid">
                <div className="plan-detail-card">
                  <p className="plan-label">Total Return</p>
                  <p className="return-amount">${plan.returnAmount.toLocaleString()}</p>
                </div>
                <div className="plan-detail-card">
                  <p className="plan-label">ROI</p>
                  <div className="roi-display">
                    <TrendingUp className="roi-icon" />
                    <p className="roi-percent">{plan.returnPercent}%</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isFirst ? (
                <NeonButton
                  variant="green"
                  fullWidth
                  onClick={() => handleSelectPlan(plan)}
                  className="plan-select-button"
                >
                  {isSelected ? (
                    <>
                      <Check className="button-icon" />
                      Selected
                    </>
                  ) : (
                    "Select Plan"
                  )}
                </NeonButton>
              ) : (
                <button
                  disabled
                  className="plan-locked-button"
                >
                  <Lock className="button-icon" />
                  Locked
                </button>
              )}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
