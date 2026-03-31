import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrekansAlaniPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

const CHAKRAS = [
  {
    key: "root", hz: 396, color: "#e53e3e", glow: "220,60,60",
    nameTR: "Kök Çakra", nameEN: "Root Chakra",
    areaTR: "Güvenlik · Köklülük · Hayatta Kalma",
    areaEN: "Security · Grounding · Survival",
    descTR: "Bedenin toprağa bağlandığı nokta. Güvenlik hissi burada başlar. Kök çakra dengesizse, sürekli bir tehdit algısı ve tutunma ihtiyacı doğar.",
    descEN: "Where the body connects to the earth. The sense of safety begins here. When imbalanced, a constant sense of threat and need to cling arises.",
    effectsTR: "Fiziksel güç, dayanıklılık, maddi güvenlik, beden farkındalığı",
    effectsEN: "Physical strength, resilience, material security, body awareness",
    blockTR: "Kronik korku, güvensizlik, bel/bacak ağrıları, maddi kaygı",
    blockEN: "Chronic fear, insecurity, lower back pain, financial anxiety",
    activeTR: "Toprakla temas, yürüyüş, kırmızı gıdalar, kökleme nefesi",
    activeEN: "Earth contact, walking, red foods, grounding breathwork",
    protocol: null,
  },
  {
    key: "sacral", hz: 417, color: "#ed8936", glow: "237,137,54",
    nameTR: "Sakral Çakra", nameEN: "Sacral Chakra",
    areaTR: "Yaratıcılık · Duygu · Arzu",
    areaEN: "Creativity · Emotion · Desire",
    descTR: "Duyguların ve yaratıcılığın merkezi. Zevk almak, üretmek ve akışta olmak bu çakranın alanı. Bloke olduğunda duygusal donukluk başlar.",
    descEN: "The center of emotions and creativity. Pleasure, creation, and flow belong here. When blocked, emotional numbness sets in.",
    effectsTR: "Duygusal akış, yaratıcılık, cinsel enerji, esneklik",
    effectsEN: "Emotional flow, creativity, sexual energy, flexibility",
    blockTR: "Duygusal baskılama, yaratıcılık tıkanması, suçluluk",
    blockEN: "Emotional suppression, creative block, guilt",
    activeTR: "Su ile temas, dans, turuncu gıdalar, kalça açıcı hareketler",
    activeEN: "Water contact, dance, orange foods, hip-opening movements",
    protocol: null,
  },
  {
    key: "solar", hz: 528, color: "#ecc94b", glow: "236,201,75",
    nameTR: "Solar Pleksus", nameEN: "Solar Plexus",
    areaTR: "İrade · Güç · Kimlik",
    areaEN: "Will · Power · Identity",
    descTR: "Kişisel gücün ve iradenin merkezi. Kim olduğunu bilmek ve harekete geçmek burada başlar. Dengesizliği kontrol ihtiyacı veya güçsüzlük hissi yaratır.",
    descEN: "The center of personal power and will. Knowing who you are and taking action begins here. Imbalance creates a need for control or powerlessness.",
    effectsTR: "Özgüven, kararlılık, metabolizma, iç motivasyon",
    effectsEN: "Self-confidence, determination, metabolism, inner motivation",
    blockTR: "Kontrol takıntısı, öfke, mide sorunları, özgüven eksikliği",
    blockEN: "Control obsession, anger, stomach issues, lack of self-esteem",
    activeTR: "Karın nefesi, sarı gıdalar, güneş teması, güç duruşları",
    activeEN: "Abdominal breathing, yellow foods, sunlight, power poses",
    protocol: "focus_369",
  },
  {
    key: "heart", hz: 639, color: "#48bb78", glow: "72,187,120",
    nameTR: "Kalp Çakra", nameEN: "Heart Chakra",
    areaTR: "Sevgi · Bağlantı · Şefkat",
    areaEN: "Love · Connection · Compassion",
    descTR: "Alt ve üst çakralar arasındaki köprü. Sevgi, bağışlama ve bağlantı burada yaşar. Kalp açıldığında hem kendinle hem başkalarıyla barış gelir.",
    descEN: "The bridge between lower and upper chakras. Love, forgiveness, and connection live here. When the heart opens, peace comes with self and others.",
    effectsTR: "Koşulsuz sevgi, empati, duygusal iyileşme, bağışlama",
    effectsEN: "Unconditional love, empathy, emotional healing, forgiveness",
    blockTR: "Kalp ağrısı, yalnızlık, affetmeme, duygusal kapanma",
    blockEN: "Heartache, loneliness, inability to forgive, emotional shutdown",
    activeTR: "Göğüs nefesi, yeşil doğa, sevgi meditasyonu, kucaklama",
    activeEN: "Chest breathing, green nature, loving-kindness meditation, embracing",
    protocol: "breath_47",
  },
  {
    key: "throat", hz: 741, color: "#4299e1", glow: "66,153,225",
    nameTR: "Boğaz Çakra", nameEN: "Throat Chakra",
    areaTR: "İfade · Doğruluk · İletişim",
    areaEN: "Expression · Truth · Communication",
    descTR: "Sesin ve gerçeğin çakrası. Söylenmemiş sözler burada birikir. Açıldığında gerçeğini korkusuzca ifade edebilirsin.",
    descEN: "The chakra of voice and truth. Unspoken words accumulate here. When open, you can express your truth fearlessly.",
    effectsTR: "Net iletişim, yaratıcı ifade, dürüstlük, aktif dinleme",
    effectsEN: "Clear communication, creative expression, honesty, active listening",
    blockTR: "Söyleyememe, boğaz sıkışması, yalan, iletişim korkusu",
    blockEN: "Inability to speak, throat tightness, dishonesty, fear of communication",
    activeTR: "Şarkı söyleme, mavi gıdalar, boyun germe, sesli nefes",
    activeEN: "Singing, blue foods, neck stretching, vocal breathing",
    protocol: "signal",
  },
  {
    key: "third_eye", hz: 852, color: "#9f7aea", glow: "159,122,234",
    nameTR: "Üçüncü Göz", nameEN: "Third Eye",
    areaTR: "Sezgi · Görüş · Farkındalık",
    areaEN: "Intuition · Vision · Awareness",
    descTR: "İç görüşün ve sezginin kapısı. Fiziksel gözlerin ötesinde görmeyi sağlar. Aktif olduğunda kalıpların ve örüntülerin farkına varırsın.",
    descEN: "The gateway of inner vision and intuition. Allows seeing beyond physical eyes. When active, you notice patterns and see clearly.",
    effectsTR: "Güçlü sezgi, berrak düşünce, rüya farkındalığı, içgörü",
    effectsEN: "Strong intuition, clear thought, dream awareness, insight",
    blockTR: "Kafa karışıklığı, aşırı düşünme, sezgiyi reddetme, baş ağrısı",
    blockEN: "Confusion, overthinking, intuition denial, headaches",
    activeTR: "Meditasyon, karanlık sessizlik, mor gıdalar, göz egzersizi",
    activeEN: "Meditation, dark silence, purple foods, eye exercises",
    protocol: null,
  },
  {
    key: "crown", hz: 963, color: "#e2e8f0", glow: "220,220,240",
    nameTR: "Taç Çakra", nameEN: "Crown Chakra",
    areaTR: "Birlik · Bilinç · Aşkınlık",
    areaEN: "Unity · Consciousness · Transcendence",
    descTR: "Saf bilincin kapısı. Bireysel benliğin evrensel bilince açıldığı nokta. Burası anlamın ötesinde, deneyimin kendisidir.",
    descEN: "The gateway of pure consciousness. Where individual self opens to universal awareness. This is beyond meaning — it is experience itself.",
    effectsTR: "Ruhsal bağlantı, iç huzur, birlik bilinci, aşkınlık",
    effectsEN: "Spiritual connection, inner peace, unity consciousness, transcendence",
    blockTR: "Anlamsızlık, kopukluk, spiritüel kriz, amaçsızlık",
    blockEN: "Meaninglessness, disconnection, spiritual crisis, purposelessness",
    activeTR: "Sessizlik, oruç, beyaz ışık meditasyonu, bilinçli farkındalık",
    activeEN: "Silence, fasting, white light meditation, conscious awareness",
    protocol: null,
  },
];

