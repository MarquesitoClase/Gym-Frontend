import { classNames } from "../../utils/classNames";
import "./ProgressBar.css";

export function ProgressBar({
  className,
  label,
  max = 100,
  tone = "primary",
  value = 0,
  valueLabel
}) {
  const safeMax = max > 0 ? max : 1;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = Math.round((clampedValue / safeMax) * 100);

  return (
    <div className={classNames("progress-bar", className)}>
      {label || valueLabel ? (
        <div className="progress-bar__meta">
          {label ? <span className="progress-bar__label">{label}</span> : <span />}
          <span className="progress-bar__value">{valueLabel ?? `${percentage}%`}</span>
        </div>
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
