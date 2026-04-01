const MENTION_RE = /@([\w\u00C0-\u017F]+)/g;

export function extractMentions(text) {
  const matches = [];
  let m;
  while ((m = MENTION_RE.exec(text)) !== null) {
    matches.push(m[1]);
  }
  return [...new Set(matches)];
}

export function renderWithMentions(text) {
  if (!text) return [];
  const parts = [];
  let lastIdx = 0;
  let m;
  const re = new RegExp(MENTION_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push({ type: "text", value: text.slice(lastIdx, m.index) });
    }
    parts.push({ type: "mention", value: m[1] });
    lastIdx = re.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push({ type: "text", value: text.slice(lastIdx) });
  }
  return parts;
}
