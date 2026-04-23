import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard";
import { useT } from "../../i18n/useT";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import {
  buildCatalogHighlights,
  mapActivitiesCatalog
} from "../../services/mappers/activitiesMapper";
import { ActivityCard } from "./ActivityCard";

export function ActivityCatalog({
  onEditRequest,
  refreshToken = 0
}) {
  const t = useT();
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [requestState, setRequestState] = useState("loading");
  const [teachers, setTeachers] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      setRequestState("loading");
      setErrorMessage("");

      try {
        const [activitiesResponse, teachersResponse] = await Promise.all([
          activitiesService.list(),
          teachersService.list()
        ]);

        if (ignore) {
          return;
        }

        setActivities(activitiesResponse);
        setTeachers(teachersResponse);
        setRequestState("success");
      } catch (error) {
        if (ignore) {
          return;
        }

        setActivities([]);
        setTeachers([]);
        setErrorMessage(
          getApiErrorMessage(error, t.noSePudieronCargarActividades)
        );
        setRequestState("error");
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [reloadKey, refreshToken, t.noSePudieronCargarActividades]);

  const catalogHighlights = useMemo(
    () => buildCatalogHighlights(activities, teachers, requestState),
    [activities, requestState, teachers]
  );
  const activitiesCatalog = useMemo(() => {
    const all = mapActivitiesCatalog(activities, teachers);
    if (!query) return all;
    return all.filter((a) =>
      [a.title, a.teacher, a.category]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query))
    );
  }, [activities, teachers, query]);

  const featuredActivities = activitiesCatalog.slice(0, 4);
  const remainingActivities = activitiesCatalog.slice(4);
  const hasCatalogResults =
    requestState === "success" && activitiesCatalog.length > 0;

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  const fallbackContent =
    requestState === "loading" ? (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description={t.cargandoActividadesDesc}
          icon="search"
          title={t.cargandoActividades}
        />
      </SurfaceCard>
    ) : requestState === "error" ? (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          action={
            <Button onClick={handleRetry} size="sm" variant="secondary">
              {t.reintentar}
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title={t.noSePudoCargarCatalogo}
        />
      </SurfaceCard>
    ) : activitiesCatalog.length ? (
      activitiesCatalog.map((activity) => (
        <ActivityCard
          activity={activity}
          key={activity.id}
          onEditRequest={onEditRequest}
        />
      ))
    ) : (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description={t.sinActividadesDesc}
          title={t.sinActividades}
        />
      </SurfaceCard>
    );

  return (
    <div className="activities-catalog">
      <div className="activities-catalog__top">
        {hasCatalogResults
          ? featuredActivities.map((activity) => (
              <ActivityCard
                activity={activity}
                className="activity-card--catalog-top"
                key={activity.id}
                onEditRequest={onEditRequest}
              />
            ))
          : fallbackContent}
      </div>

      {hasCatalogResults ? (
        <div className="activities-catalog__bottom">
          <SurfaceCard className="activities-insights">
            <div className="panel-header">
              <div>
                <h2 className="panel-title">{t.catalogoInsights}</h2>
              </div>
            </div>

            <div className="activities-summary__grid">
              {catalogHighlights.map((item) => (
                <div className="highlight-card" key={item.id}>
                  <span className="highlight-card__label">{item.label}</span>
                  <strong className="highlight-card__value">{item.value}</strong>
                  <span className="highlight-card__meta">{item.meta}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>

          {remainingActivities.map((activity) => (
            <ActivityCard
              activity={activity}
              className="activity-card--catalog-bottom"
              key={activity.id}
              onEditRequest={onEditRequest}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
