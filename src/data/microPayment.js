const LS_KEY = "sanri_unlocked_items";

export const PRICING = {
  single_okuma: { price: 9.90, label: "Tek Okuma Açma", currency: "₺" },
  single_book: { price: 14.90, label: "Tek Kitap Açma", currency: "₺" },
  single_ritual: { price: 4.90, label: "Tek Ritüel Açma", currency: "₺" },
  weekly_pass: { price: 29.90, label: "Haftalık Geçiş", currency: "₺" },
  premium_monthly: { price: 79.90, label: "Premium Aylık", currency: "₺" },
  premium_yearly: { price: 599.90, label: "Premium Yıllık", currency: "₺", badge: "EN AVANTAJLI" },
};

function loadUnlocked() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUnlocked(ids) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

export function isItemUnlocked(contentId) {
  return loadUnlocked().includes(contentId);
}

export function unlockItem(contentId) {
  const ids = loadUnlocked();
  if (!ids.includes(contentId)) {
    ids.push(contentId);
    saveUnlocked(ids);
  }
}

export function getUnlockedItems() {
  return loadUnlocked();
}

export function getPricingForType(type) {
  return PRICING[type] || PRICING.single_okuma;
}

export function getAllPricingOptions() {
  return [
    { id: "single_okuma", ...PRICING.single_okuma, type: "single" },
    { id: "single_book", ...PRICING.single_book, type: "single" },
    { id: "single_ritual", ...PRICING.single_ritual, type: "single" },
    { id: "weekly_pass", ...PRICING.weekly_pass, type: "pass" },
    { id: "premium_monthly", ...PRICING.premium_monthly, type: "subscription" },
    { id: "premium_yearly", ...PRICING.premium_yearly, type: "subscription" },
  ];
}
