import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { usePremium } from "../contexts/PremiumContext";
import { fetchMyProfile, fetchMyPosts } from "../data/yankiApi";
import { KOD_MODULLERI, getAllLessonsFlat } from "../data/kodEgitmeniData";
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

const BADGES = [
  { id: "ilk_kapi", tr: "İlk Kapı", en: "First Door", icon: "🚪", descTr: "Alana adım attın", descEn: "You stepped into the field" },
  { id: "yanki_birakici", tr: "Yankı Bırakıcı", en: "Echo Maker", icon: "🔔", descTr: "İlk yankını bıraktın", descEn: "You left your first echo" },
  { id: "kod_tasiyici", tr: "Kod Taşıyıcısı", en: "Code Bearer", icon: "📜", descTr: "İlk dersi tamamladın", descEn: "You completed your first lesson" },
  { id: "ayna_tutan", tr: "Ayna Tutan", en: "Mirror Holder", icon: "🪞", descTr: "SANRI'ya ilk sorunu sordun", descEn: "You asked SANRI your first question" },
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
        nextLesson = lesson;
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
  const { lastCompleted, nextLesson, percent } = kodProgress;

  const sanriNote = percent === 0
    ? (isTR ? "Henüz yolculuk başlamadı. İlk adımı at." : "The journey hasn't started yet. Take the first step.")
    : percent < 30
      ? (isTR ? "Tohumlar ekildi. Ama kökler daha derine inecek." : "Seeds are planted. But roots will go deeper.")
      : percent < 70
        ? (isTR ? "Kod çözülmeye başladı. Artık geri dönüş yok." : "The code is being deciphered. No turning back.")
        : (isTR ? "Sistem okuması başladı. Artık sen bir gözlemcisin." : "System reading has begun. You are now an observer.");

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🗺️</span>
          {isTR ? "Benim Kod Haritam" : "My Code Map"}
        </div>
      </div>
      <div className={`${styles.glass}`}>
        <div className={styles.haritaGrid}>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>{av.symbol}</div>
            <div className={styles.haritaLabel}>{isTR ? "BASKIN ELEMENT" : "DOMINANT ELEMENT"}</div>
            <div className={styles.haritaValue}>{isTR ? av.tr : av.en}</div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🔁</div>
            <div className={styles.haritaLabel}>{isTR ? "İLERLEME" : "PROGRESS"}</div>
            <div className={styles.haritaValue}>%{percent}</div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🚪</div>
            <div className={styles.haritaLabel}>{isTR ? "SON AÇILAN KAPI" : "LAST OPENED DOOR"}</div>
            <div className={styles.haritaValue}>
              {lastCompleted
                ? lastCompleted.title
                : (isTR ? "Henüz yok" : "None yet")}
            </div>
          </div>
          <div className={styles.haritaCard}>
            <div className={styles.haritaIcon}>🧩</div>
            <div className={styles.haritaLabel}>{isTR ? "BEKLİYOR" : "AWAITING"}</div>
            <div className={styles.haritaValue}>
              {nextLesson
                ? nextLesson.title
                : (isTR ? "Tamamlandı" : "Completed")}
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
        <button className={styles.sectionAction} onClick={() => navigate("/kod-egitmeni")}>
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
                  onClick={() => navigate(nextLesson ? `/kod-egitmeni?lesson=${nextLesson.id}` : "/kod-egitmeni")}
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
                {regularNotes.map((n) => (
                  <div key={n.id} className={styles.noteItem}>
                    <button className={styles.noteDelete} onClick={() => deleteNote(n.id)}>✕</button>
                    <div className={styles.noteText}>{n.text}</div>
                    <div className={styles.noteDate}>{formatDate(n.date)}</div>
                  </div>
                ))}
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
            <div className={styles.notesList}>
              {yankiPosts.map((p) => (
                <div key={p.id} className={styles.yankiItem} onClick={() => navigate(`/yanki-alani/${p.id}`)}>
                  <div className={styles.yankiContent}>{p.content}</div>
                  <div className={styles.yankiMeta}>
                    <span>{p.category || "genel"}</span>
                    <span>♡ {p.reaction_count || 0}</span>
                    <span>💬 {p.comment_count || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )
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

  const handleAvatarSave = (id) => {
    setAvatarId(id);
    try { localStorage.setItem(AVATAR_KEY, id); } catch { /* noop */ }
    setAvatarModal(false);
  };

  const badgeData = useMemo(() => {
    const streak = profile?.streak?.current || 0;
    const longestStreak = profile?.streak?.longest || streak;
    return {
      ilk_kapi: isAuthenticated,
      yanki_birakici: yankiPosts.length > 0,
      kod_tasiyici: kodProgress.done > 0,
      ayna_tutan: !!localStorage.getItem("sanri_kod_read_used"),
      frekans_bekcisi: isPremium,
      rituel_yolcusu: false,
      derin_okuyucu: longestStreak >= 7,
      matrix_cozucu: kodProgress.percent >= 100,
      hafiza_tasiyici: longestStreak >= 21,
    };
  }, [isAuthenticated, yankiPosts, kodProgress, isPremium, profile]);

  if (authLoading) {
    return (
      <div className={styles.page} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>
          {isTR ? "Alanın hazırlanıyor…" : "Preparing your space…"}
        </div>
      </div>
    );
  }

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

      <KodHaritam avatarId={avatarId} kodProgress={kodProgress} isTR={isTR} />

      <GunlukFrekans isTR={isTR} />

      <Ogrendiklerim kodProgress={kodProgress} isTR={isTR} navigate={navigate} />

      <Defterim isTR={isTR} yankiPosts={yankiPosts} navigate={navigate} />

      <Rozetler badgeData={badgeData} isTR={isTR} />

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
