import { formatCurrency } from "../../utils/formatters";

function formatTime(value) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    weekday: "short"
  }).format(new Date(value));
}

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
    enrollments = [],
    teachers = [],
    users = []
  } = data;
  const activeEnrollments = enrollments.filter(
    (enrollment) => enrollment.attendanceStatus !== "CANCELLED"
  );
  const priceByActivityId = new Map(
    activities.map((activity) => [activity.id, Number(activity.price || 0)])
  );
  const realRevenue = activeEnrollments.reduce(
    (total, enrollment) =>
      total + (enrollment.paid ? Number(enrollment.pricePaid || 0) : 0),
    0
  );
  const pendingFromEnrollments = activeEnrollments.reduce(
    (total, enrollment) =>
      total +
      (enrollment.paid
        ? 0
        : Number(
            enrollment.pricePaid ??
              priceByActivityId.get(enrollment.activityId) ??
              0
          )),
    0
  );
  const estimatedFromActivities = activities.reduce(
    (total, activity) =>
      total + Number(activity.price || 0) * Number(activity.enrolledCount || 0),
    0
  );
  // Si el listado de enrollments esta vacio (backend aun no las genera o fallo la llamada)
  // usamos la estimacion historica basada en enrolledCount de cada actividad.
  const pendingRevenue =
    activeEnrollments.length > 0
      ? pendingFromEnrollments
      : Math.max(estimatedFromActivities - realRevenue, 0);
  const totalEnrollmentsCount = activities.reduce(
    (total, activity) => total + Number(activity.enrolledCount || 0),
    0
  );
  const totalEnrollments =
    activeEnrollments.length > 0 ? activeEnrollments.length : totalEnrollmentsCount;
  const paidEnrollments = activeEnrollments.filter((e) => e.paid).length;
  const expectedRevenue = realRevenue + pendingRevenue;
  const collectedProgress =
    expectedRevenue > 0
      ? Math.round((realRevenue / expectedRevenue) * 100)
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
      badge:
        pendingRevenue > 0
          ? `Pendiente ${formatCurrency(pendingRevenue)}`
          : totalEnrollments > 0
          ? "Todo cobrado"
          : "Sin inscripciones",
      id: "revenue",
      label: "Ingresos esperados del mes",
      meta: `${formatCurrency(realRevenue)} cobrados · ${numberFormatter.format(
        paidEnrollments
      )} de ${numberFormatter.format(totalEnrollments)} ${
        totalEnrollments === 1 ? "inscripcion" : "inscripciones"
      }`,
      progress: collectedProgress,
      progressLabel: "Cobrado",
      targetLabel: `${collectedProgress}%`,
      tone: "revenue",
      value: formatCurrency(expectedRevenue)
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
        scheduleDate: formatShortDate(activity.date),
        scheduleTime: formatTime(activity.date),
        teacher:
          teacherNameById.get(activity.teacherId) ??
          `Monitor #${activity.teacherId}`
      };
    });
}
