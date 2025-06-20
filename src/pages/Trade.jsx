// src/pages/Trade.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

// Quotes for animation
const QUOTES = [
  { main: "Your Crypto. Your Control. Our Trust.", sub: "Empowering you with full transparency, security, and real-time USDT conversion—no surprises, just results." },
  { main: "Converting Confidence — One USDT at a Time.", sub: "Seamless transactions, premium rates, and support you can count on. Crypto made trustworthy." },
  { main: "Where Your Crypto Journey Feels Safe and Rewarding.", sub: "Built for stability, designed for you. Trade with the confidence of a billion-dollar platform." },
  { main: "Not Just Fast. Verified. Secure. Human.", sub: "Every deposit, withdrawal, and referral is protected by human-verified approval and smart security." },
  { main: "Your Trusted Bridge Between Crypto & INR.", sub: "From blockchain to bank—effortless, efficient, and always in your hands." },
];

// Top coins with CoinGecko IDs for logo and price
const COINGECKO_PAIRS = [
  { id: "bitcoin", symbol: "BTC/USDT", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH/USDT", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB/USDT", name: "BNB" },
  { id: "solana", symbol: "SOL/USDT", name: "Solana" },
  { id: "ripple", symbol: "XRP/USDT", name: "XRP" },
  { id: "dogecoin", symbol: "DOGE/USDT", name: "Dogecoin" },
  { id: "cardano", symbol: "ADA/USDT", name: "Cardano" },
  { id: "avalanche-2", symbol: "AVAX/USDT", name: "Avalanche" },
  { id: "tron", symbol: "TRX/USDT", name: "TRON" },
  { id: "matic-network", symbol: "MATIC/USDT", name: "Polygon" },
];

