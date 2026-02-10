import { useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";

export default function InputArea({ value, onChange, onSubmit, isSending }) {
  const taRef = useRef(null);

  // “yazıyormuş” hissi: gönderince 900ms “yazıyor” animasyonu
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    if (!isSending) return;
    setIsTyping(true);
    const t = setTimeout(() => setIsTyping(false), 900);
    return () => clearTimeout(t);
  }, [isSending]);

  // Basit voice-to-text (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const recRef = useRef(null);

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcı sesli yazmayı desteklemiyor (Chrome önerilir).");
      return;
    }
    try {
      const rec = new SpeechRecognition();
      rec.lang = "tr-TR";
      rec.interimResults = true;
      rec.continuous = false;

      rec.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onChange((value ? value + " " : "") + transcript.trim());
      };

      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);

      recRef.current = rec;
      setIsListening(true);
      rec.start();
    } catch {
      setIsListening(false);
    }
  }

  function stopListening() {
    try {
      recRef.current?.stop();
    } catch {}
    setIsListening(false);
  }

  function submit() {
    if (isSending || isTyping) return;
    onSubmit?.();
    // textarea focus kalsın
    setTimeout(() => taRef.current?.focus(), 50);
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  }

  const canSend = value.trim().length > 0 && !isSending && !isTyping;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(120,70,255,0.14)] backdrop-blur-xl">
      <div className="text-xs tracking-[0.28em] uppercase text-white/50 mb-2">
        Yansıma Akışı
      </div>

      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Bir kelime, soru, rüya veya tarih yaz..."
        className="w-full min-h-[150px] resize-none rounded-xl bg-black/30 border border-white/10 p-4 text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
        disabled={isSending}
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm bg-purple-500/25 hover:bg-purple-500/35 border border-purple-300/20 disabled:opacity-40 disabled:hover:bg-purple-500/25"
        >
          <Send className="h-4 w-4" />
          {isSending || isTyping ? "Yazılıyor..." : "Yansıt (Ctrl+Enter)"}
        </button>

        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm border ${
            isListening
              ? "bg-red-500/25 border-red-300/20 hover:bg-red-500/35"
              : "bg-white/10 border-white/10 hover:bg-white/15"
          }`}
        >
          <Mic className="h-4 w-4" />
          {isListening ? "Dinleniyor..." : "Sesle yaz"}
        </button>
      </div>

      <div className="mt-4 text-xs text-white/45">
        Yansıma burada belirecek.
      </div>
    </div>
  );
}
