import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked } from "../data/shopierConfig";
import styles from "./BilincAltiPage.module.css";

/* ═══════════════════════════════════════
   QUESTIONS — fast, intuitive, tap & go
   ═══════════════════════════════════════ */
const QUESTIONS = [
  {
    id: "renk",
    text: "Şu an seni en çok çeken renk?",
    options: [
      { id: "mavi", label: "Mavi", color: "#4a8fe7" },
      { id: "kirmizi", label: "Kırmızı", color: "#e74a5a" },
      { id: "siyah", label: "Siyah", color: "#2a2a2f" },
      { id: "yesil", label: "Yeşil", color: "#4ae78a" },
      { id: "mor", label: "Mor", color: "#a855f7" },
    ],
  },
  {
    id: "hayvan",
    text: "İçinden gelen bir hayvan?",
    options: [
      { id: "kurt", label: "Kurt", icon: "🐺" },
      { id: "kus", label: "Kuş", icon: "🦅" },
      { id: "yilan", label: "Yılan", icon: "🐍" },
      { id: "kedi", label: "Kedi", icon: "🐈‍⬛" },
      { id: "balina", label: "Balina", icon: "🐋" },
    ],
  },
  {
    id: "sayi",
    text: "En çok tekrar eden sayı?",
    options: [
      { id: "1", label: "1" },
      { id: "3", label: "3" },
      { id: "6", label: "6" },
      { id: "7", label: "7" },
      { id: "9", label: "9" },
    ],
  },
  {
    id: "sembol",
    text: "Sana yakın gelen sembol?",
    options: [
      { id: "daire", label: "Daire", icon: "◯" },
      { id: "ucgen", label: "Üçgen", icon: "△" },
      { id: "spiral", label: "Spiral", icon: "◎" },
      { id: "kapi", label: "Kapı", icon: "▯" },
      { id: "ayna", label: "Ayna", icon: "◇" },
    ],
  },
  {
    id: "duygu",
    text: "Şu anki ana duygu?",
    options: [
      { id: "sikisma", label: "Sıkışma", icon: "◼" },
      { id: "bosluk", label: "Boşluk", icon: "◌" },
      { id: "heyecan", label: "Heyecan", icon: "✦" },
      { id: "belirsizlik", label: "Belirsizlik", icon: "◈" },
      { id: "yorgunluk", label: "Yorgunluk", icon: "—" },
    ],
  },
  {
    id: "kacis",
    text: "Kaçtığın şey?",
    options: [
      { id: "karar", label: "Karar", icon: "⟁" },
      { id: "yuzlesme", label: "Yüzleşme", icon: "◉" },
      { id: "birakmak", label: "Bırakmak", icon: "✧" },
      { id: "soylemek", label: "Söylemek", icon: "☽" },
      { id: "degisim", label: "Değişim", icon: "∞" },
    ],
  },
];

/* ═══════════════════════════════════════
   REFLECTION + DEEP READING GENERATORS
   ═══════════════════════════════════════ */

const THEMES = {
  mavi: "derinlik arayışı", kirmizi: "bastırılmış enerji", siyah: "kontrol ihtiyacı",
  yesil: "iyileşme arzusu", mor: "sezgisel uyanış",
};
const ANIMAL_POWER = {
  kurt: "bağımsızlık ve sadakat", kus: "özgürlük ve perspektif", yilan: "dönüşüm ve yenilenme",
  kedi: "sınır koyma ve gizem", balina: "derinlik ve duygusal hafıza",
};
const NUMBER_MEANING = {
  "1": "başlangıç enerjisi — bağımsız hareket", "3": "yaratıcı ifade — duyguyu forma dönüştürme",
  "6": "sorumluluk ve şifa — dengeyi arama", "7": "sorgulama — yüzeyle yetinmeme",
  "9": "tamamlanma — eski döngüyü kapatma",
};
const SYMBOL_LAYER = {
  daire: "bütünlük arayışı", ucgen: "yükselme isteği", spiral: "içe dönüş",
  kapi: "geçiş eşiğinde durma", ayna: "kendini görme ihtiyacı",
};
const ESCAPE_SHADOW = {
  karar: "belirsizlikte kalarak güvenli hissetmek", yuzlesme: "acıyı erteleyerek korumak",
  birakmak: "kaybetme korkusunu kontrol etmek", soylemek: "reddedilme korkusu",
  degisim: "bilineni terk etme korkusu",
};
const EMOTION_FREQ = {
  sikisma: "daralan bir enerji — bir şeyin patlamayı beklediği alan",
  bosluk: "aranan ama bulunamayan — yokluğun kendisi bir mesaj",
  heyecan: "yükselen ama yönlendirilmemiş enerji",
  belirsizlik: "puslu alan — netlik karar vermekle gelir",
  yorgunluk: "taşınan ama indirilmemiş yük",
};

