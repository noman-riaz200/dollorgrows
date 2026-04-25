export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <div className="w-8 h-8 bg-white/20 rounded-lg" />
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>

        <p className="text-gray-400">Loading Fund Grow...</p>
      </div>
    </div>
  );
}
