"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/login", { email, password });

      if (res.data.success && res.data.token) {
        localStorage.setItem("token", res.data.token);
        toast.success("Welcome back! Login successful.");
        window.location.href = "/admin/dashboard";
      } else {
        setError(res.data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please verify credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-500/20 z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-lg shadow-indigo-500/30 mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Ridduu<span className="text-indigo-400">.com</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Secure Admin Dashboard Authentication
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                required
                value={email}
                placeholder="admin@ridduu.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/admin/forgot-password"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                required
                value={password}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Authenticating...
              </>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            256-bit Encrypted Session • 5-Min Token Security
          </p>
        </div>
      </div>
    </div>
  );
}