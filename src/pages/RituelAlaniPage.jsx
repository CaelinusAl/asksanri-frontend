// src/pages/RituelAlaniPage.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RituelAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import PremiumGateModal from "../components/PremiumGateModal";

import { ritualFlows } from "../data/ritualFlows";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx"; // ✅ KRİTİK

export default function RituelAlaniPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [fatal, setFatal] = useState("");

  // ✅ MOBİL “SİYAH/BEYAZ EKRAN” = hata yakala
  useEffect(() => {
    const onErr = (msg, src, line, col, err) => {
      setFatal(String(err?.stack || err || msg));
      return false;
    };
    const onRej = (e) => setFatal(String(e?.reason?.stack || e?.reason || e));
    window.onerror = onErr;
    window.onunhandledrejection = onRej;
    return () => {
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);

  // ---------- DATA ----------
  const flows = useMemo(() => (Array.isArray(ritualFlows) ? ritualFlows : []), []);
  const [activeKey, setActiveKey] = useState(() => flows?.[0]?.key || "vitrin_rituel");
  const [stepIndex, setStepIndex] = useState(0);

  const [gateOpen, setGateOpen] = useState(false);

  const activeFlow = useMemo(() => {
    const found = flows.find((f) => f?.key === activeKey);
    return found || flows?.[0] || null;
  }, [flows, activeKey]);

  const steps = useMemo(() => {
    const s = activeFlow?.steps?.[isTR ? "tr" : "en"];
    return Array.isArray(s) ? s : [];
  }, [activeFlow, isTR]);

  const currentStep = steps[stepIndex] || null;

  // audio
  const rawAudio = activeFlow?.audio?.[isTR ? "tr" : "en"] || "";
  const currentAudio = useMemo(() => {
    if (rawAudio) return rawAudio;
    if (activeFlow?.key === "vitrin_rituel") {
      return isTR ? "/audio/rituals/vitrin_rituel_tr.mp3" : "/audio/rituals/vitrin_rituel_en.mp3";
    }
    return "";
  }, [rawAudio, activeFlow?.key, isTR]);

  const goBackToGates = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const openFlow = useCallback(
    (flow) => {
      unlockAudio();
      setFatal("");
      if (!flow?.key) return;

      if (flow.premium) {
        setGateOpen(true);
        return;
      }

      setActiveKey(flow.key);
      setStepIndex(0);
    },
    []
  );

  const nextStep = useCallback(() => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  }, [stepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const goToSanri = useCallback(() => {
    const title = isTR ? activeFlow?.title?.tr : activeFlow?.title?.en;
    const q = encodeURIComponent(String(title || ""));
    navigate(`/sanriya-sor?prefill=${q}&domain=ritual_space&mode=mirror`, { state: { skipIntro: true } });
  }, [navigate, activeFlow, isTR]);

  // audio reset
  const audioRef = useRef(null);
  useEffect(() => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } catch {}
  }, [currentAudio]);

  // register/login
  const handleRegister = useCallback(
    async ({ email, password }) => {
      if (!API_URL) return alert(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/api/auth/email/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(String(data?.detail || data?.error || "Register failed"));
      setGateOpen(false);
      alert(isTR ? "Kayıt başarılı. Şimdi giriş yap." : "Registration successful. Now log in.");
    },
    [API_URL, isTR]
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      if (!API_URL) return alert(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/api/auth/email/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(String(data?.detail || data?.error || "Login failed"));
      setGateOpen(false);
      alert(isTR ? "Giriş başarılı." : "Login successful.");
    },
    [API_URL, isTR]
  );

  const pageSubtitle = isTR ? "Ritüel Alanı • Frekans Protokolleri" : "Ritual Space • Frequency Protocols";

  return (
    <div
      className={styles.page}
      onPointerDown={unlockAudio}
      onTouchStart={unlockAudio}
      onMouseDown={unlockAudio}
    >
      {fatal ? (
        <div className={styles.fatal}>
          <b>{isTR ? "Ritüel Alanı Hatası" : "Ritual Space Error"}</b>
          {"\n\n"}
          {fatal}
        </div>
      ) : null}

      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>{pageSubtitle}</span>
        </div>

        <div className={styles.topbarRight}>
          <button
            type="button"
            className={styles.langBtn}
            onClick={() => setLanguage(isTR ? "en" : "tr")}
          >
            {isTR ? "EN" : "TR"}
          </button>

          <button type="button" className={styles.backBtn} onClick={goBackToGates}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.ritualList}>
          <div className={styles.panelTitle}>{isTR ? "RİTÜELLER" : "RITUALS"}</div>

          <div className={styles.listInner}>
            {flows.map((r) => {
              const isActive = r?.key === activeKey;
              const title = isTR ? r?.title?.tr : r?.title?.en;
              const desc = isTR ? r?.desc?.tr : r?.desc?.en;

              return (
                <div
                  key={r.key}
                  role="button"
                  tabIndex={0}
                  className={`${styles.ritualItem} ${isActive ? styles.active : ""}`}
                  onClick={() => openFlow(r)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") openFlow(r);
                  }}
                >
                  <div className={styles.itemTitle}>{title || r.key}</div>
                  <div className={styles.itemDesc}>{desc || ""}</div>

                  <div className={styles.badges}>
                    {r?.premium ? (
                      <span className={styles.premiumBadge}>PREMIUM</span>
                    ) : (
                      <span className={styles.freeBadge}>FREE</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.note}>
            {isTR
              ? "Not: Premium ritüeller kilitli. Vitrin ritüeli merak uyandırmak içindir."
              : "Note: Premium rituals are locked. The showcase ritual is designed to spark curiosity."}
          </div>
        </div>

        <div className={styles.selectedCard}>
          <div className={styles.panelTitle}>{isTR ? "SEÇİLİ RİTÜEL" : "SELECTED RITUAL"}</div>

          <div className={styles.selectedTitle}>
            {activeFlow ? (isTR ? activeFlow?.title?.tr : activeFlow?.title?.en) : isTR ? "Ritüel" : "Ritual"}
          </div>

          <div className={styles.selectedDesc}>
            {activeFlow ? (isTR ? activeFlow?.desc?.tr : activeFlow?.desc?.en) : ""}
          </div>

          <div className={styles.audioBox}>
            <div className={styles.audioTitle}>{isTR ? "Sesli Ritüel" : "Audio Ritual"}</div>

            {currentAudio ? (
              <audio ref={audioRef} src={currentAudio} controls className={styles.audio} preload="metadata" />
            ) : (
              <div className={styles.audioMissing}>{isTR ? "Ses dosyası bulunamadı." : "Audio file not found."}</div>
            )}

            <div className={styles.audioHint}>
              {isTR
                ? "Not: İlk play için ekrana dokunmuş olman gerekebilir."
                : "Note: You may need to tap the screen once before audio can play."}
            </div>
          </div>

          <div className={styles.stepsBox}>
            <div className={styles.stepLine}>
              <span className={styles.stepCounter}>
                {isTR ? "Adım" : "Step"} {steps.length ? stepIndex + 1 : 0}/{steps.length || 0}
              </span>
              {currentStep?.t ? <span className={styles.stepPill}>{currentStep.t}</span> : null}
            </div>

            <div className={styles.stepText}>
              {currentStep?.b || (isTR ? "Bu ritüel yakında." : "Coming soon.")}
            </div>

            <div className={styles.stepActions}>
              <button type="button" className={styles.btnGhost} onClick={prevStep} disabled={stepIndex <= 0}>
                {isTR ? "← Geri" : "← Back"}
              </button>

              <button type="button" className={styles.btnPrimary} onClick={nextStep} disabled={!steps.length || stepIndex >= steps.length - 1}>
                {isTR ? "Devam →" : "Next →"}
              </button>

              <div className={styles.grow} />

              <button type="button" className={styles.btnSanri} onClick={goToSanri}>
                {isTR ? "SANRI’ya Sor →" : "Ask SANRI →"}
              </button>
            </div>
          </div>

          <div className={styles.footnote}>
            {isTR
              ? "Bu alan “bilgi” üretmez. Protokol uygular; sende açılır. © 2026 CaelinusAI • SANRI"
              : "This space does not produce “knowledge”. It applies protocol; it opens within you. © 2026 CaelinusAI • SANRI"}
          </div>
        </div>
      </div>

      <PremiumGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title={isTR ? "Ritüel Alanı • Premium Kapı" : "Ritual Space • Premium Gate"}
        subtitle={
          isTR
            ? "Bu kapı, bilinç katmanı derin olanlara açılır.\nGiriş yap ve alanı aktive et."
            : "This gate opens for deeper layers.\nLog in and activate the space."
        }
        onRegister={handleRegister}
        onLogin={handleLogin}
      />
    </div>
  );
}