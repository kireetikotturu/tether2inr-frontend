import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../services/api";

// CSV helpers
function arrayToCSV(data, columns) {
  const header = columns.map(col => `"${col.header}"`).join(",") + "\n";
  const rows = data.map(row =>
    columns.map(col => {
      const value = typeof col.accessor === "function" ? col.accessor(row) : row[col.accessor];
      return `"${(value ?? "").toString().replace(/"/g, '""')}"`
    }).join(",")
  ).join("\n");
  return header + rows;
}

function downloadCSV(csv, filename = "data.csv") {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [tab, setTab] = useState("deposits");
  const [message, setMessage] = useState("");
  // Search/filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    apiFetch("/deposit/all", { headers: { Authorization: `Bearer ${user.token}` } }).then(setDeposits);
    apiFetch("/withdrawal/all", { headers: { Authorization: `Bearer ${user.token}` } }).then(setWithdrawals);
  }, [user, message]);

  // Filtering logic (safe for object bankDetails)
  function filterRows(rows) {
    return rows.filter(row => {
      let match = true;
      let bankDetailsStr = "";
      if (row.bankDetails) {
        if (typeof row.bankDetails === "object" && !Array.isArray(row.bankDetails)) {
          bankDetailsStr = Object.values(row.bankDetails).join(" ");
        } else if (typeof row.bankDetails === "string") {
          bankDetailsStr = row.bankDetails;
        }
      }
      if (search) {
        const val = (row.user?.email + " " + (row.txHash || "") + " " + bankDetailsStr).toLowerCase();
        match = val.includes(search.toLowerCase());
      }
      if (statusFilter !== "all" && row.status !== statusFilter) match = false;
      return match;
    });
  }

  // Handle deposit approve/reject
  async function handleDepositAction(id, status) {
    setMessage("");
    try {
      await apiFetch(`/deposit/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status }),
      });
      setMessage(`Deposit ${status}`);
      // Refresh list
      const updatedDeposits = await apiFetch("/deposit/all", { headers: { Authorization: `Bearer ${user.token}` } });
      setDeposits(updatedDeposits);
    } catch (err) {
      setMessage(err.message || "Error updating deposit status");
    }
  }

  // Handle withdrawal approve/reject
  async function handleWithdrawalAction(id, status) {
    setMessage("");
    try {
      await apiFetch(`/withdrawal/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ status }),
      });
      setMessage(`Withdrawal ${status}`);
      // Refresh list
      const updatedWithdrawals = await apiFetch("/withdrawal/all", { headers: { Authorization: `Bearer ${user.token}` } });
      setWithdrawals(updatedWithdrawals);
    } catch (err) {
      setMessage(err.message || "Error updating withdrawal status");
    }
  }

  // CSV Export functions
  function exportDeposits() {
    const columns = [
      { header: "Date", accessor: d => new Date(d.createdAt).toLocaleString() },
      { header: "User", accessor: d => d.user?.email },
      { header: "Amount", accessor: "amount" },
      { header: "Network", accessor: "network" },
      { header: "Status", accessor: "status" },
      { header: "TxHash", accessor: "txHash" }
    ];
    const csv = arrayToCSV(filterRows(deposits), columns);
    downloadCSV(csv, "deposits.csv");
  }

  function exportWithdrawals() {
    const columns = [
      { header: "Date", accessor: w => new Date(w.createdAt).toLocaleString() },
      { header: "User", accessor: w => w.user?.email },
      { header: "Amount", accessor: "amount" },
      { header: "Status", accessor: "status" },
      { header: "Bank Account", accessor: w => w.bankDetails?.accountNumber ?? "" },
      { header: "Bank Name", accessor: w => w.bankDetails?.holderName ?? "" },
      { header: "IFSC", accessor: w => w.bankDetails?.ifsc ?? "" }
    ];
    const csv = arrayToCSV(filterRows(withdrawals), columns);
    downloadCSV(csv, "withdrawals.csv");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Admin Panel</h2>
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded font-bold ${tab === "deposits" ? "bg-brand-gold text-brand-dark" : "bg-brand-dark text-brand-gold"}`}
          onClick={() => setTab("deposits")}
        >Deposits</button>
        <button
          className={`px-4 py-2 rounded font-bold ${tab === "withdrawals" ? "bg-brand-gold text-brand-dark" : "bg-brand-dark text-brand-gold"}`}
          onClick={() => setTab("withdrawals")}
        >Withdrawals</button>
      </div>

      {/* FILTER UI */}
      <div className="mb-3 flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search by email, tx hash, bank details..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {message && <div className="text-green-500 mb-2">{message}</div>}

      {tab === "deposits" && (
        <>
          <button
            className="mb-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={exportDeposits}
          >Export Deposits to CSV</button>
          <table className="min-w-full text-sm mb-6">
            <thead>
              <tr>
                <th>Date</th><th>User</th><th>Amount</th><th>Network</th><th>Status</th><th>TxHash</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterRows(deposits).length === 0 && <tr><td colSpan={7} className="text-center py-4">No deposits.</td></tr>}
              {filterRows(deposits).map(dep => (
                <tr key={dep._id}>
                  <td>{new Date(dep.createdAt).toLocaleString()}</td>
                  <td>{dep.user?.email}</td>
                  <td>{dep.amount}</td>
                  <td>{dep.network}</td>
                  <td className={`capitalize ${dep.status === "approved" ? "text-green-500" : dep.status === "pending" ? "text-yellow-400" : "text-red-500"}`}>{dep.status}</td>
                  <td className="break-all">{dep.txHash}</td>
                  <td>
                    {dep.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="bg-green-500 px-2 py-1 rounded text-white" onClick={() => handleDepositAction(dep._id, "approved")}>Approve</button>
                        <button className="bg-red-500 px-2 py-1 rounded text-white" onClick={() => handleDepositAction(dep._id, "rejected")}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "withdrawals" && (
        <>
          <button
            className="mb-2 px-3 py-1 bg-blue-500 text-white rounded"
            onClick={exportWithdrawals}
          >Export Withdrawals to CSV</button>
          <table className="min-w-full text-sm mb-6">
            <thead>
              <tr>
                <th>Date</th><th>User</th><th>Amount</th><th>Status</th><th>Bank Details</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filterRows(withdrawals).length === 0 && <tr><td colSpan={6} className="text-center py-4">No withdrawals.</td></tr>}
              {filterRows(withdrawals).map(w => (
                <tr key={w._id}>
                  <td>{new Date(w.createdAt).toLocaleString()}</td>
                  <td>{w.user?.email}</td>
                  <td>{w.amount}</td>
                  <td className={`capitalize ${w.status === "approved" ? "text-green-500" : w.status === "pending" ? "text-yellow-400" : "text-red-500"}`}>{w.status}</td>
                  <td className="break-all">
                    {/* Defensive rendering for any weird bankDetails shape */}
                    {w.bankDetails &&
                    typeof w.bankDetails === "object" &&
                    !Array.isArray(w.bankDetails) ? (
                      <div>
                        <div><b>Acc:</b> {w.bankDetails.accountNumber}</div>
                        <div><b>Name:</b> {w.bankDetails.holderName}</div>
                        <div><b>IFSC:</b> {w.bankDetails.ifsc}</div>
                      </div>
                    ) : typeof w.bankDetails === "string" ? (
                      <span>{w.bankDetails}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {w.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="bg-green-500 px-2 py-1 rounded text-white" onClick={() => handleWithdrawalAction(w._id, "approved")}>Approve</button>
                        <button className="bg-red-500 px-2 py-1 rounded text-white" onClick={() => handleWithdrawalAction(w._id, "rejected")}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}