import React, { useMemo } from "react";
import styles from "../pages/RituelAlaniPage.module.css";
import { useDoor } from "../contexts/DoorNavContext";

export default function RituelJourney({ lang = "tr", flow, stepIndex, setStepIndex }) {
  const { go } = useDoor();

  const steps = useMemo(() => {
    if (!flow) return [];
    return flow.steps?.[lang] || flow.steps?.tr || [];
  }, [flow, lang]);

  const step = steps[stepIndex] || steps[0];
  const isLast = stepIndex >= steps.length - 1;

  const gotoSanri = () => {
    const prefill = flow?.prefill?.[lang] || flow?.prefill?.tr || "";
    const q = new URLSearchParams({ domain: "ritual_space", prefill }).toString();
    go(`/sanriya-sor?${q}`);
  };

  if (!flow || !step) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>
        {(flow.title?.[lang] || flow.title?.tr) + " • " + (step.t || "")}
      </div>

      <div className={styles.stepBody}>
        {(step.b || "").split("\n").map((line, i) => (
          <div key={i} className={styles.line}>{line || "\u00A0"}</div>
        ))}
      </div>

      <div className={styles.highlight}>
        {lang === "tr"
          ? "“Ritüel büyü değil; odak protokolüdür.”"
          : "“Ritual is not magic; it’s a focus protocol.”"}
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
          {lang === "tr" ? "SANRI’dan Ritüel İste →" : "Ask SANRI for Ritual →"}
        </button>
      </div>

      <div className={styles.note}>
        {lang === "tr"
          ? "Not: Kısa, uygulanabilir, güvenli pratikler. Tıbbi iddia içermez."
          : "Note: Short, practical, safe exercises. No medical claims."}
      </div>
    </div>
  );
}