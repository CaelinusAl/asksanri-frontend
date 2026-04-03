/** Sanrı viral paylaşım metni — Matrix Rol / analiz sonuçları */

export const SANRI_SHARE_URL = "https://asksanri.com";

/**
 * @param {string} anaTema — örn. narrative.sections.ana_tema
 */
export function buildSanriShareText(anaTema) {
  const line = String(anaTema || "").trim() || "Matrix Rol okumamı denedim.";
  return `Sanrı'da kendimle ilgili bunu gördüm:\n\n${line}\n\nBu rastgele değilmiş.\n\n👉 ${SANRI_SHARE_URL}`;
}

/** X (Twitter) karakter sınırı için kısaltma */
export function truncateForTwitter(text, max = 268) {
  const t = String(text);
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
