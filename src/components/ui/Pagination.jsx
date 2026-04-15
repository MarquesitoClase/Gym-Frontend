import { classNames } from "../../utils/classNames";
import "./Pagination.css";

function buildPages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const windowStart = Math.max(2, page - 1);
  const windowEnd = Math.min(totalPages - 1, page + 1);

  if (windowStart > 2) {
    pages.push("start-ellipsis");
  }

  for (let current = windowStart; current <= windowEnd; current += 1) {
    pages.push(current);
  }

  if (windowEnd < totalPages - 1) {
    pages.push("end-ellipsis");
  }

  pages.push(totalPages);
  return pages;
}

export function Pagination({
  className,
  onPageChange,
  page = 1,
  totalPages = 1
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPages(page, totalPages);

  return (
    <nav aria-label="Paginacion" className={classNames("pagination", className)}>
      <button
        className="pagination__button"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        type="button"
      >
        {"<"}
      </button>

      <div className="pagination__pages">
        {pages.map((item) => {
          if (typeof item === "string") {
            return (
              <span aria-hidden="true" className="pagination__ellipsis" key={item}>
                ...
              </span>
            );
          }

          return (
            <button
              aria-current={item === page ? "page" : undefined}
              className={classNames(
                "pagination__button",
                item === page && "is-active"
              )}
              key={item}
              onClick={() => onPageChange?.(item)}
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        className="pagination__button"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        type="button"
      >
        {">"}
      </button>
    </nav>
  );
}
