import { classNames } from "../../utils/classNames";
import "./FloatingActionButton.css";

export function FloatingActionButton({
  className,
  fixed = false,
  icon,
  label = "Accion rapida",
  showLabel = false,
  type = "button",
  ...props
}) {
  return (
    <button
      aria-label={label}
      className={classNames(
        "floating-action-button",
        fixed && "floating-action-button--fixed",
        className
      )}
      type={type}
      {...props}
    >
      <span className="floating-action-button__icon">{icon ?? "+"}</span>
      {showLabel ? (
        <span className="floating-action-button__label">{label}</span>
      ) : null}
    </button>
  );
}
