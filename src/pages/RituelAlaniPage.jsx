// src/pages/RituelAlaniPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RituelAlaniPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio, playSfx } from "../utils/sfx";

// DATA
import { ritualFlows } from "../data/ritualFlows";

// (opsiyonel) auth context varsa kullan, yoksa patlatma
import { useAuth as useAuthMaybe } from "../contexts/AuthContext";

// (opsiyonel) door anim varsa kullan, yoksa navigate ile devam
import { useDoor as useDoorMaybe } from "../contexts/DoorNavContext";

function safeUseAuth() {
  try {
    const v = useAuthMaybe?.();
    if (v) return v;
  } catch {}
  return { isAuthenticated: false, isPremium: false, token: null, setToken: null };
}

function safeUseDoor() {
  try {
    const v = useDoorMaybe?.();
    if (v?.go) return v;
  } catch {}
  return null;
}

function tt(t, key, fallback) {
  try {
    const v = t?.(key);
    if (!v || v === key) return fallback;
    return v;
  } catch {
    return fallback;
  }
}

function RitualAudioBox({ src, isTR }) {
  const audioRef = useRef(null);

  useEffect(() => {
    // src değişince resetle
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [src]);

  if (!src) return null;

  return (
    <div className={styles.audioBox}>
      <div className={styles.audioLabel}>
        {isTR ? "Sesli Ritüel" : "Audio Ritual"}
      </div>
      <audio ref={audioRef} src={src} controls className={styles.audio} />
      <div className={styles.audioHint}>
        {isTR ? "Not: İlk play için ekrana dokunmuş olman gerekebilir." : "Note: You may need a first tap to enable audio."}
      </div>
    </div>
  );
}

function PremiumGateModal({
  open,
  onClose,
  title,
  subtitle,
  isTR,
  onLogin,
  onRegister,
}) {
  const [tab, setTab] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!open) return;
    setTab("login");
    setEmail("");
    setPassword("");
  }, [open]);

  if (!open) return null;

  const primaryText = isTR ? "✨ Frekansı Aktive Et" : "✨ Activate Frequency";

  const submit = async () => {
    unlockAudio();
    // küçük chime
    playSfx("/sfx/aura-chime.mp3", { volume: 0.35 });

    if (!email.trim() || !password.trim()) return;

    if (tab === "login") {
      await onLogin?.({ email: email.trim(), password: password.trim() });
    } else {
      await onRegister?.({ email: email.trim(), password: password.trim() });
    }
  };

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} type="button" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.modalTitle}>{title}</div>
        <div className={styles.modalSubtitle}>{subtitle}</div>

        <div className={styles.modalTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "login" ? styles.tabActive : ""}`}
            onClick={() => setTab("login")}
          >
            {isTR ? "Giriş" : "Login"}
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${tab === "register" ? styles.tabActive : ""}`}
            onClick={() => setTab("register")}
          >
            {isTR ? "Kayıt" : "Register"}
          </button>
        </div>

        <div className={styles.modalFields}>
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isTR ? "Email" : "Email"}
          />
          <input
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isTR ? "Şifre" : "Password"}
            type="password"
          />

          <button type="button" className={styles.activateBtn} onClick={submit}>
            {primaryText}
          </button>

          <div className={styles.modalFootnote}>
            {isTR
              ? "Not: Google ile giriş endpoint’in var (/api/auth/google/session). Onu da ekleriz; önce email login’i sağlamlaştıralım."
              : "Note: You have Google endpoint (/api/auth/google/session). We'll add it after email auth is stable."}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RituelAlaniPage() {
  const navigate = useNavigate();
  const door = safeUseDoor();
  const auth = safeUseAuth();

  const { language, setLanguage, t } = useLanguage();
  const isTR = language === "tr";

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const flows = useMemo(() => Array.isArray(ritualFlows) ? ritualFlows : [], []);
  const [activeKey, setActiveKey] = useState(flows?.[0]?.key || "vitrin_rituel");
  const [stepIndex, setStepIndex] = useState(0);
  const [gateOpen, setGateOpen] = useState(false);

  const activeFlow = useMemo(() => {
    return flows.find((f) => f.key === activeKey) || flows[0] || null;
  }, [flows, activeKey]);

  const flowTitle = useMemo(() => {
    if (!activeFlow) return "";
    return isTR ? activeFlow?.title?.tr : activeFlow?.title?.en;
  }, [activeFlow, isTR]);

  const flowDesc = useMemo(() => {
    if (!activeFlow) return "";
    return isTR ? activeFlow?.desc?.tr : activeFlow?.desc?.en;
  }, [activeFlow, isTR]);

  const flowAudio = useMemo(() => {
    if (!activeFlow) return "";
    const p = isTR ? activeFlow?.audio?.tr : activeFlow?.audio?.en;
    return p || "";
  }, [activeFlow, isTR]);

  const steps = useMemo(() => {
    if (!activeFlow) return [];
    return (isTR ? activeFlow?.steps?.tr : activeFlow?.steps?.en) || [];
  }, [activeFlow, isTR]);

  const currentStep = steps[stepIndex] || null;

  const goBackToGates = () => {
    unlockAudio();
    // “kapılara dön” sesi tek: whoosh
    playSfx("/sfx/door-whoosh.mp3", { volume: 0.75 });

    if (door?.go) {
      door.go("/", { state: { skipIntro: true } });
    } else {
      navigate("/", { state: { skipIntro: true } });
    }
  };

  const openFlow = (flow) => {
    unlockAudio();
    setStepIndex(0);
    setActiveKey(flow.key);

    if (flow.premium && !(auth?.isAuthenticated && auth?.isPremium)) {
      setGateOpen(true);
    }
  };

  const handleRegister = async ({ email, password }) => {
    try {
      if (!API_URL) throw new Error(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/api/auth/email/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || (isTR ? "Kayıt başarısız." : "Register failed."));
      setGateOpen(false);
      alert(isTR ? "Kayıt alındı. Şimdi giriş yap." : "Registered. Now log in.");
    } catch (e) {
      alert(e?.message || "Register error");
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      if (!API_URL) throw new Error(isTR ? "VITE_BACKEND_URL eksik." : "Missing VITE_BACKEND_URL.");
      const res = await fetch(`${API_URL}/api/auth/email/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || (isTR ? "Giriş başarısız." : "Login failed."));
      // eğer backend token dönerse kaydet (opsiyonel)
      const token = data?.token || data?.access_token || null;
      if (token && auth?.setToken) auth.setToken(token);
      setGateOpen(false);
      alert(isTR ? "Giriş başarılı." : "Logged in.");
    } catch (e) {
      alert(e?.message || "Login error");
    }
  };

  const goAskSanri = () => {
    unlockAudio();
    // burada “kapı açılıyor” sesi yerine küçük chime yeter
    playSfx("/sfx/aura-chime.mp3", { volume: 0.3 });
    const prefill = isTR
      ? `Ritüel adımı: ${currentStep?.t || ""}\nBana bu adımın tek bir yansımasını ver.`
      : `Ritual step: ${currentStep?.t || ""}\nGive me one clear reflection for this step.`;
    const path = `/sanriya-sor?domain=ritual_space&prefill=${encodeURIComponent(prefill)}`;

    if (door?.go) door.go(path);
    else navigate(path);
  };

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>
            {isTR ? "Ritüel Alanı • Frekans Protokolleri" : "Ritual Space • Frequency Protocols"}
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
        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.sectionTitle}>{isTR ? "RİTÜELLER" : "RITUALS"}</div>

            <div className={styles.list}>
              {flows.map((f) => {
                const active = f.key === activeKey;
                const ft = isTR ? f?.title?.tr : f?.title?.en;
                const fd = isTR ? f?.desc?.tr : f?.desc?.en;
                return (
                  <button
                    key={f.key}
                    type="button"
                    className={`${styles.ritualItem} ${active ? styles.ritualItemActive : ""}`}
                    onClick={() => openFlow(f)}
                  >
                    <div className={styles.ritualItemRow}>
                      <div className={styles.ritualItemTitle}>{ft}</div>
                      <div className={styles.badges}>
                        {f.premium ? (
                          <span className={styles.badgePremium}>{isTR ? "PREMIUM" : "PREMIUM"}</span>
                        ) : (
                          <span className={styles.badgeFree}>{isTR ? "ÜCRETSİZ" : "FREE"}</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.ritualItemDesc}>{fd}</div>
                  </button>
                );
              })}
            </div>

            <div className={styles.noteBox}>
              {isTR
                ? "Not: Premium ritüeller kilitli. Vitrin ritüeli merak uyandırmak içindir."
                : "Note: Premium rituals are locked. The showcase ritual is designed to spark curiosity."}
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.header}>
              <div className={styles.kicker}>{isTR ? "SEÇİLİ RİTÜEL" : "SELECTED RITUAL"}</div>
              <div className={styles.bigTitle}>{flowTitle}</div>
              <div className={styles.desc}>{flowDesc}</div>
            </div>

            <RitualAudioBox src={flowAudio} isTR={isTR} />

            <div className={styles.stepsCard}>
              <div className={styles.stepsHeader}>
                <div className={styles.stepsTitle}>{isTR ? "Adımlar" : "Steps"}</div>

                <button type="button" className={styles.askBtn} onClick={goAskSanri}>
                  {isTR ? "SANRI’ya Sor →" : "Ask SANRI →"}
                </button>
              </div>

              {currentStep ? (
                <div className={styles.step}>
                  <div className={styles.stepTag}>{currentStep.t}</div>
                  <div className={styles.stepBody}>{currentStep.b}</div>
                </div>
              ) : (
                <div className={styles.stepEmpty}>
                  {isTR ? "Bu ritüelde adım yok." : "No steps in this ritual."}
                </div>
              )}

              <div className={styles.stepNav}>
                <button
                  type="button"
                  className={styles.navBtn}
                  onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
                  disabled={stepIndex <= 0}
                >
                  {isTR ? "← Geri" : "← Back"}
                </button>

                <div className={styles.stepCount}>
                  {steps.length ? `${stepIndex + 1} / ${steps.length}` : "—"}
                </div>

                <button
                  type="button"
                  className={styles.navBtnPrimary}
                  onClick={() => setStepIndex((s) => Math.min(steps.length - 1, s + 1))}
                  disabled={stepIndex >= steps.length - 1}
                >
                  {isTR ? "Devam →" : "Next →"}
                </button>
              </div>
            </div>

            <div className={styles.footerTag}>
              Caelinus AI • Ritüel Alanı
            </div>
          </div>
        </div>
      </div>

      <PremiumGateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        title={isTR ? "Ritüel Alanı • Premium Kapı" : "Ritual Space • Premium Gate"}
        subtitle={
          isTR
            ? "Bu kapı, bilinç katmanı derin olanlara açılır. Giriş yap ve alanı aktive et."
            : "This gate opens for deeper layers. Log in and activate the space."
        }
        isTR={isTR}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </div>
  );
}