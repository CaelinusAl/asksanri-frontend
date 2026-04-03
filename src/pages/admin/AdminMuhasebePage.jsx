import { useState, useEffect, useCallback, useMemo } from "react";
import StatCard from "../../components/admin/StatCard";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminMuhasebePage.module.css";
import {
  fetchAccounting,
  fetchAccountingCustomer,
  downloadAccountingCsv,
} from "../../data/adminApi";

function formatTry(n) {
  return `₺${Number(n || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function firstOfMonthISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
}

export default function AdminMuhasebePage() {
  const [dateFrom, setDateFrom] = useState(firstOfMonthISO);
  const [dateTo, setDateTo] = useState(todayISODate);
  const [contentId, setContentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 100;

  const [data, setData] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetchAccounting({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        content_id: contentId.trim() || undefined,
        payment_status: paymentStatus.trim() || undefined,
        orders_limit: limit,
        orders_offset: offset,
        funnel_days: 30,
      });
      setData(res);
    } catch (e) {
      setErr(e.message || "Veri yüklenemedi");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, contentId, paymentStatus, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = data?.summary;
  const fr = data?.funnel_revenue;
  const collections = data?.collections;

  const loadCustomer = async () => {
    const em = customerEmail.trim().toLowerCase();
    if (!em.includes("@")) return;
    setErr("");
    try {
      const c = await fetchAccountingCustomer(em);
      setCustomerData(c);
    } catch (e) {
      setErr(e.message || "Müşteri yüklenemedi");
      setCustomerData(null);
    }
  };

  const exportCsv = async () => {
    try {
      await downloadAccountingCsv({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        content_id: contentId.trim() || undefined,
        payment_status: paymentStatus.trim() || undefined,
      });
    } catch (e) {
      setErr(e.message || "CSV hatası");
    }
  };

  const productOptions = useMemo(() => {
    const rows = data?.by_product || [];
    return rows.map((r) => r.content_id).filter(Boolean);
  }, [data]);

  return (
    <div className={pageStyles.wrap}>
      <h1 className={styles.pageTitle}>Muhasebe Merkezi</h1>
      <p className={styles.pageDesc}>
        Shopier webhook kayıtları (<code className={pageStyles.mono}>shopier_purchases</code>), funnel
        olayları ve site görüntülenmeleri — tek ekran.
      </p>

      <details className={pageStyles.section} style={{ marginBottom: 20 }}>
        <summary className={pageStyles.sectionTitle} style={{ cursor: "pointer" }}>
          Bilgi mimarisi (veri kaynakları)
        </summary>
        <ul className={pageStyles.sectionNote} style={{ paddingLeft: 18, maxWidth: 720 }}>
          <li>
            <strong>shopier_purchases</strong> — Sipariş satırları: <code>shopier_order_id</code>,{" "}
            <code>email</code>, <code>product_name</code>, <code>content_id</code>, <code>amount</code>,{" "}
            <code>currency</code>, <code>payment_status</code>, <code>status</code>,{" "}
            <code>device_fp</code>/<code>user_id</code> (unlock bağlantısı), <code>created_at</code>.
          </li>
          <li>
            <strong>funnel_events</strong> — <code>role_*</code>, <code>ankod_*</code> olayları; Shopier
            yönlendirme ve istemci &quot;unlock success&quot; sayıları.
          </li>
          <li>
            <strong>page_views</strong> — Genel site <code>page_views</code> sayısı (funnel köprüsünde özet).
          </li>
          <li>
            <strong>users</strong> — Müşteri panelinde e-posta ile eşleşen satırlar; uygulama kullanıcısı
            join’i sonraki aşamada genişletilebilir.
          </li>
        </ul>
      </details>

      <div className={pageStyles.toolbar}>
        <div className={pageStyles.field}>
          <label htmlFor="m-from">Başlangıç</label>
          <input
            id="m-from"
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setOffset(0);
              setDateFrom(e.target.value);
            }}
          />
        </div>
        <div className={pageStyles.field}>
          <label htmlFor="m-to">Bitiş</label>
          <input
            id="m-to"
            type="date"
            value={dateTo}
            onChange={(e) => {
              setOffset(0);
              setDateTo(e.target.value);
            }}
          />
        </div>
        <div className={pageStyles.field}>
          <label htmlFor="m-cid">content_id</label>
          <input
            id="m-cid"
            type="text"
            placeholder="ör. role_unlock"
            value={contentId}
            onChange={(e) => {
              setOffset(0);
              setContentId(e.target.value);
            }}
            list="content-ids-datalist"
          />
          <datalist id="content-ids-datalist">
            {productOptions.map((id) => (
              <option key={id} value={id} />
            ))}
          </datalist>
        </div>
        <div className={pageStyles.field}>
          <label htmlFor="m-pay">Ödeme durumu</label>
          <input
            id="m-pay"
            type="text"
            placeholder="paid / unpaid"
            value={paymentStatus}
            onChange={(e) => {
              setOffset(0);
              setPaymentStatus(e.target.value);
            }}
          />
        </div>
        <button type="button" className={pageStyles.btn} onClick={load}>
          Yenile
        </button>
        <button type="button" className={`${pageStyles.btn} ${pageStyles.btnSecondary}`} onClick={exportCsv}>
          CSV indir
        </button>
      </div>

      {loading && <div className={pageStyles.loading}>Yükleniyor...</div>}
      {err && <div className={pageStyles.error}>{err}</div>}

      {!loading && summary && (
        <>
          <section className={pageStyles.grid7} aria-label="Özet">
            <StatCard label="Bugün satış adedi" value={summary.sales_today_count} icon="◆" />
            <StatCard label="Bugün ciro" value={formatTry(summary.revenue_today)} icon="₺" />
            <StatCard label="Bu ay satış" value={summary.sales_month_count} icon="✦" accent="#ffc832" />
            <StatCard label="Bu ay ciro" value={formatTry(summary.revenue_month)} icon="◎" />
            <StatCard
              label="Bekleyen tahsilat (satır)"
              value={`${summary.pending_collection_count} · ${formatTry(summary.pending_collection_amount)}`}
              icon="⏳"
            />
            <StatCard
              label="En çok satan (ay)"
              value={summary.top_product?.label || "—"}
              sub={summary.top_product ? formatTry(summary.top_product.revenue) : ""}
              icon="▲"
            />
            <StatCard label="Ort. sepet (ay)" value={formatTry(summary.avg_basket_month)} icon="◇" />
          </section>

          {collections && (
            <section className={pageStyles.section}>
              <h2 className={pageStyles.sectionTitle}>Tahsilat özeti</h2>
              <p className={pageStyles.sectionNote}>{summary.refunds_note}</p>
              <div className={pageStyles.funnelGrid}>
                <div className={pageStyles.funnelCard}>
                  <span>Tahsil edilmiş (tamamlanan, tüm zaman)</span>
                  <strong>{formatTry(collections.collected_completed_total_try)}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Bekleyen satır tutarı</span>
                  <strong>{formatTry(collections.pending_rows_try)}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Bekleyen satır adedi</span>
                  <strong>{collections.pending_rows_count}</strong>
                </div>
              </div>
            </section>
          )}

          {fr && (
            <section className={pageStyles.section}>
              <h2 className={pageStyles.sectionTitle}>Funnel &amp; gelir köprüsü (30 gün)</h2>
              <p className={pageStyles.sectionNote}>{fr.note}</p>
              <div className={pageStyles.funnelGrid}>
                <div className={pageStyles.funnelCard}>
                  <span>Site page_views (özet)</span>
                  <strong>{fr.page_views_total_site ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Rol sayfa görüntüleme</span>
                  <strong>{fr.page_views_role ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Form gönderim (rol)</span>
                  <strong>{fr.form_submit_role ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Shopier yönlendirme (rol)</span>
                  <strong>{fr.shopier_redirect_role ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Unlock success (rol, istemci)</span>
                  <strong>{fr.unlock_success_role ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Shopier yönlendirme (ankod)</span>
                  <strong>{fr.shopier_redirect_ankod ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Webhook satın alma (pencere)</span>
                  <strong>{fr.purchases_total_window ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>role_unlock satış</span>
                  <strong>{fr.purchases_role_unlock ?? 0}</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Yönlendirme → satış (rol) %</span>
                  <strong>{fr.conversion_role_redirect_to_purchase ?? 0}%</strong>
                </div>
                <div className={pageStyles.funnelCard}>
                  <span>Yönlendirme → satış (ankod) %</span>
                  <strong>{fr.conversion_ankod_redirect_to_purchase ?? 0}%</strong>
                </div>
              </div>
            </section>
          )}

          <section className={pageStyles.section}>
            <h2 className={pageStyles.sectionTitle}>Siparişler</h2>
            <div className={pageStyles.tableWrap}>
              <table className={pageStyles.table}>
                <thead>
                  <tr>
                    <th>order_id</th>
                    <th>E-posta</th>
                    <th>Ürün</th>
                    <th>content_id</th>
                    <th>Tutar</th>
                    <th>Ödeme</th>
                    <th>Unlock</th>
                    <th>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.orders || []).map((o) => (
                    <tr key={`${o.ledger_source || "shopier"}-${o.id}`}>
                      <td className={pageStyles.mono}>{o.order_id || "—"}</td>
                      <td>{o.email || "—"}</td>
                      <td>{o.product_name || "—"}</td>
                      <td className={pageStyles.mono}>{o.content_id}</td>
                      <td>
                        {formatTry(o.amount)} {o.currency}
                      </td>
                      <td>{o.payment_status || o.status || "—"}</td>
                      <td>{o.unlock_status}</td>
                      <td className={pageStyles.mono}>{o.created_at?.slice(0, 19) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={pageStyles.pager}>
              <button
                type="button"
                className={pageStyles.btnSecondary}
                style={{ padding: "8px 14px" }}
                disabled={offset === 0}
                onClick={() => setOffset((x) => Math.max(0, x - limit))}
              >
                Önceki
              </button>
              <span style={{ color: "#8a84a0", fontSize: 13 }}>
                {offset + 1}–{offset + (data.orders?.length || 0)} / {data.orders_total ?? 0}
              </span>
              <button
                type="button"
                className={pageStyles.btnSecondary}
                style={{ padding: "8px 14px" }}
                disabled={offset + limit >= (data.orders_total || 0)}
                onClick={() => setOffset((x) => x + limit)}
              >
                Sonraki
              </button>
            </div>
          </section>

          {(data.havale_orders || []).length > 0 && (
            <section className={pageStyles.section}>
              <h2 className={pageStyles.sectionTitle}>Havale / EFT talepleri (aynı tarih filtresi)</h2>
              <p className={pageStyles.hint}>
                Shopier dışı ödemeler; e-posta burada kayıtlıdır. Müşteri listesi artık Shopier + havale +
                lead birleşimidir.
              </p>
              <div className={pageStyles.tableWrap}>
                <table className={pageStyles.table}>
                  <thead>
                    <tr>
                      <th>Talep</th>
                      <th>E-posta</th>
                      <th>Ürün</th>
                      <th>content_id</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                      <th>Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.havale_orders || []).map((o) => (
                      <tr key={`havale-${o.id}`}>
                        <td className={pageStyles.mono}>{o.order_id || "—"}</td>
                        <td>{o.email || "—"}</td>
                        <td>{o.product_name || "—"}</td>
                        <td className={pageStyles.mono}>{o.content_id}</td>
                        <td>
                          {formatTry(o.amount)} {o.currency}
                        </td>
                        <td>{o.payment_status || "—"}</td>
                        <td className={pageStyles.mono}>{o.created_at?.slice(0, 19) || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className={pageStyles.section}>
            <h2 className={pageStyles.sectionTitle}>Ürün bazlı gelir (seçili tarih aralığı)</h2>
            <div className={pageStyles.tableWrap}>
              <table className={pageStyles.table}>
                <thead>
                  <tr>
                    <th>İçerik</th>
                    <th>Adet</th>
                    <th>Toplam</th>
                    <th>Ortalama</th>
                    <th>Son satış</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.by_product || []).map((r) => (
                    <tr key={r.content_id}>
                      <td>
                        <span className={pageStyles.mono}>{r.content_id}</span>
                        <div style={{ fontSize: 11, color: "#6a6480" }}>{r.display_name}</div>
                      </td>
                      <td>{r.sale_count}</td>
                      <td>{formatTry(r.total_revenue)}</td>
                      <td>{formatTry(r.avg_revenue)}</td>
                      <td className={pageStyles.mono}>{r.last_sale_at?.slice(0, 19) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className={pageStyles.section}>
            <h2 className={pageStyles.sectionTitle}>Kullanıcı satın alım geçmişi</h2>
            <div className={pageStyles.toolbar} style={{ marginBottom: 0 }}>
              <div className={pageStyles.field} style={{ flex: 1, minWidth: 220 }}>
                <label htmlFor="m-cust">E-posta</label>
                <input
                  id="m-cust"
                  type="email"
                  placeholder="musteri@ornek.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  list="muhasebe-customer-emails"
                />
                <datalist id="muhasebe-customer-emails">
                  {(data.customer_emails || []).map((e) => (
                    <option key={e} value={e} />
                  ))}
                </datalist>
              </div>
              <button type="button" className={pageStyles.btn} style={{ marginTop: 22 }} onClick={loadCustomer}>
                Yükle
              </button>
            </div>

            {customerData && (
              <div className={pageStyles.customerPanel}>
                <h3>{customerData.email}</h3>
                <p style={{ margin: "0 0 8px", color: "#a8a0c0", fontSize: 14 }}>
                  {customerData.purchase_count} satın alma · Toplam {formatTry(customerData.total_spent)}
                </p>
                <p style={{ margin: "0 0 12px", color: "#7a7490", fontSize: 13 }}>
                  İlk: {customerData.first_purchase_at?.slice(0, 19) || "—"} · Son:{" "}
                  {customerData.last_purchase_at?.slice(0, 19) || "—"}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9a94b0" }}>İçerikler:</p>
                <p className={pageStyles.mono} style={{ margin: 0, fontSize: 13 }}>
                  {(customerData.content_ids || []).join(", ") || "—"}
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
