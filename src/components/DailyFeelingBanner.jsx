import React, { useEffect, useState } from "react";
import { getDailyPrompt } from "../data/sanriIdentity";
import styles from "../pages/AnlasilmaAlaniPage.module.css";

const API_BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "https://sanri-api-production-4a7b.up.railway.app"
).replace(/\/$/, "");

const HZ_CHAKRA_COLOR = {
  396: "#c44f6a",
  417: "#d97845",
  528: "#5cdb9a",
  639: "#4ec9d4",
  741: "#64b5f6",
  852: "#9575cd",
  963: "#ba68c8",
};

export default function DailyFeelingBanner({ isTR = true }) {
  const [data, setData] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/content/daily-feeling`);
        if (!res.ok) throw new Error("api");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setData({
            feeling_tr: getDailyPrompt("tr"),
            feeling_en: getDailyPrompt("en"),
            top_frequency: 528,
            active_count: 0,
            _fallback: true,
          });
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (dismissed || !data) return null;

  const text = isTR ? data.feeling_tr : data.feeling_en;
  if (!text) return null;

  const hz = data.top_frequency || 528;
  const color = HZ_CHAKRA_COLOR[hz] || "#5cdb9a";
  const count = data.active_count || 0;

  return (
    <div className={styles.dailyFeelingBanner} style={{ "--feeling-color": color }}>
      <button
        type="button"
        className={styles.dailyFeelingClose}
        onClick={() => setDismissed(true)}
        aria-label="Kapat"
      >
        &times;
      </button>
      <p className={styles.dailyFeelingText}>{text}</p>
      {count > 0 && (
        <span className={styles.dailyFeelingMeta}>
          {hz} Hz
          {" · "}
          {isTR ? `${count} kişi bu histe` : `${count} people feeling this`}
        </span>
      )}
    </div>
  );
}
