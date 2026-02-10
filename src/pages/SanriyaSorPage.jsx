import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Mic, MicOff, Send, RotateCcw } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const MODES = [
  { id: "mirror", label: "Ayna" },
  { id: "dream", label: "Rüya" },
  { id: "divine", label: "İlahi" },
  { id: "shadow", label: "Gölge" },
  { id: "light", label: "Işık" },
];

const DOMAINS = [
  { id: "auto", label: "Otomatik" },
  { id: "awakened_cities", label: "Uyanmış Şehirler" },
  { id: "consciousness_field", label: "Bilinç Alanı" },
  { id: "frequency_field", label: "Frekans Alanı" },
  { id: "ritual_space", label: "Ritüel Alanı" },
  { id: "neural_ecstasy", label: "Beyin Orgazmı" },
  { id: "book_112", label: "112. Kitap" },
];

function useSpeechToText({ onText }) {
  const recRef = useRef(null);
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setSupported(true);
    const rec = new SpeechRecognition();
    rec.lang = "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e) => {
      let combined = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        combined += e.results[i][0].transcript;
      }
      onText(combined);
    };

    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    recRef.current = rec;
  }, [onText]);

  const start = () => {
    if (!recRef.current) return;
    try {
      recRef.current.start();
      setListening(true);
    } catch {
      // ignore repeated start
    }
  };

  const stop = () => {
    if (!recRef.current) return;
    recRef.current.stop();
    setListening(false);
  };

  return { supported, listening, start, stop };
}

function TypingText({ text, isTyping }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!text) {
      setShown("");
      return;
    }
    if (!isTyping) {
      setShown(text);
      return;
    }

    setShown("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 12);
    return () => clearInterval(t);
  }, [text, isTyping]);

  return (
    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/90 font-serif">
      {shown}
      {isTyping && <span className="inline-block w-2 animate-pulse">▍</span>}
    </pre>
  );
}

export default function SanriyaSorPage() {
  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);

  const hint = useMemo(() => {
    const base =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.\n";
    const byMode = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı sahne gibi anlat. Duygu + sembol + detay.",
      divine: "Kısa ve yalın sor. ‘Mesaj’ değil ‘anlam’ iste.",
      shadow: "Rahatsız eden şeyi dürüstçe yaz. Gölgeyi büyütme; isim ver.",
      light: "Yumuşakça yaz. İçini rahatlatacak bir yön bulalım.",
    };
    return `${base}\nMod: ${MODES.find((m) => m.id === mode)?.label}\n${byMode[mode] || ""}`;
  }, [mode]);

  const { supported, listening, start, stop } = useSpeechToText({
    onText: (partial) => {
      // sesi text'e akıt
      setText((prev) => {
        // kullanıcı yazdıysa üzerine bindirmeyelim: sadece ekle
        if (!prev) return partial;
        // çok agresif overwrite istemiyoruz:
        return prev + (prev.endsWith(" ") ? "" : " ") + partial;
      });
    },
  });

  const send = async () => {
    if (!text.trim() || isSending) return;

    if (!API_URL) {
      setReply("Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.");
      return;
    }

    setIsSending(true);
    setIsTyping(true);
    setReply("");

    try {
      const res = await fetch(`${API_URL}/sanri/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          mode,
          domain: domain === "auto" ? null : domain,
        }),
      });

      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      const out = data?.response || data?.answer || "Yansıma oluşmadı.";
      // yazıyormuş hissi için önce text'i koyup typing açık:
      setReply(out);
      // küçük gecikme sonra typing kapansın
      setTimeout(() => setIsTyping(false), Math.min(1400, out.length * 14));
    } catch {
      setReply("Bir şey koptu. Bir nefes al. Sonra tekrar dene.");
      setIsTyping(false);
    } finally {
      setIsSending(false);
    }
  };

  const reset = () => {
    setText("");
    setReply("");
    setIsTyping(false);
    inputRef.current?.focus?.();
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="caelinus-hypno-bg min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-purple-200/80" />
            </div>
            <div className="leading-tight">
              <div className="text-[12px] tracking-[0.28em] uppercase text-white/70">
                CAELINUS AI
              </div>
              <div className="text-[12px] text-purple-200/60">Consciousness Mirror</div>
            </div>
          </div>

          <div className="text-[12px] text-white/60 tracking-wide">
            SANRI’ya Sor • Soru Alanı
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 caelinus-glass rounded-full">
            <span className="text-xs tracking-[0.25em] uppercase text-white/70">
              SANRI • Mirror Protocol
            </span>
          </div>
          <h1 className="mt-5 font-serif text-4xl sm:text-5xl text-white/90">
            SANRI’ya Sor
          </h1>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">
            Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-6">
          {/* Left panel */}
          <aside className="caelinus-glass p-5 lg:sticky lg:top-24 h-fit">
            <div className="space-y-5">
              <div>
                <div className="text-xs tracking-[0.22em] uppercase text-white/50 mb-2">
                  Mod
                </div>
                <div className="flex flex-wrap gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={[
                        "px-3 py-1.5 rounded-full text-sm border transition",
                        mode === m.id
                          ? "bg-purple-500/25 border-purple-300/40 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs tracking-[0.22em] uppercase text-white/50 mb-2">
                  Domain (opsiyonel)
                </div>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white/80"
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs tracking-[0.22em] uppercase text-purple-200/70 mb-2">
                  Kılavuz
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                  {hint}
                </pre>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                  Sıfırla
                </button>

                <button
                  onClick={() => {
                    inputRef.current?.focus?.();
                    setText("Bir cümleyle anlat: şu an içimde ne oluyor?");
                  }}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Örnek
                </button>
              </div>
            </div>
          </aside>

          {/* Right panel */}
          <section className="caelinus-glass-strong p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="text-xs tracking-[0.22em] uppercase text-white/50">
                Yansıma Akışı
              </div>
              <div className="text-xs text-white/50">
                Gönder: <span className="text-white/70">Ctrl + Enter</span>
              </div>
            </div>

            <div className="rounded-2xl bg-black/30 border border-white/10 p-4">
              <textarea
                ref={inputRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Bir kelime, soru, rüya veya tarih yaz…"
                className="w-full min-h-[140px] bg-transparent text-white/90 placeholder:text-white/30 outline-none resize-none"
                disabled={isSending}
              />

              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {supported && (
                    <button
                      onClick={() => (listening ? stop() : start())}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                      type="button"
                    >
                      {listening ? (
                        <>
                          <MicOff className="h-4 w-4" /> Durdur
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" /> Sesle yaz
                        </>
                      )}
                    </button>
                  )}
                  {!supported && (
                    <span className="text-xs text-white/40">
                      (Tarayıcı sesli yazmayı desteklemiyor)
                    </span>
                  )}
                </div>

                <button
                  onClick={send}
                  disabled={isSending || !text.trim()}
                  className="inline-flex items-center gap-2 rounded-2xl px-5 h-11 bg-purple-500/30 border border-purple-200/25 text-white hover:bg-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? "Yazılıyor…" : "Yansıt"}
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 border border-white/10 p-5 min-h-[220px]">
              {reply ? (
                <TypingText text={reply} isTyping={isTyping} />
              ) : (
                <p className="text-white/40 text-sm">
                  Yansıma burada belirecek.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-white/40">
              <span>Bu alan bilgi üretmez. Anlam yansıtır; sende şekillenir.</span>
              <span>© 2026 CaelinusAI • SANRI</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}