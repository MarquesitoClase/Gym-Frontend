import { Icon } from "../../components/ui/Icon";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SurfaceCard } from "../../components/ui/SurfaceCard";
import { classNames } from "../../utils/classNames";
import { formatCurrency } from "../../utils/formatters";

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

export function ActivityCard({ activity, onEditRequest }) {
  const status = activityStatusMap[activity.status];
  const coverStyle = activity.imageUrl
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.16) 0%, rgba(15, 23, 42, 0.5) 100%), url("${activity.imageUrl}")`
      }
    : undefined;

  return (
    <SurfaceCard className="activity-card">
      <div
        className={classNames(
          "activity-card__cover",
          activity.imageUrl && "activity-card__cover--image",
          `activity-card__cover--${activity.coverTone}`
        )}
        style={coverStyle}
      >
        <StatusBadge label={status.label} tone={status.tone} />
        <div className="activity-card__cover-actions">
          <span className="activity-card__cover-tag">{activity.category}</span>
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
        <div className="activity-card__heading">
          <h3>{activity.title}</h3>
          <strong>{formatCurrency(activity.price)}</strong>
        </div>

        <p className="activity-card__description">{activity.description}</p>

        <div className="activity-card__meta">
          <div className="activity-card__meta-item">
            <Icon name="calendar" size={16} />
            <span>{activity.schedule}</span>
          </div>
          <div className="activity-card__meta-item">
            <Icon name="user" size={16} />
            <span>{activity.teacher}</span>
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
