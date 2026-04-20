import { classNames } from "../../utils/classNames";

const variantClassMap = {
  primary: "button--primary",
  secondary: "button--secondary",
  ghost: "button--ghost"
};

const sizeClassMap = {
  sm: "button--sm",
  md: "button--md"
};

export function Button({
  children,
  className,
  fullWidth = false,
  iconLeft,
  iconRight,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={classNames(
        "button",
        variantClassMap[variant],
        sizeClassMap[size],
        fullWidth && "button--full-width",
        className
      )}
      type={type}
      {...props}
    >
      {iconLeft ? <span className="button__icon">{iconLeft}</span> : null}
      <span>{children}</span>
      {iconRight ? <span className="button__icon">{iconRight}</span> : null}
    </button>
  );
}
