import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Support contact
const SUPPORT_EMAIL = "venombar122@gmail.com";
// Telegram support
const CHAT_URL = "https://t.me/smallshark111";

const ADMIN_EMAIL = "venombar122@gmail.com";

// Define your palette at the top of the file
const LOGO_PALETTE = {
  gradientStart: "#cf9819", 
  gradientEnd:   "#e0bd3f", 
  text:          "#000000",  // text color inside logo
  shadowColor:   "#000000",  // for inner shadow
  shadowOpacity: 0.2
};

function TetherLogo({ className = "h-8 w-8" }) {
  const { gradientStart, gradientEnd, text, shadowColor, shadowOpacity } = LOGO_PALETTE;

  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gold → Yellow gradient */}
        <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>

        {/* Subtle inner shadow */}
        <filter id="inner-shadow">
          <feOffset dx="0" dy="0" />
          <feGaussianBlur stdDeviation="2" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
          <feFlood floodColor={shadowColor} floodOpacity={shadowOpacity} result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComposite operator="over" in="shadow" in2="SourceGraphic" />
        </filter>
      </defs>

      {/* Rounded square background */}
      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="12"
        fill="url(#logo-grad)"
        filter="url(#inner-shadow)"
      />

      {/* Centered “T2I” in custom text color */}
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Roboto, sans-serif"
        fontSize="26"
        fontWeight="700"
        fill={text}
      >
        T2I
      </text>
    </svg>
  );
}

function DashboardIcon({ className = "h-6 w-6 text-yellow-200" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M3 3h18v18H3V3zm4 4v6h6V7H7zm8 0v4h4V7h-4zm-8 8v4h4v-4H7zm8 0v6h4v-6h-4z" />
    </svg>
  );
}

function LoginIcon({ className = "h-6 w-6 text-yellow-200" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M5 12h14m-7-7l7 7-7 7" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/trade", label: "Trade" },
    ...(user ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/deposit", label: "Deposit" },
      { to: "/withdraw", label: "Withdraw" }
    ] : []),
    { to: null, label: "Support", isSupport: true },
    ...(user?.role === "admin" && user?.email === ADMIN_EMAIL ? [
      { to: "/admin", label: "Admin" }
    ] : []),
    ...(!user ? [
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" }
    ] : [])
  ];

  const handleSupportClick = (e) => {
    e.preventDefault();
    setShowSupport(true);
    setMenuOpen(false);
  };
  const closeSupport = () => setShowSupport(false);
  const openEmail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support Request`;
    setShowSupport(false);
  };
  const openChat = () => {
    window.open(CHAT_URL, "_blank");
    setShowSupport(false);
  };

  return (
    <>
      <nav className="fixed z-50 top-0 left-0 w-full bg-gradient-to-b from-[#181A32]/95 to-[#23272F]/80 backdrop-blur-md border-b border-yellow-300/10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Logo + Title */}
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl text-yellow-300 hover:scale-105 transition"
          >
            <TetherLogo className="h-8 w-8" />
            <span>Tether2INR</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 items-center font-medium">
            {navLinks.map(({ to, label, isSupport }) => {
              if (isSupport) {
                return (
                  <button
                    key={label}
                    onClick={handleSupportClick}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-yellow-100 hover:bg-yellow-300/20 hover:text-yellow-300 transition"
                  >
                    {label}
                  </button>
                );
              }
              return (
                <NavLink to={to} label={label} key={to} current={location.pathname === to} />
              );
            })}
            {user && (
              <button
                onClick={logout}
                className="ml-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-yellow-300 text-[#181A32] hover:bg-yellow-400 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile icons */}
          <div className="flex items-center gap-3 md:hidden">
            {user ? (
              <Link to="/dashboard" className="p-1 hover:scale-105 transition">
                <DashboardIcon />
              </Link>
            ) : (
              <Link to="/login" className="p-1 hover:scale-105 transition">
                <LoginIcon />
              </Link>
            )}
            <button
              className="flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(o => !o)}
            >
              <svg className="w-7 h-7 text-yellow-200" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute right-4 top-full mt-2 bg-[#181A32]/95 rounded-lg shadow-lg border border-yellow-300/20 w-48 text-sm"
          >
            <div className="flex flex-col">
              {navLinks.map(({ to, label, isSupport }) => {
                if (isSupport) {
                  return (
                    <button
                      key={label}
                      onClick={handleSupportClick}
                      className="w-full text-left px-3 py-2 hover:bg-yellow-300/20 hover:text-yellow-300 transition"
                    >
                      {label}
                    </button>
                  );
                }
                return (
                  <Link
                    to={to}
                    key={to}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-3 py-2 hover:bg-yellow-300/20 hover:text-yellow-300 transition ${
                      location.pathname === to ? "bg-yellow-200 text-[#181A32]" : "text-yellow-100"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
              {user && (
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 mt-1 bg-yellow-300 text-[#181A32] font-bold rounded-b-lg hover:bg-yellow-400 transition"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={closeSupport} />
          {/* Modal box */}
          <div className="relative bg-[#1B1D2A]/95 text-yellow-200 rounded-lg shadow-2xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-bold mb-4 text-center">Support</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={openEmail}
                className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                Email Us
              </button>
              <button
                onClick={openChat}
                className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                Chat on Telegram
              </button>
              <button
                onClick={closeSupport}
                className="w-full px-4 py-2 border border-yellow-300 text-yellow-200 rounded-lg hover:bg-yellow-300/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, label, current }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
        current
          ? "bg-yellow-200 text-[#181A32] shadow"
          : "text-yellow-100 hover:bg-yellow-300/20 hover:text-yellow-300"
      }`}
    >
      {label}
    </Link>
  );
}