const PROTOCOLS = {
  breath_47: {
    titleTR: "47 Nefes · Sakinleştir", titleEN: "47 Breath · Regulate",
    stepsTR: [
      "Gözlerini kapat. Omuzlarını indir.",
      "4 saniye nefes al… burundan, derin.",
      "2 saniye tut… sessizce.",
      "6 saniye yavaşça ver… ağızdan.",
      "Tekrarla. Kalp yumuşayana kadar.",
      "Tamamlandı. Şimdi SANRI'ya sor: bu sessizlikte ne duydun?",
    ],
    stepsEN: [
      "Close your eyes. Drop your shoulders.",
      "Inhale 4 seconds… through the nose, deeply.",
      "Hold 2 seconds… in silence.",
      "Exhale 6 seconds… slowly, through the mouth.",
      "Repeat. Until the heart softens.",
      "Complete. Now ask SANRI: what did you hear in that silence?",
    ],
  },
  focus_369: {
    titleTR: "369 Odak · Açık Zihin", titleEN: "369 Focus · Clear Mind",
    stepsTR: [
      "Bir dakika. Sadece bir dakika.",
      "Omuzlarını bilinçli olarak indir.",
      "Gözlerini yumuşat — bakışını odağından çöz.",
      "Zihnindeki tek soruyu bul. Onu net söyle.",
      "Niyetin netleşti. Şimdi SANRI ile derinleştir.",
    ],
    stepsEN: [
      "One minute. Just one minute.",
      "Consciously drop your shoulders.",
      "Soften your eyes — release focus.",
      "Find the one question in your mind. Say it clearly.",
      "Your intention is clear. Now deepen with SANRI.",
    ],
  },
  signal: {
    titleTR: "Sinyal · Yön Bul", titleEN: "Signal · Find Direction",
    stepsTR: [
      "Bugün sana bir soru: neye evet diyorsun?",
      "Evet demek için önce hayırlarını gör.",
      "Yönün hedef değil — hissettiğin çekim.",
      "Küçük bir seçim yap. Şimdi. Büyüğü gelir.",
      "Sinyalin sende. SANRI ile onu oku.",
    ],
    stepsEN: [
      "A question for you today: what is your yes?",
      "To say yes, first see your no's.",
      "Direction is not a goal — it's a pull you feel.",
      "Make one small choice. Now. The rest follows.",
      "The signal is within you. Read it with SANRI.",
    ],
  },
};

