"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { 
  Send, 
  X, 
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import "./withdraw.css";

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

export default function WithdrawPage() {
  const { data: session } = useSession();

  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchWalletData = useCallback(async () => {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      setBalance(data.wallet?.balanceWallet || 0);

      const txRes = await fetch("/api/wallet/deposit");
      const txData = await txRes.json();
      setTransactions(txData.transactions || []);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
      toast.error("Failed to load wallet data");
    }
  }, []);

  useEffect(() => {
    if (session) fetchWalletData();
  }, [session, fetchWalletData]);

  const connectWallet = async () => {
    if (typeof window === 'undefined') {
      toast.error("Wallet connection is only available in the browser.");
      return;
    }
    
    if (!window.ethereum) {
      toast.error(
        "MetaMask not detected. Please install MetaMask or another Ethereum wallet. Visit https://metamask.io/download/",
        { duration: 5000 }
      );
      return;
    }
    
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        toast.success("Wallet connected successfully");
      }
    } catch (err: any) {
      if (err.code === 4001 || err?.message?.includes('rejected') || err?.message?.includes('denied')) {
        toast.error("Connection rejected by user");
      } else {
        toast.error(err.message || "Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const autoFillWalletAddress = () => {
    if (connectedAddress) {
      setWalletAddress(connectedAddress);
      toast.success("Wallet address auto-filled");
    } else {
      toast.error("No wallet connected");
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!walletAddress || walletAddress.trim().length < 10) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          walletAddress: walletAddress.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAmount("");
        setWalletAddress("");
        fetchWalletData();
        toast.success("Withdrawal request submitted");
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch {
      toast.error("Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    const isSuccess = normalized === "completed" || normalized === "success" || normalized === "approved";
    const isPending = normalized === "pending";
    const isFailed = normalized === "failed" || normalized === "rejected";

    if (isSuccess) {
      return (
        <span className="withdraw-status-badge withdraw-status-success">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="withdraw-status-badge withdraw-status-pending">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="withdraw-status-badge withdraw-status-failed">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="withdraw-status-badge withdraw-status-default">
        {status}
      </span>
    );
  };

  return (
    <div className="withdraw-page">
      {/* Header */}
      <div className="withdraw-header">
        <div className="withdraw-header-top">
          <Link
            href="/dashboard/wallet"
            className="withdraw-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="withdraw-title">
            <h1>Withdraw USDT</h1>
            <p>Withdraw funds to your external wallet</p>
          </div>
        </div>
        <div className="withdraw-header-bottom">
          <div className="withdraw-balance">
            Available Balance: <span>${balance.toLocaleString()}</span>
          </div>
          <button
            onClick={fetchWalletData}
            className="withdraw-refresh-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="withdraw-grid">
        {/* Withdraw Form */}
        <div className="withdraw-glass-card neon-green">
          <h2 className="withdraw-card-title">Withdraw Funds</h2>
          
          <div className="withdraw-form-space">
            {/* Wallet Address Input */}
            <div className="withdraw-form-group">
              <div className="withdraw-address-header">
                <label className="withdraw-label">USDT Wallet Address</label>
                {connectedAddress ? (
                  <button
                    type="button"
                    onClick={autoFillWalletAddress}
                    className="withdraw-auto-fill-btn"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Auto-fill
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="withdraw-connect-btn"
                  >
                    {isConnecting ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <ExternalLink className="w-3 h-3" />
                    )}
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </button>
                )}
              </div>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter TRC20 or ERC20 wallet address for USDT"
                className="withdraw-input"
              />
              <p className="withdraw-input-note">
                Ensure the address supports USDT on the network you intend to receive.
              </p>
            </div>

            {/* Amount Input */}
            <div className="withdraw-form-group">
              <label className="withdraw-label">Amount (USDT)</label>
              <div className="withdraw-amount-wrapper">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter USDT amount"
                  className="withdraw-input"
                />
                <div className="withdraw-amount-suffix">
                  USDT
                </div>
              </div>
              <div className="withdraw-quick-amounts">
                <button
                  type="button"
                  onClick={() => setAmount("50")}
                  className="withdraw-quick-btn"
                >
                  $50
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("100")}
                  className="withdraw-quick-btn"
                >
                  $100
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("500")}
                  className="withdraw-quick-btn"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("1000")}
                  className="withdraw-quick-btn"
                >
                  $1000
                </button>
              </div>
              <p className="withdraw-input-note">
                Available: ${balance.toLocaleString()} (USDT equivalent)
              </p>
            </div>

            <button
              className="withdraw-submit-btn"
              onClick={handleWithdraw}
              disabled={loading || !amount || !walletAddress}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Request USDT Withdrawal
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions & Recent Withdrawals */}
        <div className="withdraw-side-column">
          {/* Instructions */}
          <div className="withdraw-glass-card neon-cyan">
            <h3 className="withdraw-card-title">How to Withdraw</h3>
            <ol className="withdraw-instructions-list">
              <li className="withdraw-instruction-item">
                <div className="withdraw-instruction-number">1</div>
                <div className="withdraw-instruction-content">
                  <h4>Enter your wallet address</h4>
                  <p>Provide a valid USDT wallet address (TRC20 or ERC20)</p>
                </div>
              </li>
              <li className="withdraw-instruction-item">
                <div className="withdraw-instruction-number">2</div>
                <div className="withdraw-instruction-content">
                  <h4>Specify amount</h4>
                  <p>Enter the amount you wish to withdraw (minimum $10)</p>
                </div>
              </li>
              <li className="withdraw-instruction-item">
                <div className="withdraw-instruction-number">3</div>
                <div className="withdraw-instruction-content">
                  <h4>Submit request</h4>
                  <p>Click “Request USDT Withdrawal” to submit for admin approval</p>
                </div>
              </li>
              <li className="withdraw-instruction-item">
                <div className="withdraw-instruction-number">4</div>
                <div className="withdraw-instruction-content">
                  <h4>Wait for processing</h4>
                  <p>Withdrawals are processed manually within 24–48 hours</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Recent Withdrawals */}
          <div className="withdraw-glass-card">
            <div className="withdraw-history-header">
              <h3 className="withdraw-history-title">Recent Withdrawals</h3>
              <span className="withdraw-history-count">{transactions.filter(t => t.type === "withdrawal").length} transactions</span>
            </div>
            
            {transactions.filter(t => t.type === "withdrawal").length > 0 ? (
              <div className="withdraw-history-list">
                {transactions
                  .filter(t => t.type === "withdrawal")
                  .slice(0, 5)
                  .map((tx) => (
                    <div key={tx.id} className="withdraw-history-item">
                      <div className="withdraw-history-left">
                        <div className="withdraw-history-icon">
                          <Send className="w-4 h-4" />
                        </div>
                        <div className="withdraw-history-details">
                          <h4>${tx.amount.toLocaleString()}</h4>
                          <p>{new Date(tx.createdAt).toLocaleDateString()} • {tx.network?.toUpperCase() || "USDT"}</p>
                        </div>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="withdraw-empty-state">
                <div className="withdraw-empty-icon">
                  <Send className="w-6 h-6" />
                </div>
                <p className="withdraw-empty-title">No withdrawal history yet</p>
                <p className="withdraw-empty-desc">Your withdrawals will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}