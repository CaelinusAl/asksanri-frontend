import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import StarTrail from "../components/StarTrail";
import { unlockAudio } from "../utils/sfx";

const LS_PROFILE = "sanri_profile_v1";
const LS_JOURNAL = "sanri_journal_v1";
const LS_DAILY = "sanri_daily_words_v1";

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function CoachPanelPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const profile = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LS_PROFILE) || "null"); } catch { return null; }
  }, []);

  // Eğer profil yoksa onboarding
  if (!profile?.birthDate) {
    navigate("/koc/onboarding", { replace: true });
    return null;
  }

  const [journal, setJournal] = useState(() => localStorage.getItem(LS_JOURNAL) || "");
  const [book, setBook] = useState(() => "");
  const [daily, setDaily] = useState(() => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_DAILY) || "{}");
      return all[todayKey()] || "";
    } catch {
      return "";
    }
  });

  const generateDaily = () => {
    unlockAudio();
    const line = isTR
      ? `Bugün: ${profile.name}. Soru değil; yön seç. Küçük bir “evet” büyük bir kapıdır.`
      : `Today: ${profile.name}. Not an answer—choose a direction. A small “yes” opens a larger gate.`;

    setDaily(line);

    const all = JSON.parse(localStorage.getItem(LS_DAILY) || "{}");
    all[todayKey()] = line;
    localStorage.setItem(LS_DAILY, JSON.stringify(all));
  };

  const saveJournal = () => {
    localStorage.setItem(LS_JOURNAL, journal);
    alert(isTR ? "Kaydedildi." : "Saved.");
  };

  const addToBook = () => {
    const stamp = `${todayKey()} — ${profile.name}\n`;
    setBook((prev) => (prev ? prev + "\n\n" : "") + stamp + journal.trim());
  };

  return (
    <div style={{ minHeight: "100vh", padding: 18, color: "#fff" }} onPointerDown={unlockAudio}>
      <StarTrail />

      <div style={topbar}>
        <div>
          <div style={{ fontWeight: 900, letterSpacing: ".12em", fontSize: 12 }}>SANRI YAŞAM KOÇU</div>
          <div style={{ opacity: 0.75, marginTop: 4 }}>
            {isTR ? `Hoş geldin, ${profile.name}` : `Welcome, ${profile.name}`}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={btnGhost} onClick={() => navigate("/", { state: { skipIntro: true } })}>
            {isTR ? "← Kapılar" : "← Gates"}
          </button>
          <button style={btnGhost} onClick={() => navigate("/koc/onboarding")}>
            {isTR ? "Profil" : "Profile"}
          </button>
        </div>
      </div>

      <div style={grid}>
        <div style={card}>
          <div style={cardTitle}>{isTR ? "Bugünün Sözü" : "Daily Line"}</div>
          <div style={{ opacity: 0.85, lineHeight: 1.6, whiteSpace: "pre-wrap", minHeight: 80 }}>
            {daily || (isTR ? "Henüz üretilmedi." : "Not generated yet.")}
          </div>

          <button style={btn} onClick={generateDaily}>
            {isTR ? "Bugünün Sözünü Üret" : "Generate Daily"}
          </button>
        </div>

        <div style={card}>
          <div style={cardTitle}>{isTR ? "Günlük" : "Journal"}</div>
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder={isTR ? "Bugün kendine ne söylemek istersin?" : "What do you want to tell yourself today?"}
            style={{ ...inp, minHeight: 220, resize: "vertical" }}
          />

          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button style={btnGhost} onClick={saveJournal}>{isTR ? "Kaydet" : "Save"}</button>
            <button style={btn} onClick={addToBook}>{isTR ? "Kitaba Ekle" : "Add to Book"}</button>
          </div>
        </div>

        <div style={card}>
          <div style={cardTitle}>{isTR ? "Kitap Taslağı" : "Book Draft"}</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 8 }}>
            {isTR ? "Bu alan büyüdükçe e-kitaba dönüşecek." : "This will evolve into an e-book."}
          </div>
          <textarea
            value={book}
            onChange={(e) => setBook(e.target.value)}
            placeholder={isTR ? "Burada birikmeye başlar…" : "Your draft builds here…"}
            style={{ ...inp, minHeight: 220, resize: "vertical" }}
          />
        </div>
      </div>
    </div>
  );
}

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 16px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.12)",
  background:
    "radial-gradient(900px 120px at 20% 0%, rgba(180,120,255,0.22), transparent 70%), radial-gradient(900px 120px at 80% 0%, rgba(90,160,255,0.14), transparent 70%), rgba(10,12,18,0.55)",
  backdropFilter: "blur(14px)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 14,
  maxWidth: 1100,
  margin: "18px auto 0",
};

const card = {
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(14px)",
  padding: 16,
};

const cardTitle = { fontWeight: 900, letterSpacing: ".06em", marginBottom: 10 };

const inp = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  outline: "none",
  width: "100%",
};

const btn = {
  marginTop: 10,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "linear-gradient(90deg, rgba(180,140,255,0.9), rgba(90,160,255,0.7))",
  color: "#0b0b12",
  fontWeight: 900,
  cursor: "pointer",
};

const btnGhost = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 800,
  cursor: "pointer",
};