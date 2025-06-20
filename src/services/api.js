const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiFetch(path, options = {}) {
  // Read saved user to get token
  let token = null;
  try {
    const saved = localStorage.getItem("tether2inr:user");
    if (saved) {
      const parsed = JSON.parse(saved);
      token = parsed.token;
    }
  } catch {}
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  let data;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
    if (!res.ok) throw new Error("Something went wrong");
    return null;
  }
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}
