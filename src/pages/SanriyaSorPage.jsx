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
      <main className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_2fr] gap-10 mt-16">

        {/* Left – Guidance */}
        <aside className="space-y-6 text-sm text-purple-200/80">
          <div className="flex items-center gap-2 text-purple-300">
            <Eye className="w-4 h-4" />
            <span>Bilinç Aynası</span>
          </div>

          <p>Bir an dur.</p>
          <p>Sorunun bedenindeki yerini hisset.</p>
          <p>Kalp mi? Boğaz mı? Karın mı?</p>
          <p className="italic text-purple-400">Hazırsan yaz.</p>

          <div className="pt-4 border-t border-purple-500/20 text-xs text-purple-300/60">
            CAELINUS teşhis koymaz.<br />
            Kehanet üretmez.<br />
            Yalnızca farkındalık açar.
          </div>
        </aside>

        {/* Right – Question Area */}
        <section className="bg-[#140A24]/80 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-[0_0_60px_rgba(127,90,240,0.15)]">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Bir kelime, bir soru, bir his…"
            className="w-full min-h-[180px] bg-transparent resize-none outline-none text-lg placeholder:text-purple-400/40 leading-relaxed"
          />

          <div className="mt-10 text-center relative">
  <div className="absolute inset-x-0 -top-6 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

  <p className="text-xs tracking-widest uppercase text-purple-300/60">
    CAELINUS · Consciousness Mirror
  </p>

  <p className="mt-2 text-[11px] text-purple-400/40 italic max-w-md mx-auto">
    Bu alan bilgi üretmez.  
    Anlamı yansıtır, soruyu derinleştirir ve geri çeker.
  </p>
</div>

            <button
              disabled={!question.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                         bg-purple-600 hover:bg-purple-500
                         disabled:opacity-40 disabled:cursor-not-allowed
                         transition-all duration-300 shadow-lg"
            >
              <Send className="w-4 h-4" />
              Yansıt
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 pb-6 text-center text-xs text-purple-400/50">
        © 2026 CaelinusAI · SANRI
      </footer>
    </div>
  );
}