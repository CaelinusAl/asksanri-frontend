// src/pages/YasamKocuPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./YasamKocuPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

export default function YasamKocuPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const daily = useMemo(() => {
    const tr = [
      "Bugün küçük bir seçim yap: Kendine daha nazik davran.",
      "Niyet netleşince sistem sadeleşir.",
      "Kalbinin ‘evet’ dediği yere bir adım.",
      "Şu an, yön değiştirmenin tam zamanı.",
      "Bir cümle yaz: ‘Ben neyi seçiyorum?’",
    ];
    const en = [
      "Make one small choice today: be kinder to yourself.",
      "When intention becomes clear, the system becomes simple.",
      "Take one step toward what your heart says yes to.",
      "Now is the moment to change direction.",
      "Write one sentence: “What am I choosing?”",
    ];
    const list = isTR ? tr : en;
    const idx = new Date().getDate() % list.length;
    return list[idx];
  }, [isTR]);

  const [note, setNote] = useState("");

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brandPill}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Sanrı Yaşam Koçu" : "SANRI Life Coach"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={() => navigate("/", { state: { skipIntro: true } })}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>

          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
            aria-label="Language toggle"
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • LIVING SPACE</div>
          <div className={styles.h1}>{isTR ? "Sanrı Yaşam Koçu" : "SANRI Life Coach"}</div>
          <div className={styles.subtitle}>
            {isTR ? "Kişisel alanın: günlük sözler, notlar ve dönüşüm." : "Your personal space: daily guidance, notes, transformation."}
          </div>

          <div className={styles.grid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>{isTR ? "Günün Sözü" : "Daily Line"}</div>
              <div className={styles.daily}>{daily}</div>

              <div className={styles.smallNote}>
                {isTR ? "İpucu: Bugün tek bir küçük eylem seç." : "Tip: Choose one small action today."}
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>{isTR ? "Kişisel Not" : "Personal Note"}</div>
              <textarea
                className={styles.textarea}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={isTR ? "Bugün neyi seçiyorsun? (kısa yaz)" : "What are you choosing today? (write briefly)"}
              />
              <div className={styles.row}>
                <button type="button" className={styles.ghostBtn} onClick={() => setNote("")}>
                  {isTR ? "Temizle" : "Clear"}
                </button>
                <div className={styles.grow} />
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => {
                    // şimdilik local; sonra backend’e kaydederiz
                    alert(isTR ? "Kaydedildi (şimdilik local). Sonra hesabına bağlayacağız." : "Saved (local for now). We’ll bind it to your account next.");
                  }}
                >
                  {isTR ? "Kaydet" : "Save"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.footnote}>
            {isTR
              ? "Bu alan yaşayan bir alan: her gün büyür. © 2026 CaelinusAI • SANRI"
              : "This is a living space: it grows daily. © 2026 CaelinusAI • SANRI"}
          </div>
        </div>
      </div>
    </div>
  );
}