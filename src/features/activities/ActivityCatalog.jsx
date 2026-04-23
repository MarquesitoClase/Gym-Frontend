import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard";
import { activitiesService, teachersService } from "../../services";
import { getApiErrorMessage } from "../../services/http/getApiErrorMessage";
import { mapActivitiesCatalog } from "../../services/mappers/activitiesMapper";
import { ActivityCard } from "./ActivityCard";

export function ActivityCatalog({
  onEditRequest,
  onRosterRequest,
  refreshToken = 0
}) {
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
          getApiErrorMessage(error, "No se pudieron cargar las actividades.")
        );
        setRequestState("error");
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, [reloadKey, refreshToken]);

  const activitiesCatalog = useMemo(() => {
    const all = mapActivitiesCatalog(activities, teachers);
    if (!query) return all;
    return all.filter((a) =>
      [a.title, a.teacher, a.category]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query))
    );
  }, [activities, teachers, query]);

  const handleRetry = () => {
    setReloadKey((currentValue) => currentValue + 1);
  };

  if (requestState === "loading") {
    return (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description="Estamos consultando el backend para traer el catalogo futuro real."
          icon="search"
          title="Cargando actividades"
        />
      </SurfaceCard>
    );
  }

  if (requestState === "error") {
    return (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          action={
            <Button onClick={handleRetry} size="sm" variant="secondary">
              Reintentar
            </Button>
          }
          description={errorMessage}
          icon="warning"
          title="No se pudo cargar el catalogo"
        />
      </SurfaceCard>
    );
  }

  if (!activitiesCatalog.length) {
    return (
      <SurfaceCard className="activities-feedback-card">
        <EmptyState
          description="Todavia no hay actividades futuras publicadas en el backend."
          title="Sin actividades programadas"
        />
      </SurfaceCard>
    );
  }

  return (
    <div className="activities-catalog">
      {activitiesCatalog.map((activity) => (
        <ActivityCard
          activity={activity}
          key={activity.id}
          onEditRequest={onEditRequest}
          onRosterRequest={onRosterRequest}
        />
      ))}
    </div>
  );
}
