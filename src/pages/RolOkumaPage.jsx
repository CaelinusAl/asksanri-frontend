import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import {
  redirectToShopier,
  isShopierUnlocked,
  checkServerUnlock,
  isShopierProductUnlocked,
  SHOPIER_PRODUCTS,
} from "../data/shopierConfig";
import { trackFunnelEvent } from "../data/funnelTracker";
import useServerUnlock from "../hooks/useServerUnlock";
import KatmanliAcilim from "../components/KatmanliAcilim";
import BankTransferLink from "../components/BankTransferLink";
import SanriSharePanel from "../components/SanriSharePanel";
import {
  buildMatrixRolReading,
  narrativeToSectionTexts,
} from "../data/matrixRolNarrative";
import { saveRolReadingCache, loadRolReadingCache } from "../lib/offline/rolReadingCache";
import SeoHead from "../components/SeoHead";
import styles from "./RolOkumaPage.module.css";

const API =
  (import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const PHASES = { FORM: "form", LOADING: "loading", RESULT: "result", ERROR: "error" };

const debugRol = (...args) => {
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_ROL === "1") {
    console.log("[Matrix Rol]", ...args);
  }
};

const LOADING_LINES = [
  "Sanr─▒ seni okuyor...",
  "─░smin ├ğ├Âz├╝l├╝yor...",
  "Do─şum frekans─▒n hesaplan─▒yor...",
  "Katmanlar a├ğ─▒l─▒yor...",
  "Zaten biliyorsun. Sadece hat─▒rlam─▒yorsun.",
];

/* ÔöÇÔöÇ Energy Exchange Modal ÔöÇÔöÇ */
function EnergyModal({ open, onClose, label, price, productId, contentId }) {
  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <motion.div
        className={styles.modalCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className={styles.modalGlyph}>Ô£Ğ</div>
        <p className={styles.modalTextDeep}>
          Sen d├╝┼ş├╝nd├╝─ş├╝n├╝ san─▒yorsun.
        </p>
        <p className={styles.modalTextDeep}>
          Ama ├ğo─şu ┼şey sana ait de─şil.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextDeep}>
          Bir rol├╝n var.
          <br />
          Ve o rol, hayat─▒n─▒n i├ğinden konu┼şuyor.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextDeep}>
          Bu katman a├ğ─▒ld─▒─ş─▒nda,
          <br />
          sadece bilgi almazs─▒n.
        </p>
        <p className={styles.modalTextHighlight}>
          Kendini farkl─▒ g├Ârmeye ba┼şlars─▒n.
        </p>
        <div className={styles.modalDivider} />
        <p className={styles.modalTextSoft}>
          Bu bir cevap de─şil. Bir ayna.
          <br />
          Ve o aynaya bakmakÔÇĞ herkes i├ğin kolay de─şil.
        </p>
        <p className={styles.modalPrice}>
          {price}Ôé║ enerji de─şi┼şimi
        </p>
        <button
          className={styles.modalBtn}
          onClick={() => {
            trackFunnelEvent("role_shopier_redirect");
            redirectToShopier(productId, contentId, "/rol-okuma");
          }}
        >
          Kartla An─▒nda ├ûde
        </button>
        <BankTransferLink
          contentId={contentId || "role_unlock"}
          returnTo="/rol-okuma"
          className={styles.modalHavale}
        >
          Havale / EFT ile ├Âde
        </BankTransferLink>
        <button className={styles.modalClose} onClick={onClose}>
          ┼Şimdilik kal
        </button>
      </motion.div>
    </div>
  );
}

/** Sonu├ğ a─şac─▒ndaki beklenmeyen render hatalar─▒n─▒ yakalar (├Âr. eksik prop). */
function useVerifiedProductUnlock(contentId) {
  const [ok, setOk] = useState(() => isShopierProductUnlocked(contentId));
  useEffect(() => {
    let alive = true;
    checkServerUnlock(contentId).then((unlocked) => {
      if (alive && unlocked) setOk(true);
    });
    return () => {
      alive = false;
    };
  }, [contentId]);
  return ok;
}

