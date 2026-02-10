import { useState } from "react";
import "../App.css";

export default function SanriyaSorPage() {
  const [text, setText] = useState("");

  return (
    <div className="caelinus-hypno-bg min-h-screen flex flex-col">
      
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-black/40 backdrop-blur border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-3 text-xs tracking-widest text-white/70">
          SANRI · Consciousness Mirror
        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-2xl caelinus-glass-strong p-8">
          
          <h1 className="text-3xl font-serif text-center mb-2">
            Consciousness Mirror
          </h1>

          <p className="text-center text-white/60 mb-6">
            Bu bir cevap değildir.  
            Bir yansımadır.
          </p>

          <p className="text-sm text-white/70 mb-4">
            Bir an dur.  
            Sorunu yazmadan önce bedeninde nerede yankılandığını hisset.  
            Hazırsan yaz.
          </p>

          <textarea
            className="w-full min-h-[120px] bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            placeholder="Bir kelime, bir soru, bir rüya..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="mt-4 w-full rounded-xl bg-purple-600/30 hover:bg-purple-600/50 transition py-3 text-white tracking-wide"
          >
            Yansıt
          </button>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-white/40 py-6">
        © 2026 CaelinusAI · SANRI  
        <div>Bu alan bilgi üretmez. Anlam yansıtır.</div>
      </footer>

    </div>
  );
}