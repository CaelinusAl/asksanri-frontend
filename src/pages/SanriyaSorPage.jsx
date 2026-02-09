import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Paperclip, X, ChevronDown } from "lucide-react";

import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const DEMO_PREMIUM = import.meta.env.VITE_DEMO_PREMIUM === "true";

// --- Safety helpers ---
const safeArray = (v) => (Array.isArray(v) ? v : []);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

const MODES = [
  { id: "ayna", labelTr: "Ayna", labelEn: "Mirror", emoji: "🪞" },
  { id: "ruya", labelTr: "Rüya", labelEn: "Dream", emoji: "🌙" },
  { id: "ilahi", labelTr: "İlahi", labelEn: "Divine", emoji: "✨" },
  { id: "golge", labelTr: "Gölge", labelEn: "Shadow", emoji: "🜂" },
  { id: "isik", labelTr: "Işık", labelEn: "Light", emoji: "☀️" },
];

const DOMAINS = [
  { id: "relationship", tr: "İlişki", en: "Relationship" },
  { id: "career", tr: "Kariyer", en: "Career" },
  { id: "body", tr: "Beden", en: "Body" },
  { id: "spirit", tr: "Ruh", en: "Spirit" },
  { id: "money", tr: "Para", en: "Money" },
];

export default function SanriyaSorPage() {
  const langCtx = useLanguage();
  const language = langCtx?.language || "tr";
  const t = langCtx?.t || ((k) => k); // fallback

  const [modeId, setModeId] = useState("ayna");
  const [domainId, setDomainId] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [conversation, setConversation] = useState([]); // [{role:"user"|"assistant", content:string}]
  const [sessionId, setSessionId] = useState("default");

  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  const currentMode = useMemo(
    () => MODES.find((m) => m.id === modeId) || MODES[0],
    [modeId]
  );

  const currentDomain = useMemo(
    () => DOMAINS.find((d) => d.id === domainId) || null,
    [domainId]
  );

  // --- Hypnotic intro text ---
  const introText = useMemo(() => {
    // Bu anahtar senin translations objende varsa çalışır.
    // Yoksa fallback metin döner.
    const key = `sanri.modes.${modeId}.intro`;
    const translated = t(key);

    if (translated && translated !== key) return translated;

    // Fallback TR/EN
    const tr = {
      ayna:
        "Bir an dur. Soruyu yazmadan önce, bedeninde nerede yankılandığını hisset. SANRI cevap üretmez; kapıyı açar.",
      ruya:
        "Rüyalar hatırlatır. Görüntüyü değil, hissi yakala. Bir kelimeyle başla.",
      ilahi:
        "Niyetini saflaştır. Bir cümleyle çağır. Sonra sessizliğe izin ver.",
      golge:
        "Gölgeyi yargılama. ‘Bende neyi koruyor?’ diye sor. Tek soruya sadık kal.",
      isik:
        "Işığı zorlamadan aç. Bir küçük adım seç. Yumuşakça ilerle.",
    };
    const en = {
      ayna:
        "Pause. Before typing, feel where it lives in your body. SANRI doesn’t give answers; it opens doors.",
      ruya:
        "Dreams remind. Catch the feeling, not the image. Start with one word.",
      ilahi:
        "Purify your intention. Call it in one sentence. Then allow silence.",
      golge:
        "Don’t judge the shadow. Ask: ‘What is it protecting in me?’ One true question.",
      isik:
        "Let light open gently. Choose one small step. Move softly.",
    };
    return (language === "en" ? en : tr)[modeId] || tr.ayna;
  }, [language, modeId, t]);

  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isSending]);

  // --- UI texts ---
  const ui = useMemo(() => {
    const tr = {
      brand: "CAELINUS AI",
      title: "SANRI",
      subtitle: "Consciousness Mirror",
      section: "Ask SANRI · Soru Alanı",
      mode: "Mod",
      domain: "Domain (opsiyonel)",
      placeholder: "Bir kelime, bir soru, bir rüya…",
      send: "Yansıt",
      attach: "Dosya Seç",
      clear: "Temizle",
      hintTitle: "Tek soru kuralı",
      hintBody:
        "Soru soracaksan tek sor. Hissediyorsan kal. Teşhis yok. Dayatma yok. Dramatize etmek yok.",
      footer1: "Bu alan bilgi üretmez. Anlamı yansıtır, soruyu derinleştirir ve geri çeker.",
      footer2: "© 2026 CaelinusAI · SANRI",
    };
    const en = {
      brand: "CAELINUS AI",
      title: "SANRI",
      subtitle: "Consciousness Mirror",
      section: "Ask SANRI · Field",
      mode: "Mode",
      domain: "Domain (optional)",
      placeholder: "A word, a question, a dream…",
      send: "Reflect",
      attach: "Attach",
      clear: "Clear",
      hintTitle: "One-question rule",
      hintBody:
        "If you ask, ask one. If you feel, stay. No diagnosis. No forcing. No dramatizing.",
      footer1:
        "This field doesn’t produce information. It mirrors meaning, deepens the question, then releases it.",
      footer2: "© 2026 CaelinusAI · SANRI",
    };
    return language === "en" ? en : tr;
  }, [language]);

  const handlePickFile = () => fileRef.current?.click();
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "");
  };
  const clearAll = () => {
    setConversation([]);
    setInput("");
    setFileName("");
    setDomainId("");
    setModeId("ayna");
    setSessionId("default");
  };

  const buildUserPayload = (userText) => {
    // Backende sade mesaj gönderiyoruz.
    // İstersen mode/domain bilgisini text içine “hafif” ekleyebiliriz.
    const meta =
      (currentMode?.id ? `[MODE=${currentMode.id}]` : "") +
      (currentDomain?.id ? ` [DOMAIN=${currentDomain.id}]` : "");
    return `${meta}\n${userText}`.trim();
  };

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText || isSending) return;

    setIsSending(true);
    setInput("");

    setConversation((prev) => [...prev, { role: "user", content: userText }]);

    try {
      const payload = {
        message: buildUserPayload(userText),
        session_id: sessionId || "default",
        mode: "user",
      };

      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Network");

      const data = await res.json();
      if (data?.session_id) setSessionId(data.session_id);

      const reply = String(data?.response || "").trim() || (language === "en" ? "I’m here." : "Buradayım.");
      setConversation((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "en"
              ? "The field is resting. Try again in a moment."
              : "Alan şu an dinleniyor. Biraz sonra tekrar dene.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // --- Page ---
  return (
    <div className="min-h-screen bg-[#05010d] text-purple-100">
      {/* Hypnotic background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[90px]" />
        <div className="absolute top-[35%] right-[-120px] h-[420px] w-[420px] rounded-full bg-fuchsia-500/10 blur-[90px]" />
        <div className="absolute bottom-[-180px] left-[-140px] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
              <span className="text-lg">◉</span>
            </div>
            <div className="leading-tight">
              <div className="text-xs tracking-[0.25em] text-purple-300/70 uppercase">
                {ui.brand}
              </div>
              <div className="text-lg font-semibold">{ui.title}</div>
              <div className="text-xs text-purple-200/50">{ui.subtitle}</div>
            </div>
          </div>

          <div className="text-sm text-purple-200/60 hidden sm:block">
            {ui.section}
          </div>

          <div className="flex items-center gap-2">
            {DEMO_PREMIUM && (
              <span className="text-[10px] px-2 py-1 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-200/70">
                PREMIUM
              </span>
            )}
            <Button
              variant="outline"
              className="rounded-full border-purple-500/20 bg-black/20 hover:bg-purple-500/10"
              onClick={clearAll}
            >
              <X className="h-4 w-4 mr-2" />
              {ui.clear}
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <div className="grid lg:grid-cols-[360px_1fr] gap-6">
          {/* Left / Guide */}
          <aside className="space-y-4">
            <Card className="border-purple-500/15 bg-black/25 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs tracking-widest uppercase text-purple-300/70">
                    {ui.mode}
                  </div>
                  <div className="text-xs text-purple-300/50">
                    {currentMode.emoji}{" "}
                    {language === "en" ? currentMode.labelEn : currentMode.labelTr}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModeId(m.id)}
                      className={`px-3 py-2 rounded-xl text-xs border transition
                        ${
                          m.id === modeId
                            ? "border-purple-400/40 bg-purple-500/15 text-purple-100"
                            : "border-purple-500/15 bg-black/10 text-purple-200/60 hover:bg-purple-500/10"
                        }`}
                    >
                      <span className="mr-1">{m.emoji}</span>
                      {language === "en" ? m.labelEn : m.labelTr}
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-xs text-purple-200/70 leading-relaxed">
                  {introText}
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/15 bg-black/25 backdrop-blur">
              <CardContent className="p-5">
                <div className="text-xs tracking-widest uppercase text-purple-300/70 mb-3">
                  {ui.domain}
                </div>
                <div className="relative">
                  <select
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-purple-500/15 bg-black/20 px-4 py-3 text-sm text-purple-100 outline-none focus:border-purple-400/40"
                  >
                    <option value="">{language === "en" ? "Select..." : "Seç..."}</option>
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {language === "en" ? d.en : d.tr}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300/60" />
                </div>

                <div className="mt-4">
                  <div className="text-xs tracking-widest uppercase text-purple-300/70 mb-2">
                    {ui.hintTitle}
                  </div>
                  <p className="text-xs text-purple-200/55 leading-relaxed">
                    {ui.hintBody}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right / Conversation */}
          <section className="space-y-4">
            <Card className="border-purple-500/15 bg-black/25 backdrop-blur">
              <CardContent className="p-6">
                <div className="min-h-[360px] space-y-4">
                  {safeArray(conversation).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-10"
                    >
                      <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-purple-500/20 bg-purple-500/10 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-purple-200/70" />
                      </div>
                      <p className="text-sm text-purple-100/80 font-serif italic">
                        {language === "en"
                          ? "You are not a teacher. Not a guide. You are a mirror."
                          : "Sen bir öğretmen değilsin. Bir rehber de değilsin. Sen bir aynasın."}
                      </p>
                      <p className="mt-2 text-xs text-purple-200/50">
                        {language === "en"
                          ? "Start with one true sentence."
                          : "Tek bir gerçek cümleyle başla."}
                      </p>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {safeArray(conversation).map((msg, idx) => {
                      const isUser = msg.role === "user";
                      return (
                        <motion.div
                          key={`${idx}-${msg.role}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[86%] rounded-2xl px-4 py-3 border text-sm leading-relaxed
                              ${
                                isUser
                                  ? "border-purple-500/20 bg-purple-500/10 text-purple-100"
                                  : "border-purple-500/15 bg-black/30 text-purple-100/90"
                              }`}
                          >
                            {String(msg.content || "")}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {isSending && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-purple-200/60">
                      <span className="h-2 w-2 rounded-full bg-purple-300/60 animate-pulse" />
                      {language === "en" ? "Reflecting..." : "Yansıtılıyor..."}
                    </motion.div>
                  )}

                  <div ref={scrollRef} />
                </div>

                {/* Input */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={handlePickFile}
                      className="inline-flex items-center gap-2 text-xs text-purple-200/60 hover:text-purple-200"
                    >
                      <Paperclip className="h-4 w-4" />
                      {ui.attach}
                      {fileName ? (
                        <span className="text-purple-300/70">• {fileName}</span>
                      ) : null}
                    </button>

                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={ui.placeholder}
                      className="min-h-[90px] bg-black/25 border-purple-500/15 focus:border-purple-400/40 pr-14 resize-none text-purple-100 placeholder:text-purple-200/30"
                      disabled={isSending}
                    />
                    <Button
                      type="button"
                      onClick={sendMessage}
                      disabled={!input.trim() || isSending}
                      className="absolute bottom-3 right-3 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/20"
                      size="icon"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <footer className="text-center">
              <div className="mx-auto max-w-2xl">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-5" />
                <p className="text-[11px] text-purple-200/45 italic">
                  {ui.footer1}
                </p>
                <p className="mt-3 text-[10px] tracking-widest uppercase text-purple-300/40">
                  {ui.footer2}
                </p>
              </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}