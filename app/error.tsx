"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-semibold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
