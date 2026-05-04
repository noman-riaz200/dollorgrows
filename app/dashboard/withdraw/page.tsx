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
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";

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

  return (
    <div className="withdraw-page p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/dashboard/wallet" 
            className="p-2 rounded-lg glass border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Withdraw USDT</h1>
            <p className="text-gray-400">Withdraw funds to your external wallet</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Available Balance: <span className="text-white font-semibold">${balance.toLocaleString()}</span>
          </div>
          <button
            onClick={fetchWalletData}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdraw Form */}
        <GlassCard className="p-6" neonBorder="mint">
          <h2 className="text-xl font-bold text-white mb-6">Withdraw Funds</h2>
          
          <div className="space-y-6">
            {/* Wallet Address Input */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-gray-400">USDT Wallet Address</label>
                {connectedAddress ? (
                  <button
                    type="button"
                    onClick={autoFillWalletAddress}
                    className="flex items-center gap-1 text-xs text-[#00ff88] hover:text-[#00cc88] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Auto-fill
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className="flex items-center gap-1 text-xs text-[#00d2ff] hover:text-[#00a2ff] transition-colors"
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
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Ensure the address supports USDT on the network you intend to receive.
              </p>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Amount (USDT)</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter USDT amount"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff88]/50 transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  USDT
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAmount("50")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00ff88]/30 transition-all"
                >
                  $50
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("100")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00ff88]/30 transition-all"
                >
                  $100
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("500")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00ff88]/30 transition-all"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("1000")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00ff88]/30 transition-all"
                >
                  $1000
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Available: ${balance.toLocaleString()} (USDT equivalent)
              </p>
            </div>

            <NeonButton
              variant="green"
              fullWidth
              onClick={handleWithdraw}
              disabled={loading || !amount || !walletAddress}
              className="py-4"
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
            </NeonButton>
          </div>
        </GlassCard>

        {/* Instructions & Recent Withdrawals */}
        <div className="space-y-6">
          {/* Instructions */}
          <GlassCard className="p-6" neonBorder="cyan">
            <h3 className="text-lg font-bold text-white mb-4">How to Withdraw</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Enter your wallet address</p>
                  <p className="text-gray-400 text-sm">Provide a valid USDT wallet address (TRC20 or ERC20)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Specify amount</p>
                  <p className="text-gray-400 text-sm">Enter the amount you wish to withdraw (minimum $10)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Submit request</p>
                  <p className="text-gray-400 text-sm">Click “Request USDT Withdrawal” to submit for admin approval</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center text-[#00ff88] text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Wait for processing</p>
                  <p className="text-gray-400 text-sm">Withdrawals are processed manually within 24–48 hours</p>
                </div>
              </li>
            </ol>
          </GlassCard>

          {/* Recent Withdrawals */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Withdrawals</h3>
              <span className="text-sm text-gray-400">{transactions.filter(t => t.type === "withdrawal").length} transactions</span>
            </div>
            
            {transactions.filter(t => t.type === "withdrawal").length > 0 ? (
              <div className="space-y-3">
                {transactions
                  .filter(t => t.type === "withdrawal")
                  .slice(0, 5)
                  .map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <Send className="w-4 h-4 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">${tx.amount.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString()} • {tx.network?.toUpperCase() || "USDT"}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-500">No withdrawal history yet</p>
                <p className="text-sm text-gray-600 mt-1">Your withdrawals will appear here</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}