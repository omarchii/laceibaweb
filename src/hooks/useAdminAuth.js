import { useCallback, useState } from "react";
import { requestJson, setAdminToken, clearAdminToken } from "../services/api";

const ADMIN_KEY = "laceibaAdmin";

const readStoredAdmin = () => {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function useAdminAuth() {
  const [currentAdmin, setCurrentAdmin] = useState(readStoredAdmin);

  const login = useCallback(async ({ email, password }) => {
    const data = await requestJson("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data.admin));
    setAdminToken(data.token);
    setCurrentAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_KEY);
    clearAdminToken();
    setCurrentAdmin(null);
  }, []);

  return { currentAdmin, login, logout };
}
