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
        return <Download className="w-4 h-4 text-[#00ff88]" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "exchange":
        return <ArrowLeftRight className="w-4 h-4 text-[#00d2ff]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="exchange-page">
      <div className="page-header">
        <h1>Exchange History</h1>
        <p>View your exchange, deposit, and withdrawal history.</p>
      </div>

      <GlassCard>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p className="loading-text">Loading history...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>
                      <div className="transaction-type">
                        <div className="transaction-icon">
                          <TypeIcon type={tx.type} />
                        </div>
                        <span className="transaction-label">{tx.type}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`amount ${tx.amount >= 0 ? "positive" : "negative"}`}>
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="description">{tx.description || "-"}</td>
                    <td className="date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${
                        tx.status === "completed" || tx.status === "confirmed"
                          ? "status-success"
                          : tx.status === "pending"
                          ? "status-pending"
                          : "status-error"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <ArrowLeftRight className="empty-icon" />
            <p className="empty-text">No transactions yet</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
