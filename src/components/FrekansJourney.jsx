import React, { useMemo } from "react";
import styles from "../pages/FrekansPage.module.css";
import { useDoor } from "../contexts/DoorNavContext";

export default function FrekansJourney({ lang = "tr", door, stepIndex, setStepIndex }) {
  const { go } = useDoor();

  const steps = useMemo(() => {
    if (!door) return [];
    return door.steps?.[lang] || door.steps?.tr || [];
  }, [door, lang]);

  const step = steps[stepIndex] || steps[0];
  const isLast = stepIndex >= steps.length - 1;

  const gotoSanri = () => {
    const prefill = door?.prefill?.[lang] || door?.prefill?.tr || "";
    const q = new URLSearchParams({ domain: "frequency_field", prefill }).toString();
    go(`/sanriya-sor?${q}`);
  };

  if (!door || !step) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>
        {(door.title?.[lang] || door.title?.tr) + " • " + (step.t || "")}
      </div>

      <div className={styles.stepBody}>
        {(step.b || "").split("\n").map((line, i) => (
          <div key={i} className={styles.line}>{line || "\u00A0"}</div>
        ))}
      </div>

      <div className={styles.highlight}>
        {lang === "tr"
          ? "“Seçim tekrarlandığında frekans olur.”"
          : "“Repeated choice becomes frequency.”"}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setStepIndex((s) => Math.max(0, s - 1))}
          disabled={stepIndex === 0}
        >
          ← {lang === "tr" ? "Geri" : "Back"}
        </button>

        <button
          type="button"
          className={styles.btn}
          onClick={() => setStepIndex((s) => Math.min(steps.length - 1, s + 1))}
          disabled={isLast}
        >
          {lang === "tr" ? "Devam" : "Next"} →
        </button>

        <button type="button" className={styles.primary} onClick={gotoSanri}>
          {lang === "tr" ? "SANRI’ya Sor →" : "Ask SANRI →"}
        </button>
      </div>

      <div className={styles.note}>
        {lang === "tr"
          ? "Not: Frekans bir hedef değil; yön. Küçük seçimler büyük akışa dönüşür."
          : "Note: Frequency is not a goal; it’s a direction. Small choices become big flow."}
      </div>
    </div>
  );
}