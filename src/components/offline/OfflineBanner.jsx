import { Link, useLocation } from "react-router-dom";
import { useOfflineMesh } from "../../contexts/OfflineMeshContext";
import { isAdminPath } from "../../utils/adminPath";
import styles from "./OfflineBanner.module.css";

export default function OfflineBanner() {
  const { pathname } = useLocation();
  const { online, swReady } = useOfflineMesh();
  if (isAdminPath(pathname)) return null;
  if (online) return null;
  return (
    <div className={styles.bar} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden />
      <span className={styles.text}>
        Offline moddasın — içerikler cihazından okunuyor. Daha önce açtığın alanlar kullanılabilir.
      </span>
      {!swReady ? (
        <span className={styles.sub}>Servis çalışanı yükleniyor…</span>
      ) : null}
      <Link className={styles.link} to="/sanri-ag">
        Sanrı Ağı
      </Link>
    </div>
  );
}
