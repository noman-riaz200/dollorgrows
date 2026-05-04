"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Plus, 
  X, 
  Download, 
  RefreshCw, 
  ArrowLeft,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import "./deposit.css";

interface DepositAddresses {
  trc20: string;
  erc20: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  txHash?: string;
  network?: string;
}

export default function DepositPage() {
  const { data: session } = useSession();

  const [depositAddresses, setDepositAddresses] = useState<DepositAddresses>({
    trc20: "",
    erc20: "",
  });
  const [depositNetwork, setDepositNetwork] = useState<"trc20" | "erc20">("trc20");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);

  const fetchWalletData = useCallback(async () => {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setBalance(data.wallet?.balanceWallet || 0);

      const txRes = await fetch("/api/wallet/deposit");
      const txData = await txRes.json();
      setTransactions(txData.transactions || []);
      if (txData.addresses) {
        setDepositAddresses(txData.addresses);
      }
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      toast.error("Failed to load wallet data");
    }
  }, []);

  useEffect(() => {
    if (session) fetchWalletData();
  }, [session, fetchWalletData]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!txHash || txHash.trim().length < 10) {
      toast.error("Please enter a valid transaction ID (TxHash)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          txHash: txHash.trim(),
          network: depositNetwork
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAmount("");
        setTxHash("");
        fetchWalletData();
        toast.success("Deposit submitted for admin approval");
      } else {
        toast.error(data.error || "Deposit failed");
      }
    } catch {
      toast.error("Failed to process deposit");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    const isSuccess = normalized === "completed" || normalized === "success" || normalized === "approved";
    const isPending = normalized === "pending";
    const isFailed = normalized === "failed" || normalized === "rejected";

    if (isSuccess) {
      return (
        <span className="deposit-status-badge deposit-status-success">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="deposit-status-badge deposit-status-pending">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="deposit-status-badge deposit-status-failed">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="deposit-status-badge deposit-status-default">
        {status}
      </span>
    );
  };

  return (
    <div className="deposit-page">
      {/* Header */}
      <div className="deposit-header">
        <div className="deposit-header-top">
          <Link 
            href="/dashboard/wallet" 
            className="deposit-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="deposit-title">
            <h1>Deposit USDT</h1>
            <p>Add funds to your wallet via USDT</p>
          </div>
        </div>
        <div className="deposit-header-bottom">
          <div className="deposit-balance">
            Current Balance: <span>${balance.toLocaleString()}</span>
          </div>
          <button
            onClick={fetchWalletData}
            className="deposit-refresh-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="deposit-grid">
        {/* Deposit Form */}
        <div className="deposit-glass-card neon-blue">
          <h2 className="deposit-card-title">Make a Deposit</h2>
          
          <div className="deposit-form-space">
            {/* Network Selection */}
            <div className="deposit-form-group">
              <label className="deposit-label">Select Network</label>
              <div className="deposit-network-buttons">
                <button
                  type="button"
                  onClick={() => setDepositNetwork("trc20")}
                  className={`deposit-network-btn ${depositNetwork === "trc20" ? "active" : ""}`}
                >
                  <div className="deposit-network-name">TRC20 (Tron)</div>
                  <div className="deposit-network-desc">Fast & Low Fee</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDepositNetwork("erc20")}
                  className={`deposit-network-btn ${depositNetwork === "erc20" ? "active" : ""}`}
                >
                  <div className="deposit-network-name">ERC20 (Ethereum)</div>
                  <div className="deposit-network-desc">Widely Supported</div>
                </button>
              </div>
            </div>

            {/* Deposit Address Display */}
            <div className="deposit-form-group">
              <div className="deposit-address-header">
                <label className="deposit-label">Deposit Address</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(depositAddresses[depositNetwork] || "")}
                  className="deposit-copy-btn"
                >
                  <Copy className="w-3 h-3" />
                  Copy Address
                </button>
              </div>
              <div className="deposit-address-wrapper">
                <input
                  type="text"
                  readOnly
                  value={depositAddresses[depositNetwork] || "Loading deposit address..."}
                  className="deposit-address-input"
                />
                <div className="deposit-address-pulse"></div>
              </div>
              <p className="deposit-address-note">
                Send only USDT ({depositNetwork.toUpperCase()}) to this address. Sending other tokens may result in permanent loss.
              </p>
            </div>

            {/* Amount Input */}
            <div className="deposit-form-group">
              <label className="deposit-label">Amount (USDT)</label>
              <div className="deposit-amount-wrapper">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter USDT amount"
                  className="deposit-amount-input"
                />
                <div className="deposit-amount-suffix">
                  USDT
                </div>
              </div>
              <div className="deposit-quick-amounts">
                <button
                  type="button"
                  onClick={() => setAmount("50")}
                  className="deposit-quick-btn"
                >
                  $50
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("100")}
                  className="deposit-quick-btn"
                >
                  $100
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("500")}
                  className="deposit-quick-btn"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("1000")}
                  className="deposit-quick-btn"
                >
                  $1000
                </button>
              </div>
            </div>

            {/* Transaction Hash Input */}
            <div className="deposit-form-group">
              <label className="deposit-label">Transaction ID (TxHash)</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter transaction hash from your wallet"
                className="deposit-txhash-input"
              />
              <p className="deposit-address-note">
                After sending USDT, paste the transaction hash here for verification.
              </p>
            </div>

            <button
              className={`deposit-submit-btn ${loading ? "loading" : ""}`}
              onClick={handleDeposit}
              disabled={loading || !amount || !txHash}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Submit Deposit Request
                </>
              )}
            </button>
          </div>
        </div>

        {/* Deposit History & Instructions */}
        <div className="deposit-side-column">
          {/* Instructions */}
          <div className="deposit-glass-card neon-cyan">
            <h3 className="deposit-card-title">How to Deposit</h3>
            <ol className="deposit-instructions-list">
              <li className="deposit-instruction-item">
                <div className="deposit-instruction-number">1</div>
                <div className="deposit-instruction-content">
                  <h4>Copy the deposit address</h4>
                  <p>Use the copy button above to copy the {depositNetwork.toUpperCase()} address</p>
                </div>
              </li>
              <li className="deposit-instruction-item">
                <div className="deposit-instruction-number">2</div>
                <div className="deposit-instruction-content">
                  <h4>Send USDT to the address</h4>
                  <p>From your wallet (MetaMask, Trust Wallet, etc.), send USDT to the copied address</p>
                </div>
              </li>
              <li className="deposit-instruction-item">
                <div className="deposit-instruction-number">3</div>
                <div className="deposit-instruction-content">
                  <h4>Wait for confirmation</h4>
                  <p>Wait for the transaction to be confirmed on the blockchain (usually 1-5 minutes)</p>
                </div>
              </li>
              <li className="deposit-instruction-item">
                <div className="deposit-instruction-number">4</div>
                <div className="deposit-instruction-content">
                  <h4>Enter TxHash & Submit</h4>
                  <p>Paste the transaction hash and submit for admin approval</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Recent Deposits */}
          <div className="deposit-glass-card">
            <div className="deposit-history-header">
              <h3 className="deposit-history-title">Recent Deposits</h3>
              <span className="deposit-history-count">{transactions.filter(t => t.type === "deposit").length} transactions</span>
            </div>
            
            {transactions.filter(t => t.type === "deposit").length > 0 ? (
              <div className="deposit-history-list">
                {transactions
                  .filter(t => t.type === "deposit")
                  .slice(0, 5)
                  .map((tx) => (
                    <div key={tx.id} className="deposit-history-item">
                      <div className="deposit-history-left">
                        <div className="deposit-history-icon">
                          <Download className="w-4 h-4" />
                        </div>
                        <div className="deposit-history-details">
                          <h4>${tx.amount.toLocaleString()}</h4>
                          <p>
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.network?.toUpperCase() || "USDT"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="deposit-empty-state">
                <div className="deposit-empty-icon">
                  <Download className="w-6 h-6" />
                </div>
                <p className="deposit-empty-title">No deposit history yet</p>
                <p className="deposit-empty-desc">Your deposits will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}