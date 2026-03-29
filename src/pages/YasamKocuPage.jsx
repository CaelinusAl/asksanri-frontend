// src/pages/YasamKocuPage.jsx — Sanrı Yaşam Koçu PREMIUM (farkındalık sahnesi, mail sonrası)
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./YasamKocuPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { unlockAudio } from "../utils/sfx";

function buildScope(email) {
  if (!email || !String(email).trim()) return "guest";
  return String(email)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]/gi, "_");
}

function firstNameFromEmail(email) {
  if (!email) return "";
  const local = String(email).split("@")[0] || "";
  const part = local.split(/[._-]/)[0] || local;
  if (!part) return "";
  return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
}

export default function YasamKocuPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { user, isAuthenticated, isPremium } = useAuth();
  const isTR = language === "tr";

  const scope = useMemo(() => buildScope(user?.email), [user?.email]);
  const noteKey = useMemo(() => `sanri_ritual_note_${scope}`, [scope]);
  const draftKey = useMemo(() => `sanri_ritual_draft_${scope}`, [scope]);

  const [note, setNote] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    let n = localStorage.getItem(noteKey);
    let d = localStorage.getItem(draftKey);

    if (n == null || n === "") {
      const leg = localStorage.getItem("sanri_note");
      if (leg) {
        n = leg;
        localStorage.setItem(noteKey, leg);
      }
    }
    if (d == null || d === "") {
      const legD = localStorage.getItem("sanri_draft");
      if (legD) {
        d = legD;
        localStorage.setItem(draftKey, legD);
      }
    }

    setNote(n || "");
    setDraft(d || "");
  }, [noteKey, draftKey]);

  const displayName = useMemo(
    () => firstNameFromEmail(user?.email) || (isTR ? "yolcu" : "traveler"),
    [user?.email, isTR]
  );

  const daily = useMemo(() => {
    const poolTR = [
      "Bugün bir şeyi düzeltme. Sadece gör — farkındalık burada başlar.",
      "Motivasyon dışarıdan gelmez; hatırladığın potansiyelden doğar.",
      "Küçük seçimler büyük akışa dönüşür; sen seçtikçe yol açılır.",
      "Kalbinin sessizliği, zihnin gürültüsünü çözer.",
      "Şaşıracağın şey: dönüşümün kaynağı zaten sende.",
      "Sanrı Yaşam Koçu sabit bir panel değil — sen nefes aldıkça yeniden yazılıyor.",
      "Sorunun cevabı bazen ‘senin frekansın’dır.",
      "Yaptıklarına bak: orada gizli olan, yapabileceklerinin habercisi.",
    ];
    const poolEN = [
      "Don’t fix anything today. Just see — awareness starts here.",
      "Motivation isn’t poured in from outside; it rises from the potential you remember.",
      "Small choices become a larger flow; the path opens as you choose.",
      "The silence of the heart dissolves the noise of the mind.",
      "What may surprise you: the source of the shift is already in you.",
      "Sanri Life Coach isn’t a fixed dashboard — it rewrites itself with every breath you take.",
      "Sometimes the answer is your frequency.",
      "Look at what you’ve already done — it hints at what you’re capable of next.",
    ];
    const pool = isTR ? poolTR : poolEN;
    const idx = new Date().getDate() % pool.length;
    return pool[idx];
  }, [isTR]);

  const persistNote = (val) => {
    setNote(val);
    localStorage.setItem(noteKey, val);
  };

  const persistDraft = (val) => {
    setDraft(val);
    localStorage.setItem(draftKey, val);
  };

  const addNoteToDraft = () => {
    const merged = `${draft}\n\n—\n${note}`.trim();
    persistDraft(merged);
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
    localStorage.setItem(noteKey, note);
    alert(isTR ? "Kaydedildi." : "Saved.");
  };

  const clearAll = () => {
    if (!confirm(isTR ? "Not ve taslak temizlensin mi?" : "Clear note and draft?")) return;
    setNote("");
    setDraft("");
    localStorage.removeItem(noteKey);
    localStorage.removeItem(draftKey);
  };

  const phNote = isTR
    ? "Şu an içinde ne var? Bir cümle — yargısız, acele etmeden."
    : "What’s alive in you right now? One line — no rush, no judgment.";
  const phDraft = isTR
    ? "Uzun yolculuğun metni… her parça seni ‘yapabilirim’e yaklaştırır."
    : "The long journey in words… each fragment pulls you closer to I can.";

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.left}>
          <span className={styles.brand}>SANRI</span>
          <span className={styles.sub}>
            {isTR ? "Sanrı Yaşam Koçu • PREMIUM" : "Sanri Life Coach • PREMIUM"}
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
        <header className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden />
          <p className={styles.heroEyebrow}>
            {isTR ? "İç mekân • Eşik açıldı" : "Inner chamber • Threshold open"}
          </p>
          <h1 className={styles.heroTitle}>
            {isTR ? "Kişiye özel Ritüel Alanı" : "Your personal ritual space"}
          </h1>
          <p className={styles.heroTagline}>
            {isTR
              ? "Burada veri toplanmaz; iz bırakırsın. Yazdıkların sessizce birikir — sonra sese dönüşür."
              : "Nothing is harvested here; you leave traces. Words gather quietly — then they become voice."}
          </p>

          <div className={styles.personalRow}>
            <span className={styles.personalBadge}>
              {isTR ? "Kişiye özel" : "Personal"}
            </span>
            {isPremium ? (
              <span className={styles.premiumPill}>Premium</span>
            ) : null}
          </div>
          <p className={styles.greeting}>
            {isTR ? (
              <>
                Merhaba, <span className={styles.greetingName}>{displayName}</span>
                {isAuthenticated
                  ? " — bu eşik senin; ritüel ve ritim burada seninle."
                  : " — misafir modundasın; giriş yapınca bu sahne tamamen senin adına kilitlenir."}
              </>
            ) : (
              <>
                Hello, <span className={styles.greetingName}>{displayName}</span>
                {isAuthenticated
                  ? " — this threshold is yours; ritual and rhythm live here with you."
                  : " — you’re in guest mode; sign in to anchor this stage fully to you."}
              </>
            )}
          </p>
          {isAuthenticated && user?.email ? (
            <p className={styles.emailHint}>{user.email}</p>
          ) : null}

          <div className={styles.ritualEntry}>
            <h2 className={styles.ritualEntryTitle}>
              {isTR ? "Ritüel Alanı — derin akış" : "Ritual field — deep flow"}
            </h2>
            <p className={styles.ritualEntryDesc}>
              {isTR
                ? "Farkındalığı bedene indirmek istediğinde: protokoller, ses tüneli, mühür. Yaşam koçluğu burada düşünceyle değil — ritüelle sürdürülür."
                : "When you want awareness to land in the body: protocols, sound tunnel, seal. Coaching here isn’t only thought — it continues as ritual."}
            </p>
            <button
              type="button"
              className={styles.ritualEntryBtn}
              onClick={() => navigate("/rituel-alani", { state: { skipIntro: true } })}
            >
              {isTR ? "Ritüel alanına geç, akışa gir →" : "Go to the ritual field, enter the flow →"}
            </button>
          </div>
        </header>

        <section className={styles.oracle} aria-labelledby="oracle-kicker">
          <span className={styles.oracleFrame} aria-hidden>
            ◈
          </span>
          <div id="oracle-kicker" className={styles.kicker}>
            {isTR ? "BUGÜNÜN IŞIĞI" : "TODAY'S LIGHT"}
          </div>
          <div className={styles.daily}>{daily}</div>
          <div className={styles.mini}>
            {isTR
              ? "Her gün tek bir cümleyle kendine dön — küçük hatırlatma, büyük yön. Yazdıkların kitap taslağına akar."
              : "Return to yourself in one sentence a day — a small reminder, a large direction. What you write flows into your book draft."}
          </div>
          <div className={styles.oracleActions}>
            <button type="button" className={styles.primary} onClick={saveNote}>
              {isTR ? "Notu mühürle" : "Seal the note"}
            </button>
            <button type="button" className={styles.ghost} onClick={clearAll}>
              {isTR ? "Alanı boşalt" : "Clear space"}
            </button>
          </div>
        </section>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden>
              ✧
            </div>
            <div className={styles.cardTitle}>{isTR ? "Bugünün izi" : "Today's trace"}</div>
            <div className={styles.cardSub}>
              {isTR
                ? "Bir satır yeter — ‘şu an ne oluyor?’ sorusuna içten bir cevap."
                : "One line is enough — an honest answer to what’s alive right now."}
            </div>
            <textarea
              className={styles.textarea}
              value={note}
              onChange={(e) => persistNote(e.target.value)}
              placeholder={phNote}
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
                {isTR ? "SANRI'ya taşı →" : "Carry to SANRI →"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden>
              ✦
            </div>
            <div className={styles.cardTitle}>{isTR ? "Kitap taslağı" : "Book draft"}</div>
            <div className={styles.cardSub}>
              {isTR
                ? "Hikâyen uzun soluklu büyür — sen yazdıkça ‘ben bunu da yaptım’ dediğin yer."
                : "Your story grows in chapters — the place where you prove: I did this too."}
            </div>
            <textarea
              className={styles.textarea}
              value={draft}
              onChange={(e) => persistDraft(e.target.value)}
              placeholder={phDraft}
            />
            <div className={styles.row}>
              <button type="button" className={styles.primary} onClick={addNoteToDraft}>
                {isTR ? "Notu taslağa ekle" : "Add note to draft"}
              </button>
              <button type="button" className={styles.ghost} onClick={copyDraft}>
                {isTR ? "Taslağı kopyala" : "Copy draft"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden>
              ◇
            </div>
            <div className={styles.cardTitle}>{isTR ? "Kapılar" : "Gates"}</div>
            <div className={styles.cardSub}>
              {isTR
                ? "Bir sonraki adımın frekansını seç — kütüphane, ritüel, derin akış."
                : "Choose the frequency of your next step — library, ritual, deep flow."}
            </div>

            <div className={styles.planList}>
              <button
                type="button"
                className={styles.planItemBtn}
                onClick={() => alert(isTR ? "Misafir: panel + notlar açık." : "Guest: panel + notes active.")}
              >
                <div className={styles.planName}>{isTR ? "Misafir" : "Guest"}</div>
                <div className={styles.planDesc}>{isTR ? "Panel + notlar" : "Panel + notes"}</div>
              </button>

              <button
                type="button"
                className={styles.planItemBtn}
                onClick={() => navigate("/rituel-alani", { state: { skipIntro: true } })}
              >
                <div className={styles.planName}>{isTR ? "Premium" : "Premium"}</div>
                <div className={styles.planDesc}>
                  {isTR ? "Ritüel kubbesi + kitap oluşturma" : "Ritual dome + book builder"}
                </div>
              </button>
            </div>

            <div className={styles.row}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => navigate("/library", { state: { skipIntro: true } })}
              >
                {isTR ? "Kütüphaneyi aç" : "Open library"}
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => alert(isTR ? "Ödeme bağlantısı yakında." : "Payment link soon.")}
              >
                {isTR ? "Satın al (yakında)" : "Buy (soon)"}
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon} aria-hidden>
              ☽
            </div>
            <div className={styles.cardTitle}>{isTR ? "Yansıma" : "Reflection"}</div>
            <div className={styles.cardDesc}>
              {isTR
                ? "SANRI’ya geç — hazır cevap değil; seni harekete geçiren yön."
                : "Go to SANRI — not ready-made answers; direction that moves you."}
            </div>

            <div className={styles.ctaStack}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => navigate("/sanriya-sor", { state: { skipIntro: true } })}
              >
                {isTR ? "SANRI'ya geç →" : "Go to SANRI →"}
              </button>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => navigate("/library", { state: { skipIntro: true } })}
              >
                {isTR ? "Kitapları gör →" : "See books →"}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footer}>© 2026 CaelinusAI • SANRI</div>
      </div>
    </div>
  );
}
