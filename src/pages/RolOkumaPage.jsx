import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { redirectToShopier } from "../data/shopierConfig";
import styles from "./RolOkumaPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const PHASES = {
  FORM: "form",
  LOADING: "loading",
  RESULT: "result",
};

const LOADING_LINES = [
  "Sanrı seni okuyor...",
  "İsmin çözülüyor...",
  "Doğum frekansın hesaplanıyor...",
  "Katmanlar açılıyor...",
  "Rolün belirleniyor...",
];

export default function RolOkumaPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(PHASES.FORM);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const intervalRef = useRef(null);

  const startLoading = useCallback(() => {
    setLoadingLine(0);
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 1800);
  }, []);

  const stopLoading = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !birthDate.trim()) return;
    setError("");
    setPhase(PHASES.LOADING);
    startLoading();

    try {
      const fullName = surname.trim()
        ? `${name.trim()} ${surname.trim()}`
        : name.trim();

      const res = await fetch(`${API}/matrix-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fullName, birth_date: birthDate }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      const sections = buildSections(data, fullName);
      setResult({ data, sections, fullName });
      stopLoading();
      setPhase(PHASES.RESULT);
    } catch {
      stopLoading();
      setError("Bir hata oluştu. Lütfen tekrar dene.");
      setPhase(PHASES.FORM);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      {/* ── topbar ── */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ← Kapılar
        </button>
        <span className={styles.topTitle}>Matrix Rol Okuma</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === PHASES.FORM && (
          <motion.div
            key="form"
            className={styles.formWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.formGlyph}>◈</div>
            <h1 className={styles.formTitle}>Rolünü Öğren</h1>
            <p className={styles.formSub}>
              Adın ve doğum tarihin, evrenin sana verdiği kodu taşır.
              <br />
              Sanrı bunu okur.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Adın"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Soyad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Soyadın"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Doğum Tarihi</label>
                <input
                  className={styles.input}
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!name.trim() || !birthDate}
              >
                Rolümü Oku
              </button>
            </form>
          </motion.div>
        )}

        {phase === PHASES.LOADING && (
          <motion.div
            key="loading"
            className={styles.loadingWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.loadingOrb}>
              <span className={styles.loadingGlyph}>◈</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingLine}
                className={styles.loadingText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {phase === PHASES.RESULT && result && (
          <motion.div
            key="result"
            className={styles.resultWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.resultHeader}>
              <div className={styles.resultGlyph}>✦</div>
              <h2 className={styles.resultName}>{result.fullName}</h2>
              {result.data.matrix_role && (
                <div className={styles.roleBadge}>{result.data.matrix_role}</div>
              )}
            </div>

            <div className={styles.sections}>
              {result.sections.map((sec, i) => (
                <motion.div
                  key={sec.title}
                  className={styles.section}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  <div className={styles.sectionIcon}>{sec.icon}</div>
                  <h3 className={styles.sectionTitle}>{sec.title}</h3>
                  <p className={styles.sectionText}>{sec.text}</p>
                </motion.div>
              ))}
            </div>

            {/* ── teaser ── */}
            {result.data.teaser && (
              <div className={styles.teaserCard}>
                <p className={styles.teaserText}>{result.data.teaser}</p>
              </div>
            )}

            {/* ── CTA ── */}
            <div className={styles.ctaSection}>
              <p className={styles.ctaLine}>Bu sadece başlangıç.</p>
              <div className={styles.ctaBtns}>
                <button
                  className={styles.ctaPrimary}
                  onClick={() =>
                    redirectToShopier("iliski_acilimi", "iliski_acilimi", "/rol-okuma")
                  }
                >
                  İlişki Açılımını Gör — 369₺
                </button>
                <button
                  className={styles.ctaPrimary}
                  onClick={() =>
                    redirectToShopier("para_akisi", "para_akisi", "/rol-okuma")
                  }
                >
                  Para Akışını Gör — 369₺
                </button>
              </div>
            </div>

            {/* ── again ── */}
            <button
              className={styles.againBtn}
              onClick={() => {
                setPhase(PHASES.FORM);
                setResult(null);
              }}
            >
              Tekrar Oku
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Section builder from API response ── */
function buildSections(data, fullName) {
  const role = data.matrix_role || "Bilinmiyor";
  const nameNum = data.name_number || 0;
  const lifePath = data.life_path || 0;
  const nameArch = data.name_archetype || "";
  const lpArch = data.life_path_archetype || "";

  return [
    {
      icon: "◈",
      title: "Rol Tanımı",
      text: `${fullName} — senin Matrix'teki rolün: ${role}. Bu, senin bu yaşamda taşıdığın enerji imzası. Bir kimlik değil, bir frekans.`,
    },
    {
      icon: "⟁",
      title: "Ana Tema",
      text: `Yaşam yolun ${lifePath} numarasını taşıyor: ${lpArch}. Bu sayı hayatının ana akışını belirler. Seni buraya getiren tesadüf değil — bir çağrı.`,
    },
    {
      icon: "✦",
      title: "Güç Alanı",
      text: `İsmin ${nameNum} frekansında titreşiyor: ${nameArch}. Bu senin doğal gücün. Zorlamadan aktığın, etrafındakilerin fark ettiği ama senin hafife aldığın şey.`,
    },
    {
      icon: "◉",
      title: "İçsel Çatışma",
      text: `Her güç bir gölge taşır. ${nameNum} frekansının gölgesi seni zaman zaman yorabilir. Bu gölge düşmanın değil — sana ayna tutan parçan.`,
    },
    {
      icon: "☽",
      title: "Kör Nokta",
      text: `Göremediğin alan genellikle en çok güvendiğin alanın tam karşısında durur. ${lifePath} yolunda yürürken, duymayı seçmediğin bir ses var. O sesi duymak cesaret ister.`,
    },
    {
      icon: "∞",
      title: "Döngü Yorumu",
      text: `Hayatında tekrar eden kalıplar var mı? ${role} rolü belirli döngüleri tekrarlatır — ta ki fark edene kadar. Fark ettiğin an, döngü kırılır.`,
    },
    {
      icon: "✧",
      title: "SANRI Mesajı",
      text: `"${fullName}, bu sadece bir sayı değil. Bu senin hikayenin kodlanmış hali. Onu okumak bilgi değil — hatırlayış."`,
    },
  ];
}
