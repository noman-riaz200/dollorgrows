"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  TrendingUp,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  User,
  Gift,
  MapPin,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { Country } from "@/lib/countries";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      phoneCode: "+1",
      country: "US",
    },
  });

  const phoneCode = watch("phoneCode");
  const phoneNumber = watch("phone");
  const countryCode = watch("country");

  // Detect location on mount
  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch("/api/auth/geoip");
        const data = await res.json();
        if (data.success) {
          setValue("country", data.countryCode);
          setValue("phoneCode", data.dialCode);
        }
      } catch {
        // fallback already set
      } finally {
        setIsDetectingLocation(false);
      }
    }
    detectLocation();
  }, [setValue]);

  const handleCountryChange = (country: Country) => {
    setValue("country", country.code);
    setValue("phoneCode", country.dialCode);
  };

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!result.success) {
        setServerError(result.message || "Registration failed");
        toast.error(result.message || "Registration failed");
      } else {
        toast.success("Account created! Signing you in...");
        // Auto sign in after registration
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          setServerError("Account created but sign-in failed. Please sign in manually.");
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch {
      setServerError("Failed to register. Please try again.");
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-6 animate-auth-slide-up">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d2ff] to-[#00ff88] flex items-center justify-center glow-cyan-sm animate-pulse">
          <TrendingUp className="w-7 h-7 text-black" />
        </div>
        <span className="text-3xl font-bold text-white tracking-tight">
          Dollor<span className="text-[#00d2ff] text-glow-cyan">Grows</span>
        </span>
      </div>

      <GlassCard padding="lg" glow="green" className="animate-auth-fade-in">
        <h2 className="text-2xl font-bold text-white text-center mb-2 animate-auth-slide-up auth-stagger-1">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm animate-auth-slide-up auth-stagger-2">
          Join DollorGrows and start growing your investments today.
        </p>

        {serverError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm animate-pulse animate-auth-slide-up auth-stagger-2">
            {serverError}
          </div>
        )}

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-4 py-3 mb-6",
            "bg-white/[0.03] border border-white/[0.08] rounded-lg",
            "text-white font-medium transition-all duration-300",
            "hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed",
            "google-btn-glow-green"
          )}
        >
          <Globe className="w-5 h-5 text-[#00ff88]" />
          <span>Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 animate-auth-slide-up auth-stagger-3">
          <div className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-gray-500 text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Referral Code */}
          <div className="animate-auth-slide-up auth-stagger-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Referral Code <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 input-glow transition-all duration-300">
              <Gift className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Enter referral code"
                disabled={isLoading}
                className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50 uppercase"
                {...register("referralCode")}
              />
            </div>
            {errors.referralCode && (
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.referralCode.message}</p>
            )}
          </div>

          {/* Full Name */}
          <div className="animate-auth-slide-up auth-stagger-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 input-glow transition-all duration-300">
              <User className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="John Doe"
                disabled={isLoading}
                className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="animate-auth-slide-up auth-stagger-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 input-glow transition-all duration-300">
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
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="animate-auth-slide-up auth-stagger-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
              {isDetectingLocation && (
                <span className="ml-2 text-[#00d2ff] text-xs animate-pulse">
                  Detecting location...
                </span>
              )}
            </label>
            <PhoneInput
              phoneCode={phoneCode || "+1"}
              phoneNumber={phoneNumber || ""}
              onPhoneCodeChange={handleCountryChange}
              onPhoneNumberChange={(value) => setValue("phone", value)}
              error={errors.phone?.message}
              disabled={isLoading || isDetectingLocation}
            />
          </div>

          {/* Country */}
          <div className="animate-auth-slide-up auth-stagger-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-500 shrink-0" />
              <CountrySelect
                value={countryCode || "US"}
                onChange={handleCountryChange}
                disabled={isLoading || isDetectingLocation}
                className="flex-1"
              />
            </div>
            {errors.country && (
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.country.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="animate-auth-slide-up auth-stagger-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 input-glow transition-all duration-300">
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
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="animate-auth-slide-up auth-stagger-7">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="flex items-center px-4 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 input-glow transition-all duration-300">
              <Lock className="w-5 h-5 text-gray-500 shrink-0" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                disabled={isLoading}
                className="flex-1 px-3 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm disabled:opacity-50"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-red-400 text-xs animate-auth-slide-up">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="animate-auth-slide-up auth-stagger-8 pt-2">
            <NeonButton
              fullWidth
              type="submit"
              disabled={isLoading}
              animate
              className="flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </NeonButton>
          </div>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-400 animate-auth-slide-up auth-stagger-8">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-[#00d2ff] hover:text-[#00ff88] font-medium transition-colors link-glow"
          >
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}

