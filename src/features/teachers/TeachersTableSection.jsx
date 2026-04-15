import { DataTable } from "../../components/ui/DataTable";
import { MetricCard } from "../../components/ui/MetricCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatDate } from "../../utils/formatters";
import { teachersOverview } from "./teachersData";

const statusMap = {
  active: {
    label: "Activo",
    tone: "active"
  },
  inactive: {
    label: "Inactivo",
    tone: "inactive"
  }
};

const columns = [
  {
    key: "name",
    label: "Profesor",
    render: (row) => (
      <div className="table-identity">
        <strong>{row.name}</strong>
        <span>Alta en sistema: {formatDate(row.joinedAt)}</span>
      </div>
    )
  },
  {
    key: "specialties",
    label: "Especialidades",
    render: (row) => (
      <div className="chip-list">
        {row.specialties.map((specialty) => (
          <span className="chip" key={specialty}>
            {specialty}
          </span>
        ))}
      </div>
    )
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

export function TeachersTableSection() {
  return (
    <div className="records-layout">
      <div className="records-layout__summary">
        <MetricCard
          label="Profesores activos"
          meta="Disponibles para asignar"
          tone="primary"
          value="3"
        />
        <MetricCard
          label="Profesores inactivos"
          meta="No asignables por reglas de negocio"
          tone="neutral"
          value="1"
        />
      </div>

      <DataTable columns={columns} rows={teachersOverview} />
    </div>
  );
}
