import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AvatarCell } from "../../components/AvatarCells/AvatarCell";
import { Button } from "../../components/Button/Button";
import { DataTable } from "../../components/DataTable/DataTable";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { Pagination } from "../../components/Pagination/Pagination";
import { StatCard } from "../../components/StatCard/StatCard";
import { TableToolbar } from "../../components/TableToolbar/TableToolbar";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildTeachersSummaryMetrics,
  mapTeacherDtoToRow
} from "../../services/mappers/teachersMapper";
import "./TeachersTableSection.css";

const PAGE_SIZE = 4;
const teachersDirectoryFormatter = new Intl.NumberFormat("es-ES");

export function TeachersTableSection({ onEditRequest, refreshToken = 0 }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [rows, setRows] = useState([]);
  const [activeClassesCount, setActiveClassesCount] = useState(0);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  useEffect(() => {
    let ignore = false;

    async function loadTeachers() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const [teachers, futureActivities] = await Promise.all([
          teachersService.list(),
          activitiesService.list()
        ]);

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
        setActiveClassesCount(futureActivities.length);
        setPage(1);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setRows([]);
        setActiveClassesCount(0);
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
    () => buildTeachersSummaryMetrics(rows, requestState, activeClassesCount),
    [activeClassesCount, requestState, rows]
  );

  const filteredRows = useMemo(() => {
    if (!query) return rows;
    return rows.filter((r) =>
      [r.name, r.identifier]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query))
    );
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRows]);

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
      key: "assignedActivities",
      label: "Actividades asignadas",
      render: (row) => (
        <div className="teachers-chip-list">
          {row.assignedActivities.length ? (
            row.assignedActivities.map((activity, index) => (
              <span className="teachers-chip" key={`${activity}-${index}`}>
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
