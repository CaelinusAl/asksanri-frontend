const API =
  (typeof window !== "undefined" &&
    import.meta?.env?.VITE_BACKEND_URL &&
    String(import.meta.env.VITE_BACKEND_URL).replace(/\/$/, "")) ||
  "https://sanri-api-production-4a7b.up.railway.app";

export async function fetchBankTransferPreview(contentId) {
  const res = await fetch(`${API}/bank-transfer/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_id: contentId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || data.message || `Hata: ${res.status}`);
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
    const d = data.detail;
    const msg = typeof d === "string" ? d : d?.message || JSON.stringify(d) || `Hata: ${res.status}`;
    throw new Error(msg);
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
  if (!res.ok) throw new Error(data.detail || `Hata: ${res.status}`);
  return data;
}
