"use client";

import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Loader2, TrendingUp, Mail, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
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
            Sign in to access your dashboard and investment pools.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-6 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-white/[0.03] border border-white/[0.08] rounded-l-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-l-0 border-white/[0.08] rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 bg-white/[0.03] border border-white/[0.08] rounded-l-lg">
                  <Lock className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-l-0 border-white/[0.08] rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00d2ff]/50 transition-colors"
                />
              </div>
            </div>

            <NeonButton
              fullWidth
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </NeonButton>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            Demo: <span className="text-gray-400">admin@dollorgrows.com</span> / <span className="text-gray-400">admin123</span>
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

