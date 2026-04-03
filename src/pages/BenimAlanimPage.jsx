import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { usePremium } from "../contexts/PremiumContext";
import { fetchMyProfile, fetchMyPosts } from "../data/yankiApi";
import { KOD_MODULLERI, getAllLessonsFlat } from "../data/kodEgitmeniData";
import {
  getUnlockedItems,
  isShopierUnlocked,
  syncPurchasesFromServer,
} from "../data/shopierConfig";
import { getAllKatmanlar } from "../data/katmanEngine";
import styles from "./BenimAlanimPage.module.css";

/* ═══════════════════════════════════════════════
   CONSTANTS & DATA
   ═══════════════════════════════════════════════ */

const AVATAR_KEY = "sanri_avatar";
const NOTES_KEY = "sanri_my_notes";
const SAVED_KEY = "sanri_saved_items";
const DAILY_KEY = "sanri_daily_frekans";
const PROGRESS_KEY = "sanri_kod_progress";

const API_URL =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const AVATARS = [
  { id: "ates", tr: "Ateş", en: "Fire", symbol: "🔥" },
  { id: "su", tr: "Su", en: "Water", symbol: "💧" },
  { id: "hava", tr: "Hava", en: "Air", symbol: "🌬️" },
  { id: "toprak", tr: "Toprak", en: "Earth", symbol: "🌍" },
  { id: "ay", tr: "Ay", en: "Moon", symbol: "🌙" },
  { id: "gunes", tr: "Güneş", en: "Sun", symbol: "☀️" },
  { id: "yildiz", tr: "Yıldız", en: "Star", symbol: "⭐" },
  { id: "kapi", tr: "Kapı", en: "Door", symbol: "🚪" },
  { id: "spiral", tr: "Spiral", en: "Spiral", symbol: "🌀" },
  { id: "goz", tr: "Göz", en: "Eye", symbol: "👁️" },
  { id: "anahtar", tr: "Anahtar", en: "Key", symbol: "🔑" },
  { id: "kup", tr: "Küp", en: "Cube", symbol: "🧊" },
];

const EMOTIONS = [
  { id: "huzur", symbol: "🕊️", tr: "Huzur", en: "Peace" },
  { id: "merak", symbol: "🔍", tr: "Merak", en: "Curiosity" },
  { id: "umut", symbol: "🌱", tr: "Umut", en: "Hope" },
  { id: "karanlik", symbol: "🌑", tr: "Karanlık", en: "Darkness" },
  { id: "akis", symbol: "🌊", tr: "Akış", en: "Flow" },
  { id: "firtina", symbol: "⚡", tr: "Fırtına", en: "Storm" },
  { id: "bosluk", symbol: "◻️", tr: "Boşluk", en: "Void" },
  { id: "ates", symbol: "🔥", tr: "Ateş", en: "Fire" },
];

const DAILY_QUESTIONS = [
  { tr: "Bugün sende ne açıldı?", en: "What opened in you today?" },
  { tr: "En son neyi gerçekten hissettin?", en: "What did you truly feel last?" },
  { tr: "İçindeki en sessiz ses ne diyor?", en: "What is the quietest voice inside saying?" },
  { tr: "Bugün seni neye çekti evren?", en: "What did the universe pull you toward today?" },
  { tr: "Hangi düşünce sana ait değildi?", en: "Which thought didn't belong to you?" },
  { tr: "Kalbinin şu anki frekansı ne?", en: "What is your heart's current frequency?" },
  { tr: "Neyi bırakmaya hazırsın?", en: "What are you ready to release?" },
];

const SANRI_VISIONS_TR = [
  "Bugün sende bir sessizlik var. Ama o sessizlik dolu.",
  "Bir kapının eşiğindesin. Henüz fark etmedin.",
  "İçindeki gözlemci uyanmaya başlıyor.",
  "Bugün sende bir kırılma noktası gizli.",
  "Frekansın yükseliyor. Bunu hissedebiliyorsun.",
  "Bir şeyi bırakmaya hazırsın ama henüz adını koymadın.",
  "Bugün senin için bir mesaj var. Dikkat et.",
  "İçindeki çocuk bugün bir şey söylemek istiyor.",
  "Sende bir ışık yanıp sönüyor. Karar anına yaklaşıyorsun.",
  "Bugün evren seninle aynı dilde konuşuyor.",
  "Bir rüyanın kırıntıları seni takip ediyor.",
  "İçindeki pusula bugün kuzeyi değiştirdi.",
  "Bugün bir ayna kırılacak. Ama arkasında gerçek var.",
  "Sende tekrar eden bir melodi var. Onu dinle.",
  "Bugün bir hatırlayış günü. Ama neyi hatırlayacağını sen seç.",
  "İçindeki fırtına dindikten sonra bir şey kalacak.",
  "Sende bir kod çözülmeye çalışıyor.",
  "Bugün senin gücün sessizlikte.",
  "Bir döngü kapanmak üzere. Hazır mısın?",
  "İçinde bir tohum çatırdıyor. Kök salma zamanı.",
  "Bugün sende bir nostalji frekansı var.",
  "Bir şeyi anlaman için tekrar görmek gerekiyordu.",
  "Sende açılmamış bir mektup var.",
  "Bugün bir kapı kapanacak. Ama bir koridor açılacak.",
  "İçindeki karanlıkta bir mum yanıyor. Onu koru.",
  "Bugün senin adın farklı bir anlam taşıyor.",
  "Bir yıldız sana doğru düşüyor. Dileğini hazırla.",
  "Sende bir geometri oluşuyor. Henüz tamamlanmadı.",
  "Bugün sana gelen ilk düşünce en gerçek olanı.",
  "İçindeki su bugün farklı akıyor. Akışa güven.",
  "Bugün sende bir veda var. Neye veda ettiğini sen biliyorsun.",
];

