import { useCallback, useState } from "react";
import { requestJson, setToken, clearToken } from "../services/api";

const GUEST_KEY = "laceibaGuest";

const readStoredGuest = () => {
  const raw = localStorage.getItem(GUEST_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export function useAuth() {
  const [currentGuest, setCurrentGuest] = useState(readStoredGuest);

  const persist = useCallback(({ guest, token }) => {
    localStorage.setItem(GUEST_KEY, JSON.stringify(guest));
    setToken(token);
    setCurrentGuest(guest);
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await requestJson("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      persist(data);
      return data.guest;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const data = await requestJson("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      persist(data);
      return data.guest;
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(GUEST_KEY);
    clearToken();
    setCurrentGuest(null);
  }, []);

  return { currentGuest, login, register, logout };
}
