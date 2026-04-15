import { DataTable } from "../../components/ui/DataTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { formatDateTime } from "../../utils/formatters";
import {
  availableActivities,
  recentEnrollments,
  validationChecklist
} from "./enrollmentsData";

const enrollmentStatusMap = {
  confirmed: {
    label: "Confirmada",
    tone: "active"
  },
  pending: {
    label: "Pendiente",
    tone: "pending"
  }
};

const columns = [
  {
    key: "user",
    label: "Usuario"
  },
  {
    key: "activity",
    label: "Actividad"
  },
  {
    key: "schedule",
    label: "Fecha",
    render: (row) => formatDateTime(row.schedule)
  },
  {
    align: "end",
    key: "status",
    label: "Estado",
    render: (row) => (
      <StatusBadge
        label={enrollmentStatusMap[row.status].label}
        tone={enrollmentStatusMap[row.status].tone}
      />
    )
  }
];

export function EnrollmentWorkspace() {
  return (
    <div className="enrollment-layout">
      <div className="enrollment-layout__primary">
        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Nueva inscripción</h2>
              <p className="panel-description">
                Panel base preparado para búsqueda real contra API externa.
              </p>
            </div>
            <StatusBadge label="Preparado" tone="neutral" />
          </div>

          <label className="search-field">
            <span className="search-field__label">Buscar usuario</span>
            <div className="search-field__control">
              <Icon name="search" size={18} />
              <input placeholder="Nombre, correo o DNI" type="search" />
            </div>
          </label>

          <EmptyState
            description="La selección real del usuario y la validación del backend aparecerán aquí."
            icon="users"
            title="Sin usuario seleccionado"
          />
        </SurfaceCard>

        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Actividades disponibles</h2>
              <p className="panel-description">
                Sesiones rápidas para operar desde recepción.
              </p>
            </div>
          </div>

          <div className="stack-list">
            {availableActivities.map((activity) => (
              <div className="stack-list__item" key={activity.id}>
                <div>
                  <strong>{activity.title}</strong>
                  <p>
                    {activity.schedule} · {activity.teacher}
                  </p>
                </div>
                <StatusBadge label={activity.occupancy} tone="active" />
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="enrollment-layout__secondary">
        <SurfaceCard className="enrollment-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Validaciones de backend</h2>
              <p className="panel-description">
                Reglas reservadas para la futura integración con Spring Boot.
              </p>
            </div>
          </div>

          <div className="validation-list">
            {validationChecklist.map((rule) => (
              <div className="validation-list__item" key={rule.id}>
                <div>
                  <strong>{rule.label}</strong>
                  <p>{rule.text}</p>
                </div>
                <StatusBadge label="Pendiente" tone={rule.state} />
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="enrollment-layout__full">
        <DataTable
          columns={columns}
          emptyState={
            <EmptyState
              description="Las inscripciones recientes aparecerán aquí en cuanto llegue la capa de datos real."
              title="Sin historial reciente"
            />
          }
          rows={recentEnrollments}
        />
      </div>
    </div>
  );
}
