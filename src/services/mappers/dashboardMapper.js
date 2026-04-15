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
      id: "users",
      label: "Usuarios totales",
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "users-active",
      label: "Usuarios activos",
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "teachers-active",
      label: "Profesores activos",
      meta,
      tone: "neutral",
      value: "--"
    },
    {
      id: "activities-future",
      label: "Actividades futuras",
      meta,
      tone: "warning",
      value: "--"
    }
  ];
}

export function buildDashboardMetrics(data, status = "success") {
  if (status === "loading") {
    return createPlaceholderMetrics("Cargando datos reales");
  }

  if (status === "error") {
    return createPlaceholderMetrics("Sin conexion con backend");
  }

  const {
    activities = [],
    activeTeachers = [],
    activeUsers = [],
    users = []
  } = data;

  return [
    {
      id: "users",
      label: "Usuarios totales",
      meta: `${numberFormatter.format(users.length)} registros en base de datos`,
      tone: "primary",
      value: numberFormatter.format(users.length)
    },
    {
      id: "users-active",
      label: "Usuarios activos",
      meta: `${numberFormatter.format(users.length - activeUsers.length)} inactivos`,
      tone: "accent",
      value: numberFormatter.format(activeUsers.length)
    },
    {
      id: "teachers-active",
      label: "Profesores activos",
      meta: `${numberFormatter.format(activeTeachers.length)} disponibles hoy`,
      tone: "neutral",
      value: numberFormatter.format(activeTeachers.length)
    },
    {
      id: "activities-future",
      label: "Actividades futuras",
      meta: `${numberFormatter.format(activities.length)} sesiones publicadas`,
      tone: "warning",
      value: numberFormatter.format(activities.length)
    }
  ];
}

export function buildUpcomingActivities(activities, teachers) {
  const teacherNameById = buildTeacherNameById(teachers);

  return [...activities]
    .sort((left, right) => new Date(left.date) - new Date(right.date))
    .slice(0, 5)
    .map((activity) => ({
      id: activity.id,
      metric: formatCurrency(activity.price),
      name: activity.title,
      schedule: formatDateTime(activity.date),
      teacher:
        teacherNameById.get(activity.teacherId) ??
        `Profesor #${activity.teacherId}`
    }));
}

export function buildReceptionUpdates(data, status = "success") {
  if (status === "loading") {
    return [
      {
        description: "Esperando respuesta de usuarios, profesores y actividades.",
        id: "loading-01",
        title: "Sincronizando panel",
        tone: "neutral"
      }
    ];
  }

  if (status === "error") {
    return [
      {
        description: "No se pudo obtener la informacion operativa desde el backend.",
        id: "error-01",
        title: "Conexion interrumpida",
        tone: "attention"
      }
    ];
  }

  const {
    activities = [],
    activeTeachers = [],
    activeUsers = [],
    teachers = [],
    users = []
  } = data;
  const inactiveUsers = users.length - activeUsers.length;
  const inactiveTeachers = teachers.length - activeTeachers.length;
  const activitiesWithoutImage = activities.filter((activity) => !activity.imageUrl).length;

  return [
    {
      description:
        inactiveUsers > 0
          ? `${inactiveUsers} usuarios figuran como inactivos y no podran inscribirse desde recepcion.`
          : "Todos los usuarios disponibles figuran activos para operar con normalidad.",
      id: "update-01",
      title: "Estado de usuarios",
      tone: inactiveUsers > 0 ? "attention" : "active"
    },
    {
      description:
        inactiveTeachers > 0
          ? `${inactiveTeachers} profesores figuran inactivos y no deberian asignarse a nuevas actividades.`
          : "Todo el equipo docente disponible esta marcado como activo.",
      id: "update-02",
      title: "Estado de profesores",
      tone: inactiveTeachers > 0 ? "inactive" : "active"
    },
    {
      description:
        activitiesWithoutImage > 0
          ? `${activitiesWithoutImage} actividades futuras siguen sin imagen asociada.`
          : "Todas las actividades futuras ya cuentan con imagen de portada.",
      id: "update-03",
      title: "Calidad del catalogo",
      tone: activitiesWithoutImage > 0 ? "neutral" : "active"
    }
  ];
}

export function buildQuickActions(data, status = "success") {
  if (status !== "success") {
    return [
      {
        detail: "En cuanto el backend responda, mostraremos accesos con contexto real.",
        id: "quick-loading-01",
        title: "Sincronizando accesos"
      }
    ];
  }

  const { activities = [], activeTeachers = [], activeUsers = [] } = data;
  const estimatedRevenue = activities.reduce(
    (total, activity) => total + Number(activity.price || 0),
    0
  );

  return [
    {
      detail: `${numberFormatter.format(activeUsers.length)} usuarios activos disponibles para recepcion.`,
      id: "quick-01",
      title: "Usuarios listos para inscripcion"
    },
    {
      detail: `${numberFormatter.format(activities.length)} actividades futuras con ${formatCurrency(estimatedRevenue)} estimados.`,
      id: "quick-02",
      title: "Catalogo operativo"
    },
    {
      detail: `${numberFormatter.format(activeTeachers.length)} profesores activos preparados para nuevas sesiones.`,
      id: "quick-03",
      title: "Equipo docente activo"
    }
  ];
}
