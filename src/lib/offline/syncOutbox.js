import { openSanriDb } from "./sanriOfflineDb";
import { mergeServerSnapshot } from "./syncPolicy";
import { getContentSnapshot, putContentSnapshot } from "./contentArchive";

/**
 * Çevrimdışıyken yapılan işlemleri kuyruğa al; çevrimiçi olunca flush et.
 */
export async function enqueueSyncOp(op, path, body) {
  const db = await openSanriDb();
  await db.add("syncOutbox", {
    op,
    path,
    body,
    createdAt: Date.now(),
    status: "pending",
  });
}

export async function listPendingOutbox() {
  const db = await openSanriDb();
  const all = await db.getAll("syncOutbox");
  return all.filter((r) => r.status === "pending" || r.status === "failed");
}

/**
 * @param {(path: string, init: RequestInit) => Promise<Response>} fetcher — auth header’lı fetch
 */
export async function flushSyncOutbox(fetcher) {
  const db = await openSanriDb();
  const pending = await listPendingOutbox();
  for (const row of pending) {
    if (row.id == null) continue;
    try {
      await db.put("syncOutbox", { ...row, status: "syncing" });
      const res = await fetcher(row.path, {
        method: row.op === "POST" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row.body),
      });
      if (!res.ok) throw new Error(String(res.status));
      await db.delete("syncOutbox", row.id);
    } catch {
      await db.put("syncOutbox", { ...row, status: "failed" });
    }
  }
}

/**
 * Sunucudan içerik çek; varsa IndexedDB ile birleştir (çakışma politikası).
 * @param {string} slug
 * @param {(path: string) => Promise<Response>} getFetcher
 */
export async function pullAndMergeOkuma(slug, getFetcher) {
  const local = await getContentSnapshot(slug);
  try {
    const res = await getFetcher(`/okuma/content/${encodeURIComponent(slug)}`);
    if (!res.ok) return local;
    const data = await res.json().catch(() => null);
    if (!data || typeof data !== "object") return local;
    const serverPayload = {
      body: typeof data.body === "string" ? data.body : JSON.stringify(data),
      title: data.title,
      meta: data.meta,
      etag: res.headers.get("etag") || undefined,
      updatedAt: Date.now(),
      version: Date.now(),
    };
    if (!local) {
      await putContentSnapshot(slug, {
        title: serverPayload.title,
        body: serverPayload.body,
        meta: serverPayload.meta,
        etag: serverPayload.etag,
      });
      return getContentSnapshot(slug);
    }
    const merged = mergeServerSnapshot(local, serverPayload);
    const db = await openSanriDb();
    await db.put("contentSnapshots", merged);
    return merged;
  } catch {
    return local;
  }
}
