import { AuthProvider } from "../auth/AuthContext.jsx";
import { AppRouter } from "../router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
