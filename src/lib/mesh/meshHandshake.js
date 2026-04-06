import {
  createEcdhKeyPair,
  exportPublicKeySpki,
  importPublicKeySpki,
  deriveAesFromEcdh,
  pairingProof,
  aesGcmEncrypt,
  aesGcmDecrypt,
} from "./meshCrypto";

function attachEncryptedPipe(dc, aes, onPlain) {
  dc.addEventListener("message", async (e) => {
    try {
      const m = JSON.parse(typeof e.data === "string" ? e.data : "");
      if (m.t === "enc" && m.iv && m.ct) {
        const plain = await aesGcmDecrypt(aes, m.iv, m.ct);
        onPlain(plain);
      }
    } catch {
      /* ignore */
    }
  });
}

/**
 * @param {RTCDataChannel} dc
 * @param {'host'|'guest'} role
 * @param {string} pairingCode
 */
export async function establishSecureSession(dc, role, pairingCode) {
  const expectedProof = await pairingProof(pairingCode);
  const keyPair = await createEcdhKeyPair();
  const myPubB64 = await exportPublicKeySpki(keyPair.publicKey);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("El sıkışma zaman aşımı — eşleştirme kodları aynı mı?")), 40000);
    let done = false;
    /** @type {ReturnType<typeof setInterval> | null} */
    let hostHiTimer = null;

    const finish = (aes) => {
      if (done) return;
      done = true;
      if (hostHiTimer != null) clearInterval(hostHiTimer);
      clearTimeout(timeout);
      resolve({
        sendEncrypted: async (text) => {
          const { iv, ct } = await aesGcmEncrypt(aes, text);
          dc.send(JSON.stringify({ t: "enc", iv, ct }));
        },
        onEncrypted: (cb) => attachEncryptedPipe(dc, aes, cb),
      });
    };

    dc.addEventListener("message", async (ev) => {
      try {
        const msg = JSON.parse(typeof ev.data === "string" ? ev.data : "");
        if (msg.t !== "mesh-hi" || msg.proof !== expectedProof || !msg.pubKeySpki) return;
        const theirPub = await importPublicKeySpki(msg.pubKeySpki);
        const aes = await deriveAesFromEcdh(keyPair.privateKey, theirPub);

        if (role === "guest" && msg.fromHost) {
          dc.send(
            JSON.stringify({
              t: "mesh-hi",
              proof: expectedProof,
              pubKeySpki: myPubB64,
              fromGuest: true,
            }),
          );
          finish(aes);
        }
        if (role === "host" && msg.fromGuest) {
          finish(aes);
        }
      } catch (e) {
        if (!done) {
          done = true;
          clearTimeout(timeout);
          reject(e);
        }
      }
    });

    const hostPayload = JSON.stringify({
      t: "mesh-hi",
      proof: expectedProof,
      pubKeySpki: myPubB64,
      fromHost: true,
    });

    const sendHostHello = () => {
      try {
        if (role === "host" && !done) dc.send(hostPayload);
      } catch {
        /* kanal kapalı */
      }
    };

    if (role === "host") {
      if (dc.readyState === "open") sendHostHello();
      else dc.addEventListener("open", sendHostHello, { once: true });
      /* El sıkışma 25s’e kadar sürebilir; erken durdurma guest’ın hiç mesh-hi almamasına yol açıyordu. */
      hostHiTimer = setInterval(sendHostHello, 400);
    }
  });
}
