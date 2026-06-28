import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setTokens, clearTokens, getAccessToken } from "./api";

const HospitalAuthContext = createContext(null);

export function HospitalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hospitalProfile, setHospitalProfile] = useState(null);
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
        const profile = await hospitalApi.getProfile();
        setHospitalProfile(profile);
      } catch {
        setHospitalProfile(null);
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
    return authApi.registerHospital(payload);
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("damulink_refresh_token");
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore
    }
    clearTokens();
    setUser(null);
    setHospitalProfile(null);
  };

  return (
    <HospitalAuthContext.Provider
      value={{ user, hospitalProfile, loading, login, register, logout, refreshProfile: loadSession }}
    >
      {children}
    </HospitalAuthContext.Provider>
  );
}

export function useHospitalAuth() {
  const ctx = useContext(HospitalAuthContext);
  if (!ctx) throw new Error("useHospitalAuth must be used within HospitalAuthProvider");
  return ctx;
}
