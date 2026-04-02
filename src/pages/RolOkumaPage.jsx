import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked } from "../data/shopierConfig";
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

const FREE_SECTION_COUNT = 2;

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
          onClick={() => redirectToShopier(productId, contentId, "/rol-okuma")}
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

  const unlocked = isShopierUnlocked("role_unlock") || isShopierUnlocked("ankod_unlock") || isShopierUnlocked("subconscious_unlock");

  const openModal = (label, price, productId, contentId) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !birthDate.trim()) return;
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

      const sections = buildSections(data, fullName);
      setResult({ data, sections, fullName });
      stopLoading();
      setPhase(PHASES.RESULT);
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

            {/* ── Free sections ── */}
            <div className={styles.sections}>
              {result.sections.slice(0, FREE_SECTION_COUNT).map((sec, i) => (
                <motion.div
                  key={sec.title}
                  className={styles.section}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <div className={styles.sectionIcon}>{sec.icon}</div>
                  <h3 className={styles.sectionTitle}>{sec.title}</h3>
                  <p className={styles.sectionText}>{sec.text}</p>
                </motion.div>
              ))}
            </div>

            {unlocked ? (
              <>
                {/* ── Full unlocked sections ── */}
                <div className={styles.sections}>
                  {result.sections.slice(FREE_SECTION_COUNT).map((sec, i) => (
                    <motion.div
                      key={sec.title}
                      className={styles.section}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (i + FREE_SECTION_COUNT), duration: 0.4 }}
                    >
                      <div className={styles.sectionIcon}>{sec.icon}</div>
                      <h3 className={styles.sectionTitle}>{sec.title}</h3>
                      <p className={styles.sectionText}>{sec.text}</p>
                    </motion.div>
                  ))}
                </div>

                {result.data.teaser && (
                  <div className={styles.teaserCard}>
                    <p className={styles.teaserText}>{result.data.teaser}</p>
                  </div>
                )}

                {/* ── Upsell ── */}
                <div className={styles.ctaSection}>
                  <p className={styles.ctaLine}>Bu bir analiz değil. Bir hatırlayış.</p>
                  <div className={styles.ctaBtns}>
                    <div className={styles.ctaItem}>
                      <p className={styles.ctaQuestion}>
                        İlişkilerinde neden hep aynı şeyi yaşıyorsun?
                      </p>
                      <button
                        className={styles.ctaSoft}
                        onClick={() => openModal("İlişki Katmanı", "369", "iliski_acilimi", "iliski_acilimi")}
                      >
                        Bunu açabilirsin.
                      </button>
                    </div>
                    <div className={styles.ctaItem}>
                      <p className={styles.ctaQuestion}>
                        Para neden sana akmıyor?
                      </p>
                      <button
                        className={styles.ctaSoft}
                        onClick={() => openModal("Para Akışı Katmanı", "369", "para_akisi", "para_akisi")}
                      >
                        Bunu açabilirsin.
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ── Locked blur zone ── */}
                <div className={styles.lockZone}>
                  <div className={styles.lockZoneBlur}>
                    <div className={styles.sections}>
                      {result.sections.slice(FREE_SECTION_COUNT, FREE_SECTION_COUNT + 2).map((sec) => (
                        <div key={sec.title} className={styles.section}>
                          <div className={styles.sectionIcon}>{sec.icon}</div>
                          <h3 className={styles.sectionTitle}>{sec.title}</h3>
                          <p className={styles.sectionText}>{sec.text}</p>
                        </div>
                      ))}
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
                  </div>
                </div>

                {/* ── Upsell teaser ── */}
                <div className={styles.ctaSection}>
                  <p className={styles.ctaLine}>Zaten biliyorsun. Sadece hatırlamıyorsun.</p>
                  <div className={styles.ctaBtns}>
                    <div className={styles.ctaItem}>
                      <p className={styles.ctaQuestion}>
                        İlişkilerinde neden hep aynı şeyi yaşıyorsun?
                      </p>
                      <button
                        className={styles.ctaSoft}
                        onClick={() => openModal("İlişki Katmanı", "369", "iliski_acilimi", "iliski_acilimi")}
                      >
                        Bunu açabilirsin.
                      </button>
                    </div>
                    <div className={styles.ctaItem}>
                      <p className={styles.ctaQuestion}>
                        Para neden sana akmıyor?
                      </p>
                      <button
                        className={styles.ctaSoft}
                        onClick={() => openModal("Para Akışı Katmanı", "369", "para_akisi", "para_akisi")}
                      >
                        Bunu açabilirsin.
                      </button>
                    </div>
                  </div>
                </div>
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

function buildSections(data, fullName) {
  const role = data.matrix_role || "Bilinmiyor";
  const nameNum = data.name_number || 0;
  const lifePath = data.life_path || 0;
  const nameArch = data.name_archetype || "";
  const lpArch = data.life_path_archetype || "";

  return [
    {
      icon: "◈",
      title: "Rol Tanımı",
      text: `${fullName} — senin Matrix'teki rolün: ${role}. Bu, senin bu yaşamda taşıdığın enerji imzası. Bir kimlik değil, bir frekans.`,
    },
    {
      icon: "⟁",
      title: "Ana Tema",
      text: `Yaşam yolun ${lifePath} numarasını taşıyor: ${lpArch}. Bu sayı hayatının ana akışını belirler. Seni buraya getiren tesadüf değil — bir çağrı.`,
    },
    {
      icon: "✦",
      title: "Güç Alanı",
      text: `İsmin ${nameNum} frekansında titreşiyor: ${nameArch}. Bu senin doğal gücün. Zorlamadan aktığın, etrafındakilerin fark ettiği ama senin hafife aldığın şey.`,
    },
    {
      icon: "◉",
      title: "İçsel Çatışma",
      text: `Her güç bir gölge taşır. ${nameNum} frekansının gölgesi seni zaman zaman yorabilir. Bu gölge düşmanın değil — sana ayna tutan parçan.`,
    },
    {
      icon: "☽",
      title: "Kör Nokta",
      text: `Göremediğin alan genellikle en çok güvendiğin alanın tam karşısında durur. ${lifePath} yolunda yürürken, duymayı seçmediğin bir ses var. O sesi duymak cesaret ister.`,
    },
    {
      icon: "∞",
      title: "Döngü Yorumu",
      text: `Hayatında tekrar eden kalıplar var mı? ${role} rolü belirli döngüleri tekrarlatır — ta ki fark edene kadar. Fark ettiğin an, döngü kırılır.`,
    },
    {
      icon: "✧",
      title: "SANRI Mesajı",
      text: `"${fullName}, bu bir analiz değil. Bu bir hatırlayış. Zaten biliyorsun. Sadece hatırlamıyorsun. Ve şimdi, hatırlama zamanı."`,
    },
  ];
}
