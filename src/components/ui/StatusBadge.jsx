import { classNames } from "../../utils/classNames";

const toneClassMap = {
  active: "status-badge--active",
  attention: "status-badge--attention",
  inactive: "status-badge--inactive",
  neutral: "status-badge--neutral",
  pending: "status-badge--pending"
};

export function StatusBadge({ label, tone = "neutral" }) {
  return (
    <span className={classNames("status-badge", toneClassMap[tone])}>
      {label}
    </span>
  );
}
