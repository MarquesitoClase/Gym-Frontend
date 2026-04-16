import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarCell } from "../../components/ui/AvatarCell";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { LoadingState } from "../../components/ui/LoadingState";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { StatCard } from "../../components/ui/StatCard";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { activitiesService, teachersService, usersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildDashboardMetrics,
  buildUpcomingActivities
} from "../../services/mappers/dashboardMapper";

const metricIcons = {
  revenue: "activities",
  "teachers-active": "teachers",
  "users-active": "users"
};

function formatSessionCaption(activity) {
  return `Monitor ${activity.teacher}`;
}

export function DashboardOverview() {
  const navigate = useNavigate();
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
        const [users, activeUsers, teachers, activeTeachers, activities] =
          await Promise.all([
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
          activities,
          activeTeachers,
          activeUsers,
          teachers,
          users
        });
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(
            error,
            "No se pudo construir el panel principal con los datos reales."
          )
        );
        setRequestState("error");
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const metrics = useMemo(
    () => buildDashboardMetrics(dashboardData, requestState),
    [dashboardData, requestState]
  );
  const upcomingActivities = useMemo(
    () => buildUpcomingActivities(dashboardData.activities, dashboardData.teachers),
    [dashboardData.activities, dashboardData.teachers]
  );

  const receptionUser =
    dashboardData.activeUsers[0] ?? dashboardData.users[0] ?? null;

  if (requestState === "loading") {
    return <LoadingState lines={6} />;
  }

  if (requestState === "error") {
    return (
      <SurfaceCard className="dashboard-feedback">
        <EmptyState
          action={
            <Button
              onClick={() => setReloadKey((value) => value + 1)}
              size="sm"
              variant="secondary"
            >
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
    <div className="dashboard-view">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <h1>El motor cinetico</h1>
          <p>Vista operativa diaria del gimnasio en tiempo real.</p>
        </div>
      </header>

      <div className="dashboard-metrics">
        {metrics.map((metric) => (
          <StatCard
            badge={metric.badge}
            className={
              metric.id === "revenue"
                ? "dashboard-metric dashboard-metric--wide"
                : "dashboard-metric"
            }
            icon={<Icon name={metricIcons[metric.id] ?? "dashboard"} size={18} />}
            key={metric.id}
            label={metric.label}
            meta={metric.meta}
            tone={metric.tone}
            value={metric.value}
          >
            {metric.id === "revenue" ? (
              <ProgressBar
                label="Objetivo mensual"
                tone="primary"
                value={metric.progress ?? 0}
                valueLabel={metric.targetLabel}
              />
            ) : null}
          </StatCard>
        ))}
      </div>

      <div className="dashboard-grid">
        <SurfaceCard className="dashboard-agenda">
          <div className="dashboard-panel__header">
            <div>
              <h2>Proximas actividades</h2>
            </div>
            <button
              className="dashboard-link-button"
              onClick={() => navigate("/actividades")}
              type="button"
            >
              Ver horario
            </button>
          </div>

          {upcomingActivities.length ? (
            <div className="dashboard-agenda__list">
              {upcomingActivities.slice(0, 4).map((activity) => (
                <article className="dashboard-agenda__item" key={activity.id}>
                  <div className="dashboard-agenda__time">
                    {activity.schedule.split(",")[1]?.trim() ?? activity.schedule}
                  </div>
                  <div className="dashboard-agenda__main">
                    <h3>{activity.name}</h3>
                    <p>{formatSessionCaption(activity)}</p>
                  </div>
                  <div className="dashboard-agenda__side">
                    <span className="dashboard-agenda__occupancy">
                      {activity.occupancyLabel}
                    </span>
                    <ProgressBar
                      className="dashboard-agenda__progress"
                      tone={activity.occupancyPercent >= 100 ? "warning" : "accent"}
                      value={activity.occupancyPercent}
                    />
                  </div>
                  <button
                    aria-label={`Abrir ${activity.name}`}
                    className="dashboard-agenda__cta"
                    onClick={() => navigate("/actividades")}
                    type="button"
                  >
                    <Icon name="edit" size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              description="No hay actividades futuras disponibles en el backend."
              title="Sin sesiones proximas"
            />
          )}
        </SurfaceCard>

        <div className="dashboard-side">
          <SurfaceCard className="dashboard-join-card">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>Alta instantanea</h2>
                <p>Registra un nuevo socio en menos de 30 segundos desde recepcion.</p>
              </div>
            </div>

            <div className="dashboard-join-card__field">
              <span>Nombre completo</span>
              <strong>Juan Perez</strong>
            </div>
            <div className="dashboard-join-card__field">
              <span>Plan de membresia</span>
              <strong>Titan Premium anual</strong>
            </div>

            <Button
              className="dashboard-join-card__button"
              fullWidth
              onClick={() => navigate("/inscripciones")}
            >
              Completar alta
            </Button>
          </SurfaceCard>

          <SurfaceCard className="dashboard-frontdesk">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>Modo recepcion</h2>
              </div>
              <button
                aria-label="Abrir inscripciones"
                className="dashboard-frontdesk__action"
                onClick={() => navigate("/inscripciones")}
                type="button"
              >
                <Icon name="enrollments" size={16} />
              </button>
            </div>

            {receptionUser ? (
              <>
                <div className="dashboard-frontdesk__entry">
                  <AvatarCell
                    imageUrl={receptionUser.imageUrl}
                    subtitle={`Alta ${receptionUser.registrationYear ?? "reciente"}`}
                    title={[receptionUser.firstName, receptionUser.lastName].filter(Boolean).join(" ")}
                  />
                  <StatusBadge label="Socio activo" tone="active" />
                </div>
                <p className="dashboard-frontdesk__note">
                  Listo para check-in desde recepcion o para registrar una nueva clase.
                </p>
              </>
            ) : (
              <EmptyState
                description="No hay usuarios activos disponibles para mostrar en recepcion."
                title="Sin usuarios activos"
              />
            )}
          </SurfaceCard>
        </div>
      </div>
    </div>
  );
}
