import { classNames } from "../../utils/classNames";

export function PageContainer({ children, className }) {
  return <div className={classNames("page-container", className)}>{children}</div>;
}
