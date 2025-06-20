// src/pages/Deposit.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../services/api";

const NETWORKS = [
  { label: "TRC20", value: "TRC20", address: "TH9N2PkXguotCrC2PbFQsHnwBZrYGSmZ8e" },
  { label: "BEP20", value: "BEP20", address: "0x944909359A1Cb0140Ba9047F72fA503A93Bf80f1" }
];

export default function Deposit() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState(NETWORKS[0].value);
  const [txHash, setTxHash] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const selectedNetwork = NETWORKS.find(n => n.value === network);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!amount || !txHash) {
      setMessage("Please enter amount and transaction hash.");
      return;
    }
    try {
      setLoading(true);
      await apiFetch("/deposit", {
        method: "POST",
        body: JSON.stringify({ amount, network, txHash }),
      });
      setMessage("Deposit request submitted successfully!");
      setAmount("");
      setTxHash("");
    } catch (err) {
      setMessage(err.message || "Error submitting deposit.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedNetwork.address);
    setMessage("Address copied to clipboard!");
  };

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-md bg-[#1B1D2A]/90 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-yellow-200 mb-6 text-center">
          Deposit USDT
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-yellow-100 mb-1">
              Select Network
            </label>
            <select
              value={network}
              onChange={e => setNetwork(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#141823] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              {NETWORKS.map(net => (
                <option key={net.value} value={net.value}>
                  {net.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-yellow-100 mb-1">
              USDT Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={selectedNetwork.address}
                disabled
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#141823] text-yellow-200"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-semibold shadow hover:scale-105 transition"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-yellow-100 mb-1">
              Amount (USDT)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#141823] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-yellow-100 mb-1">
              Transaction Hash
            </label>
            <input
              type="text"
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#141823] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-bold hover:scale-105 transition"
          >
            {loading ? "Submitting..." : "Submit Deposit"}
          </button>
          {message && (
            <div className="text-center mt-3 text-yellow-300">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