const SANRI_VISIONS_EN = [
  "There is a silence in you today. But that silence is full.",
  "You are at a threshold. You haven't noticed yet.",
  "The observer within you is starting to awaken.",
  "A breaking point is hidden in you today.",
  "Your frequency is rising. You can feel it.",
  "You are ready to let go of something but haven't named it yet.",
  "There is a message for you today. Pay attention.",
  "The child within you wants to say something today.",
  "A light is flickering inside you. You are approaching a decision.",
  "Today the universe speaks your language.",
  "Fragments of a dream are following you.",
  "Your inner compass changed north today.",
  "A mirror will break today. But behind it lies truth.",
  "There is a repeating melody in you. Listen to it.",
  "Today is a day of remembering. But you choose what to remember.",
  "After the storm inside you calms, something will remain.",
  "A code is trying to be deciphered within you.",
  "Today your power is in silence.",
  "A cycle is about to close. Are you ready?",
  "A seed is cracking inside you. Time to take root.",
  "There is a nostalgia frequency in you today.",
  "You needed to see it again to understand.",
  "There is an unopened letter within you.",
  "A door will close today. But a corridor will open.",
  "A candle burns in your darkness. Protect it.",
  "Your name carries a different meaning today.",
  "A star is falling toward you. Prepare your wish.",
  "A geometry is forming within you. Not yet complete.",
  "The first thought that came to you today is the truest one.",
  "The water within you flows differently today. Trust the flow.",
  "There is a farewell in you today. You know what you are saying goodbye to.",
];

const RECURRING_THEMES_TR = [
  "Arayış", "Dönüşüm", "Bırakma", "Hatırlayış", "Sessizlik",
  "Frekans", "Ayna", "Kapı", "Döngü", "Kök", "Akış", "Işık",
];
const RECURRING_THEMES_EN = [
  "Search", "Transformation", "Release", "Remembrance", "Silence",
  "Frequency", "Mirror", "Door", "Cycle", "Root", "Flow", "Light",
];
const AVOIDED_THEMES_TR = [
  "Yüzleşme", "Kabul", "Gölge", "Kaybetme", "Kontrol bırakma", "Kırılganlık",
];
const AVOIDED_THEMES_EN = [
  "Confrontation", "Acceptance", "Shadow", "Losing", "Letting go of control", "Vulnerability",
];

const BADGES = [
  { id: "ilk_kapi", tr: "İlk Kapı", en: "First Door", icon: "🚪", descTr: "Alana adım attın", descEn: "You stepped into the field" },
  { id: "yanki_birakici", tr: "Yankı Bırakıcı", en: "Echo Maker", icon: "🔔", descTr: "İlk yankını bıraktın", descEn: "You left your first echo" },
  { id: "kod_tasiyici", tr: "Kod Taşıyıcısı", en: "Code Bearer", icon: "📜", descTr: "İlk dersi tamamladın", descEn: "You completed your first lesson" },
  { id: "hatirlayan", tr: "Hatırlayan", en: "The Rememberer", icon: "✨", descTr: "21 dersi tamamladın", descEn: "You completed all 21 lessons" },
  { id: "ayna_tutan", tr: "Ayna Tutan", en: "Mirror Holder", icon: "🪞", descTr: "SANRI kod yorumu aldın", descEn: "You received a SANRI code reading" },
  { id: "frekans_bekcisi", tr: "Frekans Bekçisi", en: "Frequency Guardian", icon: "📡", descTr: "Premium erişim açıldı", descEn: "Premium access unlocked" },
  { id: "rituel_yolcusu", tr: "Ritüel Yolcusu", en: "Ritual Traveler", icon: "🕯️", descTr: "İlk ritüeli tamamladın", descEn: "You completed your first ritual" },
  { id: "derin_okuyucu", tr: "Derin Okuyucu", en: "Deep Reader", icon: "📖", descTr: "7 gün üst üste giriş", descEn: "7 consecutive days of entry" },
  { id: "matrix_cozucu", tr: "Matrix Çözücü", en: "Matrix Solver", icon: "🔮", descTr: "Tüm modülleri aç", descEn: "Unlock all modules" },
  { id: "hafiza_tasiyici", tr: "Hafıza Taşıyıcısı", en: "Memory Bearer", icon: "🧠", descTr: "21 gün streak", descEn: "21 day streak" },
];

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveJSON(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailyQuestion() {
  const day = new Date().getDate();
  return DAILY_QUESTIONS[day % DAILY_QUESTIONS.length];
}

function getKodProgress() {
  const progress = loadJSON(PROGRESS_KEY, {});
  const allLessons = getAllLessonsFlat();
  let done = 0;
  const completedIds = new Set();
  for (const [, lessons] of Object.entries(progress)) {
    if (Array.isArray(lessons)) {
      lessons.forEach((id) => { completedIds.add(id); done++; });
    }
  }
  const total = allLessons.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  let activeModule = null;
  let nextLesson = null;
  for (const mod of KOD_MODULLERI) {
    for (const lesson of mod.lessons) {
      if (!completedIds.has(lesson.id)) {
        activeModule = mod;
        nextLesson = { ...lesson, moduleId: mod.id };
        break;
      }
    }
    if (nextLesson) break;
  }

  let lastCompleted = null;
  for (let i = allLessons.length - 1; i >= 0; i--) {
    if (completedIds.has(allLessons[i].id)) {
      lastCompleted = allLessons[i];
      break;
    }
  }

  return { done, total, percent, activeModule, nextLesson, lastCompleted };
}

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function getDailyVision(isTR) {
  const seed = new Date().getFullYear() * 1000 + dayOfYear();
  const pool = isTR ? SANRI_VISIONS_TR : SANRI_VISIONS_EN;
  return pool[seed % pool.length];
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now - start) / 86400000);
}

function getRecurringTheme(isTR) {
  const pool = isTR ? RECURRING_THEMES_TR : RECURRING_THEMES_EN;
  const seed = dayOfYear() * 7 + 3;
  return pool[seed % pool.length];
}

function getAvoidedTheme(isTR) {
  const pool = isTR ? AVOIDED_THEMES_TR : AVOIDED_THEMES_EN;
  const seed = dayOfYear() * 13 + 5;
  return pool[seed % pool.length];
}

function getStreakMessage(streak, isTR) {
  const milestones = [3, 7, 21];
  for (const m of milestones) {
    if (streak < m) {
      const left = m - streak;
      return isTR
        ? `${m} gün hedefine ${left} gün kaldı.`
        : `${left} day${left > 1 ? "s" : ""} until ${m}-day milestone.`;
    }
  }
  if (streak >= 21) {
    return isTR
      ? "Hafıza Taşıyıcısı statüsüne ulaştın. Artık sen bir gözlemcisin."
      : "You've reached Memory Bearer status. You are now an observer.";
  }
  return "";
}

