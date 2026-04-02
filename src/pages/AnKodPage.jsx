import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked, unlockViaShopier } from "../data/shopierConfig";
import { trackFunnelEvent } from "../data/funnelTracker";
import KatmanliAcilim from "../components/KatmanliAcilim";
import styles from "./AnKodPage.module.css";

/* ═══════════════════════════════════════
   QUESTIONS — 8 merged (intuitive + deep)
   Fast pick first, then soul-level
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
      { id: "1", label: "1", icon: "①" },
      { id: "3", label: "3", icon: "③" },
      { id: "6", label: "6", icon: "⑥" },
      { id: "7", label: "7", icon: "⑦" },
      { id: "9", label: "9", icon: "⑨" },
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
    id: "hisset",
    text: "Şu an en çok neyi hissediyorsun?",
    options: [
      { id: "bosluk", label: "Boşluk", icon: "◌" },
      { id: "sikisma", label: "Sıkışma", icon: "◼" },
      { id: "heyecan", label: "Heyecan", icon: "✦" },
      { id: "belirsizlik", label: "Belirsizlik", icon: "◈" },
    ],
  },
  {
    id: "tekrar",
    text: "Hayatında tekrar eden şey ne?",
    options: [
      { id: "ayni_insanlar", label: "Aynı insanlar", icon: "☽" },
      { id: "ayni_hatalar", label: "Aynı hatalar", icon: "∞" },
      { id: "ayni_dongu", label: "Aynı döngü", icon: "◎" },
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
  {
    id: "bastirilan",
    text: "İçinde bastırdığın duygu?",
    options: [
      { id: "korku", label: "Korku", icon: "▲" },
      { id: "ofke", label: "Öfke", icon: "◆" },
      { id: "ozlem", label: "Özlem", icon: "☾" },
      { id: "yorgunluk", label: "Yorgunluk", icon: "—" },
    ],
  },
];

/* ═══════════════════════════════════════
   AN_KOD READINGS (feeling × escape/repeat)
   ═══════════════════════════════════════ */
const READINGS = {
  bosluk: {
    sikisma: "Boşluk ve sıkışma aynı anda var — bu, eski bir yapının çöktüğü ama yenisinin henüz oluşmadığı an. Sen arada değilsin. Aranın ta kendisisin.",
    ayni_insanlar: "Boşluğu doldurmak için hep aynı kişilere dönüyorsun. Ama onlar seni doldurmak için değil — sana aynayı tutmak için geliyorlar.",
    ayni_hatalar: "Hata dediğin şey aslında tamamlanmamış bir ders. Boşluk dersi bitirmeni bekliyor — ama sen dersten kaçıyorsun.",
    ayni_dongu: "Döngü kırılmadıysa, fark edilmedi demektir. Boşluk sana alan açıyor — ama sen o alanı doldurmakla meşgulsün.",
  },
  sikisma: {
    yuzlesme: "Sıkışman dışarıdan değil — içeriden. Yüzleşmekten kaçtıkça duvarlar daralıyor. Ama duvar sen değilsin. Duvarı kuran sensin.",
    karar: "Karar vermemek de bir karardır — ve en ağır olanıdır. Sıkışma kararın kendisinde değil, kararsızlığın ağırlığında.",
    birakmak: "Bırakamıyorsun çünkü bırakmak kaybetmek gibi hissettiriyor. Ama tuttuğun şey seni tutuyor — ve boğuyor.",
  },
  heyecan: {
    korku: "Heyecan ve korku aynı frekansı taşır — fark eden bedenin değil, bilincin. Sen korkuyor musun yoksa uyanıyor musun?",
    ofke: "Öfkeyi bastırıp heyecan gibi yaşıyorsun. Ama öfke bir mesaj taşıyor. Onu duymak istemiyorsun çünkü duyarsan hareket etmen gerekecek.",
    ozlem: "Heyecanın özlemin maskesi. Bir şeye doğru koşuyorsun ama o şey geçmişte. Heyecan seni ileri çekmiyor — geriye çağırıyor.",
    yorgunluk: "Yorgunluğu heyecanla örtüyorsun. Ama beden yalan söylemez. Durman gerekiyor — ve durmak seni korkutuyor.",
  },
  belirsizlik: {
    ayni_insanlar: "Belirsizlikte güvenli limana koşuyorsun — aynı insanlara. Ama güvenli olan tanıdık olandır, doğru olan değil.",
    ayni_hatalar: "Belirsizlik seni tanıdık hatalara itiyor. Bilmediğin yolda yürümek yerine bildiğin çukura düşüyorsun.",
    ayni_dongu: "Döngü belirsizliğin ilacı gibi hissettiriyor — en azından tanıdık. Ama tanıdık olan iyileştirmez, uyuşturur.",
    yuzlesme: "Yüzleşmekten kaçıyorsun çünkü belirsizlik zaten çok yoğun. Ama belirsizliğin kaynağı dışarıda değil — yüzleşmediğin şeyde.",
    karar: "Belirsizlik karar vermemek için bir mazeret haline geldi. Ama karar vermek netlik beklemez — netliği yaratır.",
    birakmak: "Bırakmak belirsizliği artırır diye tutuyorsun. Ama tuttuğun şey belirsizliğin ta kendisi.",
  },
};

