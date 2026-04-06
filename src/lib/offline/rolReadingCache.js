import { getUserSessionCache, putUserSessionCache } from "./nomadData";

const ROL_CACHE_KEY = "matrix_rol_last_reading";

/**
 * @param {{ apiData: object, fullName: string, birthDate: string }} payload
 */
export async function saveRolReadingCache(payload) {
  await putUserSessionCache(ROL_CACHE_KEY, {
    ...payload,
    savedAt: Date.now(),
  });
}

/** @returns {Promise<{ apiData: object, fullName: string, birthDate: string, savedAt?: number } | null>} */
export async function loadRolReadingCache() {
  const row = await getUserSessionCache(ROL_CACHE_KEY);
  const d = row?.data;
  if (!d || typeof d !== "object" || !d.apiData || !d.fullName) return null;
  return d;
}
