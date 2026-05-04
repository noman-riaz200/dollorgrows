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
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";

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
    <div className="deposit-page p-4 md:p-6">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Deposit USDT</h1>
            <p className="text-gray-400">Add funds to your wallet via USDT</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Current Balance: <span className="text-white font-semibold">${balance.toLocaleString()}</span>
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
        {/* Deposit Form */}
        <GlassCard className="p-6" neonBorder="blue">
          <h2 className="text-xl font-bold text-white mb-6">Make a Deposit</h2>
          
          <div className="space-y-6">
            {/* Network Selection */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Select Network</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDepositNetwork("trc20")}
                  className={`flex-1 py-4 rounded-lg border transition-all ${depositNetwork === "trc20" ? "bg-[#00d2ff]/10 border-[#00d2ff]/50 text-white" : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-[#00d2ff]/30"}`}
                >
                  <div className="font-medium">TRC20 (Tron)</div>
                  <div className="text-xs mt-1">Fast & Low Fee</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDepositNetwork("erc20")}
                  className={`flex-1 py-4 rounded-lg border transition-all ${depositNetwork === "erc20" ? "bg-[#00d2ff]/10 border-[#00d2ff]/50 text-white" : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:border-[#00d2ff]/30"}`}
                >
                  <div className="font-medium">ERC20 (Ethereum)</div>
                  <div className="text-xs mt-1">Widely Supported</div>
                </button>
              </div>
            </div>

            {/* Deposit Address Display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm text-gray-400">Deposit Address</label>
                <button
                  type="button"
                  onClick={() => copyToClipboard(depositAddresses[depositNetwork] || "")}
                  className="flex items-center gap-1 text-xs text-[#00d2ff] hover:text-[#00a2ff] transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy Address
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={depositAddresses[depositNetwork] || "Loading deposit address..."}
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]/50 transition-all pr-12 font-mono text-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send only USDT ({depositNetwork.toUpperCase()}) to this address. Sending other tokens may result in permanent loss.
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
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]/50 transition-all"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  USDT
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setAmount("50")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all"
                >
                  $50
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("100")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all"
                >
                  $100
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("500")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all"
                >
                  $500
                </button>
                <button
                  type="button"
                  onClick={() => setAmount("1000")}
                  className="px-3 py-1 text-xs rounded-lg bg-white/[0.03] border border-white/[0.08] text-gray-400 hover:text-white hover:border-[#00d2ff]/30 transition-all"
                >
                  $1000
                </button>
              </div>
            </div>

            {/* Transaction Hash Input */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Transaction ID (TxHash)</label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Enter transaction hash from your wallet"
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-[#00d2ff]/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                After sending USDT, paste the transaction hash here for verification.
              </p>
            </div>

            <NeonButton
              variant="gradient"
              fullWidth
              onClick={handleDeposit}
              disabled={loading || !amount || !txHash}
              className="py-4"
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
            </NeonButton>
          </div>
        </GlassCard>

        {/* Deposit History & Instructions */}
        <div className="space-y-6">
          {/* Instructions */}
          <GlassCard className="p-6" neonBorder="cyan">
            <h3 className="text-lg font-bold text-white mb-4">How to Deposit</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Copy the deposit address</p>
                  <p className="text-gray-400 text-sm">Use the copy button above to copy the {depositNetwork.toUpperCase()} address</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Send USDT to the address</p>
                  <p className="text-gray-400 text-sm">From your wallet (MetaMask, Trust Wallet, etc.), send USDT to the copied address</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Wait for confirmation</p>
                  <p className="text-gray-400 text-sm">Wait for the transaction to be confirmed on the blockchain (usually 1-5 minutes)</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00d2ff]/20 flex items-center justify-center text-[#00d2ff] text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Enter TxHash & Submit</p>
                  <p className="text-gray-400 text-sm">Paste the transaction hash and submit for admin approval</p>
                </div>
              </li>
            </ol>
          </GlassCard>

          {/* Recent Deposits */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Recent Deposits</h3>
              <span className="text-sm text-gray-400">{transactions.filter(t => t.type === "deposit").length} transactions</span>
            </div>
            
            {transactions.filter(t => t.type === "deposit").length > 0 ? (
              <div className="space-y-3">
                {transactions
                  .filter(t => t.type === "deposit")
                  .slice(0, 5)
                  .map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00d2ff]/10">
                          <Download className="w-4 h-4 text-[#00d2ff]" />
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
                  <Download className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-500">No deposit history yet</p>
                <p className="text-sm text-gray-600 mt-1">Your deposits will appear here</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}