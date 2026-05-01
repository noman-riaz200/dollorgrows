"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Camera,
  Save,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { CountrySelect } from "@/components/ui/CountrySelect";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Country } from "@/lib/countries";

type Tab = "profile" | "email" | "pin";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  phoneCode: string | null;
  avatar: string | null;
  hasPin: boolean;
}

/* ─── Pin Dots Display ─── */
function PinDots({ pin, length = 6 }: { pin: string; length?: number }) {
  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
            i < pin.length
              ? "border-[#00d2ff] bg-[#00d2ff]/10 shadow-[0_0_12px_rgba(0,210,255,0.2)]"
              : "border-white/10 bg-white/[0.02]"
          }`}
        >
          {i < pin.length && (
            <div className="w-3 h-3 rounded-full bg-[#00d2ff]" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Numeric Keypad ─── */
function NumericKeypad({
  onDigit,
  onBackspace,
  onClear,
}: {
  onDigit: (d: string) => void;
  onBackspace: () => void;
  onClear: () => void;
}) {
  const digits = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["backspace", "0", "clear"],
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {digits.flat().map((key) => {
        if (key === "backspace") {
          return (
              <button
              key={key}
              onClick={onBackspace}
              className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-white/[0.08] hover:border-[#00d2ff]/30 hover:text-[#00d2ff] transition-all flex items-center justify-center active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          );
        }
        if (key === "clear") {
          return (
            <button
              key={key}
              onClick={onClear}
              className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all flex items-center justify-center active:scale-95 text-sm font-medium"
            >
              C
            </button>
          );
        }
        return (
          <button
            key={key}
            onClick={() => onDigit(key)}
            className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xl font-medium hover:bg-white/[0.08] hover:border-[#00d2ff]/30 hover:text-[#00d2ff] transition-all active:scale-95"
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─── */
export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  /* Profile state */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [country, setCountry] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Email state */
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  /* PIN state */
  const [pinStep, setPinStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");

  /* Fetch user data */
  const fetchUserData = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        setCountry(data.user.country || "");
        setPhoneCode(data.user.phoneCode || "+1");
        setAvatarPreview(data.user.avatar);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to load settings");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  /* ─── Avatar Handling ─── */
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setAvatarFile(result);
    };
    reader.readAsDataURL(file);
  };

  /* ─── Profile Submit ─── */
  const handleProfileSubmit = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone || undefined,
          country: country || undefined,
          avatar: avatarFile || avatarPreview || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        setAvatarFile(null);
        await update();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Email Submit ─── */
  const handleEmailSubmit = async () => {
    if (!newEmail.trim() || !currentPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          currentPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Email updated successfully. Please sign in again.");
        setNewEmail("");
        setCurrentPassword("");
        await update();
      } else {
        toast.error(data.error || "Failed to update email");
      }
    } catch {
      toast.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  /* ─── PIN Handling ─── */
  const handlePinDigit = (digit: string) => {
    setPinError("");
    if (pinStep === 1) {
      if (pin.length < 6) setPin((p) => p + digit);
    } else {
      if (confirmPin.length < 6) setConfirmPin((p) => p + digit);
    }
  };

  const handlePinBackspace = () => {
    setPinError("");
    if (pinStep === 1) {
      setPin((p) => p.slice(0, -1));
    } else {
      setConfirmPin((p) => p.slice(0, -1));
    }
  };

  const handlePinClear = () => {
    setPinError("");
    if (pinStep === 1) {
      setPin("");
    } else {
      setConfirmPin("");
    }
  };

  const handlePinNext = () => {
    if (pin.length !== 6) {
      toast.error("Please enter a 6-digit PIN");
      return;
    }
    setPinStep(2);
    setConfirmPin("");
  };

  const handlePinBack = () => {
    setPinStep(1);
    setConfirmPin("");
    setPinError("");
  };

  const handlePinSubmit = async () => {
    if (confirmPin.length !== 6) {
      toast.error("Please confirm your PIN");
      return;
    }
    if (pin !== confirmPin) {
      setPinError("PINs do not match");
      toast.error("PINs do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/settings/pin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin, confirmPin }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Security PIN updated successfully");
        setPin("");
        setConfirmPin("");
        setPinStep(1);
        setPinError("");
      } else {
        toast.error(data.error || "Failed to update PIN");
      }
    } catch {
      toast.error("Failed to update PIN");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Tabs Config ─── */
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Update Profile", icon: User },
    { key: "email", label: "Change Email", icon: Mail },
    { key: "pin", label: "Security PIN", icon: Shield },
  ];

return (
  <div className="settings-page">
    {/* Header */}
    <div className="page-header">
      <h1>Settings</h1>
      <p>Manage your account and preferences.</p>
    </div>

    {/* Tabs */}
    <div className="settings-tabs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`settings-tab ${isActive ? "active" : ""}`}
          >
            <tab.icon className="tab-icon" />
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </div>

    {/* ─── Tab: Update Profile ─── */}
    {activeTab === "profile" && (
      <GlassCard neonBorder="blue" glow="blue">
        <h2 className="section-title">
          <User className="section-icon" />
          Update Profile
        </h2>

          <div className="settings-form">
            {/* Avatar */}
            <div className="avatar-section">
              <div
                onClick={handleAvatarClick}
                className="avatar-container"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <span className="avatar-initial">
                      {name?.[0]?.toUpperCase() ||
                        session?.user?.name?.[0]?.toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="avatar-overlay">
                  <Camera className="avatar-camera-icon" />
                  <span className="avatar-overlay-text">Change</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="avatar-hint">Click to upload avatar (max 2MB)</p>
            </div>

            {/* Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="form-input"
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <PhoneInput
                phoneCode={phoneCode}
                phoneNumber={phone}
                onPhoneCodeChange={(c: Country) => setPhoneCode(c.dialCode)}
                onPhoneNumberChange={setPhone}
              />
            </div>

            {/* Country */}
            <div className="form-group">
              <label className="form-label">Country</label>
              <CountrySelect
                value={country}
                onChange={(c: Country) => setCountry(c.code)}
              />
            </div>

            {/* Submit */}
            <NeonButton
              variant="gradient"
              fullWidth
              onClick={handleProfileSubmit}
              disabled={loading}
              className="settings-submit-button"
            >
              {loading ? (
                <RefreshCw className="button-icon-spin" />
              ) : (
                <Save className="button-icon" />
              )}
              {loading ? "Saving..." : "Save Profile"}
            </NeonButton>
          </div>
        </GlassCard>
      )}

      {/* ─── Tab: Change Email ─── */}
      {activeTab === "email" && (
        <GlassCard neonBorder="blue">
          <h2 className="section-title">
            <Mail className="section-icon" />
            Change Email
          </h2>

          <div className="settings-form">
            {/* Current Email */}
            <div className="form-group">
              <label className="form-label">Current Email</label>
              <div className="form-static">
                {userData?.email || session?.user?.email || "—"}
              </div>
            </div>

            {/* New Email */}
            <div className="form-group">
              <label className="form-label">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                className="form-input"
              />
            </div>

            {/* Current Password */}
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="form-input"
              />
              <p className="form-hint">
                For security, please confirm your current password.
              </p>
            </div>

            {/* Submit */}
            <NeonButton
              variant="gradient"
              fullWidth
              onClick={handleEmailSubmit}
              disabled={loading || !newEmail || !currentPassword}
              className="settings-submit-button"
            >
              {loading ? (
                <RefreshCw className="button-icon-spin" />
              ) : (
                <Save className="button-icon" />
              )}
              {loading ? "Updating..." : "Update Email"}
            </NeonButton>
          </div>
        </GlassCard>
      )}

      {/* ─── Tab: Security PIN ─── */}
      {activeTab === "pin" && (
        <GlassCard neonBorder="mint" glow="mint">
          <h2 className="section-title">
            <Shield className="section-icon" />
            Security PIN
          </h2>
          <p className="section-subtitle">
            {userData?.hasPin
              ? "Update your 6-digit security PIN."
              : "Set up a 6-digit security PIN to protect your account."}
          </p>

          <div className="pin-section">
            {/* Step indicator */}
            <div className="pin-steps">
              <div className={`pin-step ${pinStep === 1 ? "active" : ""}`}>
                <span className="pin-step-number">1</span>
                <span className="pin-step-label">Enter PIN</span>
              </div>
              <div className="pin-step-divider"></div>
              <div className={`pin-step ${pinStep === 2 ? "active" : ""}`}>
                <span className="pin-step-number">2</span>
                <span className="pin-step-label">Confirm PIN</span>
              </div>
            </div>

            {/* PIN Display */}
            <div className="pin-display">
              <PinDots pin={pinStep === 1 ? pin : confirmPin} />
            </div>

            {/* Error */}
            {pinError && (
              <p className="pin-error">{pinError}</p>
            )}

            {/* Keypad */}
            <NumericKeypad
              onDigit={handlePinDigit}
              onBackspace={handlePinBackspace}
              onClear={handlePinClear}
            />

            {/* Navigation */}
            <div className="pin-navigation">
              {pinStep === 2 && (
                <NeonButton
                  variant="cyan"
                  onClick={handlePinBack}
                  className="pin-back-button"
                >
                  <ArrowLeft className="button-icon" />
                  Back
                </NeonButton>
              )}
              {pinStep === 1 ? (
                <NeonButton
                  variant="gradient"
                  fullWidth
                  onClick={handlePinNext}
                  disabled={pin.length !== 6}
                  className="pin-next-button"
                >
                  Next
                  <ArrowLeft className="button-icon rotate-180" />
                </NeonButton>
              ) : (
                <NeonButton
                  variant="gradient"
                  onClick={handlePinSubmit}
                  disabled={loading || confirmPin.length !== 6}
                  className="pin-submit-button"
                >
                  {loading ? (
                    <RefreshCw className="button-icon-spin" />
                  ) : (
                    <Check className="button-icon" />
                  )}
                  {loading ? "Saving..." : "Save PIN"}
                </NeonButton>
              )}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

