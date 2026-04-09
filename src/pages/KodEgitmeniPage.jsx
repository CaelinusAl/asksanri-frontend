import React, { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./KodEgitmeniPage.module.css";
import {
  KOD_MODULLERI,
  getModuleById,
  getLessonById,
  getAllLessonsFlat,
  getGlobalLessonIndex,
  MODUL_1_ID,
  PRICE_CANLI_GIRIS_DERS,
  PRICE_KOD_TAM_PROGRAM,
  PAYWALL_LIST_STRIKE,
  FREE_PREVIEW_LESSON_COUNT,
  FREE_PREVIEW_SANRI_COUNT,
} from "../data/kodEgitmeniData";
import { useAuth } from "../contexts/AuthContext";
import { redirectToShopier, isShopierProductUnlocked } from "../data/shopierConfig";
import BankTransferLink from "../components/BankTransferLink";
import { trackFunnelEvent } from "../data/funnelTracker";
import {
  KOD_CONTENT_ID_ILK_KAPI,
  KOD_CONTENT_ID_TAM_PROGRAM,
  KOD_PRODUCT_DEBUG_AMOUNT,
  KOD_PRODUCT_DEBUG_LABEL,
} from "../data/kodPaymentContentIds";
import SeoHead from "../components/SeoHead";

function isKodTamShopierUnlocked() {
  return isShopierProductUnlocked(KOD_CONTENT_ID_TAM_PROGRAM);
}

function isIlkKapiUnlocked() {
  return isShopierProductUnlocked(KOD_CONTENT_ID_ILK_KAPI);
}

const API_URL =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

/* ── Progress (localStorage) ── */
const PROGRESS_KEY = "sanri_kod_progress";

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}"); }
  catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); } catch {}
}
function markDone(moduleId, lessonId) {
  const p = loadProgress();
  if (!p[moduleId]) p[moduleId] = [];
  if (!p[moduleId].includes(lessonId)) p[moduleId].push(lessonId);
  saveProgress(p);
  return p;
}
function isDone(moduleId, lessonId) {
  return (loadProgress()[moduleId] || []).includes(lessonId);
}
function modulePercent(moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) return 0;
  const done = (loadProgress()[moduleId] || []).length;
  return Math.round((done / mod.lessons.length) * 100);
}

function globalStats() {
  const total = KOD_MODULLERI.reduce((s, m) => s + m.lessons.length, 0);
  const p = loadProgress();
  const done = KOD_MODULLERI.reduce((s, m) => s + (p[m.id] || []).length, 0);
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

function lessonIndex(moduleId, lessonId) {
  let idx = 0;
  for (const mod of KOD_MODULLERI) {
    for (const les of mod.lessons) {
      idx++;
      if (mod.id === moduleId && les.id === lessonId) return idx;
    }
  }
  return 0;
}

/* ── FOMO: deterministic "today" count ── */
function fomoCount() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return 47 + (seed % 89);
}

/* ── SANRI: ücretsiz ön izlemede toplam FREE_PREVIEW_SANRI_COUNT okuma ── */
const SANRI_FREE_USE_KEY = "sanri_kod_free_sanri_count";
function getSanriFreeUsedCount() {
  try { return parseInt(localStorage.getItem(SANRI_FREE_USE_KEY) || "0", 10) || 0; }
  catch { return 0; }
}
function incrementSanriFreeUsed() {
  try {
    const n = getSanriFreeUsedCount() + 1;
    localStorage.setItem(SANRI_FREE_USE_KEY, String(n));
  } catch {}
}

const SANRI_LAST_KEY = "sanri_kod_last_yorum";
function saveLastSanriUbK(payload, lessonId) {
  try {
    localStorage.setItem(
      SANRI_LAST_KEY,
      JSON.stringify({
        v: 1,
        kind: "ubk",
        payload,
        lessonId,
        at: new Date().toISOString(),
      })
    );
  } catch {}
}

/* ── Single lesson unlock (localStorage-based for now) ── */
const SINGLE_UNLOCK_KEY = "sanri_kod_single_unlock";
function getSingleUnlocks() {
  try { return JSON.parse(localStorage.getItem(SINGLE_UNLOCK_KEY) || "[]"); } catch { return []; }
}
function addSingleUnlock(lessonId) {
  const u = getSingleUnlocks();
  if (!u.includes(lessonId)) { u.push(lessonId); }
  try { localStorage.setItem(SINGLE_UNLOCK_KEY, JSON.stringify(u)); } catch {}
}
function isLessonUnlocked(lessonId) {
  return getSingleUnlocks().includes(lessonId);
}

/**
 * Kod Okuma erişimi — genel SANRI Premium / Shopier `premium` bayrağı burada kullanılmaz.
 * Açılış: ilk FREE_PREVIEW_LESSON_COUNT ders ücretsiz · Modül 1 devamı 47 TL (İlk Kapı) · 21 ders 999 TL.
 */
function canAccessLesson(lesson, mod, adminBypass) {
  if (adminBypass) return true;
  if (lesson.isFree) return true;
  if (isKodTamShopierUnlocked()) return true;
  if (isLessonUnlocked(lesson.id)) return true;
  if (isShopierProductUnlocked(`kod_${lesson.id}`)) return true;
  const g = lesson.globalNo ?? (getGlobalLessonIndex(mod.id, lesson.id) + 1);
  if (isIlkKapiUnlocked() && mod.id === MODUL_1_ID && g >= FREE_PREVIEW_LESSON_COUNT + 1 && g <= 7) {
    return true;
  }
  return false;
}

/* ═══════════════════════════════════════════════════
   LANDING
   ═══════════════════════════════════════════════════ */
