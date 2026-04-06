/**
 * SANRI Admin Genel Bakış — ölçülen veriden ürün katmanları ve gözlem satırları üretir.
 * Kurgu/metin uydurmaz; yalnızca gelen sayıları dil ile bağlar.
 */

/** Sayfa yolu → SANRI ürün yüzeyi (page_views.path ile eşleşir) */
export const PRODUCT_SURFACES = [
  { id: "okuma", label: "Okuma Alanı", hint: "Hologram / derin okumalar", match: (p) => p.includes("/okuma-alani") },
  { id: "yanki", label: "Yankı Alanı", hint: "Kolektif paylaşım", match: (p) => p.includes("/yanki") },
  {
    id: "sanri",
    label: "Sanrı'ya Sor",
    hint: "Sohbet / içgörü",
    match: (p) =>
      p.includes("/sanriya-sor") ||
      p.includes("/ask") ||
      (p.includes("/sanri") && !p.includes("/okuma")),
  },
  { id: "rol", label: "Matrix Rol Okuma", hint: "Rol analizi hunisi", match: (p) => p.includes("/rol-okuma") },
  { id: "kod", label: "Kod & AnKod", hint: "Eğitim ve kapı", match: (p) => p.includes("/kod-") || p.includes("/ankod") },
  { id: "frekans", label: "Frekans Alanı", hint: "Frekans içeriği", match: (p) => p.includes("/frekans") },
  { id: "bilinc", label: "Bilinç / Portal", hint: "Kapı ekranları", match: (p) => p.includes("/bilinc") || p.includes("/portal") },
  { id: "rituel", label: "Ritüel Alanı", hint: "Oturumlar", match: (p) => p.includes("/rituel") },
  { id: "library", label: "Kütüphane", hint: "Kitap okuyucu", match: (p) => p.includes("/library") || p.includes("/kutuphane") },
  { id: "book", label: "Kitap okuma", hint: "BookReader", match: (p) => p.includes("/book") || p.includes("/oku") },
  { id: "odeme", label: "Ödeme & Havale", hint: "Satın alma akışı", match: (p) => p.includes("/havale") || p.includes("/odeme") || p.includes("/iyzico") },
  { id: "profil", label: "Hesap", hint: "Giriş / profil", match: (p) => p.includes("/profil") || p.includes("/giris") },
  { id: "benim", label: "Benim Alanım", hint: "Kişisel teslimatlar", match: (p) => p.includes("/benim") },
];

/**
 * @param {{ path: string, views: number }[]} topPages — analytics/stats top_pages
 */
export function aggregateProductSurfaces(topPages) {
  if (!Array.isArray(topPages) || topPages.length === 0) {
    return PRODUCT_SURFACES.map((s) => ({ ...s, views: 0 }));
  }
  const out = PRODUCT_SURFACES.map((s) => ({ ...s, views: 0 }));
  for (const row of topPages) {
    const raw = String(row.path || "").split("?")[0].toLowerCase();
    const v = Number(row.views) || 0;
    if (!raw) continue;
    const hit = out.find((s) => s.match(raw));
    if (hit) hit.views += v;
  }
  return [...out].sort((a, b) => b.views - a.views);
}

/**
 * Okuma gönderileri + all-stats → en çok görüntülenen
 */
export function pickTopOkumaPost(okumaPosts, statsObj) {
  if (!Array.isArray(okumaPosts) || !statsObj || typeof statsObj !== "object") return null;
  let best = null;
  for (const post of okumaPosts) {
    const slug = post.slug;
    const s = statsObj[slug];
    const views = s?.views ?? 0;
    if (!best || views > best.views) {
      best = { slug, title: post.title, views, comments: s?.comments ?? 0, likes: s?.likes ?? 0 };
    }
  }
  return best;
}

const ACTION_TR = {
  page_view: "sayfa görüntüleme",
  vip_click: "VIP / kilit tıklaması",
  vip_unlock: "içerik kilidi açıldı",
  message_sent: "mesaj gönderildi",
  post_submitted: "yankı gönderimi",
  purchase_attempt: "satın alma denemesi",
  purchase_success: "satın alma tamamlandı",
  mode_switch: "mod değişimi",
  city_open: "şehir kartı açıldı",
};

function relTime(iso) {
  if (!iso || typeof iso !== "string") return "—";
  try {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return "az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} sa önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  } catch {
    return "—";
  }
}

/**
 * Dashboard recent_events → aktivite satırları (ürün diliyle)
 */
