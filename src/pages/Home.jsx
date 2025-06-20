import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

// Helper components (unchanged):
function TrustBadge({ icon, label }) {
  return (
    <span className="flex items-center gap-2 px-4 py-2 bg-[#181A32]/80 text-yellow-200 rounded-full font-semibold shadow border border-yellow-400/20 text-sm backdrop-blur">
      <span className="text-lg">{icon}</span>{label}
    </span>
  );
}
function StepCard({ step, title, desc }) {
  return (
    <div className="flex-1 min-w-[160px] bg-gradient-to-br from-[#181e36]/70 to-[#23272F]/60 rounded-xl p-5 shadow border border-yellow-300/10 flex flex-col items-center mb-3 sm:mb-0">
      <div className="text-2xl font-extrabold bg-yellow-400 text-[#23272F] rounded-full h-11 w-11 flex items-center justify-center mb-2 shadow-md">
        {step}
      </div>
      <div className="font-bold text-yellow-200 text-base mb-1">{title}</div>
      <div className="text-gray-300 text-xs sm:text-sm">{desc}</div>
    </div>
  );
}
function Testimonial({ text, name, role, avatar }) {
  return (
    <div className="bg-[#23272F]/90 rounded-xl p-5 flex-1 shadow border border-yellow-300/5 flex flex-col items-center mb-3 md:mb-0">
      <div className="italic text-gray-200 mb-4">"{text}"</div>
      <div className="flex items-center gap-3 mt-auto">
        <img src={avatar} alt={name}
          className="h-14 w-14 rounded-full border-2 border-yellow-300/60 object-cover" />
        <div className="text-left">
          <div className="font-bold text-yellow-100 text-sm">{name}</div>
          <div className="text-yellow-300 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}
function FooterLink({ to, label }) {
  return <Link to={to} className="text-sm text-yellow-100 hover:text-yellow-300 transition">{label}</Link>;
}
function NoFreezeIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <g>
        <circle cx="12" cy="12" r="10" fill="#e3e3e3" fillOpacity="0.12" />
        <path d="M12 7v2m0 0a2 2 0 0 0-2 2v2.5a2 2 0 0 0 4 0V11a2 2 0 0 0-2-2zm0 0v2"
          stroke="#ffe066" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 4.5l5 15M4.5 9.5l15 5M4.5 14.5l15-5M9.5 19.5l5-15"
          stroke="#ffe066" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
function MailIcon({ className = "h-5 w-5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75zm2.46-.75
        7.29 5.95c.3.25.74.25 1.04 0l7.29-5-95H4.71zm15.54 1.61-7.05 5.75a2.25
        2.25 0 0 1-2.8 0L3.75 7.61v9.64c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V7.61z"/>
    </svg>
  );
}

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("premium-bg");
    return () => document.body.classList.remove("premium-bg");
  }, []);

  function handleStartTrade(e) {
    e.preventDefault();
    navigate(user ? "/trade" : "/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="pt-20 relative min-h-screen w-full flex flex-col items-center overflow-x-hidden font-['Poppins',_Inter,_sans-serif]">
      {/* Background */}
      <div className="fixed -z-10 inset-0 bg-gradient-to-br from-[#10131A] via-[#141823] to-[#191B23]" />

      <main className="relative z-10 w-full px-4 py-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full max-w-2xl bg-[#161A23]/80 rounded-2xl p-6 sm:p-10 shadow-2xl border border-yellow-400/30 text-center flex flex-col items-center mb-12 glassmorphic">
          <img src="/usdt.png" alt="Tether USDT"
            className="h-20 w-20 rounded-full shadow-lg mb-4 border-4 border-yellow-300/70 bg-white object-cover animate-float"
            style={{ aspectRatio: "1/1" }} />
          <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl mb-3 tracking-tight text-gray-50 animate-textmove"
            style={{ fontFamily: "'Poppins', Inter, sans-serif" }}>
            Convert USDT to INR at <span className="text-yellow-200">Premium Rate ₹93</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-7 font-medium tracking-wide">
            India’s most trusted, lightning-fast USDT-to-INR platform.<br />
            Get <span className="text-yellow-300 font-bold">elite rates</span>, instant payouts, and premium support.
          </p>

          {/* START TRADING Button with new border‐glow animation */}
          <div className="relative inline-block mt-2 mb-4">
            <button
              onClick={handleStartTrade}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] rounded-xl font-extrabold shadow-lg text-lg tracking-wide focus:outline-none transform transition-all duration-200 hover:scale-105 btn-glow"
            >
              Start Trading
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <TrustBadge icon="🔒" label="100% Secure" />
            <TrustBadge icon="⚡" label="Instant Payouts" />
            <TrustBadge icon="💎" label="Premium Support" />
            <TrustBadge icon="🏦" label="Bank Grade Security" />
            <TrustBadge icon={<NoFreezeIcon />} label="No Freeze Issues" />
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full max-w-3xl bg-[#161A23]/80 rounded-2xl p-6 sm:p-8 shadow-xl border border-yellow-400/15 mb-12 backdrop-blur text-center glassmorphic">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-200 mb-6 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-6">
            Simple 3-step process to convert USDT to INR
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-stretch">
            <StepCard step="1" title="Register & Verify" desc="Create account and verify email" />
            <StepCard step="2" title="Deposit USDT" desc="Send USDT via TRC20 or BEP20" />
            <StepCard step="3" title="Receive INR" desc="Get INR in your bank after approval" />
          </div>
        </section>

        {/* Famous Quotes On Crypto */}
        <section className="w-full max-w-3xl bg-white/5 rounded-2xl p-6 sm:p-8 shadow-xl border border-yellow-400/10 mb-12 backdrop-blur text-center glassmorphic">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-yellow-200 mb-8 tracking-tight">
            Famous Quotes On Crypto
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
            <Testimonial
              text="If we don’t move forward with this, other countries like China will win the race in financial innovation!"
              name="Mark Zuckerberg"
              role="Meta CEO"
              avatar="/markzucker.png"
            />
            <Testimonial
              text="Supports the potential of digital assets to shift power from the government to the people!"
              name="Elon Musk"
              role="Tesla & SpaceX"
              avatar="/elon.png"
            />
            <Testimonial
              text="Web3 should reduce blind trust by providing verifiable, decentralized systems!"
              name="Gavin Wood"
              role="Inventor of Solidity"
              avatar="/gavinwood.png"
            />
          </div>
        </section>

        {/* New CTA Section */}
        <section className="w-full max-w-3xl bg-[#161A23]/80 rounded-2xl p-8 sm:p-10 shadow-2xl border border-yellow-400/20 text-center glassmorphic mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-200 mb-4 tracking-tight">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-yellow-100 mb-6 leading-relaxed">
            Join <span className="text-yellow-300 font-bold">Tether2INR</span> today and experience the best USDT to INR exchange rates with secure and fast transactions.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleStartTrade}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181B23] font-extrabold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 btn-glow"
            >
              Start Trading
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-4xl mx-auto mb-4 px-2">
          <div className="rounded-2xl bg-[#161A23]/80 border border-yellow-300/15 shadow-xl px-4 py-8 flex flex-col md:flex-row gap-8 md:gap-0 items-center justify-between glassmorphic">
            <div className="flex flex-col items-center md:items-start gap-1">
              <img src="/usdt2.png" alt="Tether2INR Logo"
                className="h-10 w-10 rounded-lg mb-2 object-cover" style={{ aspectRatio: "1/1" }} />
              <div className="text-2xl font-extrabold text-yellow-300 tracking-wide mb-1">T2I</div>
              <div className="text-lg font-bold text-yellow-100">Tether2INR</div>
              <div className="text-gray-300 text-sm max-w-xs font-medium">
                Premium USDT selling with secure transactions & competitive rates.
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="font-bold text-yellow-200 mb-1">Quick Links</div>
              <FooterLink to="/" label="Home" />
              <FooterLink to="/trade" label="Trade" />
              <FooterLink to="/login" label="Login" />
              <a href="mailto:venombar122@gmail.com"
                className="text-sm text-yellow-100 hover:text-yellow-300 transition flex items-center mt-1">
                <MailIcon className="inline h-5 w-5 mr-1" />
                Email Support
              </a>
            </div>
          </div>
        </footer>
      </main>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap');
        .premium-bg { font-family: 'Poppins', Inter, sans-serif; }
        .glassmorphic { backdrop-filter: blur(16px) saturate(180%); }
        .animate-float { animation: float 3s ease-in-out infinite alternate; }
        @keyframes float { from { transform: translateY(0); } to { transform: translateY(-10px); } }
        .animate-textmove { display: inline-block; animation: textmove 3s ease-in-out infinite alternate; }
        @keyframes textmove { from { transform: translateY(0);} to { transform: translateY(-6px);} }
        .btn-glow {
          animation: glow 2s infinite alternate;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 8px 2px rgba(255,224,102,0.6); }
          100% { box-shadow: 0 0 16px 4px rgba(255,224,102,0.3); }
        }
      `}</style>
    </div>
  );
}
