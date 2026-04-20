import { AuthContext } from "./AuthContext";
import { useAuthLogic } from "./useAuthLogic";

export function AuthProvider({ children }) {
  const value = useAuthLogic();

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}