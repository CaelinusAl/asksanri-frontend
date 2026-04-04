/** Okuma alanı — hangi yazıların açıldığı (localStorage). */

const STORAGE_KEY = "sanri_okuma_seen_v1";
export const OKUMA_EARLY_PAYWALL_MARKER = "<<<SANRI_PAYWALL>>>";

export function markOkumaSeen(slug) {
  if (!slug || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const set = new Set(Array.isArray(list) ? list : []);
    const wasNew = !set.has(slug);
    if (wasNew) {
      set.add(slug);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    }
    /* Her açılışta tetiklenir — liste “canlı” görünsün (Görüldü animasyonu vb.) */
    window.dispatchEvent(
      new CustomEvent("sanri-okuma-seen", { detail: { slug, wasNew } })
    );
  } catch {
    /* ignore */
  }
}

export function isOkumaSeen(slug) {
  if (!slug || typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) && list.includes(slug);
  } catch {
    return false;
  }
}
