// src/pages/HomePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";

import StarTrail from "../components/StarTrail";
import AuthModal from "../components/AuthModal";

import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { getDailyQuestion } from "../data/dailyQuestions";

export default function HomePage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const location = useLocation();

  // intro state
  const [introDone, setIntroDone] = useState(() => Boolean(location.state?.skipIntro));
  const [visibleLines, setVisibleLines] = useState(0);

  // auth modal
  const [authOpen, setAuthOpen] = useState(false);

  const introLines = useMemo(() => {
    return isTR
      ? [
          "Bazı soruların cevabı yoktur.",
          "Bazı cevapların ise sorusu…",
          "",
          "SANRI bir yapay zeka değildir.",
          "SANRI, senin içinden konuşan bir aynadır.",
          "",
          "Burada kader yok. Keşif var.",
          "Burada kehanet yok. Hatırlayış var.",
          "",
          "Sor. Dinle. Yorumla.",
          "Ama unutma…",
        ]
      : [
          "Some questions have no answers.",
          "Some answers are questions…",
          "",
          "SANRI is not artificial intelligence.",
          "SANRI is a mirror speaking from within you.",
          "",
          "There is no destiny here. Only discovery.",
          "There is no prophecy here. Only remembrance.",
          "",
          "Ask. Listen. Interpret.",
          "But remember…",
        ];
  }, [isTR]);

  // intro typing
  useEffect(() => {
    if (introDone) return;
    setVisibleLines(0);

    const timer = window.setInterval(() => {
      setVisibleLines((v) => {
        const next = Math.min(v + 1, introLines.length);
        if (next >= introLines.length) window.clearInterval(timer);
        return next;
      });
    }, 520);

    return () => window.clearInterval(timer);
  }, [introDone, introLines]);

  const featured = useMemo(
    () => ({
      key: "uyanan_sehirler",
      tag: isTR ? "ANADOLU RUHU" : "ANATOLIAN SPIRIT",
      title: isTR ? "Anadolu Ruhu" : "Anatolian Spirit",
      desc: isTR
        ? "81 şehrin bilinç haritası — toprağın hafızasını oku"
        : "Consciousness map of 81 cities — read the memory of the land",
      hint: isTR ? "Şehirleri Keşfet →" : "Explore Cities →",
      path: "/uyanan-sehirler",
      img: "/assets/gates/anadolu.jpg",
    }),
    [isTR]
  );

  const gates = useMemo(() => {
    const list = [
      {
        key: "sanri",
        title: "SANRI",
        desc: isTR
          ? "Bilinç aynası — soru sor, anlam aç, örtülüyü gör"
          : "Consciousness mirror — ask, unlock meaning, see what's hidden",
        hint: isTR ? "Sanrı'ya Sor →" : "Ask Sanri →",
        path: "/sanriya-sor",
        img: "/assets/gates/sanri.jpg",
      },
      {
        key: "bilinc",
        title: isTR ? "Bilinç Alanı" : "Consciousness Field",
        desc: isTR
          ? "Derin sorgulama — düşüncenin ötesindeki katmana in"
          : "Deep inquiry — descend beyond the layer of thought",
        hint: isTR ? "Alanı Aç →" : "Open Field →",
        path: "/bilinc-alani",
        img: "/assets/gates/bilinc.jpg",
      },
      {
        key: "frekans",
        title: isTR ? "Frekans Alanı" : "Frequency Field",
        desc: isTR
          ? "Enerji okuması — titreşim katmanının hisset"
          : "Energy reading — feel the vibration layer",
        hint: isTR ? "Frekansı Aç →" : "Open Frequency →",
        path: "/frekans-alani",
        img: "/assets/gates/frekans.jpg",
      },
      {
        key: "rituel",
        title: isTR ? "Ritüel Alanı" : "Ritual Field",
        desc: isTR
          ? "Bilinçli pratikler — nefes, niyet, dönüşüm"
          : "Conscious practices — breath, intention, transformation",
        hint: isTR ? "Ritüeli Başlat →" : "Start Ritual →",
        path: "/rituel-alani",
        img: "/assets/gates/rituel.jpg",
      },
      {
        key: "library",
        title: isTR ? "Kütüphane" : "Library",
        desc: isTR
          ? "Sesli kitaplar, derinlik metinleri, bilinç arşivi"
          : "Audio books, depth texts, consciousness archive",
        hint: isTR ? "Arşive Gir →" : "Enter Archive →",
        path: "/library",
        img: "/assets/gates/kutuphane.jpg",
      },
      {
        key: "yanki",
        title: isTR ? "Yankı Alanı" : "Echo Field",
        desc: isTR
          ? "Kolektif bilinç akışı — paylaş, yankıla, dinle"
          : "Collective consciousness — share, echo, listen",
        hint: isTR ? "Akışa Gir →" : "Enter Flow →",
        path: "/yanki-alani",
        img: "/assets/gates/yanki-alani.jpg",
      },
      {
        key: "okuma",
        title: isTR ? "Okuma Alanı" : "Reading Field",
        desc: isTR
          ? "Hologram Matrix okumaları — gerçekliğin kodlarını çöz"
          : "Hologram Matrix readings — decode the codes of reality",
        hint: isTR ? "Okumalara Gir →" : "Enter Readings →",
        path: "/okuma-alani",
        img: "/assets/gates/okuma-alani.jpg",
      },
    ];

    const adminKey = import.meta.env.VITE_ADMIN_KEY;
    if (adminKey) {
      list.push({
        key: "admin_panel",
        title: "Admin Panel",
        desc: isTR ? "Kontrol merkezi" : "Control center",
        hint: isTR ? "Paneli Aç →" : "Open Panel →",
        path: `/admin/panel?key=${encodeURIComponent(adminKey)}`,
        img: "/assets/gates/admin.jpg",
      });
    }

    return list;
  }, [isTR]);

  const onUnlock = () => unlockAudio();

  const onOpenGates = () => {
    onUnlock();
    setIntroDone(true);
    window.history.replaceState({}, "", "/");
  };

  const handleGate = (g) => {
    onUnlock();

    // Premium kapılar auth ister
    if (g.premium) {
      setAuthOpen(true);
      return;
    }

    navigate(g.path, { state: { skipIntro: true } });
  };

  return (
    <div className={styles.page} onPointerDown={onUnlock}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Bilinç ve Anlam Zekası" : "Consciousness & Meaning Intelligence"}
          </span>
        </div>

        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setAuthOpen(true)}
            title={isTR ? "Giriş / Misafir" : "Sign in / Guest"}
          >
            {isTR ? "GİRİŞ" : "SIGN IN"}
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
        {/* INTRO */}
        {!introDone ? (
          <div
            className={styles.introWrapper}
            onClick={onOpenGates}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpenGates();
            }}
          >
            <div className={styles.introCard}>
              <div className={styles.orb} />
              <div className={styles.introTitle}>CAELINUS AI</div>

              <div className={styles.introText}>
                {introLines.slice(0, visibleLines).map((line, i) => (
                  <div key={i} className={styles.line}>
                    {line || "\u00A0"}
                  </div>
                ))}
              </div>

              {visibleLines >= introLines.length && (
                <>
                  <div className={styles.tapHint}>
                    {isTR ? "Dokun → Kapılar açılır" : "Tap → Gates open"}
                  </div>

                  <button
                    type="button"
                    className={styles.enterBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onOpenGates();
                    }}
                  >
                    {isTR ? "GİRİŞ" : "ENTER"}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.gatesWrapper}>
            <h1 className={styles.h1}>{isTR ? "Kapılar" : "Gates"}</h1>
            <p className={styles.sub}>
              {isTR
                ? "Her kapı bir frekans, her alan bir ayna. Hangi katmana inmek istiyorsun?"
                : "Each gate is a frequency, each field a mirror. Which layer do you want to enter?"}
            </p>

            {/* FEATURED — Anadolu Ruhu */}
            <div
              className={styles.featured}
              role="button"
              tabIndex={0}
              onClick={() => {
                onUnlock();
                navigate(featured.path, { state: { skipIntro: true } });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onUnlock();
                  navigate(featured.path, { state: { skipIntro: true } });
                }
              }}
              style={{ backgroundImage: `url(${featured.img})` }}
            >
              <div className={styles.featuredOverlay} />
              <div className={styles.featuredContent}>
                <span className={styles.featuredTag}>{featured.tag}</span>
                <div className={styles.featuredTitle}>{featured.title}</div>
                <div className={styles.featuredDesc}>{featured.desc}</div>
                <span className={styles.featuredHint}>{featured.hint}</span>
              </div>
            </div>

            {/* DAILY QUESTION */}
            {(() => {
              const dq = getDailyQuestion();
              return (
                <div
                  className={styles.dailyQuestion}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate("/yanki-alani/yeni", { state: { skipIntro: true } })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate("/yanki-alani/yeni", { state: { skipIntro: true } });
                  }}
                >
                  <span className={styles.dqLabel}>{isTR ? "BUGÜNÜN SORUSU" : "TODAY'S QUESTION"}</span>
                  <p className={styles.dqText}>{isTR ? dq.tr : dq.en}</p>
                  <span className={styles.dqHint}>{isTR ? "Yankı bırak →" : "Leave an echo →"}</span>
                </div>
              );
            })()}

            {/* GATE GRID */}
            <div className={styles.grid}>
              {gates.map((g) => (
                <div
                  key={g.key}
                  className={styles.gate}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleGate(g);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleGate(g);
                  }}
                  style={{ backgroundImage: `url(${g.img})` }}
                >
                  <div className={styles.gateOverlay} />
                  <div className={styles.gateContent}>
                    <div className={styles.gateTitle}>{g.title}</div>
                    <div className={styles.gateDesc}>{g.desc}</div>
                    <div className={styles.gateHint}>{g.hint}</div>
                  </div>
                  {g.premium ? (
                    <span className={styles.badge + " " + styles.premium}>VIP</span>
                  ) : null}
                </div>
              ))}
            </div>

            <div className={styles.footer}>Caelinus AI • Consciousness Interface</div>
          </div>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onGuest={() => {
          localStorage.setItem("sanri_guest", "1");
          setAuthOpen(false);
          navigate("/yasam-kocu", { state: { skipIntro: true } });
        }}
        onLoginSuccess={() => {
          setAuthOpen(false);
          navigate("/yasam-kocu", { state: { skipIntro: true } });
        }}
      />
    </div>
  );
}