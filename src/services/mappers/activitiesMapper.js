import { formatDateTime } from "../../utils/formatters";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  currency: "EUR",
  maximumFractionDigits: 0,
  style: "currency"
});

function buildTeacherMap(teachers) {
  return new Map(
    teachers.map((teacher) => [
      teacher.id,
      [teacher.firstName, teacher.lastName].filter(Boolean).join(" ")
    ])
  );
}

function getCoverTone(title = "", description = "") {
  const content = `${title} ${description}`.toLowerCase();

  if (content.includes("yoga") || content.includes("medit")) {
    return "yoga";
  }

  if (content.includes("spin") || content.includes("cicl")) {
    return "spinning";
  }

  if (
    content.includes("cross") ||
    content.includes("funcional") ||
    content.includes("strength")
  ) {
    return "strength";
  }

  if (content.includes("zumba") || content.includes("hiit") || content.includes("baile")) {
    return "hiit";
  }

  if (content.includes("pilates")) {
    return "pilates";
  }

  if (content.includes("box") || content.includes("fight")) {
    return "boxing";
  }

  return "strength";
}

function getCategory(title = "", description = "") {
  const content = `${title} ${description}`.toLowerCase();

  if (content.includes("yoga")) {
    return "Wellness";
  }

  if (content.includes("medit")) {
    return "Mindfulness";
  }

  if (content.includes("pilates")) {
    return "Pilates";
  }

  if (content.includes("spin") || content.includes("cicl")) {
    return "Cardio";
  }

  if (content.includes("zumba") || content.includes("baile")) {
    return "Dance";
  }

  if (content.includes("box")) {
    return "Boxing";
  }

  return "Strength";
}

export function mapActivityDtoToCard(activity, teacherNameById) {
  return {
    category: getCategory(activity.title, activity.description),
    coverTone: getCoverTone(activity.title, activity.description),
    description: activity.description,
    id: activity.id,
    imageUrl: activity.imageUrl ?? null,
    price: activity.price,
    schedule: formatDateTime(activity.date),
    status: "active",
    teacher:
      teacherNameById.get(activity.teacherId) ??
      `Profesor #${activity.teacherId}`,
    title: activity.title
  };
}

export function mapActivitiesCatalog(activities, teachers) {
  const teacherNameById = buildTeacherMap(teachers);
  return activities.map((activity) => mapActivityDtoToCard(activity, teacherNameById));
}

function createPlaceholderHighlights(meta) {
  return [
    {
      id: "highlight-01",
      label: "Actividad destacada",
      meta,
      value: "--"
    },
    {
      id: "highlight-02",
      label: "Ingresos previstos",
      meta,
      value: "--"
    },
    {
      id: "highlight-03",
      label: "Profesores con clases",
      meta,
      value: "--"
    }
  ];
}

export function buildCatalogHighlights(activities, teachers, status = "success") {
  if (status === "loading") {
    return createPlaceholderHighlights("Cargando datos del backend");
  }

  if (status === "error") {
    return createPlaceholderHighlights("Sin conexion con el backend");
  }

  if (!activities.length) {
    return [
      {
        id: "highlight-01",
        label: "Actividad destacada",
        meta: "Todavia no hay sesiones futuras",
        value: "Sin datos"
      },
      {
        id: "highlight-02",
        label: "Ingresos previstos",
        meta: "No hay actividades publicadas",
        value: currencyFormatter.format(0)
      },
      {
        id: "highlight-03",
        label: "Profesores con clases",
        meta: "Esperando actividad en el sistema",
        value: "0"
      }
    ];
  }

  const mostExpensive = [...activities].sort((left, right) => right.price - left.price)[0];
  const estimatedRevenue = activities.reduce(
    (total, activity) => total + Number(activity.price || 0),
    0
  );
  const activeTeacherCount = new Set(activities.map((activity) => activity.teacherId)).size;
  const teacherNameById = buildTeacherMap(teachers);

  return [
    {
      id: "highlight-01",
      label: "Actividad premium",
      meta: teacherNameById.get(mostExpensive.teacherId) ?? "Profesor asignado",
      value: mostExpensive.title
    },
    {
      id: "highlight-02",
      label: "Ingresos previstos",
      meta: `${activities.length} actividades futuras`,
      value: currencyFormatter.format(estimatedRevenue)
    },
    {
      id: "highlight-03",
      label: "Profesores con clases",
      meta: "Equipo con sesiones programadas",
      value: String(activeTeacherCount)
    }
  ];
}
