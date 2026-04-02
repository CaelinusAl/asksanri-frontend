import { useState, useEffect, useCallback } from "react";
import StatCard from "../../components/admin/StatCard";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminRevenuePage.module.css";
import { fetchAdminBillingSummary } from "../../data/billingApi";
import { fetchFunnelStats, fetchVisitorStats } from "../../data/adminApi";

function formatTry(n) {
  return `₺${Number(n || 0).toLocaleString("tr-TR")}`;
}

export default function AdminRevenuePage() {
  const [period, setPeriod] = useState("7");
  const [billing, setBilling] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [visitors, setVisitors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const [b, f, v] = await Promise.all([
        fetchAdminBillingSummary().catch(() => null),
        fetchFunnelStats(Number(period)).catch(() => null),
        fetchVisitorStats().catch(() => null),
      ]);
      setBilling(b);
      setFunnel(f);
      setVisitors(v);
    } catch (e) {
      setErr(e.message || "Veri yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const summary = billing?.summary || {};
  const recentPurchases = billing?.recent_purchases || [];
  const contentUnlocks = billing?.content_unlocks || [];

  const totalRevenue = summary.total_revenue || 0;
  const totalPurchases = summary.total_purchases || 0;
  const activeSubs = summary.active_subscriptions || 0;
  const totalUnlocks = summary.total_content_unlocks || 0;

  const roleFunnel = funnel?.role_funnel || {};
  const roleRates = funnel?.role_rates || {};

  const totalViews = visitors?.views?.total || 0;
  const weeklyViews = visitors?.views?.week || 0;

  const funnelSteps = [
    { label: "Sayfa Görüntüleme", count: roleFunnel.page_view || 0 },
    { label: "Form Gönderim", count: roleFunnel.form_submit || 0 },
    { label: "Kilit Ekranı", count: roleFunnel.lock_view || 0 },
    { label: "Shopier Yönlendirme", count: roleFunnel.shopier_redirect || 0 },
    { label: "Satın Alma", count: roleFunnel.unlock_success || 0 },
  ];
  const funnelMax = funnelSteps[0]?.count || 1;

  return (
    <div>
      <h1 className={styles.pageTitle}>Gelir &amp; Dönüşüm</h1>
      <p className={styles.pageDesc}>
        Gerçek zamanlı gelir takibi ve dönüşüm analizi
      </p>

      <div className={styles.filterBar} role="group" aria-label="Dönem">
        {[
          { id: "7", label: "7 Gün" },
          { id: "30", label: "30 Gün" },
          { id: "90", label: "90 Gün" },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles.filterBtn} ${period === p.id ? styles.filterBtnActive : ""}`}
            onClick={() => setPeriod(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && <div className={pageStyles.loading}>Yükleniyor...</div>}
      {err && <div className={pageStyles.error}>{err}</div>}

      {!loading && (
        <>
          <section className={styles.grid4} aria-label="Gelir özeti">
            <StatCard label="Toplam Gelir" value={formatTry(totalRevenue)} icon="◆" />
            <StatCard label="Toplam Satış" value={totalPurchases} icon="✦" accent="#ffc832" />
            <StatCard
              label="Toplam Dönüşüm"
              value={`${roleRates.overall || 0}%`}
              icon="◎"
              accent="#50c878"
            />
            <StatCard label="İçerik Açılımları" value={totalUnlocks} icon="◇" />
          </section>

          <section className={styles.grid4} aria-label="Trafik">
            <StatCard label="Toplam Ziyaret" value={totalViews} icon="👁" />
            <StatCard label="Haftalık Ziyaret" value={weeklyViews} icon="📊" accent="#78f7d8" />
            <StatCard label="Aktif Abonelik" value={activeSubs} icon="⟁" accent="#c8a0ff" />
            <StatCard
              label="Shopier'e Giden"
              value={roleFunnel.shopier_redirect || 0}
              icon="🛒"
              accent="#ffd700"
            />
          </section>

          {/* Funnel */}
          <div className={pageStyles.chartWrap}>
            <h2 className={pageStyles.chartTitle}>Satış Hunisi (Rol Okuma)</h2>
            <div className={pageStyles.funnel}>
              {funnelSteps.map((step) => {
                const widthPct = Math.max((step.count / funnelMax) * 100, 2);
                const prevStep = funnelSteps[funnelSteps.indexOf(step) - 1];
                const rate = prevStep && prevStep.count > 0
                  ? ((step.count / prevStep.count) * 100).toFixed(1)
                  : null;
                return (
                  <div key={step.label} className={pageStyles.funnelStep}>
                    <span className={pageStyles.funnelLabel}>{step.label}</span>
                    <div className={pageStyles.funnelBarRow}>
                      <div
                        className={pageStyles.funnelBar}
                        style={{ width: `${widthPct}%` }}
                        role="presentation"
                      />
                    </div>
                    <div className={pageStyles.funnelMeta}>
                      <span className={pageStyles.funnelCount}>{step.count}</span>
                      {rate != null && (
                        <span className={pageStyles.funnelPct}>{rate}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Purchases */}
          {recentPurchases.length > 0 && (
            <div className={pageStyles.chartWrap}>
              <h2 className={pageStyles.chartTitle}>Son Satışlar</h2>
              <div className={styles.tableWrap}>
                <table className={pageStyles.perfTable}>
                  <thead>
                    <tr>
                      <th scope="col">Kullanıcı</th>
                      <th scope="col">Ürün</th>
                      <th scope="col">Tutar</th>
                      <th scope="col">Durum</th>
                      <th scope="col">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPurchases.slice(0, 20).map((p, i) => (
                      <tr key={p.id || i}>
                        <td>#{p.user_id}</td>
                        <td>{p.product_key || p.product_name || "—"}</td>
                        <td>{formatTry(p.amount || p.price || 0)}</td>
                        <td>
                          <span className={
                            p.status === "completed" ? pageStyles.statusOk :
                            p.status === "failed" ? pageStyles.statusFail :
                            pageStyles.statusPending
                          }>
                            {p.status || "—"}
                          </span>
                        </td>
                        <td>{p.created_at ? new Date(p.created_at).toLocaleDateString("tr-TR") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Content Unlocks */}
          {contentUnlocks.length > 0 && (
            <div className={pageStyles.chartWrap}>
              <h2 className={pageStyles.chartTitle}>İçerik Açılımları</h2>
              <div className={styles.tableWrap}>
                <table className={pageStyles.perfTable}>
                  <thead>
                    <tr>
                      <th scope="col">Kullanıcı</th>
                      <th scope="col">İçerik ID</th>
                      <th scope="col">Kaynak</th>
                      <th scope="col">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentUnlocks.slice(0, 20).map((u, i) => (
                      <tr key={u.id || i}>
                        <td>#{u.user_id}</td>
                        <td>{u.content_id || "—"}</td>
                        <td>{u.source || "—"}</td>
                        <td>{u.created_at ? new Date(u.created_at).toLocaleDateString("tr-TR") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty state */}
          {recentPurchases.length === 0 && contentUnlocks.length === 0 && (
            <div className={pageStyles.chartWrap}>
              <div className={pageStyles.emptyState}>
                <div className={pageStyles.emptyIcon}>◎</div>
                <p className={pageStyles.emptyText}>
                  Henüz gelir verisi yok. Shopier satışları ve içerik açılımları burada görünecek.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