function scrollToModules() {
  document.getElementById("kod-modulleri")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToPurchase() {
  document.getElementById("kod-satin")?.scrollIntoView({ behavior: "smooth" });
}

const LANDING_VALUE = [
  {
    icon: "◈",
    title: "Kelimenin altındaki katmanı gör",
    desc: "Cümleyi yüzeyde bırakmazsın. Anlamı parçalarsın; kelimenin seni nereye çektiğini okursun.",
  },
  {
    icon: "☽",
    title: "Sayıların sana ne söylediğini oku",
    desc: "Tarih, tekrar ve ritim — sayıyı kader ilanı etmeden, dikkatinin nereye kilitlendiğini görürsün.",
  },
  {
    icon: "◇",
    title: "Olayların tekrar eden yapısını fark et",
    desc: "Aynı senaryo farklı yüzlerle geldiğinde artık ‘şanssızlık’ demezsin; döngünün kuralını yazarsın.",
  },
  {
    icon: "✦",
    title: "İç sesinle sana ait olmayanı ayır",
    desc: "Hangi düşünce seni büyütüyor, hangisi taşınıyor? Kod okuma burada pratiğe döner.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Bu eğitim yazılım kursu mu?",
    a: "Hayır. SANRI Kod Okuma Sistemi™, kelime, sayı, sembol ve olayları ‘kod’ gibi okumayı öğreten uygulamalı bir okuma pratiğidir. Programlama veya teknik araç gerektirmez.",
  },
  {
    q: "Hiç bilmeyen biri için uygun mu?",
    a: "Evet. Dersler kısa tutulur, adım adım ilerler. Tek ihtiyacın dürüstçe yazabilmek ve okuduklarını kendi hayatınla ilişkilendirmek.",
  },
  {
    q: "SANRI nasıl dahil oluyor?",
    a: "Her dersin sonunda kendi çözümünü yazarsın; SANRI bunu bilinç ve sembol katmanlarından yorumlar. Pasif dinleyici değil, aktif çözücü olursun.",
  },
  {
    q: "Tüm dersler açık mı?",
    a: `Hayır. İlk ${FREE_PREVIEW_LESSON_COUNT} ders herkese açık ön izlemedir. Modül 1’in kalan beş dersi (3–7) İlk Kapı ürünü (${PRICE_CANLI_GIRIS_DERS} TL) ile açılır. Modül 2 ve 3 ile tüm 21 ders yalnızca tam sistem (${PRICE_KOD_TAM_PROGRAM} TL) ile açılır. Genel SANRI aboneliği veya başka Shopier ürünleri bu müfredatı otomatik açmaz.`,
  },
  {
    q: `${PRICE_KOD_TAM_PROGRAM} TL ile neye erişiyorum?`,
    a: "21 dersin tamamına, her dersteki uygulama alanına, SANRI yorum desteğine ve ilerleme kaydına. Tek seferlik ödeme ile bu programa erişim (Shopier ürün koşulları geçerlidir).",
  },
];

function Landing({ onFirstLesson, onOpenModules, onUnlockFull }) {
  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <motion.div
          className={styles.heroOrb}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.p className={styles.heroKicker} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.06 }}>
          SANRI Kod Okuma Sistemi™
        </motion.p>
        <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
          Kod yazmayı değil,
          <br />
          <span className={styles.heroTitleAccent}>kod görmeyi</span> öğren.
        </motion.h1>
        <motion.p className={styles.heroSub} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          Kelime, sayı, sembol ve tekrar eden döngülerin altındaki katmanı oku. Klasik eğitim formatında değil; içine girilen, uygulamalı bir alanda.
        </motion.p>
        <motion.div className={styles.heroPriceBand} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}>
          <span className={styles.heroPriceStrike}>{PAYWALL_LIST_STRIKE} TL</span>
          <span className={styles.heroPriceMain}>{PRICE_KOD_TAM_PROGRAM} TL</span>
          <span className={styles.heroPriceNote}>tam sistem · tek ödeme</span>
        </motion.div>
        <motion.div className={styles.heroCtaRow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}>
          <button type="button" className={styles.heroCta} onClick={onUnlockFull}>
            Sistemi Aç
          </button>
          <button type="button" className={styles.heroCtaGhost} onClick={onFirstLesson}>
            İlk Dersi Gör
          </button>
        </motion.div>
        <motion.p className={styles.heroTrust} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}>
          21 derslik sistem · uygulamalı · SANRI destekli
        </motion.p>
        <motion.p className={styles.heroFomo} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58 }}>
          <button type="button" className={styles.heroLinkBtn} onClick={onOpenModules || scrollToModules}>
            Müfredatı incele →
          </button>
          {" · "}
          İlk {FREE_PREVIEW_LESSON_COUNT} ders ücretsiz
        </motion.p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bu sistem ne öğretir, sen ne kazanırsın?</h2>
        <p className={styles.landingLead}>
          Kod okumak, dünyayı değiştirmez; <strong>okuyanın dünyayla ilişkisini</strong> değiştirir. Kazanımın özeti: daha az otomatik tepki, daha net iç ses, tekrar eden olaylara isim koyabilme.
        </p>
        <div className={styles.valueGrid}>
          {LANDING_VALUE.map((f) => (
            <div key={f.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{f.icon}</span>
              <h3 className={styles.valueTitle}>{f.title}</h3>
              <p className={styles.valueDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
        <p className={styles.diffBlock}>
          Sıradan bir video kursu değil. <span className={styles.diffHighlight}>Okuma + uygulama + SANRI geri bildirimi</span> aynı akışta.
        </p>
      </section>

      <section className={styles.landingModPreview} id="kod-modulleri">
        <h2 className={styles.sectionTitle}>Üç modül · yirmi bir ders</h2>
        <p className={styles.landingModLead}>
          <strong>Kodu Görmek</strong>, <strong>İlişki Kodları</strong> ve <strong>Matrix Okuma</strong> — her biri yedi dersten oluşur. Aşağıda gerçek ders başlıkları; içerikler platformda tam metin olarak sunulur.
        </p>
        <div className={styles.landingModGrid}>
          {KOD_MODULLERI.map((mod, mi) => (
            <motion.article
              key={mod.id}
              className={styles.landingModCard}
              style={{ "--mod-color": mod.color }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: mi * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <span className={styles.landingModIcon} style={{ color: mod.color }}>{mod.icon}</span>
              <h3 className={styles.landingModTitle}>{mod.title.replace(/^MODÜL \d+ — /, "")}</h3>
              <p className={styles.landingModAim}>{mod.aim}</p>
              <p className={styles.landingModSub}>{mod.subtitle}</p>
              <ol className={styles.landingModLessonOl}>
                {mod.lessons.map((les) => (
                  <li key={les.id}>
                    <strong>{les.title}</strong>
                    <span className={styles.landingLessonHint}> — {les.shortDescription}</span>
                  </li>
                ))}
              </ol>
            </motion.article>
          ))}
        </div>
      </section>

      <section className={styles.sanriLanding}>
        <div className={styles.sanriLandingInner}>
          <h2 className={styles.sectionTitle}>Bu sistemde yalnız öğrenmezsin. SANRI seninle birlikte okur.</h2>
          <p className={styles.sanriLandingLead}>
            Her dersin sonunda kendi çözümünü yazarsın. SANRI, yazdığını yüzeyde bırakmaz: tekrar eden temayı, sembolik katmanı ve iç sesinle çelişen kısımları net bir dille açar.
          </p>
          <p className={styles.sanriLandingQuote}>
            Sen çözdüğünü sanıyorsun.
            <br />
            <span className={styles.sanriLandingQuoteAccent}>SANRI sana kaçırdığın katmanı gösterir.</span>
          </p>
          <ul className={styles.sanriLandingList}>
            <li>Aktif çözücü olursun; sadece metin tüketmezsin.</li>
            <li>Yorumlar kısa, derin ve kişisel tonda tutulur — sohbet botu hissi vermez.</li>
            <li>İstersen aynı derste yeniden yazıp tekrar yorumlatırsın.</li>
          </ul>
        </div>
      </section>

      <section className={styles.priceSectionPro} id="kod-satin">
        <div className={styles.priceProCard}>
          <p className={styles.priceProTagline}>Bu sistem satın alınmaz.</p>
          <p className={styles.priceProTaglineStrong}>İçine girilir.</p>
          <p className={styles.priceProSub}>
            {PRICE_KOD_TAM_PROGRAM} TL · 21 ders · uygulama alanları · SANRI yorum desteği · ilerleme kaydı · Benim Alanım paneli ile özet
          </p>
          <div className={styles.priceProRow}>
            <span className={styles.priceProStrike}>{PAYWALL_LIST_STRIKE} TL</span>
            <span className={styles.priceProAmount}>{PRICE_KOD_TAM_PROGRAM} TL</span>
          </div>
          <button type="button" className={styles.priceProCta} onClick={onUnlockFull}>
            Sistemi Aç
          </button>
          <p className={styles.priceProFine}>
            Ödeme Shopier üzerinden güvenli tamamlanır. Ön izleme: ilk {FREE_PREVIEW_LESSON_COUNT} ders. İstersen önce{" "}
            <button type="button" className={styles.inlineLink} onClick={onFirstLesson}>derse gir</button>
            {" "}veya{" "}
            <Link to="/kod-ogrenmeye-giris" className={styles.inlineLinkA}>canlı giriş ({PRICE_CANLI_GIRIS_DERS} TL)</Link>
            {" "}ürününe bak.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bu sistemle ne değişir?</h2>
        <p className={styles.testimonialPlaceholder}>
          Burada ileride gerçek kullanıcı yorumları yer alacak. Şimdilik sadece şunu söyleyelim: bu alan, okumayı içe taşıyanlar için tasarlandı.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sık sorulan sorular</h2>
        <dl className={styles.faqList}>
          {FAQ_ITEMS.map((item) => (
            <div key={item.q} className={styles.faqItem}>
              <dt className={styles.faqQ}>{item.q}</dt>
              <dd className={styles.faqA}>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.closingQuote}>
        <p>Bazı şeyler öğrenilmez.</p>
        <p>Sadece görünür hale gelir.</p>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.finalCtaLine}>Bütün sistemi açmaya hazırsan, kapı burada.</p>
        <button type="button" className={styles.finalCtaBtn} onClick={onUnlockFull}>
          {PRICE_KOD_TAM_PROGRAM} TL — Sistemi Aç
        </button>
        <button type="button" className={styles.finalCtaGhost} onClick={scrollToPurchase}>
          Yukarıdaki pakete dön
        </button>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MODULE LIST — modül kartları + ders kartları
   ═══════════════════════════════════════════════════ */
function ModuleList({ onSelectLesson, adminBypass }) {
  const totalLessons = KOD_MODULLERI.reduce((s, m) => s + m.lessons.length, 0);
  const totalDone = KOD_MODULLERI.reduce(
    (s, m) => s + (loadProgress()[m.id] || []).length,
    0
  );
  const globalPct = totalLessons ? Math.round((totalDone / totalLessons) * 100) : 0;

  const flat = getAllLessonsFlat();
  let continueTarget = null;
  for (const row of flat) {
    const mod = getModuleById(row.moduleId);
    if (!mod) continue;
    if (!isDone(row.moduleId, row.id)) {
      continueTarget = { mod, lesson: row };
      break;
    }
  }

  let activeMod = null;
  if (continueTarget) activeMod = continueTarget.mod;
  else if (flat.length) {
    const last = flat[flat.length - 1];
    activeMod = getModuleById(last.moduleId);
  }

  return (
    <div className={styles.moduleListWrap}>
      <div className={styles.globalProgress}>
        <div className={styles.globalBar}>
          <div className={styles.globalFill} style={{ width: `${globalPct}%` }} />
        </div>
        <div className={styles.globalProgressMeta}>
          <span>
            {totalDone > 0
              ? `${totalDone}/${totalLessons} ders tamamlandı · %${globalPct}`
              : `${totalLessons} ders · yolculuk hazır`}
          </span>
          {activeMod && (
            <span className={styles.activeModulePill} style={{ borderColor: `${activeMod.color}55` }}>
              Aktif modül: <strong style={{ color: activeMod.color }}>{activeMod.title.replace(/^MODÜL \d+ — /, "")}</strong>
            </span>
          )}
        </div>
      </div>

      {continueTarget && (
        <motion.div
          className={styles.continueCard}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <span className={styles.continueLabel}>Kaldığın yerden</span>
            <p className={styles.continueTitle}>
              Ders {continueTarget.lesson.globalNo}: {continueTarget.lesson.title}
            </p>
            <p className={styles.continueSub}>{continueTarget.lesson.shortDescription}</p>
          </div>
          <button
            type="button"
            className={styles.continueBtn}
            style={{ background: continueTarget.mod.color }}
            onClick={() => onSelectLesson(continueTarget.mod.id, continueTarget.lesson.id)}
          >
            Devam et
          </button>
        </motion.div>
      )}

      <div className={styles.moduleHeroGrid}>
        {KOD_MODULLERI.map((mod, mi) => (
          <motion.button
            key={mod.id}
            type="button"
            className={styles.moduleHeroCard}
            style={{ "--mc": mod.color }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.06 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => document.getElementById(`mod-${mod.id}`)?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className={styles.moduleHeroIcon}>{mod.icon}</span>
            <span className={styles.moduleHeroTitle}>{mod.title}</span>
            <span className={styles.moduleHeroSub}>{mod.subtitle}</span>
            <span className={styles.moduleHeroMeta}>7 ders</span>
          </motion.button>
        ))}
      </div>

      {KOD_MODULLERI.map((mod, mi) => {
        const pct = modulePercent(mod.id);
        return (
          <motion.section
            key={mod.id}
            id={`mod-${mod.id}`}
            className={styles.moduleBlock}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mi * 0.05 }}
          >
            <div className={styles.moduleHeader}>
              <span className={styles.modIcon} style={{ color: mod.color }}>{mod.icon}</span>
              <div>
                <h3 className={styles.modTitle}>{mod.title}</h3>
                <p className={styles.modSub}>{mod.subtitle}</p>
              </div>
              {pct > 0 && <span className={styles.modPct}>{pct}%</span>}
            </div>

            <div className={styles.lessonCardGrid}>
              {mod.lessons.map((lesson) => {
                const open = canAccessLesson(lesson, mod, adminBypass);
                const done = isDone(mod.id, lesson.id);
                const status = done ? "done" : open ? "open" : "locked";

                return (
                  <article
                    key={lesson.id}
                    className={`${styles.lessonCard} ${styles[`lessonCard_${status}`]}`}
                  >
                    <div className={styles.lessonCardTop}>
                      <span className={styles.lessonCardNo} style={{ color: mod.color }}>
                        {String(lesson.globalNo).padStart(2, "0")}
                      </span>
                      <span className={styles.lessonCardDur}>{lesson.duration}</span>
                    </div>
                    <h4 className={styles.lessonCardTitle}>{lesson.title}</h4>
                    <p className={styles.lessonCardDesc}>{lesson.shortDescription}</p>
                    <div className={styles.lessonCardFooter}>
                      <span className={styles.lessonCardStatus} data-s={status}>
                        {done ? "Tamamlandı" : open ? "Açık" : "Kilitli"}
                      </span>
                      <button
                        type="button"
                        className={styles.lessonCardBtn}
                        onClick={() => onSelectLesson(mod.id, lesson.id)}
                      >
                        {open ? "Derse Gir" : "Kilidi Aç"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PAYWALL
   ═══════════════════════════════════════════════════ */
function Paywall() {
  const navigate = useNavigate();

  useEffect(() => { trackFunnelEvent("kod_paywall_view"); }, []);

  const openIlkKapi = () => {
    trackFunnelEvent("kod_unlock_click", "ilk_kapi");
    redirectToShopier("kod_giris_ders", KOD_CONTENT_ID_ILK_KAPI, "/kod-egitmeni?v=modules");
  };
  const openTamSistem = () => {
    redirectToShopier("kod_egitmeni", KOD_CONTENT_ID_TAM_PROGRAM, "/kod-egitmeni?v=modules");
  };

  return (
    <motion.div
      className={styles.paywall}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className={styles.paywallGlow} />
      <div className={styles.paywallContent}>
        <p className={styles.paywallLine1}>Buraya kadar gördün.</p>
        <p className={styles.paywallLine2}>Ama artık yüzey bitiyor.</p>
        <p className={styles.paywallLine3}>
          İstersen <strong>derine geçebilirsin</strong>.
          <br />
          <span className={styles.paywallSoft}>Bu bir satış değil — bir eşik.</span>
        </p>
        <p className={styles.paywallTierHint}>
          İlk <strong>{FREE_PREVIEW_LESSON_COUNT} ders</strong> ücretsiz ön izleme.
          {" "}
          <strong>Modül 1</strong> (ders 3–7): <strong>{PRICE_CANLI_GIRIS_DERS} TL</strong> (İlk Kapı).
          {" "}
          <strong>Modül 2–3</strong> ve tüm sistem: <strong>{PRICE_KOD_TAM_PROGRAM} TL</strong>.
          {" "}
          Genel SANRI aboneliği bu dersleri otomatik açmaz.
        </p>

        <div className={styles.dualCta}>
          <p className={styles.paywallPrimaryKicker}>Tam sistem</p>
          <div className={styles.paywallPriceWrap}>
            <div className={styles.paywallPrice}>
              <span className={styles.priceOld}>{PAYWALL_LIST_STRIKE} TL</span>
              <span className={styles.paywallAmount}>{PRICE_KOD_TAM_PROGRAM}</span>
              <span className={styles.paywallPer}>TL · tek ödeme</span>
            </div>
            <p className={styles.paywallProductTitle}>SANRI Kod Okuma Sistemi™ — 21 ders</p>
          </div>
          <button type="button" className={styles.shopierBtn} onClick={openTamSistem}>
            Kartla Anında Öde — Sistemi Aç
          </button>
          <BankTransferLink
            contentId={KOD_CONTENT_ID_TAM_PROGRAM}
            returnTo="/kod-egitmeni?v=modules"
            className={styles.havaleLink}
            debugProduct={KOD_PRODUCT_DEBUG_LABEL[KOD_CONTENT_ID_TAM_PROGRAM]}
            debugAmount={KOD_PRODUCT_DEBUG_AMOUNT[KOD_CONTENT_ID_TAM_PROGRAM]}
          >
            Havale / EFT ile öde
          </BankTransferLink>
          <p className={styles.paywallPrimaryNote}>Bu sistem satın alınmaz. İçine girilir.</p>

          <div className={styles.ctaDividerRow}>
            <span className={styles.ctaDividerLine} />
            <span className={styles.ctaDividerText}>veya</span>
            <span className={styles.ctaDividerLine} />
          </div>

          <button type="button" className={styles.paywallGateBtn} onClick={openIlkKapi}>
            <span className={styles.paywallGateLabel}>Kartla Anında Öde — İlk Kapı</span>
            <span className={styles.paywallGatePrice}>{PRICE_CANLI_GIRIS_DERS} TL</span>
            <span className={styles.paywallGateHint}>Yalnız Modül 1 · ders 3–7 (21 dersin tamamı değil)</span>
          </button>
          <BankTransferLink
            contentId={KOD_CONTENT_ID_ILK_KAPI}
            returnTo="/kod-egitmeni?v=modules"
            className={styles.havaleLinkGate}
            debugProduct={KOD_PRODUCT_DEBUG_LABEL[KOD_CONTENT_ID_ILK_KAPI]}
            debugAmount={KOD_PRODUCT_DEBUG_AMOUNT[KOD_CONTENT_ID_ILK_KAPI]}
          >
            Havale / EFT ile öde (İlk Kapı)
          </BankTransferLink>

          <p className={styles.paywallAltLine}>
            <Link to="/kod-ogrenmeye-giris" className={styles.paywallAltLink}>Önce canlı tanıtımı izle →</Link>
          </p>
          <button
            type="button"
            className={styles.paywallBtn}
            onClick={() => navigate("/subscription")}
          >
            SANRI aboneliği — Kod müfredatı dahil değildir
          </button>
        </div>

        <p className={styles.paywallTrust}>Ödeme sonrası kapı açılır. Kaldığın yerden devam edersin.</p>
        <p className={styles.paywallFomo}>Bugün {fomoCount()} kişi derine indi</p>
      </div>
    </motion.div>
  );
}

/** Üst Bilinç Kodlama — API'den gelen yapılandırılmış yanıt */
function SanriUbkBlocks({ data }) {
  if (!data?.kod_ayrimi) return null;
  const ka = data.kod_ayrimi;
  const parcalar = Array.isArray(data.parca_okumasi) ? data.parca_okumasi : [];
  return (
    <div className={styles.ubkRoot}>
      <section className={styles.ubkBlock} aria-labelledby="ubk-kod">
        <h4 id="ubk-kod" className={styles.ubkBlockTitle}>
          KOD AYRIMI
        </h4>
        <div className={styles.ubkBaslik}>{ka.baslik || "—"}</div>
        {ka.kirilimlar?.length > 0 && (
          <ul className={styles.ubkList}>
            {ka.kirilimlar.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.ubkBlock} aria-labelledby="ubk-parca">
        <h4 id="ubk-parca" className={styles.ubkBlockTitle}>
          PARÇA OKUMASI
        </h4>
        {parcalar.length === 0 ? (
          <p className={styles.ubkMuted}>Parça okuması bu yanıtta boş.</p>
        ) : (
          parcalar.map((p, idx) => (
            <div key={idx} className={styles.ubkParca}>
              {p.parca_adi ? <div className={styles.ubkParcaAd}>{p.parca_adi}</div> : null}
              <ul className={styles.ubkListDense}>
                {(p.okuma_satirlari || []).map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>

      <section className={`${styles.ubkBlock} ${styles.ubkBlockGold}`} aria-labelledby="ubk-ust">
        <h4 id="ubk-ust" className={styles.ubkBlockTitle}>
          ÜST BİLİNÇ KATMANI
        </h4>
        <p className={styles.ubkUst}>{data.ust_bilinç_katmani || "—"}</p>
      </section>

      <section className={`${styles.ubkBlock} ${styles.ubkBlockQuestion}`} aria-labelledby="ubk-soru">
        <h4 id="ubk-soru" className={styles.ubkBlockTitle}>
          SANRI SORUSU
        </h4>
        <p className={styles.ubkSoru}>{data.sanri_sorusu || "—"}</p>
      </section>
    </div>
  );
}

function getLessonNeighbors(moduleId, lessonId) {
  const flat = getAllLessonsFlat();
  const i = flat.findIndex((x) => x.moduleId === moduleId && x.id === lessonId);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  };
}

/* ═══════════════════════════════════════════════════
   LESSON VIEWER — ders okuma + input + SANRI
   ═══════════════════════════════════════════════════ */
function LessonViewer({ mod, lesson, onComplete, onBack, onGoLesson, adminBypass }) {
  const { isAuthenticated, token } = useAuth();
  const [input, setInput] = useState("");
  const [sanriUbK, setSanriUbK] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const done = isDone(mod.id, lesson.id);
  const usedSanri = getSanriFreeUsedCount();
  const freeLeft = Math.max(0, FREE_PREVIEW_SANRI_COUNT - usedSanri);
  const fullKodUnlocked = isKodTamShopierUnlocked();
  const hasLessonAccess = canAccessLesson(lesson, mod, adminBypass);
  const sanriAllowed =
    hasLessonAccess &&
    (adminBypass ||
      fullKodUnlocked ||
      !lesson.isFree ||
      usedSanri < FREE_PREVIEW_SANRI_COUNT);

  const { prev: prevLes, next: nextLes } = getLessonNeighbors(mod.id, lesson.id);
  const prevMod = prevLes ? getModuleById(prevLes.moduleId) : null;
  const nextMod = nextLes ? getModuleById(nextLes.moduleId) : null;
  const nextOpen = nextLes && nextMod ? canAccessLesson(nextLes, nextMod, adminBypass) : false;

  const sendToSanri = useCallback(async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setSanriUbK(null);
    setSent(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/kod-okuma/ust-bilinç`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: input.trim(),
          lesson_title: lesson.title,
          module_title: mod.title.replace(/^MODÜL \d+ — /, "") || mod.title,
        }),
      });

      const raw = await res.json().catch(() => ({}));
      const errMsg = (d) =>
        typeof d === "string"
          ? d
          : Array.isArray(d)
            ? d.map((x) => (typeof x === "string" ? x : x?.msg || "")).filter(Boolean).join(" ")
            : "";

      if (!res.ok) {
        setSanriUbK({
          _error:
            errMsg(raw?.detail) ||
            "Üst bilinç okuması tamamlanamadı. Kısa bir kelime veya isimle tekrar dene.",
          kod_ayrimi: { baslik: "—", kirilimlar: [] },
          parca_okumasi: [],
          ust_bilinç_katmani: "",
          sanri_sorusu: "",
        });
      } else if (raw?.ok && raw?.data) {
        setSanriUbK(raw.data);
        if (lesson.isFree && !fullKodUnlocked && !adminBypass) incrementSanriFreeUsed();
        saveLastSanriUbK(raw.data, lesson.id);
      } else {
        setSanriUbK({
          _error: errMsg(raw?.detail) || "Beklenmeyen yanıt.",
          kod_ayrimi: { baslik: "—", kirilimlar: [] },
          parca_okumasi: [],
          ust_bilinç_katmani: "",
          sanri_sorusu: "",
        });
      }
    } catch {
      setSanriUbK({
        _error: "Bağlantı kurulamadı. Tekrar dene.",
        kod_ayrimi: { baslik: "—", kirilimlar: [] },
        parca_okumasi: [],
        ust_bilinç_katmani: "",
        sanri_sorusu: "",
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading, token, mod.title, lesson.id, lesson.isFree, lesson.title, fullKodUnlocked, adminBypass]);

  const renderContent = (text) =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("---")) return <hr key={i} className={styles.hr} />;
      if (line.startsWith("**") && line.endsWith("**"))
        return <h4 key={i} className={styles.cH}>{line.replace(/\*\*/g, "")}</h4>;
      if (line.includes("**")) {
        const parts = line.split("**");
        return (
          <p key={i} className={styles.cP}>
            {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
          </p>
        );
      }
      if (!line.trim()) return <div key={i} className={styles.spacer} />;
      return <p key={i} className={styles.cP}>{line}</p>;
    });

  return (
    <motion.div
      className={styles.viewer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button className={styles.backBtn} onClick={onBack}>← Derslere Dön</button>

      {/* ── lesson progress bar ── */}
      {(() => {
        const g = globalStats();
        const idx = lessonIndex(mod.id, lesson.id);
        return (
          <div className={styles.lessonProgress}>
            <div className={styles.lessonProgressBar}>
              <div
                className={styles.lessonProgressFill}
                style={{ width: `${Math.round((idx / g.total) * 100)}%` }}
              />
            </div>
            <span className={styles.lessonProgressText}>
              Ders {idx}/{g.total} {g.done > 0 && `• ${g.pct}% tamamlandı`}
            </span>
          </div>
        );
      })()}

      <div className={styles.viewerCard}>
        <span className={styles.viewerTag} style={{ borderColor: mod.color, color: mod.color }}>
          {mod.icon} Ders {lesson.globalNo}
        </span>
        <h2 className={styles.viewerTitle}>{lesson.title}</h2>

        {lesson.introLine && (
          <blockquote className={styles.lessonIntro}>
            {lesson.introLine.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </blockquote>
        )}

        <div className={styles.viewerBody}>{renderContent(lesson.content)}</div>

        {lesson.codeBox && (
          <div className={styles.codeBox}>
            <div className={styles.codeBoxLabel}>Kod kutusu — örnek çözüm</div>
            <pre className={styles.codeBoxPre}>{lesson.codeBox}</pre>
          </div>
        )}

        {lesson.closingLine && (
          <p className={styles.lessonClosing}>{lesson.closingLine}</p>
        )}

        {/* ── INPUT + SANRI ── */}
        {lesson.hasInput && (
          <div className={styles.inputSection}>
            <div className={styles.inputDivider}>
              <span>SANRI ile Çöz</span>
            </div>
            <p className={styles.sanriSolveLead}>
              Burada düz açıklama yok — kelimeyi kod gibi parçalayan{" "}
              <span className={styles.sanriSolveAccent}>Üst Bilinç Kodlama</span> okuması.
            </p>

            <div className={styles.inputDividerSub}>
              <span>Şimdi sen yaz</span>
            </div>
            <p className={styles.inputHook}>
              İsim, şehir, kısa kavram, ilişki kelimesi veya ders pratiğindeki kod — SANRI ses ve katman
              kırılımlarıyla okur.
            </p>

            {lesson.inputPrompt && (
              <p className={styles.inputPrompt}>{lesson.inputPrompt}</p>
            )}

            {!isAuthenticated ? (
              <div className={styles.authBox}>
                <p>Yazmak için giriş yap.</p>
                <Link to="/giris" className={styles.authLink}>Giriş Yap</Link>
              </div>
            ) : !sanriAllowed ? (
              <div className={styles.sanriGate}>
                <p className={styles.sanriGateText}>
                  Ücretsiz SANRI okumaların bitti (ön izlemede toplam {FREE_PREVIEW_SANRI_COUNT} yorum).
                </p>
                <p className={styles.sanriGateSubtext}>
                  İstersen Modül 1&apos;i aç veya tüm sisteme geç.
                </p>
                <button
                  type="button"
                  className={styles.sanriGateBtn}
                  onClick={() =>
                    redirectToShopier("kod_giris_ders", KOD_CONTENT_ID_ILK_KAPI, "/kod-egitmeni?v=modules")
                  }
                >
                  İlk Kapı — {PRICE_CANLI_GIRIS_DERS} TL
                </button>
                <button
                  type="button"
                  className={styles.sanriGateBtnSecondary}
                  onClick={() =>
                    redirectToShopier("kod_egitmeni", KOD_CONTENT_ID_TAM_PROGRAM, "/kod-egitmeni?v=modules")
                  }
                >
                  Tüm sistem — {PRICE_KOD_TAM_PROGRAM} TL
                </button>
                <div className={styles.sanriGateHavaleRow}>
                  <BankTransferLink
                    contentId={KOD_CONTENT_ID_ILK_KAPI}
                    returnTo="/kod-egitmeni?v=modules"
                    className={styles.sanriGateHavaleLink}
                    debugProduct={KOD_PRODUCT_DEBUG_LABEL[KOD_CONTENT_ID_ILK_KAPI]}
                    debugAmount={KOD_PRODUCT_DEBUG_AMOUNT[KOD_CONTENT_ID_ILK_KAPI]}
                  >
                    Havale — İlk Kapı ({PRICE_CANLI_GIRIS_DERS} TL)
                  </BankTransferLink>
                  <BankTransferLink
                    contentId={KOD_CONTENT_ID_TAM_PROGRAM}
                    returnTo="/kod-egitmeni?v=modules"
                    className={styles.sanriGateHavaleLink}
                    debugProduct={KOD_PRODUCT_DEBUG_LABEL[KOD_CONTENT_ID_TAM_PROGRAM]}
                    debugAmount={KOD_PRODUCT_DEBUG_AMOUNT[KOD_CONTENT_ID_TAM_PROGRAM]}
                  >
                    Havale — Tam sistem ({PRICE_KOD_TAM_PROGRAM} TL)
                  </BankTransferLink>
                </div>
                <Link to="/subscription" className={styles.sanriGateSubLink}>
                  SANRI aboneliği
                </Link>
              </div>
            ) : (
              <>
                {lesson.isFree && !fullKodUnlocked && !adminBypass && (
                  <div className={styles.sanriFreeBadge}>
                    Ön izleme SANRI: kalan {freeLeft} / {FREE_PREVIEW_SANRI_COUNT}
                  </div>
                )}
                <textarea
                  className={styles.inputArea}
                  placeholder="Örn: Haluk · Aşk · İstanbul · Terk · Anne · Naz — tek satır yeter."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={5}
                  disabled={sent && loading}
                />

                {!sent ? (
                  <button
                    className={styles.sendBtn}
                    onClick={sendToSanri}
                    disabled={!input.trim()}
                  >
                    Üst bilinç okuması al
                  </button>
                ) : loading ? (
                  <div className={styles.loadingDots}>
                    <span /><span /><span />
                    <em>Üst bilinç katmanları okunuyor…</em>
                  </div>
                ) : null}

                <AnimatePresence>
                  {sanriUbK && (
                    <motion.div
                      className={styles.sanriBox}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={styles.sanriHead}>
                        <span className={styles.sanriGlyph}>◈</span> Üst bilinç kodlaması
                      </div>
                      {sanriUbK._error ? (
                        <div className={styles.ubkError}>{sanriUbK._error}</div>
                      ) : (
                        <SanriUbkBlocks data={sanriUbK} />
                      )}
                      <button
                        type="button"
                        className={styles.retryBtn}
                        onClick={() => {
                          setSent(false);
                          setSanriUbK(null);
                        }}
                      >
                        Tekrar Yaz
                      </button>
                      {lesson.closingLine && (
                        <p className={styles.lessonClosingAfterSanri}>{lesson.closingLine}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}

        {/* ── complete ── */}
        <div className={styles.viewerFooter}>
          {!done ? (
            <button
              className={styles.completeBtn}
              style={{ background: mod.color }}
              onClick={() => { markDone(mod.id, lesson.id); onComplete(); }}
            >
              Dersi Tamamla ✓
            </button>
          ) : (
            <div className={styles.doneTag}>✓ Tamamlandı</div>
          )}
        </div>

        {(prevLes && prevMod) || (nextLes && nextMod) ? (
          <nav className={styles.lessonNav} aria-label="Ders gezintisi">
            {prevLes && prevMod && (
              <button
                type="button"
                className={styles.lessonNavBtn}
                onClick={() => onGoLesson(prevLes.moduleId, prevLes.id)}
              >
                <span className={styles.lessonNavDir}>← Önceki</span>
                <span className={styles.lessonNavTitle}>{prevLes.title}</span>
              </button>
            )}
            {nextLes && nextMod && (
              <button
                type="button"
                className={`${styles.lessonNavBtn} ${styles.lessonNavBtnNext} ${nextOpen ? "" : styles.lessonNavBtnMuted}`}
                onClick={() => onGoLesson(nextLes.moduleId, nextLes.id)}
              >
                <span className={styles.lessonNavDir}>
                  {nextOpen ? "Sonraki ders →" : "Sonraki (kilitli) →"}
                </span>
                <span className={styles.lessonNavTitle}>{nextLes.title}</span>
              </button>
            )}
          </nav>
        ) : null}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function KodEgitmeniPage() {
  const [sp, setSp] = useSearchParams();
  const { user } = useAuth();
  const adminBypass = user?.role === "admin";
  const navigate = useNavigate();
  const [, rerender] = useState(0);

  useEffect(() => { trackFunnelEvent("kod_page_view"); }, []);

  // Varsayılan: ders hub'ı (üretimde /kod-egitmeni ile aynı deneyim). Tanıtım: ?v=landing
  const vParam = sp.get("v");
  const view =
    vParam === "landing"
      ? "landing"
      : vParam === "lesson"
        ? "lesson"
        : "modules";
  const modId = sp.get("m") || null;
  const lesId = sp.get("l") || null;

  const mod = modId ? getModuleById(modId) : null;
  const lesson = mod && lesId ? getLessonById(modId, lesId) : null;

  const goLanding = () => setSp({ v: "landing" });
  const goModules = () => { trackFunnelEvent("kod_module_view"); setSp({ v: "modules" }); };
  const goLesson = (m, l) => { trackFunnelEvent("kod_lesson_view", `${m}/${l}`); setSp({ v: "lesson", m, l }); };

  const legacyLessonResolved = useRef(false);
  useEffect(() => {
    if (legacyLessonResolved.current) return;
    const legacy = sp.get("lesson");
    if (!legacy || sp.get("m")) return;
    const found = getAllLessonsFlat().find((x) => x.id === legacy);
    if (found) {
      legacyLessonResolved.current = true;
      setSp({ v: "lesson", m: found.moduleId, l: found.id });
    }
  }, [sp, setSp]);

  const handleStart = () => {
    goLesson(MODUL_1_ID, "kod-nedir");
  };

  const handleLessonComplete = () => {
    rerender((n) => n + 1);
    if (modId) setSp({ v: "modules" });
  };

  const handleUnlockFull = () => {
    redirectToShopier("kod_egitmeni", KOD_CONTENT_ID_TAM_PROGRAM, "/kod-egitmeni?v=modules");
  };

  return (
    <div className={styles.page}>
      <SeoHead
        title="SANRI Kod Okuma Sistemi™ — Numeroloji Eğitimi"
        description="SANRI Kod Okuma Sistemi: numeroloji, sembolik analiz ve bilinç kodu eğitimi. Kendi kodunu oku, hayat haritanı çöz."
        path="/kod-egitmeni"
      />
      {/* ── topbar ── */}
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <Link to="/" className={styles.brand}>SANRI</Link>
          <span className={styles.topSub}>Kod Okuma Sistemi™</span>
        </div>
        <div className={styles.topRight}>
          <Link to="/kod-ogrenmeye-giris" className={styles.topGirisLink}>
            {PRICE_CANLI_GIRIS_DERS} TL · Canlı giriş
          </Link>
          {view === "landing" && (
            <button className={styles.backBtn} onClick={() => navigate("/kapilar")}>← Kapılar</button>
          )}
          {view === "modules" && (
            <button className={styles.backBtn} onClick={goLanding}>← Ana Sayfa</button>
          )}
          {view === "lesson" && (
            <button className={styles.backBtn} onClick={goModules}>← Dersler</button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "lesson" && lesson && mod ? (
          !canAccessLesson(lesson, mod, adminBypass) ? (
            <Paywall key="pw" />
          ) : (
            <LessonViewer
              key={`lv-${lesId}`}
              mod={mod}
              lesson={lesson}
              adminBypass={adminBypass}
              onComplete={handleLessonComplete}
              onBack={goModules}
              onGoLesson={goLesson}
            />
          )
        ) : view === "modules" ? (
          <ModuleList
            key="ml"
            adminBypass={adminBypass}
            onSelectLesson={(m, l) => goLesson(m, l)}
          />
        ) : (
          <Landing
            key="land"
            onFirstLesson={handleStart}
            onOpenModules={() => {
              goModules();
            }}
            onUnlockFull={handleUnlockFull}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
