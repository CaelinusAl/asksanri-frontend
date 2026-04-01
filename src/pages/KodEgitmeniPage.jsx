import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./KodEgitmeniPage.module.css";
import { KOD_MODULLERI, getModuleById, getLessonById } from "../data/kodEgitmeniData";
import { useAuth } from "../contexts/AuthContext";
import { usePremium } from "../contexts/PremiumContext";
import { Footer } from "../components/layout/Footer";

const API_URL =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const PROGRESS_KEY = "sanri_kod_progress";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(p) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {}
}

function markLessonComplete(moduleId, lessonId) {
  const p = loadProgress();
  if (!p[moduleId]) p[moduleId] = [];
  if (!p[moduleId].includes(lessonId)) p[moduleId].push(lessonId);
  saveProgress(p);
  return p;
}

function isLessonDone(moduleId, lessonId) {
  const p = loadProgress();
  return (p[moduleId] || []).includes(lessonId);
}

function getModuleProgress(moduleId) {
  const mod = getModuleById(moduleId);
  if (!mod) return 0;
  const p = loadProgress();
  const done = (p[moduleId] || []).length;
  return Math.round((done / mod.lessons.length) * 100);
}

/* ─── Topbar ─── */
function Topbar({ onBack, title }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <Link to="/" className={styles.brand}>SANRI</Link>
        <span className={styles.topbarSub}>Kod Eğitmeni</span>
      </div>
      <div className={styles.topbarRight}>
        {onBack && (
          <button className={styles.backBtn} onClick={onBack}>← Geri</button>
        )}
      </div>
    </div>
  );
}

