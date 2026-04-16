import { formatCurrency, formatDateTime } from "../../utils/formatters";

const numberFormatter = new Intl.NumberFormat("es-ES");

function buildTeacherNameById(teachers) {
  return new Map(
    teachers.map((teacher) => [
      teacher.id,
      [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
    ])
  );
}

function createPlaceholderMetrics(meta) {
  return [
    {
      id: "users-active",
      label: "Socios activos",
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "teachers-active",
      label: "Clases activas",
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "revenue",
      label: "Ingresos del mes",
      meta,
      tone: "revenue",
      value: "--"
    }
  ];
}

export function buildDashboardMetrics(data, status = "success") {
  if (status === "loading") {
    return createPlaceholderMetrics("Cargando datos reales");
  }

  if (status === "error") {
    return createPlaceholderMetrics("Sin conexion con el backend");
  }

  const {
    activities = [],
    activeTeachers = [],
    activeUsers = [],
    teachers = [],
    users = []
  } = data;
  const estimatedRevenue = activities.reduce(
    (total, activity) => total + Number(activity.price || 0),
    0
  );
  const revenueTarget = 50000;
  const revenueProgress = revenueTarget
    ? Math.min(100, Math.round((estimatedRevenue / revenueTarget) * 100))
    : 0;

  return [
    {
      badge: "+12% vs el mes pasado",
      id: "users-active",
      label: "Socios activos",
      meta: `${numberFormatter.format(users.length)} registrados en total`,
      tone: "primary",
      value: numberFormatter.format(activeUsers.length)
    },
    {
      badge: "En directo",
      id: "teachers-active",
      label: "Clases activas",
      meta: `${numberFormatter.format(activeTeachers.length)} monitores activos`,
      tone: "accent",
      value: numberFormatter.format(activities.length)
    },
    {
      badge: "Objetivo: 50k",
      id: "revenue",
      label: "Ingresos del mes",
      meta: `${revenueProgress}% del objetivo - ${numberFormatter.format(
        teachers.length
      )} monitores en plantilla`,
      progress: revenueProgress,
      targetLabel: `${revenueProgress}%`,
      tone: "revenue",
      value: formatCurrency(estimatedRevenue)
    }
  ];
}

export function buildUpcomingActivities(activities, teachers) {
  const teacherNameById = buildTeacherNameById(teachers);

  return [...activities]
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .slice(0, 5)
    .map((activity) => {
      const enrolled = activity.enrolledCount ?? 0;

      return {
        enrolled,
        enrolledLabel: enrolled === 1 ? "1 inscrito" : `${enrolled} inscritos`,
        id: activity.id,
        metric: formatCurrency(activity.price),
        name: activity.title,
        schedule: formatDateTime(activity.date),
        teacher:
          teacherNameById.get(activity.teacherId) ??
          `Monitor #${activity.teacherId}`
      };
    });
}
