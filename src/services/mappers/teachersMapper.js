const numberFormatter = new Intl.NumberFormat("es-ES");
const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 0,
  style: "percent"
});

const teachersI18nFallback = {
  totalStaff: "Total plantilla",
  activeClasses: "Clases activas",
  avgRetention: "Retencion media",
  loadingTeam: "Cargando equipo de monitores",
  noBackend: "Sin conexion con backend",
  profilesInDb: "perfiles en la base de datos",
  activeInstructors: "monitores activos",
  teamWithClasses: "del equipo con clases"
};

function buildFullName(firstName = "", lastName = "") {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function createPlaceholderMetrics(meta, i18n) {
  return [
    {
      id: "total-staff",
      label: i18n.totalStaff,
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "active-classes",
      label: i18n.activeClasses,
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "avg-retention",
      label: i18n.avgRetention,
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

export function buildTeachersSummaryMetrics(rows, status = "success", i18n = {}) {
  const labels = { ...teachersI18nFallback, ...i18n };

  if (status === "loading") {
    return createPlaceholderMetrics(labels.loadingTeam, labels);
  }

  if (status === "error") {
    return createPlaceholderMetrics(labels.noBackend, labels);
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
      label: labels.totalStaff,
      meta: `${numberFormatter.format(totalTeachers)} ${labels.profilesInDb}`,
      tone: "primary",
      value: numberFormatter.format(totalTeachers)
    },
    {
      id: "active-classes",
      label: labels.activeClasses,
      meta: `${numberFormatter.format(activeTeachers)} ${labels.activeInstructors}`,
      tone: "accent",
      value: numberFormatter.format(assignedActivities)
    },
    {
      id: "avg-retention",
      label: labels.avgRetention,
      meta: `${percentFormatter.format(coverage)} ${labels.teamWithClasses}`,
      tone: "neutral",
      value: `${Math.round(coverage * 100)}%`
    }
  ];
}
