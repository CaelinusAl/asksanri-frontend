import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier, isShopierUnlocked } from "../data/shopierConfig";
import styles from "./AnKodPage.module.css";

const QUESTIONS = [
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
    text: "En çok kaçtığın şey ne?",
    options: [
      { id: "yuzlesmek", label: "Yüzleşmek", icon: "◉" },
      { id: "karar_vermek", label: "Karar vermek", icon: "⟁" },
      { id: "birakmak", label: "Bırakmak", icon: "✧" },
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

const READINGS = {
  bosluk: {
    sikisma: "Boşluk ve sıkışma aynı anda var — bu, eski bir yapının çöktüğü ama yenisinin henüz oluşmadığı an. Sen arada değilsin. Aranın ta kendisisin.",
    ayni_insanlar: "Boşluğu doldurmak için hep aynı kişilere dönüyorsun. Ama onlar seni doldurmak için değil — sana aynayı tutmak için geliyorlar.",
    ayni_hatalar: "Hata dediğin şey aslında tamamlanmamış bir ders. Boşluk dersi bitirmeni bekliyor — ama sen dersten kaçıyorsun.",
    ayni_dongu: "Döngü kırılmadıysa, fark edilmedi demektir. Boşluk sana alan açıyor — ama sen o alanı doldurmakla meşgulsün.",
  },
  sikisma: {
    yuzlesmek: "Sıkışman dışarıdan değil — içeriden. Yüzleşmekten kaçtıkça duvarlar daralıyor. Ama duvar sen değilsin. Duvarı kuran sensin.",
    karar_vermek: "Karar vermemek de bir karardır — ve en ağır olanıdır. Sıkışma kararın kendisinde değil, kararsızlığın ağırlığında.",
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
    yuzlesmek: "Yüzleşmekten kaçıyorsun çünkü belirsizlik zaten çok yoğun. Ama belirsizliğin kaynağı dışarıda değil — yüzleşmediğin şeyde.",
    karar_vermek: "Belirsizlik karar vermemek için bir mazeret haline geldi. Ama karar vermek netlik beklemez — netliği yaratır.",
    birakmak: "Bırakmak belirsizliği artırır diye tutuyorsun. Ama tuttuğun şey belirsizliğin ta kendisi.",
  },
};

function generateReading(answers) {
  const feeling = answers.hisset;
  const repeat = answers.tekrar;
  const escape = answers.kacis;
  const suppressed = answers.bastirilan;

  const pool = READINGS[feeling] || {};
  const text = pool[escape] || pool[repeat] || pool[suppressed];

  if (text) return text;

  const fallbacks = [
    "Sen bir şeyi çözmeye çalışmıyorsun.\nOnu görmemek için dolaşıyorsun.",
    "Cevabı dışarıda aramaktan yoruldun — çünkü cevap içeride bekliyor.\nAma içeri bakmak cesareti gerektiriyor.",
    "Tekrar eden her şey bir mesajdır.\nSen mesajı okumuyorsun — mesaj seni okuyor.",
    "Bastırdığın duygu kaybolmadı.\nSadece ses tonunu değiştirdi — ve artık bedenin konuşuyor.",
  ];

  const seed = (feeling + repeat + escape + suppressed).length;
  return fallbacks[seed % fallbacks.length];
}

const DEEP_READINGS = [
  "Döngünün kırılma noktası burada gizli.",
  "Gölge katmanın: kaçtığın şey seni tanımlıyor.",
  "Bastırdığın duygunun frekans analizi.",
  "İsmin ve bu kodun kesişim noktası.",
  "Tekrar eden kalıbın kök nedeni.",
];

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
  const [modal, setModal] = useState(false);

  const unlocked = isShopierUnlocked("ankod_unlock");

  const handleStart = useCallback(() => {
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
        setPhase(PHASES.READING_LOAD);
        const text = generateReading(next);
        setTimeout(() => {
          setReading(text);
          setPhase(PHASES.RESULT);
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
            <p className={styles.introSub}>
              4 soru. Bir yansıma. Bir kod.
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
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className={styles.questionNum}>{step + 1}</div>
            <h2 className={styles.questionText}>{currentQ.text}</h2>
            <div className={styles.optionsGrid}>
              {currentQ.options.map((opt) => (
                <button
                  key={opt.id}
                  className={styles.optionCard}
                  onClick={() => handleAnswer(opt.id)}
                >
                  <span className={styles.optionIcon}>{opt.icon}</span>
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
            <div className={styles.resultGlyph}>✦</div>
            <div className={styles.resultCard}>
              <p className={styles.resultText}>{reading}</p>
            </div>

            {/* ── Lock Zone ── */}
            {!unlocked && (
              <motion.div
                className={styles.lockZone}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className={styles.lockPreview}>
                  {DEEP_READINGS.map((line, i) => (
                    <div key={i} className={styles.lockLine}>
                      <span className={styles.lockLineIcon}>◈</span>
                      <span className={styles.lockLineText}>{line}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.lockGradient} />
                <div className={styles.lockOverlay}>
                  <p className={styles.lockLine1}>Buraya kadar gördün.</p>
                  <p className={styles.lockLine2}>
                    Ama asıl kod burada başlar.
                  </p>
                  <button
                    className={styles.lockBtn}
                    onClick={() => setModal(true)}
                  >
                    Kodunu Aç
                  </button>
                  <span className={styles.lockHint}>
                    Bu katman ücretli olarak açılır
                  </span>
                </div>
              </motion.div>
            )}

            {unlocked && (
              <motion.div
                className={styles.unlockedZone}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className={styles.deepSections}>
                  {DEEP_READINGS.map((line, i) => (
                    <motion.div
                      key={i}
                      className={styles.deepCard}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                    >
                      <span className={styles.deepIcon}>◈</span>
                      <span className={styles.deepText}>{line}</span>
                    </motion.div>
                  ))}
                </div>
                <p className={styles.deepNote}>
                  Tam analiz Matrix Rol Okuma ile birleştirildiğinde açılır.
                </p>
              </motion.div>
            )}

            <button
              className={styles.againBtn}
              onClick={() => {
                setPhase(PHASES.INTRO);
                setStep(0);
                setAnswers({});
                setReading("");
              }}
            >
              Tekrar Başla
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Energy Modal ── */}
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
              <p className={styles.modalText}>
                Bu katmanı açmak için{" "}
                <span className={styles.modalPrice}>369₺</span> enerji
                değişimi gerekir.
              </p>
              <button
                className={styles.modalBtn}
                onClick={() =>
                  redirectToShopier("rol_okuma", "ankod_unlock", "/an-kod")
                }
              >
                Kapıyı Aç
              </button>
              <button
                className={styles.modalClose}
                onClick={() => setModal(false)}
              >
                Şimdi değil
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