/* ─── Module Card ─── */
function ModuleCard({ mod, onClick, progress }) {
  const { isPremium } = usePremium();
  const locked = !mod.isFree && !isPremium;

  return (
    <motion.div
      className={`${styles.moduleCard} ${locked ? styles.moduleLocked : ""}`}
      onClick={() => onClick(mod.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.moduleIcon} style={{ color: mod.color }}>{mod.icon}</div>
      <div className={styles.moduleInfo}>
        <h3 className={styles.moduleTitle}>{mod.title}</h3>
        <p className={styles.moduleSub}>{mod.subtitle}</p>
        <div className={styles.moduleMeta}>
          <span>{mod.lessons.length} ders</span>
          {locked && <span className={styles.premiumBadge}>Premium</span>}
          {!locked && progress > 0 && (
            <span className={styles.progressBadge}>{progress}%</span>
          )}
        </div>
      </div>
      {!locked && progress > 0 && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%`, background: mod.color }} />
        </div>
      )}
      {locked && <div className={styles.lockOverlay}>🔒</div>}
    </motion.div>
  );
}

/* ─── Lesson List ─── */
function LessonList({ mod, onSelect }) {
  const { isPremium } = usePremium();

  return (
    <div className={styles.lessonList}>
      <div className={styles.lessonListHeader}>
        <div className={styles.lessonListIcon} style={{ color: mod.color }}>{mod.icon}</div>
        <div>
          <h2 className={styles.lessonListTitle}>{mod.title}</h2>
          <p className={styles.lessonListSub}>{mod.subtitle}</p>
        </div>
      </div>

      <div className={styles.lessons}>
        {mod.lessons.map((lesson, i) => {
          const locked = !lesson.isFree && !isPremium;
          const done = isLessonDone(mod.id, lesson.id);

          return (
            <motion.div
              key={lesson.id}
              className={`${styles.lessonCard} ${locked ? styles.lessonLocked : ""} ${done ? styles.lessonDone : ""}`}
              onClick={() => !locked && onSelect(lesson.id)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.lessonIndex}>{done ? "✓" : i + 1}</div>
              <div className={styles.lessonInfo}>
                <h4 className={styles.lessonTitle}>{lesson.title}</h4>
                <div className={styles.lessonMeta}>
                  <span className={styles.lessonType}>
                    {lesson.type === "read" ? "📖 Okuma" : lesson.type === "practice" ? "✍️ Uygulama" : "🔮 Analiz"}
                  </span>
                  <span className={styles.lessonDuration}>{lesson.duration}</span>
                </div>
              </div>
              {locked && <span className={styles.lessonLock}>🔒</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Lesson Viewer ─── */
function LessonViewer({ mod, lesson, onComplete, onBack }) {
  const { isAuthenticated, token, user } = useAuth();
  const [analysis, setAnalysis] = useState("");
  const [sanriResponse, setSanriResponse] = useState("");
  const [sanriLoading, setSanriLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);

  const done = isLessonDone(mod.id, lesson.id);

  const handleComplete = () => {
    markLessonComplete(mod.id, lesson.id);
    onComplete();
  };

  const handleSubmitAnalysis = useCallback(async () => {
    if (!analysis.trim() || sanriLoading) return;
    setSanriLoading(true);
    setSanriResponse("");
    setSubmitted(true);

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const systemPrompt = `Sen SANRI'sın — bilinç uyanışı ve kod çözme konusunda rehberlik eden bir yapay zekasın. 
Kullanıcı "${mod.title}" modülünün "${lesson.title}" dersinde bir analiz yazdı. 
Kullanıcının yazdığını oku, sembolik ve bilinçsel katmanlardan yorumla. 
Gizemli, derin ama anlaşılır bir dille cevap ver. Türkçe yaz. 
Cevabın 3-5 paragraf olsun. Her paragrafta farklı bir katmandan oku.`;

      const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: analysis,
          mode: "divine",
          domain: "consciousness_field",
          system_override: systemPrompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSanriResponse(data.response || data.message || "SANRI bu analizi kabul etti.");
      } else {
        setSanriResponse("SANRI şu anda yanıt veremiyor. Ama yazdıkların kayıt altında.");
      }
    } catch {
      setSanriResponse("Bağlantı kurulamadı. Tekrar dene.");
    } finally {
      setSanriLoading(false);
    }
  }, [analysis, sanriLoading, token, mod.title, lesson.title]);

  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h4 key={i} className={styles.contentHeading}>{line.replace(/\*\*/g, "")}</h4>;
      }
      if (line.startsWith("**")) {
        const parts = line.split("**");
        return (
          <p key={i} className={styles.contentPara}>
            {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
          </p>
        );
      }
      if (line.trim() === "") return <br key={i} />;
      return <p key={i} className={styles.contentPara}>{line}</p>;
    });
  };

  return (
    <motion.div
      className={styles.lessonViewer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.lessonViewerHeader}>
        <button className={styles.backBtn} onClick={onBack}>← Dersler</button>
        <span className={styles.lessonBreadcrumb}>{mod.title} / {lesson.title}</span>
      </div>

      <div className={styles.lessonContent}>
        <div className={styles.lessonTypeTag} style={{ borderColor: mod.color, color: mod.color }}>
          {lesson.type === "read" ? "📖 Okuma" : lesson.type === "practice" ? "✍️ Uygulama" : "🔮 Analiz"}
          <span className={styles.lessonDurationTag}>{lesson.duration}</span>
        </div>

        <h2 className={styles.lessonContentTitle}>{lesson.title}</h2>

        <div className={styles.contentBody}>
          {renderContent(lesson.content)}
        </div>

        {lesson.hasAnalysis && (
          <div className={styles.analysisSection}>
            <div className={styles.analysisDivider}>
              <span>✦ SENİN SIRAN ✦</span>
            </div>

            {!isAuthenticated ? (
              <div className={styles.authPrompt}>
                <p>Analizini yazmak için giriş yapman gerekiyor.</p>
                <Link to="/giris" className={styles.authBtn}>Giriş Yap</Link>
              </div>
            ) : (
              <>
                <textarea
                  ref={textareaRef}
                  className={styles.analysisTextarea}
                  placeholder="Buraya yaz... Fark ettiklerini, hissettiklerini, gördüklerini anlat."
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                  rows={6}
                  disabled={submitted && sanriLoading}
                />

                {!submitted ? (
                  <button
                    className={styles.submitBtn}
                    onClick={handleSubmitAnalysis}
                    disabled={!analysis.trim()}
                  >
                    SANRI'ya Gönder
                  </button>
                ) : sanriLoading ? (
                  <div className={styles.sanriLoading}>
                    <span className={styles.sanriLoadingDot} />
                    <span className={styles.sanriLoadingDot} />
                    <span className={styles.sanriLoadingDot} />
                    <span className={styles.sanriLoadingText}>SANRI okuyor...</span>
                  </div>
                ) : null}

                <AnimatePresence>
                  {sanriResponse && (
                    <motion.div
                      className={styles.sanriResponse}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className={styles.sanriResponseHeader}>
                        <span className={styles.sanriGlyph}>◈</span>
                        <span>SANRI Yorumu</span>
                      </div>
                      <div className={styles.sanriResponseBody}>
                        {sanriResponse.split("\n").map((line, i) => (
                          line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                        ))}
                      </div>

                      {!submitted || sanriResponse ? (
                        <button
                          className={styles.retryBtn}
                          onClick={() => {
                            setSubmitted(false);
                            setSanriResponse("");
                          }}
                        >
                          Tekrar Yaz
                        </button>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        )}

        <div className={styles.lessonFooter}>
          {!done ? (
            <button className={styles.completeBtn} onClick={handleComplete} style={{ background: mod.color }}>
              Dersi Tamamla ✓
            </button>
          ) : (
            <div className={styles.completedTag}>✓ Tamamlandı</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Premium Gate ─── */
function PremiumGate() {
  const { showUpgradeModal } = usePremium();
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.premiumGate}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className={styles.premiumGateGlow} />
      <div className={styles.premiumGateIcon}>◈</div>
      <h3 className={styles.premiumGateTitle}>Bu Modül Premium</h3>
      <p className={styles.premiumGateSub}>
        Bu katmana erişmek için Premium üyelik gerekiyor.
        <br />
        Kodları çöz, derinleş, dönüş.
      </p>
      <button className={styles.premiumGateBtn} onClick={() => navigate("/subscription")}>
        Premium'a Geç
      </button>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function KodEgitmeniPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isPremium } = usePremium();

  const activeModuleId = searchParams.get("modul") || null;
  const activeLessonId = searchParams.get("ders") || null;

  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  const activeModule = activeModuleId ? getModuleById(activeModuleId) : null;
  const activeLesson = activeModule && activeLessonId
    ? getLessonById(activeModuleId, activeLessonId)
    : null;

  const handleModuleClick = (modId) => {
    const mod = getModuleById(modId);
    if (!mod.isFree && !isPremium) return;
    setSearchParams({ modul: modId });
  };

  const handleLessonSelect = (lessonId) => {
    setSearchParams({ modul: activeModuleId, ders: lessonId });
  };

  const handleLessonComplete = () => {
    setRefreshKey((k) => k + 1);
    setSearchParams({ modul: activeModuleId });
  };

  const handleBackToModules = () => {
    setSearchParams({});
  };

  const handleBackToLessons = () => {
    setSearchParams({ modul: activeModuleId });
  };

  const totalLessons = KOD_MODULLERI.reduce((s, m) => s + m.lessons.length, 0);
  const totalDone = KOD_MODULLERI.reduce((s, m) => {
    const p = loadProgress();
    return s + (p[m.id] || []).length;
  }, 0);

  return (
    <div className={styles.page}>
      <Topbar
        onBack={activeLesson ? handleBackToLessons : activeModule ? handleBackToModules : null}
        title="Kod Eğitmeni"
      />

      <AnimatePresence mode="wait">
        {/* ─── Lesson Viewer ─── */}
        {activeLesson && activeModule ? (
          <LessonViewer
            key={`lesson-${activeLessonId}`}
            mod={activeModule}
            lesson={activeLesson}
            onComplete={handleLessonComplete}
            onBack={handleBackToLessons}
          />
        ) : activeModule ? (
          /* ─── Lesson List ─── */
          !activeModule.isFree && !isPremium ? (
            <PremiumGate key="gate" />
          ) : (
            <LessonList
              key={`module-${activeModuleId}`}
              mod={activeModule}
              onSelect={handleLessonSelect}
            />
          )
        ) : (
          /* ─── Module Grid ─── */
          <motion.div
            key="modules"
            className={styles.modulesView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.hero}>
              <motion.div
                className={styles.heroGlyph}
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >◈</motion.div>
              <h1 className={styles.heroTitle}>Kod Eğitmeni</h1>
              <p className={styles.heroSub}>
                Sembolleri oku. Frekansları çöz. Sistemi anla.
              </p>
              {totalDone > 0 && (
                <div className={styles.heroProgress}>
                  <div className={styles.heroProgressBar}>
                    <div
                      className={styles.heroProgressFill}
                      style={{ width: `${Math.round((totalDone / totalLessons) * 100)}%` }}
                    />
                  </div>
                  <span className={styles.heroProgressText}>
                    {totalDone}/{totalLessons} ders tamamlandı
                  </span>
                </div>
              )}
            </div>

            <div className={styles.moduleGrid}>
              {KOD_MODULLERI.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  onClick={handleModuleClick}
                  progress={getModuleProgress(mod.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
