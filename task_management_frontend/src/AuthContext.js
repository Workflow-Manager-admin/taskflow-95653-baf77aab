import React, { createContext, useState, useEffect, useCallback } from "react";
import { authApi } from "./authService";

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider - React context provider for authentication state and actions.
 * Provides: user object, login, register, logout, isLoading, error, fetchProfile
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem("authUser");
    return json ? JSON.parse(json) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile if token exists on mount
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      localStorage.setItem("authToken", res.token);
      setUser(res.user);
      localStorage.setItem("authUser", JSON.stringify(res.user));
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      setError(e.message || "Login failed");
      setIsLoading(false);
      return { success: false, error: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const register = async (name, email, password) => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      setToken(res.token);
      localStorage.setItem("authToken", res.token);
      setUser(res.user);
      localStorage.setItem("authUser", JSON.stringify(res.user));
      setIsLoading(false);
      return { success: true };
    } catch (e) {
      setError(e.message || "Registration failed");
      setIsLoading(false);
      return { success: false, error: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }, []);

  // PUBLIC_INTERFACE
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const profile = await authApi.getProfile(token);
      setUser(profile);
      localStorage.setItem("authUser", JSON.stringify(profile));
      setIsLoading(false);
    } catch (e) {
      setError(e.message);
      logout();
      setIsLoading(false);
    }
    // eslint-disable-next-line
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
