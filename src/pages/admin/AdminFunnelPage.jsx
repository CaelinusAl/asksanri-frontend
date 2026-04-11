import { useEffect, useState, useCallback } from "react";
import StatCard from "../../components/admin/StatCard";
import styles from "./AdminFunnelPage.module.css";
import { fetchFunnelStats, fetchWebhookLogs, fetchAccounting } from "../../data/adminApi";

const ROLE_STEPS = [
  { key: "page_view", label: "Sayfa Görüntüleme", icon: "👁" },
  { key: "form_start", label: "Form Başlatan", icon: "✎" },
  { key: "form_submit", label: "Formu Gönderen", icon: "✓" },
  { key: "free_result", label: "Ücretsiz Sonuç", icon: "◈" },
  { key: "lock_view", label: "Kilit Ekranı", icon: "🔒" },
  { key: "unlock_click", label: "Hatırla Tıklaması", icon: "⚡" },
  { key: "shopier_redirect", label: "Shopier Yönlendirme", icon: "🛒" },
  { key: "unlock_success", label: "Unlock Başarılı", icon: "✦" },
];

const RATE_LABELS = {
  view_to_form: "Görüntüleme → Form",
  form_to_submit: "Form → Gönderim",
  submit_to_result: "Gönderim → Sonuç",
  result_to_lock: "Sonuç → Kilit",
  lock_to_click: "Kilit → Tıklama",
  click_to_shopier: "Tıklama → Shopier",
  shopier_to_unlock: "Shopier → Unlock",
  overall: "Toplam Dönüşüm",
};

function rateColor(v) {
  if (v >= 50) return "#78f7d8";
  if (v >= 25) return "#c8a0ff";
  if (v >= 10) return "#ffd700";
  return "#ff6b6b";
}

const PRODUCT_LABELS = {
  role_unlock: "Matrix Rol Okuma",
  okuma_devami: "Okuma Devam\u0131",
  kod_giris_ders: "Kod Giri\u015f Ders",
  kod_egitmeni: "Kod E\u011fitmeni",
  kitap_112: "112. Kitap",
  ankod_unlock: "AN_KOD",
  subconscious_unlock: "Bilin\u00e7alt\u0131",
  iliski_acilimi: "\u0130li\u015fki A\u00e7\u0131l\u0131m\u0131",
  kariyer_acilimi: "Kariyer A\u00e7\u0131l\u0131m\u0131",
  genel_derin_acilim: "Genel Derin A\u00e7\u0131l\u0131m",
};

