// src/pages/CoachOnboardingPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoachOnboardingPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

const LS_KEY = "sanri_coach_profile_v1";

export default function CoachOnboardingPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(""); // YYYY-MM-DD
  const [city, setCity] = useState("");
  const [intention, setIntention] = useState("");

  useEffect(() => {
    // already onboarded? go panel
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (existing?.birthDate) navigate("/koc", { replace: true });
    } catch {}
  }, [navigate]);

  const title = isTR ? "Sanrı Yaşam Koçu" : "Sanri Life Coach";
  const subtitle = isTR
    ? "Kısa bir kurulum. Sonra alan sana göre şekillenecek."
    : "Quick setup. Then the space will shape around you.";

  const save = () => {
    const profile = {
      name: (name || "").trim(),
      birthDate,
      city: (city || "").trim(),
      intention: (intention || "").trim(),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(LS_KEY, JSON.stringify(profile));
    navigate("/koc", { replace: true });
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.brandArea}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subBrand}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>

        <div className={styles.actions}>
          <button className={styles.backBtn} type="button" onClick={() => navigate("/", { state: { skipIntro: true } })}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>

          <button
            className={styles.langBtn}
            type="button"
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>SANRI • LIFE COACH</div>
          <div className={styles.h1}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>

          <div className={styles.grid}>
            <div className={styles.field}>
              <label>{isTR ? "İsim (opsiyonel)" : "Name (optional)"}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={isTR ? "Adın" : "Your name"} />
            </div>

            <div className={styles.field}>
              <label>{isTR ? "Doğum tarihi" : "Birth date"}</label>
              <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} type="date" />
            </div>

            <div className={styles.field}>
              <label>{isTR ? "Şehir (opsiyonel)" : "City (optional)"}</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder={isTR ? "İstanbul…" : "Istanbul…"} />
            </div>

            <div className={styles.fieldWide}>
              <label>{isTR ? "Bugünün niyeti" : "Today's intention"}</label>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder={isTR ? "Bugün kendimde neyi açıyorum?" : "What am I opening in myself today?"}
              />
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button
              type="button"
              className={styles.primary}
              onClick={save}
              disabled={!birthDate}
              title={!birthDate ? (isTR ? "Doğum tarihi gerekli" : "Birth date required") : ""}
            >
              {isTR ? "Alanı Aktive Et" : "Activate Space"}
            </button>

            <button type="button" className={styles.ghost} onClick={() => navigate("/", { state: { skipIntro: true } })}>
              {isTR ? "Şimdilik geç" : "Skip for now"}
            </button>
          </div>

          <div className={styles.footnote}>
            {isTR
              ? "Not: Bu kurulum sadece cihazında saklanır (local). Sonra üyelikle kalıcı hâle getiririz."
              : "Note: This setup is stored locally on your device. We’ll make it persistent with membership later."}
          </div>
        </div>
      </div>
    </div>
  );
}