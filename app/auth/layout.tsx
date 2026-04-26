import { ReactNode } from "react";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center px-4 py-8">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-lg animate-auth-fade-in">
        {children}
      </div>
    </div>
  );
}

