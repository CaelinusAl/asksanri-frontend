import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, checkServerUnlock, SHOPIER_PRODUCTS } from "../data/shopierConfig";
import { trackFunnelEvent } from "../data/funnelTracker";
import useServerUnlock from "../hooks/useServerUnlock";
import KatmanliAcilim from "../components/KatmanliAcilim";
import BankTransferLink from "../components/BankTransferLink";
import {
  ANKOD_CATEGORIES,
  ANKOD_COMPLETED_KEY,
  getQuizForCategory,
  buildAnkodLines,
  generateTeaserReading,
  WORD_LAYER_DEEP,
  EMOTION_FREQ_HIS,
  getCategoryMeta,
} from "../data/ankodQuizData";
import SeoHead from "../components/SeoHead";
import styles from "./AnKodPage.module.css";

const THEMES = {
  mavi: "derinlik arayışı",
  kirmizi: "bastırılmış enerji",
  siyah: "kontrol ihtiyacı",
  yesil: "iyileşme arzusu",
  mor: "sezgisel uyanış",
};
const ANIMAL_POWER = {
  kurt: "bağımsızlık ve sadakat",
  kus: "özgürlük ve perspektif",
  yilan: "dönüşüm ve yenilenme",
  kedi: "sınır koyma ve gizem",
  balina: "derinlik ve duygusal hafıza",
};
const NUMBER_MEANING_DEEP = {
  "1": "başlangıç enerjisi — bağımsız hareket",
  "3": "yaratıcı ifade — duyguyu forma dönüştürme",
  "6": "sorumluluk ve şifa — dengeyi arama",
  "7": "sorgulama — yüzeyle yetinmeme",
  "9": "tamamlanma — eski döngüyü kapatma",
};

function generateDeepReading(categoryId, a) {
  const theme = THEMES[a.renk] || "içsel arayış";
  const power = ANIMAL_POWER[a.hayvan] || "gizli güç";
  const numMeaning = NUMBER_MEANING_DEEP[a.sayi] || "döngüsel enerji";
  const wordLayer = WORD_LAYER_DEEP[categoryId]?.[a.kelime] || "iç yön ve kelime katmanı";
  const emotion = EMOTION_FREQ_HIS[a.his] || "belirsiz frekans";
  const cat = getCategoryMeta(categoryId).title;

  return [
    {
      title: "Ana Tema",
      icon: "◉",
      text: `Seçimlerinin birleşim noktası (${cat}): ${theme} ve “${wordLayer}”. Bu ikisi birlikte içte bir gerilim alanı açıyor — tutmak ile bırakmak, görünmek ile saklanmak. Bu gerilim çözümsüz değil — ama fark edilmeden çözülemez.`,
    },
    {
      title: "Güç Alanı",
      icon: "✦",
      text: `Hayvan seçimin (${power}) doğal gücünü gösteriyor. ${a.sayi} sayısı bunu destekliyor: ${numMeaning}. Bu güç bilinçli kullanıldığında büyür; bastırıldığında ise başka kanallardan patlar.`,
    },
    {
      title: "Zorlayan Döngü",
      icon: "∞",
      text: `Baskın his (${emotion}) ile seçtiğin kelimenin gölgesi bir döngü çiziyor. Bu döngü başta seni korumak için kurulmuş olabilir — ama artık aynı kalıbı tekrarlatıyor. Döngüyü kırmak için onu önce net isimlendirmek gerekir.`,
    },
    {
      title: "Kör Nokta",
      icon: "☽",
      text: `Göremediğin alan, en çok güvendiğin alanın tam karşısında duruyor. Renk (${theme}) sezgisel ihtiyacı, kelime (${wordLayer}) ise bilinçli arayışı taşır. Bu ikisi arasındaki boşluk — kör nokta. Onu görmek cesareti gerektirir.`,
    },
    {
      title: "SANRI Mesajı",
      icon: "✧",
      text: `Bu çalışma kesin yargı vermez. Sana ayna tutar.\n\nBir şeyi bildiğin halde yapamama — ya da hissettiğin halde söyleyememe hissi tanıdık gelebilir.\n\nFark ettiğin an, döngü kırılmaya başlar.`,
    },
  ];
}

