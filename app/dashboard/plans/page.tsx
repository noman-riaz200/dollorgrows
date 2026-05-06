"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Lock, Check, Sparkles, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

interface Plan {
  id: number;
  name: string;
  price: number;
  returnAmount: number;
  returnPercent: number;
}

interface WalletData {
  wallet: {
    poolWallet: number;
  };
}

export default function PlansPage() {
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
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [poolBalance, setPoolBalance] = useState(0);
  const [userInvestments, setUserInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Fetch wallet balance and user investments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletRes = await fetch("/api/wallet");
        const walletData: WalletData = await walletRes.json();
        const poolWallet = Number(walletData.wallet?.poolWallet || 0);
        setPoolBalance(poolWallet);
        console.log("Fetched pool wallet:", poolWallet);
      } catch (err) {
        console.error("Failed to fetch wallet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleSelectPlan = async (plan: Plan) => {
    // Use epsilon to avoid floating point precision issues
    if (poolBalance + 0.001 < plan.price) {
      setError(`Pool Wallet has insufficient funds. Required: $${plan.price}, Available: $${poolBalance}. Please deposit funds into your Pool Wallet first.`);
      setTimeout(() => setError(""), 5000);
      return;
    }

    setIsPurchasing(true);
    setError("");
    try {
      const res = await fetch("/api/plan-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, amount: plan.price }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || `Plan "${plan.name}" selected successfully!`);
        setSelectedPlan(plan.id);
        // Refetch data
        window.location.reload(); // Simple refetch
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Purchase failed");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setIsPurchasing(false);
    }
  };


  return (
    <div className="plans-page">
      {loading && (
        <div className="loading-message text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto mb-4"></div>
          Loading plans...
        </div>
      )}

      {!loading && (
        <>
          {/* Header */}
          <div className="page-header">
            <h1>Investment Plans</h1>
            <div className="page-subtitle">
              <Sparkles className="subtitle-icon" />
              <p>Step by step unlock after admin approval</p>
            </div>
          </div>

          {/* Pool Balance */}
          <div className="pool-balance insufficient-warning mb-6 p-4 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-red-500/20 border border-orange-400/40 rounded-2xl">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-mint" />
              <div>
                <p className="text-sm text-gray-400">Pool Wallet Balance</p>
                <p className="text-2xl font-bold text-white">${poolBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="success-message mb-6">
              <Check className="success-icon" />
              {success}
            </div>
          )}
          {error && (
            <div className="pool-insufficient-error mb-6 p-4 bg-gradient-to-r from-red-400/15 via-orange-400/10 to-red-500/15 border border-red-400/40 rounded-2xl flex items-center gap-3 text-red-100 backdrop-blur-lg animate-slide-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
        </>
      )}


      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan, index) => {
          const isActivePlan = index === 0;
          const sufficientFunds = poolBalance + 0.001 >= plan.price;
          const isPurchasable = isActivePlan && sufficientFunds && !isPurchasing;
          const isSelected = selectedPlan === plan.id;

          return (
            <GlassCard
              key={plan.id}
              hover
              glow={isPurchasable ? "mint" : "none"}
              neonBorder={isPurchasable ? "mint" : "none"}
              className="plan-card"
            >
              {/* Plan Header */}
              <div className="plan-header">
                <div className="plan-title-wrapper">
                  <div className={`plan-number ${isActivePlan ? "active" : ""}`}>
                    <span>{plan.id}</span>
                  </div>
                  <h3 className="plan-name">{plan.name}</h3>
                </div>
                {isActivePlan ? (
                  <span className="plan-badge active">Active</span>
                ) : (
                  <span className="plan-badge">Locked</span>
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
              {isPurchasable ? (
                <NeonButton
                  variant="green"
                  fullWidth
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isPurchasing}
                  className="plan-select-button"
                >
                  {isPurchasing ? (
                    "Purchasing..."
                  ) : isSelected ? (
                    <>
                      <Check className="button-icon" />
                      Selected
                    </>
                  ) : (
                    "Select Plan"
                  )}
                </NeonButton>
              ) : index === 0 ? (
                <button
                  disabled
className="plan-insufficient-button insufficient-wallet-button"
                >
                  <AlertCircle className="button-icon" />
                  Insufficient Pool Wallet
                </button>
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
