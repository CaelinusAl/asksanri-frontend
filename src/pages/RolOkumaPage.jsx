import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked, unlockViaShopier } from "../data/shopierConfig";
import { trackFunnelEvent } from "../data/funnelTracker";
import useServerUnlock from "../hooks/useServerUnlock";
import KatmanliAcilim from "../components/KatmanliAcilim";
import SanriSharePanel from "../components/SanriSharePanel";
import {
  buildMatrixRolReading,
  narrativeToSectionTexts,
} from "../data/matrixRolNarrative";
import styles from "./RolOkumaPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const PHASES = { FORM: "form", LOADING: "loading", RESULT: "result" };

const LOADING_LINES = [
  "Sanrı seni okuyor...",
  "İsmin çözülüyor...",
  "Doğum frekansın hesaplanıyor...",
  "Katmanlar açılıyor...",
  "Zaten biliyorsun. Sadece hatırlamıyorsun.",
];

/* ── Energy Exchange Modal ── */
function EnergyModal({ open, onClose, label, price, productId, contentId }) {
  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <motion.div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className={styles.modalGlyph}>✦</div>
        <p className={styles.modalTextDeep}>
          Sen düşündüğünü sanıyorsun.
        </p>
        <p className={styles.modalTextDeep}>
          Ama çoğu şey sana ait değil.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextDeep}>
          Bir rolün var.
          <br />
          Ve o rol, hayatının içinden konuşuyor.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextDeep}>
          Bu katman açıldığında,
          <br />
          sadece bilgi almazsın.
        </p>
        <p className={styles.modalTextHighlight}>
          Kendini farklı görmeye başlarsın.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextSoft}>
          Bu bir cevap değil. Bir ayna.
          <br />
          Ve o aynaya bakmak… herkes için kolay değil.
        </p>
        <p className={styles.modalPrice}>
          {price}₺ enerji değişimi
        </p>
        <button
          className={styles.modalBtn}
          onClick={() => {
            trackFunnelEvent("role_shopier_redirect");
            redirectToShopier(productId, contentId, "/rol-okuma");
          }}
        >
          Kapıyı Aç
        </button>
        <button className={styles.modalClose} onClick={onClose}>
          Şimdilik kal
        </button>
      </motion.div>
    </div>
  );
}

