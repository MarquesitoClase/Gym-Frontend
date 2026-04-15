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
import { ToggleSwitch } from "../../components/ui/ToggleSwitch";
import {
  usersDirectoryTotal,
  usersOverview,
  usersSummaryMetrics
} from "./usersData";
import "./UsersTableSection.css";

const PAGE_SIZE = 4;
const usersDirectoryFormatter = new Intl.NumberFormat("es-ES");

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

export function UsersTableSection() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(usersOverview);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [currentPage, rows]);

  const handleToggle = (userId, nextChecked) => {
    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.id !== userId) {
          return row;
        }

        return {
          ...row,
          isEnabled: nextChecked,
          status: nextChecked
            ? row.reviewRequired
              ? "attention"
              : "active"
            : "inactive"
        };
      })
    );
  };

  const columns = [
    {
      key: "member",
      label: "Socio",
      render: (row) => (
        <AvatarCell
          imageUrl={row.avatarUrl}
          subtitle={row.email}
          title={row.name}
        />
      ),
      width: "36%"
    },
    {
      key: "identifier",
      label: "DNI / ID"
    },
    {
      key: "enrollmentYear",
      label: "Ano de alta"
    },
    {
      key: "status",
      label: "Estado",
      render: (row) => (
        <StatusBadge
          label={statusMap[row.status].label}
          tone={statusMap[row.status].tone}
        />
      )
    },
    {
      align: "end",
      key: "actions",
      label: "Acciones",
      render: (row) => (
        <div className="users-actions">
          <ToggleSwitch
            checked={row.isEnabled}
            label={row.isEnabled ? "Activo" : "Pausado"}
            onChange={(nextChecked) => handleToggle(row.id, nextChecked)}
          />
          <button
            aria-label={`Editar a ${row.name}`}
            className="users-action-button"
            type="button"
          >
            <Icon name="edit" size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="users-section">
      <div className="users-section__summary">
        {usersSummaryMetrics.map((metric) => (
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
        className="users-directory"
        columns={columns}
        emptyState={
          <EmptyState
            description="Cuando la API este conectada, el listado de socios aparecera aqui."
            title="Todavia no hay socios"
          />
        }
        footer={
          <div className="users-directory__footer">
            <span className="users-directory__meta">
              Mostrando {paginatedRows.length} de{" "}
              {usersDirectoryFormatter.format(usersDirectoryTotal)} socios
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
              <div className="users-toolbar-actions">
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
            title="Listado de socios"
          />
        }
        rows={paginatedRows}
      />
    </div>
  );
}
