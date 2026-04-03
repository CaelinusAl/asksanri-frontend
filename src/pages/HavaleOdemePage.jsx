import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchBankTransferPreview,
  submitBankTransferRequest,
  fetchBankTransferStatus,
  verifyBankTransferInstant,
} from "../data/bankTransferApi";
import { resolveBankDisplay } from "../data/bankTransferDisplayEnv";
import {
  applyVerifiedShopierUnlock,
  fetchShopierPurchaseCheck,
  getDeviceFingerprint,
  syncPurchasesFromServer,
} from "../data/shopierConfig";
import styles from "./HavaleOdemePage.module.css";

export default function HavaleOdemePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contentId = (searchParams.get("content_id") || "").trim();
  const returnPath = searchParams.get("return") || "/";

  const [phase, setPhase] = useState("loading");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [submittedAmount, setSubmittedAmount] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const [benimAlanimMsg, setBenimAlanimMsg] = useState("");

  useEffect(() => {
    if (!contentId) {
      setError("Geçersiz bağlantı: content_id eksik.");
      setPhase("error");
      return;
    }
    try {
      console.info("[SANRI havale-odeme] URL’den content_id ile önizleme", {
        received_content_id: contentId,
      });
    } catch {
      /* ignore */
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await fetchBankTransferPreview(contentId);
        if (!cancelled) {
          setPreview(p);
          setPhase("ready");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Ön bilgi alınamadı.");
          setPhase("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contentId]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!preview || !receipt) return;
      setSubmitting(true);
      setError("");
      try {
        await submitBankTransferRequest({
          name,
          email,
          contentId,
          transferCode: preview.transfer_code,
          receiptFile: receipt,
        });
        setSubmittedEmail(email.trim().toLowerCase());
        setSubmittedCode(preview.transfer_code);
        setSubmittedAmount(
          typeof preview.amount === "number" ? preview.amount : parseFloat(preview.amount),
        );
        setPhase("submitted");
      } catch (err) {
        setError(err.message || "Gönderilemedi.");
      } finally {
        setSubmitting(false);
      }
    },
    [preview, name, email, contentId, receipt]
  );

  const checkStatus = useCallback(async () => {
    if (!submittedEmail || !submittedCode) return;
    setStatusLoading(true);
    setStatusMsg("");
    try {
      const s = await fetchBankTransferStatus(submittedEmail, submittedCode);
      if (s.found) {
        setStatusMsg(s.message_tr || s.status);
        if (s.status === "approved") {
          await syncPurchasesFromServer();
          setBenimAlanimMsg(
            "Ders ve ilerlemen Benim Alanım’da: Öğrendiklerim ve Satın aldıklarım bölümlerinden takip edebilirsin.",
          );
        }
      } else {
        setStatusMsg("Kayıt bulunamadı — e-posta ve kodu kontrol et.");
      }
    } catch (err) {
      setStatusMsg(err.message || "Durum alınamadı.");
    } finally {
      setStatusLoading(false);
    }
  }, [submittedEmail, submittedCode]);

  const instantVerify = useCallback(async () => {
    if (!submittedEmail || !submittedCode || submittedAmount == null || Number.isNaN(submittedAmount)) {
      return;
    }
    setVerifyLoading(true);
    setVerifyMsg("");
    try {
      const fp = getDeviceFingerprint();
      const v = await verifyBankTransferInstant({
        transferCode: submittedCode,
        amount: submittedAmount,
        email: submittedEmail,
        deviceFp: fp && fp !== "anon" ? fp : undefined,
      });
      const tr =
        v.message_tr ||
        (v.approved ? "Ödeme onaylandı." : v.temp_unlock ? "Geçici erişim verildi." : "");
      setVerifyMsg(tr);
      const benim = v.benim_alanim_message_tr || "";
      if (benim) setBenimAlanimMsg(benim);
      if (v.approved || v.temp_unlock) {
        const chk = await fetchShopierPurchaseCheck(contentId, submittedEmail);
        if (chk.unlocked) {
          applyVerifiedShopierUnlock(
            contentId,
            chk.purchased_at || chk.purchase?.purchased_at,
          );
        }
        await syncPurchasesFromServer();
      }
    } catch (err) {
      setVerifyMsg(err.message || "Doğrulama başarısız.");
    } finally {
      setVerifyLoading(false);
    }
  }, [submittedEmail, submittedCode, submittedAmount, contentId]);

  if (phase === "loading") {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Yükleniyor…</div>
      </div>
    );
  }

  if (phase === "error" && !preview) {
    return (
      <div className={styles.page}>
        <div className={styles.topbar}>
          <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Geri
          </button>
        </div>
        <div className={styles.shell}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate(returnPath || "/")}>
          ← Geri
        </button>
        <span className={styles.badge}>Havale / EFT</span>
      </div>

      <div className={styles.shell}>
        <h1 className={styles.h1}>Havale / EFT ile ödeme</h1>
        <p className={styles.lead}>
          Kart kullanmak istemiyorsan bu yolu kullanabilirsin. Tutar ve açıklama kodu eşleştiğinde
          kaydın manuel olarak kontrol edilir; onay sonrası erişimin tanımlanır.
        </p>

        <ul className={styles.trustList} aria-label="Ödeme süreci">
          <li>
            <span className={styles.trustMark} aria-hidden />
            <span>
              <strong>Ödeme manuel kontrol edilir</strong> — dekont ve banka hareketi incelenir.
            </span>
          </li>
          <li>
            <span className={styles.trustMark} aria-hidden />
            <span>
              <strong>Açıklama kodunu EFT açıklamasına aynen yaz</strong> — başka metin ekleme.
            </span>
          </li>
          <li>
            <span className={styles.trustMark} aria-hidden />
            <span>
              <strong>Dekont yükledikten sonra onay beklenir</strong> — kısa sürede sonuçlanır.
            </span>
          </li>
        </ul>

        {phase === "ready" && preview && (
          <>
            <div className={styles.card}>
              <p className={styles.cardTitle}>1 · Havale bilgileri</p>
              {(() => {
                const bank = resolveBankDisplay(preview);
                return (
                  <>
                    <pre className={styles.plainBlock}>
                      {`IBAN: ${bank.iban || "—"}
Banka: ${bank.bankName || "—"}
Alıcı: ${bank.accountName || "—"}`}
                    </pre>
                    {preview.iban_label ? (
                      <p className={styles.plainMeta}>Hesap etiketi: {preview.iban_label}</p>
                    ) : null}
                    <div className={styles.row}>
                      <div className={styles.label}>Tutar (tam)</div>
                      <div className={styles.amount}>{preview.amount} TL</div>
                    </div>
                    <div className={styles.descBlock}>
                      <div className={styles.descLabel}>Açıklama</div>
                      <div className={styles.codeBox}>{preview.transfer_code}</div>
                      <p className={styles.descHint}>
                        Bu kod benzersizdir — yalnızca senin işlemin için geçerlidir; başka kod kullanma.
                      </p>
                    </div>
                    {preview.qr_png_base64 ? (
                      <div className={styles.qrBlock}>
                        <p className={styles.qrTitle}>QR ile ödeme</p>
                        <img
                          className={styles.qrImg}
                          src={`data:image/png;base64,${preview.qr_png_base64}`}
                          alt="Ödeme QR kodu"
                          width={220}
                          height={220}
                        />
                        {preview.qr_hint_tr ? (
                          <p className={styles.qrHint}>{preview.qr_hint_tr}</p>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                );
              })()}
              <p className={styles.note}>{preview.instructions_tr}</p>
            </div>

            <div className={styles.divider}>Bildirim formu</div>

            {error ? <div className={styles.error}>{error}</div> : null}

            <form className={styles.card} onSubmit={onSubmit}>
              <p className={styles.cardTitle}>2 · Dekont yükle</p>
              <div className={styles.formGrid}>
                <div>
                  <div className={styles.label}>Ürün</div>
                  <input
                    className={styles.input}
                    value={preview.product_name}
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <div className={styles.label}>Ad soyad</div>
                  <input
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                <div>
                  <div className={styles.label}>E-posta (erişim bu adrese tanımlanır)</div>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div>
                  <div className={styles.label}>Açıklama kodu</div>
                  <input
                    className={styles.input}
                    value={preview.transfer_code}
                    disabled
                    readOnly
                  />
                </div>
                <div>
                  <div className={styles.label}>Dekont (JPG, PNG veya WebP)</div>
                  <input
                    className={styles.fileInput}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    required
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={submitting || !receipt}>
                {submitting ? "Gönderiliyor…" : "Bildirimi gönder"}
              </button>
            </form>
          </>
        )}

        {phase === "submitted" && (
          <>
            <div className={styles.success} role="status">
              <p className={styles.successTitle}>Tamam</p>
              <p className={styles.successBody}>
                Ödeme bildirimin alındı. Kontrol sonrası erişimin açılacak.
              </p>
            </div>
            <div className={styles.card}>
              <p className={styles.cardTitle}>Durum</p>
              <p className={styles.note}>
                Ödemeyi yaptıysan aşağıdan anında doğrulamayı dene (banka sinyali eşleşirse erişim hemen
                açılır). Aksi halde 15 dakikalık geçici erişim verilebilir; kalıcı onay için dekont
                kontrolü sürer.
              </p>
              <div className={styles.statusBox}>
                <button
                  type="button"
                  className={styles.verifyBtn}
                  onClick={instantVerify}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? "Doğrulanıyor…" : "Ödedim / Anında doğrula"}
                </button>
                {verifyMsg ? <p className={styles.note}>{verifyMsg}</p> : null}
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={checkStatus}
                  disabled={statusLoading}
                >
                  {statusLoading ? "Kontrol ediliyor…" : "Durumu kontrol et"}
                </button>
                {statusMsg ? <p className={styles.note}>{statusMsg}</p> : null}
              </div>
              {benimAlanimMsg ? (
                <p className={styles.benimAlanim}>
                  {benimAlanimMsg}{" "}
                  <Link className={styles.benimLink} to="/benim-alanim">
                    Benim Alanım’a git
                  </Link>
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
