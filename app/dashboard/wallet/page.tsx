"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Wallet,
  Send,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  X,
  ArrowLeftRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  PiggyBank,
  CreditCard,
  ExternalLink,
  Network,
  Globe,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { formatAddress } from "@/lib/utils";

/* ─── Types ─── */
interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  txHash?: string;
}

interface WalletData {
  wallet: {
    balanceWallet: number;
    poolWallet: number;
    poolCommission: number;
  };
  stats: {
    totalAvailable: number;
    totalDonated: number;
    totalWithdrawn: number;
    totalInPool: number;
    totalCommission: number;
  };
}

/* ─── Component ─── */
export default function WalletPage() {
  const { data: session } = useSession();

  /* Wallet data */
  const [balance, setBalance] = useState(0);
  const [poolWallet, setPoolWallet] = useState(0);
  const [poolCommission, setPoolCommission] = useState(0);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  /* Modals */
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);

  /* Forms */
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [exchangeFrom, setExchangeFrom] = useState("balance");
  const [exchangeTo, setExchangeTo] = useState("pool");
  const [exchangeAmount, setExchangeAmount] = useState("");

  /* Loading */
  const [loading, setLoading] = useState(false);

  /* MetaMask */
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  /* Fetch wallet data */
  const fetchWalletData = useCallback(async () => {
    try {
      const res = await fetch("/api/wallet");
      const data: WalletData = await res.json();
      setBalance(data.wallet.balanceWallet);
      setPoolWallet(data.wallet.poolWallet);
      setPoolCommission(data.wallet.poolCommission);
      setTotalAvailable(data.stats.totalAvailable);
      setTotalDonated(data.stats.totalDonated);
      setTotalWithdrawn(data.stats.totalWithdrawn);

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

  /* ─── MetaMask Connect ─── */
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install MetaMask.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accounts.length > 0) {
        setConnectedAddress(accounts[0]);
        const cid = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;
        setChainId(cid);
        toast.success("Wallet connected successfully");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress(null);
    setChainId(null);
    toast.info("Wallet disconnected");
  };

  const autoFillWalletAddress = () => {
    if (connectedAddress) {
      setWalletAddress(connectedAddress);
      toast.success("Wallet address auto-filled");
    } else {
      toast.error("No wallet connected");
    }
  };

  /* ─── Handlers ─── */
  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowDepositModal(false);
        setAmount("");
        fetchWalletData();
        toast.success("Deposit successful");
      } else {
        toast.error(data.error || "Deposit failed");
      }
    } catch {
      toast.error("Failed to process deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !walletAddress || parseFloat(amount) <= 0) return;
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
        setShowWithdrawModal(false);
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

  const handleExchange = async () => {
    if (!exchangeAmount || parseFloat(exchangeAmount) <= 0) return;
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
        setShowExchangeModal(false);
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

  /* ─── Derived stats ─── */
  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarnings = transactions
    .filter((t) => t.type === "commission" || t.type === "referral_bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  const isBsc = chainId === "0x38" || chainId === "0x61";

  /* ─── Status badge helper ─── */
  const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    const isSuccess = normalized === "completed" || normalized === "success" || normalized === "approved";
    const isPending = normalized === "pending";
    const isFailed = normalized === "failed" || normalized === "rejected";

    if (isSuccess) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#00ff88]/10 text-[#00ff88]">
          <CheckCircle2 className="w-3 h-3" />
          Success
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
    if (isFailed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
          <AlertCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
        {status}
      </span>
    );
  };

  /* ─── Type icon helper ─── */
  const TypeIcon = ({ type }: { type: string }) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return <Download className="w-4 h-4 text-[#00d2ff]" />;
      case "withdrawal":
        return <Send className="w-4 h-4 text-red-400" />;
      case "exchange":
        return <ArrowLeftRight className="w-4 h-4 text-[#00ff88]" />;
      case "commission":
      case "referral_bonus":
        return <TrendingUp className="w-4 h-4 text-[#00ff88]" />;
      case "investment":
        return <PiggyBank className="w-4 h-4 text-[#00d2ff]" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div>
        {/* ─── Header ─── */}
        <div className="wallet-header">
          <div className="wallet-header-title">
            <h1>Wallet Dashboard</h1>
            <p>Manage your funds, exchange, and track transactions.</p>
          </div>

          <div className="wallet-header-actions">
            {/* BEP20 Status */}
            {connectedAddress && (
              <div className={`network-status ${isBsc ? 'connected' : 'disconnected'}`}>
                <Network className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isBsc ? "BEP20 Connected" : "Wrong Network"}
                </span>
              </div>
            )}

            {/* Connect Wallet Button */}
            {connectedAddress ? (
              <div className="flex items-center gap-2">
                <div className="connected-wallet">
                  <Globe className="w-4 h-4 text-[#00d2ff]" />
                  <span className="text-sm text-white font-medium">
                    {formatAddress(connectedAddress)}
                  </span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="p-2 rounded-lg glass border border-white/[0.08] text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <NeonButton
                variant="gradient"
                size="md"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Wallet className="w-4 h-4" />
                )}
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </NeonButton>
            )}
          </div>
        </div>

        {/* ─── Wallet Stats Cards ─── */}
        <div className="wallet-stats-grid">
          <div className="wallet-stat-card cyan">
            <div className="wallet-stat-card-header">
              <div className="wallet-stat-icon cyan">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="wallet-stat-label">Available</span>
            </div>
            <p className="wallet-stat-amount">${balance.toLocaleString()}</p>
            <p className="wallet-stat-description">Balance Wallet</p>
          </div>

          <div className="wallet-stat-card green">
            <div className="wallet-stat-card-header">
              <div className="wallet-stat-icon green">
                <PiggyBank className="w-6 h-6" />
              </div>
              <span className="wallet-stat-label">Staked</span>
            </div>
            <p className="wallet-stat-amount">${poolWallet.toLocaleString()}</p>
            <p className="wallet-stat-description">Pool Wallet</p>
          </div>

          <div className="wallet-stat-card cyan">
            <div className="wallet-stat-card-header">
              <div className="wallet-stat-icon cyan">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="wallet-stat-label">Earnings</span>
            </div>
            <p className="wallet-stat-amount">${poolCommission.toLocaleString()}</p>
            <p className="wallet-stat-description">Pool Commission</p>
          </div>
        </div>

        {/* ─── Withdrawal Section: Total Available & Total Donated ─── */}
        <div className="wallet-withdrawal-grid">
          <div className="wallet-withdrawal-card green">
            <div className="wallet-withdrawal-content">
              <div className="wallet-withdrawal-header">
                <div className="wallet-withdrawal-icon green">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="wallet-withdrawal-title">Total Available</p>
                  <p className="wallet-withdrawal-amount">${totalAvailable.toLocaleString()}</p>
                </div>
              </div>
              <p className="wallet-withdrawal-note">Funds available for withdrawal or exchange</p>
            </div>
          </div>

          <div className="wallet-withdrawal-card cyan">
            <div className="wallet-withdrawal-content">
              <div className="wallet-withdrawal-header">
                <div className="wallet-withdrawal-icon cyan">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="wallet-withdrawal-title">Total Donated</p>
                  <p className="wallet-withdrawal-amount">${totalDonated.toLocaleString()}</p>
                </div>
              </div>
              <p className="wallet-withdrawal-note">Total amount invested in pools</p>
            </div>
          </div>
        </div>

        {/* ─── Quick Actions ─── */}
        <div className="wallet-actions">
          <button className="wallet-action-button cyan" onClick={() => setShowDepositModal(true)}>
            <Plus className="w-4 h-4" /> Deposit
          </button>
          <button className="wallet-action-button green" onClick={() => setShowWithdrawModal(true)}>
            <Send className="w-4 h-4" /> Withdraw
          </button>
          <button className="wallet-action-button gradient" onClick={() => setShowExchangeModal(true)}>
            <ArrowLeftRight className="w-4 h-4" /> Exchange
          </button>
          {connectedAddress && (
            <button
              onClick={autoFillWalletAddress}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Auto-fill Address
            </button>
          )}
        </div>

        {/* ─── Transaction History Table ─── */}
        <div className="wallet-transaction-card">
          <div className="wallet-transaction-header">
            <h3 className="wallet-transaction-title">
              <CreditCard className="w-5 h-5 text-[#00d2ff]" />
              Transaction History
            </h3>
            <span className="wallet-transaction-count">{transactions.length} transactions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="wallet-transaction-table">
              <thead>
                <tr>
