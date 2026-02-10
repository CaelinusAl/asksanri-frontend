import React, { useEffect, useMemo, useRef } from "react";

export default function InputArea({ value, onChange, onSend, isSending, canSend, reply }) {
  const taRef = useRef(null);

  useEffect(() => {
    // sayfa açılınca yazı alanı hazır dursun
    taRef.current?.focus?.();
  }, []);

  const helper = useMemo(() => {
    return "Tek bir gerçek cümle yeter. Sistem kapıyı oradan açar.\nGönder: Ctrl + Enter";
  }, []);

  const recognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const mic = recognition ? new recognition() : null;

if (mic) {
  mic.lang = "tr-TR";
  mic.continuous = false;
  mic.interimResults = false;

  mic.onresult = (e) => {
    setText(e.results[0][0].transcript);
  };
}
 <button onClick={() => mic && mic.start()}>
  🎙️
</button>

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs tracking-[0.28em] uppercase text-white/50 mb-2">
          Yansıma Akışı
        </div>

        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Bir kelime, soru, rüya veya tarih yaz..."
          className="w-full min-h-[140px] resize-none rounded-xl bg-black/30 border border-white/10 p-4 text-white/85 placeholder:text-white/30 focus:outline-none"
          disabled={isSending}
        />

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-white/45 whitespace-pre-line">
            {helper}
          </div>

          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className={`rounded-xl px-5 py-2 text-sm transition border ${
              canSend
                ? "bg-white/10 hover:bg-white/15 border-white/15 text-white"
                : "bg-white/5 border-white/10 text-white/35 cursor-not-allowed"
            }`}
          >
            {isSending ? "Yansıma..." : "Yansıt"}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5 min-h-[140px]">
        <div className="text-xs tracking-[0.28em] uppercase text-purple-200/70 mb-2">
          Çıktı
        </div>
        {reply ? (
          <div className="text-white/80 leading-relaxed font-serif whitespace-pre-wrap">
            {reply}
          </div>
        ) : (
          <div className="text-white/35">
            Yansıma burada belirecek.
          </div>
        )}
      </div>
    </div>
  );
}
