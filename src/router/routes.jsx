import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { AppShell } from "../layout/AppShell";
import { ActivitiesPage } from "../pages/ActivitiesPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EnrollmentsPage } from "../pages/EnrollmentsPage";
import { LoginPage } from "../pages/LoginPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TeachersPage } from "../pages/TeachersPage";
import { UsersPage } from "../pages/UsersPage";
import { ConfigPage } from "../pages/Config/ConfigPage";

export const routes = [
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
        handle: {
          searchPlaceholderKey: "buscarUsuariosOClases"
        }
      },
      {
        path: "actividades",
        element: <ActivitiesPage />,
        handle: {
          searchPlaceholderKey: "buscarActividadesOMonitores"
        }
      },
      {
        path: "usuarios",
        element: <UsersPage />,
        handle: {
          searchPlaceholderKey: "buscarUsuariosPorNombreODni"
        }
      },
      {
        path: "profesores",
        element: <TeachersPage />,
        handle: {
          searchPlaceholderKey: "buscarMonitoresPorNombreOEspecialidad"
        }
      },
      {
        path: "inscripciones",
        element: <EnrollmentsPage />,
        handle: {
          searchPlaceholderKey: "buscarUsuariosOActividades"
        }
      },
      {
        path: "configuracion",
        element: <ConfigPage />,
        handle: {
          searchPlaceholderKey: "buscarEnConfiguracion"
        }
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: {
          searchPlaceholderKey: "buscarEnTenfit"
        }
      }
    ]
  },
  {
    path: "*",
    element: <Navigate replace to="/login" />
  }
];
