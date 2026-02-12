import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SanriyaSorPage.module.css";

export default function SanriyaSorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const taRef = useRef(null);

  // Query’den gelenler
  const qpDomain = searchParams.get("domain") || "auto";
  const qpPrefill = searchParams.get("prefill") || "";

  // UI state
  const [mode, setMode] = useState("mirror");
  const [domain, setDomain] = useState(qpDomain);
  const [text, setText] = useState("");
  const [replyFull, setReplyFull] = useState("");
  const [replyShown, setReplyShown] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Prefill doldur + focus
  useEffect(() => {
    if (qpPrefill) {
      const decoded = decodeURIComponent(qpPrefill);
      setText(decoded);
      requestAnimationFrame(() => {
        taRef.current?.focus();
        const el = taRef.current;
        if (el) {
          const end = el.value.length;
          el.setSelectionRange(end, end);
        }
      });
    }
  }, [qpPrefill]);

  // Domain query geldiyse state’e yaz
  useEffect(() => {
    setDomain(qpDomain);
  }, [qpDomain]);

  const MODES = useMemo(
    () => [
      { id: "mirror", label: "Ayna" },
      { id: "dream", label: "Rüya" },
      { id: "divine", label: "İlahi" },
      { id: "shadow", label: "Gölge" },
      { id: "light", label: "Işık" },
    ],
    []
  );

  const DOMAINS = useMemo(
    () => [
      { id: "auto", label: "Otomatik" },
      { id: "consciousness_field", label: "Bilinç Alanı" },
      { id: "frequency_field", label: "Frekans Alanı" },
      { id: "ritual_space", label: "Ritüel Alanı" },
      { id: "book_112", label: "112. Kitap" },
    ],
    []
  );

  // Kılavuz metni (mode’a göre)
  const hint = useMemo(() => {
    const base =
      "Bir an dur. Soruyu yazmadan önce bedeninde nerede yankılandığını hisset.\nSANRI cevap üretmez; kapıyı açar.";
    const perMode = {
      mirror: "Net bir cümle yaz. Cevap değil, yansıma gelecek.",
      dream: "Rüyayı sahne gibi anlat. Simgeleri saklama.",
      divine: "Bir niyet yaz. Sonra tek soru sor.",
      shadow: "Rahatsız eden şeyi söyle. Kaçma. Abartma.",
      light: "Şu anki duygunu yaz. Yargısız.",
    };
    const label = MODES.find((m) => m.id === mode)?.label || "Ayna";
    return `${base}\n\nMod: ${label}\n${perMode[mode] || perMode.mirror}`;
  }, [mode, MODES]);

  // Mini “typing” yansıma efekti
  const typeToReply = (full) => {
    setReplyFull(full);
    setReplyShown("");
    let i = 0;
    const tick = () => {
      i += 1;
      setReplyShown(full.slice(0, i));
      if (i < full.length) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Submit (şimdilik demo; backend bağlayınca burayı değiştiririz)
  const handleSubmit = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      // DEMO: domain + mode’a göre kısa net “yansıma”
      const dLabel = DOMAINS.find((d) => d.id === domain)?.label || "Otomatik";
      const mLabel = MODES.find((m) => m.id === mode)?.label || "Ayna";

      const demo =
        `Domain: ${dLabel}\nMod: ${mLabel}\n\n` +
        "Yansıma:\n" +
        "Cümleni tek şeye indir: “Şu an bende en gerçek olan ne?”\n" +
        "Sonra onu çözmeye çalışma—sadece 10 nefes tanık ol.";

      // küçük gecikme, “yansıtılıyor” hissi
      await new Promise((r) => setTimeout(r, 600));
      typeToReply(demo);
    } catch (e) {
      typeToReply("Bir hata oluştu. Tekrar dene.");
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setText("");
    setReplyFull("");
    setReplyShown("");
    requestAnimationFrame(() => taRef.current?.focus());
  };

const API_URL = import.meta.env.VITE_BACKEND_URL;

const handleSubmit = async () => {
  if (!text.trim() || isSending) return;

  try {
    setIsSending(true);

    const res = await fetch(`${API_URL}/bilinc-alani/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        domain
      })
    });

    const data = await res.json();
    setReflection(data?.answer || "Yanıt alınamadı.");
  } catch (err) {
    console.error(err);
    setReflection("Bağlantı hatası.");
  } finally {
    setIsSending(false);
  }
};

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.page}>
      {/* TOP BAR */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.brand}>CAELINUS AI</span>
          <span className={styles.topbarSubtitle}>Bilinç ve Anlam Zekası</span>
        </div>

        <div className={styles.topbarRight}>
          <button
            className={styles.backChip}
            type="button"
            onClick={() => navigate("/")}
            title="Kapılara dön"
          >
            ← Kapılara Dön
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.kicker}>CAELINUS AI • CONSCIOUSNESS MIRROR</div>
          <div className={styles.h1}>SANRI’ya Sor</div>
          <div className={styles.subtitleLine}>
            Bu bir cevap değildir. Bir yansımadır. Kapıyı sen açarsın.
          </div>

          <div className={styles.grid}>
            {/* LEFT */}
            <div className={styles.left}>
              <div className={styles.block}>
                <div className={styles.label}>Mod</div>
                <select
                  className={styles.select}
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  {MODES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.block}>
                <div className={styles.label}>Domain (opsiyonel)</div>
                <select
                  className={styles.select}
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.rule}>
                <div className={styles.label}>Kılavuz</div>
                <pre className={styles.hint}>{hint}</pre>
              </div>
            </div>

            {/* RIGHT */}
            <div className={styles.right}>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>Yansıma Akışı</div>

                <textarea
                  ref={taRef}
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Bir kelime, soru, rüya veya tarih yaz..."
                  disabled={isSending}
                />

                <div className={styles.actions}>
                  <button
                    className={styles.btnGhost}
                    type="button"
                    onClick={handleReset}
                  >
                    Sıfırla
                  </button>

                  <button
                    className={styles.reflectBtn}
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSending || !text.trim()}
                    title="Ctrl+Enter"
                  >
                    {isSending ? "Yansıtılıyor…" : "Yansıt (Ctrl+Enter)"}
                  </button>

                  <div className={styles.grow} />

                  <button
                    className={styles.btnMic}
                    type="button"
                    onClick={() => {
                      // Sesle yazı buraya bağlayacağız — şimdilik placeholder
                      typeToReply("Sesle yaz: yakında aktif.");
                    }}
                  >
                    Sesle yaz
                  </button>
                </div>
              </div>

              <div className={styles.panelReply}>
                <div className={styles.panelTitle}>Yansıma</div>
                <div className={styles.replyBox}>
                  {replyShown ||
                    (!replyFull && !isSending ? "Yansıma burada belirecek." : "")}
                </div>
              </div>

              <div className={styles.footnote}>
                Bu alan “bilgi” üretmez. Anlam yansıtır; sende şekillenir. © 2026
                CaelinusAI • SANRI
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