const BREATH_PHASES = [
  { labelTR: "Nefes Al", labelEN: "Inhale", dur: 4000 },
  { labelTR: "Tut", labelEN: "Hold", dur: 2000 },
  { labelTR: "Ver", labelEN: "Exhale", dur: 6000 },
];

export default function FrekansAlaniPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [activeIdx, setActiveIdx] = useState(3);
  const chakra = CHAKRAS[activeIdx];

  // experience state
  const [expMode, setExpMode] = useState(null); // null | "pulse" | "breath" | "protocol"
  const [breathPhase, setBreathPhase] = useState(0);
  const [protoStep, setProtoStep] = useState(0);
  const breathRef = useRef(null);

  const resetExp = useCallback(() => {
    setExpMode(null);
    setBreathPhase(0);
    setProtoStep(0);
    if (breathRef.current) clearInterval(breathRef.current);
  }, []);

  const selectChakra = (i) => {
    setActiveIdx(i);
    resetExp();
  };

  const startPulse = () => { resetExp(); setExpMode("pulse"); };

  const startBreath = () => {
    resetExp();
    setExpMode("breath");
    setBreathPhase(0);
    let phase = 0;
    const cycle = () => {
      breathRef.current = setTimeout(() => {
        phase = (phase + 1) % 3;
        setBreathPhase(phase);
        cycle();
      }, BREATH_PHASES[phase].dur);
    };
    cycle();
  };

  const startProtocol = () => {
    if (!chakra.protocol) return;
    resetExp();
    setExpMode("protocol");
    setProtoStep(0);
  };

  useEffect(() => () => { if (breathRef.current) clearTimeout(breathRef.current); }, []);

  const proto = chakra.protocol ? PROTOCOLS[chakra.protocol] : null;
  const protoSteps = proto ? (isTR ? proto.stepsTR : proto.stepsEN) : [];

  const goHome = () => navigate("/", { state: { skipIntro: true } });
  const goToSanri = () => {
    const q = encodeURIComponent(isTR ? chakra.descTR : chakra.descEN);
    navigate(`/sanriya-sor?domain=frequency_field&mode=mirror&prefill=${q}`, { state: { skipIntro: true } });
  };

  return (
    <div
      className={styles.page}
      style={{ "--ck": chakra.color, "--cg": chakra.glow }}
      onPointerDown={unlockAudio}
    >
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topL}>
          <span className={styles.brand}>SANRI</span>
          <span className={styles.brandSub}>{isTR ? "Enerji Kalibrasyon Alanı" : "Energy Calibration Field"}</span>
        </div>
        <div className={styles.topR}>
          <button className={styles.topBtn} onClick={goHome}>{isTR ? "← Kapılar" : "← Gates"}</button>
          <button className={styles.topBtn} onClick={() => setLanguage(isTR ? "en" : "tr")}>{isTR ? "EN" : "TR"}</button>
        </div>
      </div>

      {/* CHAKRA NAVIGATION */}
      <div className={styles.chakraNav}>
        {CHAKRAS.map((c, i) => (
          <button
            key={c.key}
            className={`${styles.chakraNode} ${i === activeIdx ? styles.chakraOn : ""}`}
            style={{ "--nc": c.color, "--ng": c.glow }}
            onClick={() => selectChakra(i)}
          >
            <span className={styles.chakraDot} />
            <span className={styles.chakraHz}>{c.hz} Hz</span>
            <span className={styles.chakraName}>{isTR ? c.nameTR : c.nameEN}</span>
          </button>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className={styles.mainGrid}>
        {/* ── LEFT: Frequency Info Panel ── */}
        <div className={styles.infoPanel}>
          <div className={styles.infoHeader}>
            <div className={styles.infoHz}>{chakra.hz} Hz</div>
            <div className={styles.infoName}>{isTR ? chakra.nameTR : chakra.nameEN}</div>
            <div className={styles.infoArea}>{isTR ? chakra.areaTR : chakra.areaEN}</div>
          </div>

          <div className={styles.infoDesc}>
            {isTR ? chakra.descTR : chakra.descEN}
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardLabel}>{isTR ? "ETKİ" : "EFFECT"}</div>
              <div className={styles.infoCardText}>{isTR ? chakra.effectsTR : chakra.effectsEN}</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardLabel}>{isTR ? "BLOKAJ BELİRTİSİ" : "BLOCKAGE SIGN"}</div>
              <div className={styles.infoCardText}>{isTR ? chakra.blockTR : chakra.blockEN}</div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoCardLabel}>{isTR ? "AKTİF ETME" : "ACTIVATION"}</div>
              <div className={styles.infoCardText}>{isTR ? chakra.activeTR : chakra.activeEN}</div>
            </div>
          </div>

          {proto && (
            <div className={styles.linkedProto}>
              <div className={styles.linkedLabel}>{isTR ? "BAĞLI PROTOKOL" : "LINKED PROTOCOL"}</div>
              <div className={styles.linkedName}>{isTR ? proto.titleTR : proto.titleEN}</div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Experience Panel ── */}
        <div className={styles.expPanel}>
          {/* Energy ring */}
          <div className={styles.ringWrap}>
            <div className={styles.ringOuter} />
            <div className={styles.ringInner} />
            {expMode === "breath" && (
              <div className={styles.breathCircle} key={breathPhase} style={{
                animationDuration: `${BREATH_PHASES[breathPhase].dur}ms`,
                animationName: breathPhase === 0 ? styles.breathIn : breathPhase === 2 ? styles.breathOut : styles.breathHold,
              }} />
            )}
            <div className={styles.ringCenter}>
              {expMode === "breath" ? (
                <span className={styles.ringLabel}>
                  {isTR ? BREATH_PHASES[breathPhase].labelTR : BREATH_PHASES[breathPhase].labelEN}
                </span>
              ) : (
                <span className={styles.ringHz}>{chakra.hz}</span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button
              className={`${styles.ctrlBtn} ${expMode === "pulse" ? styles.ctrlOn : ""}`}
              onClick={startPulse}
            >
              <span className={styles.ctrlIcon}>◎</span>
              {isTR ? "Frekans Başlat" : "Start Frequency"}
            </button>
            <button
              className={`${styles.ctrlBtn} ${expMode === "breath" ? styles.ctrlOn : ""}`}
              onClick={startBreath}
            >
              <span className={styles.ctrlIcon}>≋</span>
              {isTR ? "Nefes Modu" : "Breath Mode"}
            </button>
            {proto && (
              <button
                className={`${styles.ctrlBtn} ${expMode === "protocol" ? styles.ctrlOn : ""}`}
                onClick={startProtocol}
              >
                <span className={styles.ctrlIcon}>⚡</span>
                {isTR ? proto.titleTR.split("·")[0].trim() : proto.titleEN.split("·")[0].trim()}
              </button>
            )}
          </div>

          {/* Protocol runner */}
          {expMode === "protocol" && proto && (
            <div className={styles.protoRunner}>
              <div className={styles.protoStep}>
                {isTR ? `Adım ${protoStep + 1} / ${protoSteps.length}` : `Step ${protoStep + 1} / ${protoSteps.length}`}
              </div>
              <div className={styles.protoBar}>
                <div className={styles.protoFill} style={{ width: `${((protoStep + 1) / protoSteps.length) * 100}%` }} />
              </div>
              <div className={styles.protoText}>{protoSteps[protoStep]}</div>
              <div className={styles.protoBtns}>
                {protoStep < protoSteps.length - 1 ? (
                  <button className={styles.protoPrimary} onClick={() => setProtoStep(s => s + 1)}>
                    {isTR ? "Sonraki →" : "Next →"}
                  </button>
                ) : (
                  <button className={styles.protoPrimary} onClick={goToSanri}>
                    {isTR ? "SANRI ile Devam Et →" : "Continue with SANRI →"}
                  </button>
                )}
                <button className={styles.protoGhost} onClick={resetExp}>
                  {isTR ? "Kapat" : "Close"}
                </button>
              </div>
            </div>
          )}

          {/* Pulse mode visual */}
          {expMode === "pulse" && (
            <div className={styles.pulseInfo}>
              <p>{isTR
                ? `${chakra.hz} Hz frekansı aktif. Gözlerini kapat ve hisset.`
                : `${chakra.hz} Hz frequency active. Close your eyes and feel.`}
              </p>
              <button className={styles.protoGhost} onClick={resetExp}>{isTR ? "Durdur" : "Stop"}</button>
            </div>
          )}

          {/* Idle CTA */}
          {!expMode && (
            <div className={styles.idleCta}>
              <p className={styles.idleText}>
                {isTR
                  ? "Bir mod seç ve deneyimi başlat."
                  : "Choose a mode and start the experience."}
              </p>
              <button className={styles.sanriBtn} onClick={goToSanri}>
                ✦ {isTR ? "SANRI'ya Sor" : "Ask SANRI"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.foot}>© 2026 SANRI</div>
    </div>
  );
}
