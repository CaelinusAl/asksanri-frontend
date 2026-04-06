/**
 * FastAPI / Postgres ile N.O.M.A.D. senkronu — uygulanacak uçlar (plan).
 *
 * POST /api/v1/nomad/sync
 * Body: { type: string, payload: object, clientUpdatedAt?: number }
 *
 * Tipler:
 * - user_notes_sync → { notes: Array<{id,text,date,updatedAt}>, updatedAt }
 *   Sunucu: kullanıcı başına tek doküman veya not satırları; çakışma: max(clientUpdatedAt) LWW.
 * - ritual_session_complete → { ritualId, completedAt, mood?, stepsTotal }
 *   Sunucu: ritual_completions tablosu; idempotent (ritualId + completedAt veya client uuid).
 * - ritual_state_sync → (ileride) ara adım durumu.
 * - purchased_contents_mirror → (isteğe bağlı) Shopier zaten kaynak; burada sadece audit.
 *
 * Mevcut syncOutbox (http_fetch) satırları pending_actions.type === "http_fetch" ile aynı kalır.
 *
 * GET /api/v1/nomad/state (opsiyonel)
 * — sunucudan not özeti + son ritüel tamamlamaları; istemci LWW birleştirir.
 */

export const NOMAD_SYNC_PATH = "/api/v1/nomad/sync";