function generateAnKodReading(a) {
  const pool = READINGS[a.hisset] || {};
  const text = pool[a.kacis] || pool[a.tekrar] || pool[a.bastirilan];
  if (text) return text;
  const fallbacks = [
    "Sen bir şeyi çözmeye çalışmıyorsun.\nOnu görmemek için dolaşıyorsun.",
    "Cevabı dışarıda aramaktan yoruldun — çünkü cevap içeride bekliyor.\nAma içeri bakmak cesareti gerektiriyor.",
    "Tekrar eden her şey bir mesajdır.\nSen mesajı okumuyorsun — mesaj seni okuyor.",
    "Bastırdığın duygu kaybolmadı.\nSadece ses tonunu değiştirdi — ve artık bedenin konuşuyor.",
  ];
  const seed = ((a.hisset || "") + (a.tekrar || "") + (a.kacis || "") + (a.bastirilan || "")).length;
  return fallbacks[seed % fallbacks.length];
}

/* ═══════════════════════════════════════
   BİLİNÇALTI LAYERS (reflection + deep)
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
};

function generateReflection(a) {
  const pool = [
    `Seçtiklerin rastgele değil.\n\nBir yön gösteriyor.\n\nBelki de kaçtığın şey,\ntam olarak bakman gereken yer.\n\nAma bu sadece yüzey.\n\nAsıl desen,\ndaha derinde.`,
    `${THEMES[a.renk] || "İçsel arayış"} ve ${ANIMAL_POWER[a.hayvan] || "gizli güç"} — bu ikisi yan yana geldiğinde bir şey anlatıyor.\n\nAma henüz tamamlanmadı.`,
    `Seçtiğin sembol ${SYMBOL_LAYER[a.sembol] || "bir katmanı"} işaret ediyor.\nKaçtığın şey ise ${ESCAPE_SHADOW[a.kacis] || "bir gölgeyi"} taşıyor.\n\nBu ikisi birbirini tanıyor.\nAma sen henüz ikisini yan yana getirmedin.`,
  ];
  const seed = ((a.renk || "") + (a.hayvan || "") + (a.sayi || "") + (a.hisset || "")).length;
  return pool[seed % pool.length];
}

function generateDeepReading(a) {
  const theme = THEMES[a.renk] || "içsel arayış";
  const power = ANIMAL_POWER[a.hayvan] || "gizli güç";
  const numMeaning = NUMBER_MEANING[a.sayi] || "döngüsel enerji";
  const symbolLayer = SYMBOL_LAYER[a.sembol] || "iç yön";
  const emotion = EMOTION_FREQ[a.hisset] || "belirsiz frekans";
  const shadow = ESCAPE_SHADOW[a.kacis] || "kaçış kalıbı";

  return [
    {
      title: "Ana Tema",
      icon: "◉",
      text: `Seçimlerinin birleşim noktası: ${theme} ve ${symbolLayer}. Bu ikisi birlikte "kontrol–bırakma gerilimi" oluşturuyor. Hayatında bir şeyi hem tutmak hem bırakmak istediğin bir alan var. Bu gerilim çözümsüz değil — ama fark edilmeden çözülemez.`,
    },
    {
      title: "Güç Alanı",
      icon: "✦",
      text: `Hayvan seçimin (${power}) senin doğal gücünü gösteriyor. Bu, zorlamadan aktığın, çevrendeki insanların fark ettiği ama senin hafife aldığın şey. ${a.sayi} sayısı bunu destekliyor: ${numMeaning}. Bu güç bilinçli kullanıldığında büyür.`,
    },
    {
      title: "Zorlayan Döngü",
      icon: "∞",
      text: `Tekrar eden duygun (${emotion}) ve kaçtığın şey (${shadow}) birlikte bir döngü oluşturuyor. Bu döngü seni korumak için kurulmuş — ama artık korumuyor, sınırlıyor. Döngüyü kırmak için onu önce tanımak gerekir. Şu an onu tanıyorsun.`,
    },
    {
      title: "Kör Nokta",
      icon: "☽",
      text: `Göremediğin alan, en çok güvendiğin alanın tam karşısında duruyor. Renk seçimin (${theme}) sezgisel bir ihtiyacı, sembol seçimin (${symbolLayer}) ise bilinçli bir arayışı temsil ediyor. Bu ikisi arasındaki boşluk — senin kör noktan. Onu görmek cesareti gerektirir.`,
    },
    {
      title: "SANRI Mesajı",
      icon: "✧",
      text: `Bu çalışma kesin yargı vermez. Sana bir ayna tutar.\n\nSende şu şekilde hissediliyor olabilir: bir şeyi bildiğin halde yapamama. Ya da bir şeyi hissettiğin halde söyleyememe.\n\nBu normal. Ama "normal" olan her şey doğru değildir.\n\nFark ettiğin an, döngü kırılmaya başlar.`,
    },
  ];
}

/* ═══════════════════════════════════════ */

