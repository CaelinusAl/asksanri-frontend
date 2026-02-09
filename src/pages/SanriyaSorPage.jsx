// src/pages/SanriyaSorPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles, Send, ChevronDown, Wand2, Info, Paperclip } from "lucide-react";

import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// ---------- helpers ----------
const safeArray = (x) => (Array.isArray(x) ? x : []);

const cx = (...xs) => xs.filter(Boolean).join(" ");

export default function SanriyaSorPage() {
  const { language, t } = useLanguage();

  // Modes (fallback) — sende farklıysa burayı güncellersin
  const modesList = useMemo(
    () => [
      { id: "ayna", label: language === "en" ? "Mirror" : "Ayna", emoji: "🪞" },
      { id: "ruya", label: language === "en" ? "Dream" : "Rüya", emoji: "🌙" },
      { id: "ilahi", label: language === "en" ? "Divine" : "İlahi", emoji: "✨" },
      { id: "golge", label: language === "en" ? "Shadow" : "Gölge", emoji: "🕯️" },
      { id: "isik", label: language === "en" ? "Light" : "Işık", emoji: "☀️" },
    ],
    [language]
  );

  const domainsList = useMemo(
    () => [
      { id: "para", label: language === "en" ? "Money" : "Para", emoji: "💸" },
      { id: "ask", label: language === "en" ? "Love" : "Aşk", emoji: "❤️" },
      { id: "aile", label: language === "en" ? "Family" : "Aile", emoji: "🏠" },
      { id: "beden", label: language === "en" ? "Body" : "Beden", emoji: "🫀" },
      { id: "kariyer", label: language === "en" ? "Career" : "Kariyer", emoji: "🧭" },
    ],
    [language]
  );

  const [currentMode, setCurrentMode] = useState(modesList[0]?.id || "ayna");
  const [selectedDomain, setSelectedDomain] = useState("");
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]); // [{role:"user"|"assistant", content:string}]
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState("default");

  // file attach (opsiyonel)
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isThinking]);

  const introText = useMemo(() => {
    // Çeviriler sende varsa buradan akar:
    // translations.tr.sanri.modes.ayna.intro gibi
    const key = `sanri.modes.${currentMode}.intro`;
    const val = t?.(key);
    // Eğer t key’i bulamazsa, fallback:
    if (!val || val === key) {
      const fallback =
        language === "en"
          ? "Pause. Feel where the question sits in your body. Then write."
          : "Bir an dur. Sorunun bedeninde nerede olduğunu hisset. Sonra yaz.";
      return fallback;
    }
    return val;
  }, [currentMode, language, t]);

  const examplePrompt = useMemo(() => {
    if (language === "en") {
      return selectedDomain
        ? `In my ${selectedDomain} field I feel stuck. What is the first crack in the pattern?`
        : `I feel stuck. What is the first crack in the pattern?`;
    }
    return selectedDomain
      ? `“${selectedDomain}” alanında tıkandım. İlk çatlak nerede?`
      : "Tıkandım. İlk çatlak nerede?";
  }, [language, selectedDomain]);

  const buildUserPayload = (userText) => {
    // Backend’ine göre endpoint ayarı:
    // Çoğu yerde sende /api/bilinc-alani/ask çalışıyor.
    // Gerekirse /bilinc-alani/ask yaparsın.
    return {
      message: userText,
      session_id: sessionId || "default",
      mode: "user",
      // İstersen backend prompta bağlam için ekleyebilirsin:
      meta: {
        sanri_mode: currentMode,
        domain: selectedDomain || null,
      },
    };
  };

  const sendMessage = async (userText) => {
    setConversation((prev) => [...prev, { role: "user", content: userText }]);
    setIsThinking(true);

    try {
      const res = await fetch(`${API_URL}/api/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildUserPayload(userText)),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || "Request failed");

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
              ? "Connection paused. Try again in a moment."
              : "Bağlantı kısa süreli durdu. Biraz sonra tekrar dene.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText || isThinking) return;
    setInput("");
    await sendMessage(userText);
  };

  const onExample = async () => {
    if (isThinking) return;
    await sendMessage(examplePrompt);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Dark Gradient */}
      <div className="pt-20 pb-10 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-primary" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-foreground">SANRI</div>
                <div className="text-xs text-foreground/50">Consciousness Mirror</div>
              </div>
            </div>

            <div className="text-sm text-foreground/60 hidden md:block">
              <span className="font-semibold text-foreground/80">Ask SANRI</span>{" "}
              <span className="text-foreground/40">•</span>{" "}
              <span>{language === "en" ? "Question Field" : "Soru Alanı"}</span>
            </div>

            {/* Mode dropdown (simple) */}
            <div className="relative">
              <select
                value={currentMode}
                onChange={(e) => setCurrentMode(e.target.value)}
                className="appearance-none bg-card/60 border border-border/60 text-foreground text-sm rounded-full px-4 py-2 pr-9 hover:bg-card transition"
              >
                {modesList.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-foreground/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3-column layout */}
          <div className="grid lg:grid-cols-[280px_1fr_320px] gap-4">
            {/* LEFT PANEL */}
            <Card className="bg-card/40 border-border/50 backdrop-blur">
              <CardContent className="p-4 space-y-4">
                <div className="text-xs uppercase tracking-wider text-foreground/40">
                  {language === "en" ? "Start Point" : "Başlangıç"}
                </div>

                {/* Mode Chips */}
                <div className="flex flex-wrap gap-2">
                  {modesList.map((m) => {
                    const active = currentMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setCurrentMode(m.id)}
                        className={cx(
                          "px-3 py-1.5 rounded-full text-xs border transition",
                          active
                            ? "bg-primary/15 border-primary/30 text-foreground"
                            : "bg-background/30 border-border/60 text-foreground/70 hover:text-foreground hover:bg-background/40"
                        )}
                        type="button"
                      >
                        <span className="mr-1">{m.emoji}</span>
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                {/* Domain */}
                <div className="space-y-2">
                  <div className="text-xs text-foreground/50">
                    {language === "en" ? "Domain (optional)" : "Domain (opsiyonel)"}
                  </div>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full bg-background/30 border border-border/60 rounded-xl px-3 py-2 text-sm text-foreground"
                  >
                    <option value="">{language === "en" ? "Choose…" : "Seç…"}</option>
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.label}>
                        {d.emoji} {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-xl border-border/60 bg-background/30 hover:bg-background/40"
                  type="button"
                  onClick={onExample}
                  disabled={isThinking}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {language === "en" ? "Show example" : "Örnek soru göster"}
                </Button>

                <Alert className="border-border/60 bg-background/20">
                  <Info className="w-4 h-4 text-foreground/50" />
                  <AlertDescription className="text-xs text-foreground/55 leading-relaxed">
                    {language === "en"
                      ? "SANRI does not diagnose. It mirrors meaning and asks only what needs opening."
                      : "SANRI teşhis koymaz. Anlamı yansıtır ve yalnızca açılması gereken yerde soru sorar."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* CENTER CHAT */}
            <Card className="bg-card/30 border-border/50 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <div className="min-h-[420px] space-y-4">
                  {/* Intro block */}
                  {safeArray(conversation).length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl border border-border/60 bg-background/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <div className="text-sm font-semibold text-foreground">
                          {language === "en" ? "Before you ask…" : "Sormadan önce…"}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {introText}
                      </p>
                    </motion.div>
                  )}

                  {/* Messages */}
                  <div className="space-y-3">
                    {safeArray(conversation).map((m, idx) => {
                      const isUser = m.role === "user";
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cx("flex", isUser ? "justify-end" : "justify-start")}
                        >
                          <div
                            className={cx(
                              "max-w-[85%] rounded-2xl px-4 py-3 border",
                              isUser
                                ? "bg-primary/15 border-primary/25 text-foreground"
                                : "bg-background/20 border-border/60 text-foreground"
                            )}
                          >
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">
                              {String(m.content || "")}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {isThinking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-foreground/60 italic">
                      {language === "en" ? "Reflecting…" : "Yansıma oluşturuluyor…"}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={onSubmit} className="mt-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-border/60 bg-background/30 hover:bg-background/40"
                      onClick={() => fileRef.current?.click()}
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      {language === "en" ? "File" : "Dosya"}
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                    />
                    <div className="text-xs text-foreground/40 truncate">
                      {fileName ? fileName : (language === "en" ? "No file selected" : "Seçilen dosya yok")}
                    </div>
                  </div>

                  <div className="relative">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={language === "en" ? "Write your question…" : "Sorunu yaz…"}
                      className="min-h-[90px] pr-14 resize-none bg-background/30 border-border/60"
                      disabled={isThinking}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute bottom-3 right-3 rounded-full h-10 w-10"
                      disabled={isThinking || !input.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="text-xs text-foreground/40">
                    {language === "en"
                      ? "This field doesn’t produce “knowledge”. It reflects meaning."
                      : 'Bu alan "bilgi" üretmez. Anlam üretir ve geri çekilir.'}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* RIGHT PANEL */}
            <Card className="bg-card/40 border-border/50 backdrop-blur">
              <CardContent className="p-4 space-y-4">
                <div className="text-xs uppercase tracking-wider text-foreground/40">
                  {language === "en" ? "Guidance" : "Kılavuz"}
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-background/20 space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {language === "en" ? "Body check" : "Beden kontrolü"}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {language === "en"
                      ? "Where do you feel it right now?"
                      : "Şu an bedeninde nerede hissediyorsun?"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "kalp", tr: "Kalp", en: "Heart" },
                      { id: "mide", tr: "Mide", en: "Stomach" },
                      { id: "bogaz", tr: "Boğaz", en: "Throat" },
                      { id: "karin", tr: "Karın", en: "Belly" },
                    ].map((x) => (
                      <span
                        key={x.id}
                        className="px-3 py-1.5 rounded-full text-xs border border-border/60 bg-background/30 text-foreground/70"
                      >
                        {language === "en" ? x.en : x.tr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-background/20 space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    {language === "en" ? "One question rule" : "Tek soru kuralı"}
                  </div>
                  <div className="text-sm text-foreground/70">
                    {language === "en"
                      ? "If you ask, ask one. If you feel, stay."
                      : "Soru soracaksan tek sor. Hissediyorsan kal."}
                  </div>
                </div>

                <div className="text-xs text-foreground/35">
                  {language === "en"
                    ? "No diagnosis. No forcing. No drama."
                    : "Teşhis yok. Dayatma yok. Dramatize etmek yok."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer mini */}
          <div className="mt-6 text-center text-xs text-foreground/30">
            © 2026 CaelinusAI • SANRI
          </div>
        </div>
      </div>
    </div>
  );
}