function generateReflection(a) {
  const pool = [
    `Seçtiklerin rastgele değil.\n\nBir yön gösteriyor.\n\nBelki de kaçtığın şey,\ntam olarak bakman gereken yer.\n\nAma bu sadece yüzey.\n\nAsıl desen,\ndaha derinde.`,
    `${THEMES[a.renk] || "İçsel arayış"} ve ${ANIMAL_POWER[a.hayvan] || "gizli güç"} — bu ikisi yan yana geldiğinde bir şey anlatıyor.\n\nAma henüz tamamlanmadı.`,
    `Seçtiğin sembol ${SYMBOL_LAYER[a.sembol] || "bir katmanı"} işaret ediyor.\nKaçtığın şey ise ${ESCAPE_SHADOW[a.kacis] || "bir gölgeyi"} taşıyor.\n\nBu ikisi birbirini tanıyor.\nAma sen henüz ikisini yan yana getirmedin.`,
  ];
  const seed = (a.renk + a.hayvan + a.sayi + a.duygu).length;
  return pool[seed % pool.length];
}

function generateDeepReading(a) {
  const theme = THEMES[a.renk] || "içsel arayış";
  const power = ANIMAL_POWER[a.hayvan] || "gizli güç";
  const numMeaning = NUMBER_MEANING[a.sayi] || "döngüsel enerji";
  const symbolLayer = SYMBOL_LAYER[a.sembol] || "iç yön";
  const emotion = EMOTION_FREQ[a.duygu] || "belirsiz frekans";
  const shadow = ESCAPE_SHADOW[a.kacis] || "kaçış kalıbı";

  return {
    mainTheme: {
      title: "Ana Tema",
      icon: "◉",
      text: `Seçimlerinin birleşim noktası: ${theme} ve ${symbolLayer}. Bu ikisi birlikte "kontrol–bırakma gerilimi" oluşturuyor. Hayatında bir şeyi hem tutmak hem bırakmak istediğin bir alan var. Bu gerilim çözümsüz değil — ama fark edilmeden çözülemez.`,
    },
    power: {
      title: "Güç Alanı",
      icon: "✦",
      text: `Hayvan seçimin (${power}) senin doğal gücünü gösteriyor. Bu, zorlamadan aktığın, çevrendeki insanların fark ettiği ama senin hafife aldığın şey. ${a.sayi} sayısı bunu destekliyor: ${numMeaning}. Bu güç bilinçli kullanıldığında büyür.`,
    },
    cycle: {
      title: "Zorlayan Döngü",
      icon: "∞",
      text: `Tekrar eden duygun (${emotion}) ve kaçtığın şey (${shadow}) birlikte bir döngü oluşturuyor. Bu döngü seni korumak için kurulmuş — ama artık korumuyor, sınırlıyor. Döngüyü kırmak için onu önce tanımak gerekir. Şu an onu tanıyorsun.`,
    },
    blindSpot: {
      title: "Kör Nokta",
      icon: "☽",
      text: `Göremediğin alan, en çok güvendiğin alanın tam karşısında duruyor. Renk seçimin (${theme}) sezgisel bir ihtiyacı, sembol seçimin (${symbolLayer}) ise bilinçli bir arayışı temsil ediyor. Bu ikisi arasındaki boşluk — senin kör noktan. Onu görmek cesareti gerektirir.`,
    },
    sanriMessage: {
      title: "SANRI Mesajı",
      icon: "✧",
      text: `Bu çalışma kesin yargı vermez. Sana bir ayna tutar.\n\nSende şu şekilde hissediliyor olabilir: bir şeyi bildiğin halde yapamama. Ya da bir şeyi hissettiğin halde söyleyememe.\n\nBu normal. Ama "normal" olan her şey doğru değildir.\n\nFark ettiğin an, döngü kırılmaya başlar.`,
    },
  };
}

