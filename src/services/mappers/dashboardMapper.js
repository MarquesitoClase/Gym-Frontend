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

const dashboardI18nFallback = {
  usersActive: "Socios activos",
  activeClasses: "Clases activas",
  monthlyIncome: "Ingresos del mes",
  loadingRealData: "Cargando datos reales",
  noBackend: "Sin conexion con el backend",
  monthVs: "+12% vs el mes pasado",
  liveNow: "En directo",
  goal50k: "Objetivo: 50k",
  totalRegistered: "registrados en total",
  activeInstructors: "monitores activos",
  usersActiveWord: "usuarios activos",
  teachersInStaff: "monitores en plantilla",
  oneEnrolled: "1 inscrito",
  manyEnrolled: "inscritos",
  monitorPrefix: "Monitor #"
};

function buildTeacherNameById(teachers) {
  return new Map(
    teachers.map((teacher) => [
      teacher.id,
      [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
    ])
  );
}

function createPlaceholderMetrics(meta, i18n) {
  return [
    {
      id: "users-active",
      label: i18n.usersActive,
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "teachers-active",
      label: i18n.activeClasses,
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "revenue",
      label: i18n.monthlyIncome,
      meta,
      tone: "revenue",
      value: "--"
    }
  ];
}

export function buildDashboardMetrics(data, status = "success", i18n = {}) {
  const labels = { ...dashboardI18nFallback, ...i18n };

  if (status === "loading") {
    return createPlaceholderMetrics(labels.loadingRealData, labels);
  }

  if (status === "error") {
    return createPlaceholderMetrics(labels.noBackend, labels);
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
  const revenueProgress = users.length > 0
    ? Math.round((activeUsers.length / users.length) * 100)
    : 45;

  return [
    {
      badge: labels.monthVs,
      id: "users-active",
      label: labels.usersActive,
      meta: `${numberFormatter.format(users.length)} ${labels.totalRegistered}`,
      tone: "primary",
      value: numberFormatter.format(activeUsers.length)
    },
    {
      badge: labels.liveNow,
      id: "teachers-active",
      label: labels.activeClasses,
      meta: `${numberFormatter.format(activeTeachers.length)} ${labels.activeInstructors}`,
      tone: "accent",
      value: numberFormatter.format(activities.length)
    },
    {
      badge: labels.goal50k,
      id: "revenue",
      label: labels.monthlyIncome,
      meta: `${revenueProgress}% ${labels.usersActiveWord} - ${numberFormatter.format(
        teachers.length
      )} ${labels.teachersInStaff}`,
      progress: revenueProgress,
      targetLabel: `${revenueProgress}%`,
      tone: "revenue",
      value: formatCurrency(estimatedRevenue)
    }
  ];
}

export function buildUpcomingActivities(activities, teachers, i18n = {}) {
  const labels = { ...dashboardI18nFallback, ...i18n };
  const teacherNameById = buildTeacherNameById(teachers);

  return [...activities]
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .slice(0, 5)
    .map((activity) => {
      const enrolled = activity.enrolledCount ?? 0;

      return {
        enrolled,
        enrolledLabel:
          enrolled === 1 ? labels.oneEnrolled : `${enrolled} ${labels.manyEnrolled}`,
        id: activity.id,
        metric: formatCurrency(activity.price),
        name: activity.title,
        scheduleDate: formatShortDate(activity.date),
        scheduleTime: formatTime(activity.date),
        teacher:
          teacherNameById.get(activity.teacherId) ??
          `${labels.monitorPrefix}${activity.teacherId}`
      };
    });
}
