import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = {
  email: "admin@tenfit.com",
  password: "Admin1234"
};

const ADMIN_PROFILE = {
  email: "admin@tenfit.com",
  initials: "TF",
  name: "Admin TenFit",
  role: "Administrador principal"
};

const STORAGE_KEY = "tenfit_auth";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}

export { ADMIN_CREDENTIALS, ADMIN_PROFILE, STORAGE_KEY };