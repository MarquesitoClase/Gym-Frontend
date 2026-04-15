const numberFormatter = new Intl.NumberFormat("es-ES");
const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 0,
  style: "percent"
});

function buildFullName(firstName = "", lastName = "") {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function createPlaceholderMetrics(meta) {
  return [
    {
      id: "total-staff",
      label: "Total plantilla",
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "active-staff",
      label: "Profesores activos",
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "assigned-activities",
      label: "Actividades asignadas",
      meta,
      tone: "neutral",
      value: "--"
    },
    {
      id: "without-activities",
      label: "Sin actividades",
      meta,
      tone: "warning",
      value: "--"
    }
  ];
}

export function mapTeacherDtoToRow(teacher, activities = []) {
  const name = buildFullName(teacher.firstName, teacher.lastName);

  return {
    assignedActivities: activities.map((activity) => activity.title),
    avatarUrl: teacher.imageUrl ?? null,
    contractYear: teacher.contractYear,
    id: teacher.id,
    identifier: teacher.dni,
    name,
    status: teacher.active ? "active" : "inactive",
    subtitle: teacher.contractYear
      ? `Contratacion ${teacher.contractYear}`
      : `ID interno ${teacher.id}`
  };
}

export function buildTeachersSummaryMetrics(rows, status = "success") {
  if (status === "loading") {
    return createPlaceholderMetrics("Cargando equipo docente");
  }

  if (status === "error") {
    return createPlaceholderMetrics("Sin conexion con backend");
  }

  const totalTeachers = rows.length;
  const activeTeachers = rows.filter((row) => row.status === "active").length;
  const inactiveTeachers = totalTeachers - activeTeachers;
  const assignedActivities = rows.reduce(
    (total, row) => total + row.assignedActivities.length,
    0
  );
  const teachersWithActivities = rows.filter(
    (row) => row.assignedActivities.length > 0
  ).length;
  const coverage = totalTeachers ? teachersWithActivities / totalTeachers : 0;

  return [
    {
      id: "total-staff",
      label: "Total plantilla",
      meta: `${numberFormatter.format(totalTeachers)} perfiles en la base de datos`,
      tone: "primary",
      value: numberFormatter.format(totalTeachers)
    },
    {
      id: "active-staff",
      label: "Profesores activos",
      meta: `${numberFormatter.format(inactiveTeachers)} inactivos`,
      tone: "accent",
      value: numberFormatter.format(activeTeachers)
    },
    {
      id: "assigned-activities",
      label: "Actividades asignadas",
      meta: `${percentFormatter.format(coverage)} del equipo con clases`,
      tone: "neutral",
      value: numberFormatter.format(assignedActivities)
    },
    {
      id: "without-activities",
      label: "Sin actividades",
      meta: "Profesores sin sesiones asociadas",
      tone: "warning",
      value: numberFormatter.format(totalTeachers - teachersWithActivities)
    }
  ];
}
