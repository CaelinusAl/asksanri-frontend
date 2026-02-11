import { useEffect, useMemo, useRef, useState } from "react";
import "./SanriyaSorPage.css";
import BilincAlaniField from "../components/sanri/fields/BilincAlaniField";
// Opsiyonel field (Bilinç Alanı) - dosya yoksa patlamasın diye dinamik

const DOMAIN_COMPONENTS = {
  consciousness_field: BilincAlaniField,
};

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

  // “robotik hızlı cevap” yerine yazıyormuş hissi
  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");
  const typingRef = useRef(null);

  // Sesle yaz (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

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
    const m = MODES.find((x) => x.id === mode)?.label || "Ayna";
    return `${base}\n\nMod: ${m}\n${perMode[mode] || perMode.mirror}`;
  }, [mode]);

  // Domain -> FieldComponent
  const FieldComponent = useMemo(() => {
    if (domain === "consciousness_field" && BilincAlaniField) return BilincAlaniField;
    return null;
  }, [domain]);

  // Yazma animasyonu
  const typeToScreen = (full) => {
    if (typingRef.current) clearInterval(typingRef.current);
    setReplyFull(full);
    setReplyShown("");

    let i = 0;
    typingRef.current = setInterval(() => {
      i += 1;
      setReplyShown(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typingRef.current);
        typingRef.current = null;
      }
    }, 12); // hız
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      try {
        recognitionRef.current?.stop?.();
      } catch {}
    };
  }, []);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const q = text.trim();
    if (!q) return;

    if (!API_URL) {
      typeToScreen("Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.");
      return;
    }

    setIsSending(true);
    setReplyFull("");
    setReplyShown("");

    // küçük “bekleme” hissi
    const thinking = "Yansıtılıyor…";
    typeToScreen(thinking);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // backend farklı bekliyorsa bunu sonra birlikte ayarlarız
        body: JSON.stringify({ text: q, mode, domain }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${t}`.trim());
      }

      const data = await res.json().catch(() => ({}));
      const out =
        data?.answer ||
        data?.response ||
        data?.text ||
        "Yansıma burada belirecek.";

      typeToScreen(out);
    } catch (err) {
      typeToScreen("Bir şey koptu. Bir nefes al. Sonra tekrar dene.");
      // console için:
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
  };

  const ensureRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  };

  const startListening = () => {
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) {
      typeToScreen("Tarayıcı ses tanımayı desteklemiyor (SpeechRecognition yok).");
      return;
    }

    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interim += transcript;
      }
      if (finalText) setText((prev) => (prev ? prev + " " : "") + finalText.trim());
      // istersen interim’i de gösterebiliriz; şimdilik final yeterli
    };

    rec.onerror = () => {
      setIsListening(false);
    };
    rec.onend = () => {
      setIsListening(false);
    };

    try {
      rec.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {}
    setIsListening(false);
  };

  return (
    <div className="sanri-page">
      <div className="sanri-container">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="row between">
            <div className="row">
              <span className="tag">CAELINUS AI</span>
              <span className="small">Consciousness Mirror</span>
            </div>
            <div className="small">SANRI • Soru Alanı</div>
          </div>
        </div>

        {/* MAIN */}
        <div className="shell">
          <div className="card">
            <div className="small">CAELINUS AI • Consciousness Mirror</div>
            <div className="sp" />
            <div className="h1">SANRI’ya Sor</div>
            <div className="small subtitle">
              Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.
            </div>

            <div className="grid">
              {/* LEFT */}
              <div className="left">
                <div className="block">
                  <div className="label">Mod</div>
                  <select
                    className="select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="block">
                  <div className="label">Domain (opsiyonel)</div>
                  <select
                    className="select"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rule">
                  <div className="label">Kılavuz</div>
                  <pre className="hint">{hint}</pre>
                </div>

                {/* Opsiyonel Bilinç Alanı Field */}
                {FieldComponent ? (
                  <div className="panel">
                    <div className="label">Bilinç Alanı</div>
                    <FieldComponent
                      language="tr"
                      onInsert={(txt) =>
                        setText((prev) => (prev ? prev + "\n\n" : "") + String(txt || ""))
                      }
                    />
                  </div>
                ) : null}
              </div>

              {/* RIGHT */}
              <div className="right">
                <div className="panel">
                  <div className="label">Yansıma Akışı</div>
                  <textarea
                    className="textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Bir kelime, soru, rüya veya tarih yaz..."
                    disabled={isSending}
                  />

                  <div className="actions">
                    <button className="btn ghost" type="button" onClick={handleReset}>
                      Sıfırla
                    </button>

                    <button
                      className="btn primary"
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSending || !text.trim()}
                      title="Ctrl+Enter"
                    >
                      {isSending ? "Yansıtılıyor…" : "Yansıt (Ctrl+Enter)"}
                    </button>

                    <div className="grow" />

                    <button
                      className={`btn mic ${isListening ? "live" : ""}`}
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? "Durdur" : "Sesle yaz"}
                    </button>
                  </div>
                </div>

                <div className="panel reply">
                  <div className="label">Yansıma</div>
                  <div className="replybox">
                    {replyShown || (!replyFull && !isSending ? "Yansıma burada belirecek." : "")}
                  </div>
                </div>

                <div className="footnote">
                  Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026 CaelinusAI • SANRI
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}