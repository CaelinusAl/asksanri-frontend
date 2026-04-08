import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../pages/AnlasilmaAlaniPage.module.css";
import {
  getAnlasilmaSessionId,
  anlasilmaEnter,
  anlasilmaChatQueue,
  anlasilmaChatPoll,
  anlasilmaChatSend,
  anlasilmaChatMessages,
  shareIntentToYankiField,
} from "../../data/anlasilmaApi";
import {
  inferEmotionFrequency,
  buildSyntheticEnterResult,
} from "../../data/emotionFrequencyEngine";
import { suggestOkumaByFrequency } from "../../data/okumaData";
import { trackFunnelEvent } from "../../data/funnelTracker";

const HZ_LIST = [396, 417, 528, 639, 741, 852, 963];
const HZ_SET = new Set(HZ_LIST);
/** Solfeggio → çakra rengi + kısa açıklama (duyusal rehber) */
const HZ_CHAKRA = {
  396: {
    nameTr: "Kök",
    nameEn: "Root",
    color: "#c44f6a",
    descTr: "Yere inme, güven ve var olma hissi — bedenin tabanı.",
    descEn: "Grounding, safety, being here — the base of the body.",
  },
  417: {
    nameTr: "Sakral",
    nameEn: "Sacral",
    color: "#d97845",
    descTr: "Duyguların akışı; değişime izin veren yumuşak hareket.",
    descEn: "Emotional flow; gentle movement that allows change.",
  },
  528: {
    nameTr: "Kalp merkezi",
    nameEn: "Heart center",
    color: "#5cdb9a",
    descTr: "Şifa ve denge frekansı — nefesle genişleyen bir merkez.",
    descEn: "Healing and balance — a center that widens with the breath.",
  },
  639: {
    nameTr: "Bağ & uyum",
    nameEn: "Connection",
    color: "#4ec9d4",
    descTr: "Yakınlık ve uyum; başka bir kalple aynı frekansta durmak.",
    descEn: "Closeness and harmony; standing on the same frequency as another.",
  },
  741: {
    nameTr: "Boğaz",
    nameEn: "Throat",
    color: "#64b5f6",
    descTr: "İçten geleni kelimelere dökmek; netlik ve ifade.",
    descEn: "Turning inner truth into words; clarity and expression.",
  },
  852: {
    nameTr: "Alın",
    nameEn: "Third eye",
    color: "#9575cd",
    descTr: "İç görü ve sezgi — sessizce fark etme.",
    descEn: "Insight and intuition — noticing without noise.",
  },
  963: {
    nameTr: "Taç",
    nameEn: "Crown",
    color: "#ba68c8",
    descTr: "Bütünleşme ve sessiz bilinç — sınırın ötesinde bir açılım.",
    descEn: "Wholeness and quiet consciousness — opening beyond the edge.",
  },
};
const INTENT_MAX = 160;
const CHAT_POLL_MS = 4000;
const APPROACH_MIN_MS = 900;

const LAST_SESSION_KEY = "sanri_anlasilma_last";

function saveLastSession(data) {
  try {
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify({ ...data, ts: Date.now() }));
  } catch {}
}

function loadLastSession() {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - d.ts > 7 * 24 * 60 * 60 * 1000) return null;
    return d;
  } catch {
    return null;
  }
}

function liveFreqCount(hz) {
  const hour = new Date().getHours();
  const seed = (hz || 528) + hour * 7 + new Date().getDate() * 3;
  const base = 12 + (seed % 35);
  return base + (hour >= 18 && hour <= 22 ? 8 : hour >= 8 && hour <= 10 ? 4 : 0);
}

const EMOTION_PRESETS = [
  "Yorgunluk",
  "Merak",
  "Umut",
  "Kaygı",
  "Sakinlik",
  "Öfke",
  "Yalnızlık",
  "Yakınlık",
  "Hafiflik",
  "Ağırlık",
];

function parseSlowWaitSec(detail) {
  if (!detail || typeof detail !== "string") return null;
  const m = detail.match(/slow_mode_wait_(\d+)s/i);
  return m ? parseInt(m[1], 10) : null;
}

