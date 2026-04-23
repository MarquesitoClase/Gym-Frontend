import { AuthProvider } from "../auth/AuthContext.jsx";
import { AppRouter } from "../router/AppRouter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <ToastContainer />
    </>
  );
}
