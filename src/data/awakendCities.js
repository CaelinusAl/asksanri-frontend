import { cities } from "./cities";

function pad(n) {
  return String(n).padStart(2, "0");
}

export const awakenedCities = (cities.tr || []).map((c, i) => {
  const en = cities.en?.[i] || {};
  const plate = pad(c.id);
  return {
    id: c.id,
    plate,
    phone: plate,
    nameTR: c.name,
    nameEN: en.name || c.name,
    archetypeTR: `${c.symbol} • ${c.element} — ${c.description}`,
    archetypeEN: `${en.symbol || c.symbol} • ${en.element || c.element} — ${en.description || c.description}`,
    promptTR: `${plate}. ${c.name} — ${c.symbol}, ${c.element}.\n${c.description}`,
    promptEN: `${plate}. ${en.name || c.name} — ${en.symbol || c.symbol}, ${en.element || c.element}.\n${en.description || c.description}`,
  };
});
