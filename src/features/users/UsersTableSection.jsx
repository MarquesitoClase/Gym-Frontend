import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { MetricCard } from "../../components/ui/MetricCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/formatters";
import { usersOverview } from "./usersData";

const statusMap = {
  active: {
    label: "Activo",
    tone: "active"
  },
  attention: {
    label: "Revisar",
    tone: "attention"
  },
  inactive: {
    label: "Inactivo",
    tone: "inactive"
  }
};

const columns = [
  {
    key: "name",
    label: "Usuario",
    render: (row) => (
      <div className="table-identity">
        <strong>{row.name}</strong>
        <span>{row.futureActivities} actividades futuras</span>
      </div>
    )
  },
  {
    key: "annualFee",
    label: "Cuota anual"
  },
  {
    key: "lastVisit",
    label: "Última visita",
    render: (row) => formatDate(row.lastVisit)
  },
  {
    align: "end",
    key: "status",
    label: "Estado",
    render: (row) => (
      <StatusBadge
        label={statusMap[row.status].label}
        tone={statusMap[row.status].tone}
      />
    )
  }
];

export function UsersTableSection() {
  return (
    <div className="records-layout">
      <div className="records-layout__summary">
        <MetricCard
          label="Usuarios con cuota al día"
          meta="Base operativa lista para filtrados"
          tone="primary"
          value="2"
        />
        <MetricCard
          label="Usuarios a revisar"
          meta="Bloqueados hasta validar pago"
          tone="warning"
          value="2"
        />
      </div>

      <DataTable
        columns={columns}
        emptyState={
          <EmptyState
            description="Cuando la API esté conectada, los usuarios aparecerán aquí."
            title="Todavía no hay usuarios"
          />
        }
        rows={usersOverview}
      />
    </div>
  );
}
