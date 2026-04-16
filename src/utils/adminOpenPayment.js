/**
 * Admin’de ödeme / gelir ekranlarını giriş olmadan açmak (yerel geliştirme + isteğe bağlı prod).
 *
 * - Geliştirme (vite dev): varsayılan AÇIK. Kapatmak için .env: VITE_ADMIN_OPEN_PAYMENT_SCREENS=false
 * - Production build: yalnızca VITE_ADMIN_OPEN_PAYMENT_SCREENS=true ile açılır (bilinçli seçim).
 */
const PAYMENT_ADMIN_PREFIXES = [
  "/admin/billing",
  "/admin/banka-odemeleri",
  "/admin/revenue",
  "/admin/muhasebe",
  "/admin/premium",
];

export function isPaymentAdminPath(pathname) {
  if (!pathname || typeof pathname !== "string") return false;
  return PAYMENT_ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function isAdminPaymentScreensOpen() {
  const devOpen = import.meta.env.DEV && import.meta.env.VITE_ADMIN_OPEN_PAYMENT_SCREENS !== "false";
  const prodOpen = import.meta.env.VITE_ADMIN_OPEN_PAYMENT_SCREENS === "true";
  return devOpen || prodOpen;
}

export function allowUnauthenticatedPaymentAdmin(pathname) {
  return isAdminPaymentScreensOpen() && isPaymentAdminPath(pathname);
}
