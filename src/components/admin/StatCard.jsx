import styles from "./AdminStyles.module.css";

const DEFAULT_ACCENT = "#c8a0ff";

/**
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {React.ReactNode} [props.sub]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.accent]
 */
export default function StatCard({ label, value, sub, icon, accent = DEFAULT_ACCENT }) {
  return (
    <div
      className={`${styles.statCard} ${styles.statAccent}`}
      style={{ "--accent": accent }}
    >
      {icon != null && <div className={styles.statIcon}>{icon}</div>}
      <div className={styles.statBody}>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
        {sub != null && sub !== "" && <div className={styles.statSub}>{sub}</div>}
      </div>
    </div>
  );
}
