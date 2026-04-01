import { useState } from "react";
import StatCard from "../../components/admin/StatCard";
import styles from "../../components/admin/AdminStyles.module.css";
import pageStyles from "./AdminRevenuePage.module.css";

const BAR_VALUES = [180, 240, 120, 310, 280, 190, 350];
const BAR_DAY_LABELS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const BAR_MAX = Math.max(...BAR_VALUES);

const FUNNEL_BASE = 2450;
const FUNNEL_STEPS = [
  { label: "Ziyaretçi", count: 2450, pct: null },
  { label: "Kayıt", count: 890, pct: "36%" },
  { label: "İçerik Tüketim", count: 340, pct: "38%" },
  { label: "Premium", count: 34, pct: "10%" },
];

const MOCK_PRODUCTS = [
  {
    name: "Premium Aylık",
    views: 8420,
    conversions: 124,
    revenue: 49600,
    conversionRate: "1.47%",
  },
  {
    name: "Premium Yıllık",
    views: 3120,
    conversions: 89,
    revenue: 178000,
    conversionRate: "2.85%",
  },
  {
    name: "Ritüel Paketi — Kalp",
    views: 2100,
    conversions: 42,
    revenue: 8400,
    conversionRate: "2.00%",
  },
  {
    name: "Okuma Alanı — 1999",
    views: 15600,
    conversions: 56,
    revenue: 0,
    conversionRate: "0.36%",
  },
  {
    name: "Yankı Plus",
    views: 4800,
    conversions: 31,
    revenue: 9300,
    conversionRate: "0.65%",
  },
];

function formatTry(n) {
  return `₺${Number(n).toLocaleString("tr-TR")}`;
}

export default function AdminRevenuePage() {
  const [period, setPeriod] = useState("7");

  return (
    <div>
      <h1 className={styles.pageTitle}>Gelir &amp; Dönüşüm</h1>
      <p className={styles.pageDesc}>Gelir takibi ve dönüşüm analizi</p>

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

      <section className={styles.grid4} aria-label="Gelir özeti">
        <StatCard label="Toplam Gelir" value={formatTry(12450)} icon="◆" />
        <StatCard label="Yeni Premium" value={18} icon="✦" accent="#ffc832" />
        <StatCard label="Dönüşüm" value="4.2%" icon="◎" accent="#50c878" />
        <StatCard label="Ortalama Gelir/Kullanıcı" value={formatTry(38)} icon="◇" />
      </section>

      <div className={pageStyles.chartWrap}>
        <h2 className={pageStyles.chartTitle}>Günlük Gelir</h2>
        <div className={pageStyles.barChart} role="img" aria-label="Son 7 gün günlük gelir">
          {BAR_VALUES.map((value, i) => (
            <div key={`${BAR_DAY_LABELS[i]}-${i}`} className={pageStyles.barCol}>
              <div
                className={pageStyles.bar}
                style={{ height: `${(value / BAR_MAX) * 100}%` }}
              >
                <span className={pageStyles.barValue}>{formatTry(value)}</span>
                <span className={pageStyles.barLabel}>{BAR_DAY_LABELS[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={pageStyles.chartWrap}>
        <h2 className={pageStyles.chartTitle}>Premium Dönüşüm Hunisi</h2>
        <div className={pageStyles.funnel}>
          {FUNNEL_STEPS.map((step) => {
            const widthPct = (step.count / FUNNEL_BASE) * 100;
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
                  <span className={pageStyles.funnelCount}>
                    {step.count.toLocaleString("tr-TR")}
                  </span>
                  {step.pct != null ? (
                    <span className={pageStyles.funnelPct}>{step.pct}</span>
                  ) : (
                    <span className={pageStyles.funnelPct}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={pageStyles.chartWrap}>
        <h2 className={pageStyles.chartTitle}>Ürün Performansı</h2>
        <div className={styles.tableWrap}>
          <table className={pageStyles.perfTable}>
            <thead>
              <tr>
                <th scope="col">Ürün</th>
                <th scope="col">Görüntülenme</th>
                <th scope="col">Dönüşüm</th>
                <th scope="col">Gelir</th>
                <th scope="col">Dönüşüm oranı</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PRODUCTS.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.views.toLocaleString("tr-TR")}</td>
                  <td>{row.conversions.toLocaleString("tr-TR")}</td>
                  <td>{formatTry(row.revenue)}</td>
                  <td>{row.conversionRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
