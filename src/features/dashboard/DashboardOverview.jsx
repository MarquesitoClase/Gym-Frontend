import { MetricCard } from "../../components/ui/MetricCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import {
  dashboardMetrics,
  quickActions,
  receptionUpdates,
  upcomingActivities
} from "./dashboardData";

export function DashboardOverview() {
  return (
    <div className="dashboard-layout">
      <div className="metrics-grid">
        {dashboardMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            tone={metric.tone}
            value={metric.value}
          />
        ))}
      </div>

      <div className="dashboard-panels">
        <SurfaceCard className="dashboard-panel dashboard-panel--agenda">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Agenda operativa</h2>
              <p className="panel-description">
                Bloques prioritarios de la jornada para recepción.
              </p>
            </div>
            <StatusBadge label="Vista actual" tone="active" />
          </div>

          <div className="agenda-list">
            {upcomingActivities.map((activity) => (
              <div className="agenda-list__item" key={activity.id}>
                <div className="agenda-list__main">
                  <strong>{activity.name}</strong>
                  <span>{activity.teacher}</span>
                </div>
                <div className="agenda-list__meta">
                  <span>{activity.schedule}</span>
                  <span>{activity.spots}</span>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Avisos operativos</h2>
              <p className="panel-description">
                Puntos que deben conectarse más adelante con reglas reales de backend.
              </p>
            </div>
          </div>

          <div className="stack-list">
            {receptionUpdates.map((item) => (
              <div className="stack-list__item" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <StatusBadge
                  label={item.tone === "inactive" ? "Bloqueo" : "Seguimiento"}
                  tone={item.tone}
                />
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Accesos rápidos de recepción</h2>
            <p className="panel-description">
              Atajos de navegación pensados para el flujo diario.
            </p>
          </div>
        </div>

        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div className="quick-action-card" key={action.id}>
              <strong>{action.title}</strong>
              <p>{action.detail}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
