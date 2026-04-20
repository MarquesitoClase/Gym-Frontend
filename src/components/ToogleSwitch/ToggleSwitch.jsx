import { classNames } from "../../utils/classNames";
import "./ToggleSwitch.css";

export function ToggleSwitch({
  checked = false,
  className,
  disabled = false,
  label,
  onChange
}) {
  const handleClick = () => {
    if (disabled) {
      return;
    }

    onChange?.(!checked);
  };

  return (
    <button
      aria-checked={checked}
      className={classNames(
        "toggle-switch",
        checked && "is-checked",
        disabled && "is-disabled",
        className
      )}
      onClick={handleClick}
      role="switch"
      type="button"
    >
      {label ? <span className="toggle-switch__label">{label}</span> : null}
      <span className="toggle-switch__track">
        <span className="toggle-switch__thumb" />
      </span>
    </button>
  );
}