const PHASES = {
  INTRO: "intro",
  QUESTIONS: "questions",
  READING_LOAD: "reading_load",
  RESULT: "result",
};

export default function AnKodPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reading, setReading] = useState("");
  const [reflection, setReflection] = useState("");
  const [deepSections, setDeepSections] = useState([]);
  const [modal, setModal] = useState(false);

  const unlocked =
    isShopierUnlocked("ankod_unlock") ||
    isShopierUnlocked("subconscious_unlock") ||
    isShopierUnlocked("role_unlock");

  useEffect(() => { trackFunnelEvent("ankod_page_view"); }, []);
  useEffect(() => { if (unlocked) trackFunnelEvent("ankod_unlock_success"); }, [unlocked]);

  const handleStart = useCallback(() => {
    trackFunnelEvent("ankod_quiz_start");
    setPhase(PHASES.QUESTIONS);
    setStep(0);
    setAnswers({});
  }, []);

  const handleAnswer = useCallback(
    (optionId) => {
      const q = QUESTIONS[step];
      const next = { ...answers, [q.id]: optionId };
      setAnswers(next);

      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        trackFunnelEvent("ankod_quiz_complete");
        setPhase(PHASES.READING_LOAD);
        const ankodText = generateAnKodReading(next);
        const reflText = generateReflection(next);
        const deep = generateDeepReading(next);
        setTimeout(() => {
          setReading(ankodText);
          setReflection(reflText);
          setDeepSections(deep);
          setPhase(PHASES.RESULT);
          if (!unlocked) trackFunnelEvent("ankod_lock_view");
        }, 2800);
      }
    },
    [step, answers]
  );

  const currentQ = QUESTIONS[step];

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Kapılar
        </button>
        <span className={styles.topTitle}>AN_KOD</span>
        <span className={styles.topStep}>
          {phase === PHASES.QUESTIONS
            ? `${step + 1} / ${QUESTIONS.length}`
            : ""}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ INTRO ═══ */}
        {phase === PHASES.INTRO && (
          <motion.div
            key="intro"
            className={styles.introWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.introGlyph}>◈</div>
            <h1 className={styles.introTitle}>
              Anın sana ne söylediğini
              <br />
              görmek ister misin?
            </h1>
            <p className={styles.introSub2}>Bilinçaltın Ne Diyor?</p>
            <p className={styles.introSub}>
              8 soru. Bir yansıma. Bir kod.
            </p>
            <button className={styles.startBtn} onClick={handleStart}>
              Başla
            </button>
          </motion.div>
        )}

        {/* ═══ QUESTIONS ═══ */}
        {phase === PHASES.QUESTIONS && currentQ && (
          <motion.div
            key={`q-${step}`}
            className={styles.questionWrap}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className={styles.questionNum}>{step + 1}</div>
            <h2 className={styles.questionText}>{currentQ.text}</h2>
            <div className={styles.optionsGrid}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  className={styles.optionCard}
                  onClick={() => handleAnswer(opt.id)}
                  style={opt.color ? { borderColor: opt.color + "33" } : undefined}
                >
                  {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                  {opt.color && (
                    <span
                      className={styles.optionDot}
                      style={{ background: opt.color }}
                    />
                  )}
                  <span className={styles.optionLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ READING LOAD ═══ */}
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
            <p className={styles.loadText}>Anın okunuyor...</p>
          </motion.div>
        )}

        {/* ═══ RESULT ═══ */}
        {phase === PHASES.RESULT && (
          <motion.div
            key="result"
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* AN_KOD reading */}
            <div className={styles.resultGlyph}>✦</div>
            <div className={styles.resultCard}>
              <p className={styles.resultText}>{reading}</p>
            </div>

            {/* Bilinçaltı yansıtma */}
            <motion.div
              className={styles.reflectionCard}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className={styles.reflectionLabel}>Yansıtma</div>
              <p className={styles.reflectionText}>{reflection}</p>
            </motion.div>

            {/* ── Lock Zone ── */}
            {!unlocked && (
              <motion.div
                className={styles.lockSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                <div className={styles.lockDivider} />

                <motion.p
                  className={styles.lockP}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  Buraya kadar gördün.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
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

                <div className={styles.lockDivider} />

                <motion.div
                  className={styles.lockBlock}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6 }}
                >
                  <p className={styles.lockBlockText}>Bu katman açıldığında:</p>
                  <p className={styles.lockBlockItem}>Sadece cevap almazsın —</p>
                  <p className={styles.lockBlockHighlight}>
                    kendini farklı görmeye başlarsın.
                  </p>
                </motion.div>

                <motion.div
                  className={styles.lockPersonal}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 0.6 }}
                >
                  <p className={styles.lockPersonalText}>
                    Bu, herkes için aynı değildir.
                  </p>
                  <p className={styles.lockPersonalStrong}>Bu sana özel.</p>
                </motion.div>

                <motion.div
                  className={styles.lockCta}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6, duration: 0.5 }}
                >
                  <p className={styles.lockCtaHint}>
                    Bu kapı, hazır olana açılır.
                  </p>
                  <button
                    className={styles.lockBtn}
                    onClick={() => { trackFunnelEvent("ankod_unlock_click"); setModal(true); }}
                  >
                    Derin Okumayı Aç
                  </button>
                  <span className={styles.lockHintSmall}>
                    Bu katman ücretli olarak açılır
                  </span>
                  <button
                    className={styles.lockRecovery}
                    onClick={() => {
                      unlockViaShopier("ankod_unlock");
                      window.location.reload();
                    }}
                  >
                    Zaten satın aldım
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* ── Deep Reading (unlocked) ── */}
            {unlocked && (
              <motion.div
                className={styles.deepZone}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className={styles.lockDivider} />
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

                {/* Katmanlı Açılım */}
                <KatmanliAcilim
                  analysisData={{ answers, reading, reflection }}
                  returnPath="/an-kod"
                />

                {/* Go to Rol Okuma */}
                <div className={styles.unlockedCard}>
                  <div className={styles.unlockedGlyph}>✦</div>
                  <p className={styles.unlockedText}>
                    Kapı açıldı. Kodun hazır.
                  </p>
                  <p className={styles.unlockedSubtext}>
                    Adını ve doğum tarihini gir — sana özel analiz açılsın.
                  </p>
                  <button
                    className={styles.unlockedBtn}
                    onClick={() => navigate("/rol-okuma")}
                  >
                    Rolünü Gör
                  </button>
                </div>
              </motion.div>
            )}

            <button
              className={styles.againBtn}
              onClick={() => {
                setPhase(PHASES.INTRO);
                setStep(0);
                setAnswers({});
                setReading("");
                setReflection("");
                setDeepSections([]);
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
          <div
            className={styles.modalBackdrop}
            onClick={() => setModal(false)}
          >
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

              <p className={styles.modalText}>
                Bu katmanı açmak için{" "}
                <span className={styles.modalPrice}>369₺</span> enerji
                değişimi gerekir.
              </p>

              <button
                className={styles.modalBtn}
                onClick={() => {
                  trackFunnelEvent("ankod_shopier_redirect");
                  redirectToShopier("rol_okuma", "ankod_unlock", "/an-kod");
                }}
              >
                Kapıyı Aç
              </button>
              <button
                className={styles.modalClose}
                onClick={() => setModal(false)}
              >
                Şimdilik kal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
