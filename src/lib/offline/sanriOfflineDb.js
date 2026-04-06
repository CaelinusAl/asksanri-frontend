/**
 * SANRI offline-first — IndexedDB şeması.
 * Stores: satın alınan / açılmış içerik anlık görüntüleri, senkron kuyruğu, mesh mesaj günlüğü.
 */
import { openDB } from "idb";

const DB_NAME = "sanri-offline-v1";
const DB_VERSION = 2;

/** @typedef {{ contentId: string, payload: object, localVersion: number, serverVersion?: number, updatedAt: number }} EntitlementRow */
/** @typedef {{ key: string, kind: string, title?: string, body: string, meta?: object, etag?: string, localVersion: number, serverVersion?: number, updatedAt: number }} ContentSnapshotRow */
/** @typedef {{ id?: number, op: string, path: string, body: object, createdAt: number, status: 'pending'|'syncing'|'failed' }} SyncOutboxRow */
/** @typedef {{ id: string, peerId: string, direction: 'in'|'out', plaintext?: string, ciphertext?: string, iv?: string, ts: number }} MeshMessageRow */
/** N.O.M.A.D. v2 */
/** @typedef {{ id: string, contentId: string, title: string, body: string, preview: string, unlockMeta?: object, updatedAt: number }} PurchasedContentRow */
/** @typedef {{ id: string, notes: object[], updatedAt: number }} UserNotesRow */
/** @typedef {{ id: string, ritualId: string, state: object, updatedAt: number }} RitualStateRow */
/** @typedef {{ id: string, cityKey: string, updatedAt: number }} CityCacheRow */
/** @typedef {{ id: string, chakraId: string, snapshot: object, updatedAt: number }} FrequencyCacheRow */
/** @typedef {{ id?: number, type: string, op?: string, path?: string, body?: object, payload?: object, createdAt: number, updatedAt: number, status: string, lastError?: string }} PendingActionRow */
/** @typedef {{ id: string, data: object, updatedAt: number }} UserSessionCacheRow */

export async function openSanriDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains("entitlements")) {
        db.createObjectStore("entitlements", { keyPath: "contentId" });
      }
      if (!db.objectStoreNames.contains("contentSnapshots")) {
        db.createObjectStore("contentSnapshots", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("syncOutbox")) {
        db.createObjectStore("syncOutbox", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("meshMessages")) {
        db.createObjectStore("meshMessages", { keyPath: "id" });
      }
      if (oldVersion < 2) {
        const nomadStores = [
          ["purchased_contents", "id"],
          ["user_notes", "id"],
          ["ritual_states", "id"],
          ["city_content_cache", "id"],
          ["frequency_cache", "id"],
          ["user_session_cache", "id"],
        ];
        for (const [name, keyPath] of nomadStores) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath });
          }
        }
        if (!db.objectStoreNames.contains("pending_actions")) {
          db.createObjectStore("pending_actions", { keyPath: "id", autoIncrement: true });
        }
      }
    },
  });
}

export function okumaSnapshotKey(slug) {
  return `okuma:${slug}`;
}
