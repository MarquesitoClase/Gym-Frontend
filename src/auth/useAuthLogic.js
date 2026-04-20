import { useCallback, useMemo, useState } from "react";
import { ADMIN_CREDENTIALS, ADMIN_PROFILE, STORAGE_KEY } from "./AuthContext";

export function useAuthLogic() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  const login = useCallback((email, password) => {
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return useMemo(
    () => ({
      admin: ADMIN_PROFILE,
      isAuthenticated,
      login,
      logout
    }),
    [isAuthenticated, login, logout]
  );
}
