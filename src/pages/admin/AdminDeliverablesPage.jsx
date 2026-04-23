import React, { useCallback, useEffect, useState } from "react";
import {
  fetchAdminDeliverables,
  sendDeliverableEmail,
  sendAccessLinkEmail,
} from "../../data/adminApi";
import {
  buildAccessLink,
  buildAccessOnlyMailto,
  buildDeliverableEmail,
  buildDeliverableMailto,
} from "../../data/deliverableEmail";
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

/** mailto: linkini yeni sekmede açmak yerine aynı sekmede tetikler
 *  (tarayıcıların mailto'yu nerede açacağı OS ayarına bağlıdır). */
function openMailto(href) {
  if (!href) return;
  try {
    window.location.href = href;
  } catch {
    /* noop */
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function AdminDeliverablesPage() {
  const [emailFilter, setEmailFilter] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [flash, setFlash] = useState(null); // { id, kind: "ok"|"warn"|"err", text }

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

  const showFlash = useCallback((id, kind, text) => {
    setFlash({ id, kind, text });
    window.setTimeout(() => {
      setFlash((cur) => (cur && cur.id === id ? null : cur));
    }, 4500);
  }, []);

  const handleDraftFull = useCallback(
    (row) => {
      if (!row?.email) return;
      const href = buildDeliverableMailto({ row, email: row.email, lang: "tr" });
      openMailto(href);
      showFlash(row.id, "ok", "Mail istemcin açıldı — göndermeden önce göz at.");
    },
    [showFlash]
  );

  const handleDraftLinkOnly = useCallback(
    (row) => {
      if (!row?.email) return;
      const href = buildAccessOnlyMailto({
        email: row.email,
        contentId: row.content_id || "role_unlock",
        lang: "tr",
      });
      openMailto(href);
      showFlash(row.id, "ok", "Erişim linki taslağı hazır.");
    },
    [showFlash]
  );

  const handleCopyLink = useCallback(
    async (row) => {
      const link = buildAccessLink({
        email: row.email,
        contentId: row.content_id || "role_unlock",
      });
      const ok = await copyToClipboard(link);
      showFlash(
        row.id,
        ok ? "ok" : "warn",
        ok ? "Erişim linki panoya kopyalandı." : "Kopyalanamadı — elle al: " + link
      );
    },
    [showFlash]
  );

  const handleSendAuto = useCallback(
    async (row) => {
      if (!row?.id) return;
      setBusyId(row.id);
      try {
        const accessLink = buildAccessLink({
          email: row.email,
          contentId: row.content_id || "role_unlock",
        });
        await sendDeliverableEmail(row.id, { lang: "tr", access_link: accessLink });
        showFlash(row.id, "ok", "Müşteriye mail gönderildi.");
        load();
      } catch (e) {
        const msg = e?.message || "";
        const is404 = /404|not\s*found|bulunam/i.test(msg);
        showFlash(
          row.id,
          is404 ? "warn" : "err",
          is404
            ? "Backend otomatik gönderim henüz yayında değil — 'Mail Tasla' ile manuel gönder."
            : `Gönderilemedi: ${msg}`
        );
      } finally {
        setBusyId(null);
      }
    },
    [load, showFlash]
  );

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kişisel teslimatlar</h1>
        <p className={styles.sub}>
          Matrix Rol ve benzeri ürünlerde kullanıcıya özel metinler (<code>user_deliverables</code>).
          Her satırın yanındaki <b>Otomatik Gönder</b> backend transactional maili tetikler,
          <b> Mail Tasla</b> yerel mail istemcinde hazır bir taslak açar.
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
          const rowFlash = flash && flash.id === row.id ? flash : null;
          const sentAt = row.email_sent_at || p.email_sent_at;
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
                    {sentAt && (
                      <span className={styles.sentBadge} title="Son mail gönderimi">
                        ✉ {formatWhen(sentAt)}
                      </span>
                    )}
                  </div>
                  <div className={styles.cardWhen}>{formatWhen(row.updated_at)}</div>
                </div>
                <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
              </button>

              {row.preview_text && <p className={styles.preview}>{row.preview_text}</p>}
              {row.price_note && <div className={styles.price}>{row.price_note}</div>}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionPrimary}`}
                  disabled={!row.email || busyId === row.id}
                  onClick={() => handleSendAuto(row)}
                  title="Backend üzerinden müşteriye otomatik mail gönder"
                >
                  {busyId === row.id ? "Gönderiliyor…" : "Otomatik Gönder"}
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  disabled={!row.email}
                  onClick={() => handleDraftFull(row)}
                  title="Açılım + erişim linki ile mail taslağı aç"
                >
                  Mail Tasla (Açılım + Link)
                </button>
                <button
                  type="button"
                  className={styles.actionBtn}
                  disabled={!row.email}
                  onClick={() => handleDraftLinkOnly(row)}
                  title="Sadece erişim linki içeren mail taslağı aç"
                >
                  Sadece Link
                </button>
                <button
                  type="button"
                  className={styles.actionGhost}
                  disabled={!row.email}
                  onClick={() => handleCopyLink(row)}
                  title="Erişim linkini panoya kopyala"
                >
                  Link Kopyala
                </button>
              </div>

              {rowFlash && (
                <div
                  className={`${styles.flash} ${
                    rowFlash.kind === "err"
                      ? styles.flashErr
                      : rowFlash.kind === "warn"
                        ? styles.flashWarn
                        : styles.flashOk
                  }`}
                >
                  {rowFlash.text}
                </div>
              )}

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

                  <details className={styles.previewMail}>
                    <summary>Mail önizleme (müşteriye gidecek metin)</summary>
                    <MailPreview row={row} />
                  </details>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MailPreview({ row }) {
  const { subject, body, accessLink } = buildDeliverableEmail({
    row,
    email: row.email,
    lang: "tr",
  });
  return (
    <div className={styles.mailPreview}>
      <div className={styles.mailPreviewRow}>
        <span className={styles.mailPreviewLabel}>Kime</span>
        <span>{row.email || "—"}</span>
      </div>
      <div className={styles.mailPreviewRow}>
        <span className={styles.mailPreviewLabel}>Konu</span>
        <span>{subject}</span>
      </div>
      <div className={styles.mailPreviewRow}>
        <span className={styles.mailPreviewLabel}>Link</span>
        <a href={accessLink} target="_blank" rel="noopener noreferrer">
          {accessLink}
        </a>
      </div>
      <pre className={styles.mailPreviewBody}>{body}</pre>
    </div>
  );
}
