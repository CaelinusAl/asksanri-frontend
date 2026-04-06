/**
 * Çakışma çözümü: sunucu otoriter + LWW (last-write-wins) yerel sürüm damgası ile.
 * serverVersion / updatedAt birlikte kullanılır.
 */

/** @param {{ local?: { updatedAt?: number, localVersion?: number }, remote?: { updatedAt?: number, serverVersion?: number } }} p */
export function resolveContentConflict(p) {
  const lu = p.local?.updatedAt ?? p.local?.localVersion ?? 0;
  const ru = p.remote?.updatedAt ?? p.remote?.serverVersion ?? 0;
  if (ru >= lu) return "remote";
  return "local";
}

/** Sunucu yanıtından gelen sürümü satıra işle */
export function mergeServerSnapshot(localRow, serverPayload) {
  const remote = {
    updatedAt: serverPayload.updatedAt ?? serverPayload.serverTime ?? Date.now(),
    serverVersion: serverPayload.version ?? serverPayload.updatedAt ?? Date.now(),
  };
  const decision = resolveContentConflict({ local: localRow, remote });
  if (decision === "remote") {
    return {
      ...localRow,
      body: serverPayload.body ?? localRow.body,
      title: serverPayload.title ?? localRow.title,
      meta: { ...localRow.meta, ...serverPayload.meta },
      etag: serverPayload.etag ?? localRow.etag,
      serverVersion: remote.serverVersion,
      updatedAt: remote.updatedAt,
    };
  }
  return {
    ...localRow,
    serverVersion: remote.serverVersion,
  };
}
