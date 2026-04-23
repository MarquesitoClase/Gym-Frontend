import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarCell } from "../../components/AvatarCells/AvatarCell";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { Icon } from "../../components/Icon/Icon";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { StatCard } from "../../components/StatCard/StatCard";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard";
import { ClassRosterModal } from "../activities/ClassRosterModal";
import { useI18n } from "../../i18n/I18nContext";
import {
  activitiesService,
  enrollmentsService,
  teachersService,
  usersService
} from "../../services";
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

export function DashboardOverview() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [rosterActivityId, setRosterActivityId] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    activities: [],
    activeTeachers: [],
    activeUsers: [],
    enrollments: [],
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
          users,
          activeUsers,
          teachers,
          activeTeachers,
          activities,
          enrollments
        ] = await Promise.all([
          usersService.list(),
          usersService.listActive(),
          teachersService.list(),
          teachersService.listActive(),
          activitiesService.list(),
          enrollmentsService.listAll().catch(() => [])
        ]);

        if (ignore) {
          return;
        }

        setDashboardData({
          activities,
          activeTeachers,
          activeUsers,
          enrollments,
          teachers,
          users
        });
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setErrorMessage(
          getApiErrorMessage(error, t("dashboard.errorFallback"))
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
    dashboardData.users[dashboardData.users.length - 1] ?? null;

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
              {t("dashboard.retry")}
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title={t("dashboard.errorTitle")}
        />
      </SurfaceCard>
    );
  }

  return (
    <div className="dashboard-view">
      <header className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <h1>{t("dashboard.heroTitle")}</h1>
          <p>{t("dashboard.heroSubtitle")}</p>
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
                label={metric.progressLabel ?? "Cobrado"}
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
              <h2>{t("dashboard.agendaTitle")}</h2>
            </div>
            <button
              className="dashboard-link-button"
              onClick={() => navigate("/actividades")}
              type="button"
            >
              {t("dashboard.agendaCta")}
            </button>
          </div>

          {upcomingActivities.length ? (
            <div className="dashboard-agenda__list">
              {upcomingActivities.slice(0, 4).map((activity) => (
                <article className="dashboard-agenda__item" key={activity.id}>
                  <div className="dashboard-agenda__time">
                    <span className="dashboard-agenda__time-hour">{activity.scheduleTime}</span>
                    <span className="dashboard-agenda__time-date">{activity.scheduleDate}</span>
                  </div>
                  <div className="dashboard-agenda__main">
                    <h3>{activity.name}</h3>
                    <p>{t("dashboard.sessionTeacher", { name: activity.teacher })}</p>
                  </div>
                  <div className="dashboard-agenda__side">
                    <span className="dashboard-agenda__occupancy">
                      {activity.enrolledLabel}
                    </span>
                    <span className="dashboard-agenda__metric">
                      {activity.metric}
                    </span>
                  </div>
                  <button
                    aria-label={`Ver inscritos en ${activity.name}`}
                    className="dashboard-agenda__cta"
                    onClick={() => setRosterActivityId(activity.id)}
                    type="button"
                  >
                    <Icon name="users" size={14} />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              description={t("dashboard.agendaEmptyDescription")}
              title={t("dashboard.agendaEmptyTitle")}
            />
          )}
        </SurfaceCard>

        <div className="dashboard-side">
          <SurfaceCard className="dashboard-quickactions">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>{t("dashboard.quickactionsTitle")}</h2>
                <p>{t("dashboard.quickactionsSubtitle")}</p>
              </div>
            </div>
            <div className="dashboard-quickactions__list">
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/usuarios")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="users" size={18} />
                </span>
                <div>
                  <strong>{t("dashboard.quickactionNewUser")}</strong>
                  <span>{t("dashboard.quickactionNewUserDesc")}</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/actividades")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="activities" size={18} />
                </span>
                <div>
                  <strong>{t("dashboard.quickactionNewActivity")}</strong>
                  <span>{t("dashboard.quickactionNewActivityDesc")}</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/inscripciones")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="enrollments" size={18} />
                </span>
                <div>
                  <strong>{t("dashboard.quickactionNewEnrollment")}</strong>
                  <span>{t("dashboard.quickactionNewEnrollmentDesc")}</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
              <button
                className="dashboard-quickactions__item"
                onClick={() => navigate("/profesores")}
                type="button"
              >
                <span className="dashboard-quickactions__icon">
                  <Icon name="teachers" size={18} />
                </span>
                <div>
                  <strong>{t("dashboard.quickactionNewTeacher")}</strong>
                  <span>{t("dashboard.quickactionNewTeacherDesc")}</span>
                </div>
                <Icon name="chevron" size={14} />
              </button>
            </div>
          </SurfaceCard>

          <SurfaceCard className="dashboard-frontdesk">
            <div className="dashboard-panel__header dashboard-panel__header--compact">
              <div>
                <h2>{t("dashboard.frontdeskTitle")}</h2>
              </div>
            </div>

            {receptionUser ? (
              <>
                <div className="dashboard-frontdesk__entry">
                  <AvatarCell
                    imageUrl={receptionUser.imageUrl}
                    subtitle={
                      receptionUser.registrationYear
                        ? t("dashboard.frontdeskRegistration", { year: receptionUser.registrationYear })
                        : t("dashboard.frontdeskRegistrationRecent")
                    }
                    title={[receptionUser.firstName, receptionUser.lastName].filter(Boolean).join(" ")}
                  />
                  <StatusBadge
                    label={receptionUser.active ? t("dashboard.statusActive") : t("dashboard.statusInactive")}
                    tone={receptionUser.active ? "active" : "inactive"}
                  />
                </div>
                <p className="dashboard-frontdesk__note">
                  {t(
                    dashboardData.users.length === 1
                      ? "dashboard.frontdeskNoteOne"
                      : "dashboard.frontdeskNoteMany",
                    {
                      count: dashboardData.users.length,
                      active: dashboardData.activeUsers.length
                    }
                  )}
                </p>
              </>
            ) : (
              <EmptyState
                description={t("dashboard.frontdeskEmptyDescription")}
                title={t("dashboard.frontdeskEmptyTitle")}
              />
            )}
          </SurfaceCard>
        </div>
      </div>

      {rosterActivityId ? (
        <ClassRosterModal
          activityId={rosterActivityId}
          onClose={() => setRosterActivityId(null)}
        />
      ) : null}
    </div>
  );
}