function errDetail(e) {
  if (!e) return "";
  if (typeof e.message === "string" && e.message) return e.message;
  const d = e.body?.detail;
  return typeof d === "string" ? d : "";
}

/** İlk 1–2 cümle + kalan — “anlaşıldım” anı */
function splitLeadRest(text, maxSentences = 2) {
  if (!text || typeof text !== "string") return { lead: "", rest: "" };
  const t = text.trim();
  const parts = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  if (parts.length <= maxSentences) {
    if (parts.length === 1 && parts[0].length > 220) {
      return { lead: `${parts[0].slice(0, 217).trim()}…`, rest: "" };
    }
    return { lead: t, rest: "" };
  }
  return {
    lead: parts.slice(0, maxSentences).join(" ").trim(),
    rest: parts.slice(maxSentences).join(" ").trim(),
  };
}

/**
 * Anlaşılma akışı — tek sayfa veya Yankı Alanı içinde gömülü.
 */
export default function AnlasilmaPanel({
  isTR = true,
  embedded = false,
  frequencyHz: frequencyHzProp,
  onFrequencyChange,
  onClose,
}) {
  const navigate = useNavigate();
  const hisselLink = "/yanki?tab=hisset";

  const sessionId = useMemo(() => getAnlasilmaSessionId(), []);
  const lastSession = useMemo(() => loadLastSession(), []);
  const [showReturnBanner, setShowReturnBanner] = useState(() => !!lastSession);
  const [phase, setPhase] = useState("feel");
  const [liveCount, setLiveCount] = useState(0);
  const initialHz =
    frequencyHzProp != null && HZ_SET.has(frequencyHzProp) ? frequencyHzProp : null;
  const [hz, setHz] = useState(initialHz);
  /** Metin + etiket analizi çıktısı (frekans önerisi + açıklama) */
  const [engineResult, setEngineResult] = useState(null);
  const [intent, setIntent] = useState("");
  const [tags, setTags] = useState([]);
  const [enterResult, setEnterResult] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [chatRoomId, setChatRoomId] = useState(null);
  const [chatWaiting, setChatWaiting] = useState(false);
  const [chatStatus, setChatStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [afterId, setAfterId] = useState(0);
  const [chatDraft, setChatDraft] = useState("");
  const [sendBlockedSec, setSendBlockedSec] = useState(0);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareMessage, setShareMessage] = useState(null);

  const pollRef = useRef(null);
  const msgPollRef = useRef(null);
  const afterIdRef = useRef(0);

  useEffect(() => {
    if (frequencyHzProp != null && HZ_SET.has(frequencyHzProp)) {
      setHz((prev) => (prev === frequencyHzProp ? prev : frequencyHzProp));
      setEngineResult(null);
    }
  }, [frequencyHzProp]);

  const setHzBoth = (n) => {
    setHz(n);
    onFrequencyChange?.(n);
  };

  const resolveHz = () => {
    if (hz != null && HZ_SET.has(hz)) return hz;
    const t = intent.trim();
    if (!t) return 417;
    return inferEmotionFrequency({
      text: t,
      tagLabels: tags,
      locale: isTR ? "tr" : "en",
    }).frequency;
  };

  const goToFreqPhase = () => {
    const t = intent.trim();
    if (!t) return;
    trackFunnelEvent("anlasilma_page_view");
    if (frequencyHzProp != null && HZ_SET.has(frequencyHzProp)) {
      setEngineResult(null);
      setHzBoth(frequencyHzProp);
    } else {
      const r = inferEmotionFrequency({
        text: t,
        tagLabels: tags,
        locale: isTR ? "tr" : "en",
      });
      setEngineResult(r);
      setHzBoth(r.frequency);
    }
    setPhase("freq");
  };

  const clearPolls = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (msgPollRef.current) {
      clearInterval(msgPollRef.current);
      msgPollRef.current = null;
    }
  }, []);

  useEffect(() => () => clearPolls(), [clearPolls]);

  useEffect(() => {
    if (sendBlockedSec <= 0) return undefined;
    const t = setTimeout(() => setSendBlockedSec((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [sendBlockedSec]);

  useEffect(() => {
    if (phase !== "result" || !hz) return;
    setLiveCount(liveFreqCount(hz));
    const t = setInterval(() => {
      setLiveCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(5, prev + delta);
      });
    }, 8000 + Math.random() * 5000);
    return () => clearInterval(t);
  }, [phase, hz]);

  const toggleTag = (t) => {
    setTags((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 3) return prev;
      return [...prev, t];
    });
  };

  useEffect(() => {
    afterIdRef.current = afterId;
  }, [afterId]);

  useEffect(() => {
    if (!chatRoomId) return undefined;
    const poll = () => {
      anlasilmaChatMessages({
        roomId: chatRoomId,
        sessionId,
        afterId: afterIdRef.current,
      })
        .then((data) => {
          const list = data.messages || [];
          if (list.length) {
            setMessages((m) => [...m, ...list]);
            const last = list[list.length - 1].id;
            afterIdRef.current = last;
            setAfterId(last);
          }
        })
        .catch(() => {});
    };
    poll();
    msgPollRef.current = setInterval(poll, CHAT_POLL_MS);
    return () => {
      if (msgPollRef.current) {
        clearInterval(msgPollRef.current);
        msgPollRef.current = null;
      }
    };
  }, [chatRoomId, sessionId]);

  const carryNavigate = (payload) => {
    navigate(
      { pathname: "/yanki", search: "?tab=hisset" },
      {
        state: {
          fromAnlasilma: true,
          anlasilmaIntent: intent.trim(),
          anlasilmaHz: hz,
          anlasilmaTags: tags,
          ...payload,
        },
      }
    );
  };

  const suggestedOkuma = useMemo(() => {
    if (!hz) return [];
    return suggestOkumaByFrequency(hz, 3);
  }, [hz]);

  const onSubmitIntent = async () => {
    const trimmed = intent.trim();
    if (!trimmed || trimmed.length > INTENT_MAX) return;
    setError(null);
    setSubmitting(true);
    setPhase("approaching");
    trackFunnelEvent("anlasilma_input_submit");
    const hzSend = resolveHz();
    const minWait = new Promise((r) => setTimeout(r, APPROACH_MIN_MS));

    let apiData = null;
    try {
      const [data] = await Promise.all([
        anlasilmaEnter({
          sessionId,
          frequencyHz: hzSend,
          intentText: trimmed,
          emotionTags: tags,
        }),
        minWait,
      ]);
      apiData = data;
    } catch {
      await minWait;
      apiData = buildSyntheticEnterResult(engineResult);
    }

    clearPolls();
    saveLastSession({ hz: hzSend, intent: trimmed, tags });
    if (embedded) {
      setEnterResult(apiData);
      setPhase("result");
      setChatRoomId(null);
      setChatWaiting(false);
      setMessages([]);
      setAfterId(0);
    } else {
      carryNavigate({
        anlasilmaEnter: apiData,
        anlasilmaHz: hzSend,
        anlasilmaEngine: engineResult,
      });
    }
    setSubmitting(false);
  };

  const openChatQueue = async () => {
    setError(null);
    setChatStatus("");
    try {
      const out = await anlasilmaChatQueue({ sessionId, frequencyHz: resolveHz() });
      if (out.status === "paired" && out.room_id) {
        setChatRoomId(out.room_id);
        setChatWaiting(false);
        setChatStatus(out.message || "");
        setMessages([]);
        setAfterId(0);
        await anlasilmaChatMessages({ roomId: out.room_id, sessionId, afterId: 0 }).then((data) => {
          const list = data.messages || [];
          setMessages(list);
          if (list.length) setAfterId(list[list.length - 1].id);
        });
      } else {
        setChatWaiting(true);
        setChatStatus(out.message || "");
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
          try {
            const p = await anlasilmaChatPoll({ sessionId, frequencyHz: resolveHz() });
            if (p.status === "paired" && p.room_id) {
              clearInterval(pollRef.current);
              pollRef.current = null;
              setChatRoomId(p.room_id);
              setChatWaiting(false);
              setChatStatus("");
              setMessages([]);
              setAfterId(0);
              const data = await anlasilmaChatMessages({
                roomId: p.room_id,
                sessionId,
                afterId: 0,
              });
              const list = data.messages || [];
              setMessages(list);
              if (list.length) setAfterId(list[list.length - 1].id);
            }
          } catch {
            /* keep polling */
          }
        }, CHAT_POLL_MS);
      }
    } catch (e) {
      setError(e.message || "");
    }
  };

  const sendChat = async () => {
    const t = chatDraft.trim();
    if (!t || !chatRoomId || sendBlockedSec > 0) return;
    setChatDraft("");
    try {
      await anlasilmaChatSend({ sessionId, roomId: chatRoomId, text: t });
      const data = await anlasilmaChatMessages({ roomId: chatRoomId, sessionId, afterId });
      const list = data.messages || [];
      if (list.length) {
        const last = list[list.length - 1].id;
        setMessages((m) => [...m, ...list]);
        afterIdRef.current = last;
        setAfterId(last);
      }
    } catch (e) {
      if (e.status === 429) {
        const w = parseSlowWaitSec(errDetail(e)) ?? 28;
        setSendBlockedSec(w);
        setChatDraft(t);
      } else {
        setError(errDetail(e) || "");
      }
    }
  };

  const shareToYanki = async () => {
    const text = intent.trim();
    if (!text || !enterResult) return;
    setShareMessage(null);
    setShareLoading(true);
    try {
      const out = await shareIntentToYankiField({
        sessionId,
        frequencyHz: resolveHz(),
        text,
        emotionTags: tags,
      });
      setShareMessage(
        out.dedup
          ? (isTR ? "Bu niyet zaten kolektif akışta." : "This intent is already in the stream.")
          : (isTR ? "Niyetin Yankı alanına düştü — isim yok, sadece his." : "Your intent entered the echo field — nameless.")
      );
    } catch (e) {
      setShareMessage(errDetail(e) || "");
    } finally {
      setShareLoading(false);
    }
  };

  const shareFreqCard = useCallback(async () => {
    const safeChakra = HZ_CHAKRA[hz] || HZ_CHAKRA[528];
    const text = `${hz} Hz · ${safeChakra.nameTr}\n"${intent.trim().slice(0, 60)}${intent.trim().length > 60 ? "…" : ""}"\n\nasksanri.com`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `SANRI · ${hz} Hz`, text });
        return;
      } catch { /* fallback */ }
    }
    try {
      await navigator.clipboard.writeText(text);
    } catch { /* silent */ }
  }, [hz, intent]);

  const restoreLastSession = useCallback(() => {
    if (!lastSession) return;
    const restoredIntent = lastSession.intent || "";
    const restoredTags = lastSession.tags || [];
    const restoredHz = lastSession.hz && HZ_SET.has(lastSession.hz) ? lastSession.hz : null;
    setIntent(restoredIntent);
    setTags(restoredTags);
    setShowReturnBanner(false);
    if (restoredHz) {
      setHzBoth(restoredHz);
      const r = inferEmotionFrequency({ text: restoredIntent, tagLabels: restoredTags, locale: "tr" });
      setEngineResult(r);
    }
    setPhase("freq");
    trackFunnelEvent("anlasilma_page_view");
  }, [lastSession]);

  const back = () => {
    if (phase === "feel") {
      if (embedded && onClose) onClose();
      else navigate("/kapilar");
      return;
    }
    if (phase === "freq") setPhase("feel");
    else if (phase === "approaching") {
      /* locked */
    } else {
      setPhase("freq");
      setEnterResult(null);
      clearPolls();
      setChatRoomId(null);
      setChatWaiting(false);
      setMessages([]);
    }
  };

  const rootCls = embedded ? styles.rootEmbedded : styles.root;
  const safeHz = hz != null && HZ_SET.has(hz) ? hz : 417;
  const chakra = HZ_CHAKRA[safeHz];
  const spotlightBody =
    engineResult && hz === engineResult.frequency
      ? engineResult.message
      : isTR
        ? chakra.descTr
        : chakra.descEn;

  return (
    <div className={rootCls}>
      {!embedded && <div className={styles.gridBg} aria-hidden />}
      <div className={`${styles.inner} ${styles[`phase_${phase}`] || ""}`}>
        <button type="button" className={styles.back} onClick={back}>
          ←
          {phase === "feel"
            ? embedded
              ? isTR
                ? "Sekmeler"
                : "Tabs"
              : isTR
                ? "Kapılar"
                : "Gates"
            : isTR
              ? "Hisse dön"
              : "Back to feeling"}
        </button>

        {phase === "feel" && showReturnBanner && lastSession && (
          <div className={styles.returnBanner}>
            <p className={styles.returnTitle}>
              {isTR ? "Son kaldığın yer burası" : "You left off here"}
            </p>
            <p className={styles.returnSub}>
              {lastSession.hz} Hz · {(HZ_CHAKRA[lastSession.hz] || HZ_CHAKRA[528]).nameTr}
              {lastSession.intent ? ` — "${lastSession.intent.slice(0, 40)}${lastSession.intent.length > 40 ? "…" : ""}"` : ""}
            </p>
            <div className={styles.returnActions}>
              <button type="button" className={styles.returnResume} onClick={restoreLastSession}>
                {isTR ? "Devam et" : "Resume"}
              </button>
              <button type="button" className={styles.returnDismiss} onClick={() => setShowReturnBanner(false)}>
                {isTR ? "Yeni başla" : "Start fresh"}
              </button>
            </div>
          </div>
        )}

        {phase === "feel" ? (
          <>
            <h1 className={styles.feelHeadline}>
              {isTR ? "Şu an gerçekten ne hissediyorsun?" : "What are you really feeling, right now?"}
            </h1>
          </>
        ) : phase === "freq" ? (
          <>
            <h1 className={styles.title}>{isTR ? "Anlaşılma Alanı" : "Field of Being Understood"}</h1>
            <p className={styles.sub}>
              {isTR
                ? "Metnine göre bir frekans önerildi; istersen başka Hz ile değiştirebilirsin."
                : "A frequency was suggested from your words; you can switch to another Hz if you wish."}
            </p>
          </>
        ) : null}

        {phase === "result" && (
          <>
            <h1 className={`${styles.title} ${styles.titleFade}`}>{isTR ? "Anlaşılma Alanı" : "Field of Being Understood"}</h1>
          </>
        )}

        {error && (
          <div className={styles.err} role="alert">
            {error}
          </div>
        )}

        {phase === "feel" && (
          <div className={`${styles.card} ${styles.cardFeel}`}>
            <textarea
              className={`${styles.textarea} ${styles.feelTextarea}`}
              value={intent}
              maxLength={INTENT_MAX}
              onChange={(e) => setIntent(e.target.value)}
              placeholder={isTR ? "İçinde kalan şeyi yaz…" : "Write what’s still inside…"}
              rows={5}
              autoFocus
            />
            <div className={styles.counter}>
              {intent.length}/{INTENT_MAX}
            </div>
            <details className={styles.tagDetails}>
              <summary className={styles.tagSummary}>
                {isTR ? "İstersen birkaç duygu seç (isteğe bağlı)" : "Optionally pick a few feelings"}
              </summary>
              <div className={styles.tagRow}>
                {EMOTION_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tag} ${tags.includes(t) ? styles.tagOn : ""}`}
                    onClick={() => toggleTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </details>
            <button
              type="button"
              className={`${styles.primary} ${styles.primarySoft}`}
              disabled={!intent.trim()}
              onClick={goToFreqPhase}
            >
              {isTR ? "Devam" : "Continue"}
            </button>
          </div>
        )}

        {phase === "freq" && (
          <>
            <span className={styles.label}>
              {isTR ? "Duygu analizi · frekans önerisi" : "Emotion scan · frequency suggestion"}
            </span>
            <div
              className={styles.hzGlowWrap}
              style={{
                "--chakra-color": chakra.color,
                "--chakra-glow": `${chakra.color}55`,
              }}
            >
              <div className={styles.hzRow}>
                {HZ_LIST.map((n) => {
                  const ch = HZ_CHAKRA[n];
                  return (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.hzBtn} ${hz === n ? styles.hzBtnActive : ""} ${
                        engineResult && n === engineResult.frequency ? styles.hzBtnSuggested : ""
                      }`}
                      style={{
                        "--btn-chakra": ch.color,
                        ...(hz === n ? { "--btn-chakra-dim": `${ch.color}55` } : {}),
                      }}
                      onClick={() => setHzBoth(n)}
                    >
                      <span className={styles.hzTopLine}>
                        <span className={styles.hzHz}>{n}</span>
                        <span className={styles.hzUnit}>Hz</span>
                      </span>
                      <span className={styles.hzChakraMini}>{isTR ? ch.nameTr : ch.nameEn}</span>
                    </button>
                  );
                })}
              </div>
              <div
                className={`${styles.chakraSpotlight} ${
                  engineResult && hz === engineResult.frequency ? styles.chakraSpotlightEngine : ""
                }`}
                aria-live="polite"
              >
                <span className={styles.chakraName}>{isTR ? chakra.nameTr : chakra.nameEn}</span>
                <p className={styles.chakraDesc}>{spotlightBody}</p>
              </div>
            </div>
            <p className={styles.freqHint}>
              {isTR ? (
                <>
                  <Link to="/frekans">Frekans</Link> alanında nefes ve harita ile de devam edebilirsin.
                </>
              ) : (
                <>
                  Continue with breath and map in <Link to="/frekans">Frequency</Link>.
                </>
              )}
            </p>
            <button
              type="button"
              className={`${styles.primary} ${styles.primarySoft}`}
              disabled={!intent.trim() || submitting}
              onClick={onSubmitIntent}
            >
              {isTR ? "Dinle" : "Listen"}
            </button>
          </>
        )}

        {phase === "approaching" && (
          <div className={styles.approaching}>
            <div className={styles.hearingRipples} aria-hidden>
              <span className={styles.hearingRing} />
              <span className={styles.hearingRing} />
            </div>
            <p className={styles.hearingLine}>{isTR ? "Seni duyuyorum…" : "I’m listening to you…"}</p>
          </div>
        )}


        {phase === "result" && enterResult && (
          <>
            {(() => {
              const fullHear = enterResult.how_i_hear_you || "";
              const { lead, rest } = splitLeadRest(fullHear, 2);
              return (
                <div className={`${styles.card} ${styles.cardResult}`}>
                  <p className={styles.insightLead}>{lead || fullHear}</p>
                  {rest ? <p className={styles.hearRest}>{rest}</p> : null}
                  {enterResult.reflection ? (
                    <p className={styles.reflectBlock}>{enterResult.reflection}</p>
                  ) : null}
                </div>
              );
            })()}

            <div className={styles.liveCountBar}>
              <span className={styles.liveDot} />
              <span className={styles.liveText}>
                {isTR ? (
                  <>Şu an <strong>{liveCount}</strong> kişi bu frekansta</>
                ) : (
                  <><strong>{liveCount}</strong> people on this frequency right now</>
                )}
              </span>
            </div>

            <div
              className={styles.freqEchoBar}
              style={{ "--chakra-color": chakra.color, "--chakra-glow": `${chakra.color}40` }}
            >
              <span className={styles.freqEchoLabel}>{hz} Hz</span>
              <span className={styles.freqEchoChakra}>{isTR ? chakra.nameTr : chakra.nameEn}</span>
              <button type="button" className={styles.shareBtn} onClick={shareFreqCard} title={isTR ? "Paylaş" : "Share"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
            </div>

            {enterResult.proximity_detected && (
              <div className={styles.proximityCard}>
                <p className={styles.proximityTitle}>{isTR ? "Yakınlık" : "Proximity"}</p>
                <p className={styles.proximityBody}>
                  {isTR
                    ? "Sana yakın bir his algılandı — benzer bir niyet taşıyan biri bu alanda."
                    : "A close resonance was sensed — someone with a similar intent is in the field."}
                </p>
              </div>
            )}

            <div className={styles.yankiBridge}>
              <p className={styles.yankiBridgeLine}>{isTR ? "Bu hissi yalnız yaşamıyorsun." : "You’re not alone in this feeling."}</p>
              <p className={styles.yankiBridgeSub}>{isTR ? "İstersen yankıya bırak." : "If you want, release it to the echo."}</p>
            </div>

            <button
              type="button"
              className={`${styles.secondary} ${styles.yankiCta}`}
              style={{ "--chakra-color": chakra.color }}
              disabled={shareLoading}
              onClick={shareToYanki}
            >
              {shareLoading ? "…" : isTR ? "Yankıya bırak" : "Release to echo field"}
            </button>
            {shareMessage && (
              <p className={styles.shareNote}>
                {shareMessage}{" "}
                <Link to={hisselLink} className={styles.shareLink}>
                  {isTR ? "Hissel akışa bak →" : "Open felt stream →"}
                </Link>
              </p>
            )}

            {suggestedOkuma.length > 0 && (
              <div className={styles.okumabridge} style={{
                margin: "20px 0", padding: "16px 18px",
                background: "rgba(200,160,255,0.06)",
                border: "1px solid rgba(200,160,255,0.12)",
                borderRadius: 14,
              }}>
                <p style={{
                  margin: "0 0 10px", fontSize: 13, fontWeight: 600,
                  color: "rgba(200,160,255,0.9)", letterSpacing: ".04em",
                }}>
                  {isTR ? "Sana özel okuma önerisi" : "Readings for you"}
                </p>
                {suggestedOkuma.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/okuma-alani/${post.slug}`}
                    onClick={() => trackFunnelEvent("anlasilma_to_okuma")}
                    style={{
                      display: "block", padding: "8px 0",
                      color: "rgba(255,255,255,0.75)", textDecoration: "none",
                      fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#e0d6f0" }}>{post.title}</span>
                    {post.subtitle && (
                      <span style={{ display: "block", fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                        {post.subtitle}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <div className={styles.deepenCta}>
              <p className={styles.deepenQ}>{isTR ? "Bu hisin kökünü görmek ister misin?" : "Want to see the root of this feeling?"}</p>
              <Link to="/rol-okuma" className={`${styles.ctaDeep} ${styles.ctaDeepSoft}`}>
                {isTR ? "Derinleştir (Rol Okuma)" : "Go Deeper (Role Reading)"}
              </Link>
            </div>

            {!chatRoomId && (
              <button
                type="button"
                className={`${styles.secondary} ${styles.secondaryGhost}`}
                onClick={openChatQueue}
                disabled={chatWaiting}
              >
                {chatWaiting
                  ? isTR
                    ? "Eşleşme bekleniyor…"
                    : "Waiting to pair…"
                  : isTR
                    ? "Yavaş anonim sohbeti aç"
                    : "Open slow anonymous chat"}
              </button>
            )}

            {(chatWaiting || chatRoomId) && (
              <div className={`${styles.card} ${styles.chatBox}`}>
                {chatStatus && <p className={styles.chatStatus}>{chatStatus}</p>}
                {chatRoomId && (
                  <>
                    <div className={styles.msgList}>
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`${styles.msg} ${m.from_self ? styles.msgSelf : ""}`}
                        >
                          {m.from_self ? (isTR ? "Sen: " : "You: ") : isTR ? "Yankı: " : "Echo: "}
                          {m.body}
                        </div>
                      ))}
                    </div>
                    <div className={styles.chatInputRow}>
                      <input
                        className={styles.chatInput}
                        value={chatDraft}
                        maxLength={400}
                        onChange={(e) => setChatDraft(e.target.value)}
                        placeholder={isTR ? "Yavaş mod…" : "Slow mode…"}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendChat();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={styles.sendBtn}
                        disabled={!chatDraft.trim() || sendBlockedSec > 0}
                        onClick={sendChat}
                      >
                        {sendBlockedSec > 0 ? `${sendBlockedSec}s` : "→"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            <p className={styles.muted}>
              {isTR
                ? "Oturumun cihazında anonim tutulur; niyet embedding ile gruplanır, profil bağlanmaz."
                : "Session is anonymous on device; intent grouped by embedding, no profile link."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
