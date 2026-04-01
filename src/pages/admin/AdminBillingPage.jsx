import React, { useState, useEffect, useCallback } from "react";
import { fetchAdminBillingSummary } from "../../data/billingApi";
import styles from "./AdminBillingPage.module.css";

const PRODUCT_LABELS = {
  single_read_unlock: "Tek Okuma",
  single_book_unlock: "Tek Kitap",
  single_ritual_unlock: "Tek Ritüel",
  weekly_pass: "Haftalık Geçiş",
  premium_monthly: "Premium Aylık",
  premium_yearly: "Premium Yıllık",
};

const STATUS_CLASSES = {
  completed: "statusOk",
  active: "statusOk",
  trialing: "statusOk",
  pending: "statusPending",
  past_due: "statusWarn",
  canceled: "statusFail",
  failed: "statusFail",
};

function StatusBadge({ status }) {
  const cls = STATUS_CLASSES[status] || "statusPending";
  return <span className={`${styles.status} ${styles[cls]}`}>{status}</span>;
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("tr", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const TABS = [
  { id: "overview", label: "Genel Bakış" },
  { id: "purchases", label: "Satın Almalar" },
  { id: "subscriptions", label: "Abonelikler" },
  { id: "entitlements", label: "Entitlementlar" },
  { id: "unlocks", label: "İçerik Açmalar" },
];

export default function AdminBillingPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const summary = await fetchAdminBillingSummary();
      setData(summary);
    } catch {
      setData(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}><span className={styles.pulse} /></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>Billing verisi yüklenemedi.</p>
        <button className={styles.retryBtn} onClick={load}>Tekrar Dene</button>
      </div>
    );
  }

  const s = data.summary;
  const purchases = data.recent_purchases || [];
  const subs = data.subscriptions || [];
  const ents = data.entitlements || [];
  const unlocks = data.content_unlocks || [];

  const failedPurchases = purchases.filter((p) => p.status === "failed");
  const canceledSubs = subs.filter((sub) => sub.status === "canceled");
  const activeSubs = subs.filter((sub) => sub.status === "active" || sub.status === "trialing");
  const failedSubs = subs.filter((sub) => sub.failure_reason);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        <span className={styles.titleGlyph}>◈</span> Billing & Payments
      </h1>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>₺{s.total_revenue.toFixed(2)}</span>
          <span className={styles.statLabel}>Toplam Gelir</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{s.total_purchases}</span>
          <span className={styles.statLabel}>Başarılı Satış</span>
        </div>
        <div className={`${styles.statCard} ${s.failed_purchases > 0 ? styles.statWarn : ""}`}>
          <span className={styles.statNum}>{s.failed_purchases}</span>
          <span className={styles.statLabel}>Başarısız</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{s.active_subscriptions}</span>
          <span className={styles.statLabel}>Aktif Abonelik</span>
        </div>
        <div className={`${styles.statCard} ${s.canceled_subscriptions > 0 ? styles.statWarn : ""}`}>
          <span className={styles.statNum}>{s.canceled_subscriptions}</span>
          <span className={styles.statLabel}>İptal Edilen</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{s.active_entitlements}</span>
          <span className={styles.statLabel}>Aktif Ent.</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{s.total_content_unlocks}</span>
          <span className={styles.statLabel}>İçerik Açma</span>
        </div>
      </div>

      <nav className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className={styles.overviewGrid}>
          {failedSubs.length > 0 && (
            <section className={styles.alertSection}>
              <h3 className={styles.alertTitle}>Ödeme Sorunlu Abonelikler</h3>
              {failedSubs.map((sub) => (
                <div key={sub.id} className={styles.alertCard}>
                  <span>User #{sub.user_id}</span>
                  <span>{PRODUCT_LABELS[sub.product_key] || sub.product_key}</span>
                  <span className={styles.alertReason}>{sub.failure_reason}</span>
                </div>
              ))}
            </section>
          )}

          {failedPurchases.length > 0 && (
            <section className={styles.alertSection}>
              <h3 className={styles.alertTitle}>Başarısız Satın Almalar</h3>
              {failedPurchases.map((p) => (
                <div key={p.id} className={styles.alertCard}>
                  <span>#{p.id} — User #{p.user_id}</span>
                  <span>{PRODUCT_LABELS[p.product_key] || p.product_key}</span>
                  <span className={styles.alertReason}>{p.failure_reason || "failed"}</span>
                </div>
              ))}
            </section>
          )}

          {canceledSubs.length > 0 && (
            <section className={styles.alertSection}>
              <h3 className={styles.alertTitle}>Son İptaller</h3>
              {canceledSubs.slice(0, 10).map((sub) => (
                <div key={sub.id} className={styles.alertCard}>
                  <span>User #{sub.user_id}</span>
                  <span>{PRODUCT_LABELS[sub.product_key] || sub.product_key}</span>
                  <span>{sub.canceled_at ? formatDate(sub.canceled_at) : "—"}</span>
                </div>
              ))}
            </section>
          )}

          {failedSubs.length === 0 && failedPurchases.length === 0 && canceledSubs.length === 0 && (
            <p className={styles.emptyNote}>Sorun yok — tüm ödemeler ve abonelikler sağlıklı.</p>
          )}
        </div>
      )}

      {/* PURCHASES */}
      {activeTab === "purchases" && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Ürün</th><th>İçerik</th>
                <th>Tutar</th><th>Durum</th><th>Hata</th><th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id}>
                  <td className={styles.mono}>#{p.id}</td>
                  <td>{p.user_id}</td>
                  <td><span className={styles.badge}>{PRODUCT_LABELS[p.product_key] || p.product_key}</span></td>
                  <td className={styles.mono}>{p.content_id || "—"}</td>
                  <td className={styles.amount}>₺{p.amount.toFixed(2)}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className={styles.reason}>{p.failure_reason || "—"}</td>
                  <td className={styles.date}>{formatDate(p.created_at)}</td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr><td colSpan={8} className={styles.empty}>Kayıt yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBSCRIPTIONS */}
      {activeTab === "subscriptions" && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Plan</th><th>Durum</th>
                <th>Dönem Sonu</th><th>İptal?</th><th>Hata</th><th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id}>
                  <td className={styles.mono}>#{sub.id}</td>
                  <td>{sub.user_id}</td>
                  <td><span className={`${styles.badge} ${styles.badgePremium}`}>{PRODUCT_LABELS[sub.product_key] || sub.product_key}</span></td>
                  <td><StatusBadge status={sub.status} /></td>
                  <td className={styles.date}>{formatDate(sub.current_period_end)}</td>
                  <td>{sub.cancel_at_period_end ? "Evet" : "—"}</td>
                  <td className={styles.reason}>{sub.failure_reason || "—"}</td>
                  <td className={styles.date}>{formatDate(sub.created_at)}</td>
                </tr>
              ))}
              {subs.length === 0 && (
                <tr><td colSpan={8} className={styles.empty}>Kayıt yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ENTITLEMENTS */}
      {activeTab === "entitlements" && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Entitlement</th>
                <th>Product</th><th>Source</th><th>Bitiş</th><th>Verilme</th>
              </tr>
            </thead>
            <tbody>
              {ents.map((e) => (
                <tr key={e.id}>
                  <td className={styles.mono}>#{e.id}</td>
                  <td>{e.user_id}</td>
                  <td><span className={`${styles.badge} ${styles.badgeEnt}`}>{e.entitlement_key}</span></td>
                  <td>{PRODUCT_LABELS[e.product_key] || e.product_key || "—"}</td>
                  <td className={styles.sourceTag}>{e.source}</td>
                  <td className={styles.date}>{formatDate(e.expires_at)}</td>
                  <td className={styles.date}>{formatDate(e.granted_at)}</td>
                </tr>
              ))}
              {ents.length === 0 && (
                <tr><td colSpan={7} className={styles.empty}>Aktif entitlement yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* CONTENT UNLOCKS */}
      {activeTab === "unlocks" && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>İçerik ID</th>
                <th>Tür</th><th>Satın Alma</th><th>Açılma</th>
              </tr>
            </thead>
            <tbody>
              {unlocks.map((u) => (
                <tr key={u.id}>
                  <td className={styles.mono}>#{u.id}</td>
                  <td>{u.user_id}</td>
                  <td className={styles.mono}>{u.content_id}</td>
                  <td>{u.content_type}</td>
                  <td className={styles.mono}>{u.purchase_id ? `#${u.purchase_id}` : "—"}</td>
                  <td className={styles.date}>{formatDate(u.unlocked_at)}</td>
                </tr>
              ))}
              {unlocks.length === 0 && (
                <tr><td colSpan={6} className={styles.empty}>Kayıt yok</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
