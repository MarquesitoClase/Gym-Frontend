import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { classNames } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

const fallbackImageByTone = {
  boxing:
    "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&q=80",
  hiit:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  pilates:
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80",
  spinning:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  strength:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  yoga:
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80"
};

const activityStatusMap = {
  active: {
    label: "Activa",
    tone: "active"
  },
  inactive: {
    label: "Inactiva",
    tone: "inactive"
  }
};

export function ActivityCard({ activity, className, onEditRequest }) {
  const status = activityStatusMap[activity.status];
  const fallbackImage = fallbackImageByTone[activity.coverTone] ?? fallbackImageByTone.strength;
  const coverImage = activity.imageUrl || fallbackImage;
  const coverStyle = coverImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(10, 18, 32, 0.08) 0%, rgba(10, 18, 32, 0.18) 100%), url("${coverImage}")`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    : undefined;

  return (
    <SurfaceCard className={classNames("activity-card", className)}>
      <div
        className={classNames(
          "activity-card__cover",
          coverImage && "activity-card__cover--image",
          `activity-card__cover--${activity.coverTone}`
        )}
        style={coverStyle}
      >
        <StatusBadge label={status.label} tone={status.tone} />
        <div className="activity-card__cover-actions">
          <span />
          <button
            aria-label={`Editar ${activity.title}`}
            className="activity-card__edit-button"
            onClick={() => onEditRequest?.(activity.id)}
            type="button"
          >
            <Icon name="edit" size={16} />
          </button>
        </div>
      </div>

      <div className="activity-card__body">
        <div className="activity-card__copy">
          <div className="activity-card__heading">
            <h3>{activity.title}</h3>
            <strong>{formatCurrency(activity.price)}</strong>
          </div>

          <p className="activity-card__description">{activity.description}</p>
        </div>

        <div className="activity-card__meta">
          <div className="activity-card__meta-item">
            <Icon name="user" size={16} />
            <span>{activity.teacher}</span>
          </div>
          <div className="activity-card__sessions">
            {activity.sessions.map((session) => (
              <button
                aria-label={`Editar sesión del ${session.schedule}`}
                className="activity-card__session-chip activity-card__session-chip--editable"
                key={session.id}
                onClick={() => onEditRequest?.(session.id)}
                type="button"
              >
                <Icon name="calendar" size={13} />
                <span>{session.schedule}</span>
                {session.teacherName && session.teacherName !== activity.teacher ? (
                  <span className="activity-card__session-teacher">
                    <Icon name="user" size={11} />
                    {session.teacherName}
                  </span>
                ) : null}
                <span className="activity-card__session-count">
                  {session.enrolledCount}{" "}
                  {session.enrolledCount === 1 ? "inscrito" : "inscritos"}
                  <Icon name="edit" size={11} className="activity-card__session-edit-icon" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
