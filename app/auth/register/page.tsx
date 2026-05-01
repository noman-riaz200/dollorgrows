"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TrendingUp, Mail, Lock, Eye, EyeOff, User, Gift, MapPin, ArrowRight, Phone } from "lucide-react";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { countries } from "@/lib/countries";
import { toast } from "sonner";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phoneCode: "+1", country: "US" },
  });

  const phoneCode = watch("phoneCode");
  const countryCode = watch("country");

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
    <div className="register-page">
      {/* Background elements */}
      <div className="bg-shape bg-shape-1"></div>
      <div className="bg-shape bg-shape-2"></div>
      
      <div className="register-container">
        {/* Brand Header */}
        <Link href="/" className="brand-link">
          <div className="brand-logo">
            <TrendingUp size={24} color="white" />
          </div>
          <span className="brand-text">DollorGrows</span>
        </Link>

        {/* Form Card */}
        <div className="register-card">
          <div className="card-header">
            <h1 className="card-title">Create Account</h1>
            <p className="card-subtitle">Join DollorGrows and start growing your investments today.</p>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="google-btn"
          >
            <GoogleIcon className="google-icon" />
            Sign up with Google
          </button>

          <div className="divider">
            <span>or create an account</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            {serverError && (
              <div className="error-alert">
                {serverError}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-container">
                <User className="input-icon" size={20} />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  disabled={isLoading}
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  {...register("name")}
                />
              </div>
              {errors.name && <span className="error-text">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-container">
                <Mail className="input-icon" size={20} />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  {...register("email")}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label htmlFor="country">Country</label>
                <div className="input-container">
                  <MapPin className="input-icon" size={20} />
                  <select
                    id="country"
                    disabled={isLoading}
                    className={`form-input form-select ${errors.country ? 'input-error' : ''}`}
                    value={countryCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      const c = countries.find(x => x.code === val);
                      if (c) {
                        setValue("country", c.code);
                        setValue("phoneCode", c.dialCode);
                      }
                    }}
                  >
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && <span className="error-text">{errors.country.message}</span>}
              </div>

              <div className="form-group flex-1">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-container phone-container">
                  <div className="phone-code-badge">{phoneCode}</div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    disabled={isLoading}
                    className={`form-input phone-input ${errors.phone ? 'input-error' : ''}`}
                    {...register("phone")}
                    onChange={(e) => setValue("phone", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                {errors.phone && <span className="error-text">{errors.phone.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={20} />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="referralCode">Referral Code <span className="optional-text">(Optional)</span></label>
              <div className="input-container">
                <Gift className="input-icon" size={20} />
                <input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code"
                  disabled={isLoading}
                  className={`form-input uppercase-input ${errors.referralCode ? 'input-error' : ''}`}
                  {...register("referralCode")}
                />
              </div>
              {errors.referralCode && <span className="error-text">{errors.referralCode.message}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="card-footer">
            <p>
              Already have an account?{' '}
              <Link href="/auth/signin" className="signin-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          position: relative;
          overflow: hidden;
          padding: 3rem 1rem;
        }

        /* Abstract Background Shapes matching globals.css theme */
        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          opacity: 0.5;
        }

        .bg-shape-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
          top: -150px;
          right: -100px;
        }

        .bg-shape-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
          bottom: -200px;
          left: -150px;
        }

        .register-container {
          width: 100%;
          max-width: 520px;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 2rem;
          transition: var(--transition);
        }

        .brand-link:hover {
          transform: translateY(-2px);
        }

        .brand-logo {
          width: 42px;
          height: 42px;
          background: var(--accent-gradient);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-glow);
        }

        .brand-text {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.5px;
        }

        .register-card {
          width: 100%;
          background: var(--bg-secondary);
          border-radius: var(--radius-xl);
          padding: 2.5rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-light);
        }

        .card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
        }

        .google-btn:hover:not(:disabled) {
          background: var(--bg-primary);
          border-color: var(--accent-primary);
          transform: translateY(-1px);
        }

        .google-icon {
          width: 20px;
          height: 20px;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 2rem 0;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-light);
        }

        .divider span {
          padding: 0 1rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1.25rem;
        }
        
        @media (max-width: 500px) {
          .form-row {
            flex-direction: column;
          }
        }

        .flex-1 {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
        }

        .optional-text {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-left: 0.5rem;
          font-weight: 500;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          pointer-events: none;
          transition: var(--transition);
          z-index: 2;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: var(--bg-primary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 1rem;
          transition: var(--transition);
          outline: none;
        }

        .form-select {
          appearance: none;
          cursor: pointer;
        }

        .phone-container {
          display: flex;
        }

        .phone-code-badge {
          position: absolute;
          left: 1rem;
          z-index: 2;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.95rem;
          background: var(--bg-secondary);
          padding: 0 0.5rem;
          border-radius: 4px;
        }

        .phone-input {
          padding-left: 4.5rem;
        }

        .uppercase-input {
          text-transform: uppercase;
        }

        .form-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
          background: var(--bg-secondary);
        }

        .form-input:focus + .input-icon,
        .input-container:focus-within .input-icon {
          color: var(--accent-primary);
        }

        .form-input.input-error {
          border-color: #ef4444;
        }

        .form-input.input-error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .password-toggle:hover {
          color: var(--text-primary);
        }

        .error-text {
          color: #ef4444;
          font-size: 0.8rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .error-alert {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.875rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .submit-btn {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 1rem;
          background: var(--accent-gradient);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: var(--shadow-md);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }



        .card-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.95rem;
          color: var(--text-secondary);
        }

        .signin-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition);
        }

        .signin-link:hover {
          color: var(--accent-secondary);
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .register-card {
            padding: 2rem 1.5rem;
            border-radius: var(--radius-lg);
          }
          
          .card-title {
            font-size: 1.5rem;
          }
          
          .bg-shape {
            display: none;
          }
        }
      `}} />
    </div>
  );
}
