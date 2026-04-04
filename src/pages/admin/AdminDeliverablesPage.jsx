import React, { useCallback, useEffect, useState } from "react";
import { fetchAdminDeliverables } from "../../data/adminApi";
import styles from "./AdminDeliverablesPage.module.css";

function formatWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDeliverablesPage() {
  const [emailFilter, setEmailFilter] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminDeliverables({
        email: emailFilter.trim() || undefined,
        limit: 80,
      });
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || "Liste alınamadı");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [emailFilter]);

  useEffect(() => {
    load();
    // İlk liste; e-posta filtresi Yenile / Enter ile uygulanır
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sadece mount
  }, []);

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kişisel teslimatlar</h1>
        <p className={styles.sub}>
          Matrix Rol ve benzeri ürünlerde kullanıcıya özel metinler (<code>user_deliverables</code>).
        </p>
        <div className={styles.toolbar}>
          <input
            type="search"
            className={styles.input}
            placeholder="E-posta ile filtrele…"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <button type="button" className={styles.btn} onClick={load} disabled={loading}>
            {loading ? "Yükleniyor…" : "Yenile"}
          </button>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      {!loading && items.length === 0 && !error && (
        <div className={styles.empty}>Kayıt yok.</div>
      )}

      <ul className={styles.list}>
        {items.map((row) => {
          const p = row.payload || {};
          const sections = Array.isArray(p.sections) ? p.sections : [];
          const expanded = openId === row.id;
          return (
            <li key={row.id} className={styles.card}>
              <button
                type="button"
                className={styles.cardHead}
                onClick={() => setOpenId(expanded ? null : row.id)}
              >
                <span className={styles.cardIcon}>◈</span>
                <div className={styles.cardMeta}>
                  <div className={styles.cardTitle}>{row.title || row.card_title || "—"}</div>
                  <div className={styles.cardLine}>
                    <span>{row.email}</span>
                    {row.user_id != null && <span className={styles.uid}>user #{row.user_id}</span>}
                    <span className={styles.cid}>{row.content_id}</span>
                  </div>
                  <div className={styles.cardWhen}>{formatWhen(row.updated_at)}</div>
                </div>
                <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
              </button>
              {row.preview_text && <p className={styles.preview}>{row.preview_text}</p>}
              {row.price_note && <div className={styles.price}>{row.price_note}</div>}
              {expanded && (
                <div className={styles.body}>
                  {Array.isArray(p.summary_lines) && p.summary_lines.length > 0 && (
                    <div className={styles.summary}>
                      <div className={styles.summaryLabel}>Özet</div>
                      {p.summary_lines.map((line, i) => (
                        <p key={i} className={styles.summaryLine}>
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  {sections.map((s, i) => (
                    <article key={i} className={styles.section}>
                      <h3 className={styles.sectionH}>{s.heading}</h3>
                      <div className={styles.sectionBody}>
                        {String(s.body || "")
                          .split("\n")
                          .map((para, j) => (
                            <p key={j}>{para}</p>
                          ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
