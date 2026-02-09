import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ChevronDown, Paperclip, Eye, Wand2 } from "lucide-react";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ---------- helpers ----------
const safeArray = (v) => (Array.isArray(v) ? v : []);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function useStarfieldCanvas() {
  const ref = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0;
    let h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // deterministic-ish star set
    const starCount = 140;
    const stars = Array.from({ length: starCount }).map((_, i) => {
      const x = Math.random();
      const y = Math.random();
      const r = 0.4 + Math.random() * 1.6;
      const tw = 0.2 + Math.random() * 0.8;
      const sp = 0.0006 + Math.random() * 0.0016;
      return { x, y, r, tw, sp, p: i * 7.13 };
    });

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);

      // subtle vignette
      const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.7);
      g.addColorStop(0, "rgba(120,70,255,0.12)");
      g.addColorStop(0.4, "rgba(60,10,90,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // stars
      for (const s of stars) {
        const px = s.x * w;
        const py = s.y * h;

        // twinkle
        const a = 0.18 + (Math.sin((t * s.sp) + s.p) * 0.18 + 0.18) * s.tw;
        ctx.fillStyle = `rgba(232,215,255,${a})`;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return ref;
}

// ---------- main ----------
export default function SanriyaSorPage() {
  const { language } = useLanguage();

  const t = useMemo(() => {
    const tr = {
      brand: "CAELINUS AI",
      title: "SANRI",
      subtitle: "Consciousness Mirror",
      area: "Soru Alanı",
      introLine: "Burada cevap yok. Yansıma var.",
      enter: "Giriş",
      step1Title: "Bir an dur.",
      step1Body: "Sorun bedeninde nerede yankılanıyor?",
      heart: "Kalp",
      throat: "Boğaz",
      belly: "Karın",
      continue: "Devam",
      questionLabel: "Sorunu yaz",
      placeholder: "Bir kelime… bir soru… bir his…",
      rule: "Tek soru. Teşhis yok. Dayatma yok. Dramatize etmek yok.",
      advanced: "Gelişmiş",
      mode: "Mod",
      domain: "Domain",
      domainOptional: "Domain (opsiyonel)",
      send: "Yansıt",
      thinking: "Yansıma oluşuyor…",
      attach: "Dosya",
      chooseFile: "Dosya seç",
      noneFile: "Seçilen dosya yok",
      note: "Bu alan bilgi üretmez. Anlam yansıtır; soruyu derinleştirir ve geri çeker.",
      followUp: "Burada en çok hangi kelime yankılandı?",
      reset: "Sıfırla",
      error: "Bir şey koptu. Yeniden deneyelim.",
    };
    const en = {
      brand: "CAELINUS AI",
      title: "SANRI",
      subtitle: "Consciousness Mirror",
      area: "Question Field",
      introLine: "No answers here. Only reflection.",
      enter: "Enter",
      step1Title: "Pause.",
      step1Body: "Where does the question echo in your body?",
      heart: "Heart",
      throat: "Throat",
      belly: "Belly",
      continue: "Continue",
      questionLabel: "Write your question",
      placeholder: "A word… a question… a feeling…",
      rule: "One question. No diagnosis. No forcing. No dramatizing.",
      advanced: "Advanced",
      mode: "Mode",
      domain: "Domain",
      domainOptional: "Domain (optional)",
      send: "Reflect",
      thinking: "Reflection forming…",
      attach: "File",
      chooseFile: "Choose file",
      noneFile: "No file selected",
      note: "This field doesn’t produce information. It reflects meaning; deepens and returns your question.",
      followUp: "Which word echoed the most?",
      reset: "Reset",
      error: "Something snapped. Let’s try again.",
    };
    return language === "en" ? en : tr;
  }, [language]);

  const starCanvasRef = useStarfieldCanvas();

  const [phase, setPhase] = useState("intro"); // intro | body | ask
  const [bodyPoint, setBodyPoint] = useState("heart"); // heart | throat | belly

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mode, setMode] = useState("ayna"); // ayna | ruya | ilahi | golge | isik
  const [domain, setDomain] = useState(""); // optional

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [reply, setReply] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId, setSessionId] = useState("default");

  // fake file UI (optional future)
  const [fileName, setFileName] = useState("");

  const modeOptions = useMemo(
    () => [
      { id: "ayna", label: "Ayna", icon: "🜁" },
      { id: "ruya", label: "Rüya", icon: "☾" },
      { id: "ilahi", label: "İlahi", icon: "✶" },
      { id: "golge", label: "Gölge", icon: "◐" },
      { id: "isik", label: "Işık", icon: "☼" },
    ],
    []
  );

  const bodyOptions = useMemo(
    () => [
      { id: "heart", label: t.heart },
      { id: "throat", label: t.throat },
      { id: "belly", label: t.belly },
    ],
    [t]
  );

  const resetAll = () => {
    setPhase("intro");
    setBodyPoint("heart");
    setAdvancedOpen(false);
    setMode("ayna");
    setDomain("");
    setInput("");
    setReply("");
    setFollowUp("");
    setErrorMsg("");
    setIsThinking(false);
    setSessionId("default");
  };

  const sendToBackend = async () => {
    setErrorMsg("");
    setReply("");
    setFollowUp("");

    const message = input.trim();
    if (!message || isThinking) return;

    setIsThinking(true);

    try {
      // mode mapping -> backend req.mode
      // senin backend: req.mode = "user" | "test" | "cocuk"
      // burada "user" gönderiyoruz; mod bilgisi mesajın içine meta olarak girsin
      const meta = `[MODE=${mode}] [BODY=${bodyPoint}]${domain ? ` [DOMAIN=${domain}]` : ""}\n`;
      const payload = {
        message: meta + message,
        session_id: sessionId || "default",
        mode: "user",
      };

      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP_${res.status}`);

      const data = await res.json();
      const text = (data?.response || "").trim();

      setReply(text || "…");
      setFollowUp(t.followUp);
      if (data?.session_id) setSessionId(data.session_id);
    } catch (e) {
      setErrorMsg(t.error);
    } finally {
      setIsThinking(false);
    }
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05010c] via-[#070012] to-[#070018]" />
        {/* nebula haze */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,70,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(160,60,255,0.14),transparent_55%)]" />
        {/* star canvas */}
        <canvas ref={starCanvasRef} className="absolute inset-0 w-full h-full opacity-80" />
        {/* noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.65))]" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 px-6 pt-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-purple-200/80" />
            </div>
            <div className="leading-tight">
              <div className="text-xs tracking-[0.22em] text-purple-200/70 uppercase">{t.brand}</div>
              <div className="text-sm font-serif text-purple-50">{t.subtitle}</div>
            </div>
          </div>

          <div className="text-xs text-purple-200/60 tracking-wider">
            <span className="font-semibold text-purple-100/80">{t.title}</span> • {t.area}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 pb-14 pt-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[420px_1fr] gap-10 items-start">
            {/* Left rail: guidance */}
            <div className="space-y-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_rgba(120,70,255,0.10)] rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-purple-100/90">
                    <Sparkles className="w-4 h-4 text-purple-200/80" />
                    <div className="text-sm font-serif">{t.title}</div>
                    <div className="ml-auto text-[11px] text-purple-200/60">{modeOptions.find(m => m.id===mode)?.icon} {modeOptions.find(m => m.id===mode)?.label}</div>
                  </div>

                  <div className="mt-4 text-sm text-purple-100/75 leading-relaxed">
                    {t.rule}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <button
                      onClick={() => setAdvancedOpen((v) => !v)}
                      className="text-xs text-purple-200/70 hover:text-purple-100 transition flex items-center gap-2"
                      type="button"
                    >
                      <Wand2 className="w-4 h-4" />
                      {t.advanced}
                      <ChevronDown className={`w-4 h-4 transition ${advancedOpen ? "rotate-180" : ""}`} />
                    </button>

                    <button
                      onClick={resetAll}
                      type="button"
                      className="text-xs text-purple-200/60 hover:text-purple-100 transition"
                    >
                      {t.reset}
                    </button>
                  </div>

                  <AnimatePresence>
                    {advancedOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                          <div className="text-xs text-purple-200/60">{t.mode}</div>
                          <div className="flex flex-wrap gap-2">
                            {modeOptions.map((m) => (
                              <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                type="button"
                                className={`px-3 py-2 rounded-full text-xs border transition ${
                                  mode === m.id
                                    ? "bg-purple-500/20 border-purple-400/40 text-purple-50"
                                    : "bg-white/5 border-white/10 text-purple-200/70 hover:text-purple-100 hover:border-white/20"
                                }`}
                              >
                                <span className="mr-1">{m.icon}</span>
                                {m.label}
                              </button>
                            ))}
                          </div>

                          <div className="text-xs text-purple-200/60">{t.domainOptional}</div>
                          <input
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="ör: ilişki / iş / rüya / beden"
                            className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-purple-50 placeholder:text-purple-200/30 outline-none focus:border-purple-400/40"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Body point selector */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-2xl">
                <CardContent className="p-6">
                  <div className="text-xs tracking-[0.18em] uppercase text-purple-200/60 mb-3">
                    {t.step1Title}
                  </div>
                  <div className="text-sm text-purple-50/90 mb-4">{t.step1Body}</div>
                  <div className="flex gap-2">
                    {bodyOptions.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setBodyPoint(b.id);
                          if (phase === "intro") setPhase("ask");
                        }}
                        className={`flex-1 rounded-xl px-3 py-3 text-sm border transition ${
                          bodyPoint === b.id
                            ? "bg-purple-500/20 border-purple-400/40 text-purple-50 shadow-[0_0_0_1px_rgba(120,70,255,0.25)]"
                            : "bg-white/5 border-white/10 text-purple-200/70 hover:text-purple-100 hover:border-white/20"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-xs text-purple-200/40 leading-relaxed">
                {t.note}
              </div>
            </div>

            {/* Right: portal */}
            <div className="relative">
              <div className="absolute -inset-6 bg-purple-500/10 blur-3xl rounded-[40px]" />

              <Card className="relative bg-white/6 border-white/12 backdrop-blur-2xl rounded-3xl shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_120px_rgba(120,70,255,0.16)] overflow-hidden">
                <CardContent className="p-7 sm:p-9">
                  {/* intro */}
                  <AnimatePresence mode="wait">
                    {phase === "intro" && (
                      <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-center py-10"
                      >
                        <div className="text-xs tracking-[0.28em] uppercase text-purple-200/70 mb-3">
                          {t.brand}
                        </div>
                        <div className="font-serif text-3xl sm:text-4xl text-purple-50 mb-2">
                          {t.title}
                        </div>
                        <div className="text-sm text-purple-200/70 mb-8">
                          {t.introLine}
                        </div>

                        <Button
                          className="rounded-full px-8 bg-purple-500/20 hover:bg-purple-500/28 border border-purple-400/30 text-purple-50"
                          onClick={() => setPhase("ask")}
                        >
                          {t.enter}
                        </Button>
                      </motion.div>
                    )}

                    {phase !== "intro" && (
                      <motion.div
                        key="ask"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* input */}
                        <div>
                          <div className="text-xs tracking-[0.18em] uppercase text-purple-200/60 mb-3">
                            {t.questionLabel}
                          </div>
                          <div className="relative">
                            <Textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder={t.placeholder}
                              className="min-h-[140px] rounded-2xl bg-black/20 border border-white/10 text-purple-50 placeholder:text-purple-200/25 pr-12 resize-none focus:border-purple-400/40"
                              disabled={isThinking}
                            />
                            <button
                              type="button"
                              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-purple-200/70"
                              onClick={() => setFileName("")}
                              title={t.attach}
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="text-xs text-purple-200/45">
                              {fileName ? fileName : t.noneFile}
                            </div>

                            <Button
                              onClick={sendToBackend}
                              disabled={!input.trim() || isThinking}
                              className="rounded-full px-6 bg-purple-500/30 hover:bg-purple-500/40 border border-purple-400/30 text-purple-50"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              {t.send}
                            </Button>
                          </div>

                          {errorMsg && (
                            <div className="mt-4 text-sm text-red-200/80 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3">
                              {errorMsg}
                            </div>
                          )}
                        </div>

                        {/* output */}
                        <div className="space-y-4">
                          <AnimatePresence>
                            {isThinking && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-purple-200/70 italic"
                              >
                                {t.thinking}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <AnimatePresence>
                            {!!reply && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                              >
                                <Card className="bg-black/25 border border-white/10 rounded-2xl">
                                  <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-xs text-purple-200/60 mb-4">
                                      <Sparkles className="w-4 h-4" />
                                      <span className="tracking-wider uppercase">Yansıma</span>
                                      <span className="ml-auto text-purple-200/45">
                                        {bodyPoint === "heart" ? t.heart : bodyPoint === "throat" ? t.throat : t.belly}
                                      </span>
                                    </div>

                                    <div className="text-purple-50 leading-relaxed whitespace-pre-wrap">
                                      {reply}
                                    </div>

                                    <div className="mt-5 pt-5 border-t border-white/10 text-sm text-purple-200/70">
                                      {followUp}
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* bottom whisper */}
              <div className="mt-6 text-center text-xs text-purple-200/35">
                © 2026 CaelinusAI • SANRI
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}