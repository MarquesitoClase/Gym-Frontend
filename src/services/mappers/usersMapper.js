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
      id: "total-members",
      label: "Socios totales",
      meta,
      tone: "primary",
      value: "--"
    },
    {
      id: "active-members",
      label: "Activos ahora",
      meta,
      tone: "accent",
      value: "--"
    },
    {
      id: "renewals-soon",
      label: "Socios inactivos",
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

export function buildUsersSummaryMetrics(rows, status = "success") {
  if (status === "loading") {
    return createPlaceholderMetrics("Cargando datos reales");
  }

  if (status === "error") {
    return createPlaceholderMetrics("Sin conexion con backend");
  }

  const totalMembers = rows.length;
  const activeMembers = rows.filter((row) => row.isEnabled).length;
  const inactiveMembers = totalMembers - activeMembers;
  const retention = totalMembers ? (activeMembers / totalMembers) * 100 : 0;
  const activeRatio = totalMembers ? activeMembers / totalMembers : 0;

  return [
    {
      id: "total-members",
      label: "Socios totales",
      meta: `${numberFormatter.format(totalMembers)} registros en el sistema`,
      tone: "primary",
      value: numberFormatter.format(totalMembers)
    },
    {
      id: "active-members",
      label: "Activos ahora",
      meta: `${percentFormatter.format(activeRatio)} del total operativo`,
      tone: "accent",
      value: numberFormatter.format(activeMembers)
    },
    {
      id: "renewals-soon",
      label: "Socios inactivos",
      meta: inactiveMembers
        ? `${numberFormatter.format(inactiveMembers)} perfiles sin acceso activo`
        : "Todos los socios estan activos",
      tone: "warning",
      value: numberFormatter.format(inactiveMembers)
    }
  ];
}
