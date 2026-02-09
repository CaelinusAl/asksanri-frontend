import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Paperclip, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const safeArr = (v) => (Array.isArray(v) ? v : []);

export default function SanriyaSorPage() {
  const { language, t } = useLanguage();

  // Page text (fallback)
  const TT = useMemo(() => {
    const tr = {
      title: "CAELINUS AI",
      subtitle: "Consciousness Mirror",
      page: "Ask SANRI • Soru Alanı",
      hint:
        "Bir an dur.\nSorunu yazmadan önce, bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.",
      ruleTitle: "Tek soru kuralı",
      ruleBody: "Teşhis yok. Dayatma yok. Dramatize etmek yok.",
      modeLabel: "Mod",
      domainLabel: "Domain (opsiyonel)",
      example: "Örnek soru göster",
      placeholder: "Bir kelime, soru, rüya veya tarih yaz...",
      send: "Yansıt",
      sending: "Yansıtılıyor...",
      footerLeft: 'Bu alan "bilgi" üretmez. Anlam yansıtır.',
      footerRight: "© 2026 CaelinusAI • SANRI",
      modes: [
        { id: "mirror", label: "Ayna" },
        { id: "dream", label: "Rüya" },
        { id: "divine", label: "İlahi" },
        { id: "shadow", label: "Gölge" },
        { id: "light", label: "Işık" },
      ],
      domains: [
        { id: "auto", label: "Otomatik" },
        { id: "awakened_cities", label: "Uyanmış Şehirler" },
        { id: "consciousness_field", label: "Bilinç Alanı" },
        { id: "frequency_field", label: "Frekans Alanı" },
        { id: "ritual_space", label: "Ritüel Alanı" },
        { id: "neural_ecstasy", label: "Beyin Orgazmı" },
        { id: "book_112", label: "112. Kitap" },
      ],
    };

    const en = {
      title: "CAELINUS AI",
      subtitle: "Consciousness Mirror",
      page: "Ask SANRI • Question Field",
      hint:
        "Pause.\nBefore you write, feel where it echoes in your body.\nSANRI doesn’t answer; it opens the door.",
      ruleTitle: "One question rule",
      ruleBody: "No diagnosis. No forcing. No dramatizing.",
      modeLabel: "Mode",
      domainLabel: "Domain (optional)",
      example: "Show example",
      placeholder: "Write a word, question, dream, or date...",
      send: "Reflect",
      sending: "Reflecting...",
      footerLeft: 'This space does not produce "facts". It reflects meaning.',
      footerRight: "© 2026 CaelinusAI • SANRI",
      modes: [
        { id: "mirror", label: "Mirror" },
        { id: "dream", label: "Dream" },
        { id: "divine", label: "Divine" },
        { id: "shadow", label: "Shadow" },
        { id: "light", label: "Light" },
      ],
      domains: [
        { id: "auto", label: "Auto" },
        { id: "awakened_cities", label: "Awakened Cities" },
        { id: "consciousness_field", label: "Consciousness Field" },
        { id: "frequency_field", label: "Frequency Field" },
        { id: "ritual_space", label: "Ritual Space" },
        { id: "neural_ecstasy", label: "Brain Ecstasy" },
        { id: "book_112", label: "Book 112" },
      ],
    };

    return language === "en" ? en : tr;
  }, [language, t]);

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [conversation, setConversation] = useState([]); // [{role:'user'|'sanri', content:string}]
  const [file, setFile] = useState(null);
  const endRef = useRef(null);

  const scrollDown = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

  const onExample = () => {
    const ex =
      language === "en"
        ? "Why do I keep repeating the same loop?"
        : "Neden hep aynı döngüye geri dönüyorum?";
    setInput(ex);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const text = input.trim();
    setConversation((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: "user",
          meta: { mode, domain },
        }),
      });

      if (!res.ok) throw new Error("request_failed");
      const data = await res.json();

      setConversation((prev) => [
        ...prev,
        { role: "sanri", content: data?.response || "" },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          role: "sanri",
          content:
            language === "en"
              ? "SANRI is resting right now. Please try again."
              : "SANRI şu an dinleniyor. Biraz sonra tekrar dene.",
        },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(scrollDown, 50);
    }
  };

  return (
    <div className="caelinus-hypno-bg min-h-screen">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-transparent backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-purple-200/80" />
            </div>
            <div className="leading-tight">
              <div className="text-[12px] tracking-[0.28em] uppercase text-white/70">
                {TT.title}
              </div>
              <div className="text-[12px] text-purple-200/60">{TT.subtitle}</div>
            </div>
          </div>

          <div className="text-[12px] tracking-wide text-white/70">{TT.page}</div>
        </div>
      </header>

      {/* BODY */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-3 caelinus-glass rounded-full">
            <span className="text-sm tracking-widest text-white/80">CAELINUS AI</span>
            <span className="text-white/20">×</span>
            <span className="text-sm text-purple-200/80">SANRI</span>
          </div>

          <h1 className="mt-6 font-serif text-4xl sm:text-5xl text-white/90">
            Consciousness Mirror
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto whitespace-pre-line">
            {TT.hint}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* LEFT PANEL */}
          <aside className="caelinus-glass p-6 lg:sticky lg:top-24 h-fit">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs uppercase tracking-widest text-purple-200/70 mb-2">
                  {TT.ruleTitle}
                </div>
                <div className="text-sm text-white/70 leading-relaxed">
                  {TT.ruleBody}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                  {TT.modeLabel}
                </p>
                <div className="relative">
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white/80"
                  >
                    {safeArr(TT.modes).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
                  {TT.domainLabel}
                </p>
                <div className="relative">
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-white/80"
                  >
                    {safeArr(TT.domains).map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white/80"
                onClick={onExample}
              >
                {TT.example}
              </Button>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <section className="caelinus-glass-strong p-6 sm:p-8">
            {/* Conversation */}
            <div className="min-h-[240px] space-y-4">
              {conversation.length === 0 ? (
                <div className="text-white/60 text-sm">
                  <span className="text-purple-200/70">•</span>{" "}
                  {language === "en"
                    ? "Write one real sentence. Let the system open the door."
                    : "Tek bir gerçek cümle yeter. Sistem kapıyı oradan açar."}
                </div>
              ) : (
                safeArr(conversation).map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <Card
                      className={
                        m.role === "user"
                          ? "max-w-[80%] bg-white/5 border-white/10"
                          : "max-w-[80%] bg-purple-500/10 border-purple-200/10"
                      }
                    >
                      <CardContent className="p-4">
                        <p className="text-sm text-white/85 whitespace-pre-line">
                          {String(m.content || "")}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}

              <AnimatePresence>
                {isSending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-white/50 italic"
                  >
                    {TT.sending}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <div className="caelinus-glass p-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={TT.placeholder}
                  className="min-h-[120px] bg-transparent border-none resize-none text-white/90 placeholder:text-white/30"
                  disabled={isSending}
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <label className="inline-flex items-center gap-2 text-xs text-white/50 cursor-pointer hover:text-white/70">
                    <Paperclip className="h-4 w-4" />
                    <span>{language === "en" ? "Attach" : "Ekle"}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>

                  <Button
                    type="submit"
                    className="rounded-2xl px-5 h-12 bg-purple-500/30 hover:bg-purple-500/40 border border-purple-200/20"
                    disabled={isSending || !input.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {TT.send}
                  </Button>
                </div>

                {file && (
                  <div className="mt-2 text-xs text-white/40">
                    {language === "en" ? "File:" : "Dosya:"} {file.name}
                  </div>
                )}
              </div>
            </form>

            {/* Bottom note */}
            <div className="mt-6 flex items-center justify-between text-xs text-white/45">
              <span>{TT.footerLeft}</span>
              <span className="text-purple-200/40">{TT.footerRight}</span>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER (optional simple) */}
      <footer className="py-10 text-center text-xs text-white/30">
        SANRI — symbolic awareness mirror. No diagnosis. No fate. Responsibility is yours.
      </footer>
    </div>
  );
}