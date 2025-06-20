import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom"; // ⬅️ Add this import at the top


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.classList.add("premium-bg");
    return () => document.body.classList.remove("premium-bg");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10131A] via-[#141823] to-[#191B23] px-4">
      <div className="w-full max-w-md bg-[#161A23]/90 backdrop-blur-lg glassmorphic rounded-2xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-200 mb-6 text-center">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-[#141823] text-yellow-200 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-[#141823] text-yellow-200 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            value={form.password}
            onChange={handleChange}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-bold hover:scale-105 transition transform shadow-lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-yellow-200 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="underline hover:text-yellow-300">
  Register
</Link>
        </div>
      </div>
      <style>{`
        .glassmorphic {
          backdrop-filter: blur(16px) saturate(180%);
          background-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}
