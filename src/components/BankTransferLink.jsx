import React, { useCallback } from "react";
import { Link } from "react-router-dom";

/**
 * Havale / EFT akışına gider: /havale-odeme?content_id=...&return=...
 * debugProduct / debugAmount: konsolda hangi ürün + tutar + content_id gittiğini görmek için.
 */
export default function BankTransferLink({
  contentId,
  returnTo,
  className,
  children,
  debugProduct,
  debugAmount,
}) {
  const q = new URLSearchParams({ content_id: String(contentId || "").trim() });
  if (returnTo) q.set("return", returnTo);
  const to = `/havale-odeme?${q.toString()}`;

  const onClick = useCallback(() => {
    try {
      console.info("[SANRI bank-transfer] Havale linki tıklandı", {
        clicked_product: debugProduct ?? children ?? "(etiket yok)",
        sent_content_id: String(contentId || "").trim(),
        sent_amount_try: debugAmount ?? null,
        href: to,
      });
    } catch {
      /* ignore */
    }
  }, [contentId, children, debugAmount, debugProduct, to]);

  return (
    <Link className={className} to={to} onClick={onClick}>
      {children || "Havale / EFT ile öde"}
    </Link>
  );
}
