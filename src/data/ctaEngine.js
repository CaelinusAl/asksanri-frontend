const LS_KEY = "sanri_cta_engine";

const CTA_POOL = [
  {
    id: "cta-1",
    text: "Bu katmanın devamı seni bekliyor.",
    score: 94,
    placement: "after_content",
    clicks: 127,
    conversions: 18,
  },
  {
    id: "cta-2",
    text: "Sanrı bu cümlenin altını da açtı.",
    score: 87,
    placement: "after_sanri",
    clicks: 89,
    conversions: 12,
  },
  {
    id: "cta-3",
    text: "Görünenin altında bir katman daha var.",
    score: 83,
    placement: "after_content",
    clicks: 64,
    conversions: 8,
  },
  {
    id: "cta-4",
    text: "Bu frekansın devamını duymak ister misin?",
    score: 79,
    placement: "after_content",
    clicks: 52,
    conversions: 6,
  },
  {
    id: "cta-5",
    text: "Buraya kadar okuyan nadir kişilerdensin. Devamı hazır.",
    score: 76,
    placement: "after_content",
    clicks: 41,
    conversions: 5,
  },
  {
    id: "cta-6",
    text: "Kitabın geri kalanı sana ne söylüyor — görmek ister misin?",
    score: 71,
    placement: "after_content",
    clicks: 38,
    conversions: 3,
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function getDefaultState() {
  return {
    enabled: true,
    abActive: true,
    variantA: "cta-1",
    variantB: "cta-3",
    statsA: { impressions: 340, clicks: 127, conversions: 18 },
    statsB: { impressions: 340, clicks: 64, conversions: 8 },
    winner: null,
    autoThreshold: 500,
  };
}

export function getCtaEngineState() {
  return loadState() || getDefaultState();
}

export function setCtaEngineState(partial) {
  const current = getCtaEngineState();
  const next = { ...current, ...partial };
  saveState(next);
  return next;
}

export function getCtaPool() {
  return CTA_POOL;
}

export function getCtaById(id) {
  return CTA_POOL.find((c) => c.id === id) || null;
}

export function pickCtaForUser() {
  const state = getCtaEngineState();
  if (!state.enabled) return null;

  if (state.winner) {
    return getCtaById(state.winner);
  }

  if (state.abActive && state.variantA && state.variantB) {
    const pick = Math.random() < 0.5 ? state.variantA : state.variantB;
    return getCtaById(pick);
  }

  const sorted = [...CTA_POOL].sort((a, b) => b.score - a.score);
  return sorted[0] || null;
}

export function recordCtaClick(ctaId) {
  const state = getCtaEngineState();
  if (ctaId === state.variantA && state.statsA) {
    state.statsA.clicks += 1;
  } else if (ctaId === state.variantB && state.statsB) {
    state.statsB.clicks += 1;
  }
  checkWinner(state);
  saveState(state);
}

export function recordCtaConversion(ctaId) {
  const state = getCtaEngineState();
  if (ctaId === state.variantA && state.statsA) {
    state.statsA.conversions += 1;
  } else if (ctaId === state.variantB && state.statsB) {
    state.statsB.conversions += 1;
  }
  checkWinner(state);
  saveState(state);
}

function checkWinner(state) {
  if (state.winner || !state.abActive) return;
  const totalImpressions = (state.statsA?.impressions || 0) + (state.statsB?.impressions || 0);
  if (totalImpressions < (state.autoThreshold || 500)) return;

  const rateA = state.statsA?.impressions ? state.statsA.conversions / state.statsA.impressions : 0;
  const rateB = state.statsB?.impressions ? state.statsB.conversions / state.statsB.impressions : 0;
  const diff = Math.abs(rateA - rateB);

  if (diff > 0.01) {
    state.winner = rateA >= rateB ? state.variantA : state.variantB;
    state.abActive = false;
  }
}

export function resetAbTest(variantAId, variantBId) {
  const state = getCtaEngineState();
  state.variantA = variantAId || "cta-1";
  state.variantB = variantBId || "cta-3";
  state.statsA = { impressions: 0, clicks: 0, conversions: 0 };
  state.statsB = { impressions: 0, clicks: 0, conversions: 0 };
  state.winner = null;
  state.abActive = true;
  saveState(state);
  return state;
}
