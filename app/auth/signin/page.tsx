"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TrendingUp, Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setServerError("Invalid email or password");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setServerError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center px-4">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm animate-pulse">
            <TrendingUp className="w-7 h-7 text-black" />
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">
            Dollor<span className="text-[#00d2ff] text-glow-cyan">Grows</span>
          </span>
        </div>

        <GlassCard padding="lg" glow="cyan" className="animate-float">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Sign in to access your dashboard and investment pools.
          </p>

          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-pulse">
              {serverError}
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-4 py-3 mb-6",
              "bg-white/[0.03] border border-white/[0.08] rounded-lg",
              "text-white font-medium transition-all duration-300",
              "hover:bg-white/[0.06] hover:border-[#00d2ff]/30 hover:glow-cyan-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Chrome className="w-5 h-5 text-[#00d2ff]" />
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 transition-colors">
                <Mail className="w-5 h-5 text-gray-500 shrink-0" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 transition-colors">
                <Lock className="w-5 h-5 text-gray-500 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-red-400 text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-white/[0.15] bg-white/[0.03] text-[#00d2ff] focus:ring-[#00d2ff]/30 focus:ring-offset-0 cursor-pointer"
                  {...register("rememberMe")}
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm text-[#00d2ff] hover:text-[#00ff88] transition-colors"
              >
                Forgot password?
              </Link>
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

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[#00d2ff] hover:text-[#00ff88] font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </GlassCard>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00d2ff] text-glow-cyan">15</div>
            <div className="text-xs text-gray-400">Investment Pools</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00ff88] text-glow-green">3</div>
            <div className="text-xs text-gray-400">Referral Levels</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00d2ff] text-glow-cyan">BSC</div>
            <div className="text-xs text-gray-400">Blockchain</div>
          </div>
          <div className="glass rounded-lg p-4">
            <div className="text-2xl font-bold text-[#00ff88] text-glow-green">BEP20</div>
            <div className="text-xs text-gray-400">Token Compatible</div>
          </div>
        </div>
      </div>
    </div>
  );
}

