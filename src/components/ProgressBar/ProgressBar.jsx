import { classNames } from "../../utils/classNames";
import "./ProgressBar.css";

function ProgressBarMeta({ label, value }) {
  return (
    <div className="progress-bar__meta">
      {label ? <span className="progress-bar__label">{label}</span> : <span />}
      <span className="progress-bar__value">{value}</span>
    </div>
  );
}

export function ProgressBar({
  className,
  label,
  max = 100,
  tone = "primary",
  value = 0,
  valueLabel,
  minValue = 10
}) {
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.min(Math.max(value, minValue), safeMax);
  const percentage = Math.round((clampedValue / safeMax) * 100);

  return (
    <div className={classNames("progress-bar", className)}>
      {label || valueLabel ? (
        <ProgressBarMeta
          label={label}
          value={valueLabel ?? `${percentage}%`}
        />
      ) : null}

      <div aria-hidden="true" className="progress-bar__track">
        <span
          className={classNames("progress-bar__fill", `progress-bar__fill--${tone}`)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
