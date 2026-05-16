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
      setErr("Önce her iki tarafta aynı olacak şekilde eşleştirme kodunu yazın (en az 4 karakter).");
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
      setErr("Eşleştirme kodunu girin — başlatan tarafla aynı olmalı.");
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

        <div className={styles.plainBox}>
          <p className={styles.plainLead}>
            <strong>Bu sayfa ne için?</strong> İki tarayıcı (veya telefon + bilgisayar) arasında, ortada
            SANRI sunucusu olmadan <em>kısa ve şifreli</em> bir “doğrudan hat” kurmayı dener. Mesajlar
            sadece bu iki uçta kalır.
          </p>
          <ul className={styles.plainList}>
            <li>
              <strong>Kim kullanır?</strong> Çoğu kullanıcının buraya uğraması gerekmez; deneme, eğitim
              veya özel gizlilik isteyenler için.
            </li>
            <li>
              <strong>Nasıl çalışır?</strong> Önce her iki tarafta <strong>aynı eşleştirme kodunu</strong>{" "}
              yazarsınız, sonra ekrandaki adımlar birbirine uzun metinler göndermenizi ister — o metinler
              teknik bağlantı kurar, sohbeti açar.
            </li>
          </ul>
        </div>

        <details className={styles.techDetails}>
          <summary className={styles.techSummary}>Teknik detaylar (isteğe bağlı)</summary>
          <div className={styles.techBody}>
            <p>
              WebRTC veri kanalı kullanılır; isteğe bağlı eşleştirme kodu ile uçtan uca şifreleme (AES-GCM,
              ECDH). Aynı Wi‑Fi’de cihaz listesi için geliştirici ortamında{" "}
              <code>VITE_LAN_MESH_BEACON_URL</code> ile küçük bir “beacon” servisi tanımlanabilir. Aynı
              tarayıcıda açık diğer sekmeler <strong>BroadcastChannel</strong> ile listelenebilir.
            </p>
            <p className={styles.techNote}>
              <strong>İki sekme denerken:</strong> Adres çubuğu aynı “site” olmalı —{" "}
              <code>localhost</code> ile <code>127.0.0.1</code> karışık kullanmayın. Sıra genelde: başlatan
              bağlantı metnini üretir → karşıya iletir → katılan yanıt metnini üretir → başlatana iletir →
              başlatan “yanıtı uygula” der → katılan “oturumu başlat” der — her adımda aynı eşleştirme
              kodu.
            </p>
          </div>
        </details>

        <p className={styles.meta}>
          Bu cihaz kimliği: <code>{peerId}</code> · İnternet: {online ? "var" : "yok (çevrimdışı mod)"}
        </p>
      </header>

      <section className={styles.card}>
        <h2 className={styles.h2}>Yakında bu tarayıcı</h2>
        <p className={styles.sectionHint}>
          Aynı tarayıcıda bu sayfanın açık olduğu başka sekmeler burada görünebilir. Farklı cihazlar için
          aşağıdaki “İki kişi” bölümünü kullanın.
        </p>
        <div className={styles.row}>
          <button type="button" className={styles.btn} onClick={() => refreshLanBeacon()}>
            Listeyi yenile
          </button>
        </div>
        <ul className={styles.peerList}>
          {localPeers.length === 0 && lanPeers.length === 0 ? (
            <li className={styles.muted}>
              Henüz kimse görünmüyor — aynı uygulamada ikinci bir sekme açın veya (gelişmiş) yerel ağ
              beacon’ı yapılandırın.
            </li>
          ) : null}
          {localPeers.map((p) => (
            <li key={p.id}>
              <span className={styles.badge}>sekme</span> {p.label} <code>{p.id.slice(0, 12)}…</code>
            </li>
          ))}
          {lanPeers.map((p) => (
            <li key={p.id}>
              <span className={styles.badge}>ağ</span> {p.label}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>İki kişi: bağlantı kurma</h2>

        <ol className={styles.steps}>
          <li>Her iki tarafta da <strong>aynı</strong> eşleştirme kodunu aşağıya yazın (örnek: birlikte uydurduğunuz bir söz).</li>
          <li>
            <strong>Başlatan</strong> önce “Bağlantı metnini oluştur”a basar; çıkan uzun metni karşıya kopyalar
            (mesaj, dosya, QR — nasıl isterseniz).
          </li>
          <li>
            <strong>Katılan</strong> bu metni yapıştırır, “Yanıt metnini oluştur”a basar; çıkan metni başlatana
            geri gönderir.
          </li>
          <li>Başlatan yanıtı yapıştırıp onaylar; ardından katılan son adımda oturumu başlatır.</li>
        </ol>

        <label className={styles.label}>
          Eşleştirme kodu (her iki tarafta aynı)
          <input
            className={styles.input}
            value={pairingCode}
            onChange={(e) => setPairingCode(e.target.value)}
            placeholder="örn. birlikte-4829-kedi"
            autoComplete="off"
          />
        </label>

        <div className={styles.grid2}>
          <div>
            <h3 className={styles.h3}>Başlatan (önce bu taraf)</h3>
            <button type="button" className={styles.btnPrimary} onClick={onCreateHost}>
              Bağlantı metnini oluştur
            </button>
            {hostOfferOut ? (
              <>
                <p className={styles.hint}>
                  Aşağıdaki metni kopyalayıp karşıya gönderin. (Teknik adı: SDP “offer”.)
                </p>
                <textarea className={styles.ta} readOnly value={hostOfferOut} rows={6} />
                <label className={styles.label}>
                  Karşı taraftan gelen yanıt metni
                  <textarea
                    className={styles.ta}
                    value={hostAnswerIn}
                    onChange={(e) => setHostAnswerIn(e.target.value)}
                    rows={4}
                    placeholder="Katılandan gelen metni buraya yapıştırın"
                  />
                </label>
                <button type="button" className={styles.btn} onClick={onPasteAnswer}>
                  Yanıtı uygula ve şifreli oturumu aç
                </button>
              </>
            ) : null}
          </div>
          <div>
            <h3 className={styles.h3}>Katılan (karşı taraf)</h3>
            <label className={styles.label}>
              Başlatandan gelen bağlantı metni
              <textarea
                className={styles.ta}
                value={guestOfferIn}
                onChange={(e) => setGuestOfferIn(e.target.value)}
                rows={6}
                placeholder="Başlatandan aldığınız uzun metni yapıştırın"
              />
            </label>
            <button type="button" className={styles.btnPrimary} onClick={onJoinGuest}>
              Yanıt metnini oluştur
            </button>
            {guestAnswerOut ? (
              <>
                <p className={styles.hint}>
                  Bu metni başlatana gönderin; başlatan yukarıda “yanıtı uygula” dedikten sonra burada devam
                  edin. (Teknik adı: SDP “answer”.)
                </p>
                <textarea className={styles.ta} readOnly value={guestAnswerOut} rows={6} />
                <button type="button" className={styles.btnPrimary} onClick={onFinalizeGuest}>
                  Şifreli oturumu başlat (katılan)
                </button>
              </>
            ) : null}
          </div>
        </div>

        <p className={styles.status}>
          Oturum durumu: <strong>{meshStatus}</strong>
        </p>
        {err ? <p className={styles.err}>{err}</p> : null}
        <button type="button" className={styles.btnGhost} onClick={disconnectMesh}>
          Bağlantıyı kes
        </button>
      </section>

      <section className={styles.card}>
        <h2 className={styles.h2}>Şifreli mesajlaşma</h2>
        <p className={styles.sectionHint}>
          Bağlantı kurulduktan sonra mesajlar burada görünür. Kurulmadıysa önce yukarıdaki adımları bitirin.
        </p>
        <div className={styles.chat}>
          {meshMessages.map((m) => (
            <div key={m.id} className={m.direction === "out" ? styles.chatOut : styles.chatIn}>
              <span className={styles.chatMeta}>{m.direction === "out" ? "Sen" : "Karşı taraf"}</span>
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
            placeholder="Mesajınız…"
          />
          <button type="button" className={styles.btnPrimary} onClick={onSendChat}>
            Gönder
          </button>
        </div>
      </section>
    </div>
  );
}
