import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchBankTransfers,
  fetchBankTransferDetail,
  approveBankTransfer,
  rejectBankTransfer,
} from "../../data/adminApi";
import styles from "./AdminBankTransferPage.module.css";

const FILTERS = [
  { value: "pending", label: "Bekleyen" },
  { value: "approved", label: "Onaylı" },
  { value: "rejected", label: "Red" },
  { value: "", label: "Tümü" },
];

const STATUS_TR = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

const NEW_PENDING_MS = 48 * 60 * 60 * 1000;

function statusLabelTr(s) {
  return STATUS_TR[s] || s || "—";
}

function formatWhen(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  if (diff < 0) return d.toLocaleString("tr-TR");
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h} sa önce`;
  return d.toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function isFreshPending(row) {
  if (row.status !== "pending") return false;
  const d = new Date(row.created_at);
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() - d.getTime() < NEW_PENDING_MS;
}

export default function AdminBankTransferPage() {
  const [filter, setFilter] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [busy, setBusy] = useState(false);

  const pendingCount = useMemo(
    () => items.filter((r) => r.status === "pending").length,
    [items]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBankTransfers(filter || null);
      setItems(data.items || []);
    } catch (e) {
      setError(e.message || "Liste alınamadı");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (id) => {
    setError("");
    try {
      const row = await fetchBankTransferDetail(id);
      setDetail(row);
      setRejectNote("");
    } catch (e) {
      setError(e.message || "Detay yüklenemedi");
    }
  };

  const onApprove = async () => {
    if (!detail?.id) return;
    setBusy(true);
    try {
      await approveBankTransfer(detail.id);
      setDetail(null);
      await load();
    } catch (e) {
      setError(e.message || "Onaylanamadı");
    } finally {
      setBusy(false);
    }
  };

  const onReject = async () => {
    if (!detail?.id) return;
    setBusy(true);
    try {
      await rejectBankTransfer(detail.id, rejectNote);
      setDetail(null);
      await load();
    } catch (e) {
      setError(e.message || "Reddedilemedi");
    } finally {
      setBusy(false);
    }
  };

  const statusClass = (s) => {
    if (s === "pending") return styles.statusPending;
    if (s === "approved") return styles.statusApproved;
    if (s === "rejected") return styles.statusRejected;
    return "";
  };

  const rowClass = (r) => {
    const parts = [styles.tr];
    if (r.status === "pending") parts.push(styles.trPending);
    if (isFreshPending(r)) parts.push(styles.trNew);
    return parts.join(" ");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>Banka ödemeleri (Havale / EFT)</h1>
      <p className={styles.sub}>
        Durumlar: <strong>pending</strong> (beklemede) → <strong>approved</strong> (onaylı, içerik kilidi
        açılır) → <strong>rejected</strong> (red). Onayda <code>shopier_purchases</code> kaydı oluşturulur.
      </p>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.filters}>
        {FILTERS.map(({ value, label }) => (
          <button
            key={value || "all"}
            type="button"
            className={`${styles.filterBtn} ${filter === value ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
            {value === "pending" && filter === "pending" && pendingCount > 0 ? (
              <span className={styles.filterBadge}>{pendingCount}</span>
            ) : null}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.subMuted}>Yükleniyor…</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Durum</th>
                <th className={styles.th}>Kod</th>
                <th className={styles.th}>E-posta</th>
                <th className={styles.th}>Tutar</th>
                <th className={styles.th}>İçerik</th>
                <th className={styles.th}>Zaman</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr className={styles.tr}>
                  <td className={styles.td} colSpan={8}>
                    Kayıt yok.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id} className={rowClass(r)}>
                    <td className={styles.td} data-label="ID">
                      {r.id}
                      {isFreshPending(r) ? (
                        <span className={styles.newTag} title="Son 48 saat içinde, beklemede">
                          Yeni
                        </span>
                      ) : null}
                    </td>
                    <td className={styles.td} data-label="Durum">
                      <span className={`${styles.statusPill} ${statusClass(r.status)}`}>
                        {statusLabelTr(r.status)}
                      </span>
                      <span className={styles.statusCode}>{r.status}</span>
                    </td>
                    <td className={styles.td} data-label="Kod">
                      <code className={styles.mono}>{r.transfer_code}</code>
                    </td>
                    <td className={styles.td} data-label="E-posta">
                      {r.email}
                    </td>
                    <td className={styles.td} data-label="Tutar">
                      {r.amount} TL
                    </td>
                    <td className={styles.td} data-label="İçerik">
                      <code className={styles.monoSm}>{r.content_id}</code>
                    </td>
                    <td className={styles.td} data-label="Zaman">
                      {formatWhen(r.created_at)}
                    </td>
                    <td className={styles.td} data-label="İşlem">
                      <button type="button" className={styles.rowBtn} onClick={() => openDetail(r.id)}>
                        Detay
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {detail ? (
        <div className={styles.detailBackdrop} role="dialog" aria-modal="true">
          <div className={styles.detailCard}>
            <h2 className={styles.detailTitle}>Talep #{detail.id}</h2>
            <p className={styles.sub}>
              <strong>{detail.name}</strong> — {detail.email}
            </p>
            <p className={styles.sub}>
              {detail.product_name} · {detail.amount} TL · <code>{detail.transfer_code}</code>
            </p>
            <p className={styles.sub}>
              content_id: <code>{detail.content_id}</code>
            </p>
            <p className={styles.sub}>
              Durum:{" "}
              <span className={`${styles.statusPill} ${statusClass(detail.status)}`}>
                {statusLabelTr(detail.status)}
              </span>
            </p>
            {detail.receipt_file_url ? (
              <img className={styles.receiptImg} src={detail.receipt_file_url} alt="Dekont" />
            ) : (
              <p className={styles.sub}>Dekont yok</p>
            )}
            {detail.status === "pending" ? (
              <>
                <textarea
                  className={styles.noteInput}
                  placeholder="Red notu (isteğe bağlı)"
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={2}
                />
                <div className={styles.actions}>
                  <button type="button" className={styles.approveBtn} disabled={busy} onClick={onApprove}>
                    Onayla — erişim aç (unlock)
                  </button>
                  <button type="button" className={styles.rejectBtn} disabled={busy} onClick={onReject}>
                    Reddet
                  </button>
                  <button type="button" className={styles.closeBtn} onClick={() => setDetail(null)}>
                    Kapat
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.actions}>
                {detail.admin_note ? <p className={styles.sub}>Not: {detail.admin_note}</p> : null}
                <button type="button" className={styles.closeBtn} onClick={() => setDetail(null)}>
                  Kapat
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
