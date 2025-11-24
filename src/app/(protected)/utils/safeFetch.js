// src/utils/safeFetch.js
export async function safeFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }

    return await res.json(); // ✅ Already returns parsed JSON
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}
