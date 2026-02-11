// src/pages/SanriyaSorPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "./SanriyaSorPage.css";

import BilincAlaniField from "../components/sanri/fields/BilincAlaniField.jsx";
// İstersen sonra açarsın:
// import FrekansField from "../components/sanri/fields/FrekansField.jsx";
// import RituelField from "../components/sanri/fields/RituelField.jsx";
// import Book112Field from "../components/sanri/fields/Book112Field.jsx";

const API_URL = import.meta.env.VITE_BACKEND_URL || "";

const MODES = [
  { id: "mirror", label: { tr: "Ayna", en: "Mirror" } },
  { id: "dream", label: { tr: "Rüya", en: "Dream" } },
  { id: "divine", label: { tr: "İlahi", en: "Divine" } },
  { id: "shadow", label: { tr: "Gölge", en: "Shadow" } },
  { id: "light", label: { tr: "Işık", en: "Light" } },
];

const DOMAINS = [
  { id: "auto", label: { tr: "Otomatik", en: "Auto" } },
  { id: "awakened_cities", label: { tr: "Uyanmış Şehirler", en: "Awakened Cities" } },
  { id: "consciousness_field", label: { tr: "Bilinç Alanı", en: "Consciousness Field" } },
  { id: "frequency_field", label: { tr: "Frekans Alanı", en: "Frequency Field" } },
  { id: "ritual_space", label: { tr: "Ritüel Alanı", en: "Ritual Space" } },
  { id: "neural_ecstasy", label: { tr: "Beyin Orgazmı", en: "Neural Ecstasy" } },
  { id: "book_112", label: { tr: "112. Kitap", en: "Book 112" } },
];

const DOMAIN_COMPONENTS = {
  // “auto” seçiliyken gösterme; sadece seçiliyse göster
  consciousness_field: BilincAlaniField,
  // frequency_field: FrekansField,
  // ritual_space: RituelField,
  // book_112: Book112Field,
};

const I18N = {
  tr: {
    topLeft: "CAELINUS AI",
    topMid: "Consciousness Mirror",
    topRight: "SANRI • Soru Alanı",
    title: "SANRI’ya Sor",
    subtitle: "Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.",
    mode: "Mod",
    domain: "Domain (opsiyonel)",
    guide: "Kılavuz",
    flow: "Yansıma Akışı",
    reply: "Yansıma",
    placeholder: "Bir kelime, soru, rüya veya tarih yaz…",
    reset: "Sıfırla",
    reflect: "Yansıt (Ctrl+Enter)",
    reflecting: "Yansıtılıyor…",
    voice: "Sesle yaz",
    stop: "Durdur",
    replyEmpty: "Yansıma burada belirecek.",
    footer: "Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir.",
    noBackend: "Backend URL yok. VITE_BACKEND_URL tanımla ve yeniden dene.",
    micUnsupported: "Tarayıcı ses tanımayı desteklemiyor (SpeechRecognition yok).",
    fieldTitle: "Bilinç Alanı",
  },
  en: {
    topLeft: "CAELINUS AI",
    topMid: "Consciousness Mirror",
    topRight: "SANRI • Ask Space",
    title: "Ask SANRI",
    subtitle: "This is not an answer. It is a reflection. You open the door.",
    mode: "Mode",
    domain: "Domain (optional)",
    guide: "Guide",
    flow: "Reflection Flow",
    reply: "Reflection",
    placeholder: "Write a word, question, dream, or date…",
    reset: "Reset",
    reflect: "Reflect (Ctrl+Enter)",
    reflecting: "Reflecting…",
    voice: "Voice",
    stop: "Stop",
    replyEmpty: "Reflection will appear here.",
    footer: "This space does not produce “truth”. It reflects meaning — shaped by you.",
    noBackend: "Missing backend URL. Set VITE_BACKEND_URL and try again.",
    micUnsupported: "SpeechRecognition is not available in this browser.",
    fieldTitle: "Consciousness Field",
  },
};

function safeLang(value) {
  return value === "en" ? "en" : "tr";
}

// küçük “typewriter” — robotik hissi kırar
function useTypewriter() {
  const timerRef = useRef(null);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = (fullText, onTick, speed = 14) => {
    stop();
    const text = String(fullText ?? "");
    let i = 0;
    timerRef.current = setInterval(() => {
      i += 1;
      onTick(text.slice(0, i));
      if (i >= text.length) stop();
    }, speed);
  };

  useEffect(() => stop, []);
  return { start, stop };
}