/* ═══════════════════════════════════════ */

const PHASES = {
  INTRO: "intro",
  QUIZ: "quiz",
  LOADING: "loading",
  REFLECTION: "reflection",
  DEEP: "deep",
};

export default function BilincAltiPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reflection, setReflection] = useState("");
  const [deepReading, setDeepReading] = useState(null);
  const [modal, setModal] = useState(false);

  const unlocked =
    isShopierUnlocked("subconscious_unlock") ||
    isShopierUnlocked("role_unlock") ||
    isShopierUnlocked("ankod_unlock");

  const handleStart = useCallback(() => {
    setPhase(PHASES.QUIZ);
    setStep(0);
    setAnswers({});
  }, []);

  const handlePick = useCallback(
    (optId) => {
      const q = QUESTIONS[step];
      const next = { ...answers, [q.id]: optId };
      setAnswers(next);

      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setPhase(PHASES.LOADING);
        setTimeout(() => {
          setReflection(generateReflection(next));
          setDeepReading(generateDeepReading(next));
          setPhase(PHASES.REFLECTION);
        }, 2200);
      }
    },
    [step, answers]
  );

  const currentQ = QUESTIONS[step];

  const deepSections = useMemo(() => {
    if (!deepReading) return [];
    return [
      deepReading.mainTheme,
      deepReading.power,
      deepReading.cycle,
      deepReading.blindSpot,
      deepReading.sanriMessage,
    ];
  }, [deepReading]);

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Kapılar
        </button>
        <span className={styles.topTitle}>Bilinçaltın Ne Diyor?</span>
        <span className={styles.topStep}>
          {phase === PHASES.QUIZ ? `${step + 1} / ${QUESTIONS.length}` : ""}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ INTRO ═══ */}
        {phase === PHASES.INTRO && (
          <motion.div
            key="intro"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.introGlyph}>◈</div>
            <h1 className={styles.introTitle}>
              Bilinçaltın Ne Diyor?
            </h1>
            <p className={styles.introSub}>
              SANRI Yansıtma Deneyi
            </p>
            <p className={styles.introDesc}>
              Seçimlerin, sana neyi hatırlatıyor?
            </p>
            <button className={styles.startBtn} onClick={handleStart}>
              Başla
            </button>
          </motion.div>
        )}

        {/* ═══ QUIZ ═══ */}
        {phase === PHASES.QUIZ && currentQ && (
          <motion.div
            key={`q-${step}`}
            className={styles.quizWrap}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <p className={styles.qText}>{currentQ.text}</p>
            <div className={styles.options}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  className={styles.optBtn}
                  onClick={() => handlePick(opt.id)}
                  style={opt.color ? { borderColor: opt.color + "55" } : undefined}
                >
                  {opt.icon && <span className={styles.optIcon}>{opt.icon}</span>}
                  {opt.color && (
                    <span
                      className={styles.optDot}
                      style={{ background: opt.color }}
                    />
                  )}
                  <span className={styles.optLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ LOADING ═══ */}
        {phase === PHASES.LOADING && (
          <motion.div
            key="load"
            className={styles.center}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.loadOrb}>
              <span className={styles.loadGlyph}>◈</span>
            </div>
            <p className={styles.loadText}>Yansıtma hazırlanıyor...</p>
          </motion.div>
        )}

        {/* ═══ REFLECTION ═══ */}
        {phase === PHASES.REFLECTION && (
          <motion.div
            key="ref"
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Free reflection */}
            <div className={styles.reflectionCard}>
              <p className={styles.reflectionText}>{reflection}</p>
            </div>

            {/* ── Lock or Deep ── */}
            {!unlocked ? (
              <>
                {/* Lock screen */}
                <motion.div
                  className={styles.lockSection}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <div className={styles.divider} />

                  <motion.p className={styles.lockP}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    Buraya kadar gördün.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                  >
                    <p className={styles.lockSub}>
                      Ama bilinçaltı,
                      <br />
                      sembollerle konuşur.
                    </p>
                    <p className={styles.lockSub2}>
                      Ve bu katman,
                      <br />
                      açılmadan anlaşılmaz.
                    </p>
                  </motion.div>

                  <motion.div className={styles.lockCta}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                  >
                    <button
                      className={styles.lockBtn}
                      onClick={() => setModal(true)}
                    >
                      Derin Okumayı Aç
                    </button>
                    <span className={styles.lockHint}>
                      Bu katman ücretli olarak açılır
                    </span>
                  </motion.div>
                </motion.div>

                {/* Upsell teaser */}
                <motion.div className={styles.upsellSection}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.5 }}
                >
                  <div className={styles.upsellItem}>
                    <p className={styles.upsellQ}>
                      İlişkilerinde tekrar eden şey ne söylüyor?
                    </p>
                    <button className={styles.upsellBtn}
                      onClick={() => setModal(true)}
                    >
                      Bunu açabilirsin.
                    </button>
                  </div>
                  <div className={styles.upsellItem}>
                    <p className={styles.upsellQ}>
                      Enerji akışı nerede kesiliyor olabilir?
                    </p>
                    <button className={styles.upsellBtn}
                      onClick={() => setModal(true)}
                    >
                      Bunu açabilirsin.
                    </button>
                  </div>
                </motion.div>
              </>
            ) : (
              /* Deep reading — unlocked */
              <motion.div
                className={styles.deepZone}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className={styles.divider} />
                <p className={styles.deepIntro}>Derin Okuma</p>

                {deepSections.map((sec, i) => (
                  <motion.div
                    key={sec.title}
                    className={styles.deepCard}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.18, duration: 0.45 }}
                  >
                    <div className={styles.deepIcon}>{sec.icon}</div>
                    <h3 className={styles.deepTitle}>{sec.title}</h3>
                    <p className={styles.deepText}>{sec.text}</p>
                  </motion.div>
                ))}

                {/* Upsell */}
                <div className={styles.upsellSection}>
                  <div className={styles.upsellItem}>
                    <p className={styles.upsellQ}>
                      İlişkilerinde tekrar eden şey ne söylüyor?
                    </p>
                    <button className={styles.upsellBtn}
                      onClick={() => redirectToShopier("iliski_acilimi", "iliski_acilimi", "/bilinc-alti")}
                    >
                      Bunu açabilirsin.
                    </button>
                  </div>
                  <div className={styles.upsellItem}>
                    <p className={styles.upsellQ}>
                      Enerji akışı nerede kesiliyor olabilir?
                    </p>
                    <button className={styles.upsellBtn}
                      onClick={() => redirectToShopier("para_akisi", "para_akisi", "/bilinc-alti")}
                    >
                      Bunu açabilirsin.
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              className={styles.againBtn}
              onClick={() => {
                setPhase(PHASES.INTRO);
                setStep(0);
                setAnswers({});
                setReflection("");
                setDeepReading(null);
              }}
            >
              Tekrar Başla
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <div className={styles.modalBg} onClick={() => setModal(false)}>
            <motion.div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className={styles.modalGlyph}>✦</div>

              <p className={styles.modalP}>
                Seçimlerin,
                <br />
                tek başına anlamlı değil.
              </p>
              <p className={styles.modalP2}>
                Ama birlikte…
                <br />
                bir desen oluşturur.
              </p>

              <div className={styles.modalList}>
                <p className={styles.modalListTitle}>Derin Okuma'da:</p>
                <ul className={styles.modalUl}>
                  <li>tekrar eden iç tema</li>
                  <li>güçlü yönün</li>
                  <li>zorlayan döngün</li>
                  <li>dikkat etmen gereken alan</li>
                </ul>
                <p className={styles.modalListEnd}>sana özel olarak açılır.</p>
              </div>

              <p className={styles.modalEthic}>
                Bu çalışma kesin yargı vermez.
                <br />
                Sana bir ayna tutar.
              </p>

              <p className={styles.modalPrice}>
                Bu katmanı açmak için{" "}
                <span className={styles.modalPriceVal}>369₺</span>{" "}
                enerji değişimi gerekir.
              </p>

              <button
                className={styles.modalBtn}
                onClick={() =>
                  redirectToShopier("rol_okuma", "subconscious_unlock", "/bilinc-alti")
                }
              >
                Kapıyı Aç
              </button>
              <button className={styles.modalClose} onClick={() => setModal(false)}>
                Şimdilik kal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
