import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CoachPanelPage.module.css";

import StarTrail from "../components/StarTrail";
import { unlockAudio, playSfx } from "../utils/sfx";
import { useLanguage } from "../contexts/LanguageContext";

const todayKey = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function CoachPanelPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  // --- tiny “life coach” state (local) ---
  const STORAGE_KEY = useMemo(() => `sanri_coach_${todayKey()}`, []);
  const [doneIds, setDoneIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doneIds));
    } catch {}
  }, [doneIds, STORAGE_KEY]);

  const kindnessCards = useMemo(() => {
    return isTR
      ? [
          { id: "k1", title: "Bugünün İyiliği", desc: "Bir kişiye gerçek bir iltifat et. Göz temasıyla." },
          { id: "k2", title: "Alan Temizliği", desc: "5 dakika: masadan 3 şeyi kaldır. Frekans açılır." },
          { id: "k3", title: "Kalp Mesajı", desc: "Birine “Nasılsın?” yaz ve cevap beklemeden gönder." },
        ]
      : [
          { id: "k1", title: "Kindness of the Day", desc: "Give one honest compliment—eye contact included." },
          { id: "k2", title: "Clear the Space", desc: "5 minutes: remove 3 items from your desk. Frequency opens." },
          { id: "k3", title: "Heart Message", desc: "Text someone: “How are you?” and send without expectation." },
        ];
  }, [isTR]);

  const dailyMantra = isTR
    ? "Bugün ‘düzeltmeye’ değil, ‘açmaya’ geldim."
    : "Today I’m not here to fix—I'm here to open.";

  const goBackToGates = useCallback(() => {
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const openSanri = useCallback(
    (prefill) => {
      unlockAudio();
      try {
        playSfx("/sfx/aura-chime.mp3", { volume: 0.18 });
      } catch {}
      const q = encodeURIComponent(prefill || "");
      navigate(`/sanriya-sor?mode=mirror&domain=auto&prefill=${q}`);
    },
    [navigate]
  );

  const markDone = (id) => {
    if (!id) return;
    setDoneIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brandPill}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Sanrı Yaşam Koçu" : "Sanri Life Coach"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
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
        {/* HERO */}
        <div className={styles.hero}>
          <div className={styles.kicker}>CAELINUS AI • LIVING SPACE</div>
          <div className={styles.h1}>{isTR ? "Sanrı Yaşam Koçu" : "Sanri Life Coach"}</div>
          <div className={styles.sub}>
            {isTR
              ? "Bugün giriş yap, alanı aktive et. SANRI seninle yürür."
              : "Enter today, activate the space. SANRI walks with you."}
          </div>

          <div className={styles.mantraBox}>
            <div className={styles.mantraTitle}>{isTR ? "Günlük Söz" : "Daily Line"}</div>
            <div className={styles.mantra}>{dailyMantra}</div>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() =>
                openSanri(
                  isTR
                    ? "Bugün hangi küçük seçim beni büyütür?"
                    : "What small choice today will expand me?"
                )
              }
            >
              {isTR ? "SANRI ile Başla" : "Start with SANRI"}
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {/* LEFT: Kindness */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "İyilik Alanı" : "Kindness Space"}</div>
            <div className={styles.cardDesc}>
              {isTR
                ? "Burası “iyi hissetmek” değil — iyi olmak için."
                : "Not to feel good — to do good."}
            </div>

            <div className={styles.list}>
              {kindnessCards.map((k) => {
                const done = doneIds.includes(k.id);
                return (
                  <div key={k.id} className={`${styles.item} ${done ? styles.itemDone : ""}`}>
                    <div className={styles.itemHeader}>
                      <div className={styles.itemName}>{k.title}</div>
                      {done ? <span className={styles.badge}>DONE</span> : null}
                    </div>
                    <div className={styles.itemText}>{k.desc}</div>
                    <div className={styles.row}>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() =>
                          openSanri(
                            isTR
                              ? `Bu görevi yaptığımda içimde ne açılır? (${k.title})`
                              : `What opens within me after I do this? (${k.title})`
                          )
                        }
                      >
                        {isTR ? "SANRI’ye Sor" : "Ask SANRI"}
                      </button>

                      <button
                        type="button"
                        className={styles.smallBtn}
                        onClick={() => markDone(k.id)}
                        disabled={done}
                      >
                        {done ? (isTR ? "Tamamlandı" : "Completed") : (isTR ? "Tamamladım" : "I did it")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Plans */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "Planlar & Ürünler" : "Plans & Products"}</div>
            <div className={styles.cardDesc}>
              {isTR
                ? "Premium ritüeller, kişisel alan ve kitap bölümleri."
                : "Premium rituals, personal space, and book chapters."}
            </div>

            <div className={styles.plans}>
              <div className={styles.plan}>
                <div className={styles.planName}>{isTR ? "Free" : "Free"}</div>
                <div className={styles.planLine}>
                  {isTR ? "Kapılar + temel alanlar" : "Gates + core spaces"}
                </div>
                <button type="button" className={styles.planBtn} onClick={() => navigate("/library")}>
                  {isTR ? "Kütüphaneyi Gör" : "Open Library"}
                </button>
              </div>

              <div className={styles.planPremium}>
                <div className={styles.planName}>{isTR ? "Premium" : "Premium"}</div>
                <div className={styles.planLine}>
                  {isTR ? "Ritüel alanı + özel protokoller" : "Ritual space + private protocols"}
                </div>

                {/* bugün için: ödeme yoksa bile “yakında” sayfasına götürür */}
                <button
                  type="button"
                  className={styles.planBtnPrimary}
                  onClick={() => navigate("/rituel-alani")}
                >
                  {isTR ? "Premium Kapıyı Gör" : "See Premium Gate"}
                </button>
              </div>

              <div className={styles.plan}>
                <div className={styles.planName}>{isTR ? "Goddess" : "Goddess"}</div>
                <div className={styles.planLine}>
                  {isTR ? "Sesli bölümler + özel kitap" : "Voiced chapters + special book"}
                </div>
                <button type="button" className={styles.planBtn} onClick={() => navigate("/library")}>
                  {isTR ? "Bölümlere Git" : "Go to Chapters"}
                </button>
              </div>
            </div>

            <div className={styles.footerNote}>
              {isTR
                ? "Not: Ödeme altyapısını bir sonraki adımda bağlarız. Bugün alanı çalışır halde çıkarıyoruz."
                : "Note: Payment wiring comes next. Today we ship a working living space."}
            </div>
          </div>
        </div>

        <div className={styles.footerLine}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}