const DEEP_CTA_PREFILL = {
  deep_iliski_unlock:
    "Derin ─░li┼şki A├ğ─▒l─▒m─▒ i├ğin sat─▒n al─▒m─▒m var ÔÇö teslimat / devam ad─▒m─▒ i├ğin yaz─▒yorum.",
  deep_kariyer_unlock:
    "Kariyer / Yol A├ğ─▒l─▒m─▒ i├ğin sat─▒n al─▒m─▒m var ÔÇö teslimat / devam ad─▒m─▒ i├ğin yaz─▒yorum.",
  deep_genel_unlock:
    "Genel Derin A├ğ─▒l─▒m i├ğin sat─▒n al─▒m─▒m var ÔÇö teslimat / devam ad─▒m─▒ i├ğin yaz─▒yorum.",
};

function RolDeepenSection({ isTR, navigate }) {
  const uIliski = useVerifiedProductUnlock("deep_iliski_unlock");
  const uKar = useVerifiedProductUnlock("deep_kariyer_unlock");
  const uGen = useVerifiedProductUnlock("deep_genel_unlock");

  const items = [
    {
      contentId: "deep_iliski_unlock",
      productKey: "iliski_acilimi",
      funnel: "role_deepen_relationship_click",
      unlocked: uIliski,
      title: isTR ? "Derin ─░li┼şki A├ğ─▒l─▒m─▒" : "Deep Relationship Reading",
      blurb: isTR
        ? "─░li┼şkide tekrar eden d├Âng├╝n├╝ g├Âr."
        : "See the loop that repeats in relationships.",
      micro: isTR ? "Daha derine inmek ister misin?" : "Want to go deeper?",
    },
    {
      contentId: "deep_kariyer_unlock",
      productKey: "kariyer_acilimi",
      funnel: "role_deepen_career_click",
      unlocked: uKar,
      title: isTR ? "Kariyer / Yol A├ğ─▒l─▒m─▒" : "Career / Path Reading",
      blurb: isTR
        ? "Kariyer yolundaki d├╝─ş├╝m├╝ a├ğ."
        : "Open the knot on your career path.",
      micro: isTR ? "Bu sadece ilk katman." : "This is only the first layer.",
    },
    {
      contentId: "deep_genel_unlock",
      productKey: "genel_derin_acilim",
      funnel: "role_deepen_general_click",
      unlocked: uGen,
      title: isTR ? "Genel Derin A├ğ─▒l─▒m" : "General Deep Reading",
      blurb: isTR
        ? "Hayat─▒ndaki ana paterni daha net g├Âr."
        : "See the main pattern in your life more clearly.",
      micro: isTR ? "Daha derine inmek ister misin?" : "Want to go deeper?",
    },
  ];

  const handlePrimary = (item) => {
    trackFunnelEvent(item.funnel);
    if (item.unlocked) {
      const pre = DEEP_CTA_PREFILL[item.contentId] || "";
      navigate(`/sanriya-sor?prefill=${encodeURIComponent(pre)}`);
      return;
    }
    redirectToShopier(item.productKey, item.contentId, "/rol-okuma");
  };

  return (
    <section className={styles.deepenSection} aria-label={isTR ? "Derin a├ğ─▒l─▒mlar" : "Deep readings"}>
      <h3 className={styles.deepenTitle}>{isTR ? "Bunun devam─▒ var." : "There is more to this."}</h3>
      <p className={styles.deepenIntro}>
        {isTR
          ? "Bu sadece ilk katman. ─░stersen ili┼şki, kariyer ve genel ya┼şam d├Âng├╝n i├ğin daha derin a├ğ─▒l─▒m─▒ g├Ârebilirsin."
          : "This is only the first layer. You can go deeper into relationship, career, and your life pattern."}
      </p>
      <div className={styles.deepenGrid}>
        {items.map((item) => {
          const price = SHOPIER_PRODUCTS[item.productKey]?.price || "369";
          return (
            <article key={item.contentId} className={styles.deepenCard}>
              <h4 className={styles.deepenCardTitle}>{item.title}</h4>
              <p className={styles.deepenCardBlurb}>{item.blurb}</p>
              <p className={styles.deepenCardMicro}>{item.micro}</p>
              <div className={styles.deepenPrice}>{price} Ôé║</div>
              <button
                type="button"
                className={styles.deepenBtn}
                onClick={() => handlePrimary(item)}
              >
                {item.unlocked
                  ? isTR
                    ? "A├ğ─▒l─▒m─▒ a├ğ"
                    : "Open reading"
                  : isTR
                    ? "A├ğ─▒l─▒m─▒ G├Âr"
                    : "View reading"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RolShareFooterBlock({ narrative, isTR, shareFooterRef }) {
  const sections = narrative?.sections ?? {};
  const shareTrigger = narrative?.share_trigger;
  const fullNarrative = narrative?.full_narrative ?? "";

  const copyPlain = () => {
    if (navigator.clipboard?.writeText && fullNarrative) {
      navigator.clipboard.writeText(fullNarrative).catch(() => {});
    }
  };

  const copyJson = () => {
    const payload = {
      share_trigger: shareTrigger,
      sections: {
        derin_iliski: sections.derin_iliski ?? "",
        derin_para: sections.derin_para ?? "",
        derin_icsel: sections.derin_icsel ?? "",
        derin_davranis: sections.derin_davranis ?? "",
        kor_nokta: sections.kor_nokta ?? "",
        dongu_aciklamasi: sections.dongu_aciklamasi ?? "",
        kirilma_noktasi: sections.kirilma_noktasi ?? "",
        sanri_imza: sections.sanri_imza ?? "",
        paylasim_tetikleyici: sections.paylasim_tetikleyici ?? "",
      },
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
    }
  };

  const hasCopy = Boolean(shareTrigger) || Boolean(sections.paylasim_tetikleyici);

  return (
    <div ref={shareFooterRef} className={styles.resultShareFooter}>
      <p className={styles.resultWhisper}>
        {isTR
          ? "Baz─▒ cevaplar ilk bak─▒┼şta g├Âr├╝nmez. Derine indik├ğe anlam netle┼şir."
          : "Some answers stay hidden at first glance. Meaning clarifies as you go deeper."}
      </p>
      <SanriSharePanel
        anaTema={sections?.ana_tema ?? ""}
        isTR={isTR}
        cardKind="rol"
        headline={isTR ? "─░stersen bunu payla┼şabilirsin" : "You can share this if youÔÇÖd like"}
      />
      {hasCopy ? (
        <div className={styles.shareStripFooter}>
          {sections.paylasim_tetikleyici ? (
            <p className={styles.shareStripText}>{sections.paylasim_tetikleyici}</p>
          ) : null}
          {shareTrigger ? (
            <div className={styles.copyNarrativeRow}>
              <button type="button" className={styles.copyNarrativeBtn} onClick={copyPlain}>
                {isTR ? "Metni kopyala" : "Copy text"}
              </button>
              <button type="button" className={styles.copyNarrativeBtnGhost} onClick={copyJson}>
                JSON {isTR ? "kopyala" : "copy"}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

class RolOkumaResultBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[Matrix Rol] Sonu├ğ ekran─▒ render hatas─▒:", error?.message, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      const { onReset, isTR } = this.props;
      return (
        <motion.div
          className={styles.resultWrap}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className={styles.resultErrorCard}>
            <div className={styles.resultErrorGlyph}>Ôùê</div>
            <h2 className={styles.resultErrorTitle}>
              {isTR ? "Sonu├ğ g├Âsterilemedi" : "Could not show result"}
            </h2>
            <p className={styles.resultErrorText}>
              {isTR
                ? "Teknik bir sorun olu┼ştu. Bilgilerini kontrol edip tekrar deneyebilirsin."
                : "Something went wrong. Check your details and try again."}
            </p>
            <button
              type="button"
              className={styles.resultErrorBtn}
              onClick={() => {
                this.setState({ error: null });
                onReset?.();
              }}
            >
              {isTR ? "Forma d├Ân" : "Back to form"}
            </button>
          </div>
        </motion.div>
      );
    }
    return this.props.children;
  }
}

export default function RolOkumaPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isTR = language === "tr";

  const [phase, setPhase] = useState(PHASES.FORM);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState(null);
  const [resultSessionId, setResultSessionId] = useState(0);
  const [error, setError] = useState("");
  const [flowError, setFlowError] = useState("");
  const [loadingLine, setLoadingLine] = useState(0);
  const intervalRef = useRef(null);

  const [modal, setModal] = useState(null);
  const [hasLocalRolCache, setHasLocalRolCache] = useState(false);

  const [serverUnlocked] = useServerUnlock("role_unlock", "ankod_unlock", "subconscious_unlock");
  const unlocked = serverUnlocked;

  useEffect(() => { trackFunnelEvent("role_page_view"); }, []);
  useEffect(() => { if (unlocked) trackFunnelEvent("role_unlock_success"); }, [unlocked]);

  const shareFooterRef = useRef(null);
  const shareViewTracked = useRef(false);

  useEffect(() => {
    if (phase !== PHASES.RESULT || !result) return;
    trackFunnelEvent("role_result_view", `session_${resultSessionId}`);
  }, [phase, result, resultSessionId]);

  useEffect(() => {
    shareViewTracked.current = false;
  }, [resultSessionId]);

  useEffect(() => {
    const el = shareFooterRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || shareViewTracked.current) return;
        shareViewTracked.current = true;
        trackFunnelEvent("role_share_section_view", "footer");
      },
      { root: null, threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase, result, resultSessionId]);

  useEffect(() => {
    loadRolReadingCache()
      .then((c) => setHasLocalRolCache(Boolean(c?.apiData)))
      .catch(() => setHasLocalRolCache(false));
  }, []);

  /* Offline: y├╝kleme ekran─▒ yok ÔÇö do─şrudan son kay─▒tl─▒ okuma. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof navigator !== "undefined" && navigator.onLine) return;
      const cached = await loadRolReadingCache();
      if (cancelled || !cached?.apiData) return;
      try {
        const narrative = buildMatrixRolReading(cached.apiData, cached.fullName, cached.birthDate);
        setResultSessionId((k) => k + 1);
        setResult({ data: cached.apiData, fullName: cached.fullName, narrative });
        setPhase(PHASES.RESULT);
      } catch {
        /* bozuk ├Ânbellek */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCachedRolReading = useCallback(async () => {
    const cached = await loadRolReadingCache();
    if (!cached?.apiData) return;
    try {
      const narrative = buildMatrixRolReading(cached.apiData, cached.fullName, cached.birthDate);
      setResultSessionId((k) => k + 1);
      setResult({ data: cached.apiData, fullName: cached.fullName, narrative });
      setPhase(PHASES.RESULT);
      setFlowError("");
      setError("");
    } catch {
      setFlowError(
        isTR ? "Kay─▒tl─▒ okuma a├ğ─▒lamad─▒. Yeni okuma i├ğin formu kullan." : "Could not open saved reading. Use the form for a new one.",
      );
    }
  }, [isTR]);

  const openModal = (label, price, productId, contentId) => {
    trackFunnelEvent("role_unlock_click");
    setModal({ label, price, productId, contentId });
  };

  const startLoading = useCallback(() => {
    setLoadingLine(0);
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % LOADING_LINES.length;
      setLoadingLine(idx);
    }, 1800);
  }, []);

  const stopLoading = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleFormStart = useCallback(() => {
    trackFunnelEvent("role_form_start");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const first = name.trim();
    const last = surname.trim();
    const bd = birthDate.trim();

    if (!first) {
      setError(isTR ? "L├╝tfen ad─▒n─▒ gir." : "Please enter your first name.");
      return;
    }
    if (!bd) {
      setError(isTR ? "L├╝tfen do─şum tarihini se├ğ." : "Please select your birth date.");
      return;
    }

    trackFunnelEvent("role_form_submit");
    setError("");
    setFlowError("");

    const fullName = last ? `${first} ${last}` : first;
    const targetUrl = `${API}/matrix-rol`;
    const payload = { name: fullName, birth_date: bd };

    debugRol("form submit values", { ad: first, soyad: last || "(bo┼ş)", fullName, birth_date: bd });
    debugRol("POST target URL", targetUrl, "current route", typeof window !== "undefined" ? window.location.pathname : "");

    setPhase(PHASES.LOADING);
    startLoading();

    try {
      const res = await fetch(targetUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      debugRol("response", { status: res.status, bodyLength: raw?.length ?? 0 });

      if (!res.ok) {
        console.error("[Matrix Rol] API HTTP error", res.status, raw?.slice(0, 500));
        const msg =
          res.status === 429
            ? (isTR ? "├çok fazla istek. K─▒sa s├╝re sonra tekrar dene." : "Too many requests. Try again shortly.")
            : res.status >= 500
              ? (isTR ? "Sunucu ge├ğici olarak yan─▒t vermiyor. Daha sonra tekrar dene." : "Server error. Please try again later.")
              : (isTR ? "─░stek reddedildi. Bilgilerini kontrol edip tekrar dene." : "Request failed. Check your details and try again.");
        throw new Error(msg);
      }

      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        console.error("[Matrix Rol] JSON parse failed", parseErr, raw?.slice(0, 200));
        throw new Error(
          isTR ? "Sunucu yan─▒t─▒ okunamad─▒. Tekrar dene." : "Could not read server response. Try again."
        );
      }

      debugRol("parsed API payload summary", {
        keys: data && typeof data === "object" ? Object.keys(data) : [],
        matrix_role: data?.matrix_role,
        life_path: data?.life_path,
      });

      let narrative;
      try {
        narrative = buildMatrixRolReading(data, fullName, bd);
      } catch (buildErr) {
        console.error("[Matrix Rol] buildMatrixRolReading error", buildErr);
        throw new Error(
          isTR ? "Okuma metni olu┼şturulamad─▒. Tekrar dene." : "Could not build reading. Try again."
        );
      }

      setResultSessionId((k) => k + 1);
      setResult({ data: data && typeof data === "object" ? data : {}, fullName, narrative });
      stopLoading();
      setPhase(PHASES.RESULT);
      saveRolReadingCache({
        apiData: data && typeof data === "object" ? data : {},
        fullName,
        birthDate: bd,
      }).catch(() => {});
      setHasLocalRolCache(true);
      debugRol("result phase OK", { fullName, sessionIdTick: true });
      trackFunnelEvent("role_free_result_view");
      if (!unlocked) trackFunnelEvent("role_lock_view");
    } catch (err) {
      stopLoading();
      console.error("[Matrix Rol] submit failed", err);
      try {
        const cached = await loadRolReadingCache();
        if (cached?.apiData) {
          const narrative = buildMatrixRolReading(cached.apiData, cached.fullName, cached.birthDate);
          setResultSessionId((k) => k + 1);
          setResult({ data: cached.apiData, fullName: cached.fullName, narrative });
          setPhase(PHASES.RESULT);
          return;
        }
      } catch {
        /* devam */
      }
      const fallback = isTR
        ? "Ba─şlant─▒ hatas─▒ veya a─ş kesildi. ─░nternetini kontrol edip tekrar dene."
        : "Connection error. Check your network and try again.";
      let message = fallback;
      if (err instanceof Error && err.message) {
        const m = err.message;
        const isNetworkNoise = /failed to fetch|networkerror|load failed|abort/i.test(m);
        if (!isNetworkNoise) message = m;
      }
      setFlowError(message);
      setPhase(PHASES.ERROR);
    }
  };

  return (
    <div className={styles.page}>
      <SeoHead
        title={isTR ? "Matrix Rol Okuma — Kişisel Enerji İmza Analizi" : "Matrix Role Reading — Personal Energy Signature"}
        description={isTR
          ? "Doğum tarihinden kişisel enerji imzanı hesapla. İsim ve doğum numerolojisi ile yaşam rolünü, ilişki döngülerini ve kariyer yolunu keşfet."
          : "Calculate your personal energy signature from your birth date. Discover your life role, relationship cycles and career path through name and birth numerology."
        }
        path="/rol-okuma"
      />
      <div className={styles.bgOrb} />
      <div className={styles.bgOrb2} />

      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate("/")}>
          ÔåÉ Kap─▒lar
        </button>
        <span className={styles.topTitle}>Matrix Rol Okuma</span>
      </div>

      <AnimatePresence mode="wait">
        {/* ÔòÉÔòÉÔòÉ FORM ÔòÉÔòÉÔòÉ */}
        {phase === PHASES.FORM && (
          <motion.div
            key="form"
            className={styles.formWrap}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.formGlyph}>Ôùê</div>
            <h1 className={styles.formTitle}>Sistemdeki Rol├╝n├╝ Hat─▒rla</h1>
            <p className={styles.formSubHero}>
              Bu alan sana kim oldu─şunu s├Âylemez.
              <br />
              Sana zaten bildi─şin ┼şeyi hat─▒rlat─▒r.
            </p>

            <div className={styles.deepDesc}>
              <p className={styles.deepDescLine}>
                Hayat─▒nda tekrar eden ┼şeyler,
                <br />
                kar┼ş─▒na ├ğ─▒kan insanlar,
                <br />
                ka├ğamad─▒─ş─▒n d├Âng├╝lerÔÇĞ
              </p>
              <p className={styles.deepDescPunch}>rastgele de─şil.</p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescLine}>
                Bir rol├╝n var.
                <br />
                Ve sen onu ya┼ş─▒yorsun,
                <br />
                ama ├ğo─şu zaman g├Ârmeden.
              </p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescLine}>
                Matrix Rol Okuma ile:
                <br />
                ad─▒n, do─şum tarihin ve ta┼ş─▒d─▒─ş─▒n frekans birle┼şir.
              </p>
              <p className={styles.deepDescHighlight}>
                Ve sana ait olan ┼şey a├ğ─▒l─▒r.
              </p>
              <div className={styles.deepDescDivider} />
              <p className={styles.deepDescSoft}>
                Bu bir analiz de─şil. Bu bir hat─▒rlay─▒┼ş.
              </p>
              <p className={styles.deepDescCall}>
                Buraya kadar geldiysenÔÇĞ zaten ├ğa─şr─▒ld─▒n.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Ad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Ad─▒n"
                    value={name}
                    onFocus={handleFormStart}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Soyad</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Soyad─▒n"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Do─şum Tarihi</label>
                <input
                  className={styles.input}
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={!name.trim() || !birthDate}
              >
                Rol├╝n├╝ G├Âr
              </button>
              {hasLocalRolCache ? (
                <button
                  type="button"
                  className={styles.cachedReadBtn}
                  onClick={() => openCachedRolReading()}
                >
                  {isTR ? "Son kay─▒tl─▒ okuman─▒ g├Âster (cihaz─▒ndan)" : "Show last saved reading (on device)"}
                </button>
              ) : null}
            </form>
          </motion.div>
        )}

        {/* ÔòÉÔòÉÔòÉ LOADING ÔòÉÔòÉÔòÉ */}
        {phase === PHASES.LOADING && (
          <motion.div
            key="loading"
            className={styles.loadingWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.loadingOrb}>
              <span className={styles.loadingGlyph}>Ôùê</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={loadingLine}
                className={styles.loadingText}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {LOADING_LINES[loadingLine]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ÔòÉÔòÉÔòÉ SUBMIT / API ERROR (siyah ekran yerine kart) ÔòÉÔòÉÔòÉ */}
        {phase === PHASES.ERROR && (
          <motion.div
            key="flow-error"
            className={styles.formWrap}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <div className={styles.resultErrorCard}>
              <div className={styles.resultErrorGlyph}>Ôùê</div>
              <h2 className={styles.resultErrorTitle}>
                {isTR ? "Okuma tamamlanamad─▒" : "Reading could not complete"}
              </h2>
              <p className={styles.resultErrorText}>{flowError}</p>
              <button
                type="button"
                className={styles.resultErrorBtn}
                onClick={() => {
                  setPhase(PHASES.FORM);
                  setFlowError("");
                }}
              >
                {isTR ? "Tekrar dene" : "Try again"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ÔòÉÔòÉÔòÉ RESULT ÔòÉÔòÉÔòÉ */}
        {phase === PHASES.RESULT && result && (
          <RolOkumaResultBoundary
            key={resultSessionId}
            isTR={isTR}
            onReset={() => {
              setPhase(PHASES.FORM);
              setResult(null);
              setError("");
              setFlowError("");
              setResultSessionId((k) => k + 1);
            }}
          >
            <motion.div
              key="result"
              className={styles.resultWrap}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.resultHeader}>
                <div className={styles.resultGlyph}>Ô£Ğ</div>
                <h2 className={styles.resultName}>{result.fullName || "ÔÇö"}</h2>
                {result.data?.matrix_role ? (
                  <div className={styles.roleBadge}>{result.data.matrix_role}</div>
                ) : null}
              </div>

              <NarrativeLead s={result.narrative?.sections} />

              <RolDeepenSection isTR={isTR} navigate={navigate} />

              {unlocked ? (
                <>
                  <NarrativeDeep narrative={result.narrative} hideShareStrip isTR={isTR} />

                  {result.data?.teaser ? (
                    <div className={styles.teaserCard}>
                      <p className={styles.teaserText}>{result.data.teaser}</p>
                    </div>
                  ) : null}

                  <KatmanliAcilim
                    analysisData={{
                      ...(result.data && typeof result.data === "object" ? result.data : {}),
                      sectionTexts: narrativeToSectionTexts(result.narrative),
                    }}
                    returnPath="/rol-okuma"
                  />
                </>
              ) : (
                <>
                  <div className={styles.lockZone}>
                    <div className={styles.lockZoneBlur}>
                      <div className={styles.sections}>
                        <div className={styles.section}>
                          <p className={styles.sectionText}>
                            {result.narrative?.sections?.derin_iliski ?? ""}
                          </p>
                        </div>
                        <div className={styles.section}>
                          <p className={styles.sectionText}>
                            {result.narrative?.sections?.derin_para ?? ""}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.lockZoneGradient} />
                    <div className={styles.lockZoneOverlay}>
                      <p className={styles.lockZoneLine1}>Sen ya┼şam─▒yorsun.</p>
                      <p className={styles.lockZoneLine2}>Bir ┼şeyi tekrar ediyorsun.</p>
                      <div className={styles.lockZoneDivider} />
                      <p className={styles.lockZonePersonal}>
                        Sorun ├ğ├Âzmek de─şil. G├Ârmek.
                      </p>
                      <p className={styles.lockZonePersonalSoft}>Bu sana ├Âzel.</p>
                      <button
                        className={styles.lockZoneBtn}
                        onClick={() => openModal("Rol Okuma", "369", "rol_okuma", "role_unlock")}
                      >
                        Hat─▒rla
                      </button>
                      <span className={styles.lockZoneHint}>Bu kap─▒, haz─▒r olana a├ğ─▒l─▒r.</span>
                      <button
                        type="button"
                        className={styles.lockZoneRecovery}
                        onClick={async () => {
                          const ok = await checkServerUnlock("role_unlock");
                          if (ok) window.location.reload();
                          else {
                            window.alert(
                              "Sunucuda aktif sat─▒n al─▒m bulunamad─▒. ├ûdeme sonras─▒ /odeme-basarili sayfas─▒ndan do─şrula veya giri┼ş yapt─▒─ş─▒n e-posta ile hesab─▒n─▒ kullan."
                            );
                          }
                        }}
                      >
                        Sat─▒n al─▒m─▒ do─şrula
                      </button>
                    </div>
                  </div>

                  <KatmanliAcilim
                    analysisData={{
                      ...(result.data && typeof result.data === "object" ? result.data : {}),
                      sectionTexts: narrativeToSectionTexts(result.narrative),
                    }}
                    returnPath="/rol-okuma"
                  />
                </>
              )}

              <button
                type="button"
                className={styles.againBtn}
                onClick={() => {
                  setPhase(PHASES.FORM);
                  setResult(null);
                  setError("");
                  setFlowError("");
                  setResultSessionId((k) => k + 1);
                }}
              >
                Tekrar Oku
              </button>

              <RolShareFooterBlock
                narrative={result.narrative}
                isTR={isTR}
                shareFooterRef={shareFooterRef}
              />
            </motion.div>
          </RolOkumaResultBoundary>
        )}
      </AnimatePresence>

      {/* ÔöÇÔöÇ Energy Exchange Modal ÔöÇÔöÇ */}
      <AnimatePresence>
        {modal && (
          <EnergyModal
            open
            onClose={() => setModal(null)}
            label={modal.label}
            price={modal.price}
            productId={modal.productId}
            contentId={modal.contentId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NarrativeLead({ s }) {
  const opening = s?.opening ?? "";
  const anaTema = s?.ana_tema ?? "";
  return (
    <div className={styles.narrativeLeadWrap}>
      <motion.p
        className={styles.narrativeOpening}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {opening}
      </motion.p>
      <motion.p
        className={styles.narrativeAnaTema}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
      >
        {anaTema}
      </motion.p>
    </div>
  );
}

function NarrativeBlock({ label, text, delay }) {
  const body = String(text ?? "");
  if (!body.trim() && !label) return null;
  return (
    <motion.div
      className={styles.narrativeBlock}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {label ? <span className={styles.narrativeLabel}>{label}</span> : null}
      <p className={styles.narrativeBody}>{body || "ÔÇö"}</p>
    </motion.div>
  );
}

function NarrativeDeep({ narrative, hideShareStrip, isTR = true }) {
  const sections = narrative?.sections ?? {};
  const shareTrigger = narrative?.share_trigger;
  const fullNarrative = narrative?.full_narrative ?? "";

  const copyJson = () => {
    const payload = {
      share_trigger: shareTrigger,
      sections: {
        derin_iliski: sections.derin_iliski ?? "",
        derin_para: sections.derin_para ?? "",
        derin_icsel: sections.derin_icsel ?? "",
        derin_davranis: sections.derin_davranis ?? "",
        kor_nokta: sections.kor_nokta ?? "",
        dongu_aciklamasi: sections.dongu_aciklamasi ?? "",
        kirilma_noktasi: sections.kirilma_noktasi ?? "",
        sanri_imza: sections.sanri_imza ?? "",
        paylasim_tetikleyici: sections.paylasim_tetikleyici ?? "",
      },
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(() => {});
    }
  };

  const copyPlain = () => {
    if (navigator.clipboard?.writeText && fullNarrative) {
      navigator.clipboard.writeText(fullNarrative).catch(() => {});
    }
  };

  let t = 0;
  const d = () => {
    t += 0.06;
    return t;
  };

  return (
    <div className={styles.narrativeDeepWrap}>
      <NarrativeBlock label="Derin okuma ÔÇö ili┼şki" text={sections.derin_iliski} delay={d()} />
      <NarrativeBlock label="Derin okuma ÔÇö para" text={sections.derin_para} delay={d()} />
      <NarrativeBlock label="Derin okuma ÔÇö i├ğsel yap─▒" text={sections.derin_icsel} delay={d()} />
      <NarrativeBlock label="Derin okuma ÔÇö davran─▒┼ş kal─▒b─▒" text={sections.derin_davranis} delay={d()} />
      <NarrativeBlock label="K├Âr nokta" text={sections.kor_nokta} delay={d()} />
      <NarrativeBlock label="D├Âng├╝" text={sections.dongu_aciklamasi} delay={d()} />
      <NarrativeBlock label="K─▒r─▒lma" text={sections.kirilma_noktasi} delay={d()} />
      <NarrativeBlock label="SANRI" text={sections.sanri_imza} delay={d()} />
      {!hideShareStrip ? (
        <motion.div
          className={styles.shareStrip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: d(), duration: 0.45 }}
        >
          <p className={styles.shareStripText}>{sections.paylasim_tetikleyici ?? ""}</p>
          {shareTrigger ? (
            <div className={styles.copyNarrativeRow}>
              <button type="button" className={styles.copyNarrativeBtn} onClick={copyPlain}>
                {isTR ? "Metni kopyala" : "Copy text"}
              </button>
              <button type="button" className={styles.copyNarrativeBtnGhost} onClick={copyJson}>
                {isTR ? "JSON kopyala" : "Copy JSON"}
              </button>
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}
