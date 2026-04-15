import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { MetricCard } from "../../components/ui/MetricCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { activitiesService, teachersService, usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildDashboardMetrics,
  buildQuickActions,
  buildReceptionUpdates,
  buildUpcomingActivities
} from "../../services/mappers/dashboardMapper";

export function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState({
    activities: [],
    activeTeachers: [],
    activeUsers: [],
    teachers: [],
    users: []
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const [
          usersResponse,
          activeUsersResponse,
          teachersResponse,
          activeTeachersResponse,
          activitiesResponse
        ] = await Promise.all([
          usersService.list(),
          usersService.listActive(),
          teachersService.list(),
          teachersService.listActive(),
          activitiesService.list()
        ]);

        if (ignore) {
          return;
        }

        setDashboardData({
          activities: activitiesResponse,
          activeTeachers: activeTeachersResponse,
          activeUsers: activeUsersResponse,
          teachers: teachersResponse,
          users: usersResponse
        });
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setDashboardData({
          activities: [],
          activeTeachers: [],
          activeUsers: [],
          teachers: [],
          users: []
        });
        setErrorMessage(
          getApiErrorMessage(error, "No se pudo cargar el dashboard.")
        );
        setRequestState("error");
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const dashboardMetrics = useMemo(
    () => buildDashboardMetrics(dashboardData, requestState),
    [dashboardData, requestState]
  );
  const upcomingActivities = useMemo(
    () => buildUpcomingActivities(dashboardData.activities, dashboardData.teachers),
    [dashboardData.activities, dashboardData.teachers]
  );
  const receptionUpdates = useMemo(
    () => buildReceptionUpdates(dashboardData, requestState),
    [dashboardData, requestState]
  );
  const quickActions = useMemo(
    () => buildQuickActions(dashboardData, requestState),
    [dashboardData, requestState]
  );

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  if (requestState === "loading") {
    return <LoadingState lines={5} />;
  }

  if (requestState === "error") {
    return (
      <SurfaceCard className="dashboard-panel">
        <EmptyState
          action={
            <Button onClick={handleRetry} size="sm" variant="secondary">
              Reintentar
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title="No se pudo cargar el panel principal"
        />
      </SurfaceCard>
    );
  }

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
                Proximas actividades futuras recuperadas desde el backend real.
              </p>
            </div>
            <StatusBadge label="Datos reales" tone="active" />
          </div>

          {upcomingActivities.length ? (
            <div className="agenda-list">
              {upcomingActivities.map((activity) => (
                <div className="agenda-list__item" key={activity.id}>
                  <div className="agenda-list__main">
                    <strong>{activity.name}</strong>
                    <span>{activity.teacher}</span>
                  </div>
                  <div className="agenda-list__meta">
                    <span>{activity.schedule}</span>
                    <span>{activity.metric}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              description="No hay actividades futuras publicadas por el backend en este momento."
              title="Agenda sin sesiones"
            />
          )}
        </SurfaceCard>

        <SurfaceCard className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Avisos operativos</h2>
              <p className="panel-description">
                Resumen rapido a partir del estado real de usuarios, profesores y catalogo.
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
                  label={
                    item.tone === "inactive"
                      ? "Bloqueo"
                      : item.tone === "attention"
                      ? "Revision"
                      : "Correcto"
                  }
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
            <h2 className="panel-title">Accesos rapidos de recepcion</h2>
            <p className="panel-description">
              Bloques de lectura basados en el estado actual del gimnasio.
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
