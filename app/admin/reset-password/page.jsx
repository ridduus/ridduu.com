"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { KeyRound, Lock, Loader2, CheckCircle2, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/reset-password", {
        token,
        newPassword: password,
      });

      if (res.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        setError(res.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred. Token may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-medium">
          Missing password reset token. Please request a new link.
        </div>
        <Link
          href="/admin/forgot-password"
          className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 transition-all rounded-xl text-white font-semibold text-sm"
        >
          Request Reset Link
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-lg shadow-indigo-500/30 mb-4">
          <KeyRound size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white">
          Reset Your Password
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Enter your new password below to secure your admin account.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center font-medium">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-3">
            <CheckCircle2 size={44} className="text-emerald-400 animate-bounce" />
            <p className="text-sm font-medium">
              Your password has been reset successfully!
            </p>
          </div>

          <Link
            href="/admin"
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm"
          >
            Go to Login
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                placeholder="Re-enter new password"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Updating Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Footer info */}
      <div className="mt-8 pt-6 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
          <ShieldCheck size={14} className="text-emerald-400" />
          Password Encrypted with bcrypt Hash Security
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-500/20 z-10">
        <Suspense fallback={<div className="text-center text-slate-400 py-8">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
