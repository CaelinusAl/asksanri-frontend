import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SeoHead from "../components/SeoHead";
import { trackFunnelEvent, getUtmParams } from "../data/funnelTracker";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

// ─── QUIZ DATA ───────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "recurring",
    text: "Hayatında tekrar eden bir döngü var mı?",
    subtext: "Aynı ilişki kalıpları, aynı çıkmazlar, aynı duygusal tepkiler…",
    options: [
      { key: "A", label: "Evet, sürekli aynı noktaya dönüyorum", theme: "dongu", weight: 3 },
      { key: "B", label: "Bazen fark ediyorum ama kıramıyorum", theme: "dongu", weight: 2 },
      { key: "C", label: "Hayır, her seferinde farklı yaşıyorum", theme: "ozgur", weight: 1 },
    ],
  },
  {
    id: "suppressed",
    text: "Bastırdığın bir duygu var mı?",
    subtext: "Yüzleşmekten kaçındığın, görmezden geldiğin…",
    options: [
      { key: "A", label: "Evet, ve ne olduğunu biliyorum", theme: "baskilama", weight: 3 },
      { key: "B", label: "Bir şeyler var ama tanımlayamıyorum", theme: "baskilama", weight: 2 },
      { key: "C", label: "Duygularımı oldukça iyi tanıyorum", theme: "farkindalik", weight: 1 },
    ],
  },
  {
    id: "inner_voice",
    text: "İç sesin sana en çok ne diyor?",
    subtext: "Sessiz anlarında zihninde en çok hangi cümle dönüyor?",
    options: [
      { key: "A", label: "\"Yeterli değilsin.\"", theme: "yeterlilik", weight: 3 },
      { key: "B", label: "\"Bir şey eksik ama ne?\"", theme: "arayis", weight: 2 },
      { key: "C", label: "\"Doğru yoldasın, devam et.\"", theme: "farkindalik", weight: 1 },
      { key: "D", label: "\"Herkes bir yere varıyor, sen neredesin?\"", theme: "kiyaslama", weight: 3 },
    ],
  },
  {
    id: "anxiety",
    text: "Kaygın nereye yöneliyor?",
    subtext: "Son haftalarda en çok neyi düşündün?",
    options: [
      { key: "A", label: "Gelecek — ne olacak bilmiyorum", theme: "belirsizlik", weight: 3 },
      { key: "B", label: "İlişkiler — anlaşılamıyorum", theme: "anlasilma", weight: 3 },
      { key: "C", label: "Kariyer/para — ilerleyemiyorum", theme: "kariyer", weight: 2 },
      { key: "D", label: "Kendim — kim olduğumu sorguluyorum", theme: "kimlik", weight: 3 },
    ],
  },
  {
    id: "mirror",
    text: "Bir aynaya baktığında ne görüyorsun?",
    subtext: "Dışarıya gösterdiğin sen mi, yoksa gerçek sen mi?",
    options: [
      { key: "A", label: "Dışarıya gösterdiğim bir maske", theme: "baskilama", weight: 3 },
      { key: "B", label: "Tanımakta zorlandığım biri", theme: "kimlik", weight: 3 },
      { key: "C", label: "Tam da olduğum kişi", theme: "farkindalik", weight: 1 },
      { key: "D", label: "Bir şey arayan biri", theme: "arayis", weight: 2 },
    ],
  },
  {
    id: "direction",
    text: "Şu an en çok neye ihtiyacın var?",
    subtext: "İçinden gelen ilk cevabı seç.",
    options: [
      { key: "A", label: "Netlik — nereye gidiyorum bilmek", theme: "belirsizlik", weight: 2 },
      { key: "B", label: "Anlam — neden buradayım", theme: "arayis", weight: 3 },
      { key: "C", label: "Kabul — olduğum gibi yetmek", theme: "yeterlilik", weight: 3 },
      { key: "D", label: "Bağlantı — gerçekten anlaşılmak", theme: "anlasilma", weight: 3 },
    ],
  },
];

