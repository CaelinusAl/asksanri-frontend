import React, { useMemo, useState, useEffect, useRef } from "react";
import Hero from "../components/sanri/Hero";
import InputArea from "../components/sanri/InputArea";
import FooterNote from "../components/sanri/FooterNote";

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

export default function SanriyaSorPage() {
  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [reply, setReply] = useState("");
  const [displayedReply, setDisplayedReply] = useState("");

  const hint = useMemo(() => {
    const base =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.";
    const modeLine = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı bir sahne gibi anlat. Detayları abartma—simgeleri ver.",
      divine: "Bugün için mesaj isteme; niyeti sor: “Benim için ne hatırlatıyorsun?”",
      shadow: "Gölgeyi suçlama; ‘Bunu bana ne öğretmek istiyor?’ de.",
      light: "Işığa zorlamadan yaklaş: ‘Şu an beni sakinleştirecek tek adım ne?’",
    }[mode];

    return `${base}\n\nMod: ${MODES.find((m) => m.id === mode)?.label}\n${modeLine}`;
  }, [mode]);

  const canSend = text.trim().length > 0 && !isSending;

  async function send() {
    if (!canSend) return;
    setIsSending(true);
    setReply("");

    try {
      // Backend yoksa bile UI çökmemesi için güvenli davran.
      if (!API_URL) {
        setReply("Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.");
        return;
      }

      // Basit payload (backend’in beklediği şemaya göre ileride uyarlanır)
      const res = await fetch(`${API_URL}/sanri/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
          domain: domain === "auto" ? null : domain,
        }),
      });

      if (!res.ok) {
        setReply(`Bağlantı hatası (${res.status}).`);
        return;
      }

      const data = await res.json();
      const out = data?.response ?? data?.answer ?? data?.message ?? "";
      setReply(out || "Yansıma geldi ama boş görünüyor. Backend cevabını kontrol et.");
    } catch (e) {
      setReply("Şu an bir gürültü var. Bir nefes al. Tekrar dene.");
    } finally {
      setIsSending(false);
    }
  }

  function reset() {
    setText("");
    setReply("");
  }
 useEffect(() => {
  if (!reply) return;

  setDisplayedReply("");
  let i = 0;

  const interval = setInterval(() => {
    setDisplayedReply(prev => prev + reply.charAt(i));
    i++;
    if (i >= reply.length) clearInterval(interval);
  }, 30);

  return () => clearInterval(interval);
}, [reply]);

  return (
    <div className="caelinus-hypno-bg min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10">
        <Hero />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
          {/* LEFT */}
          <aside className="caelinus-glass p-5 lg:sticky lg:top-6 h-fit">
            <div className="text-xs tracking-[0.28em] uppercase text-white/60">
              Mod
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`rounded-full px-3 py-1.5 text-sm border transition ${
                    mode === m.id
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-transparent border-white/10 text-white/70 hover:bg-white/5"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-5 text-xs tracking-[0.28em] uppercase text-white/60">
              Domain (opsiyonel)
            </div>
            <select
              className="mt-2 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-sm text-white/80"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>

            <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
              <div className="text-xs tracking-[0.28em] uppercase text-purple-200/70 mb-2">
                Kılavuz
              </div>
              <pre className="whitespace-pre-wrap text-sm text-white/70 leading-relaxed font-serif">
                {hint}
              </pre>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={reset}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 text-sm"
              >
                Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setText("Bugün kendimi aynı döngüde buluyorum. Kapı nerede?")}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 text-sm"
              >
                Örnek
              </button>
            </div>
          </aside>

          {/* RIGHT */}
          <main className="caelinus-glass-strong p-6 sm:p-8">
            <InputArea
              value={text}
              onChange={setText}
              onSend={send}
              isSending={isSending}
              canSend={canSend}
              reply={reply}
            />
            {/* DEBUG */}
              <div style={{position:'fixed', bottom:10, right:10, opacity:0.4}}>
               build: A-2026-02-10
               </div>
            <FooterNote />
          </main>
        </div>
      </div>
    </div>
  );
}