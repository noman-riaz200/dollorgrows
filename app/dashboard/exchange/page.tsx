"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  ArrowLeftRight,
  TrendingUp,
  Download,
  ArrowUpRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import "./exchange.css";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

interface WalletData {
  wallet: {
    balanceWallet: number;
    poolWallet: number;
    poolCommission: number;
  };
}

export default function ExchangePage() {
  const { data: session } = useSession();

  const [exchangeFrom, setExchangeFrom] = useState("balance");
  const [exchangeTo, setExchangeTo] = useState("pool");
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [poolWallet, setPoolWallet] = useState(0);

  const fetchWalletData = useCallback(async () => {
    try {
      const res = await fetch("/api/wallet");
      const data: WalletData = await res.json();
      setBalance(data.wallet.balanceWallet);
      setPoolWallet(data.wallet.poolWallet);

      const txRes = await fetch("/api/wallet/deposit");
      const txData = await txRes.json();
      const filtered = (txData.transactions || []).filter((t: Transaction) =>
        t.type === "exchange" || t.type === "deposit" || t.type === "withdrawal"
      );
      setTransactions(filtered);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      toast.error("Failed to load wallet data");
    }
  }, []);

  useEffect(() => {
    if (session) fetchWalletData();
  }, [session, fetchWalletData]);

  const handleExchange = async () => {
    if (!exchangeAmount || parseFloat(exchangeAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (exchangeFrom === exchangeTo) {
      toast.error("Source and target wallets must be different");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromType: exchangeFrom,
          toType: exchangeTo,
          amount: parseFloat(exchangeAmount),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setExchangeAmount("");
        fetchWalletData();
        toast.success("Exchange completed successfully");
      } else {
        toast.error(data.error || "Exchange failed");
      }
    } catch {
      toast.error("Failed to process exchange");
    } finally {
      setLoading(false);
    }
  };

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "deposit":
        return <Download className="w-4 h-4 text-[#00ff88]" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "exchange":
        return <ArrowLeftRight className="w-4 h-4 text-[#00d2ff]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    const isSuccess = normalized === "completed" || normalized === "success" || normalized === "approved";
    const isPending = normalized === "pending";
    const isFailed = normalized === "failed" || normalized === "rejected";

    if (isSuccess) {
      return (
        <span className="exchange-history-status exchange-status-success">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="exchange-history-status exchange-status-pending">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="exchange-history-status exchange-status-failed">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="exchange-history-status">
        {status}
      </span>
    );
  };

  return (
    <div className="exchange-page">
      {/* Header */}
      <div className="exchange-header">
        <div className="exchange-header-top">
          <Link
            href="/dashboard/wallet"
            className="exchange-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="exchange-title">
            <h1>Exchange Between Wallets</h1>
            <p>Transfer internal USDT balance between your wallets</p>
          </div>
        </div>
        <div className="exchange-header-info">
          <div className="exchange-balance-info">
            Balance Wallet: <span>${balance.toLocaleString()}</span> •
            Pool Wallet: <span>${poolWallet.toLocaleString()}</span>
          </div>
          <button
            onClick={fetchWalletData}
            className="exchange-refresh-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="exchange-content-grid">
        {/* Exchange Form */}
        <div className="exchange-glass-card neon-blue">
          <h2 className="exchange-form-title">Exchange Funds</h2>
          
          <div className="exchange-form">
            {/* From/To Selection */}
            <div className="exchange-selection-grid">
              <div className="exchange-select-group">
                <label className="exchange-select-label">From</label>
                <select
                  value={exchangeFrom}
                  onChange={(e) => setExchangeFrom(e.target.value)}
                  className="exchange-select"
                >
                  <option value="balance">Balance Wallet (USDT)</option>
                  <option value="pool">Pool Wallet (USDT)</option>
                </select>
                <p className="exchange-select-available">
                  {exchangeFrom === "balance"
                    ? `Available: $${balance.toLocaleString()}`
                    : `Available: $${poolWallet.toLocaleString()}`
                  }
                </p>
              </div>
              <div className="exchange-arrow-icon">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="exchange-select-group">
                <label className="exchange-select-label">To</label>
                <select
                  value={exchangeTo}
                  onChange={(e) => setExchangeTo(e.target.value)}
                  className="exchange-select"
                >
                  <option value="pool">Pool Wallet (USDT)</option>
                  <option value="balance">Balance Wallet (USDT)</option>
                </select>
                <p className="exchange-select-available">
                  {exchangeTo === "balance"
                    ? `Will receive: $${balance.toLocaleString()}`
                    : `Will receive: $${poolWallet.toLocaleString()}`
                  }
                </p>
              </div>
            </div>

            {/* Amount Input */}
            <div className="exchange-amount-group">
              <label className="exchange-select-label">Amount (USDT)</label>
              <input
                type="number"
                value={exchangeAmount}
                onChange={(e) => setExchangeAmount(e.target.value)}
                placeholder="Enter USDT amount"
                className="exchange-amount-input"
              />
              <div className="exchange-quick-amounts">
                <button
                  type="button"
                  onClick={() => setExchangeAmount("50")}
                  className="exchange-quick-btn"
                >
                  $50
                </button>
                <button
                  type="button"
                  onClick={() => setExchangeAmount("100")}
                  className="exchange-quick-btn"
                >
                  $100
                </button>
                <button
                  type="button"
                  onClick={() => setExchangeAmount("500")}
                  className="exchange-quick-btn"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => setExchangeAmount("1000")}
                  className="exchange-quick-btn"
                >
                  $1000
                </button>
              </div>
            </div>

            <button
              onClick={handleExchange}
              disabled={loading || !exchangeAmount || exchangeFrom === exchangeTo}
              className={`exchange-submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 exchange-spinner" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowLeftRight className="w-4 h-4" />
                  Confirm Exchange
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="exchange-right-column">
          {/* How Exchange Works */}
          <div className="exchange-glass-card neon-cyan">
            <h3 className="exchange-guide-title">How Exchange Works</h3>
            
            <ol className="exchange-guide-list">
              <li className="exchange-guide-item">
                <div className="exchange-guide-number">1</div>
                <div className="exchange-guide-content">
                  <h4>Select source & target wallets</h4>
                  <p>Choose which wallet to transfer from and to</p>
                </div>
              </li>
              <li className="exchange-guide-item">
                <div className="exchange-guide-number">2</div>
                <div className="exchange-guide-content">
                  <h4>Enter amount</h4>
                  <p>Specify the USDT amount you wish to exchange</p>
                </div>
              </li>
              <li className="exchange-guide-item">
                <div className="exchange-guide-number">3</div>
                <div className="exchange-guide-content">
                  <h4>Confirm exchange</h4>
                  <p>Click "Confirm Exchange" to instantly transfer</p>
                </div>
              </li>
              <li className="exchange-guide-item">
                <div className="exchange-guide-number">4</div>
                <div className="exchange-guide-content">
                  <h4>Track history</h4>
                  <p>Monitor your exchange transactions below</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Exchange History */}
          <div className="exchange-glass-card">
            <div className="exchange-history-title">
              <h3>Recent Exchange History</h3>
              <span className="exchange-history-count">{transactions.filter(t => t.type === "exchange").length} exchanges</span>
            </div>
            
            {transactions.filter(t => t.type === "exchange").length > 0 ? (
              <div className="exchange-history-list">
                {transactions
                  .filter(t => t.type === "exchange")
                  .slice(0, 5)
                  .map((tx) => (
                    <div key={tx.id} className="exchange-history-item">
                      <div className="exchange-history-info">
                        <div className="exchange-history-icon">
                          <ArrowLeftRight className="w-4 h-4" />
                        </div>
                        <div className="exchange-history-details">
                          <h4>${tx.amount.toLocaleString()}</h4>
                          <p>
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.description || "Exchange"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="exchange-empty-state">
                <div className="exchange-empty-icon">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <p className="exchange-empty-title">No exchange history yet</p>
                <p className="exchange-empty-subtitle">Your exchanges will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