export default function SanriyaSorPage() {
  // Dil: şimdilik localStorage varsa onu al; yoksa TR.
  // (İstersen sonra LanguageContext’e bağlarız, bu sürüm kırılmasın diye bağımsız.)
  const [lang, setLang] = useState(() => safeLang(localStorage.getItem("caelinus-lang") || "tr"));
  const L = I18N[lang];

  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState("auto");

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const { start: startTyping, stop: stopTyping } = useTypewriter();

  const modeLabel = useMemo(() => {
    const m = MODES.find((x) => x.id === mode);
    return m ? m.label[lang] : mode;
  }, [mode, lang]);

  const hint = useMemo(() => {
    const baseTR =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.";
    const baseEN =
      "Pause. Before writing, feel where it echoes in your body.\nSANRI does not ‘answer’; it opens the door.";

    const perTR = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı sahne gibi anlat. Simgeleri saklama.",
      divine: "Bir niyet yaz. Sonra tek soru sor.",
      shadow: "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
      light: "Şu anki duygunu yaz. Yargısız.",
    };
    const perEN = {
      mirror: "Write one clear sentence. Not an answer — a reflection.",
      dream: "Describe the dream like a scene. Don’t hide symbols.",
      divine: "Write an intention. Then ask one question.",
      shadow: "Name what you avoid. Don’t dramatize. Don’t escape.",
      light: "Write your current feeling — without judgment.",
    };

    const base = lang === "en" ? baseEN : baseTR;
    const per = lang === "en" ? perEN : perTR;

    return `${base}\n\n${lang === "en" ? "Mode" : "Mod"}: ${modeLabel}\n${per[mode] || ""}`;
  }, [lang, mode, modeLabel]);

  const FieldComponent = useMemo(() => {
    // domain auto -> field yok
    if (domain === "auto") return null;
    return DOMAIN_COMPONENTS[domain] || null;
  }, [domain]);

  const ensureRecognition = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = lang === "en" ? "en-US" : "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;
    return rec;
  };

  const startListening = () => {
    if (isListening) return;
    const rec = ensureRecognition();
    if (!rec) {
      // ufak uyarı
      setReplyFull(L.micUnsupported);
      setReplyShown(L.micUnsupported);
      return;
    }

    recognitionRef.current = rec;

    rec.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
      }
      if (finalText) {
        setText((prev) => (prev ? prev + " " : "") + finalText.trim());
      }
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

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

  const handleReset = () => {
    stopTyping();
    setText("");
    setReplyFull("");
    setReplyShown("");
  };

  const handleKeyDown = (e) => {
    const isCmd = e.ctrlKey || e.metaKey;
    if (isCmd && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const buildPayload = () => ({
    text,
    mode,
    domain,
    lang,
    client: "asksanri-frontend",
  });

  const doRequest = async () => {
    if (!API_URL) throw new Error("NO_BACKEND");
    // Senin backend route’un farklı olabilir:
    // Burayı gerekirse /ask veya /api/ask gibi değiştiririz.
    const url = `${API_URL.replace(/\/$/, "")}/ask`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(buildPayload()),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP_${res.status}:${t}`);
    }
    return res.json();
  };

  const handleSubmit = async () => {
    if (isSending) return;
    if (!text.trim()) return;

    stopTyping();
    setIsSending(true);
    setReplyFull("");
    setReplyShown("");

    try {
      // “yazıyormuş” hissi: önce kısa bir bekleme
      await new Promise((r) => setTimeout(r, 420));

      let out;
      try {
        const data = await doRequest();
        // backend { reply } döndürsün diye varsayıyorum
        out = data?.reply ?? data?.message ?? JSON.stringify(data);
      } catch (e) {
        if (String(e?.message || "").includes("NO_BACKEND")) {
          out = L.noBackend;
        } else {
          out = `${L.error || "Hata"}: ${String(e?.message || e)}`;
        }
      }

      setReplyFull(out);
      startTyping(out, setReplyShown, 12);
    } finally {
      setIsSending(false);
    }
  };

  // lang seçimi (mini) — istersen kaldırırız
  const toggleLang = () => {
    const next = lang === "tr" ? "en" : "tr";
    setLang(next);
    localStorage.setItem("caelinus-lang", next);
  };

  return (
    <div className="sanri-page">
      <div className="sanri-container">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="row between">
            <div className="row">
              <span className="tag">{L.topLeft}</span>
              <span className="small">{L.topMid}</span>
            </div>

            <div className="row" style={{ gap: 10, alignItems: "center" }}>
              <button className="langbtn" type="button" onClick={toggleLang} title="TR / EN">
                {lang.toUpperCase()}
              </button>
              <div className="small">{L.topRight}</div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="shell">
          <div className="card">
            <div className="small">{L.topLeft} • {L.topMid}</div>
            <div className="sp" />
            <div className="h1">{L.title}</div>
            <div className="small subtitle">{L.subtitle}</div>

            <div className="grid">
              {/* LEFT */}
              <div className="left">
                <div className="block">
                  <div className="label">{L.mode}</div>
                  <select className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
                    {MODES.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="block">
                  <div className="label">{L.domain}</div>
                  <select className="select" value={domain} onChange={(e) => setDomain(e.target.value)}>
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rule">
                  <div className="label">{L.guide}</div>
                  <pre className="hint">{hint}</pre>
                </div>

                {/* Opsiyonel Field */}
                {FieldComponent ? (
                  <div className="panel">
                    <div className="label">{L.fieldTitle}</div>
                    <FieldComponent
                      language={lang}
                      onInsert={(txt) => setText((prev) => (prev ? prev + "\n\n" : "") + String(txt || ""))}
                    />
                  </div>
                ) : null}
              </div>

              {/* RIGHT */}
              <div className="right">
                <div className="panel">
                  <div className="label">{L.flow}</div>
                  <textarea
                    className="textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={L.placeholder}
                    disabled={isSending}
                  />

                  <div className="actions">
                    <button className="btn ghost" type="button" onClick={handleReset}>
                      {L.reset}
                    </button>

                    <button
                      className="btn primary"
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSending || !text.trim()}
                      title="Ctrl+Enter"
                    >
                      {isSending ? L.reflecting : L.reflect}
                    </button>

                    <div className="grow" />

                    <button
                      className={`btn mic ${isListening ? "live" : ""}`}
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? L.stop : L.voice}
                    </button>
                  </div>
                </div>

                <div className="panel reply">
                  <div className="label">{L.reply}</div>
                  <div className="replybox">
                    {replyShown || (!replyFull && !isSending ? L.replyEmpty : "")}
                  </div>
                </div>

                <div className="footnote">
                  {L.footer} © 2026 CaelinusAI • SANRI
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}