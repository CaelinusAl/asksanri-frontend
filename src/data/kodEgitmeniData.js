/**
 * SANRI Kod Okuma Sistemi™ — veri ve yardımcılar
 */

export {
  KOD_MODULLERI,
  MODUL_1_ID,
  MODUL_2_ID,
  MODUL_3_ID,
  getGlobalLessonIndex,
  DEFAULT_LESSON_INTRO,
  DEFAULT_LESSON_CLOSE,
  FREE_PREVIEW_LESSON_COUNT,
  FREE_PREVIEW_SANRI_COUNT,
} from "./kodOkumaSistemiData.js";

import { KOD_MODULLERI } from "./kodOkumaSistemiData.js";

export function getModuleById(moduleId) {
  return KOD_MODULLERI.find((m) => m.id === moduleId);
}

export function getLessonById(moduleId, lessonId) {
  const mod = getModuleById(moduleId);
  if (!mod) return null;
  return mod.lessons.find((l) => l.id === lessonId);
}

export function getAllLessonsFlat() {
  const out = [];
  for (const mod of KOD_MODULLERI) {
    for (const lesson of mod.lessons) {
      out.push({ ...lesson, moduleId: mod.id, moduleTitle: mod.title, moduleColor: mod.color });
    }
  }
  return out;
}

/** Kod Öğrenmeye Giriş — İlk Kapı (Shopier) */
export const PRICE_CANLI_GIRIS_DERS = 47;
/** SANRI Kod Okuma Sistemi™ — tam erişim (Shopier ile senkron) */
export const PRICE_KOD_TAM_PROGRAM = 999;
/** Paywall’da üstü çizili referans fiyat (gösterim) */
export const PAYWALL_LIST_STRIKE = 1299;

/** Liste / üstü çizili gösterim (landing fiyat kartı) */
export const PRICE_MONTHLY = 99;
/** Erken / ay gösterimi */
export const PRICE_EARLY = 47;
export const EARLY_LIMIT = 100;
export const PRICE_SINGLE = 9.90;