<th className="text-left">Type</th>
                  <th className="text-left">Amount</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Date</th>
                  <th className="text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
<td className="py-4 px-2 sm:px-4">
                        <div className="transaction-type">
                          <div className="transaction-type-icon">
                            <TypeIcon type={tx.type} />
                          </div>
                          <span className="transaction-type-name">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className={`transaction-amount ${tx.amount >= 0 ? "positive" : "negative"}`}>
                          {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="transaction-description">{tx.description || "-"}</span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <span className="transaction-date">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="py-4 px-2 sm:px-4">
                        <StatusBadge status={tx.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <CreditCard className="w-10 h-10 text-gray-600" />
                        <p className="text-gray-500">No transactions yet</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
</div>
        </div>

      {/* ─── Deposit Modal ─── */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative" neonBorder="blue">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Deposit Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]/50 transition-all"
                />
              </div>
              <NeonButton
                variant="gradient"
                fullWidth
                onClick={handleDeposit}
                disabled={loading || !amount}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Deposit"}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── Withdraw Modal ─── */}
      {showWithdrawModal && (
<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative" neonBorder="mint">
            <button
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="Enter BEP20 wallet address"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Available: ${balance.toLocaleString()}</p>
              </div>
              <NeonButton
                variant="green"
                fullWidth
                onClick={handleWithdraw}
                disabled={loading || !amount || !walletAddress}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Withdrawal"}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ─── Exchange Modal ─── */}
      {showExchangeModal && (
<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md relative" neonBorder="blue">
            <button
              onClick={() => setShowExchangeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Exchange Between Wallets</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">From</label>
                  <select
                    value={exchangeFrom}
                    onChange={(e) => setExchangeFrom(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#00d2ff]/50 transition-all appearance-none"
                  >
                    <option value="balance" className="bg-[#0a0a0f]">Balance Wallet</option>
                    <option value="pool" className="bg-[#0a0a0f]">Pool Wallet</option>
                  </select>
                </div>
                <div className="pb-3">
                  <ArrowLeftRight className="w-5 h-5 text-[#00d2ff]" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">To</label>
                  <select
                    value={exchangeTo}
                    onChange={(e) => setExchangeTo(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-[#00d2ff]/50 transition-all appearance-none"
                  >
                    <option value="pool" className="bg-[#0a0a0f]">Pool Wallet</option>
                    <option value="balance" className="bg-[#0a0a0f]">Balance Wallet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]/50 transition-all"
                />
              </div>
              <NeonButton
                variant="gradient"
                fullWidth
                onClick={handleExchange}
                disabled={loading || !exchangeAmount || exchangeFrom === exchangeTo}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Exchange"}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

