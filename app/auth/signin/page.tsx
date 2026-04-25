"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Wallet, Loader2, TrendingUp } from "lucide-react";
import type { EthereumProvider } from "@/types/ethereum";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleSignIn = async (e: FormEvent) => {
    e?.preventDefault();
    if (!walletAddress) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsLoading(true);

    try {
      const message = `Sign this message to authenticate with DollorGrows\nTimestamp: ${Date.now()}`;
      
      const provider = window.ethereum as EthereumProvider;
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);

      const result = await signIn("credentials", {
        walletAddress,
        signature,
        message,
        redirect: false,
      });

      if (result?.error) {
        alert("Authentication failed: " + result.error);
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error: unknown) {
      const err = error as Error;
      alert("Failed to sign in: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md px-6">
        <GlassCard padding="lg" className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Dollor<span className="text-[#00d2ff]">Grows</span>
            </span>
          </div>

          <p className="text-gray-400 mb-8">
            Connect your wallet to access your dashboard and investment pools.
          </p>

          {/* Wallet Connection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">
                Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                  readOnly
                />
                <button
                  onClick={connectWallet}
                  className="px-4 py-3 glass rounded-lg hover:bg-white/[0.06] transition-colors flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5 text-[#00d2ff]" />
                </button>
              </div>
            </div>

            {walletAddress && (
              <NeonButton
                fullWidth
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign In with Wallet"
                )}
              </NeonButton>
            )}

            <button
              onClick={connectWallet}
              className="text-[#00d2ff] hover:text-[#00ff88] text-sm transition-colors"
            >
              Don&apos;t have a wallet? Install MetaMask
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#00d2ff]">15</div>
                <div className="text-xs text-gray-400">Investment Pools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00ff88]">3</div>
                <div className="text-xs text-gray-400">Referral Levels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00d2ff]">BSC</div>
                <div className="text-xs text-gray-400">Blockchain</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00ff88]">BEP20</div>
                <div className="text-xs text-gray-400">Token Compatible</div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