export default function AdminFunnelPage() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [webhookLogs, setWebhookLogs] = useState(null);
  const [productStats, setProductStats] = useState(null);

  const load = useCallback(async (d) => {
    setLoading(true);
    setErr("");
    try {
      const [res, wh, acc] = await Promise.all([
        fetchFunnelStats(d),
        fetchWebhookLogs(20).catch(() => null),
        fetchAccounting({ funnel_days: d }).catch(() => null),
      ]);
      setData(res);
      setWebhookLogs(wh);
      if (acc?.product_breakdown) setProductStats(acc.product_breakdown);
    } catch (e) {
      setErr(e.message || "Veri y\u00fcklenemedi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [days, load]);

  const maxFunnel = data?.role_funnel?.page_view || 1;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Rol Okuma Analitiği</h1>
          <p className={styles.subtitle}>
            Matrix Rol Okuma funnel performansı — gerçek zamanlı
          </p>
        </div>
        <div className={styles.filterRow}>
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              className={`${styles.filterBtn} ${days === d ? styles.filterBtnActive : ""}`}
              onClick={() => setDays(d)}
            >
              {d} gün
            </button>
          ))}
        </div>
      </div>

      {loading && <div className={styles.loading}>Yükleniyor...</div>}
      {err && <div className={styles.error}>{err}</div>}

      {data && !loading && (
        <>
          {/* ── Stat Cards ── */}
          <div className={styles.statsGrid}>
            <StatCard
              icon="👁"
              label="Toplam Görüntüleme"
              value={data.role_funnel?.page_view ?? 0}
              accent="#c8a0ff"
            />
            <StatCard
              icon="✓"
              label="Form Gönderen"
              value={data.role_funnel?.form_submit ?? 0}
              accent="#78f7d8"
            />
            <StatCard
              icon="🛒"
              label="Shopier'e Giden"
              value={data.role_funnel?.shopier_redirect ?? 0}
              accent="#ffd700"
            />
            <StatCard
              icon="✦"
              label="Satın Alan"
              value={data.role_funnel?.unlock_success ?? 0}
              sub={`${data.role_rates?.overall ?? 0}% toplam dönüşüm`}
              accent="#78f7d8"
            />
          </div>

          {/* ── Funnel Visualization ── */}
          <div className={styles.funnelSection}>
            <h2 className={styles.sectionTitle}>Funnel Görünümü</h2>
            <div className={styles.funnelBars}>
              {ROLE_STEPS.map((step) => {
                const val = data.role_funnel?.[step.key] ?? 0;
                const pct = maxFunnel > 0 ? (val / maxFunnel) * 100 : 0;
                return (
                  <div key={step.key} className={styles.funnelRow}>
                    <div className={styles.funnelLabel}>
                      <span className={styles.funnelIcon}>{step.icon}</span>
                      <span className={styles.funnelName}>{step.label}</span>
                    </div>
                    <div className={styles.funnelBarWrap}>
                      <div
                        className={styles.funnelBar}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                    <div className={styles.funnelVal}>{val}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Conversion Rates ── */}
          <div className={styles.ratesSection}>
            <h2 className={styles.sectionTitle}>Dönüşüm Oranları</h2>
            <div className={styles.ratesGrid}>
              {Object.entries(RATE_LABELS).map(([key, label]) => {
                const val = data.role_rates?.[key] ?? 0;
                return (
                  <div
                    key={key}
                    className={`${styles.rateCard} ${key === "overall" ? styles.rateCardHighlight : ""}`}
                  >
                    <div className={styles.rateLabel}>{label}</div>
                    <div
                      className={styles.rateValue}
                      style={{ color: rateColor(val) }}
                    >
                      {val}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sources & Devices ── */}
          <div className={styles.metaRow}>
            <div className={styles.metaCard}>
              <h3 className={styles.metaTitle}>Trafik Kaynağı</h3>
              {data.sources && Object.keys(data.sources).length > 0 ? (
                <ul className={styles.metaList}>
                  {Object.entries(data.sources)
                    .sort((a, b) => b[1] - a[1])
                    .map(([src, cnt]) => (
                      <li key={src} className={styles.metaItem}>
                        <span className={styles.metaItemLabel}>{src}</span>
                        <span className={styles.metaItemVal}>{cnt}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className={styles.metaEmpty}>Henüz veri yok</p>
              )}
            </div>

            <div className={styles.metaCard}>
              <h3 className={styles.metaTitle}>Cihaz Dağılımı</h3>
              {data.devices && Object.keys(data.devices).length > 0 ? (
                <ul className={styles.metaList}>
                  {Object.entries(data.devices)
                    .sort((a, b) => b[1] - a[1])
                    .map(([dev, cnt]) => (
                      <li key={dev} className={styles.metaItem}>
                        <span className={styles.metaItemLabel}>
                          {dev === "mobile" ? "📱 Mobil" : dev === "desktop" ? "🖥 Masaüstü" : dev}
                        </span>
                        <span className={styles.metaItemVal}>{cnt}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className={styles.metaEmpty}>Henüz veri yok</p>
              )}
            </div>

            <div className={styles.metaCard}>
              <h3 className={styles.metaTitle}>Saat Bazlı Yoğunluk</h3>
              {data.hourly && Object.keys(data.hourly).length > 0 ? (
                <div className={styles.hourlyGrid}>
                  {Array.from({ length: 24 }, (_, h) => {
                    const cnt = data.hourly[h] || 0;
                    const max = Math.max(...Object.values(data.hourly), 1);
                    const opacity = cnt > 0 ? 0.2 + (cnt / max) * 0.8 : 0.05;
                    return (
                      <div
                        key={h}
                        className={styles.hourCell}
                        style={{ opacity }}
                        title={`${h}:00 — ${cnt} event`}
                      >
                        <span className={styles.hourLabel}>{h}</span>
                        <span className={styles.hourCount}>{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className={styles.metaEmpty}>Henüz veri yok</p>
              )}
            </div>
          </div>

          {/* ── Product Conversion Breakdown ── */}
          {productStats && Object.keys(productStats).length > 0 && (
            <div className={styles.ratesSection}>
              <h2 className={styles.sectionTitle}>{"\u00dc"}r{"\u00fc"}n Bazl{"\u0131"} D{"\u00f6"}n{"\u00fc\u015f\u00fc"}m</h2>
              <div className={styles.ratesGrid}>
                {Object.entries(productStats).map(([cid, info]) => {
                  const label = PRODUCT_LABELS[cid] || cid;
                  const count = info.count || info;
                  const revenue = info.revenue || 0;
                  return (
                    <div key={cid} className={styles.rateCard}>
                      <div className={styles.rateLabel}>{label}</div>
                      <div className={styles.rateValue} style={{ color: "#78f7d8" }}>{count} sat{"\u0131\u015f"}</div>
                      {revenue > 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{revenue.toFixed(0)} {"\u20ba"}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Webhook Health ── */}
          {webhookLogs && (
            <div className={styles.ratesSection}>
              <h2 className={styles.sectionTitle}>Webhook Sa{"\u011fl\u0131\u011f\u0131"}</h2>
              <div className={styles.statsGrid} style={{ marginBottom: 16 }}>
                <StatCard icon={"\u2705"} label="Ba\u015far\u0131l\u0131" value={webhookLogs.total_success ?? 0} accent="#78f7d8" />
                <StatCard icon={"\u274c"} label="Ba\u015far\u0131s\u0131z" value={webhookLogs.total_failed ?? 0} accent="#ff6b6b" />
              </div>
              {webhookLogs.logs?.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "rgba(255,255,255,0.5)" }}>Durum</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "rgba(255,255,255,0.5)" }}>Order</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "rgba(255,255,255,0.5)" }}>Email</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "rgba(255,255,255,0.5)" }}>Tarih</th>
                        <th style={{ padding: "8px 6px", textAlign: "left", color: "rgba(255,255,255,0.5)" }}>Hata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webhookLogs.logs.slice(0, 15).map((log) => (
                        <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "6px", color: log.status === "success" ? "#78f7d8" : "#ff6b6b" }}>{log.status}</td>
                          <td style={{ padding: "6px", color: "rgba(255,255,255,0.6)" }}>{(log.order_id || "").slice(0, 16)}</td>
                          <td style={{ padding: "6px", color: "rgba(255,255,255,0.6)" }}>{log.email || "-"}</td>
                          <td style={{ padding: "6px", color: "rgba(255,255,255,0.4)" }}>{log.created_at ? new Date(log.created_at).toLocaleString("tr-TR") : "-"}</td>
                          <td style={{ padding: "6px", color: "rgba(255,100,100,0.6)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{log.error_detail || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Total events ── */}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Toplam Event</span>
            <span className={styles.totalValue}>{data.total_events ?? 0}</span>
          </div>
        </>
      )}
    </div>
  );
}
