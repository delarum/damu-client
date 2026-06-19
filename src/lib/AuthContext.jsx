import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, donorApi, setTokens, clearTokens, getAccessToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
      try {
        const profile = await donorApi.getProfile();
        setDonorProfile(profile);
      } catch {
        // donor may not have completed their profile yet — that's fine
        setDonorProfile(null);
      }
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    setTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    await loadSession();
    return data;
  };

  const register = async (payload) => {
    return authApi.registerDonor(payload);
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("damulink_refresh_token");
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore network errors on logout — clear local state regardless
    }
    clearTokens();
    setUser(null);
    setDonorProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, donorProfile, loading, login, register, logout, refreshProfile: loadSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}