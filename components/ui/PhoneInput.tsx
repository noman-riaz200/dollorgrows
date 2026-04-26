"use client";

import { useState, useRef, useEffect } from "react";
import { countries, Country } from "@/lib/countries";
import { ChevronDown, Search, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  phoneCode: string;
  phoneNumber: string;
  onPhoneCodeChange: (country: Country) => void;
  onPhoneNumberChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function PhoneInput({
  phoneCode,
  phoneNumber,
  onPhoneCodeChange,
  onPhoneNumberChange,
  error,
  disabled = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find((c) => c.dialCode === phoneCode);

  const filtered = search.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search)
      )
    : countries;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onPhoneCodeChange(country);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Country Code Dropdown */}
        <div ref={containerRef} className="relative shrink-0">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-3 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white min-w-[110px]",
              "focus:outline-none focus:border-[#00d2ff]/50 transition-colors",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isOpen && "border-[#00d2ff]/50",
              error && "border-red-500/50"
            )}
          >
            <span className="text-lg">{selectedCountry?.flag || "🌍"}</span>
            <span className="text-sm font-medium">{selectedCountry?.dialCode || phoneCode}</span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-gray-500 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-72 mt-2 glass-strong max-h-72 overflow-y-auto scrollbar-thin rounded-lg glow-cyan-sm left-0">
              <div className="p-2 sticky top-0 bg-[#0f0f1a]/95 backdrop-blur-xl border-b border-white/[0.06] z-10">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search country or code..."
                    className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="p-1">
                {filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left text-sm transition-colors",
                      "hover:bg-[#00d2ff]/10",
                      country.dialCode === phoneCode && "bg-[#00d2ff]/20 text-[#00d2ff]"
                    )}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 truncate">{country.name}</span>
                    <span className="text-gray-500 text-xs font-mono">{country.dialCode}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-3 py-4 text-center text-gray-500 text-sm">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <div className="flex items-center px-3 bg-white/[0.03] border border-white/[0.08] rounded-lg focus-within:border-[#00d2ff]/50 transition-colors h-full">
            <Phone className="w-5 h-5 text-gray-500 mr-2 shrink-0" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => onPhoneNumberChange(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone number"
              disabled={disabled}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none py-3 text-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

