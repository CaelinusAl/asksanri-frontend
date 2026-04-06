import { flushSyncOutbox } from "./syncOutbox";
import {
  deletePendingAction,
  listPendingActions,
  updatePendingAction,
} from "./nomadData";
import { NOMAD_SYNC_PATH } from "./backendSyncPlan.js";

/**
 * Tek uç: tip + payload. Sunucu yoksa 404 — aksiyon failed kalır.
 * @param {(path: string, init?: RequestInit) => Promise<Response>} authFetch
 * @param {{ type: string, payload?: object, body?: object }} row
 */
async function pushNomadAction(authFetch, row) {
  const body = {
    type: row.type,
    payload: row.payload ?? row.body ?? {},
    clientUpdatedAt: row.updatedAt ?? row.createdAt,
  };
  const res = await authFetch(NOMAD_SYNC_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

/**
 * http_fetch: legacy syncOutbox ile aynı semantik (path + op + body).
 */
async function pushHttpFetch(authFetch, row) {
  const method = row.op === "POST" ? "POST" : "PUT";
  const res = await authFetch(row.path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row.body ?? {}),
  });
  return res;
}

/**
 * @param {(path: string, init?: RequestInit) => Promise<Response>} authFetch
 * @param {{ onResult?: (r: { flushedOutbox: number, pendingProcessed: number, pendingFailed: number, message?: string }) => void }} options
 */
export async function runNomadSync(authFetch, options = {}) {
  const { onResult } = options;
  let pendingProcessed = 0;
  let pendingFailed = 0;

  try {
    await flushSyncOutbox(authFetch);
    const pending = await listPendingActions();

    for (const row of pending) {
      if (row.id == null) continue;
      try {
        await updatePendingAction({ ...row, status: "syncing" });
        let res;
        if (row.type === "http_fetch" && row.path) {
          res = await pushHttpFetch(authFetch, row);
        } else if (
          row.type === "user_notes_sync" ||
          row.type === "ritual_session_complete" ||
          row.type === "ritual_state_sync"
        ) {
          res = await pushNomadAction(authFetch, row);
        } else {
          res = await pushNomadAction(authFetch, row);
        }
        if (!res.ok) {
          if (res.status === 404 || res.status === 501) {
            await updatePendingAction({
              ...row,
              status: "skipped",
              lastError: `http_${res.status}`,
            });
            pendingFailed++;
            continue;
          }
          throw new Error(String(res.status));
        }
        await deletePendingAction(row.id);
        pendingProcessed++;
      } catch {
        await updatePendingAction({ ...row, status: "failed", lastError: "network" });
        pendingFailed++;
      }
    }

    const message =
      pendingProcessed > 0
        ? `${pendingProcessed} yerel işlem sunucuya işlendi.`
        : pendingFailed > 0
          ? "Bazı çevrimdışı işlemler sunucuda henüz tanımlı değil (404). Veriler cihazda duruyor."
          : undefined;

    onResult?.({
      pendingProcessed,
      pendingFailed,
      message,
    });
  } catch {
    onResult?.({
      pendingProcessed: 0,
      pendingFailed: 0,
      message: "Senkron tamamlanamadı; tekrar denenecek.",
    });
  }
}