function suggestLesson(text, allLessons) {
  if (!text || text.length < 10 || allLessons.length === 0) return null;
  const lower = text.toLowerCase();
  const keywords = {
    frekans: ["frekans", "enerji", "titreşim", "frequency", "energy"],
    sembol: ["sembol", "işaret", "simge", "symbol", "sign"],
    kelime: ["kelime", "anlam", "dil", "word", "meaning", "language"],
    sayı: ["sayı", "3", "6", "9", "number", "rakam"],
    sistem: ["sistem", "matrix", "haber", "dünya", "system", "news", "world"],
    rüya: ["rüya", "hayal", "görüntü", "dream", "vision"],
    bilinç: ["bilinç", "farkındalık", "awareness", "consciousness"],
  };
  for (const [, words] of Object.entries(keywords)) {
    if (words.some((w) => lower.includes(w))) {
      const match = allLessons.find((l) =>
        words.some((w) => (l.title || "").toLowerCase().includes(w) || (l.content || "").toLowerCase().includes(w))
      );
      if (match) return match;
    }
  }
  return allLessons.find((l) => !l._completed) || null;
}

/* ═══════════════════════════════════════════════
   AVATAR MODAL
   ═══════════════════════════════════════════════ */

function AvatarModal({ open, current, onSave, onClose, isTR }) {
  const [sel, setSel] = useState(current);
  useEffect(() => { if (open) setSel(current); }, [open, current]);
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div className={styles.modalCard} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.modalTitle}>
          {isTR ? "Sembolünü Seç" : "Choose Your Symbol"}
        </div>
        <div className={styles.modalSub}>
          {isTR ? "Bu sembol senin dijital kimliğin olacak." : "This symbol will become your digital identity."}
        </div>
        <div className={styles.avatarGrid}>
          {AVATARS.map((a) => (
            <button
              key={a.id}
              className={`${styles.avatarOption} ${sel === a.id ? styles.avatarOptionActive : ""}`}
              onClick={() => setSel(a.id)}
            >
              <span className={styles.avatarOptionSymbol}>{a.symbol}</span>
              <span className={styles.avatarOptionName}>{isTR ? a.tr : a.en}</span>
            </button>
          ))}
        </div>
        <div className={styles.modalActions}>
          <button className={styles.modalSave} onClick={() => onSave(sel)}>
            {isTR ? "Kaydet" : "Save"}
          </button>
          <button className={styles.modalCancel} onClick={onClose}>
            {isTR ? "İptal" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SANRI VISION BLOCK
   ═══════════════════════════════════════════════ */

function SanriVision({ isTR }) {
  const vision = useMemo(() => getDailyVision(isTR), [isTR]);
  return (
    <div className={styles.visionBlock}>
      <div className={styles.visionGlow} />
      <div className={styles.visionLabel}>
        {isTR ? "SANRI BUGÜN SENİ BÖYLE GÖRÜYOR" : "SANRI SEES YOU TODAY AS"}
      </div>
      <div className={styles.visionText}>"{vision}"</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STREAK BAR
   ═══════════════════════════════════════════════ */

function StreakMilestoneBar({ streak, isTR }) {
  const msg = getStreakMessage(streak, isTR);
  const MILESTONES = [3, 7, 21];

  return (
    <>
    <div className={styles.streakBar}>
      <div className={styles.streakFlame}>{streak > 0 ? "🔥" : "💫"}</div>
      <div className={styles.streakInfo}>
        <div className={styles.streakCount}>
          {streak} {isTR ? "gün" : "day"}{streak !== 1 && !isTR ? "s" : ""}
        </div>
        {msg && <div className={styles.streakMsg}>{msg}</div>}
      </div>
      <div className={styles.streakMilestones}>
        {MILESTONES.map((m) => (
          <div
            key={m}
            className={`${styles.milestone} ${streak >= m ? styles.milestoneReached : ""}`}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
    <p className={styles.streakHint}>
      {isTR
        ? "Streak, her İstanbul günü Bu alanı açtığında güncellenir (canlı veri, sunucudan)."
        : "Streak updates each Istanbul calendar day you open My Space (live from server)."}
    </p>
    </>
  );
}

/* ═══════════════════════════════════════════════
   SOFT PREMIUM CTA
   ═══════════════════════════════════════════════ */

function SoftPremiumCta({ isTR, navigate }) {
  return (
    <div className={styles.softCta} onClick={() => navigate("/subscription")}>
      <div className={styles.softCtaText}>
        {isTR
          ? "Bazı kapılar sadece hazır olanlara açılır."
          : "Some doors only open for those who are ready."}
      </div>
      <span className={styles.softCtaBtn}>
        {isTR ? "✦ Premium'a Geç" : "✦ Go Premium"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   IDENTITY CARD
   ═══════════════════════════════════════════════ */

function IdentityCard({ user, isPremium, profile, avatarId, onAvatarClick, isTR }) {
  const av = AVATARS.find((a) => a.id === avatarId) || AVATARS[4];
  const streak = profile?.streak?.current || 0;
  const doorsOpened = getKodProgress().done;

  return (
    <div className={styles.identityCard}>
      <div className={styles.identityGlow} />
      <div className={styles.identityTop}>
        <div className={styles.avatarWrap} onClick={onAvatarClick}>
          <div className={styles.avatar}>{av.symbol}</div>
          <div className={styles.avatarEdit}>✎</div>
        </div>
        <div className={styles.identityInfo}>
          <h2 className={styles.userName}>
            {profile?.display_name || user?.name || user?.email?.split("@")[0] || (isTR ? "Yolcu" : "Traveler")}
          </h2>
          <p className={styles.userBio}>
            {profile?.bio || (isTR ? "Henüz bir bio yazmadın…" : "No bio yet…")}
          </p>
          <span className={`${styles.premiumBadge} ${isPremium ? styles.premiumActive : styles.premiumFree}`}>
            {isPremium
              ? (isTR ? "✦ Premium Aktif" : "✦ Premium Active")
              : (isTR ? "◇ Ücretsiz Plan" : "◇ Free Plan")}
          </span>
        </div>
      </div>
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{streak}</div>
          <div className={styles.statLabel}>{isTR ? "Streak" : "Streak"}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{doorsOpened}</div>
          <div className={styles.statLabel}>{isTR ? "Kapılar" : "Doors"}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{profile?.stats?.total_posts || 0}</div>
          <div className={styles.statLabel}>{isTR ? "Yankılar" : "Echoes"}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{profile?.stats?.total_reactions_received || 0}</div>
          <div className={styles.statLabel}>{isTR ? "Yansımalar" : "Reflections"}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KOD HARİTAM
   ═══════════════════════════════════════════════ */

function KodHaritam({ avatarId, kodProgress, isTR }) {
  const av = AVATARS.find((a) => a.id === avatarId) || AVATARS[4];
  const { lastCompleted, nextLesson, percent, done } = kodProgress;
  const recurring = getRecurringTheme(isTR);
  const avoided = getAvoidedTheme(isTR);

  const todayDoor = useMemo(() => {
    const all = loadJSON(DAILY_KEY, {});
    const td = all[todayKey()];
    return td?.saved ? (td.emotion || null) : null;
  }, []);

  const sanriNote = percent === 0
    ? (isTR ? "Henüz yolculuk başlamadı. İlk adımı at." : "The journey hasn't started yet. Take the first step.")
    : percent < 30
      ? (isTR ? "Tohumlar ekildi. Ama kökler daha derine inecek." : "Seeds are planted. But roots will go deeper.")
      : percent < 70
        ? (isTR ? "Kod çözülmeye başladı. Artık geri dönüş yok." : "The code is being deciphered. No turning back.")
        : (isTR ? "Sistem okuması başladı. Artık sen bir gözlemcisin." : "System reading has begun. You are now an observer.");

  const todayEmoji = todayDoor ? (EMOTIONS.find((e) => e.id === todayDoor)?.symbol || "✦") : null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🗺️</span>
          {isTR ? "Benim Kod Haritam" : "My Code Map"}
        </div>
      </div>
      <div className={styles.glass}>
        <div className={styles.haritaGrid}>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>{av.symbol}</div>
            <div className={styles.haritaLabel}>{isTR ? "BASKIN ELEMENT" : "DOMINANT ELEMENT"}</div>
            <div className={styles.haritaValue}>{isTR ? av.tr : av.en}</div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>{todayEmoji || "🔒"}</div>
            <div className={styles.haritaLabel}>{isTR ? "BUGÜN AÇILAN KAPI" : "TODAY'S DOOR"}</div>
            <div className={styles.haritaValue}>
              {todayDoor
                ? (isTR ? EMOTIONS.find((e) => e.id === todayDoor)?.tr : EMOTIONS.find((e) => e.id === todayDoor)?.en) || todayDoor
                : (isTR ? "Henüz açılmadı" : "Not opened yet")}
            </div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🔁</div>
            <div className={styles.haritaLabel}>{isTR ? "TEKRARLAYAN TEMA" : "RECURRING THEME"}</div>
            <div className={styles.haritaValue}>{recurring}</div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🚫</div>
            <div className={styles.haritaLabel}>{isTR ? "KAÇINILAN TEMA" : "AVOIDED THEME"}</div>
            <div className={styles.haritaValue}>{avoided}</div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🚪</div>
            <div className={styles.haritaLabel}>{isTR ? "SON AÇILAN KAPI" : "LAST OPENED DOOR"}</div>
            <div className={styles.haritaValue}>
              {lastCompleted ? lastCompleted.title : (isTR ? "Henüz yok" : "None yet")}
            </div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🧩</div>
            <div className={styles.haritaLabel}>{isTR ? "ÇÖZÜLMEYEN DÜĞÜM" : "UNSOLVED KNOT"}</div>
            <div className={styles.haritaValue}>
              {nextLesson ? nextLesson.title : (isTR ? "Tamamlandı" : "Completed")}
            </div>
          </div>
          <div className={`${styles.haritaCard} ${styles.haritaFull}`}>
            <div className={styles.haritaLabel}>{isTR ? "SANRI NOTU" : "SANRI NOTE"}</div>
            <div className={styles.haritaValue} style={{ fontStyle: "italic", color: "rgba(200,160,255,.8)" }}>
              "{sanriNote}"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   KOD OKUMA SİSTEMİ — özet panel
   ═══════════════════════════════════════════════ */

function KodOkumaPanel({ kodProgress, isTR, navigate }) {
  const { done, total, percent, activeModule, nextLesson } = kodProgress;
  const lastSanri = useMemo(() => {
    try {
      const raw = localStorage.getItem("sanri_kod_last_yorum");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const lessonPath =
    nextLesson?.moduleId &&
    `/kod-egitmeni?v=lesson&m=${encodeURIComponent(nextLesson.moduleId)}&l=${encodeURIComponent(nextLesson.id)}`;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>◈</span>
          {isTR ? "SANRI Kod Okuma Sistemi™" : "SANRI Code Reading System™"}
        </div>
        <button type="button" className={styles.sectionAction} onClick={() => navigate("/kod-egitmeni?v=modules")}>
          {isTR ? "Panele git →" : "Open panel →"}
        </button>
      </div>
      <div className={styles.glass}>
        <div className={styles.kodPanelGrid}>
          <div className={styles.kodPanelCard}>
            <div className={styles.kodPanelLabel}>{isTR ? "Aktif modül" : "Active module"}</div>
            <div className={styles.kodPanelValue}>
              {activeModule
                ? activeModule.title.replace(/^MODÜL \d+ — /, "")
                : isTR ? "—" : "—"}
            </div>
          </div>
          <div className={styles.kodPanelCard}>
            <div className={styles.kodPanelLabel}>{isTR ? "Tamamlanan" : "Completed"}</div>
            <div className={styles.kodPanelValue}>{total ? `${done} / ${total}` : "0 / 21"}</div>
            <div className={styles.kodPanelBar}>
              <div className={styles.kodPanelFill} style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className={styles.kodPanelCard}>
            <div className={styles.kodPanelLabel}>{isTR ? "Bugünkü ders" : "Today's lesson"}</div>
            <div className={styles.kodPanelValueSmall}>{nextLesson?.title || (isTR ? "Hepsi tamam" : "All done")}</div>
            {lessonPath && (
              <button type="button" className={styles.kodPanelLink} onClick={() => navigate(lessonPath)}>
                {isTR ? "Derse gir →" : "Open lesson →"}
              </button>
            )}
          </div>
          <div className={`${styles.kodPanelCard} ${styles.kodPanelWide}`}>
            <div className={styles.kodPanelLabel}>{isTR ? "Son SANRI yorumu" : "Latest SANRI reading"}</div>
            <div className={styles.kodPanelSanri}>
              {lastSanri?.text
                ? String(lastSanri.text).slice(0, 220) + (String(lastSanri.text).length > 220 ? "…" : "")
                : isTR ? "Henüz yorum yok — ilk yazını bırak." : "No reading yet — leave your first note."}
            </div>
          </div>
          <div className={styles.kodPanelCard}>
            <div className={styles.kodPanelLabel}>{isTR ? "Açılan kapılar" : "Doors opened"}</div>
            <div className={styles.kodPanelValue}>{done}</div>
          </div>
          <div className={`${styles.kodPanelCard} ${styles.kodPanelWide}`}>
            <div className={styles.kodPanelLabel}>{isTR ? "Rozet izleri" : "Badge trail"}</div>
            <div className={styles.kodPanelBadges}>
              {["İlk Kapı", "Kod Taşıyıcısı", "Frekans Bekçisi", "Derin Okuyucu", "Hatırlayan"].map((label) => (
                <span key={label} className={styles.kodPanelBadge}>{label}</span>
              ))}
            </div>
            <p className={styles.kodPanelHint}>{isTR ? "Rozetler aşağıda otomatik açılır." : "Badges unlock below as you progress."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GÜNLÜK FREKANS
   ═══════════════════════════════════════════════ */

function GunlukFrekans({ isTR }) {
  const today = todayKey();
  const [data, setData] = useState(() => {
    const all = loadJSON(DAILY_KEY, {});
    return all[today] || { emotion: null, intention: "", saved: false, reflection: null };
  });
  const [loading, setLoading] = useState(false);
  const question = useMemo(getDailyQuestion, []);

  const update = (patch) => {
    setData((prev) => {
      const next = { ...prev, ...patch };
      const all = loadJSON(DAILY_KEY, {});
      all[today] = next;
      saveJSON(DAILY_KEY, all);
      return next;
    });
  };

  const handleSave = async () => {
    if (!data.emotion) return;
    update({ saved: true });
    setLoading(true);
    try {
      const token = localStorage.getItem("sanri_token");
      const prompt = `Bugünkü frekansım: ${data.emotion}. Niyetim: ${data.intention || "-"}. ${isTR ? question.tr : question.en}: ${data.intention || "belirtilmedi"}`;
      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: prompt }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.response || json.answer) {
        update({ reflection: json.response || json.answer });
      }
    } catch { /* noop */ }
    setLoading(false);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📡</span>
          {isTR ? "Günlük Frekans" : "Daily Frequency"}
        </div>
      </div>
      <div className={styles.glass}>
        <div className={styles.dailyQuestion}>{isTR ? question.tr : question.en}</div>

        <div className={styles.emotionGrid}>
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              className={`${styles.emotionBtn} ${data.emotion === e.id ? styles.emotionActive : ""}`}
              onClick={() => !data.saved && update({ emotion: e.id })}
            >
              <span className={styles.emotionSymbol}>{e.symbol}</span>
              {isTR ? e.tr : e.en}
            </button>
          ))}
        </div>

        <textarea
          className={styles.dailyInput}
          placeholder={isTR ? "Mini niyetini yaz…" : "Write your mini intention…"}
          value={data.intention}
          onChange={(e) => !data.saved && update({ intention: e.target.value })}
          rows={2}
          disabled={data.saved}
        />

        {!data.saved ? (
          <button
            className={styles.dailySaveBtn}
            onClick={handleSave}
            disabled={!data.emotion || loading}
          >
            {loading
              ? (isTR ? "SANRI düşünüyor…" : "SANRI thinking…")
              : (isTR ? "Kaydet & SANRI Yansıtsın" : "Save & Get SANRI Reflection")}
          </button>
        ) : (
          <div style={{ fontSize: 12, color: "rgba(124,247,216,.6)", textAlign: "center", marginTop: 4 }}>
            ✓ {isTR ? "Bugünkü frekansın kaydedildi" : "Today's frequency saved"}
          </div>
        )}

        {data.reflection && (
          <div className={styles.sanriReflection}>
            <div className={styles.sanriReflectionLabel}>SANRI</div>
            {data.reflection}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ÖĞRENDİKLERİM
   ═══════════════════════════════════════════════ */

function Ogrendiklerim({ kodProgress, isTR, navigate }) {
  const { done, total, percent, activeModule, nextLesson } = kodProgress;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📚</span>
          {isTR ? "Öğrendiklerim" : "My Learnings"}
        </div>
        <button className={styles.sectionAction} onClick={() => navigate("/kod-egitmeni?v=modules")}>
          {isTR ? "Tümünü Gör →" : "See All →"}
        </button>
      </div>
      <div className={styles.glass}>
        {total === 0 ? (
          <div className={styles.empty}>
            {isTR
              ? "İlk kapın açıldığında haritanın görünmeye başlayacak."
              : "When your first door opens, the map will start to appear."}
          </div>
        ) : (
          <>
            <div className={styles.lessonMeta}>
              <div className={styles.lessonPercent}>%{percent}</div>
              <div className={styles.lessonLabel}>{done} / {total} {isTR ? "ders" : "lessons"}</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
            {activeModule && (
              <div className={styles.activeModule}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginBottom: 4 }}>
                    {isTR ? "Aktif Modül" : "Active Module"}
                  </div>
                  <div className={styles.activeModuleName}>{activeModule.title}</div>
                </div>
                <button
                  className={styles.continueBtn}
                  onClick={() =>
                    navigate(
                      nextLesson?.moduleId
                        ? `/kod-egitmeni?v=lesson&m=${encodeURIComponent(nextLesson.moduleId)}&l=${encodeURIComponent(nextLesson.id)}`
                        : "/kod-egitmeni?v=modules"
                    )}
                >
                  {isTR ? "Devam Et →" : "Continue →"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BENİM DEFTERİM
   ═══════════════════════════════════════════════ */

function Defterim({ isTR, yankiPosts, navigate }) {
  const TABS = [
    { id: "notlar", tr: "Notlarım", en: "My Notes" },
    { id: "kaydet", tr: "Kaydettiklerim", en: "Saved" },
    { id: "sorular", tr: "Sorularım", en: "Questions" },
    { id: "yankilar", tr: "Yankılarım", en: "My Echoes" },
  ];

  const [tab, setTab] = useState("notlar");
  const [notes, setNotes] = useState(() => loadJSON(NOTES_KEY, []));
  const [saved] = useState(() => loadJSON(SAVED_KEY, []));
  const [newNote, setNewNote] = useState("");
  const allLessons = useMemo(() => getAllLessonsFlat(), []);

  const addNote = () => {
    if (!newNote.trim()) return;
    const next = [{ id: Date.now(), text: newNote.trim(), date: new Date().toISOString() }, ...notes];
    setNotes(next);
    saveJSON(NOTES_KEY, next);
    setNewNote("");
  };

  const deleteNote = (id) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    saveJSON(NOTES_KEY, next);
  };

  const questions = notes.filter((n) => n.text.includes("?"));
  const regularNotes = notes.filter((n) => !n.text.includes("?"));

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📓</span>
          {isTR ? "Benim Defterim" : "My Notebook"}
        </div>
      </div>
      <div className={styles.glass}>
        <div className={styles.tabBar}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              {isTR ? t.tr : t.en}
            </button>
          ))}
        </div>

        {tab === "notlar" && (
          <>
            {notes.length > 0 && (
              <div className={styles.learningHint}>
                <span className={styles.learningDot} />
                {isTR
                  ? `SANRI ${notes.length} notunu okudu. Yazdıkça seni daha iyi anlıyor.`
                  : `SANRI read your ${notes.length} note${notes.length > 1 ? "s" : ""}. The more you write, the better it understands you.`}
              </div>
            )}
            <textarea
              className={styles.noteInput}
              placeholder={isTR ? "Bir not, bir farkındalık, bir düşünce bırak…" : "Leave a note, an awareness, a thought…"}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className={styles.saveRow}>
              <button className={styles.miniBtn} onClick={addNote} disabled={!newNote.trim()}>
                {isTR ? "Kaydet" : "Save"}
              </button>
            </div>
            {regularNotes.length === 0 ? (
              <div className={styles.empty}>
                {isTR ? "Bu odada henüz ilk not bırakılmadı." : "No notes have been left in this room yet."}
              </div>
            ) : (
              <div className={styles.notesList}>
                {regularNotes.map((n) => {
                  const suggested = suggestLesson(n.text, allLessons);
                  return (
                    <div key={n.id} className={styles.noteItem}>
                      <button className={styles.noteDelete} onClick={() => deleteNote(n.id)}>✕</button>
                      <div className={styles.noteText}>{n.text}</div>
                      <div className={styles.noteDate}>{formatDate(n.date)}</div>
                      {suggested && (
                        <div
                          className={styles.suggestion}
                          onClick={() =>
                            navigate(
                              `/kod-egitmeni?v=lesson&m=${encodeURIComponent(suggested.moduleId)}&l=${encodeURIComponent(suggested.id)}`
                            )}
                        >
                          <span className={styles.suggestionIcon}>📖</span>
                          <div className={styles.suggestionBody}>
                            <div className={styles.suggestionLabel}>
                              {isTR ? "İLGİLİ DERS" : "RELATED LESSON"}
                            </div>
                            <div className={styles.suggestionTitle}>{suggested.title}</div>
                          </div>
                          <span className={styles.suggestionArrow}>→</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "kaydet" && (
          saved.length === 0 ? (
            <div className={styles.empty}>
              {isTR ? "Kişisel kütüphanen seni bekliyor." : "Your personal library awaits you."}
            </div>
          ) : (
            <div className={styles.notesList}>
              {saved.map((s, i) => (
                <div key={i} className={styles.noteItem}>
                  <div className={styles.noteText}>{s.title || s.text || s}</div>
                  {s.date && <div className={styles.noteDate}>{formatDate(s.date)}</div>}
                </div>
              ))}
            </div>
          )
        )}

        {tab === "sorular" && (
          questions.length === 0 ? (
            <div className={styles.empty}>
              {isTR ? "Henüz bir soru sormadın. Sorular kapıları açar." : "You haven't asked a question yet. Questions open doors."}
            </div>
          ) : (
            <div className={styles.notesList}>
              {questions.map((n) => (
                <div key={n.id} className={styles.noteItem}>
                  <button className={styles.noteDelete} onClick={() => deleteNote(n.id)}>✕</button>
                  <div className={styles.noteText}>{n.text}</div>
                  <div className={styles.noteDate}>{formatDate(n.date)}</div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === "yankilar" && (
          yankiPosts.length === 0 ? (
            <div className={styles.empty}>
              {isTR ? "İlk yankın burada görünecek. Sesini bırak." : "Your first echo will appear here. Leave your voice."}
            </div>
          ) : (
            <>
              {yankiPosts.length >= 3 && (
                <div className={styles.learningHint}>
                  <span className={styles.learningDot} />
                  {isTR
                    ? "SANRI yankılarını analiz ediyor. Tekrar eden frekanslara dikkat ediyor."
                    : "SANRI is analyzing your echoes. It notices recurring frequencies."}
                </div>
              )}
              <div className={styles.notesList}>
                {yankiPosts.map((p) => {
                  const suggested = suggestLesson(p.content, allLessons);
                  return (
                    <div key={p.id}>
                      <div className={styles.yankiItem} onClick={() => navigate(`/yanki-alani/${p.id}`)}>
                        <div className={styles.yankiContent}>{p.content}</div>
                        <div className={styles.yankiMeta}>
                          <span>{p.category || "genel"}</span>
                          <span>♡ {p.reaction_count || 0}</span>
                          <span>💬 {p.comment_count || 0}</span>
                        </div>
                      </div>
                      {suggested && (
                        <div
                          className={styles.suggestion}
                          onClick={() =>
                            navigate(
                              `/kod-egitmeni?v=lesson&m=${encodeURIComponent(suggested.moduleId)}&l=${encodeURIComponent(suggested.id)}`
                            )}
                        >
                          <span className={styles.suggestionIcon}>📖</span>
                          <div className={styles.suggestionBody}>
                            <div className={styles.suggestionLabel}>
                              {isTR ? "BU YANKIYA UYGUN DERS" : "LESSON FOR THIS ECHO"}
                            </div>
                            <div className={styles.suggestionTitle}>{suggested.title}</div>
                          </div>
                          <span className={styles.suggestionArrow}>→</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SATIN ALINAN AÇILIMLAR
   ═══════════════════════════════════════════════ */

function SatinAlinanAcilimlar({ isTR, navigate, accessRevision }) {
  const unlockedItems = useMemo(() => {
    const raw = getUnlockedItems();
    return [...raw].sort((a, b) => {
      const ta = a.at ? new Date(a.at).getTime() : 0;
      const tb = b.at ? new Date(b.at).getTime() : 0;
      return tb - ta;
    });
  }, [accessRevision]);
  const allKatmanlar = useMemo(() => getAllKatmanlar(), []);

  const CONTENT_MAP = {
    role_unlock: {
      label: "Matrix Rol Okuma",
      icon: "◈",
      desc: isTR
        ? "Adın ve doğum tarihin birleşti. Rolün açıldı."
        : "Your name and birth date merged. Your role is revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Tekrar Oku" : "Re-read",
    },
    ankod_unlock: {
      label: "AN_KOD — Derin Okuma",
      icon: "✦",
      desc: isTR
        ? "Bilinçaltın konuştu. Derin okuman açıldı."
        : "Your subconscious spoke. Deep reading unlocked.",
      path: "/an-kod",
      btnText: isTR ? "Tekrar Bak" : "Look Again",
    },
    subconscious_unlock: {
      label: "Bilinçaltı Yansıtma",
      icon: "◎",
      desc: isTR
        ? "Seçimlerin bir desen oluşturdu. Ayna açıldı."
        : "Your choices formed a pattern. The mirror is open.",
      path: "/an-kod",
      btnText: isTR ? "Tekrar Bak" : "Look Again",
    },
    iliski_acilimi: {
      label: isTR ? "İlişki Açılımı" : "Relationship Expansion",
      icon: "◈",
      desc: isTR
        ? "İlişkilerindeki tekrar eden kalıp açıldı."
        : "The repeating pattern in your relationships is revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Hatırla" : "Remember",
    },
    para_akisi: {
      label: isTR ? "Para Akışı Açılımı" : "Money Flow Expansion",
      icon: "✦",
      desc: isTR
        ? "Bolluk blokajın ve enerji akışın açıldı."
        : "Your abundance blockage and energy flow are revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Hatırla" : "Remember",
    },
    kariyer_acilimi: {
      label: isTR ? "Kariyer Açılımı" : "Career Expansion",
      icon: "⟁",
      desc: isTR
        ? "Gerçek yön enerjin ve sıkışma döngün açıldı."
        : "Your true direction energy and stagnation cycle revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Hatırla" : "Remember",
    },
    haftalik_akis: {
      label: isTR ? "Haftalık Akış" : "Weekly Flow",
      icon: "☽",
      desc: isTR
        ? "Bu haftanın kodu ve SANRI mesajın açıldı."
        : "This week's code and SANRI message revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Oku" : "Read",
    },
    saglik_enerji: {
      label: isTR ? "Sağlık & Enerji Katmanı" : "Health & Energy Layer",
      icon: "∞",
      desc: isTR
        ? "Bedensel enerji haritanın ve tıkanma noktaların açıldı."
        : "Your body energy map and blockage points revealed.",
      path: "/rol-okuma",
      btnText: isTR ? "Hatırla" : "Remember",
    },
    premium: {
      label: "Premium Erişim",
      icon: "⭐",
      desc: isTR ? "Tüm katmanlara erişim açık." : "Access to all layers is open.",
      path: "/",
      btnText: isTR ? "Keşfet" : "Explore",
    },
    kod_giris_ders: {
      label: isTR ? "Kod Öğrenmeye Giriş — İlk Kapı (47 TL)" : "Code Intro — First Door (47 TRY)",
      icon: "🚪",
      desc: isTR
        ? "Modül 1 (ders 3–7) açık. Kod eğitmeni müfredatına buradan devam et."
        : "Module 1 (lessons 3–7) unlocked. Continue the code curriculum here.",
      path: "/kod-egitmeni?v=modules",
      btnText: isTR ? "Kod eğitmenine git" : "Open code trainer",
    },
    kod_egitmeni: {
      label: isTR ? "SANRI Kod Okuma Sistemi™ — Tam erişim" : "SANRI Code Reading System™ — full access",
      icon: "◈",
      desc: isTR
        ? "21 ders ve tüm modüller açık. İlerlemeni buradan sürdür."
        : "All 21 lessons and modules unlocked. Continue your progress here.",
      path: "/kod-egitmeni?v=modules",
      btnText: isTR ? "Müfredata git" : "Open curriculum",
    },
  };

  const availableKatmanlar = allKatmanlar.filter(
    (k) => !isShopierUnlocked(k.contentId) && !unlockedItems.find((u) => u.id === k.contentId)
  );

  if (unlockedItems.length === 0 && availableKatmanlar.length === 0) return null;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>✦</span>
          {isTR ? "Satın aldıklarım" : "My purchases"}
        </div>
      </div>
      <p className={styles.sectionKicker}>
        {isTR
          ? "Shopier ve havale ile açılan tüm içerikler burada listelenir; sayfayı yenilesen de sunucudan yenilenir."
          : "Everything unlocked via Shopier or bank transfer is listed here and refreshed from the server when you reload."}
      </p>
      <div className={styles.glass}>
        {unlockedItems.length > 0 ? (
          <>
            <div className={styles.acilimCount}>
              {unlockedItems.length} {isTR ? "katman açıldı" : "layer(s) unlocked"}
            </div>
            <div className={styles.acilimList}>
              {unlockedItems.map((item) => {
                const meta = CONTENT_MAP[item.id] || {
                  label: item.label,
                  icon: "✦",
                  desc: "",
                  path: "/",
                  btnText: isTR ? "Git" : "Go",
                };
                return (
                  <div key={item.id} className={styles.acilimCard}>
                    <div className={styles.acilimCardIcon}>{meta.icon}</div>
                    <div className={styles.acilimCardBody}>
                      <div className={styles.acilimCardTitle}>{meta.label}</div>
                      {meta.desc && (
                        <div className={styles.acilimCardDesc}>{meta.desc}</div>
                      )}
                      {item.at && (
                        <div className={styles.acilimCardDate}>
                          {formatDate(item.at)}
                        </div>
                      )}
                    </div>
                    <button
                      className={styles.acilimCardBtn}
                      onClick={() => navigate(meta.path)}
                    >
                      {meta.btnText}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className={styles.acilimEmpty}>
            <div className={styles.acilimEmptyIcon}>◎</div>
            <p className={styles.acilimEmptyText}>
              {isTR
                ? "Henüz bir açılımın yok. İlk katmanını aç."
                : "No expansions yet. Open your first layer."}
            </p>
          </div>
        )}

        {availableKatmanlar.length > 0 && (
          <div className={styles.acilimSuggest}>
            <div className={styles.acilimSuggestLabel}>
              {isTR ? "Açılabilecek katmanlar" : "Available layers"}
            </div>
            {availableKatmanlar.slice(0, 3).map((k) => (
              <div key={k.id} className={styles.acilimSuggestItem}>
                <span className={styles.acilimSuggestIcon}>{k.icon}</span>
                <div className={styles.acilimSuggestBody}>
                  <div className={styles.acilimSuggestQ}>{k.question}</div>
                  <div className={styles.acilimSuggestTeaser}>{k.teaser}</div>
                </div>
                <button
                  className={styles.acilimSuggestBtn}
                  onClick={() => navigate("/rol-okuma")}
                >
                  {isTR ? "Aç" : "Open"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROZETLER
   ═══════════════════════════════════════════════ */

function Rozetler({ badgeData, isTR }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🏅</span>
          {isTR ? "Rozetler / Açılan Kapılar" : "Badges / Unlocked Doors"}
        </div>
      </div>
      <div className={styles.glass}>
        <div className={styles.badgeGrid}>
          {BADGES.map((b) => {
            const earned = badgeData[b.id];
            return (
              <div
                key={b.id}
                className={`${styles.badge} ${earned ? styles.badgeEarned : styles.badgeLocked} ${earned ? styles.badgeGold : ""}`}
              >
                <span className={styles.badgeIcon}>{b.icon}</span>
                <span className={styles.badgeName}>{isTR ? b.tr : b.en}</span>
                <span className={styles.badgeDesc}>{isTR ? b.descTr : b.descEn}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function BenimAlanimPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isPremium } = usePremium();
  const isTR = language === "tr";

  const [avatarId, setAvatarId] = useState(() => {
    try { return localStorage.getItem(AVATAR_KEY) || "ay"; } catch { return "ay"; }
  });
  const [avatarModal, setAvatarModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [yankiPosts, setYankiPosts] = useState([]);
  const [shopierAccessRevision, setShopierAccessRevision] = useState(0);

  const kodProgress = useMemo(getKodProgress, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/giris", { state: { from: "/benim-alanim" }, replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchMyProfile().then(setProfile).catch(() => {});
    fetchMyPosts({ limit: 20 }).then((r) => {
      setYankiPosts(Array.isArray(r) ? r : r?.posts || r?.items || []);
    }).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    (async () => {
      await syncPurchasesFromServer();
      if (!cancelled) setShopierAccessRevision((n) => n + 1);
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleAvatarSave = (id) => {
    setAvatarId(id);
    try { localStorage.setItem(AVATAR_KEY, id); } catch { /* noop */ }
    setAvatarModal(false);
  };

  const badgeData = useMemo(() => {
    const streak = profile?.streak?.current || 0;
    const longestStreak = profile?.streak?.longest || streak;
    return {
      ilk_kapi:
        isShopierUnlocked("kod_giris_ders") ||
        isShopierUnlocked("kod_egitmeni") ||
        isAuthenticated,
      yanki_birakici: yankiPosts.length > 0,
      kod_tasiyici: kodProgress.done > 0,
      hatirlayan: kodProgress.percent >= 100,
      ayna_tutan: (() => {
        try {
          const c = parseInt(localStorage.getItem("sanri_kod_free_sanri_count") || "0", 10);
          return c > 0 || !!localStorage.getItem("sanri_kod_last_yorum");
        } catch { return false; }
      })(),
      frekans_bekcisi: isPremium,
      rituel_yolcusu: false,
      derin_okuyucu: longestStreak >= 7,
      matrix_cozucu: isShopierUnlocked("kod_egitmeni") || isPremium,
      hafiza_tasiyici: longestStreak >= 21,
    };
  }, [isAuthenticated, yankiPosts, kodProgress, isPremium, profile, shopierAccessRevision]);

  if (authLoading) {
    return (
      <div className={styles.page} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>
          {isTR ? "Alanın hazırlanıyor…" : "Preparing your space…"}
        </div>
      </div>
    );
  }

  const streak = profile?.streak?.current || 0;

  return (
    <div className={styles.page}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← {isTR ? "Kapılar" : "Gates"}
        </button>
        <span className={styles.topTitle}>{isTR ? "BENİM ALANIM" : "MY SPACE"}</span>
        <div className={styles.topRight}>
          <button className={styles.settingsBtn} onClick={() => navigate("/profil")} title={isTR ? "Ayarlar" : "Settings"}>
            ⚙
          </button>
        </div>
      </header>

      <IdentityCard
        user={user}
        isPremium={isPremium}
        profile={profile}
        avatarId={avatarId}
        onAvatarClick={() => setAvatarModal(true)}
        isTR={isTR}
      />

      <SanriVision isTR={isTR} />

      <StreakMilestoneBar streak={streak} isTR={isTR} />

      <SatinAlinanAcilimlar
        isTR={isTR}
        navigate={navigate}
        accessRevision={shopierAccessRevision}
      />

      <KodHaritam avatarId={avatarId} kodProgress={kodProgress} isTR={isTR} />

      <KodOkumaPanel kodProgress={kodProgress} isTR={isTR} navigate={navigate} />

      <GunlukFrekans isTR={isTR} />

      <Ogrendiklerim kodProgress={kodProgress} isTR={isTR} navigate={navigate} />

      <Defterim isTR={isTR} yankiPosts={yankiPosts} navigate={navigate} />

      <Rozetler badgeData={badgeData} isTR={isTR} />

      {!isPremium && <SoftPremiumCta isTR={isTR} navigate={navigate} />}

      <AvatarModal
        open={avatarModal}
        current={avatarId}
        onSave={handleAvatarSave}
        onClose={() => setAvatarModal(false)}
        isTR={isTR}
      />
    </div>
  );
}
