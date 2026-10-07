"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  KeyRound,
  Lock,
  Loader2,
  ArrowLeft,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordOtpPage() {
  const router = useRouter();

  // Step 1: Send OTP, Step 2: Verify & Reset, Step 3: Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Step 1: Send 6-digit OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/forgot-password", { email });

      if (res.data.success) {
        toast.success("6-Digit OTP code sent to your email!");
        setStep(2);
        setResendTimer(60); // 60s cooldown
      } else {
        setError(res.data.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "An error occurred. Please check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      setResending(true);
      setError("");
      const res = await axios.post("/api/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success("New OTP code sent to your email!");
        setResendTimer(60);
      } else {
        setError(res.data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/reset-password", {
        email,
        otp: otp.trim(),
        newPassword,
      });

      if (res.data.success) {
        toast.success("Password reset successfully!");
        setStep(3);
      } else {
        setError(res.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid OTP code or password reset failed."
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
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className={`h-2.5 rounded-full transition-all duration-300 ${step === 1 ? "w-8 bg-indigo-500" : "w-2.5 bg-slate-700"}`} />
          <span className={`h-2.5 rounded-full transition-all duration-300 ${step === 2 ? "w-8 bg-indigo-500" : "w-2.5 bg-slate-700"}`} />
          <span className={`h-2.5 rounded-full transition-all duration-300 ${step === 3 ? "w-8 bg-emerald-500" : "w-2.5 bg-slate-700"}`} />
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {/* STEP 1: Enter Email & Send OTP */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-lg shadow-indigo-500/30 mb-4">
                <Mail size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Forgot Password?
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter your registered admin email address to receive a 6-digit verification OTP.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="admin@ridduu.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending OTP to Email...
                  </>
                ) : (
                  <>
                    Send Verification OTP
                    <Send size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Verify OTP & Change Password */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-lg shadow-indigo-500/30 mb-3">
                <KeyRound size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                Enter Verification OTP
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                We sent a 6-digit OTP code to <strong className="text-indigo-300">{email}</strong>
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Code Input */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  6-Digit Verification OTP
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-center tracking-[0.4em] font-mono text-lg font-bold transition-all"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              {/* New Password Input */}
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-950/60 text-slate-100 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none text-sm transition-all"
                    onChange={(e) => setNewPassword(e.target.value)}
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

              {/* Confirm New Password */}
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

              {/* Submit Reset Password */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Verifying OTP & Changing Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Resend OTP & Back Options */}
              <div className="flex items-center justify-between pt-3 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 font-medium"
                >
                  <ArrowLeft size={14} /> Change Email
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || resending}
                  onClick={handleResendOtp}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-semibold disabled:opacity-50"
                >
                  {resending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RotateCcw size={12} />
                  )}
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Success Screen */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-3">
              <CheckCircle2 size={56} className="text-emerald-400 animate-bounce" />
              <h3 className="text-xl font-bold text-white">Password Changed!</h3>
              <p className="text-xs text-emerald-300 leading-relaxed max-w-xs">
                Your admin password has been successfully updated. You can now login with your new password.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 transition-all rounded-xl text-white font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm"
            >
              Proceed to Login
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-emerald-400" />
            256-bit Encrypted OTP & Password Hash Protection
          </p>
        </div>
      </div>
    </div>
  );
}
