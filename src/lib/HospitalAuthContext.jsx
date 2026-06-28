import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setTokens, clearTokens, getAccessToken, setSessionScope } from "./api";
import { hospitalApi } from "./apiHospital";

const HospitalAuthContext = createContext(null);

export function HospitalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hospitalProfile, setHospitalProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Every hospital page is wrapped in this provider. Setting the scope here,
  // before any request fires, means every api.* call made anywhere beneath
  // this provider automatically reads/writes the hospital's own token slot
  // — never the donor's, never the admin's.
  useEffect(() => {
    setSessionScope("hospital");
  }, []);

  const loadSession = useCallback(async () => {
    setSessionScope("hospital");
    if (!getAccessToken("hospital")) {
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
        // hospital may not have completed their profile yet — that's fine
        setHospitalProfile(null);
      }
    } catch {
      clearTokens("hospital");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = async (credentials) => {
    setSessionScope("hospital");
    const data = await authApi.login(credentials);
    setTokens({ access: data.access, refresh: data.refresh }, "hospital");
    setUser(data.user);
    await loadSession();
    return data;
  };

  const register = async (payload) => {
    return authApi.registerHospital(payload);
  };

  const logout = async () => {
    setSessionScope("hospital");
    try {
      const refresh = getAccessToken("hospital")
        ? localStorage.getItem("damulink_hospital_refresh_token")
        : null;
      if (refresh) await authApi.logout(refresh);
    } catch {
      // ignore network errors on logout — clear local state regardless
    }
    clearTokens("hospital");
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