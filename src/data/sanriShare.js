/** Sanrı viral paylaşım metni — Matrix Rol / Yankı yansıması */

export const SANRI_SHARE_URL = "https://asksanri.com";

/**
 * @param {string} anaTema — örn. narrative.sections.ana_tema veya yansıma özeti
 * @param {string} [shareUrl] — yoksa SANRI_SHARE_URL
 */
export function buildSanriShareText(anaTema, shareUrl) {
  const line = String(anaTema || "").trim() || "Matrix Rol okumamı denedim.";
  const url = String(shareUrl || "").trim() || SANRI_SHARE_URL;
  return `Sanrı'da kendimle ilgili bunu gördüm:\n\n${line}\n\nBu rastgele değilmiş.\n\n👉 ${url}`;
}

/** Sanrı yansıması metninden paylaşım için tek blok (YANSIMA: veya düz metin) */
export function parseReflectionShareLine(raw) {
  if (!raw || !String(raw).trim()) {
    return "Yankı Alanı'nda Sanrı yansıması aldım.";
  }
  const text = String(raw);
  const yansimaMatch = text.match(/YANSIMA:\s*([\s\S]*?)(?=\n\nDER[İI]NL[İI]K:|\n\nSORU:|$)/i);
  const chunk = yansimaMatch
    ? yansimaMatch[1].trim().replace(/\s+/g, " ")
    : text.replace(/\s+/g, " ").trim();
  if (chunk.length <= 280) return chunk;
  return `${chunk.slice(0, 277)}…`;
}

/** X (Twitter) karakter sınırı için kısaltma */
export function truncateForTwitter(text, max = 268) {
  const t = String(text);
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}
