import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PurchaseToast.module.css";

const CONTENT_ROUTES = {
  role_unlock: "/rol-okuma",
  okuma_devami: "/okuma",
  kod_giris_ders: "/kod-giris",
  kod_egitmeni: "/kod-giris",
  kitap_112: "/kutuphane",
  matrix_code: "/kutuphane",
  ankod_unlock: "/okuma",
  subconscious_unlock: "/okuma",
  deep_iliski_unlock: "/okuma",
  deep_kariyer_unlock: "/okuma",
  deep_genel_unlock: "/okuma",
};

function resolveRoute(contentId) {
  if (CONTENT_ROUTES[contentId]) return CONTENT_ROUTES[contentId];
  if (contentId?.startsWith("okuma_")) return "/okuma";
  if (contentId?.startsWith("book_")) return "/kutuphane";
  if (contentId?.startsWith("deep_")) return "/okuma";
  return "/benim-alanim";
}

export default function PurchaseToast({ items, onDismiss }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!items?.length) return;
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, [items]);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(() => dismiss(), 12000);
    return () => clearTimeout(timerRef.current);
  }, [visible]);

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 400);
  }, [onDismiss]);

  const handleGo = useCallback(
    (contentId) => {
      dismiss();
      setTimeout(() => navigate(resolveRoute(contentId)), 200);
    },
    [dismiss, navigate],
  );

  if (!items?.length || !visible) return null;

  return (
    <div className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}>
      <div className={styles.toast}>
        <button className={styles.closeBtn} onClick={dismiss} aria-label="Kapat">
          \u2715
        </button>
        <div className={styles.icon}>\u2728</div>
        <h3 className={styles.title}>
          {items.length === 1
            ? "Sat\u0131n ald\u0131\u011f\u0131n i\u00e7erik haz\u0131r!"
            : `${items.length} i\u00e7eri\u011fin haz\u0131r!`}
        </h3>
        <ul className={styles.list}>
          {items.map((it) => (
            <li key={it.content_id} className={styles.item}>
              <span className={styles.label}>{it.label}</span>
              <button
                className={styles.goBtn}
                onClick={() => handleGo(it.content_id)}
              >
                Git \u2192
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.mainBtn} onClick={() => handleGo(items[0].content_id)}>
          {items.length === 1 ? "\u0130\u00e7eri\u011fe Git" : "Benim Alan\u0131m'a Git"}
        </button>
      </div>
    </div>
  );
}
