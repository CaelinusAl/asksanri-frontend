import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

const LS_KEY = "sanri_profile_v1";

export default function CoachOnboardingPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // YYYY-MM-DD
  const [birthTime, setBirthTime] = useState(""); // HH:MM (optional)
  const [birthCity, setBirthCity] = useState("");
  const [intention, setIntention] = useState("");

  const canSave = useMemo(() => {
    return name.trim().length >= 2 && birthDate.trim().length === 10;
  }, [name, birthDate]);

  const save = () => {
    unlockAudio();
    const profile = {
      name: name.trim(),
      birthDate,
      birthTime: birthTime.trim() || null,
      birthCity: birthCity.trim() || null,
      intention: intention.trim() || null,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(profile));
    navigate("/koc", { state: { skipIntro: true } });
  };

  return (
    <div style={{ minHeight: "100vh", padding: 18, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>
        {isTR ? "Sanrı Yaşam Koçu — Başlangıç" : "SANRI Life Coach — Start"}
      </h1>
      <p style={{ opacity: 0.75, marginTop: 6 }}>
        {isTR
          ? "Doğum bilgilerini gir. Sanrı seni her gün daha net bir aynaya taşıyacak."
          : "Enter your birth details. SANRI will mirror you with growing clarity."}
      </p>

      <div style={{ marginTop: 16, display: "grid", gap: 10, maxWidth: 520 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isTR ? "Ad / Rumuz" : "Name / Nickname"}
          style={inp}
        />

        <label style={lbl}>{isTR ? "Doğum Tarihi (zorunlu)" : "Birth Date (required)"}</label>
        <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" style={inp} />

        <label style={lbl}>{isTR ? "Doğum Saati (opsiyonel)" : "Birth Time (optional)"}</label>
        <input value={birthTime} onChange={(e) => setBirthTime(e.target.value)} type="time" style={inp} />

        <input
          value={birthCity}
          onChange={(e) => setBirthCity(e.target.value)}
          placeholder={isTR ? "Doğum Yeri / Şehir (opsiyonel)" : "Birth City (optional)"}
          style={inp}
        />

        <textarea
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder={isTR ? "Niyet (1 cümle — opsiyonel)" : "Intention (one sentence — optional)"}
          style={{ ...inp, minHeight: 90, resize: "vertical" }}
        />

        <button disabled={!canSave} onClick={save} style={{ ...btn, opacity: canSave ? 1 : 0.5 }}>
          {isTR ? "Kaydet ve Alanı Aç" : "Save & Enter"}
        </button>

        <button onClick={() => navigate("/", { state: { skipIntro: true } })} style={btnGhost}>
          {isTR ? "← Kapılara Dön" : "← Back to Gates"}
        </button>
      </div>
    </div>
  );
}

const inp = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  outline: "none",
};
const lbl = { opacity: 0.75, fontSize: 12, marginTop: 4 };
const btn = {
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