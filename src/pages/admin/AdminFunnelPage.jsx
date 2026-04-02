import { useEffect, useState, useCallback } from "react";
import StatCard from "../../components/admin/StatCard";
import styles from "./AdminFunnelPage.module.css";
import { fetchFunnelStats } from "../../data/adminApi";

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

export default function AdminFunnelPage() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async (d) => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetchFunnelStats(d);
      setData(res);
    } catch (e) {
      setErr(e.message || "Veri yüklenemedi");
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
