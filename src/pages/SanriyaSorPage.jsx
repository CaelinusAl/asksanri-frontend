import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Eye, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MODES = [
  { id: "mirror", labelTR: "Ayna", labelEN: "Mirror" },
  { id: "dream", labelTR: "Rüya", labelEN: "Dream" },
  { id: "divine", labelTR: "İlahi", labelEN: "Divine" },
  { id: "shadow", labelTR: "Gölge", labelEN: "Shadow" },
  { id: "light", labelTR: "Işık", labelEN: "Light" },
];

const DOMAINS = [
  { id: "auto", labelTR: "Otomatik", labelEN: "Auto" },
  { id: "awakened_cities", labelTR: "Uyanmış Şehirler", labelEN: "Awakened Cities" },
  { id: "consciousness_field", labelTR: "Bilinç Alanı", labelEN: "Consciousness Field" },
  { id: "frequency_field", labelTR: "Frekans Alanı", labelEN: "Frequency Field" },
  { id: "ritual_space", labelTR: "Ritüel Alanı", labelEN: "Ritual Space" },
  { id: "neural_ecstasy", labelTR: "Beyin Orgazmı", labelEN: "Brain Ecstasy" },
  { id: "book_112", labelTR: "112. Kitap", labelEN: "Book 112" },
];

export default function SanriyaSorPage() {
  const { language, t } = useLanguage();

  const tx = useMemo(() => {
    const tr = {
      title: "CAELINUS AI",
      subtitle: "Consciousness Mirror",
      pageTitle: "Ask SANRI • Soru Alanı",
      introTitle: "Bir an dur.",
      intro: "Sorunu yazmadan önce, bedeninde nerede yankılandığını hisset. SANRI cevap üretmez; kapıyı açar.",
      rulesTitle: "Tek soru kuralı",
      rules: "Teşhis yok. Dayatma yok. Dramatize etmek yok.",
      placeholder: "Bir kelime, soru, rüya veya tarih yaz…",
      send: "Yansıt",
      thinking: "Yansıma oluşturuluyor…",
      emptyHint: "Bir cümle yaz. Sistem kapıyı oradan açar.",
      domain: "Domain (opsiyonel)",
      mode: "Mod",
    };
    const en = {
      title: "CAELINUS AI",
      subtitle: "Consciousness Mirror",
      pageTitle: "Ask SANRI • Reflection Field",
      introTitle: "Pause.",
      intro: "Before you write, feel where it echoes in your body. SANRI doesn’t give answers; it opens doors.",
      rulesTitle: "One-question rule",
      rules: "No diagnosis. No forcing. No dramatizing.",
      placeholder: "Write a word, question, dream, or date…",
      send: "Reflect",
      thinking: "Generating reflection…",
      emptyHint: "Write one sentence. The system opens from there.",
      domain: "Domain (optional)",
      mode: "Mode",
    };
    return language === "en" ? en : tr;
  }, [language]);

  const modeLabel = (m) => (language === "en" ? m.labelEN : m.labelTR);
  const domainLabel = (d) => (language === "en" ? d.labelEN : d.labelTR);

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]); // {role:"user"|"sanri", text:string}
  const [sessionId, setSessionId] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `[MODE=${mode}][DOMAIN=${domain}]\n${text}`,
          session_id: sessionId || "default",
          mode: "user",
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      if (!sessionId && data.session_id) setSessionId(data.session_id);

      const answer = data.response || data.answer || "";
      setMessages((prev) => [...prev, { role: "sanri", text: String(answer) }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "sanri", text: language === "en" ? "The mirror is resting. Try again." : "Ayna şu an dinleniyor. Tekrar dene." },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="caelinus-hypno-bg min-h-screen">
    <div className="min-h-screen bg-[#05030a] text-white relative overflow-hidden">
      {/* Nebula */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-3xl opacity-35 bg-purple-700" />
        <div className="absolute -bottom-48 -right-48 w-[780px] h-[780px] rounded-full blur-3xl opacity-30 bg-fuchsia-600" />
        <div className="absolute inset-0 opacity-[0.08]"
             style={{
               backgroundImage:
                 "radial-gradient(circle at 20% 30%, rgba(255,255,255,.12) 0, transparent 35%), radial-gradient(circle at 70% 60%, rgba(255,255,255,.08) 0, transparent 40%), linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
               backgroundSize: "auto, auto, 48px 48px, 48px 48px",
             }}
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-purple-300" />
          </div>
          <div className="leading-tight">
            <div className="text-sm tracking-wide text-white/90 font-semibold">{tx.title}</div>
            <div className="text-xs text-white/50">{tx.subtitle}</div>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-white/70">{tx.pageTitle}</div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
            <span>Ctrl</span>+<span>Enter</span>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 px-4 sm:px-8 py-6">
        {/* Left Panel */}
        <Card className="bg-black/25 border-white/10 backdrop-blur">
          <CardContent className="p-5 space-y-5">
            <div className="space-y-2">
              <div className="text-white/90 font-serif text-lg">{tx.introTitle}</div>
              <p className="text-sm text-white/65 leading-relaxed">{tx.intro}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/70 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="uppercase tracking-widest">{tx.rulesTitle}</span>
              </div>
              <p className="text-sm text-white/70">{tx.rules}</p>
            </div>

            <Separator className="bg-white/10" />

            {/* Mode */}
            <div className="space-y-2">
              <div className="text-xs text-white/60 uppercase tracking-widest">{tx.mode}</div>
              <div className="flex flex-wrap gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={[
                      "px-3 py-1.5 rounded-full text-xs border transition",
                      mode === m.id
                        ? "bg-purple-500/20 border-purple-300/40 text-white"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {modeLabel(m)}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <div className="text-xs text-white/60 uppercase tracking-widest">{tx.domain}</div>
              <div className="relative">
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 outline-none"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id} className="bg-[#0b0614]">
                      {domainLabel(d)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="text-xs text-white/45">
              {language === "en"
                ? "This field does not produce knowledge. It reflects meaning."
                : 'Bu alan "bilgi" üretmez. Anlam yansıtır.'}
            </div>
          </CardContent>
        </Card>

        {/* Main Panel */}
        <div className="space-y-4">
          {/* Void Stage */}
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="text-sm text-white/70">
                {language === "en" ? "Reflection Stream" : "Yansıma Akışı"}
              </div>
              <div className="text-xs text-white/50">
                {modeLabel(MODES.find((m) => m.id === mode))} • {domainLabel(DOMAINS.find((d) => d.id === domain))}
              </div>
            </div>

            <div className="p-5 min-h-[360px] max-h-[54vh] overflow-y-auto space-y-4">
              {messages.length === 0 && !isThinking && (
                <div className="text-white/55 text-sm italic">
                  {tx.emptyHint}
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={[
                      "max-w-[92%] sm:max-w-[75%] rounded-2xl px-4 py-3 border",
                      m.role === "user"
                        ? "bg-purple-500/15 border-purple-300/20 text-white"
                        : "bg-white/5 border-white/10 text-white/85",
                    ].join(" ")}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</div>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-white/60 text-sm italic">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  {tx.thinking}
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input */}
          <div className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur p-4">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={tx.placeholder}
                className="min-h-[96px] pr-14 resize-none bg-white/5 border-white/10 text-white placeholder:text-white/35"
              />
              <Button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="absolute bottom-3 right-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white h-10 w-10 p-0"
                title="Ctrl+Enter"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-white/45">
              <span>© 2026 CaelinusAI • SANRI</span>
              <span className="hidden sm:inline">Ctrl+Enter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}