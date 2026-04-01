import { useMemo, useState } from "react";
import styles from "./AdminStyles.module.css";

function getCellValue(row, key) {
  if (row == null || key == null) return undefined;
  if (typeof key === "string" && key.includes(".")) {
    return key.split(".").reduce((acc, part) => (acc == null ? acc : acc[part]), row);
  }
  return row[key];
}

function compareValues(a, b) {
  if (a === b) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const sa = String(a).toLocaleLowerCase();
  const sb = String(b).toLocaleLowerCase();
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}

/**
 * @param {object} props
 * @param {Array<{ key: string, label: string, width?: string|number, render?: (row: object) => React.ReactNode }>} props.columns
 * @param {object[]} props.data
 * @param {(row: object, index: number) => void} [props.onRowClick]
 * @param {string} [props.emptyText]
 */
export default function DataTable({ columns = [], data = [], onRowClick, emptyText = "Kayıt yok" }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sortedData = useMemo(() => {
    if (!sortKey || !data.length) return data;
    const next = [...data];
    next.sort((ra, rb) => {
      const va = getCellValue(ra, sortKey);
      const vb = getCellValue(rb, sortKey);
      const c = compareValues(va, vb);
      return sortDir === "asc" ? c : -c;
    });
    return next;
  }, [data, sortKey, sortDir]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const clickable = typeof onRowClick === "function";

  if (!columns.length) {
    return null;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr>
            {columns.map((col) => {
              const active = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  className={`${styles.th} ${active ? styles.thActive : ""}`}
                  style={col.width != null ? { width: col.width } : undefined}
                  onClick={() => handleSort(col.key)}
                  scope="col"
                >
                  {col.label}
                  {active && (
                    <span className={styles.sortArrow} aria-hidden>
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {!sortedData.length ? (
            <tr className={styles.emptyRow}>
              <td colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr
                key={row.id != null ? String(row.id) : index}
                className={`${styles.tr} ${styles.trHover} ${clickable ? styles.trClickable : ""}`}
                onClick={clickable ? () => onRowClick(row, index) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row, index);
                        }
                      }
                    : undefined
                }
                tabIndex={clickable ? 0 : undefined}
                role={clickable ? "button" : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {typeof col.render === "function"
                      ? col.render(row)
                      : getCellValue(row, col.key) ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
