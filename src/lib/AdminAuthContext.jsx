import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setTokens, clearTokens, getAccessToken } from "./api";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await authApi.me();
      setUser(me);
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

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("damulink_refresh_token");
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore
    }
    clearTokens();
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, loading, login, logout, refreshProfile: loadSession }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
