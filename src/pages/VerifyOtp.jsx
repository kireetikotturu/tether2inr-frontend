



import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Optionally, implement resend OTP:
  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await apiFetch("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      alert("OTP resent!");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold mb-6">Verify Your Email</h2>
      <p className="mb-4">Enter the OTP sent to <span className="font-mono">{email}</span></p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="otp" required maxLength={6} placeholder="Enter OTP" className="w-full px-4 py-2 rounded bg-brand-dark text-brand-gold" value={otp} onChange={e => setOtp(e.target.value)} />
        {error && <div className="text-red-500">{error}</div>}
        <button type="submit" className="w-full py-2 rounded bg-brand-gold text-brand-dark font-bold hover:bg-yellow-400 transition-colors" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        Didn't get the code? <button className="underline" /* onClick={...} */>Resend OTP</button>
      </div>
    </div>
  );
}