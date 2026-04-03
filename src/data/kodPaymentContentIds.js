/**
 * Kod ürünleri — Shopier `redirectToShopier` 2. argümanı, banka havale `content_id`,
 * `isShopierProductUnlocked` anahtarı: hepsi aynı dize olmalı (backend BANK_PRODUCT_CATALOG ile uyumlu).
 */
import { PRICE_CANLI_GIRIS_DERS, PRICE_KOD_TAM_PROGRAM } from "./kodEgitmeniData";

export const KOD_CONTENT_ID_ILK_KAPI = "kod_giris_ders";
export const KOD_CONTENT_ID_TAM_PROGRAM = "kod_egitmeni";

/** İnsan okunur etiket (log / debug) */
export const KOD_PRODUCT_DEBUG_LABEL = {
  [KOD_CONTENT_ID_ILK_KAPI]: `Kod Öğrenmeye Giriş — İlk Kapı (${PRICE_CANLI_GIRIS_DERS} TL)`,
  [KOD_CONTENT_ID_TAM_PROGRAM]: `SANRI Kod Okuma Sistemi™ — tam program (${PRICE_KOD_TAM_PROGRAM} TL)`,
};

export const KOD_PRODUCT_DEBUG_AMOUNT = {
  [KOD_CONTENT_ID_ILK_KAPI]: PRICE_CANLI_GIRIS_DERS,
  [KOD_CONTENT_ID_TAM_PROGRAM]: PRICE_KOD_TAM_PROGRAM,
};