export default function Trade() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pairs, setPairs] = useState(COINGECKO_PAIRS.map(c => ({ ...c, price: "...", logo: "" })));
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quoteTimeout = useRef();
  const [error, setError] = useState(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Rotate quotes every 4.5s
  useEffect(() => {
    quoteTimeout.current = setTimeout(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 4500);
    return () => clearTimeout(quoteTimeout.current);
  }, [quoteIdx]);

  // Fetch prices & logos periodically
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setError(null);
        const ids = COINGECKO_PAIRS.map(c => c.id).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
        );
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        setPairs(
          COINGECKO_PAIRS.map(p => {
            const d = data.find(x => x.id === p.id);
            return {
              ...p,
              price: d
                ? Number(d.current_price).toLocaleString("en-US", { maximumFractionDigits: 8 })
                : "—",
              logo: d?.image || "",
            };
          })
        );
      } catch (e) {
        console.error(e);
        if (mounted) setError("Could not fetch live prices. Please try again later.");
      }
    };
    fetchData();
    const iv = setInterval(fetchData, 10000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  // TOP BUTTON now goes to Dashboard
  const handleDepositClick = e => {
    e.preventDefault();
    navigate(user ? "/dashboard" : "/login");
  };

  // BOTTOM SELL BUTTON now goes to Deposit section
  const handleSellClick = e => {
    e.preventDefault();
    navigate(user ? "/deposit" : "/login");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center bg-gradient-to-br from-[#191B23] via-[#141823] to-[#10131A] font-['Poppins',_Inter,_sans-serif]"
      style={{ paddingTop: "78px" }}
    >
      {/* Animated Background Glow */}
      <div className="fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[100vw] h-[120vh]">
          <div className="absolute left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-br from-yellow-400/10 via-yellow-200/10 to-transparent rounded-full blur-[160px] animate-bgmove"></div>
        </div>
      </div>

      <main className="relative z-10 w-full px-4 sm:px-0 py-6 md:py-12 flex flex-col items-center">
        {/* Quotes */}
        <section className="w-full max-w-3xl mb-8 select-none">
          <div className="flex flex-col items-center">
            <div
              key={quoteIdx}
              className="w-full px-4 py-6 bg-[#181A32]/95 rounded-2xl shadow-2xl border border-yellow-400/20 glassmorphic quote-fade-in"
              style={{ minHeight: 130 }}
            >
              <div className="text-2xl font-bold text-yellow-100 text-center mb-1 tracking-tight">
                “{QUOTES[quoteIdx].main}”
              </div>
              <div className="text-lg text-yellow-200/90 text-center">
                &rarr; {QUOTES[quoteIdx].sub}
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-3">
              {QUOTES.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-150 border border-yellow-300/50 ${
                    i === quoteIdx ? "bg-yellow-300 shadow-lg" : "bg-yellow-100/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Premium Rate Widget */}
        <section className="w-full max-w-md bg-[#181A32]/95 rounded-2xl p-6 shadow-2xl border border-yellow-400/20 glassmorphic mb-10">
          <h3 className="text-xl font-bold text-yellow-200 mb-1">USDT to INR Exchange</h3>
          <p className="text-lg text-yellow-100 mb-4">Premium Rate</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-yellow-200">Our Rate</p>
              <p className="text-2xl font-bold text-yellow-100">₹93.00</p>
            </div>
            <div>
              <p className="text-sm text-yellow-200">Market Rate</p>
              <p className="text-2xl font-bold text-yellow-100">₹88.50</p>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm text-yellow-200">Your Advantage</p>
            <p className="text-2xl font-bold text-green-400">+4.96%</p>
          </div>

          {/* ← Top button now navigates to DASHBOARD → */}
          <button
            onClick={handleDepositClick}
            className="w-full py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181B23] font-extrabold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Sell USDT at ₹93  &rarr;
          </button>
        </section>

        {/* Crypto Pair Cards */}
        <section className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {error && <div className="col-span-full text-red-300 text-center">{error}</div>}
          {pairs.map(pair => (
            <div
              key={pair.symbol}
              className="bg-[#181A32]/95 rounded-2xl p-4 flex flex-col items-center text-center border border-yellow-400/20 hover:shadow-2xl transition-shadow"
            >
              {pair.logo ? (
                <img
                  src={pair.logo}
                  alt={pair.name}
                  className="h-12 w-12 rounded-full mb-3 border border-yellow-200/30 object-contain shadow"
                  loading="lazy"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-yellow-200/40 mb-3" />
              )}
              <div className="text-lg font-bold text-yellow-100 mb-1">{pair.symbol}</div>
              <div className="text-sm text-yellow-200/80 mb-2">{pair.name}</div>
              <div className="mt-auto text-xl font-semibold text-yellow-200">{pair.price}</div>
            </div>
          ))}
        </section>

        {/* ← Bottom Sell button now navigates to DEPOSIT section → */}
        <div className="mb-16">
          <button
            onClick={handleSellClick}
            className="relative inline-flex items-center px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181B23] rounded-xl font-extrabold shadow-xl text-lg tracking-wide ring-2 ring-yellow-300/40 focus:outline-none focus:ring-4 hover:scale-105 transition-transform sell-btn-glow overflow-hidden"
          >
            <span className="flex items-center gap-2 relative z-10">
              <span className="animate-bounce text-xl">⭐</span>
              Sell at ₹93
              <span className="animate-bounce text-xl delay-150">⭐</span>
            </span>
            <AnimatedBorder />
          </button>
        </div>
      </main>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
        .glassmorphic { backdrop-filter: blur(16px) saturate(180%); }
        .animate-bgmove { animation: bgmove 18s linear infinite alternate; }
        @keyframes bgmove {
          0% { transform: translate(-50%,0) scale(1); }
          100% { transform: translate(-50%,10%) scale(1.08); }
        }
        .quote-fade-in { animation: quoteFade 0.9s ease 0.1s both; }
        @keyframes quoteFade {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        .sell-btn-glow {
          box-shadow: 0 0 0 0 #ffe06688;
          animation: sellglow 2s infinite alternate;
        }
        @keyframes sellglow {
          from { box-shadow: 0 0 0 0 #ffe06688,0 0 16px 2px #ffe06633; }
          to { box-shadow: 0 0 0 6px #ffe06633,0 0 32px 8px #ffe06644; }
        }
        .delay-150 { animation-delay: 150ms; }
        .spin-border {
          position: absolute; inset: -3px; z-index: 1; pointer-events: none;
        }
        .spin-border svg {
          width: 100%; height: 100%; animation: spin 2.5s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Animated spinning border for Sell button
function AnimatedBorder() {
  return (
    <span className="spin-border">
      <svg width="130" height="54" viewBox="0 0 130 54">
        <circle cx="65" cy="27" r="25" fill="none" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (Math.PI * 2 * i) / 8;
          const x = 65 + Math.cos(angle) * 25;
          const y = 27 + Math.sin(angle) * 25;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              fill="#ffe066"
              stroke="#fffbe2"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </span>
  );
}
