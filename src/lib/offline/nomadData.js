import { openSanriDb } from "./sanriOfflineDb";

/** @param {string} userKey */
export function notesDocId(userKey) {
  return `notes:${userKey || "anon"}`;
}

/**
 * Satın alınmış / açılmış ürün özeti (Benim Alanım + sunucu senkronu için).
 * @param {{ id: string, title?: string, body?: string, preview?: string, unlockMeta?: object }} row
 */
export async function putPurchasedContent(row) {
  const db = await openSanriDb();
  const id = row.id || row.contentId;
  await db.put("purchased_contents", {
    id,
    contentId: id,
    title: row.title || id,
    body: row.body ?? "",
    preview: row.preview ?? "",
    unlockMeta: row.unlockMeta || {},
    updatedAt: Date.now(),
  });
}

export async function getPurchasedContent(id) {
  const db = await openSanriDb();
  return db.get("purchased_contents", id);
}

export async function listPurchasedContents() {
  const db = await openSanriDb();
  return db.getAll("purchased_contents");
}

/**
 * @param {string} userKey
 * @param {{ notes: object[], updatedAt?: number }} doc
 */
export async function putUserNotesDoc(userKey, doc) {
  const db = await openSanriDb();
  const id = notesDocId(userKey);
  await db.put("user_notes", {
    id,
    notes: doc.notes || [],
    updatedAt: doc.updatedAt ?? Date.now(),
  });
}

export async function getUserNotesDoc(userKey) {
  const db = await openSanriDb();
  return db.get("user_notes", notesDocId(userKey));
}

/**
 * @param {string} ritualId
 * @param {object} state
 */
export async function putRitualState(ritualId, state) {
  const db = await openSanriDb();
  await db.put("ritual_states", {
    id: ritualId,
    ritualId,
    state,
    updatedAt: Date.now(),
  });
}

export async function getRitualState(ritualId) {
  const db = await openSanriDb();
  return db.get("ritual_states", ritualId);
}

/**
 * @param {string} cityKey örn. şehir route id
 * @param {{ title?: string, language?: string, readings?: string[], city?: object }} payload
 */
export async function putCityContentCache(cityKey, payload) {
  const db = await openSanriDb();
  const id = `city:${cityKey}`;
  await db.put("city_content_cache", {
    id,
    cityKey,
    ...payload,
    updatedAt: Date.now(),
  });
}

export async function getCityContentCache(cityKey) {
  const db = await openSanriDb();
  return db.get("city_content_cache", `city:${cityKey}`);
}

/**
 * Frekans Alanı — seçili çakra anlık görüntüsü.
 * @param {object} chakra chakraData öğesi
 */
export async function putFrequencyFieldCache(chakra) {
  if (!chakra?.id) return;
  const db = await openSanriDb();
  const now = Date.now();
  const id = `freq:${chakra.id}`;
  await db.put("frequency_cache", {
    id,
    chakraId: chakra.id,
    snapshot: { ...chakra },
    updatedAt: now,
  });
  await putUserSessionCache("frekans_last_chakra_id", { chakraId: chakra.id, updatedAt: now });
}

/** En son kaydedilen çakra anlık görüntüsü (offline ilk yükleme). */
export async function getLatestFrequencyChakraSnapshot() {
  const db = await openSanriDb();
  const all = await db.getAll("frequency_cache");
  if (!all.length) return null;
  const best = all.reduce((a, b) => (a.updatedAt >= b.updatedAt ? a : b));
  return best?.snapshot && typeof best.snapshot === "object" ? best.snapshot : null;
}

/**
 * Bundle’daki çakra tanımı ile IDB snapshot birleştir (eksik alanları tamamla).
 * @param {object} snapshot
 * @param {Array<object>} canonicalList chakraData
 */
export function mergeChakraSnapshotWithBundle(snapshot, canonicalList) {
  if (!snapshot || typeof snapshot !== "object") return null;
  const id = snapshot.id;
  if (id == null) return null;
  const base = canonicalList.find((c) => c.id === id);
  if (!base) return snapshot;
  return { ...base, ...snapshot };
}

export async function getFrequencyFieldCache(chakraId) {
  const db = await openSanriDb();
  return db.get("frequency_cache", `freq:${chakraId}`);
}

/**
 * @param {string} key
 * @param {object} data
 */
export async function putUserSessionCache(key, data) {
  const db = await openSanriDb();
  await db.put("user_session_cache", {
    id: key,
    data,
    updatedAt: Date.now(),
  });
}

export async function getUserSessionCache(key) {
  const db = await openSanriDb();
  return db.get("user_session_cache", key);
}

/**
 * @param {{ type: string, op?: string, path?: string, body?: object, payload?: object }} action
 */
export async function enqueuePendingAction(action) {
  const db = await openSanriDb();
  const now = Date.now();
  await db.add("pending_actions", {
    type: action.type,
    op: action.op,
    path: action.path,
    body: action.body,
    payload: action.payload,
    createdAt: now,
    updatedAt: now,
    status: "pending",
  });
}

export async function listPendingActions() {
  const db = await openSanriDb();
  const all = await db.getAll("pending_actions");
  return all.filter(
    (r) =>
      r.status === "skipped"
        ? false
        : r.status === "pending" ||
          r.status === "failed" ||
          r.status === "syncing",
  );
}

export async function deletePendingAction(id) {
  const db = await openSanriDb();
  await db.delete("pending_actions", id);
}

export async function updatePendingAction(row) {
  const db = await openSanriDb();
  await db.put("pending_actions", { ...row, updatedAt: Date.now() });
}

/**
 * Shopier / yerel kilit listesini purchased_contents ile hizala.
 * @param {Array<{ id: string, label?: string, at?: string|number }>} items
 */
export async function mirrorShopierUnlockedToNomad(items) {
  for (const item of items) {
    await putPurchasedContent({
      id: item.id,
      title: item.label || item.id,
      preview: item.at != null ? String(item.at) : "",
      unlockMeta: { source: "benim_alanim", ...item },
    });
  }
}