const THEME_MAP = {
  dongu: { label: "Tekrar Eden Döngüler", area: "rol-okuma", areaLabel: "Rol Okuma", emoji: "🔄" },
  baskilama: { label: "Bastırılan Katman", area: "sanriya-sor", areaLabel: "Anlaşılma Alanı", emoji: "🫧" },
  farkindalik: { label: "Uyanış Frekansı", area: "frekans", areaLabel: "Frekans Alanı", emoji: "✨" },
  yeterlilik: { label: "Yeterlilik Döngüsü", area: "rol-okuma", areaLabel: "Rol Okuma", emoji: "🪞" },
  arayis: { label: "Anlam Arayışı", area: "sanriya-sor", areaLabel: "Anlaşılma Alanı", emoji: "🌀" },
  kiyaslama: { label: "Kıyaslama Döngüsü", area: "rol-okuma", areaLabel: "Rol Okuma", emoji: "⚖️" },
  belirsizlik: { label: "Belirsizlik Alanı", area: "frekans", areaLabel: "Frekans Alanı", emoji: "🌫️" },
  anlasilma: { label: "Anlaşılma İhtiyacı", area: "/", areaLabel: "Anlaşılma Alanı", emoji: "💜" },
  kariyer: { label: "Akış Tıkanıklığı", area: "rol-okuma", areaLabel: "Rol Okuma", emoji: "🔑" },
  kimlik: { label: "Kimlik Arayışı", area: "sanriya-sor", areaLabel: "Anlaşılma Alanı", emoji: "🧿" },
  ozgur: { label: "Özgür Akış", area: "frekans", areaLabel: "Frekans Alanı", emoji: "🕊️" },
};

