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
          searchPlaceholder: "Buscar usuarios o clases..."
        }
      },
      {
        path: "actividades",
        element: <ActivitiesPage />,
        handle: {
          searchPlaceholder: "Buscar actividades o monitores..."
        }
      },
      {
        path: "usuarios",
        element: <UsersPage />,
        handle: {
          searchPlaceholder: "Buscar usuarios por nombre o DNI..."
        }
      },
      {
        path: "profesores",
        element: <TeachersPage />,
        handle: {
          searchPlaceholder: "Buscar monitores por nombre o especialidad..."
        }
      },
      {
        path: "inscripciones",
        element: <EnrollmentsPage />,
        handle: {
          searchPlaceholder: "Buscar usuarios o actividades..."
        }
      },
      {
        path: "configuracion",
        element: <ConfigPage />,
        handle: {
          searchPlaceholder: "Buscar en configuración..."
        }
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: {
          searchPlaceholder: "Buscar en TenFit..."
        }
      }
    ]
  },
  {
    path: "*",
    element: <Navigate replace to="/login" />
  }
];
