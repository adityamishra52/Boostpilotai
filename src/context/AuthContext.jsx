import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const user = localStorage.getItem("boostpilot_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("boostpilot_token"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("boostpilot_token")));

  const persistSession = useCallback((session) => {
    localStorage.setItem("boostpilot_token", session.token);
    localStorage.setItem("boostpilot_user", JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }, []);

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      const data = await authService.login(payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("boostpilot_token");
    localStorage.removeItem("boostpilot_user");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authService.me();
    localStorage.setItem("boostpilot_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const updateUser = useCallback((nextUser) => {
    localStorage.setItem("boostpilot_user", JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!token) {
      setBooting(false);
      return undefined;
    }

    authService
      .me()
      .then((data) => {
        if (mounted) {
          setUser(data.user);
          localStorage.setItem("boostpilot_user", JSON.stringify(data.user));
        }
      })
      .catch(() => {
        if (mounted) {
          logout();
        }
      })
      .finally(() => {
        if (mounted) {
          setBooting(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [logout, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      refreshUser,
      register,
      updateUser
    }),
    [booting, login, logout, refreshUser, register, token, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
