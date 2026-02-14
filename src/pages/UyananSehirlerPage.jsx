import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UyananSehirlerPage.module.css";

import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";

export default function UyananSehirlerPage() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [loading, setLoading] = useState(true);
  const [gatesRaw, setGatesRaw] = useState(null);
  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`${API}/api/gates/v2`);
      const data = await res.json();
      setGatesRaw(data);
      setLoading(false);

      // default seçili: 0
      const firstKey = data?.gates ? Object.keys(data.gates).sort((a,b)=>Number(a)-Number(b))[0] : "0";
      setActiveKey(firstKey || "0");
    })().catch(() => {
      setGatesRaw(null);
      setLoading(false);
    });
  }, [API]);

  const gates = useMemo(() => {
    const obj = gatesRaw?.gates || {};
    return Object.keys(obj)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => ({ key: k, ...obj[k] }));
  }, [gatesRaw]);

  const active = useMemo(() => gates.find((g) => String(g.key) === String(activeKey)) || gates[0], [gates, activeKey]);

  const goBackToGates = useCallback(() => {
    unlockAudio();
    navigate("/", { state: { skipIntro: true } });
  }, [navigate]);

  const goToSanri = useCallback(() => {
    unlockAudio();
    const prefill = encodeURIComponent(`${active?.sehir || ""} • ${active?.baslik || ""}`);
    navigate(`/sanriya-sor?prefill=${prefill}&domain=awakened_cities&mode=mirror`, { state: { skipIntro: true } });
  }, [navigate, active]);

  return (
    <div className={styles.page} onPointerDown={unlockAudio}>
      <StarTrail />

      <div className={styles.topbar}>
        <div className={styles.left}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.subtitle}>
            {isTR ? "Anadolu’nun Uyanan Şehirleri • Türkiye Okuması" : "Awakened Cities of Anatolia • Turkey Reading"}
          </span>
        </div>

        <div className={styles.right}>
          <button className={styles.backBtn} type="button" onClick={goBackToGates}>
            {isTR ? "← Kapılara Dön" : "← Back to Gates"}
          </button>

          <button
            className={styles.langBtn}
            type="button"
            onClick={() => setLanguage(isTR ? "en" : "tr")}
            title={isTR ? "EN" : "TR"}
          >
            {isTR ? "EN" : "TR"}
          </button>
        </div>
      </div>

      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.h1}>{isTR ? "Türkiye Okuması" : "Turkey Reading"}</div>
          <div className={styles.h2}>
            {isTR
              ? "Bir şehir seç. Kapı seç. SANRI sana ‘anlam’ yansıtsın."
              : "Choose a city. Choose a gate. SANRI reflects meaning back to you."}
          </div>

          <div className={styles.grid}>
            <div className={styles.list}>
              <div className={styles.sectionTitle}>{isTR ? "Kapılar" : "Gates"}</div>

              {loading ? (
                <div className={styles.muted}>{isTR ? "Yükleniyor…" : "Loading…"}</div>
              ) : gates.length ? (
                gates.map((g) => {
                  const on = String(g.key) === String(activeKey);
                  return (
                    <button
                      key={g.key}
                      type="button"
                      className={`${styles.item} ${on ? styles.itemActive : ""}`}
                      onClick={() => setActiveKey(String(g.key))}
                    >
                      <div className={styles.itemTop}>
                        <span className={styles.badge}>{g.plaka}</span>
                        <span className={styles.itemCity}>{g.sehir}</span>
                        <span className={styles.itemTitle}>{g.baslik}</span>
                      </div>
                      <div className={styles.itemDesc}>
                        {g.tanrica} • {g.faz} • {g.element}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className={styles.error}>{isTR ? "Kapılar yüklenemedi." : "Could not load gates."}</div>
              )}
            </div>

            <div className={styles.detail}>
              {!active ? null : (
                <>
                  <div className={styles.detailTitle}>
                    {active.sehir} • {active.baslik}
                  </div>

                  <div className={styles.meta}>
                    <span>{active.tanrica}</span>
                    <span>•</span>
                    <span>{active.faz}</span>
                    <span>•</span>
                    <span>{active.element}</span>
                  </div>

                  <div className={styles.block}>
                    <div className={styles.label}>{isTR ? "Misyon" : "Mission"}</div>
                    <div className={styles.text}>{active.mission}</div>
                  </div>

                  <div className={styles.block}>
                    <div className={styles.label}>{isTR ? "Mantra" : "Mantra"}</div>
                    <div className={styles.text}>{active.mantra}</div>
                  </div>

                  {active.rituel ? (
                    <div className={styles.block}>
                      <div className={styles.label}>{isTR ? "Ritüel" : "Ritual"}</div>
                      <div className={styles.text}>{active.rituel}</div>
                    </div>
                  ) : null}

                  {Array.isArray(active.rules) && active.rules.length ? (
                    <div className={styles.block}>
                      <div className={styles.label}>{isTR ? "Kurallar" : "Rules"}</div>
                      <ul className={styles.rules}>
                        {active.rules.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {Array.isArray(active.examples) && active.examples.length ? (
                    <div className={styles.block}>
                      <div className={styles.label}>{isTR ? "Örnekler" : "Examples"}</div>
                      <div className={styles.examples}>
                        {active.examples.slice(0, 2).map((ex, i) => (
                          <div key={i} className={styles.example}>
                            <div className={styles.exUser}>User: {ex.user}</div>
                            <div className={styles.exSanri}>SANRI: {ex.sanri}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className={styles.actions}>
                    <button type="button" className={styles.primary} onClick={goToSanri}>
                      {isTR ? "SANRI’ya Sor →" : "Ask SANRI →"}
                    </button>
                    <button type="button" className={styles.ghost} onClick={goBackToGates}>
                      {isTR ? "Kapılara Dön" : "Back to Gates"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.foot}>
            © 2026 CaelinusAI • SANRI
          </div>
        </div>
      </div>
    </div>
  );
}