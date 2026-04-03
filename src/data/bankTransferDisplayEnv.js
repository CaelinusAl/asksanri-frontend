/**
 * Havale / EFT ekranında gösterilecek banka bilgisi.
 * Vite yalnızca VITE_ ile başlayan değişkenleri bundle'a koyar.
 * Vercel: BANK_IBAN / BANK_NAME / BANK_ACCOUNT_NAME veya API ile aynı
 * BANK_TRANSFER_IBAN, BANK_TRANSFER_BANK, BANK_TRANSFER_NAME (vite.config eşler).
 */
export function getBankDisplayFromEnv() {
  return {
    iban: String(import.meta.env?.VITE_BANK_IBAN ?? "").trim(),
    bankName: String(import.meta.env?.VITE_BANK_NAME ?? "").trim(),
    accountName: String(import.meta.env?.VITE_BANK_ACCOUNT_NAME ?? "").trim(),
  };
}

/** Önizleme API'sinden gelen değerlerle birleştir; ENV doluysa öncelik ENV'de. */
export function resolveBankDisplay(preview) {
  const env = getBankDisplayFromEnv();
  return {
    iban: env.iban || String(preview?.iban || "").trim(),
    bankName: env.bankName || String(preview?.bank_name || "").trim(),
    accountName: env.accountName || String(preview?.recipient_name || "").trim(),
  };
}
