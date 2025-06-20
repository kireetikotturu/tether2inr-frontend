import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../services/api";

export default function Withdraw() {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [showAddBank, setShowAddBank] = useState(false);
  const [bankForm, setBankForm] = useState({ accountNumber: "", ifsc: "", holderName: "" });
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user's bank accounts
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await apiFetch("/user/bank-accounts");
        setBankAccounts(data || []);
        if (data && data.length > 0) setSelectedBank(data[0]._id || "");
      } catch (err) {
        console.error("Failed to fetch bank accounts:", err);
      }
    })();
  }, [user, message]);

  const handleBankFormChange = e => {
    setBankForm({ ...bankForm, [e.target.name]: e.target.value });
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    setMessage("");
    const { accountNumber, ifsc, holderName } = bankForm;
    if (!accountNumber || !ifsc || !holderName) {
      setMessage("Fill all bank details.");
      return;
    }
    try {
      setLoading(true);
      await apiFetch("/user/bank-accounts", {
        method: "POST",
        body: JSON.stringify(bankForm)
      });
      setMessage("Bank account added!");
      setShowAddBank(false);
      setBankForm({ accountNumber: "", ifsc: "", holderName: "" });
      // next effect will refetch bankAccounts because `message` changed
    } catch (err) {
      setMessage(err.message || "Error adding bank account.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!selectedBank || !amount) {
      setMessage("Select a bank account and enter amount.");
      return;
    }
    try {
      setLoading(true);
      await apiFetch("/withdrawal", {
        method: "POST",
        body: JSON.stringify({
          amount,
          bankAccountId: selectedBank
        })
      });
      setMessage("Withdrawal request submitted!");
      setAmount("");
      // Optionally: navigate to dashboard so history shows immediately
    } catch (err) {
      setMessage(err.message || "Error submitting withdrawal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-md bg-[#1B1D2A]/90 rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold text-yellow-200 mb-6 text-center">
          Withdraw USDT
        </h2>

        <div className="mb-5">
          <label className="block font-semibold text-yellow-100 mb-1">
            Select Bank Account
          </label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedBank}
              onChange={e => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#141823] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              {bankAccounts.length === 0 && (
                <option value="">No bank accounts saved</option>
              )}
              {bankAccounts.map(bank => (
                <option value={bank._id} key={bank._id}>
                  {bank.holderName} - {bank.accountNumber} ({bank.ifsc})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddBank(v => !v)}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-semibold shadow hover:scale-105 transition"
            >
              {showAddBank ? "Cancel" : "Add Bank"}
            </button>
          </div>
        </div>

        {showAddBank && (
          <form onSubmit={handleAddBank} className="mb-5 bg-[#141823] p-4 rounded-lg space-y-3">
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={bankForm.accountNumber}
              onChange={handleBankFormChange}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#1E2030] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
            <input
              type="text"
              name="ifsc"
              placeholder="IFSC Code"
              value={bankForm.ifsc}
              onChange={handleBankFormChange}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#1E2030] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
            <input
              type="text"
              name="holderName"
              placeholder="Account Holder Name"
              value={bankForm.holderName}
              onChange={handleBankFormChange}
              className="w-full px-3 py-2 rounded-lg border border-yellow-400/30 bg-[#1E2030] text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-bold hover:scale-105 transition"
            >
              {loading ? "Saving..." : "Save Bank"}
            </button>
          </form>
        )}

        <form onSubmit={handleWithdraw} className="space-y-5">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 text-[#181A32] font-bold hover:scale-105 transition"
          >
            {loading ? "Submitting..." : "Withdraw"}
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
