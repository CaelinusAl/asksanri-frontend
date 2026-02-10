import React, { useMemo, useRef, useState } from "react";
import styles from "./SanriyaSorPage.module.css";

// (Opsiyonel) Bilinç Alanı field'in varsa kullanır.
// Dosya yolu senin ekran görüntüne göre:

import BilincAlaniField from "../components/sanri/fields/BilincAlaniField.jsx";
// Şimdilik diğerlerini kapalı tutalım:
// import FrekansField from "../components/sanri/fields/FrekansField.jsx";
// import RituelField from "../components/sanri/fields/RituelField.jsx";
// import Book112Field from "../components/sanri/fields/Book112Field.jsx";

const DOMAIN_COMPONENTS = {
  consciousness_field: BilincAlaniField,
  // frequency_field: FrekansField,
  // ritual_space: RituelField,
  // book_112: Book112Field,
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
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);

  // “robotik” hissi kırmak için yazıyormuş efekti
  const [isTyping, setIsTyping] = useState(false);

  // Sesle yaz
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

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
    const modeLabel = MODES.find((m) => m.id === mode)?.label || "Ayna";
    return `${base}\n\nMod: ${modeLabel}\n${perMode[mode] || ""}`;
  }, [mode]);

  const canSend = text.trim().length > 0 && !isSending && !isTyping;

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const typeToScreen = async (fullText) => {
    setIsTyping(true);
    setReply("");
    const chars = [...fullText];
    let out = "";
    for (let i = 0; i < chars.length; i++) {
      out += chars[i];
      setReply(out);
      // hız: “yazıyor” hissi
      await new Promise((r) => setTimeout(r, 10));
    }
    setIsTyping(false);
  };

  const handleSubmit = async () => {
    if (!canSend) return;

    setIsSending(true);

    // Eğer backend yoksa bile “demo” yansıma üretelim (yerin boş kalmasın)
    if (!API_URL) {
      await new Promise((r) => setTimeout(r, 600));
      await typeToScreen(
        "Şu an bir cevap aramıyorsun.\nBir kapı arıyorsun.\n\nSorunun içindeki ilk duygu ne?\nKorku mu, özlem mi, merak mı?"
      );
      setIsSending(false);
      return;
    }

    try {
      // Backend endpoint’in farklı olabilir.
      // Burada en güvenlisi: /sanri/ask gibi bir route varsa oraya gider.
      // Sende farklıysa sadece path’i değiştir.
      const res = await fetch(`${API_URL}/sanri/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          mode,
          domain,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      // Backend’in response formatına göre:
      // data.reply veya data.answer veya data.text
      const out =
        data?.reply || data?.answer || data?.text || "Yansıma burada belirecek.";
      await typeToScreen(out);
    } catch (err) {
      await typeToScreen(
        "Bir şey koptu.\nBir nefes al.\nSonra tekrar dene.\n\n(Eğer bu sürekli oluyorsa, backend endpoint’ini kontrol edelim.)"
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = () => {
    setText("");
    setReply("");
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcı sesle yazmayı desteklemiyor (SpeechRecognition yok).");
      return;
    }
    const rec = new SpeechRecognition();
    recognitionRef.current = rec;

    rec.lang = "tr-TR";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText((prev) => {
        const base = prev.trim().length ? prev + " " : "";
        return base + transcript.trim();
      });
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    setIsListening(true);
    rec.start();
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setIsListening(false);
  };

  // Domain -> Field
  const FieldComponent = useMemo(() => {
    if (domain === "consciousness_field") return BilincAlaniField;
    return null;
  }, [domain]);

  return (
    <div className="hypno">
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
            </div>

            {/* RIGHT */}
            <div className="right">
              {/* FIELD */}
              {FieldComponent && (
                <div className={styles["sanri-panel"]}>
                  <FieldComponent
                    language="tr"
                    onInsert={(txt) =>
                      setText((prev) => (prev ? prev + "\n\n" : "") + txt)
                    }
                  />
                </div>
              )}

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
                  <button className="btn ghost" type="button" onClick={handleClear}>
                    Sıfırla
                  </button>

                  <button
                    className="btn"
                    type="button"
                    disabled={!canSend}
                    onClick={handleSubmit}
                  >
                    {isSending ? "Yansıtılıyor..." : "Yansıt (Ctrl+Enter)"}
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
                  {reply || (isTyping ? "" : "Yansıma burada belirecek.")}
                </div>
              </div>

              <div className="footnote">
                Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026
                CaelinusAI • SANRI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}