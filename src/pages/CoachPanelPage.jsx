// src/pages/CoachPanelPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoachPanelPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

const PROFILE_KEY = "sanri_coach_profile_v1";
const JOURNAL_KEY = "sanri_coach_journal_v1";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CoachPanelPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [profile, setProfile] = useState(null);
  const [journal, setJournal] = useState("");
  const [savedAt, setSavedAt] = useState("");

  useEffect(() => {
    // require onboarding
    let p = null;
    try { p = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); } catch {}
    if (!p?.birthDate) {
      navigate("/koc/onboarding", { replace: true });
      return;
    }
    setProfile(p);

    // load todays journal
    try {
      const all = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "{}");
      const t = todayKey();
      setJournal(all[t] || "");
    } catch {}
  }, [navigate]);

  const dailyLine = useMemo(() => {
    if (isTR) return "Bugün bir cümle seç. O cümle gününü yönetir.";
    return "Pick one sentence today. That sentence will steer your day.";
  }, [isTR]);

  const saveJournal = () => {
    const t = todayKey();
    const all = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "{}");
    all[t] = journal;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(all));
    setSavedAt(new Date().toLocaleTimeString());
    try { playSfx("/sfx/aura-chime.mp3", { volume: 0.18 }); } catch {}
  };

  const goAskSanri = () => {
    const prefill = isTR
      ? `Bugün niyetim: ${profile?.intention || ""}\nBana bir yön cümlesi ver.`
      : `My intention today: ${profile?.intention || ""}\nGive me one guiding sentence.`;
    navigate(`/sanriya-sor?prefill=${encodeURIComponent(prefill)}&domain=consciousness_field&mode=mirror`);
  };

  const resetProfile = () => {
    localStorage.removeItem(PROFILE_KEY);
    navigate("/koc/onboarding", { replace: true });
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.brandArea}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subBrand}>
            {isTR ? "Sanrı Yaşam Koçu" : "Sanri Life Coach"}
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
        <div className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.kicker}>{isTR ? "Bugünün Alanı" : "Today's Space"}</div>
            <div className={styles.h1}>
              {profile?.name ? `${profile.name}` : (isTR ? "Hoş geldin" : "Welcome")}
            </div>
            <div className={styles.sub}>{dailyLine}</div>

            <div className={styles.pills}>
              <span className={styles.pill}>{isTR ? "Günlük Söz" : "Daily Line"}</span>
              <span className={styles.pill}>{isTR ? "Not Defteri" : "Journal"}</span>
              <span className={styles.pill}>{isTR ? "Kitap Taslağı" : "Book Draft"}</span>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.cardSmall}>
              <div className={styles.cardTitle}>{isTR ? "Niyet" : "Intention"}</div>
              <div className={styles.cardText}>{profile?.intention || (isTR ? "—" : "—")}</div>

              <button className={styles.primary} type="button" onClick={goAskSanri}>
                {isTR ? "SANRI ile başla" : "Start with SANRI"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>{isTR ? "Not Defteri" : "Journal"}</div>
            <textarea
              className={styles.textarea}
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder={isTR ? "Bugün kendime bir cümle yaz…" : "Write one sentence to yourself…"}
            />
            <div className={styles.row}>
              <button className={styles.primary} type="button" onClick={saveJournal}>
                {isTR ? "Kaydet" : "Save"}
              </button>
              <button className={styles.ghost} type="button" onClick={() => setJournal("")}>
                {isTR ? "Temizle" : "Clear"}
              </button>
              <div className={styles.grow} />
              <div className={styles.mini}>{savedAt ? (isTR ? `Kaydedildi: ${savedAt}` : `Saved: ${savedAt}`) : ""}</div>
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panelTitle}>{isTR ? "Kitap Oluştur" : "Build a Book"}</div>
            <div className={styles.cardText}>
              {isTR
                ? "Yakında: Günlük yazılarını bölüm bölüm birleştirip e-kitaba dönüştüreceğiz."
                : "Soon: We’ll stitch your daily entries into chapters and export an e-book."}
            </div>

            <div className={styles.shopGrid}>
              <div className={styles.shopCard}>
                <div className={styles.shopTitle}>{isTR ? "Üyelik Planı" : "Membership Plan"}</div>
                <div className={styles.shopDesc}>{isTR ? "Premium ritüeller + kütüphane" : "Premium rituals + library"}</div>
                <button className={styles.ghost} type="button" onClick={() => navigate("/rituel-alani")}>
                  {isTR ? "Ritüellere git" : "Go to Rituals"}
                </button>
              </div>

              <div className={styles.shopCard}>
                <div className={styles.shopTitle}>{isTR ? "E-Kitap" : "E-Book"}</div>
                <div className={styles.shopDesc}>{isTR ? "112. Kitap vitrin" : "112th Book showcase"}</div>
                <button className={styles.ghost} type="button" onClick={() => navigate("/library")}>
                  {isTR ? "Kütüphaneye git" : "Go to Library"}
                </button>
              </div>
            </div>

            <div className={styles.row}>
              <button className={styles.danger} type="button" onClick={resetProfile}>
                {isTR ? "Kurulumu sıfırla" : "Reset setup"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}

