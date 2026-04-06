/**
 * Uçtan uca uygulama katmanı şifreleme (WebRTC DTLS üstüne).
 * ECDH P-256 → SHA-256 → AES-256-GCM. Eşleştirme kodu ile kimlik doğrulama.
 */

const TE = new TextEncoder();
const TD = new TextDecoder();

function bufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBuffer(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export async function sha256Hex(input) {
  const buf = await crypto.subtle.digest("SHA-256", TE.encode(String(input)));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** @returns {Promise<CryptoKeyPair>} */
export async function createEcdhKeyPair() {
  return crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
}

/** @param {CryptoKey} publicKey */
export async function exportPublicKeySpki(publicKey) {
  const raw = await crypto.subtle.exportKey("spki", publicKey);
  return bufferToBase64(raw);
}

/** @param {string} b64 */
export async function importPublicKeySpki(b64) {
  const bytes = new Uint8Array(base64ToBuffer(b64));
  return crypto.subtle.importKey("spki", bytes, { name: "ECDH", namedCurve: "P-256" }, false, []);
}

/** @param {CryptoKey} privateKey @param {CryptoKey} theirPublic */
export async function deriveAesFromEcdh(privateKey, theirPublic) {
  const bits = await crypto.subtle.deriveBits({ name: "ECDH", public: theirPublic }, privateKey, 256);
  const hashed = await crypto.subtle.digest("SHA-256", bits);
  return crypto.subtle.importKey("raw", hashed, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function aesGcmEncrypt(aesKey, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, TE.encode(plaintext));
  return {
    iv: bufferToBase64(iv.buffer),
    ct: bufferToBase64(ct),
  };
}

export async function aesGcmDecrypt(aesKey, ivB64, ctB64) {
  const iv = new Uint8Array(base64ToBuffer(ivB64));
  const ct = new Uint8Array(base64ToBuffer(ctB64));
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, ct);
  return TD.decode(pt);
}

/** Eşleştirme kodu kanıtı (ilk el sıkışmada) */
export async function pairingProof(pairingCode) {
  return sha256Hex(`sanri-mesh-v1|${String(pairingCode).trim()}`);
}
