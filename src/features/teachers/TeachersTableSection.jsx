import { useEffect, useMemo, useState } from "react";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { Pagination } from "../../components/ui/Pagination";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { TableToolbar } from "../../components/ui/TableToolbar";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildTeachersSummaryMetrics,
  mapTeacherDtoToRow
} from "../../services/mappers/teachersMapper";
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
  }
};

export function TeachersTableSection({ onEditRequest, refreshToken = 0 }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadTeachers() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const teachers = await teachersService.list();
        const mappedRows = await Promise.all(
          teachers.map(async (teacher) => {
            try {
              const assignedActivities = await activitiesService.listByTeacher(
                teacher.id
              );
              return mapTeacherDtoToRow(teacher, assignedActivities);
            } catch {
              return mapTeacherDtoToRow(teacher);
            }
          })
        );

        if (ignore) {
          return;
        }

        setRows(mappedRows);
        setPage(1);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setRows([]);
        setErrorMessage(
          getApiErrorMessage(error, "No se pudieron cargar los monitores.")
        );
        setRequestState("error");
      }
    }

    loadTeachers();

    return () => {
      ignore = true;
    };
  }, [reloadKey, refreshToken]);

  const summaryMetrics = useMemo(
    () => buildTeachersSummaryMetrics(rows, requestState),
    [requestState, rows]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [currentPage, rows]);

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const emptyState =
    requestState === "loading" ? (
      <EmptyState
        description="Estamos consultando la API para traer el equipo de monitores real."
        icon="search"
        title="Cargando monitores"
      />
    ) : requestState === "error" ? (
      <EmptyState
        action={
          <Button onClick={handleRetry} size="sm" variant="secondary">
            Reintentar
          </Button>
        }
        description={errorMessage}
        icon="warning"
        title="No se pudieron cargar los monitores"
      />
    ) : (
      <EmptyState
        description="Cuando lleguen registros desde la base de datos, el listado de monitores aparecera aqui."
        title="Todavia no hay monitores"
      />
    );

  const columns = [
    {
      key: "teacher",
      label: "Monitor",
      render: (row) => (
        <AvatarCell
          imageUrl={row.avatarUrl}
          subtitle={row.subtitle}
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
      key: "contractYear",
      label: "Ano de contratacion"
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
          {row.assignedActivities.length ? (
            row.assignedActivities.map((activity) => (
              <span className="teachers-chip" key={activity}>
                {activity}
              </span>
            ))
          ) : (
            <span className="teachers-chip teachers-chip--muted">
              Sin actividades
            </span>
          )}
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
          onClick={() => onEditRequest?.(row.id)}
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
        {summaryMetrics.map((metric) => (
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
        emptyState={emptyState}
        footer={
          requestState === "success" && rows.length ? (
            <div className="teachers-directory__footer">
              <span className="teachers-directory__meta">
                Mostrando {paginatedRows.length} de{" "}
                {teachersDirectoryFormatter.format(rows.length)} monitores
              </span>
              <Pagination
                onPageChange={setPage}
                page={currentPage}
                totalPages={totalPages}
              />
            </div>
          ) : null
        }
        header={
          <TableToolbar
            actions={
              <div className="teachers-toolbar-actions">
                <Button
                  disabled={requestState !== "success" || !rows.length}
                  iconLeft={<Icon name="filter" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Filtros
                </Button>
                <Button
                  disabled={requestState !== "success" || !rows.length}
                  iconLeft={<Icon name="download" size={16} />}
                  size="sm"
                  variant="ghost"
                >
                  Exportar
                </Button>
              </div>
            }
            title="Directorio de monitores"
          />
        }
        rows={requestState === "success" ? paginatedRows : []}
      />
    </div>
  );
}
