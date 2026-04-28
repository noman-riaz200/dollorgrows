"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, TrendingUp, Download, ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export default function ExchangeHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await fetch("/api/wallet/deposit");
      const data = await res.json();
      const filtered = (data.transactions || []).filter((t: Transaction) =>
        t.type === "exchange" || t.type === "deposit" || t.type === "withdrawal"
      );
      setTransactions(filtered);
    } catch (e) {
      console.error("Failed to load transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "deposit":
        return <Download className="w-4 h-4 text-emerald-400" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "exchange":
        return <ArrowLeftRight className="w-4 h-4 text-cyan-400" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Exchange History</h1>
        <p className="text-gray-400">View your exchange, deposit, and withdrawal history.</p>
      </div>

      <GlassCard>
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading history...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Description</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center">
                          <TypeIcon type={tx.type} />
                        </div>
                        <span className="text-white font-medium capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold ${tx.amount >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">{tx.description || "-"}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === "completed" || tx.status === "confirmed" ? "bg-emerald-500/10 text-emerald-400" : tx.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <ArrowLeftRight className="w-10 h-10 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
