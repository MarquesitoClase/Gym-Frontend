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
import { ConfigPage } from "../pages/config/ConfigPage";

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
          searchPlaceholderKey: "topbar.searchUsersOrClasses"
        }
      },
      {
        path: "actividades",
        element: <ActivitiesPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchActivities"
        }
      },
      {
        path: "usuarios",
        element: <UsersPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchUsers"
        }
      },
      {
        path: "profesores",
        element: <TeachersPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchTeachers"
        }
      },
      {
        path: "inscripciones",
        element: <EnrollmentsPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchEnrollments"
        }
      },
      {
        path: "configuracion",
        element: <ConfigPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchConfig"
        }
      },
      {
        path: "*",
        element: <NotFoundPage />,
        handle: {
          searchPlaceholderKey: "topbar.searchDefault"
        }
      }
    ]
  },
  {
    path: "*",
    element: <Navigate replace to="/login" />
  }
];
