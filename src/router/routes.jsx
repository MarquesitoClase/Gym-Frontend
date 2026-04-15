import { AppShell } from "../layout/AppShell";
import { ActivitiesPage } from "../pages/ActivitiesPage";
import { DashboardPage } from "../pages/DashboardPage";
import { EnrollmentsPage } from "../pages/EnrollmentsPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { TeachersPage } from "../pages/TeachersPage";
import { UsersPage } from "../pages/UsersPage";

export const routes = [
  {
    path: "/",
    element: <AppShell />,
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
          searchPlaceholder: "Buscar actividades o profesores..."
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
          searchPlaceholder: "Buscar profesores por nombre o especialidad..."
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
        path: "*",
        element: <NotFoundPage />,
        handle: {
          searchPlaceholder: "Buscar en Titan Gym..."
        }
      }
    ]
  }
];
