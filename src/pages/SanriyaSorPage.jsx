import { useEffect, useMemo, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "";

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

function useTypewriter(text, speed = 14) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!text) {
      setOut("");
      return;
    }
    let i = 0;
    setOut("");
    const t = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

export default function SanriyaSorPage() {
  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  // voice
  const [isRecording, setIsRecording] = useState(false);
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  const hint = useMemo(() => {
    const base =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.";
    const modeLine = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı bir sahne gibi anlat. Detay ver, hisleri ekle.",
      divine: "Dua gibi sor. Niyetini netleştir.",
      shadow: "Gölgeyi adlandır. Kaçtığın şeyi dürüstçe söyle.",
      light: "Işığı çağır. Kendine şefkatle sor.",
    }[mode];

    return `${base}\n\nMod: ${MODES.find((m) => m.id === mode)?.label}\n${modeLine}`;
  }, [mode]);

  const typedReply = useTypewriter(reply, 10);

  const canSend = text.trim().length > 0 && !isSending;

  const handleSend = async () => {
    if (!canSend) return;

    if (!API_URL) {
      setReply("Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.");
      return;
    }

    setIsSending(true);
    setReply(""); // reply area boşalsın

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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      // backend farklı key döndürüyorsa ikisini de dene
      const answer = data?.response || data?.answer || "";
      setReply(String(answer || "Yansıma boş döndü."));
    } catch (e) {
      setReply("Bir şey koptu. Bir nefes al. Sonra tekrar dene.");
    } finally {
      setIsSending(false);
    }
  };

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // mic record → sadece metne çevirme yok (tarayıcı SpeechRecognition eklersek olur)
  const toggleMic = async () => {
    try {
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream);
        chunksRef.current = [];
        mr.ondataavailable = (ev) => chunksRef.current.push(ev.data);
        mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          // şimdilik: kayıt tamamlandı mesajı
          setText((prev) => (prev ? prev : "🎙️ Ses kaydı alındı (yakında yazıya çevrilecek)."));
        };
        mr.start();
        recRef.current = mr;
        setIsRecording(true);
      } else {
        recRef.current?.stop();
        setIsRecording(false);
      }
    } catch (e) {
      setText((prev) => (prev ? prev : "Mikrofon izni verilmedi."));
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nebula background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(99,102,241,0.18),transparent_50%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,1),rgba(0,0,0,1))]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:22px_22px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl border border-white/10 bg-white/5 grid place-items-center">
              <span className="text-lg">◉</span>
            </div>
            <div className="leading-tight">
              <div className="text-[11px] tracking-[0.28em] uppercase text-white/70">CAELINUS AI</div>
              <div className="text-xs text-purple-200/70">Consciousness Mirror</div>
            </div>
          </div>

          <div className="text-xs text-white/60">Ask SANRI • Soru Alanı</div>
        </div>
      </header>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">SANRI’ya Sor</h1>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* Left panel */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="text-[11px] tracking-[0.28em] uppercase text-white/60">Mod</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={[
                    "px-3 py-1.5 rounded-full border text-sm transition",
                    m.id === mode
                      ? "bg-purple-500/20 border-purple-300/30 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20",
                  ].join(" ")}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-5 text-[11px] tracking-[0.28em] uppercase text-white/60">
              Domain <span className="text-white/30">(opsiyonel)</span>
            </div>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] tracking-[0.28em] uppercase text-purple-200/70 mb-2">
                Kılavuz
              </div>
              <pre className="text-sm text-white/80 whitespace-pre-line leading-relaxed">{hint}</pre>
            </div>
          </aside>

          {/* Right panel */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-white/60">
                Gönder: <span className="text-white/80">Ctrl + Enter</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setText("")}
                  className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 hover:text-white hover:border-white/20 transition"
                >
                  Sıfırla
                </button>
                <button
                  onClick={toggleMic}
                  className={[
                    "px-3 py-2 rounded-xl border text-sm transition",
                    isRecording
                      ? "bg-purple-500/25 border-purple-300/30 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20",
                  ].join(" ")}
                >
                  {isRecording ? "Durdur" : "Sesle yaz"}
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Bir kelime, soru, rüya… veya tarih yaz…"
              className="mt-4 w-full min-h-[140px] rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400/30"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs text-white/50">
                Tek bir gerçek cümle yeter. Sistem kapıyı oradan açar.
              </div>

              <button
                onClick={handleSend}
                disabled={!canSend}
                className={[
                  "px-5 py-2.5 rounded-2xl font-medium transition",
                  canSend
                    ? "bg-purple-500/25 hover:bg-purple-500/35 border border-purple-300/30 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_90px_rgba(168,85,247,0.18)]"
                    : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
                ].join(" ")}
              >
                {isSending ? "Yansıma…" : "Yansıt"}
              </button>
            </div>

            {/* Reply */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 min-h-[160px]">
              <div className="text-[11px] tracking-[0.28em] uppercase text-purple-200/70 mb-3">
                Çıktı
              </div>
              <div className="text-white/85 leading-relaxed whitespace-pre-wrap">
                {typedReply || (isSending ? "Yansıma oluşturuluyor…" : "Yansıma burada belirecek.")}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-white/45">
              <span>Bu alan bilgi üretmez. Anlam yansıtır.</span>
              <span className="text-purple-200/45">© 2026 CaelinusAI • SANRI</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}