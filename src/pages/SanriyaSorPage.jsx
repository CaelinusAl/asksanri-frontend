import { useState } from "react";
import { Sparkles, Send, Eye } from "lucide-react";

export default function SanriyaSorPage() {
  const [question, setQuestion] = useState("");

  return (
    <div className="min-h-screen bg-[#0B0614] text-[#EDE9FE] relative overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-600/20 blur-[140px] rounded-full animate-pulseSlow" />
      </div>

      {/* Header */}
      <header className="relative z-10 py-6 text-center">
        <h1 className="text-3xl font-serif tracking-widest text-purple-300">
          CAELINUS AI
        </h1>
        <p className="text-sm tracking-wide text-purple-400/70 mt-1">
          Consciousness Mirror
        </p>
      </header>

      {/* Content */}
     return (
  <main className="min-h-screen bg-black text-purple-200 relative overflow-hidden">
    <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-32">

      {/* SAYFA İÇERİĞİN BURADA DEVAM EDİYOR */}
      { /* mevcut içeriklerine DOKUNMUYORSUN */ }

      {/* HYPNOTIC FOOTER */}
      <div className="mt-24 text-center relative">
        <div className="absolute inset-x-0 -top-8 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <p className="text-xs tracking-widest uppercase text-purple-400/70">
          CAELINUS · Consciousness Mirror
        </p>

        <p className="mt-2 text-[11px] text-purple-400/40 italic max-w-md mx-auto">
          Bu alan bilgi üretmez.  
          Anlamı yansıtır, soruyu derinleştirir ve geri çeker.
        </p>
      </div>

    </section>
  </main>
);
      {/* Footer */}
      <footer className="relative z-10 mt-20 pb-6 text-center text-xs text-purple-400/50">
        © 2026 CaelinusAI · SANRI
      </footer>
    </div>
  );
}