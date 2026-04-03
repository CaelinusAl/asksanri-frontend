import React from "react";
import { Link } from "react-router-dom";

/**
 * Havale / EFT akışına gider: /havale-odeme?content_id=...&return=...
 */
export default function BankTransferLink({
  contentId,
  returnTo,
  className,
  children,
}) {
  const q = new URLSearchParams({ content_id: contentId });
  if (returnTo) q.set("return", returnTo);
  return (
    <Link className={className} to={`/havale-odeme?${q.toString()}`}>
      {children || "Havale / EFT ile öde"}
    </Link>
  );
}