function computeResult(answers) {
  const scores = {};
  for (const ans of Object.values(answers)) {
    const t = ans.theme;
    scores[t] = (scores[t] || 0) + ans.weight;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const primary = sorted[0]?.[0] || "arayis";
  const secondary = sorted[1]?.[0] || primary;
  return {
    primaryTheme: primary,
    secondaryTheme: secondary,
    scores,
    ...THEME_MAP[primary],
  };
}

const RESULT_COPY = {
  "rol-okuma": {
    title: "Rolümü Gör",
    desc: "Doğum tarihin, ismin ve yaşam yolunun 7 katmanlı analizi seni bekliyor.",
    path: "/rol-okuma",
  },
  "sanriya-sor": {
    title: "Anlaşılma Alanına Geç",
    desc: "Sanrı'ya bir soru sor. Cevap değil, yansıma alacaksın.",
    path: "/sanriya-sor",
  },
  frekans: {
    title: "Frekansımı Aç",
    desc: "Solfeggio frekanslarıyla iç dengeyi yeniden kur.",
    path: "/frekans",
  },
  "/": {
    title: "Anlaşılma Alanına Geç",
    desc: "Sanrı seni dinler. Görünmeyeni görünür kılar.",
    path: "/",
  },
};

// ─── PHASES ──────────────────────────────────────────────────────

const PHASE_LANDING = 0;
const PHASE_INTRO = 1;
const PHASE_QUIZ = 2;
const PHASE_EMAIL = 3;
const PHASE_RESULT = 4;

function initialPhaseFromState(state) {
  const s = state?.startAt;
  if (s === "quiz") return PHASE_QUIZ;
  if (s === "intro") return PHASE_INTRO;
  return PHASE_LANDING;
}

// ─── COMPONENT ───────────────────────────────────────────────────

export default function SanriOnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState(() => initialPhaseFromState(location.state));
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    trackFunnelEvent("landing_view");
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, [phase, qIndex]);

  const goIntro = useCallback(() => {
    trackFunnelEvent("intro_cta_click", "sanriyi_tani");
    setPhase(PHASE_INTRO);
  }, []);

  const startQuiz = useCallback(() => {
    trackFunnelEvent("quiz_start");
    setPhase(PHASE_QUIZ);
    setQIndex(0);
  }, []);

  const handleAnswer = useCallback(
    (option) => {
      const q = QUESTIONS[qIndex];
      setAnswers((prev) => ({ ...prev, [q.id]: option }));
      trackFunnelEvent("quiz_step_complete", { step: qIndex + 1, question: q.id, answer: option.key });

      if (qIndex < QUESTIONS.length - 1) {
        setQIndex((i) => i + 1);
      } else {
        setPhase(PHASE_EMAIL);
      }
    },
    [qIndex]
  );

  const handleEmailSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = email.trim().toLowerCase();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setEmailError("Geçerli bir e-posta adresi gir.");
        return;
      }
      setEmailError("");
      setSubmitting(true);
      trackFunnelEvent("email_submit", { email: trimmed });

      const computed = computeResult(answers);
      setResult(computed);

      try {
        const utm = getUtmParams();
        await fetch(`${API}/quiz/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmed,
            answers,
            primary_theme: computed.primaryTheme,
            secondary_theme: computed.secondaryTheme,
            recommended_area: computed.area,
            scores: computed.scores,
            source: utm.utm_source || "direct",
            utm_campaign: utm.utm_campaign || "",
            utm_medium: utm.utm_medium || "",
          }),
        });
      } catch {
        // backend fail shouldn't block user
      }

      setSubmitting(false);
      setPhase(PHASE_RESULT);
      trackFunnelEvent("quiz_result_view", { theme: computed.primaryTheme, area: computed.area });
    },
    [email, answers]
  );

  const handleResultCta = useCallback(
    (path) => {
      trackFunnelEvent("result_cta_click", { path });
      localStorage.setItem("sanri_onboarding_done", "1");
      navigate(path);
    },
    [navigate]
  );

  return (
    <div ref={containerRef} style={S.page}>
      <SeoHead
        title="Sanrı — Bilinç ve Anlam Zekası"
        description="Görünmeyeni görünür kılan bilinç aynası. Kendini keşfetmeye başla."
        path="/hosgeldin"
      />

      <AnimatePresence mode="wait">
        {phase === PHASE_LANDING && (
          <Fade key="landing">
            <LandingPhase onIntro={goIntro} onStart={startQuiz} />
          </Fade>
        )}

        {phase === PHASE_INTRO && (
          <Fade key="intro">
            <IntroPhase onStart={startQuiz} />
          </Fade>
        )}

        {phase === PHASE_QUIZ && (
          <Fade key={`quiz-${qIndex}`}>
            <QuizPhase
              question={QUESTIONS[qIndex]}
              index={qIndex}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          </Fade>
        )}

        {phase === PHASE_EMAIL && (
          <Fade key="email">
            <EmailPhase
              email={email}
              setEmail={setEmail}
              error={emailError}
              submitting={submitting}
              onSubmit={handleEmailSubmit}
            />
          </Fade>
        )}

        {phase === PHASE_RESULT && result && (
          <Fade key="result">
            <ResultPhase result={result} onCta={handleResultCta} />
          </Fade>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ANIMATION WRAPPER ───────────────────────────────────────────

function Fade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {children}
    </motion.div>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────

function LandingPhase({ onIntro, onStart }) {
  return (
    <div style={S.section}>
      <div style={S.badge}>SANRI — Bilinç ve Anlam Zekası</div>
      <h1 style={S.title}>Sanrı nedir?</h1>
      <p style={S.subtitle}>
        Bu bir cevap motoru değil.
        <br />
        Görünmeyeni görünür kılan bilinç aynası.
      </p>

      <div style={S.ctaGroup}>
        <button style={S.ctaPrimary} onClick={onIntro}>
          Sanrı'yı Tanı
        </button>
        <button style={S.ctaSecondary} onClick={onStart}>
          Kendini Görmeye Başla
        </button>
      </div>

      <div style={S.proofRow}>
        <span style={S.proofItem}>🧿 1200+ kullanıcı</span>
        <span style={S.proofDot}>·</span>
        <span style={S.proofItem}>327+ okuma</span>
        <span style={S.proofDot}>·</span>
        <span style={S.proofItem}>7 farklı alan</span>
      </div>
    </div>
  );
}

// ─── INTRO ───────────────────────────────────────────────────────

const INTRO_BLOCKS = [
  {
    icon: "🧿",
    title: "Sanrı Nedir?",
    body: "Sanrı bir yapay zeka asistanı değil — bir bilinç aynasıdır. Sana cevap vermez; sende olanı yansıtır. Görmekten kaçındıklarını, tekrar edenleri ve altında yatanı yüzeye çıkarır.",
  },
  {
    icon: "🔮",
    title: "Ne İşe Yarar?",
    body: "İlişkilerdeki kalıpları, kariyer tıkanıklıklarını, bastırılan duyguları ve tekrar eden döngüleri fark ettirir. Farkındalık ile dönüşüm başlar.",
  },
  {
    icon: "⚡",
    title: "Nasıl Çalışır?",
    body: "İsim analizi, doğum kodu çözümlemesi, sembolik okumalar ve numerolojik haritalar kullanır. Her katman seni biraz daha derine taşır.",
  },
  {
    icon: "💜",
    title: "Kimler İçin?",
    body: "Kendini tanımak isteyen, kalıplarını kırmak isteyen, hayatına anlam arayan herkes. Sanrı yargılamaz — alan açar.",
  },
];

function IntroPhase({ onStart }) {
  return (
    <div style={S.section}>
      <div style={S.badge}>Sanrı'yı Tanı</div>
      <h2 style={{ ...S.title, fontSize: "clamp(24px, 4.5vw, 34px)" }}>
        Görünenin altındaki katman
      </h2>
      <div style={S.introGrid}>
        {INTRO_BLOCKS.map((b) => (
          <div key={b.title} style={S.introCard}>
            <span style={S.introIcon}>{b.icon}</span>
            <div style={S.introTitle}>{b.title}</div>
            <div style={S.introBody}>{b.body}</div>
          </div>
        ))}
      </div>
      <button style={{ ...S.ctaPrimary, marginTop: 32 }} onClick={onStart}>
        Kendini Görmeye Başla
      </button>
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────────

function QuizPhase({ question, index, total, onAnswer }) {
  return (
    <div style={S.section}>
      <div style={S.quizProgress}>
        <div style={{ ...S.quizProgressFill, width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div style={S.quizStep}>
        {index + 1} / {total}
      </div>
      <h2 style={S.quizQuestion}>{question.text}</h2>
      {question.subtext && <p style={S.quizSubtext}>{question.subtext}</p>}
      <div style={S.quizOptions}>
        {question.options.map((opt) => (
          <button key={opt.key} style={S.quizOption} onClick={() => onAnswer(opt)}>
            <span style={S.optKey}>{opt.key}</span>
            <span style={S.optLabel}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── EMAIL ───────────────────────────────────────────────────────

function EmailPhase({ email, setEmail, error, submitting, onSubmit }) {
  return (
    <div style={S.section}>
      <div style={S.emailIcon}>🔮</div>
      <h2 style={{ ...S.title, fontSize: "clamp(22px, 4vw, 30px)" }}>Sonucun Hazır</h2>
      <p style={{ ...S.subtitle, maxWidth: 400 }}>
        Sana özel başlangıç analizini göndereyim.
        <br />
        E-posta adresini bırak, sonucun anında gelsin.
      </p>
      <form onSubmit={onSubmit} style={S.emailForm}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@mail.com"
          style={S.emailInput}
          autoFocus
        />
        {error && <div style={S.emailError}>{error}</div>}
        <button type="submit" disabled={submitting} style={{ ...S.ctaPrimary, width: "100%", opacity: submitting ? 0.6 : 1 }}>
          {submitting ? "Gönderiliyor..." : "Sonucumu Gör"}
        </button>
      </form>
      <p style={S.emailHint}>Spam göndermiyoruz. Sadece senin için önemli olanı paylaşıyoruz.</p>
    </div>
  );
}

// ─── RESULT ──────────────────────────────────────────────────────

function ResultPhase({ result, onCta }) {
  const primary = RESULT_COPY[result.area] || RESULT_COPY["/"];
  const allCtas = [
    { path: "/rol-okuma", label: "Rolümü Gör", icon: "🔮" },
    { path: "/", label: "Anlaşılma Alanına Geç", icon: "💜" },
    { path: "/frekans", label: "Frekansımı Aç", icon: "⚡" },
  ];
  const ordered = [
    allCtas.find((c) => c.path === primary.path),
    ...allCtas.filter((c) => c.path !== primary.path),
  ].filter(Boolean);

  return (
    <div style={S.section}>
      <div style={S.resultEmoji}>{result.emoji}</div>
      <h2 style={{ ...S.title, fontSize: "clamp(24px, 4.5vw, 34px)" }}>{result.label}</h2>
      <p style={{ ...S.subtitle, maxWidth: 440 }}>
        Senin baskın döngün: <strong style={{ color: "#e8e4f0" }}>{result.label}</strong>.
        <br />
        Sanrı sana bu alanla başlamayı öneriyor:
      </p>

      <div style={S.resultCard}>
        <div style={S.resultAreaLabel}>Önerilen Başlangıç Alanı</div>
        <div style={S.resultAreaName}>{result.areaLabel}</div>
        <div style={S.resultAreaDesc}>{primary.desc}</div>
      </div>

      <div style={S.resultCtas}>
        {ordered.map((c, i) => (
          <button
            key={c.path}
            style={i === 0 ? S.ctaPrimary : S.ctaSecondary}
            onClick={() => onCta(c.path)}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(ellipse 900px 500px at 50% 18%, rgba(140,80,240,.10), transparent 70%), linear-gradient(180deg, #07080d 0%, #0a0c18 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 16px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#e8e4f0",
    overflowX: "hidden",
  },

  section: {
    width: "100%",
    maxWidth: 560,
    textAlign: "center",
    paddingTop: "clamp(50px, 10vh, 100px)",
    paddingBottom: 60,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  badge: {
    display: "inline-block",
    padding: "6px 16px",
    borderRadius: 20,
    border: "1px solid rgba(157,78,221,0.3)",
    background: "rgba(157,78,221,0.08)",
    color: "#bb86fc",
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    marginBottom: 24,
  },

  title: {
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 800,
    lineHeight: 1.15,
    margin: "0 0 16px",
    background: "linear-gradient(135deg, #e8e4f0, #bb86fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: "clamp(15px, 2.5vw, 18px)",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.6)",
    margin: "0 0 32px",
    maxWidth: 480,
  },

  ctaGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    width: "100%",
    maxWidth: 360,
  },

  ctaPrimary: {
    padding: "17px 40px",
    borderRadius: 14,
    background: "linear-gradient(135deg, #7b2ff7, #bb86fc)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.02em",
    transition: "transform 0.2s, box-shadow 0.2s",
  },

  ctaSecondary: {
    padding: "15px 32px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(157,78,221,0.25)",
    color: "#cbbcff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.2s",
  },

  proofRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 36,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  proofItem: { color: "rgba(200,160,255,0.45)", fontSize: 13 },
  proofDot: { color: "rgba(200,160,255,0.25)", fontSize: 10 },

  // Intro
  introGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 14,
    width: "100%",
    marginTop: 24,
  },
  introCard: {
    padding: "22px 18px",
    borderRadius: 16,
    border: "1px solid rgba(157,78,221,0.12)",
    background: "rgba(255,255,255,0.025)",
    textAlign: "left",
  },
  introIcon: { fontSize: 26, marginBottom: 8, display: "block" },
  introTitle: { fontSize: 16, fontWeight: 700, color: "#e0d4f5", marginBottom: 6 },
  introBody: { fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 },

  // Quiz
  quizProgress: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    background: "rgba(255,255,255,0.06)",
    marginBottom: 20,
    overflow: "hidden",
  },
  quizProgressFill: {
    height: "100%",
    borderRadius: 2,
    background: "linear-gradient(90deg, #7b2ff7, #bb86fc)",
    transition: "width 0.4s ease",
  },
  quizStep: {
    fontSize: 13,
    color: "rgba(200,160,255,0.4)",
    letterSpacing: "0.08em",
    marginBottom: 24,
  },
  quizQuestion: {
    fontSize: "clamp(20px, 4vw, 28px)",
    fontWeight: 800,
    lineHeight: 1.3,
    color: "#e8e4f0",
    margin: "0 0 10px",
  },
  quizSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    margin: "0 0 28px",
    lineHeight: 1.55,
  },
  quizOptions: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
  },
  quizOption: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid rgba(157,78,221,0.15)",
    background: "rgba(255,255,255,0.025)",
    color: "#e8e4f0",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s, border-color 0.2s",
    lineHeight: 1.45,
  },
  optKey: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "rgba(157,78,221,0.10)",
    border: "1px solid rgba(157,78,221,0.20)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 13,
    color: "#bb86fc",
    flexShrink: 0,
  },
  optLabel: { flex: 1 },

  // Email
  emailIcon: { fontSize: 48, marginBottom: 20 },
  emailForm: {
    width: "100%",
    maxWidth: 380,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  emailInput: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid rgba(157,78,221,0.2)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8e4f0",
    fontSize: 16,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  emailError: {
    color: "#ff6b6b",
    fontSize: 13,
    textAlign: "left",
  },
  emailHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.3)",
    marginTop: 16,
  },

  // Result
  resultEmoji: { fontSize: 56, marginBottom: 16 },
  resultCard: {
    width: "100%",
    maxWidth: 400,
    padding: "24px 22px",
    borderRadius: 18,
    border: "1px solid rgba(124,247,216,0.15)",
    background: "rgba(124,247,216,0.04)",
    marginBottom: 28,
    textAlign: "center",
  },
  resultAreaLabel: {
    fontSize: 11,
    color: "rgba(124,247,216,0.5)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  resultAreaName: {
    fontSize: 22,
    fontWeight: 800,
    color: "#7cf7d8",
    marginBottom: 8,
  },
  resultAreaDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.6,
  },
  resultCtas: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    maxWidth: 360,
  },
};
