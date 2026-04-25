"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet, Send, Download, ArrowUpRight, ArrowDownRight, Plus, RefreshCw, X } from "lucide-react";
import type { EthereumProvider } from "@/types/ethereum";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
  txHash?: string;
}

export default function WalletPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchWalletData();
    }
  }, [session]);

  const fetchWalletData = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setBalance(data.stats.availableBalance);

      const txRes = await fetch("/api/wallet/deposit");
      const txData = await txRes.json();
      setTransactions(txData.transactions || []);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowDepositModal(false);
        setAmount("");
        fetchWalletData();
      } else {
        alert(data.error || "Deposit failed");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      alert("Failed to process deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !walletAddress) return;
    setLoading(true);

    try {
      alert("Withdrawal feature coming soon!");
      setShowWithdrawModal(false);
      setAmount("");
      setWalletAddress("");
    } catch {
      alert("Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = window.ethereum as EthereumProvider;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      }) as string[];
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarnings = transactions
    .filter((t) => t.type === "commission" || t.type === "referral_bonus")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-gray-400">Manage your deposits, withdrawals, and transaction history.</p>
        </div>

        {/* Balance Card */}
        <GlassCard glow="cyan" className="mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d2ff]/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <p className="text-gray-400 mb-2">Available Balance</p>
            <p className="text-5xl font-bold text-white mb-6">${balance.toLocaleString()}</p>
            <div className="flex gap-4">
              <NeonButton onClick={() => setShowDepositModal(true)} className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Deposit
              </NeonButton>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="px-6 py-3 glass rounded-lg text-white hover:bg-white/[0.06] transition-colors flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Withdraw
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-[#00ff88]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Deposits</p>
                <p className="text-xl font-bold text-white">${totalDeposits.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00d2ff]/10 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-[#00d2ff]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Earnings</p>
                <p className="text-xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="text-xl font-bold text-white">{transactions.length}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Transactions Table */}
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === "deposit" ? (
                          <Download className="w-4 h-4 text-[#00ff88]" />
                        ) : tx.type === "commission" || tx.type === "referral_bonus" ? (
                          <ArrowUpRight className="w-4 h-4 text-[#00d2ff]" />
                        ) : (
                          <Send className="w-4 h-4 text-purple-400" />
                        )}
                        <span className="text-white capitalize text-sm">{tx.type.replace("_", " ")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300 text-sm">{tx.description}</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold text-sm ${tx.amount > 0 ? "text-[#00ff88]" : "text-red-400"}`}>
                        {tx.amount > 0 ? "+" : ""}${tx.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === "completed"
                            ? "bg-[#00ff88]/10 text-[#00ff88]"
                            : tx.status === "pending"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="p-8 text-center text-gray-500">No transactions yet</div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full" glow="green">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
              <button onClick={() => setShowDepositModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
              </div>
            </div>

            <div className="mb-6 p-4 bg-white/[0.03] rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Network</span>
                <span className="text-sm font-medium text-white">BSC</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-400">Token</span>
                <span className="text-sm font-medium text-[#00d2ff]">BEP20</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-3 glass rounded-lg text-white hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <NeonButton
                fullWidth
                onClick={handleDeposit}
                disabled={loading || !amount}
                className="flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : <><Plus className="w-4 h-4" /> Continue</>}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <GlassCard className="max-w-md w-full" glow="cyan">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Withdraw Funds</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={balance}
                  className="w-full pl-8 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Available: ${balance.toLocaleString()}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">BEP20 Wallet Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
                <button
                  onClick={connectWallet}
                  className="px-4 py-3 glass rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <Wallet className="w-5 h-5 text-[#00d2ff]" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 glass rounded-lg text-white hover:bg-white/[0.06] transition-colors"
              >
                Cancel
              </button>
              <NeonButton
                fullWidth
                onClick={handleWithdraw}
                disabled={loading || !amount || !walletAddress}
                className="flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : <><Send className="w-4 h-4" /> Withdraw</>}
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

