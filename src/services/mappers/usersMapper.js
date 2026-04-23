const numberFormatter = new Intl.NumberFormat("es-ES");
const percentFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 0,
  style: "percent"
});

const usersI18nFallback = {
  totalMembers: "Socios totales",
  activeNow: "Activos ahora",
  inactiveMembers: "Socios inactivos",
  loadingRealData: "Cargando datos reales",
  noBackend: "Sin conexion con backend",
  recordsInSystem: "registros en el sistema",
  totalOperational: "del total operativo",
  noActiveAccess: "perfiles sin acceso activo",
  allActive: "Todos los socios estan activos"
};

function buildFullName(firstName = "", lastName = "") {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function createPlaceholderMetrics(meta, i18n) {
  return [
    {
      id: "total-members",
      label: i18n.totalMembers,
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "active-members",
      label: i18n.activeNow,
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "renewals-soon",
      label: i18n.inactiveMembers,
      meta,
      tone: "warning",
      value: "--"
    }
  ];
}

export function mapUserDtoToRow(user) {
  const name = buildFullName(user.firstName, user.lastName);

  return {
    avatarUrl: user.imageUrl ?? null,
    enrollmentYear: user.registrationYear,
    id: user.id,
    identifier: user.dni,
    isEnabled: Boolean(user.active),
    name,
    status: user.active ? "active" : "inactive",
    subtitle: user.registrationYear
      ? `Alta ${user.registrationYear}`
      : `ID interno ${user.id}`
  };
}

export function buildUsersSummaryMetrics(rows, status = "success", i18n = {}) {
  const labels = { ...usersI18nFallback, ...i18n };

  if (status === "loading") {
    return createPlaceholderMetrics(labels.loadingRealData, labels);
  }

  if (status === "error") {
    return createPlaceholderMetrics(labels.noBackend, labels);
  }

  const totalMembers = rows.length;
  const activeMembers = rows.filter((row) => row.isEnabled).length;
  const inactiveMembers = totalMembers - activeMembers;
 // const retention = totalMembers ? (activeMembers / totalMembers) * 100 : 0;
  const activeRatio = totalMembers ? activeMembers / totalMembers : 0;

  return [
    {
      id: "total-members",
      label: labels.totalMembers,
      meta: `${numberFormatter.format(totalMembers)} ${labels.recordsInSystem}`,
      tone: "primary",
      value: numberFormatter.format(totalMembers)
    },
    {
      id: "active-members",
      label: labels.activeNow,
      meta: `${percentFormatter.format(activeRatio)} ${labels.totalOperational}`,
      tone: "accent",
      value: numberFormatter.format(activeMembers)
    },
    {
      id: "renewals-soon",
      label: labels.inactiveMembers,
      meta: inactiveMembers
        ? `${numberFormatter.format(inactiveMembers)} ${labels.noActiveAccess}`
        : labels.allActive,
      tone: "warning",
      value: numberFormatter.format(inactiveMembers)
    }
  ];
}
