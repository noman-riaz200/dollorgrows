"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Wallet, Send, Download, ArrowUpRight, ArrowDownRight, Plus, RefreshCw } from "lucide-react";
import type { EthereumProvider } from "@/types/ethereum";

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
      const loadWalletData = async () => {
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
      loadWalletData();
    }
  }, [session]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          tokenAddress: process.env.NEXT_PUBLIC_BEP20_TOKEN_ADDRESS,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowDepositModal(false);
        setAmount("");
        alert("Deposit initiated! Wait for confirmation.");
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
      // In production, create withdrawal request
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your deposits, withdrawals, and transaction history.</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-emerald-900/40 border border-cyan-800/50 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <p className="text-gray-400 mb-2">Available Balance</p>
          <p className="text-5xl font-bold text-white mb-4">${balance.toLocaleString()}</p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Deposit
            </button>
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-6 py-3 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Deposits</p>
              <p className="text-xl font-bold text-white">
                $
                {transactions
                  .filter((t) => t.type === "deposit")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Earnings</p>
              <p className="text-xl font-bold text-white">
                $
                {transactions
                  .filter((t) => t.type === "commission" || t.type === "investment")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Transactions</p>
              <p className="text-xl font-bold text-white">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === "deposit" ? (
                        <Download className="w-4 h-4 text-emerald-400" />
                      ) : tx.type === "commission" ? (
                        <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Send className="w-4 h-4 text-purple-400" />
                      )}
                      <span className="text-white capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${tx.amount > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.amount > 0 ? "+" : ""}${tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : tx.status === "pending"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
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
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Deposit Funds</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* BEP20 Token Info */}
            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Network</span>
                <span className="text-sm font-medium text-white">BSC (Binance Smart Chain)</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-400">Token</span>
                <span className="text-sm font-medium text-cyan-400">BEP20</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={loading || !amount}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Continue"}
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  max={balance}
                  className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Available: ${balance.toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                BEP20 Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  onClick={connectWallet}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Wallet className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                disabled={loading || !amount || !walletAddress}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Withdraw"}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
