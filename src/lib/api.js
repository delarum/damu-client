// DamuLink API client
// Talks to the Django REST backend documented in your API reference.
// Set VITE_API_BASE_URL in a .env file at the project root, e.g.:
//   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const TOKEN_KEY = "damulink_access_token";
const REFRESH_KEY = "damulink_refresh_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access, refresh }) {
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new ApiError("No refresh token available", 401);

  const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new ApiError("Session expired. Please log in again.", res.status);
  }

  const data = await res.json();
  setTokens({ access: data.access });
  return data.access;
}

/**
 * Core request helper. Automatically attaches the JWT, retries once on a
 * 401 by refreshing the access token, and normalizes error shapes coming
 * back from DRF (validation errors, auth errors, permission errors).
 */
async function request(path, { method = "GET", body, auth = true, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const doFetch = async () => {
    return fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  };

  let res = await doFetch();

  // Attempt a single silent refresh-and-retry on auth expiry.
  if (res.status === 401 && auth && getRefreshToken()) {
    try {
      const newAccess = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await doFetch();
    } catch {
      // fall through to error handling below
    }
  }

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      // non-JSON error body
    }
    const message = payload?.message || payload?.detail || "Something went wrong. Please try again.";
    throw new ApiError(message, res.status, payload?.details);
  }

  // Some endpoints (e.g. USSD) return plain text.
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  patch: (path, body, opts) => request(path, { ...opts, method: "PATCH", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};

// ---- Auth ----
export const authApi = {
  registerDonor: (payload) => api.post("/auth/register/donor/", payload, { auth: false }),
  registerHospital: (payload) =>
    api.post("/auth/register/hospital/", payload, { auth: false }),
  login: (payload) => api.post("/auth/login/", payload, { auth: false }),
  verifyOtp: (payload) => api.post("/auth/verify-otp/", payload, { auth: false }),
  resendOtp: (payload) => api.post("/auth/resend-otp/", payload, { auth: false }),
  me: () => api.get("/auth/me/"),
  logout: (refresh) => api.post("/auth/logout/", { refresh }),
};

// ---- Donors ----
export const donorApi = {
  createProfile: (payload) => api.post("/donors/profile/", payload),
  getProfile: () => api.get("/donors/profile/me/"),
  updateProfile: (payload) => api.patch("/donors/profile/update/", payload),
  setAvailability: (payload) => api.post("/donors/profile/availability/", payload),
  dashboard: () => api.get("/donors/dashboard/"),
};

// ---- Donations & gamification ----
export const donationApi = {
  history: () => api.get("/donations/history/"),
};

export const creditsApi = {
  balance: () => api.get("/credits/balance/"),
  ledger: () => api.get("/credits/ledger/"),
  redeem: (payload) => api.post("/credits/redeem/", payload),
};

export const gamificationApi = {
  badges: () => api.get("/gamification/badges/"),
  leaderboard: () => api.get("/gamification/leaderboard/"),
};

// ---- Matching / contact requests (donor side) ----
export const matchingApi = {
  myContactRequests: () => api.get("/matching/contact-requests/mine/"),
  respond: (requestId, action) =>
    api.post(`/matching/contact-requests/${requestId}/respond/`, { action }),
};

export { ApiError };