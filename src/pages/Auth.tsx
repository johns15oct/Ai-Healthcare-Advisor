import { useState } from "react";
import { Heart, Eye, EyeOff, UserRound, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const { login, signup, loginAsGuest } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const err =
      mode === "login"
        ? await login(email, password)
        : await signup(name, email, password);
    setLoading(false);
    if (err) setError(err);
  };

  const handleGuest = async () => {
    setError(null);
    setLoading(true);
    const err = await loginAsGuest();
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-green-200 mb-4">
            <Heart size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Healthcare Advisor</h1>
          <p className="text-slate-600 text-sm mt-1">Your personal health companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-green-100/60 border border-slate-200 p-8">
          {/* Toggle */}
          <div className="flex bg-slate-200 rounded-xl p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">Full Name</label>
                <div className="relative">
                  <UserRound size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-900mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-green-200 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-500">
              <span className="bg-white text-slate-500 px-3">or</span>
            </div>
          </div>

          <button
            onClick={handleGuest}
            disabled={loading}
            className="w-full border border-slate-300 hover:border-emerald-500 hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            Continue as Guest
          </button>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6 px-4">
          This app provides general health information only and is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}
