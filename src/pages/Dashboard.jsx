import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../services/api";

// Animated quotes for engagement
const DASH_QUOTES = [
  { main: "Your Portfolio, Our Priority.", sub: "Stay informed with real-time updates." },
  { main: "Trade Confidently, Trade Securely.", sub: "Leverage premium rates & robust security." },
  { main: "Instant Insights, Instant Actions.", sub: "Monitor your USDT balance with clarity." },
];

function formatDate(dt) {
  return new Date(dt).toLocaleString("en-IN");
}

const tabList = [
  { name: "Deposit History", key: "deposit" },
  { name: "Withdrawal History", key: "withdrawal" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // <<< Scroll to top on Dashboard mount >>>
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState("deposit");
  const [withdrawals, setWithdrawals] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadFlag, setReloadFlag] = useState(0);

  // Quote animation index
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quoteTimeout = useRef();

  // Fetch histories
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const [wData, dData] = await Promise.all([
          apiFetch("/withdrawal/my"),
          apiFetch("/deposit/my")
        ]);
        setWithdrawals(Array.isArray(wData) ? wData : []);
        setDeposits(Array.isArray(dData) ? dData : []);
      } catch (err) {
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user, reloadFlag]);

  // Reload on navigation state
  useEffect(() => {
    if (location.state && location.state.reload) {
      setReloadFlag(n => n + 1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Animate quotes every 5s
  useEffect(() => {
    quoteTimeout.current = setTimeout(() => {
      setQuoteIdx(idx => (idx + 1) % DASH_QUOTES.length);
    }, 5000);
    return () => clearTimeout(quoteTimeout.current);
  }, [quoteIdx]);

  if (!user) {
    return (
      <div className="pt-20 p-8 text-center text-gray-300">
        Please login to view your dashboard.
      </div>
    );
  }

  // Summaries
  const summary = useMemo(() => {
    const totalDeposits = deposits.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
    const totalWithdrawals = withdrawals.reduce((sum, w) => sum + (Number(w.amount) || 0), 0);
    const pendingDeposits = deposits.filter(d => d.status === "pending").length;
    const pendingWithdrawals = withdrawals.filter(w => w.status === "pending").length;
    return { totalDeposits, totalWithdrawals, pendingDeposits, pendingWithdrawals };
  }, [deposits, withdrawals]);

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-gradient-to-br from-[#0f1116] via-[#141823] to-[#181A32] min-h-screen">
      {/* Animated Quote Banner */}
      <section className="mb-6">
        <div
          key={quoteIdx}
          className="relative overflow-hidden rounded-2xl p-4 text-center text-yellow-200 font-semibold glassmorphic border border-yellow-300/20 shadow-lg animate-quote-bg"
        >
          <div className="text-xl sm:text-2xl mb-1">
            “{DASH_QUOTES[quoteIdx].main}”
          </div>
          <div className="text-sm sm:text-base text-gray-300">
            → {DASH_QUOTES[quoteIdx].sub}
          </div>
        </div>
      </section>

      {/* Welcome & USDT Balance */}
      <div className="bg-[#1B1F2E]/80 backdrop-blur-lg glassmorphic rounded-2xl shadow-2xl p-6 mb-6 border border-yellow-300/20 flex flex-col md:flex-row md:justify-between md:items-center gap-4 animate-balance-pulse">
        <div>
          <h2 className="text-2xl font-extrabold text-yellow-200 mb-1">
            Welcome, <span className="break-all">{user.email}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-1 text-gray-200">
              <span className="font-semibold">Role:</span> {user.role}
            </div>
            <div className="flex items-center gap-1 text-gray-200">
              <span className="font-semibold">USDT Balance:</span>
              <span className="font-mono text-lg px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-300 text-[#181A32] rounded">
                {user.usdtBalance ?? 0}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-2 md:mt-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => navigate("/trade")}
          className="flex-1 md:flex-none text-center px-6 py-3 bg-gradient-to-r from-green-400 via-green-300 to-green-200 text-[#10131A] font-bold rounded-xl shadow-lg hover:scale-105 transition"
        >
          Trade Now
        </button>
        <button
          onClick={() => navigate("/deposit", { state: { reload: true } })}
          className="flex-1 md:flex-none text-center px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-bold rounded-xl shadow-lg hover:scale-105 transition"
        >
          Deposit
        </button>
        <button
          onClick={() => navigate("/withdraw", { state: { reload: true } })}
          className="flex-1 md:flex-none text-center px-6 py-3 bg-gradient-to-r from-red-400 via-red-300 to-red-200 text-[#181A32] font-bold rounded-xl shadow-lg hover:scale-105 transition"
        >
          Withdraw
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2230]/80 backdrop-blur-lg glassmorphic rounded-xl p-4 flex items-center gap-4 border border-yellow-300/15 shadow-lg">
          <svg className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="text-sm text-gray-300">Total Deposited</div>
            <div className="text-xl font-bold text-yellow-200">
              {summary.totalDeposits.toLocaleString("en-IN")}
            </div>
            {summary.pendingDeposits > 0 && (
              <div className="text-xs text-yellow-400">
                {summary.pendingDeposits} pending
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#1E2230]/80 backdrop-blur-lg glassmorphic rounded-xl p-4 flex items-center gap-4 border border-yellow-300/15 shadow-lg">
          <svg className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none">
            <path d="M12 20V4m0 0l5 5m-5-5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div className="text-sm text-gray-300">Total Withdrawn</div>
            <div className="text-xl font-bold text-yellow-200">
              {summary.totalWithdrawals.toLocaleString("en-IN")}
            </div>
            {summary.pendingWithdrawals > 0 && (
              <div className="text-xs text-yellow-400">
                {summary.pendingWithdrawals} pending
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex space-x-2 border-b border-yellow-300/40">
          {tabList.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-semibold transition ${
                activeTab === tab.key
                  ? "bg-yellow-200 text-[#181A32] rounded-t-lg"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-[#1B1F2E]/80 backdrop-blur-lg glassmorphic rounded-b-xl shadow-lg border border-yellow-300/20">
        {loading ? (
          <div className="p-6 text-center text-gray-300">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-400 whitespace-pre-wrap">{error}</div>
        ) : activeTab === "deposit" ? (
          <DepositTable deposits={deposits} />
        ) : (
          <WithdrawalTable withdrawals={withdrawals} />
        )}
      </div>

      {/* Custom animations/styles */}
      <style>{`
        .glassmorphic {
          backdrop-filter: blur(16px) saturate(180%);
          background-blend-mode: overlay;
        }
        @keyframes quoteGradient {
          0% { background: linear-gradient(90deg, rgba(30,34,48,0.8), rgba(24,26,50,0.8)); }
          50% { background: linear-gradient(90deg, rgba(24,26,50,0.8), rgba(30,34,48,0.8)); }
          100% { background: linear-gradient(90deg, rgba(30,34,48,0.8), rgba(24,26,50,0.8)); }
        }
        .animate-quote-bg {
          animation: quoteGradient 8s ease-in-out infinite;
        }
        @keyframes balancePulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 224, 102, 0.4); }
          50% { box-shadow: 0 0 10px 4px rgba(255, 224, 102, 0.4); }
          100% { box-shadow: 0 0 0 0 rgba(255, 224, 102, 0.4); }
        }
        .animate-balance-pulse {
          animation: balancePulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function DepositTable({ deposits }) {
  if (!deposits || deposits.length === 0) {
    return <div className="p-6 text-center text-gray-500">No deposit history yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[#2A2F3E]/80 text-yellow-200">
            <th className="py-3 px-4 sticky top-0">Amount</th>
            <th className="py-3 px-4 sticky top-0">Date</th>
            <th className="py-3 px-4 sticky top-0">Status</th>
            <th className="py-3 px-4 sticky top-0">Network</th>
            <th className="py-3 px-4 sticky top-0">TX Hash</th>
            <th className="py-3 px-4 sticky top-0">Details</th>
          </tr>
        </thead>
        <tbody>
          {deposits.map((d, idx) => (
            <tr
              key={d._id || idx}
              className="even:bg-[#1F2533] odd:bg-[#232A3B] hover:bg-yellow-50/20 transition"
            >
              <td className="py-2 px-4 font-mono text-gray-100">{d.amount}</td>
              <td className="py-2 px-4 text-gray-100">{formatDate(d.createdAt)}</td>
              <td className="py-2 px-4 capitalize text-gray-100">
                {d.status === "approved" ? (
                  <span className="text-green-400 font-semibold">Approved</span>
                ) : d.status === "pending" ? (
                  <span className="text-yellow-400 font-semibold">Pending</span>
                ) : (
                  <span className="text-red-400 font-semibold">Rejected</span>
                )}
              </td>
              <td className="py-2 px-4 text-gray-100">{d.network}</td>
              <td className="py-2 px-4 font-mono break-all text-gray-100">{d.txHash}</td>
              <td className="py-2 px-4 text-gray-400">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WithdrawalTable({ withdrawals }) {
  if (!withdrawals || withdrawals.length === 0) {
    return <div className="p-6 text-center text-gray-500">No withdrawal history yet.</div>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[#2A2F3E]/80 text-yellow-200">
            <th className="py-3 px-4 sticky top-0">Amount</th>
            <th className="py-3 px-4 sticky top-0">Date</th>
            <th className="py-3 px-4 sticky top-0">Status</th>
            <th className="py-3 px-4 sticky top-0">Bank Account</th>
            <th className="py-3 px-4 sticky top-0">Details</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w, idx) => (
            <tr
              key={w._id || idx}
              className="even:bg-[#1F2533] odd:bg-[#232A3B] hover:bg-yellow-50/20 transition"
            >
              <td className="py-2 px-4 font-mono text-gray-100">{w.amount}</td>
              <td className="py-2 px-4 text-gray-100">{formatDate(w.createdAt)}</td>
              <td className="py-2 px-4 capitalize text-gray-100">
                {w.status === "approved" ? (
                  <span className="text-green-400 font-semibold">Approved</span>
                ) : w.status === "pending" ? (
                  <span className="text-yellow-400 font-semibold">Pending</span>
                ) : (
                  <span className="text-red-400 font-semibold">Rejected</span>
                )}
              </td>
              <td className="py-2 px-4 text-gray-100">
                {w.bankDetails ? (
                  <div className="space-y-1">
                    <div><b>Acc:</b> {w.bankDetails.accountNumber}</div>
                    <div><b>Name:</b> {w.bankDetails.holderName}</div>
                    <div><b>IFSC:</b> {w.bankDetails.ifsc}</div>
                  </div>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>
              <td className="py-2 px-4 text-gray-400">-</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
