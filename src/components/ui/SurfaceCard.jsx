import { classNames } from "../../utils/classNames";

export function SurfaceCard({ as: Component = "section", children, className }) {
  return <Component className={classNames("surface-card", className)}>{children}</Component>;
}
