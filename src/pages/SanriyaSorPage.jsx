import React, { useEffect, useMemo, useRef, useState } from "react";

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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function SanriyaSorPage() {
  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");
  const [text, setText] = useState("");
  const [reply, setReply] = useState("Yansıma burada belirecek.");
  const [isSending, setIsSending] = useState(false);

  // “yazıyormuş hissi” için
  const [isTyping, setIsTyping] = useState(false);
  const typingRef = useRef({ stop: false });

  // Microphone
  const [isRecording, setIsRecording] = useState(false);
  const recRef = useRef(null);

  const hint = useMemo(() => {
    const base =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.";
    const perMode = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı sahne gibi anlat. Simgeleri saklama.",
      divine: "Bir niyet yaz. Sonra tek soru sor.",
      shadow: "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
      light: "Şu anki duygunu yaz. Yargısız.",
    };
    return `${base}\n\nMod: ${MODES.find((m) => m.id === mode)?.label}\n${perMode[mode]}`;
  }, [mode]);

  const canSend = text.trim().length > 0 && !isSending && !isTyping;

  async function typeToScreen(full) {
    typingRef.current.stop = false;
    setIsTyping(true);
    setReply("");
    // küçük bilinçli gecikme: robotik hissi kırar
    await sleep(300);

    const chars = String(full ?? "");
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      if (typingRef.current.stop) break;
      out += chars[i];
      setReply(out);
      await sleep(12); // hız
    }
    setIsTyping(false);
  }

  async function handleSend() {
    if (!canSend) return;

    if (!API_URL) {
      await typeToScreen("Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.");
      return;
    }

    setIsSending(true);

    try {
      // küçük bekleme (yazıyor hissi)
      await sleep(350);

      const res = await fetch(`${API_URL}/sanri/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          mode,
          domain,
        }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      const answer = data?.response || data?.reply || "Yansıma şu an sessiz. Tekrar dene.";
      await typeToScreen(answer);
    } catch (e) {
      await typeToScreen("Bir şey koptu. Bir nefes al. Sonra tekrar dene.");
    } finally {
      setIsSending(false);
    }
  }

  function handleClear() {
    typingRef.current.stop = true;
    setIsTyping(false);
    setText("");
    setReply("Yansıma burada belirecek.");
  }

  // Ctrl+Enter
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSend, mode, domain, text]);

  // Speech Recognition (Chrome)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function startVoice() {
    if (!SpeechRecognition) {
      setReply("Tarayıcı sesli yazmayı desteklemiyor (Chrome önerilir).");
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = "tr-TR";
      rec.interimResults = true;
      rec.continuous = true;

      rec.onresult = (event) => {
        let finalText = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += t + " ";
          else interim += t;
        }
        setText((prev) => (prev + finalText).trim() + (interim ? " " + interim : ""));
      };

      rec.onerror = () => {
        setIsRecording(false);
      };
      rec.onend = () => {
        setIsRecording(false);
      };

      recRef.current = rec;
      setIsRecording(true);
      rec.start();
    } catch {
      setIsRecording(false);
    }
  }

  function stopVoice() {
    try {
      recRef.current?.stop();
    } catch {}
    setIsRecording(false);
  }

  return (
    <div className="hypno">
      <div className="topbar">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="row">
            <span className="tag">CAELINUS AI</span>
            <span className="small">Consciousness Mirror</span>
          </div>
          <div className="small">SANRI • Soru Alanı</div>
        </div>
      </div>

      <div className="shell">
        <div className="card" style={{ padding: 22 }}>
          <div className="small">CAELINUS AI • Consciousness Mirror</div>
          <div className="sp" />
          <div className="h1">SANRI’ya Sor</div>
          <div className="small" style={{ fontSize: 14 }}>
            Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.
          </div>

          <div className="sp" />

          <div className="row">
            <div style={{ flex: "1 1 220px" }}>
              <div className="small">Mod</div>
              <select className="sel" value={mode} onChange={(e) => setMode(e.target.value)}>
                {MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: "1 1 220px" }}>
              <div className="small">Domain (opsiyonel)</div>
              <select className="sel" value={domain} onChange={(e) => setDomain(e.target.value)}>
                {DOMAINS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="sp" />

          <div className="small" style={{ whiteSpace: "pre-line", lineHeight: 1.55 }}>
            {hint}
          </div>

          <div className="sp" />

          <textarea
            className="txt"
            placeholder="Bir kelime, soru, rüya veya tarih yaz..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending || isTyping}
          />

          <div className="sp" />

          <div className="row">
            <button className="btn2" onClick={handleClear} disabled={isSending || isTyping}>
              Sıfırla
            </button>

            <button className="btn" onClick={handleSend} disabled={!canSend}>
              {isSending ? "Bağlanıyor..." : isTyping ? "Yazıyor..." : "Yansıt (Ctrl+Enter)"}
            </button>

            <div style={{ flex: 1 }} />

            {!isRecording ? (
              <button className="btn2" onClick={startVoice}>
                🎙️ Sesle yaz
              </button>
            ) : (
              <button className="btn" onClick={stopVoice}>
                ⏹️ Durdur
              </button>
            )}
          </div>

          <div className="out">{reply}</div>

          <div className="sp" />
          <div className="small">
            Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI
          </div>
        </div>
      </div>
    </div>
  );
}