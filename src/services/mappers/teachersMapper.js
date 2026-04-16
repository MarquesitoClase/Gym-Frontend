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
      id: "active-classes",
      label: "Clases activas",
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "avg-retention",
      label: "Retencion media",
      meta,
      tone: "neutral",
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
    return createPlaceholderMetrics("Cargando equipo de monitores");
  }

  if (status === "error") {
    return createPlaceholderMetrics("Sin conexion con backend");
  }

  const totalTeachers = rows.length;
  const activeTeachers = rows.filter((row) => row.status === "active").length;
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
      id: "active-classes",
      label: "Clases activas",
      meta: `${numberFormatter.format(activeTeachers)} monitores activos`,
      tone: "accent",
      value: numberFormatter.format(assignedActivities)
    },
    {
      id: "avg-retention",
      label: "Retencion media",
      meta: `${percentFormatter.format(coverage)} del equipo con clases`,
      tone: "neutral",
      value: `${Math.round(coverage * 100)}%`
    }
  ];
}
