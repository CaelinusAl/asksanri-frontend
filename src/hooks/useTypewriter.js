import { useEffect, useRef, useState } from "react";

/**
 * Human-like typewriter:
 * - random jitter
 * - punctuation pauses
 * - newline pauses
 * - configurable speed
 */
export function useTypewriter(text, options = {}) {
  const {
    enabled = true,
    baseSpeed = 14, // ms (lower = faster)
    jitter = 12, // +- ms
    chunkMin = 1,
    chunkMax = 3,
    pausePunct = 220, // extra pause on .,!?
    pauseComma = 90, // extra pause on ,:;
    pauseNewline = 260, // extra pause on \n
    startDelay = 120, // delay before start typing
  } = options;

  const [shown, setShown] = useState("");
  const iRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setShown(text || "");
      return;
    }

    const full = String(text || "");
    setShown("");
    iRef.current = 0;

    const clear = () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const step = () => {
      const i = iRef.current;
      if (i >= full.length) {
        clear();
        return;
      }

      const take = rand(chunkMin, chunkMax);
      const next = full.slice(i, i + take);
      iRef.current = i + take;
      setShown((prev) => prev + next);

      // base delay
      let delay = baseSpeed + rand(-jitter, jitter);

      const lastChar = next.slice(-1);

      if (lastChar === "\n") delay += pauseNewline;
      else if (".!?".includes(lastChar)) delay += pausePunct;
      else if (",;:".includes(lastChar)) delay += pauseComma;

      timerRef.current = window.setTimeout(step, Math.max(6, delay));
    };

    timerRef.current = window.setTimeout(step, startDelay);

    return clear;
  }, [text, enabled, baseSpeed, jitter, chunkMin, chunkMax, pausePunct, pauseComma, pauseNewline, startDelay]);

  return shown;
}