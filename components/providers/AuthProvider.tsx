"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider 
      baseUrl={process.env.NEXTAUTH_URL || "http://localhost:3000"}
      refetchInterval={5 * 60 * 1000}
    >
      {children}
    </SessionProvider>
  );
}
