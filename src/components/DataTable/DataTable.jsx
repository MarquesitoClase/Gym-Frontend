import { classNames } from "../../utils/classNames";
import { EmptyState } from "../EmptyState/EmptyState";
import { SurfaceCard } from "../SurfaceCard/SurfaceCard";

function renderCell(column, row) {
  if (typeof column.render === "function") {
    return column.render(row);
  }

  return row[column.key];
}

export function DataTable({
  caption,
  className,
  columns,
  emptyState,
  footer,
  header,
  rowKey = "id",
  rows
}) {
  const content = rows.length ? (
    <div className="table-shell__scroll">
      <table className="data-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={classNames(
                  "data-table__head",
                  column.align === "end" && "data-table__head--end"
                )}
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="data-table__row" key={row[rowKey]}>
              {columns.map((column) => (
                <td
                  className={classNames(
                    "data-table__cell",
                    column.align === "end" && "data-table__cell--end"
                  )}
                  key={column.key}
                >
                  {renderCell(column, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    emptyState ?? (
      <EmptyState
        description="Todavia no hay datos disponibles para este bloque."
        title="Sin registros"
      />
    )
  );

  return (
    <SurfaceCard className={classNames("table-shell", className)}>
      {header ? <div className="table-shell__header">{header}</div> : null}
      {content}
      {footer ? <div className="table-shell__footer">{footer}</div> : null}
    </SurfaceCard>
  );
}
