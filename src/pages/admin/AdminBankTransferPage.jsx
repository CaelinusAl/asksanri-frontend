import React, { useCallback, useEffect, useState } from "react";
import {
  fetchBankTransfers,
  fetchBankTransferDetail,
  approveBankTransfer,
  rejectBankTransfer,
} from "../../data/adminApi";
import styles from "./AdminBankTransferPage.module.css";

export default function AdminBankTransferPage() {
  const [filter, setFilter] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState(null);
  const [rejectNote, setRejectNote] = useState("");
  const [busy, setBusy] = useState(false);

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

  return (
    <div className={styles.page}>
      <h1 className={styles.h1}>Banka ödemeleri (Havale / EFT)</h1>
      <p className={styles.sub}>
        Manuel onay: onaylandığında shopier_purchases ile aynı içerik kilidi açılır (e-posta +
        cihaz kontrolü).
      </p>

      {error ? <div className={styles.error}>{error}</div> : null}

      <div className={styles.filters}>
        {["pending", "approved", "rejected", ""].map((f) => (
          <button
            key={f || "all"}
            type="button"
            className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "" ? "Tümü" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.sub}>Yükleniyor…</p>
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
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={7}>
                    Kayıt yok.
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id}>
                    <td className={styles.td}>{r.id}</td>
                    <td className={styles.td}>
                      <span className={`${styles.statusP} ${statusClass(r.status)}`}>{r.status}</span>
                    </td>
                    <td className={styles.td}>{r.transfer_code}</td>
                    <td className={styles.td}>{r.email}</td>
                    <td className={styles.td}>{r.amount}</td>
                    <td className={styles.td}>{r.content_id}</td>
                    <td className={styles.td}>
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
            <p className={styles.sub}>content_id: {detail.content_id}</p>
            {detail.receipt_file_url ? (
              <img
                className={styles.receiptImg}
                src={detail.receipt_file_url}
                alt="Dekont"
              />
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
                    Onayla — erişim aç
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
                <p className={styles.sub}>Durum: {detail.status}</p>
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
