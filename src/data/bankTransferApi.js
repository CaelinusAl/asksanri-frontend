/** Havale / EFT istekleri bu köke gider (build-time VITE_BACKEND_URL veya varsayılan Railway). */
export const BANK_TRANSFER_API_BASE =
  (typeof window !== "undefined" &&
    import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

const API = BANK_TRANSFER_API_BASE;

function formatApiDetail(detail) {
  if (detail == null) return "";
  if (typeof detail === "string") return detail;
  if (typeof detail === "object") {
    if (detail.message_tr) return String(detail.message_tr);
    if (detail.message) return String(detail.message);
    return JSON.stringify(detail, null, 2);
  }
  return String(detail);
}

export async function fetchBankTransferPreview(contentId) {
  const cid = String(contentId || "").trim();
  try {
    console.info("[SANRI bank-transfer] POST /bank-transfer/preview", {
      sent_content_id: cid,
      api_base: API,
    });
  } catch {
    /* ignore */
  }
  const res = await fetch(`${API}/bank-transfer/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_id: cid }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      formatApiDetail(data.detail) || data.message || `Hata: ${res.status}`,
    );
  }
  return data;
}

export async function submitBankTransferRequest({
  name,
  email,
  contentId,
  transferCode,
  receiptFile,
}) {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("email", email);
  fd.append("content_id", contentId);
  fd.append("transfer_code", transferCode);
  fd.append("receipt", receiptFile);
  const res = await fetch(`${API}/bank-transfer/submit`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      formatApiDetail(data.detail) || data.message || `Hata: ${res.status}`,
    );
  }
  return data;
}

export async function fetchBankTransferStatus(email, transferCode) {
  const q = new URLSearchParams({
    email: email.trim().toLowerCase(),
    transfer_code: transferCode.trim().toUpperCase(),
  });
  const res = await fetch(`${API}/bank-transfer/status?${q}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(formatApiDetail(data.detail) || `Hata: ${res.status}`);
  }
  return data;
}

/** Banka sinyali veya 15 dk geçici erişim — amount talepteki tutar ile aynı olmalı. */
export async function verifyBankTransferInstant({
  transferCode,
  amount,
  email,
  deviceFp,
}) {
  const res = await fetch(`${API}/bank-transfer/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transfer_code: String(transferCode || "").trim().toUpperCase(),
      amount,
      email: String(email || "").trim().toLowerCase(),
      device_fp: deviceFp || undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      formatApiDetail(data.detail) || data.message_tr || `Hata: ${res.status}`,
    );
  }
  return data;
}
