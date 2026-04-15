import { useMemo, useState } from "react";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { Pagination } from "../../components/ui/Pagination";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TableToolbar } from "../../components/ui/TableToolbar";
import { formatDate } from "../../utils/formatters";
import {
  teachersDirectoryTotal,
  teachersOverview,
  teachersSummaryMetrics
} from "./teachersData";
import "./TeachersTableSection.css";

const PAGE_SIZE = 4;
const teachersDirectoryFormatter = new Intl.NumberFormat("es-ES");

const statusMap = {
  active: {
    label: "Activo",
    tone: "active"
  },
  inactive: {
    label: "Baja",
    tone: "inactive"
  },
  on_leave: {
    label: "En permiso",
    tone: "neutral"
  }
};

export function TeachersTableSection() {
  const [page, setPage] = useState(1);
  const rows = teachersOverview;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [currentPage, rows]);

  const columns = [
    {
      key: "teacher",
      label: "Profesor",
      render: (row) => (
        <AvatarCell
          imageUrl={row.avatarUrl}
          subtitle={row.role}
          title={row.name}
        />
      ),
      width: "30%"
    },
    {
      key: "identifier",
      label: "DNI / ID"
    },
    {
      key: "joinedAt",
      label: "Alta",
      render: (row) => formatDate(row.joinedAt)
    },
    {
      key: "status",
      label: "Estado laboral",
      render: (row) => (
        <StatusBadge
          label={statusMap[row.status].label}
          tone={statusMap[row.status].tone}
        />
      )
    },
    {
      key: "assignedActivities",
      label: "Actividades asignadas",
      render: (row) => (
        <div className="teachers-chip-list">
          {row.assignedActivities.map((activity) => (
            <span className="teachers-chip" key={activity}>
              {activity}
            </span>
          ))}
        </div>
      )
    },
    {
      align: "end",
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <button
          aria-label={`Editar a ${row.name}`}
          className="teachers-action-button"
          type="button"
        >
          <Icon name="edit" size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="teachers-section">
      <div className="teachers-section__summary">
        {teachersSummaryMetrics.map((metric) => (
          <StatCard
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <DataTable
        className="teachers-directory"
        columns={columns}
        emptyState={
          <EmptyState
            description="Cuando la API este conectada, el listado del equipo docente aparecera aqui."
            title="Todavia no hay profesores"
          />
        }
        footer={
          <div className="teachers-directory__footer">
            <span className="teachers-directory__meta">
              Mostrando {paginatedRows.length} de{" "}
              {teachersDirectoryFormatter.format(teachersDirectoryTotal)} profesores
            </span>
            <Pagination
              onPageChange={setPage}
              page={currentPage}
              totalPages={totalPages}
            />
          </div>
        }
        header={
          <TableToolbar
            actions={
              <div className="teachers-toolbar-actions">
                <Button
                  iconLeft={<Icon name="filter" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Filtros
                </Button>
                <Button
                  iconLeft={<Icon name="download" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Exportar
                </Button>
              </div>
            }
            title="Listado de profesores"
          />
        }
        rows={paginatedRows}
      />
    </div>
  );
}
