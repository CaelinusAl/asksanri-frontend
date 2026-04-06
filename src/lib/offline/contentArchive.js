import { openSanriDb, okumaSnapshotKey } from "./sanriOfflineDb";
import { putPurchasedContent } from "./nomadData";

/**
 * Okuma (veya diğer) içeriğini offline okumak için anlık görüntü kaydet.
 * @param {string} slug
 * @param {{ title?: string, body: string, meta?: object, etag?: string }} snap
 */
export async function putContentSnapshot(slug, snap) {
  const db = await openSanriDb();
  const key = okumaSnapshotKey(slug);
  const row = {
    key,
    kind: "okuma",
    title: snap.title,
    body: snap.body,
    meta: snap.meta || {},
    etag: snap.etag,
    localVersion: Date.now(),
    updatedAt: Date.now(),
  };
  const prev = await db.get("contentSnapshots", key);
  if (prev?.serverVersion != null) row.serverVersion = prev.serverVersion;
  await db.put("contentSnapshots", row);
  return row;
}

/** @returns {Promise<import('./sanriOfflineDb.js').ContentSnapshotRow | undefined>} */
export async function getContentSnapshot(slug) {
  const db = await openSanriDb();
  return db.get("contentSnapshots", okumaSnapshotKey(slug));
}

/** Satın alınan / açılmış content_id kaydı (senkron ve offline gate için) */
export async function putEntitlement(contentId, payload = {}) {
  const db = await openSanriDb();
  const row = {
    contentId,
    payload,
    localVersion: Date.now(),
    updatedAt: Date.now(),
  };
  await db.put("entitlements", row);
  try {
    await putPurchasedContent({
      id: contentId,
      title: payload.slug || payload.title || String(contentId),
      body: typeof payload.body === "string" ? payload.body : "",
      preview: payload.preview != null ? String(payload.preview) : "",
      unlockMeta: { ...payload, contentId },
    });
  } catch {
    /* offline db kapalıysa sessiz */
  }
  return row;
}

export async function getEntitlement(contentId) {
  const db = await openSanriDb();
  return db.get("entitlements", contentId);
}

export async function listCachedOkumaKeys() {
  const db = await openSanriDb();
  const keys = await db.getAllKeys("contentSnapshots");
  return keys.filter((k) => typeof k === "string" && k.startsWith("okuma:"));
}
