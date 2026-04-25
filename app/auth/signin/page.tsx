import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";
import { Wallet, Loader2 } from "lucide-react";
import type { EthereumProvider } from "@/types/ethereum";

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
      const message = `Sign this message to authenticate with Fund Grow Online\nTimestamp: ${Date.now()}`;
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Neon accent effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Fund Grow Online
            </h1>
            <p className="text-gray-400 mt-2">Network Marketing & Investment Platform</p>
          </div>

          {/* Wallet Connection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wallet Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  readOnly
                />
                <button
                  onClick={connectWallet}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                </button>
              </div>
            </div>

            {walletAddress && (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing...
                  </>
                ) : (
                  "Sign In with Wallet"
                )}
              </button>
            )}

            <div className="text-center">
              <button
                onClick={connectWallet}
                className="text-cyan-400 hover:text-cyan-300 text-sm"
              >
                Don&apos;t have a wallet? Install MetaMask
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">15</div>
                <div className="text-xs text-gray-400">Investment Pools</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">3</div>
                <div className="text-xs text-gray-400">Referral Levels</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">BSC</div>
                <div className="text-xs text-gray-400">Blockchain</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">BEP20</div>
                <div className="text-xs text-gray-400">Token Compatible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