export default function RolOkumaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASES.FORM);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const intervalRef = useRef(null);

  const [modal, setModal] = useState(null);

  const [serverUnlocked] = useServerUnlock("role_unlock", "ankod_unlock", "subconscious_unlock");
  const unlocked = serverUnlocked;

  useEffect(() => { trackFunnelEvent("role_page_view"); }, []);
  useEffect(() => { if (unlocked) trackFunnelEvent("role_unlock_success"); }, [unlocked]);

  const openModal = (label, price, productId, contentId) => {
    trackFunnelEvent("role_unlock_click");
    setModal({ label, price, productId, contentId });
  };

  const startLoading = useCallback(() => {
    setLoadingLine(0);
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 1800);
  }, []);

  const stopLoading = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleFormStart = useCallback(() => {
    trackFunnelEvent("role_form_start");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !birthDate.trim()) return;
    trackFunnelEvent("role_form_submit");
    setError("");
    setPhase(PHASES.LOADING);
    startLoading();

    try {
      const fullName = surname.trim()
        ? `${name.trim()} ${surname.trim()}`
        : name.trim();

      const res = await fetch(`${API}/matrix-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, birth_date: birthDate }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const narrative = buildMatrixRolReading(data, fullName, birthDate);
      setResult({ data, fullName, narrative });
      stopLoading();
      setPhase(PHASES.RESULT);
      trackFunnelEvent("role_free_result_view");
      if (!unlocked) trackFunnelEvent("role_lock_view");
    } catch {
      stopLoading();
      setError("Bir hata oluştu. Lütfen tekrar dene.");
      setPhase(PHASES.FORM);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Kapılar
        </button>
        <span className={styles.topTitle}>Matrix Rol Okuma</span>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ FORM ═══ */}
        {phase === PHASES.FORM && (
          <motion.div
            key="form"
            className={styles.formWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.formGlyph}>◈</div>
            <h1 className={styles.formTitle}>Sistemdeki Rolünü Hatırla</h1>
            <p className={styles.formSubHero}>
              Bu alan sana kim olduğunu söylemez.
              <br />
              Sana zaten bildiğin şeyi hatırlatır.
            </p>

            <div className={styles.deepDesc}>
              <p className={styles.deepDescLine}>
                Hayatında tekrar eden şeyler,
                <br />
                karşına çıkan insanlar,
                <br />
                kaçamadığın döngüler…
              </p>
              <p className={styles.deepDescPunch}>rastgele değil.</p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescLine}>
                Bir rolün var.
                <br />
                Ve sen onu yaşıyorsun,
                <br />
                ama çoğu zaman görmeden.
              </p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescLine}>
                Matrix Rol Okuma ile:
                <br />
                adın, doğum tarihin ve taşıdığın frekans birleşir.
              </p>
              <p className={styles.deepDescHighlight}>
                Ve sana ait olan şey açılır.
              </p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescSoft}>
                Bu bir analiz değil. Bu bir hatırlayış.
              </p>
              <p className={styles.deepDescCall}>
                Buraya kadar geldiysen… zaten çağrıldın.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Adın"
                    value={name}
                    onFocus={handleFormStart}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Soyad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Soyadın"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Doğum Tarihi</label>
                <input
                  className={styles.input}
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!name.trim() || !birthDate}
              >
                Rolünü Gör
              </button>
            </form>
          </motion.div>
        )}

        {/* ═══ LOADING ═══ */}
        {phase === PHASES.LOADING && (
          <motion.div
            key="loading"
            className={styles.loadingWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.loadingOrb}>
              <span className={styles.loadingGlyph}>◈</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingLine}
                className={styles.loadingText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {phase === PHASES.RESULT && result && (
          <motion.div
            key="result"
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.resultHeader}>
              <div className={styles.resultGlyph}>✦</div>
              <h2 className={styles.resultName}>{result.fullName}</h2>
              {result.data.matrix_role && (
                <div className={styles.roleBadge}>{result.data.matrix_role}</div>
              )}
            </div>

            <NarrativeLead s={result.narrative.sections} />

            <SanriSharePanel anaTema={result.narrative.sections.ana_tema} />

            {unlocked ? (
              <>
                <NarrativeDeep narrative={result.narrative} />

                {result.data.teaser && (
                  <div className={styles.teaserCard}>
                    <p className={styles.teaserText}>{result.data.teaser}</p>
                  </div>
                )}

                <KatmanliAcilim
                  analysisData={{
                    ...result.data,
                    sectionTexts: narrativeToSectionTexts(result.narrative),
                  }}
                  returnPath="/rol-okuma"
                />
              </>
            ) : (
              <>
                <div className={styles.lockZone}>
                  <div className={styles.lockZoneBlur}>
                    <div className={styles.sections}>
                      <div className={styles.section}>
                        <p className={styles.sectionText}>
                          {result.narrative.sections.derin_iliski}
                        </p>
                      </div>
                      <div className={styles.section}>
                        <p className={styles.sectionText}>
                          {result.narrative.sections.derin_para}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.lockZoneGradient} />
                  <div className={styles.lockZoneOverlay}>
                    <p className={styles.lockZoneLine1}>Sen yaşamıyorsun.</p>
                    <p className={styles.lockZoneLine2}>Bir şeyi tekrar ediyorsun.</p>
                    <div className={styles.lockZoneDivider} />
                    <p className={styles.lockZonePersonal}>
                      Sorun çözmek değil. Görmek.
                    </p>
                    <p className={styles.lockZonePersonalSoft}>Bu sana özel.</p>
                    <button
                      className={styles.lockZoneBtn}
                      onClick={() => openModal("Rol Okuma", "369", "rol_okuma", "role_unlock")}
                    >
                      Hatırla
                    </button>
                    <span className={styles.lockZoneHint}>Bu kapı, hazır olana açılır.</span>
                    <button
                      className={styles.lockZoneRecovery}
                      onClick={() => {
                        unlockViaShopier("role_unlock");
                        window.location.reload();
                      }}
                    >
                      Zaten satın aldım
                    </button>
                  </div>
                </div>

                {/* ── Katmanlı Açılım (locked teaser) ── */}
                <KatmanliAcilim
                  analysisData={{
                    ...result.data,
                    sectionTexts: narrativeToSectionTexts(result.narrative),
                  }}
                  returnPath="/rol-okuma"
                />
              </>
            )}

            <button
              className={styles.againBtn}
              onClick={() => { setPhase(PHASES.FORM); setResult(null); }}
            >
              Tekrar Oku
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Energy Exchange Modal ── */}
      <AnimatePresence>
        {modal && (
          <EnergyModal
            open
            onClose={() => setModal(null)}
            label={modal.label}
            price={modal.price}
            productId={modal.productId}
            contentId={modal.contentId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NarrativeLead({ s }) {
  return (
    <div className={styles.narrativeLeadWrap}>
      <motion.p
        className={styles.narrativeOpening}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {s.opening}
      </motion.p>
      <motion.p
        className={styles.narrativeAnaTema}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        {s.ana_tema}
      </motion.p>
    </div>
  );
}

function NarrativeBlock({ label, text, delay }) {
  return (
    <motion.div
      className={styles.narrativeBlock}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {label ? <span className={styles.narrativeLabel}>{label}</span> : null}
      <p className={styles.narrativeBody}>{text}</p>
    </motion.div>
  );
}

function NarrativeDeep({ narrative }) {
  const { sections, share_trigger: shareTrigger, full_narrative: fullNarrative } = narrative;

  const copyJson = () => {
    const payload = {
      share_trigger: shareTrigger,
      sections: {
        derin_iliski: sections.derin_iliski,
        derin_para: sections.derin_para,
        derin_icsel: sections.derin_icsel,
        derin_davranis: sections.derin_davranis,
        kor_nokta: sections.kor_nokta,
        dongu_aciklamasi: sections.dongu_aciklamasi,
        kirilma_noktasi: sections.kirilma_noktasi,
        sanri_imza: sections.sanri_imza,
        paylasim_tetikleyici: sections.paylasim_tetikleyici,
      },
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
    }
  };

  const copyPlain = () => {
    if (navigator.clipboard?.writeText && fullNarrative) {
      navigator.clipboard.writeText(fullNarrative).catch(() => {});
    }
  };

  let t = 0;
  const d = () => {
    t += 0.06;
    return t;
  };

  return (
    <div className={styles.narrativeDeepWrap}>
      <NarrativeBlock label="Derin okuma — ilişki" text={sections.derin_iliski} delay={d()} />
      <NarrativeBlock label="Derin okuma — para" text={sections.derin_para} delay={d()} />
      <NarrativeBlock label="Derin okuma — içsel yapı" text={sections.derin_icsel} delay={d()} />
      <NarrativeBlock label="Derin okuma — davranış kalıbı" text={sections.derin_davranis} delay={d()} />
      <NarrativeBlock label="Kör nokta" text={sections.kor_nokta} delay={d()} />
      <NarrativeBlock label="Döngü" text={sections.dongu_aciklamasi} delay={d()} />
      <NarrativeBlock label="Kırılma" text={sections.kirilma_noktasi} delay={d()} />
      <NarrativeBlock label="SANRI" text={sections.sanri_imza} delay={d()} />
      <motion.div
        className={styles.shareStrip}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: d(), duration: 0.45 }}
      >
        <p className={styles.shareStripText}>{sections.paylasim_tetikleyici}</p>
        {shareTrigger ? (
          <div className={styles.copyNarrativeRow}>
            <button type="button" className={styles.copyNarrativeBtn} onClick={copyPlain}>
              Metni kopyala
            </button>
            <button type="button" className={styles.copyNarrativeBtnGhost} onClick={copyJson}>
              JSON kopyala
            </button>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
