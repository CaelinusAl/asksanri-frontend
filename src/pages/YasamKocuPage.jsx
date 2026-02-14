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

  const [note, setNote] = useState(localStorage.getItem("sanri_note") || "");
  const [draft, setDraft] = useState(localStorage.getItem("sanri_draft") || "");

  const daily = useMemo(() => {
    const poolTR = [
      "Bugün bir şeyi düzeltme. Sadece gör.",
      "Küçük seçimler büyük akışa dönüşür.",
      "Kalbinin sessizliği, zihnin gürültüsünü çözer.",
      "Sorunun cevabı bazen ‘senin frekansın’dır.",
    ];
    const poolEN = [
      "Don’t fix anything today. Just see.",
      "Small choices become a larger flow.",
      "The silence of the heart dissolves the noise of the mind.",
      "Sometimes the answer is your frequency.",
    ];
    const pool = isTR ? poolTR : poolEN;
    const idx = new Date().getDate() % pool.length;
    return pool[idx];
  }, [isTR]);

  const addNoteToDraft = () => {
    const merged = `${draft}\n\n—\n${note}`.trim();
    setDraft(merged);
    localStorage.setItem("sanri_draft", merged);
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft || "");
      alert(isTR ? "Kopyalandı." : "Copied.");
    } catch {
      alert(isTR ? "Kopyalanamadı." : "Copy failed.");
    }
  };

  const saveNote = () => {
    localStorage.setItem("sanri_note", note);
    alert(isTR ? "Kaydedildi." : "Saved.");
  };

  const clearAll = () => {
    if (!confirm(isTR ? "Not ve taslak temizlensin mi?" : "Clear note and draft?")) return;
    setNote("");
    setDraft("");
    localStorage.removeItem("sanri_note");
    localStorage.removeItem("sanri_draft");
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.left}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.sub}>
            {isTR ? "Sanrı Yaşam Koçu • Kişisel Panel" : "Sanri Life Coach • Personal Panel"}
          </span>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate("/", { state: { skipIntro: true } })}
          >
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>

          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.hero}>
          <div className={styles.kicker}>{isTR ? "BUGÜNÜN SÖZÜ" : "TODAY'S LINE"}</div>
          <div className={styles.daily}>{daily}</div>
          <div className={styles.mini}>
            {isTR
              ? "Bu alan yaşayan bir alan. Yazdıkların birikiyor. Sonra ‘Kitap Taslağı’na dönüşür."
              : "This is a living space. What you write accumulates, then becomes a book draft."}
          </div>

          {/* QUICK ACTIONS */}
          <div className={styles.row}>
            <button type="button" className={styles.primary} onClick={saveNote}>
              {isTR ? "Notu Kaydet" : "Save Note"}
            </button>
            <button type="button" className={styles.ghost} onClick={clearAll}>
              {isTR ? "Temizle" : "Clear"}
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {/* NOTE */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "Kendi Notun" : "Your Note"}</div>
            <textarea
              className={styles.textarea}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                localStorage.setItem("sanri_note", e.target.value);
              }}
              placeholder={isTR ? "Bugün neyi fark ettin?" : "What did you notice today?"}
            />
            <div className={styles.row}>
              <button type="button" className={styles.primary} onClick={saveNote}>
                {isTR ? "Kaydet" : "Save"}
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => navigate("/sanriya-sor", { state: { skipIntro: true }, replace: false })}
              >
                {isTR ? "SANRI’ya Sor" : "Ask SANRI"}
              </button>
            </div>
          </div>

          {/* DRAFT */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "Kitap Taslağı" : "Book Draft"}</div>
            <textarea
              className={styles.textarea}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                localStorage.setItem("sanri_draft", e.target.value);
              }}
              placeholder={isTR ? "Buraya parça parça yaz… Sonra bölüm olur." : "Write in fragments… Later it becomes chapters."}
            />
            <div className={styles.row}>
              <button type="button" className={styles.primary} onClick={addNoteToDraft}>
                {isTR ? "Notu Taslağa Ekle" : "Add Note to Draft"}
              </button>
              <button type="button" className={styles.ghost} onClick={copyDraft}>
                {isTR ? "Taslağı Kopyala" : "Copy Draft"}
              </button>
            </div>
          </div>

          {/* PLANS (ACTIVE) */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "Planlar" : "Plans"}</div>

            <div className={styles.planList}>
              <button
                type="button"
                className={styles.planItemBtn}
                onClick={() => alert(isTR ? "Misafir: Panel + Notlar aktif." : "Guest: Panel + Notes active.")}
              >
                <div className={styles.planName}>{isTR ? "Misafir" : "Guest"}</div>
                <div className={styles.planDesc}>{isTR ? "Panel + Notlar" : "Panel + Notes"}</div>
              </button>

              <button
                type="button"
                className={styles.planItemBtn}
                onClick={() => navigate("/rituel-alani", { state: { skipIntro: true } })}
              >
                <div className={styles.planName}>{isTR ? "Premium" : "Premium"}</div>
                <div className={styles.planDesc}>
                  {isTR ? "Ritüel Alanı + Kitap Oluşturma" : "Ritual Space + Book Builder"}
                </div>
              </button>
            </div>

            <div className={styles.row}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => navigate("/library", { state: { skipIntro: true } })}
              >
                {isTR ? "Kütüphaneyi Aç" : "Open Library"}
              </button>

              <button
                type="button"
                className={styles.ghost}
                onClick={() => alert(isTR ? "Ödeme bağlantısını yarın bağlayacağız." : "Payments will be wired tomorrow.")}
              >
                {isTR ? "Satın Al (yakında)" : "Buy (soon)"}
              </button>
            </div>
          </div>

          {/* TALK TO SANRI (ACTIVE) */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>{isTR ? "SANRI ile Konuş" : "Talk to SANRI"}</div>
            <div className={styles.cardDesc}>
              {isTR ? "Hemen Yansıma alanına geç." : "Jump into the reflection space."}
            </div>

            <button
              type="button"
              className={styles.primary}
              onClick={() => navigate("/sanriya-sor", { state: { skipIntro: true } })}
            >
              {isTR ? "SANRI’ya Sor →" : "Ask SANRI →"}
            </button>

            <button
              type="button"
              className={styles.ghost}
              onClick={() => navigate("/library", { state: { skipIntro: true } })}
              style={{ marginTop: 10 }}
            >
              {isTR ? "Kitapları Gör →" : "See Books →"}
            </button>
          </div>
        </div>

        <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}