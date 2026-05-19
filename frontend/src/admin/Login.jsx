import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "https://ridduu-com.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      window.location = "/admin/dashboard";
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20">
        
        {/* Logo / Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Ridduu<span className="text-indigo-500">.com</span>
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Welcome back! Please login to your account
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-black/30 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © {new Date().getFullYear()} Ridduu.com
        </p>
      </div>
    </div>
  );
}