export function formatRecentEventsForFeed(recent) {
  if (!Array.isArray(recent) || recent.length === 0) return [];
  return recent.slice(0, 25).map((e) => {
    const action = String(e.action || "event").toLowerCase();
    const domain = e.domain ? String(e.domain) : "";
    const actLabel = ACTION_TR[action] || action;
    const domainBit = domain ? ` · ${domain}` : "";
    const uid = e.user_id != null ? ` kullanıcı #${e.user_id}` : "";
    const text = `${actLabel}${domainBit}${uid}`;
    return {
      type: action.includes("purchase") ? "premium" : action.includes("post") ? "post" : "register",
      text,
      time: relTime(e.created_at),
    };
  });
}

/**
 * Gerçek metriklerden SANRI gözlem satırları (kurgu yok)
 */
export function buildSanriObservations({
  dashboard,
  visitors,
  funnel,
  analytics,
  okumaTop,
  modPending,
}) {
  const lines = [];
  const users = dashboard?.users || {};
  const ev = dashboard?.events || {};
  const yk = dashboard?.yanki || {};

  if (typeof users.new_7d === "number" && users.new_7d > 0) {
    lines.push({
      tone: "top",
      text: `Son 7 günde ${users.new_7d.toLocaleString("tr-TR")} yeni hesap oluşturuldu — SANRI ağına giriş.`,
    });
  }
  if (typeof users.active_24h === "number") {
    lines.push({
      tone: "pattern",
      text: `Son 24 saatte ${users.active_24h.toLocaleString("tr-TR")} oturumlu kullanıcı en az bir etkinlik üretti (events tablosu).`,
    });
  }
  if (typeof users.premium === "number") {
    lines.push({
      tone: "convert",
      text: `Şu an ${users.premium.toLocaleString("tr-TR")} premium işaretli kullanıcı kayıtlı.`,
    });
  }

  if (typeof ev.last_7d === "number" && ev.last_7d > 0) {
    lines.push({
      tone: "hot",
      text: `Son 7 günde ${ev.last_7d.toLocaleString("tr-TR")} toplam platform etkinliği işlendi.`,
    });
  }
  if (typeof ev.vip_clicks === "number" && ev.vip_clicks > 0) {
    lines.push({
      tone: "convert",
      text: `Son 7 günde ${ev.vip_clicks.toLocaleString("tr-TR")} kez VIP / kilit katmanına tıklama kaydedildi.`,
    });
  }

  const pend = modPending ?? yk.pending;
  if (typeof pend === "number" && pend > 0) {
    lines.push({
      tone: "warn",
      text: `Yankı moderasyon kuyruğunda ${pend} bekleyen içerik var — kolektif alan için öncelik.`,
    });
  }

  if (visitors?.views?.week != null) {
    lines.push({
      tone: "pattern",
      text: `Sayfa ölçümü: son 7 günde ${Number(visitors.views.week).toLocaleString("tr-TR")} toplam görüntülenme (page_views).`,
    });
  }

  if (funnel?.role_funnel && typeof funnel.role_funnel === "object") {
    const rf = funnel.role_funnel;
    const pv = rf.page_view || 0;
    const ok = rf.unlock_success || 0;
    const days = funnel.days ?? 7;
    if (pv > 0) {
      lines.push({
        tone: "convert",
        text: `Matrix Rol hunisi (${days} gün): ${pv} liste görüntülemesi → ${ok} başarılı ödeme / kilidi açma.`,
      });
    }
  }

  if (analytics?.event_counts && typeof analytics.event_counts === "object") {
    const ec = analytics.event_counts;
    const pv = ec.page_view ?? 0;
    const ps = ec.post_submitted ?? 0;
    if (pv > 0) {
      lines.push({
        tone: "pattern",
        text: `Analytics penceresinde ${pv.toLocaleString("tr-TR")} page_view ve ${ps.toLocaleString("tr-TR")} yankı gönderimi sayıldı.`,
      });
    }
  }

  if (okumaTop && okumaTop.views > 0) {
    lines.push({
      tone: "top",
      text: `Okuma tarafında şu an en çok görüntülenen: «${okumaTop.title}» (${okumaTop.views.toLocaleString("tr-TR")} görüntülenme, okuma_views).`,
    });
  }

  if (Array.isArray(ev.top_domains) && ev.top_domains.length > 0) {
    const top = ev.top_domains[0];
    if (top?.name && top?.count) {
      lines.push({
        tone: "pattern",
        text: `Etkinliklerde öne çıkan alan: «${top.name}» (${Number(top.count).toLocaleString("tr-TR")} olay / 7 gün).`,
      });
    }
  }

  return lines;
}
