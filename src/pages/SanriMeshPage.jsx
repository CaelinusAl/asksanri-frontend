import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useOfflineMesh } from "../contexts/OfflineMeshContext";
import styles from "./SanriMeshPage.module.css";

export default function SanriMeshPage() {
  const {
    online,
    peerId,
    localPeers,
    lanPeers,
    refreshLanBeacon,
    meshStatus,
    meshMessages,
    prepareHostOffer,
    completeHostSession,
    prepareGuestAnswer,
    completeGuestSession,
    sendMeshMessage,
    disconnectMesh,
  } = useOfflineMesh();

  const [pairingCode, setPairingCode] = useState("");
  const [hostOfferOut, setHostOfferOut] = useState("");
  const [hostAnswerIn, setHostAnswerIn] = useState("");
  const [guestOfferIn, setGuestOfferIn] = useState("");
  const [guestAnswerOut, setGuestAnswerOut] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [err, setErr] = useState("");

  const onCreateHost = useCallback(async () => {
    setErr("");
    try {
      const { offerSdp: sdp } = await prepareHostOffer();
      setHostOfferOut(sdp);
      setHostAnswerIn("");
      setGuestAnswerOut("");
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }, [prepareHostOffer]);

  const onPasteAnswer = useCallback(async () => {
    setErr("");
    if (!pairingCode.trim() || pairingCode.trim().length < 4) {
      setErr("Eşleştirme kodu (en az 4 karakter) gerekli.");
      return;
    }
    try {
      await completeHostSession(hostAnswerIn, pairingCode.trim());
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }, [hostAnswerIn, pairingCode, completeHostSession]);

  const onJoinGuest = useCallback(async () => {
    setErr("");
    try {
      const { answerSdp: ans } = await prepareGuestAnswer(guestOfferIn);
      setGuestAnswerOut(ans);
      setHostOfferOut("");
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }, [guestOfferIn, prepareGuestAnswer]);

  const onFinalizeGuest = useCallback(async () => {
    setErr("");
    if (!pairingCode.trim() || pairingCode.trim().length < 4) {
      setErr("Eşleştirme kodunu girin (host ile aynı).");
      return;
    }
    try {
      await completeGuestSession(pairingCode.trim());
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }, [pairingCode, completeGuestSession]);

  const onSendChat = useCallback(async () => {
    const t = chatInput.trim();
    if (!t) return;
    setErr("");
    try {
      await sendMeshMessage(t);
      setChatInput("");
    } catch (e) {
      setErr(String(e?.message || e));
    }
  }, [chatInput, sendMeshMessage]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <Link to="/" className={styles.back}>
          ← Ana sayfa
        </Link>
        <h1 className={styles.title}>Sanrı Ağı</h1>
        <p className={styles.lead}>
          Yerel ağ ve çevrimdışı: WebRTC veri kanalı, eşleştirme kodu ile doğrulama, mesajlar uçtan uca
          şifrelenir (AES-GCM, ECDH). Aynı Wi‑Fi’de tarayıcıdan isim listesi için isteğe bağlı{" "}
          <code>VITE_LAN_MESH_BEACON_URL</code> ile küçük bir beacon servisi çalıştırılabilir; bu cihazda
          açık sekmeler <strong>BroadcastChannel</strong> ile görünür.
        </p>
        <p className={styles.hintBox}>
          <strong>Yerelde iki sekme:</strong> adres çubuğu aynı olmalı —{" "}
          <code>localhost</code> ile <code>127.0.0.1</code> farklı “site” sayılır; ikisini de aynı host ile
          açın. Akış: host offer → guest answer üretir → answer’ı host’a yapıştırır → host “Answer uygula” →
          sonra guest “Şifreli oturumu başlat”; her iki tarafta <strong>aynı eşleştirme kodu</strong>.
        </p>
        <p className={styles.meta}>
          Bu cihaz kimliği: <code>{peerId}</code> · Ağ: {online ? "çevrimiçi" : "çevrimdışı"}
        </p>
      </header>

      <section className={styles.card}>
        <h2 className={styles.h2}>Yakındaki kullanıcılar</h2>
        <div className={styles.row}>
          <button type="button" className={styles.btn} onClick={() => refreshLanBeacon()}>
            Beacon tara (LAN)
          </button>
        </div>
        <ul className={styles.peerList}>
          {localPeers.length === 0 && lanPeers.length === 0 ? (
            <li className={styles.muted}>Liste boş — aynı tarayıcıda başka sekme açın veya beacon yapılandırın.</li>
          ) : null}
          {localPeers.map((p) => (
            <li key={p.id}>
              <span className={styles.badge}>sekme</span> {p.label} <code>{p.id.slice(0, 12)}…</code>
            </li>
          ))}
          {lanPeers.map((p) => (
            <li key={p.id}>
              <span className={styles.badge}>lan</span> {p.label}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Sanrı ağına bağlan</h2>
        <label className={styles.label}>
          Eşleştirme kodu (ortak gizli)
          <input
            className={styles.input}
            value={pairingCode}
            onChange={(e) => setPairingCode(e.target.value)}
            placeholder="örn. 4829-kedi"
            autoComplete="off"
          />
        </label>

        <div className={styles.grid2}>
          <div>
            <h3 className={styles.h3}>Oturum açan (host)</h3>
            <button type="button" className={styles.btnPrimary} onClick={onCreateHost}>
              Offer üret (SDP)
            </button>
            {hostOfferOut ? (
              <>
                <p className={styles.hint}>Aşağıdaki SDP’yi karşı tarafa iletin (kopyala / QR / dosya).</p>
                <textarea className={styles.ta} readOnly value={hostOfferOut} rows={6} />
                <label className={styles.label}>
                  Karşı tarafın answer SDP’si
                  <textarea
                    className={styles.ta}
                    value={hostAnswerIn}
                    onChange={(e) => setHostAnswerIn(e.target.value)}
                    rows={4}
                    placeholder="Answer SDP yapıştırın"
                  />
                </label>
                <button type="button" className={styles.btn} onClick={onPasteAnswer}>
                  Answer uygula ve şifreli oturumu başlat
                </button>
              </>
            ) : null}
          </div>
          <div>
            <h3 className={styles.h3}>Katılan (guest)</h3>
            <label className={styles.label}>
              Host SDP
              <textarea
                className={styles.ta}
                value={guestOfferIn}
                onChange={(e) => setGuestOfferIn(e.target.value)}
                rows={6}
                placeholder="Host’tan gelen offer SDP"
              />
            </label>
            <button type="button" className={styles.btnPrimary} onClick={onJoinGuest}>
              Answer üret
            </button>
            {guestAnswerOut ? (
              <>
                <p className={styles.hint}>Bu answer’ı host’a iletin; host uyguladıktan sonra aşağıya basın.</p>
                <textarea className={styles.ta} readOnly value={guestAnswerOut} rows={6} />
                <button type="button" className={styles.btnPrimary} onClick={onFinalizeGuest}>
                  Şifreli oturumu başlat (guest)
                </button>
              </>
            ) : null}
          </div>
        </div>

        <p className={styles.status}>
          Oturum: <strong>{meshStatus}</strong>
        </p>
        {err ? <p className={styles.err}>{err}</p> : null}
        <button type="button" className={styles.btnGhost} onClick={disconnectMesh}>
          Bağlantıyı kes
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Çevrimdışı sohbet</h2>
        <div className={styles.chat}>
          {meshMessages.map((m) => (
            <div key={m.id} className={m.direction === "out" ? styles.chatOut : styles.chatIn}>
              <span className={styles.chatMeta}>{m.direction === "out" ? "Sen" : "Eş"}</span>
              {m.text}
            </div>
          ))}
        </div>
        <div className={styles.chatRow}>
          <input
            className={styles.input}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendChat()}
            placeholder="Şifreli mesaj…"
          />
          <button type="button" className={styles.btnPrimary} onClick={onSendChat}>
            Gönder
          </button>
        </div>
      </section>
    </div>
  );
}