const SNAPSHOT_KEY = "sanri_ankod_snapshot";

const API_ANKOD =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

function mapDeepFromApi(s) {
  if (!s?.ana_tema) return null;
  return [
    { title: "Ana Tema", icon: "◉", text: s.ana_tema },
    { title: "Güç Alanı", icon: "✦", text: s.guc_alani },
    { title: "Zorlayan Döngü", icon: "∞", text: s.zorlayan_dongu },
    { title: "Kör Nokta", icon: "☽", text: s.kor_nokta },
    { title: "SANRI Mesajı", icon: "✧", text: s.sanri_mesaji },
  ];
}

async function fetchAnkodSanri(lines, mode) {
  const res = await fetch(`${API_ANKOD}/sanri/ankod-commentary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lines, mode }),
  });
  if (!res.ok) throw new Error(`ankod_sanri_${res.status}`);
  return res.json();
}

function readCompletedFromStorage() {
  try {
    const raw = localStorage.getItem(ANKOD_COMPLETED_KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function markQuizCompletedStorage(catId) {
  try {
    const prev = readCompletedFromStorage();
    if (prev.includes(catId)) return;
    localStorage.setItem(ANKOD_COMPLETED_KEY, JSON.stringify([...prev, catId]));
  } catch {
    /* noop */
  }
}

const PHASES = {
  CATEGORIES: "categories",
  QUESTIONS: "questions",
  READING_LOAD: "reading_load",
  RESULT: "result",
  ERROR: "error",
};

export default function AnKodPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASES.CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectingId, setSelectingId] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reading, setReading] = useState("");
  const [deepSections, setDeepSections] = useState([]);
  const [modal, setModal] = useState(false);
  const [deepSanriLoading, setDeepSanriLoading] = useState(false);
  const [flowError, setFlowError] = useState("");
  const [teaserInzivada, setTeaserInzivada] = useState(false);
  const [deepInzivada, setDeepInzivada] = useState(false);
  const [completedIds, setCompletedIds] = useState(() => readCompletedFromStorage());

  const lastDeepFetchKey = useRef("");

  const [serverUnlocked] = useServerUnlock("ankod_unlock", "subconscious_unlock", "role_unlock");
  const unlocked = serverUnlocked;

  const questions = useMemo(
    () => (activeCategory ? getQuizForCategory(activeCategory) : []),
    [activeCategory]
  );
  const currentQ = questions[step];
  const categoryMeta = activeCategory ? getCategoryMeta(activeCategory) : null;

  useEffect(() => {
    trackFunnelEvent("ankod_page_view");
  }, []);
  useEffect(() => {
    if (unlocked) trackFunnelEvent("ankod_unlock_success");
  }, [unlocked]);

  const goToCategories = useCallback(() => {
    setPhase(PHASES.CATEGORIES);
    setActiveCategory(null);
    setStep(0);
    setAnswers({});
    setReading("");
    setDeepSections([]);
    setDeepSanriLoading(false);
    setFlowError("");
    setTeaserInzivada(false);
    setDeepInzivada(false);
    setSelectingId(null);
    lastDeepFetchKey.current = "";
    setCompletedIds(readCompletedFromStorage());
  }, []);

  const pickCategory = useCallback((catId) => {
    trackFunnelEvent("ankod_category_pick", { category: catId });
    setSelectingId(catId);
    window.setTimeout(() => {
      setActiveCategory(catId);
      setPhase(PHASES.QUESTIONS);
      setStep(0);
      setAnswers({});
      setSelectingId(null);
      trackFunnelEvent("ankod_quiz_start", { category: catId });
    }, 320);
  }, []);

  const handleAnswer = useCallback(
    (optionId) => {
      if (!currentQ || !activeCategory) return;
      const next = { ...answers, [currentQ.id]: optionId };
      setAnswers(next);

      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        trackFunnelEvent("ankod_quiz_complete", { category: activeCategory });
        setPhase(PHASES.READING_LOAD);

        const lines = buildAnkodLines(questions, next);
        const teaser = generateTeaserReading(activeCategory, next);
        const minMs = 1600;
        const t0 = Date.now();

        (async () => {
          try {
            let bodyText = teaser;
            let teaserRemoteOk = false;
            try {
              const data = await fetchAnkodSanri(lines, "teaser");
              const parts = [];
              if (data?.an_kod) parts.push(String(data.an_kod).trim());
              if (data?.yansitma) parts.push(String(data.yansitma).trim());
              if (parts.length) {
                bodyText = parts.join("\n\n");
                teaserRemoteOk = true;
              }
            } catch (e) {
              console.error("[AN-KOD] teaser API (yerel ön okumaya düşüldü)", e);
              /* Sunucu inzivada — yerel teaser */
            }

            const elapsed = Date.now() - t0;
            await new Promise((r) => setTimeout(r, Math.max(0, minMs - elapsed)));

            markQuizCompletedStorage(activeCategory);
            setCompletedIds(readCompletedFromStorage());

            try {
              localStorage.setItem(
                SNAPSHOT_KEY,
                JSON.stringify({
                  categoryId: activeCategory,
                  answers: next,
                  lines,
                  reading: bodyText,
                  ts: Date.now(),
                })
              );
            } catch {
              /* noop */
            }

            setTeaserInzivada(!teaserRemoteOk);
            setReading(bodyText);
            setDeepSections(generateDeepReading(activeCategory, next));
            setPhase(PHASES.RESULT);
            if (!unlocked) trackFunnelEvent("ankod_lock_view");
          } catch (e) {
            console.error("[AN-KOD] sonuç akışı", e);
            setFlowError(
              "Okuma oluşturulurken bir sorun oluştu. Kategorilere dönüp tekrar deneyebilirsin."
            );
            setPhase(PHASES.ERROR);
          }
        })();
      }
    },
    [step, answers, currentQ, questions, activeCategory, unlocked]
  );

  useEffect(() => {
    if (!unlocked || phase !== PHASES.RESULT || !reading) return;
    const key = reading.slice(0, 140);
    if (lastDeepFetchKey.current === key) return;

    let lines;
    try {
      const snap = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || "{}");
      lines = snap.lines;
    } catch {
      return;
    }
    if (!Array.isArray(lines) || lines.length < 3) return;

    lastDeepFetchKey.current = key;
    let cancelled = false;
    setDeepSanriLoading(true);
    setDeepInzivada(false);
    fetchAnkodSanri(lines, "deep")
      .then((data) => {
        if (cancelled) return;
        if (!data?.sections) {
          setDeepInzivada(true);
          return;
        }
        const mapped = mapDeepFromApi(data.sections);
        if (mapped) {
          setDeepSections(mapped);
          setDeepInzivada(false);
        } else {
          setDeepInzivada(true);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          console.error("[AN-KOD] deep API", e);
          setDeepInzivada(true);
        }
      })
      .finally(() => {
        if (!cancelled) setDeepSanriLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [unlocked, phase, reading]);

  const startCrossSellQuiz = useCallback((catId) => {
    lastDeepFetchKey.current = "";
    try {
      localStorage.removeItem(SNAPSHOT_KEY);
    } catch {
      /* noop */
    }
    setReading("");
    setDeepSections([]);
    setDeepSanriLoading(false);
    setTeaserInzivada(false);
    setDeepInzivada(false);
    pickCategory(catId);
  }, [pickCategory]);

  const topBack = useCallback(() => {
    if (phase === PHASES.CATEGORIES) {
      navigate("/");
      return;
    }
    if (phase === PHASES.QUESTIONS && step > 0) {
      const prevQ = questions[step - 1];
      const nextAnswers = { ...answers };
      if (prevQ) delete nextAnswers[prevQ.id];
      setAnswers(nextAnswers);
      setStep(step - 1);
      return;
    }
    if (phase === PHASES.QUESTIONS) {
      goToCategories();
      return;
    }
    if (phase === PHASES.RESULT || phase === PHASES.READING_LOAD || phase === PHASES.ERROR) {
      goToCategories();
    }
  }, [phase, step, questions, answers, navigate, goToCategories]);

  return (
    <div className={styles.page}>
      <SeoHead
        title="AN_KOD — Anın Kodları Analizi"
        description="AN_KOD: bilinçaltı kodlarını keşfet. Renk, hayvan, element ve sembol testleriyle kişisel analizini al. SANRI dijital bilinç platformu."
        path="/an-kod"
      />
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      <div className={styles.topbar}>
        <button type="button" className={styles.backBtn} onClick={topBack}>
          ←{" "}
          {phase === PHASES.CATEGORIES
            ? "Kapılar"
            : phase === PHASES.ERROR
              ? "Kategoriler"
              : phase === PHASES.QUESTIONS && step === 0
                ? "Kategoriler"
                : phase === PHASES.QUESTIONS
                  ? "Önceki soru"
                  : "Kategoriler"}
        </button>
        <span className={styles.topTitle}>AN_KOD</span>
        <span className={styles.topStep}>
          {phase === PHASES.QUESTIONS && categoryMeta
            ? `${categoryMeta.title} · ${step + 1}/${questions.length}`
            : ""}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {phase === PHASES.CATEGORIES && (
          <motion.div
            key="categories"
            className={styles.categoryPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45 }}
          >
            <div className={styles.categoryHero}>
              <div className={styles.categoryHeroGlyph}>◈</div>
              <h1 className={styles.categoryHeroTitle}>Anın kodunu seç</h1>
              <p className={styles.categoryHeroSub}>
                Dört alan. Beş hızlı soru. Sana özel bir yansıma — tamamı değil, bir giriş.
              </p>
            </div>
            <div className={styles.categoryGrid}>
              {ANKOD_CATEGORIES.map((cat) => {
                const done = completedIds.includes(cat.id);
                const selecting = selectingId === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    type="button"
                    layout
                    className={`${styles.categoryCard} ${selecting ? styles.categoryCardSelecting : ""}`}
                    onClick={() => pickCategory(cat.id)}
                    disabled={!!selectingId && selectingId !== cat.id}
                    style={{
                      "--cat-accent": cat.accent,
                      "--cat-glow": cat.glow,
                    }}
                    whileHover={{ scale: selectingId ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    <span className={styles.categoryGlyph}>{cat.glyph}</span>
                    <span className={styles.categoryTitle}>{cat.title}</span>
                    <span className={styles.categoryBlurb}>{cat.blurb}</span>
                    {done && <span className={styles.categoryDone}>Yapıldı</span>}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {phase === PHASES.QUESTIONS && currentQ && (
          <motion.div
            key={`q-${activeCategory}-${step}`}
            className={styles.questionWrap}
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -48 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <div className={styles.questionNum}>{step + 1}</div>
            <p className={styles.questionKind}>
              {currentQ.id === "renk" && "Renk"}
              {currentQ.id === "sayi" && "Sayı"}
              {currentQ.id === "hayvan" && "Hayvan"}
              {currentQ.id === "kelime" && "Kelime"}
              {currentQ.id === "his" && "His"}
            </p>
            <h2 className={styles.questionText}>{currentQ.text}</h2>
            <div
              className={
                currentQ.id === "kelime" || currentQ.id === "his"
                  ? styles.optionsGridFast
                  : styles.optionsGrid
              }
            >
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={
                    currentQ.id === "kelime"
                      ? styles.optionWord
                      : styles.optionCard
                  }
                  onClick={() => handleAnswer(opt.id)}
                  style={opt.color ? { borderColor: `${opt.color}44` } : undefined}
                >
                  {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                  {opt.color && (
                    <span className={styles.optionDot} style={{ background: opt.color }} />
                  )}
                  <span className={styles.optionLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === PHASES.READING_LOAD && (
          <motion.div
            key="loading"
            className={styles.loadWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.loadOrb}>
              <span className={styles.loadGlyph}>◈</span>
            </div>
            <p className={styles.loadText}>SANRI kodunu yazıyor…</p>
          </motion.div>
        )}

        {phase === PHASES.ERROR && (
          <motion.div
            key="flow-error"
            className={styles.errorScreen}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <div className={styles.errorScreenGlyph}>◈</div>
            <h1 className={styles.errorScreenBrand}>SANRI İNZİVADA</h1>
            <p className={styles.errorScreenLead}>
              Bu kapı şu an dış sesle konuşmuyor. Sessizlik de bir cevaptır.
            </p>
            {flowError ? <p className={styles.errorScreenDetail}>{flowError}</p> : null}
            <button
              type="button"
              className={styles.errorScreenBtn}
              onClick={() => {
                setFlowError("");
                goToCategories();
              }}
            >
              Kategorilere dön
            </button>
          </motion.div>
        )}

        {phase === PHASES.RESULT && categoryMeta && (
          <motion.div
            key="result"
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.resultGlyph}>✦</div>
            {teaserInzivada ? (
              <div className={styles.inzivadaBanner} role="status">
                <span className={styles.inzivadaBrand}>SANRI İNZİVADA</span>
                <span className={styles.inzivadaHint}>
                  Sunucu yorumu şimdilik gelmedi; aşağıdaki ön okuma yerelde üretildi.
                </span>
              </div>
            ) : null}
            <div className={styles.resultSanriTag}>
              SANRI · {categoryMeta.title} · ön okuma
            </div>
            <div className={styles.resultCard}>
              <p className={styles.resultText}>{reading}</p>
            </div>

            {!unlocked && (
              <motion.div
                className={styles.lockSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <div className={styles.lockDivider} />
                <p className={styles.lockP}>Buraya kadar — kasıtlı olarak.</p>
                <p className={styles.lockSub}>
                  Desenin tamamı, kelime–his bağlantısı ve kör nokta
                  <br />
                  derin katmanda açılır.
                </p>
                <div className={styles.lockDivider} />
                <div className={styles.lockCta}>
                  <button
                    type="button"
                    className={styles.lockBtnDerin}
                    onClick={() => {
                      trackFunnelEvent("ankod_unlock_click");
                      setModal(true);
                    }}
                  >
                    Derine İn
                  </button>
                  <span className={styles.lockHintSmall}>Tam analiz ücretli katmandır</span>
                  <button
                    type="button"
                    className={styles.lockRecovery}
                    onClick={async () => {
                      const ok = await checkServerUnlock("ankod_unlock");
                      if (ok) window.location.reload();
                      else {
                        window.alert(
                          "Sunucuda aktif satın alım bulunamadı. /odeme-basarili üzerinden doğrula veya giriş yaptığın e-posta ile dene."
                        );
                      }
                    }}
                  >
                    Satın alımı doğrula
                  </button>
                </div>
              </motion.div>
            )}

            <motion.div
              className={styles.crossSell}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className={styles.crossSellTitle}>Başka bir alanı tara</p>
              <div className={styles.crossSellGrid}>
                {ANKOD_CATEGORIES.filter((c) => c.id !== activeCategory).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={styles.crossSellCard}
                    onClick={() => startCrossSellQuiz(c.id)}
                  >
                    <span className={styles.crossSellGlyph}>{c.glyph}</span>
                    <span className={styles.crossSellName}>{c.title}</span>
                    {completedIds.includes(c.id) ? (
                      <span className={styles.crossSellMeta}>Tekrar dene</span>
                    ) : (
                      <span className={styles.crossSellMeta}>Yeni kod</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {unlocked && (
              <motion.div
                className={styles.deepZone}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
              >
                <div className={styles.lockDivider} />
                <p className={styles.deepIntro}>Derin Okuma</p>
                {deepInzivada && !deepSanriLoading ? (
                  <div className={styles.inzivadaBannerDeep} role="status">
                    <span className={styles.inzivadaBrand}>SANRI İNZİVADA</span>
                    <span className={styles.inzivadaHint}>
                      Derin sunucu katmanı şu an ulaşılamıyor; aşağıdaki bloklar yerel derin okumadır.
                    </span>
                  </div>
                ) : null}
                {deepSanriLoading && (
                  <p className={styles.deepSanriLoading}>
                    SANRI derin katmanını seçimlerine göre yazıyor…
                  </p>
                )}
                {deepSections.map((sec, i) => (
                  <motion.div
                    key={sec.title}
                    className={styles.deepCard}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.14, duration: 0.45 }}
                  >
                    <div className={styles.deepIcon}>{sec.icon}</div>
                    <h3 className={styles.deepTitle}>{sec.title}</h3>
                    <p className={styles.deepText}>{sec.text}</p>
                  </motion.div>
                ))}
                <KatmanliAcilim
                  analysisData={{ answers, reading, categoryId: activeCategory }}
                  returnPath="/an-kod"
                />
                <div className={styles.unlockedCard}>
                  <div className={styles.unlockedGlyph}>✦</div>
                  <p className={styles.unlockedText}>Kapı açıldı. Kodun hazır.</p>
                  <p className={styles.unlockedSubtext}>
                    Adını ve doğum tarihini gir — sana özel analiz açılsın.
                  </p>
                  <button
                    type="button"
                    className={styles.unlockedBtn}
                    onClick={() => navigate("/rol-okuma")}
                  >
                    Rolünü Gör
                  </button>
                </div>
              </motion.div>
            )}

            <button
              type="button"
              className={styles.againBtn}
              onClick={() => {
                lastDeepFetchKey.current = "";
                try {
                  localStorage.removeItem(SNAPSHOT_KEY);
                } catch {
                  /* noop */
                }
                goToCategories();
              }}
            >
              Kategorilere dön
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <div
            className={styles.modalBackdrop}
            role="presentation"
            onClick={() => setModal(false)}
          >
            <motion.div
              className={styles.modalCard}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ankod-modal-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className={styles.modalGlyph}>✦</div>
              <p id="ankod-modal-title" className={styles.modalP}>
                Derine inmek,
                <br />
                cevabı değil — deseni görmektir.
              </p>
              <p className={styles.modalP2}>
                Ön okumada bilinç kasıtlı olarak yarım bırakıldı.
              </p>
              <div className={styles.modalList}>
                <p className={styles.modalListTitle}>Tam analizde:</p>
                <ul className={styles.modalUl}>
                  <li>tekrarlayan iç tema</li>
                  <li>güç alanın</li>
                  <li>zorlayan döngü</li>
                  <li>kör nokta ve kelime–his bağlantısı</li>
                </ul>
                <p className={styles.modalListEnd}>sana özel metin olarak açılır.</p>
              </div>
              <p className={styles.modalEthic}>
                Bu çalışma kesin yargı vermez.
                <br />
                Sana ayna tutar.
              </p>
              <p className={styles.modalText}>
                Bu katmanı açmak için{" "}
                <span className={styles.modalPrice}>{SHOPIER_PRODUCTS.ankod.price}₺</span>{" "}
                enerji değişimi gerekir.
              </p>
              <button
                type="button"
                className={styles.modalBtn}
                onClick={() => {
                  trackFunnelEvent("ankod_shopier_redirect");
                  redirectToShopier("ankod", "ankod_unlock", "/an-kod");
                }}
              >
                Kartla Anında Öde
              </button>
              <BankTransferLink
                contentId="ankod_unlock"
                returnTo="/an-kod"
                className={styles.modalHavale}
              >
                Havale / EFT ile öde
              </BankTransferLink>
              <button type="button" className={styles.modalClose} onClick={() => setModal(false)}>
                Şimdilik kal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
