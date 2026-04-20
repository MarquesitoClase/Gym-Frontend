import { classNames } from "../../utils/classNames";
import "./AvatarCell.css";

function getInitials(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function AvatarCell({
  alt,
  className,
  imageUrl,
  subtitle,
  title
}) {
  const initials = getInitials(title);

  return (
    <div className={classNames("avatar-cell", className)}>
      <div className="avatar-cell__media">
        {imageUrl ? (
          <img alt={alt ?? title} className="avatar-cell__image" src={imageUrl} />
        ) : (
          <span className="avatar-cell__fallback">{initials}</span>
        )}
      </div>

      <div className="avatar-cell__content">
        <strong className="avatar-cell__title">{title}</strong>
        {subtitle ? <span className="avatar-cell__subtitle">{subtitle}</span> : null}
      </div>
    </div>
  );
}
