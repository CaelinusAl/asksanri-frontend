import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../components/admin/StatCard";
import styles from "./AdminDashboardPage.module.css";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import { useAdmin } from "../../contexts/AdminContext";
import {
  fetchDashboard,
  fetchMembership,
  fetchModerationStats,
  fetchVisitorStats,
  fetchAnalytics,
  fetchFunnelStats,
  fetchOkumaAllStats,
} from "../../data/adminApi";
import { OKUMA_POSTS } from "../../data/okumaData";
import {
  aggregateProductSurfaces,
  pickTopOkumaPost,
  buildSanriObservations,
  formatRecentEventsForFeed,
} from "../../data/adminOverviewEngine";
import {
  getCtaEngineState,
  setCtaEngineState,
  getCtaPool,
  getCtaById,
  resetAbTest,
} from "../../data/ctaEngine";

const MOCK_DASHBOARD = {
  total_users: 1247,
  daily_active: 89,
  new_signups: 12,
};

const MOCK_MEMBERSHIP = {
  premium_count: 34,
};

const MOCK_MODERATION = {
  pending: 3,
};

const CONTENT_OPPORTUNITIES = [
  {
    type: "gap",
    text: "Rüya kategorisinde ciddi içerik eksikliği var. Son 2 haftada sadece 3 paylaşım yapıldı — ama arama trendlerinde rüya soruları artıyor.",
    draft: {
      category: "sembol_okumasi",
      title: "RÜYA = BİLİNÇALTININ KODU",
      subtitle: "Gördüğün her şey bir mesaj taşır. Ama sen mesajı okumayı seçmelisin.",
    },
  },
  {
    type: "trend",
    text: "\"Kontrol\" teması yükseliyor. Yankı Alanı'nda kontrol, bırakmak ve teslim kelimeleri son 7 günde %140 arttı.",
    expansion: {
      ideas: [
        "KONTROL = İLLÜZYON KODU — kontrol ettiğini sandığın şey seni kontrol eder",
        "TESLİMİYET ≠ ZAYIFLIK — bırakmak, en güçlü eylemdir",
        "TUTMA REFLEKSİ — neden bırakamıyorsun? Bedenin cevabı biliyor",
      ],
      ritual: "Bırakma Nefesi — 3 dakikalık kontrol frekansı temizleme ritüeli",
      sanriQuestion: "Şu an en çok kontrol etmeye çalıştığın şey ne — ve onu bıraksan ne olur?",
    },
  },
  {
    type: "gap",
    text: "Sembol Okuması kategorisinde hiç Okuma Alanı postu yok. Instagram'da en çok paylaşılan içerik tipi buyken, platformda karşılığı eksik.",
    draft: {
      category: "sembol_okumasi",
      title: "AYNA = YANSIMA KODU",
      subtitle: "Dışarıda gördüğün her şey — senin bir parçanın yansıması.",
    },
  },
  {
    type: "trend",
    text: "Gece saatlerinde \"yalnızlık\" ve \"bağlantı\" temaları patlıyor. Gece özel bir ritüel veya okuma serisi bu kitleyi yakalar.",
    expansion: {
      ideas: [
        "GECE FREKANSINDA — karanlık, bilinçaltının konuşma saatidir",
        "YALNIZLIK ≠ KOPUŞ — yalnızlık bazen en derin bağlantıdır",
        "GECE KODLARI — 02:00–04:00 arası uyanıyorsan, bu bir sinyal",
      ],
      ritual: "Gece Kapanış Ritüeli — yatmadan önce günü bilinçle kapatma pratiği",
      sanriQuestion: "Gece yalnız kaldığında senden ne konuşuyor?",
    },
  },
  {
    type: "action",
    text: "Frekans Alanı'na Kalp çakrası odaklı yeni bir protokol eklenebilir. Kalp Yumuşatma ritüeli en çok tamamlanan 2. ritüel.",
    draft: {
      category: "matrix_okumasi",
      title: "KALP FREKANSI = 528 Hz",
      subtitle: "Kalbin frekansı evrenin şifa kodudur. Ama önce kendi kalbini duymalısın.",
    },
  },
];

const CONVERSION_POSTS = [
  {
    name: "1999 — Kapanmayan Frekans", views: 1284, conversions: 18, rate: 1.4,
    similar: { title: "2001 — Uyanışın İkinci Dalgası", angle: "Kolektif travma sonrası bilinç sıçraması", text: "2001 sadece bir yıl değildi. 1999'un açtığı kırığın ikinci dalgasıydı." },
  },
  {
    name: "KORKU = KONTROL KODU", views: 876, conversions: 12, rate: 1.37,
    similar: { title: "ÖFKE = SINIR KODU", angle: "Bastırılan öfkenin enerjetik okuması", text: "Öfke bir duygu değil — senin ihlal edilen sınırının sinyali." },
  },
  {
    name: "SIR_ADAN — Matrix Üst Bilinç", views: 538, conversions: 8, rate: 1.49,
    similar: { title: "HAK_İKAT — Gerçeğin Kelime Kodu", angle: "Hakikat kelimesinin matrix okuması", text: "HAK + İKAT. Hakikati ik-at eden, gerçeğe bağlanan. Sır gibi ama açık." },
  },
  {
    name: "İNSAN = ANTEN", views: 412, conversions: 5, rate: 1.21,
    similar: { title: "BEDEN = ALICI", angle: "Bedenin frekans alıcısı olarak okuması", text: "Bedenin bir makine değil — bir alıcı. Frekansı sen seçiyorsun." },
  },
  {
    name: "Sayı Kodları", views: 345, conversions: 3, rate: 0.87,
    similar: { title: "HARF KODLARI — Alfabenin Gizli Katmanı", angle: "Harflerin numerolojik ve sembolik okuması", text: "Her harf bir frekans. Her kelime bir formül. Dil tesadüf değil." },
  },
];

const CONVERSION_BOOKS = [
  { name: "Matrix Code İkra", sales: 89, revenue: "₺4.361" },
  { name: "112. Kitap", sales: 67, revenue: "₺0" },
  { name: "Nurun Frekansı", sales: 45, revenue: "₺2.205" },
  { name: "Oku", sales: 34, revenue: "₺1.666" },
];

const CONVERSION_FUNNEL = [
  { label: "Ziyaretçi", count: 2450, width: 100 },
  { label: "Kayıt", count: 890, width: 36, pct: "36%" },
  { label: "Preview Okuyan", count: 340, width: 14, pct: "38%" },
  { label: "Premium Geçiş", count: 34, width: 1.4, pct: "10%" },
];

const TRAFFIC_SOURCES = [
  { source: "Okuma Alanı", value: 68 },
  { source: "Yankı Alanı", value: 42 },
  { source: "Instagram / Direkt", value: 38 },
  { source: "Kütüphane Preview", value: 28 },
  { source: "Frekans Alanı", value: 15 },
];

const EXIT_POINTS = [
  {
    post: "1999 — Kapanmayan Frekans",
    paragraph: 3,
    sentence: "\"…bu frekans hiç kapanmadı. Sadece duyan azaldı.\"",
    exitRate: 34,
    note: "Premium duvarı burada. Kullanıcılar tam 'merak zirvesinde' çıkıyor — duvar doğru yerde ama CTA zayıf.",
  },
  {
    post: "KORKU = KONTROL KODU",
    paragraph: 2,
    sentence: "\"Korkunun altında bir kod var. Ama onu görmek için…\"",
    exitRate: 28,
    note: "İkinci paragraf sonunda çıkış artıyor. Metin açık bırakılmış ama devamı için yönlendirme eksik.",
  },
  {
    post: "Matrix Code İkra (Kitap)",
    paragraph: 5,
    sentence: "\"Sayfa 12'den sonra erişim premium.\"",
    exitRate: 41,
    note: "Kitapta en yüksek çıkış. Preview çok kısa — 12 sayfa yetmiyor, merak oluşmadan duvar geliyor.",
  },
  {
    post: "SIR_ADAN — Matrix Üst Bilinç",
    paragraph: 4,
    sentence: "\"Sır kelimesinin asıl kodu burada başlıyor…\"",
    exitRate: 22,
    note: "Düşük çıkış — metin iyi tutuyor. Ama CTA butonu sayfanın çok altında, kullanıcı görmüyor.",
  },
];

const LOCK_CLICKS = [
  { post: "1999 — Kapanmayan Frekans", section: "Kod Katmanı", clicks: 89, converted: 18, rate: 20.2 },
  { post: "KORKU = KONTROL KODU", section: "Derin Analiz", clicks: 64, converted: 12, rate: 18.7 },
  { post: "Matrix Code İkra", section: "Sayfa 13+", clicks: 112, converted: 14, rate: 12.5 },
  { post: "Nurun Frekansı", section: "Sayfa 8+", clicks: 58, converted: 8, rate: 13.8 },
  { post: "İNSAN = ANTEN", section: "Sanrı Yansıması", clicks: 37, converted: 5, rate: 13.5 },
];

const PURCHASE_TRIGGERS = [
  {
    trigger: "Sanrı Yansıması sonrası kilit tıklama",
    purchases: 14,
    pct: 41,
    insight: "Sanrı yansımasını okuyan kullanıcılar kilitli içeriğe %3x daha fazla tıklıyor.",
  },
  {
    trigger: "3. paragraf sonrası CTA",
    purchases: 9,
    pct: 26,
    insight: "Merak zirvesi 3. paragrafta. Bu noktadaki CTA en yüksek dönüşümü veriyor.",
  },
  {
    trigger: "Yorum okuduktan sonra upgrade",
    purchases: 6,
    pct: 18,
    insight: "Topluluk etkisi: başkalarının yorumları premium'a geçişi tetikliyor.",
  },
  {
    trigger: "Ritüel sonrası premium ritüel keşfi",
    purchases: 3,
    pct: 9,
    insight: "Ücretsiz ritüel tamamlayan kullanıcılar premium ritüellere merak duyuyor.",
  },
  {
    trigger: "Instagram'dan gelen ilk ziyaret",
    purchases: 2,
    pct: 6,
    insight: "Düşük ama değerli: ilk ziyarette satın alma. Landing page optimize edilebilir.",
  },
];

const CTA_SUGGESTIONS = [
  {
    score: 94,
    cta: "Bu katmanın devamı seni bekliyor.",
    where: "Okuma Alanı — 3. paragraf sonu",
    reason: "Merak zirvesinde, açık uçlu cümle sonrası. Kişisel hitap + gizem.",
  },
  {
    score: 87,
    cta: "Sanrı bu cümlenin altını da açtı.",
    where: "Sanrı Yansıması altı",
    reason: "AI yansıması sonrası kullanıcı zaten düşünme modunda. Doğal geçiş.",
  },
  {
    score: 82,
    cta: "Bu ritüelin derin versiyonu var.",
    where: "Ritüel tamamlama ekranı",
    reason: "Kullanıcı zaten deneyim yaşamış. Derinleşme isteği doğal.",
  },
  {
    score: 71,
    cta: "Kitabın geri kalanı sana ne söylüyor — görmek ister misin?",
    where: "Kitap preview son sayfa",
    reason: "Soru formatı merak tetikler. Ama preview daha uzun olmalı.",
  },
];

const PAYWALL_ITEMS = [
  {
    id: "pw-1",
    post: "Matrix Code İkra (Kitap)",
    lockPoint: "Sayfa 12",
    clicks: 112,
    rate: 12.5,
    status: "needs_action",
    diagnosis: "Preview çok kısa. 12 sayfa yeterli merak oluşturmuyor — kullanıcı henüz bağlanmadan duvar geliyor.",
    actions: [
      { type: "preview", label: "Preview'ı uzat → 18 sayfa", applied: false },
      { type: "cta", label: "CTA değiştir → \"Bu kitabın sırrı 19. sayfada başlıyor.\"", applied: false },
      { type: "sentence", label: "Kilit öncesi cümle ekle → \"Buraya kadar okuyan nadir kişilerdensin.\"", applied: false },
    ],
  },
  {
    id: "pw-2",
    post: "Nurun Frekansı (Kitap)",
    lockPoint: "Sayfa 8",
    clicks: 58,
    rate: 13.8,
    status: "needs_action",
    diagnosis: "Orta seviye dönüşüm. Preview sayfası bitiş noktası zayıf — son cümle merak bırakmıyor.",
    actions: [
      { type: "preview", label: "Preview'ı uzat → 12 sayfa", applied: false },
      { type: "sentence", label: "Son cümleyi değiştir → \"Asıl frekans bundan sonra açılıyor.\"", applied: false },
    ],
  },
  {
    id: "pw-3",
    post: "1999 — Kapanmayan Frekans",
    lockPoint: "Paragraf 3 (Kod Katmanı)",
    clicks: 89,
    rate: 20.2,
    status: "optimized",
    diagnosis: "İyi performans. Merak zirvesinde doğru yerde kilit var. CTA güncellendi ve dönüşüm %20'yi aştı.",
    actions: [
      { type: "cta", label: "CTA → \"Bu katmanın devamı seni bekliyor.\"", applied: true },
    ],
  },
  {
    id: "pw-4",
    post: "KORKU = KONTROL KODU",
    lockPoint: "Paragraf 2 (Derin Analiz)",
    clicks: 64,
    rate: 18.7,
    status: "optimized",
    diagnosis: "Yüksek performans. Açık uçlu cümle + doğru CTA kombinasyonu çalışıyor.",
    actions: [
      { type: "cta", label: "CTA → \"Görünenin altında bir katman daha var.\"", applied: true },
    ],
  },
  {
    id: "pw-5",
    post: "İNSAN = ANTEN",
    lockPoint: "Sanrı Yansıması",
    clicks: 37,
    rate: 13.5,
    status: "needs_action",
    diagnosis: "Sanrı yansıması sonrası kilit tıklanıyor ama dönüşüm düşük. CTA butonunun konumu sorun.",
    actions: [
      { type: "cta", label: "CTA'yı Sanrı kutusunun hemen altına taşı", applied: false },
      { type: "sentence", label: "Sanrı yansımasına ekle → \"Bu yansımanın devamı premium katmanda.\"", applied: false },
    ],
  },
];

const SUCCESS_PATTERNS = {
  summary: "En çok dönüşüm sağlayan 5 içeriğin ortak analizi — bu pattern'i kopyala.",
  patterns: [
    {
      label: "Tema",
      icon: "◈",
      finding: "Korku, kontrol ve gizem",
      detail: "En yüksek dönüşüm, kullanıcının 'bilmediği bir şey var' hissi uyandıran temalarda. Özellikle korku ve kontrol içerikleri premium'a %3x daha fazla yönlendiriyor.",
    },
    {
      label: "Ton",
      icon: "✦",
      finding: "Açık bırakılmış + kişisel hitap",
      detail: "Cümleleri tamamlamayan, merak bırakan ton dönüşümü artırıyor. '…devamı var' hissettiren metinler, açık açık 'premium al' diyen metinlerden %2.4x daha etkili.",
    },
    {
      label: "Uzunluk",
      icon: "▣",
      finding: "Preview: 800–1200 kelime / 3–4 paragraf",
      detail: "Çok kısa preview (< 500 kelime) merak oluşturmuyor. Çok uzun preview (> 1500) yeterince veriyor. Tatlı nokta: 3 paragraf, tam 'aha anı'nda kes.",
    },
    {
      label: "CTA Tipi",
      icon: "◎",
      finding: "Soru + gizem > Doğrudan satış",
      detail: "'Premium'a geç' yerine 'Bu katmanın altında ne var?' gibi soru formatında CTA'lar %1.8x daha fazla tıklanıyor. Satış değil, merak sat.",
    },
    {
      label: "Kilit Konumu",
      icon: "⊙",
      finding: "İçeriğin %60–70'inde",
      detail: "Çok erken kilit (<%40) kullanıcıyı kızdırıyor. Çok geç kilit (>%80) fazla içerik veriyor. En iyi nokta: kullanıcı bağlandıktan hemen sonra, %60–70 arası.",
    },
    {
      label: "Zamanlama",
      icon: "⏱",
      finding: "Gece 22:00 – 01:00",
      detail: "Bu saat aralığında yapılan premium geçişler diğer saatlere göre %40 daha yüksek. Gece kullanıcıları daha derin okuyor ve daha kolay dönüşüyor.",
    },
  ],
  formula: "MERAK TEMELİ İÇERİK + AÇIK UÇLU CTA + %60 KİLİT + GECE YAYINI = EN YÜKSEK DÖNÜŞÜM",
};

function pickNumber(obj, ...keys) {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
  }
  return undefined;
}

function normalizeDashboard(raw) {
  if (!raw || typeof raw !== "object") return { ...MOCK_DASHBOARD };
  const u = raw.users || {};
  return {
    total_users: pickNumber(u, "total") ?? pickNumber(raw, "total_users", "totalUsers") ?? MOCK_DASHBOARD.total_users,
    daily_active: pickNumber(u, "active_24h") ?? pickNumber(raw, "daily_active", "dailyActive") ?? MOCK_DASHBOARD.daily_active,
    new_signups: pickNumber(u, "new_7d", "new_24h") ?? pickNumber(raw, "new_signups", "newSignups") ?? MOCK_DASHBOARD.new_signups,
    premium_users: pickNumber(u, "premium") ?? 0,
    verified_users: pickNumber(u, "verified") ?? 0,
    admin_count: pickNumber(u, "admin") ?? 0,
  };
}

function normalizeMembership(raw) {
  if (!raw || typeof raw !== "object") return { ...MOCK_MEMBERSHIP };
  return {
    premium_count: pickNumber(raw, "premium", "premium_count", "premiumCount") ?? MOCK_MEMBERSHIP.premium_count,
    total_users: pickNumber(raw, "total_users") ?? 0,
    free_users: pickNumber(raw, "free") ?? 0,
    conversion_rate: pickNumber(raw, "conversion_rate") ?? 0,
    vip_clicks: pickNumber(raw, "vip_clicks") ?? 0,
    vip_unlocks: pickNumber(raw, "vip_unlocks") ?? 0,
    purchases: pickNumber(raw, "purchases") ?? 0,
  };
}

function normalizeModeration(raw) {
  if (!raw || typeof raw !== "object") return { ...MOCK_MODERATION };
  return {
    pending:
      pickNumber(raw, "pending", "pending_count", "pendingCount", "queue_count") ??
      MOCK_MODERATION.pending,
  };
}

function extractActivities(raw) {
  if (!raw || typeof raw !== "object") return [];
  const arr =
    raw.recent_activities ||
    raw.activities ||
    raw.activity_feed ||
    raw.recent_events ||
    (raw.events && Array.isArray(raw.events) ? raw.events : null) ||
    (raw.events && raw.events.recent ? raw.events.recent : null);
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const mapped = arr
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const type = String(item.type || item.event_type || item.action || "post").toLowerCase();
      const text =
        item.text || item.message || item.description || item.title || item.summary ||
        (item.action ? `${item.action}${item.domain ? ` (${item.domain})` : ""}${item.user_id ? ` — user #${item.user_id}` : ""}` : "");
      const rawTime =
        item.time ||
        item.time_ago ||
        item.relative_time ||
        item.when ||
        (item.created_at ? String(item.created_at) : "");
      let time = rawTime || "—";
      if (rawTime && rawTime.includes("T")) {
        try {
          const d = new Date(rawTime);
          const diff = Math.floor((Date.now() - d.getTime()) / 1000);
          if (diff < 60) time = "az önce";
          else if (diff < 3600) time = `${Math.floor(diff / 60)} dk önce`;
          else if (diff < 86400) time = `${Math.floor(diff / 3600)} sa önce`;
          else time = `${Math.floor(diff / 86400)} gün önce`;
        } catch {}
      }
      if (!text) return null;
      return { type, text, time };
    })
    .filter(Boolean);
  return mapped;
}

const DOT_BY_TYPE = {
  register: styles.dotRegister,
  post: styles.dotPost,
  premium: styles.dotPremium,
  comment: styles.dotComment,
  ritual: styles.dotRitual,
  moderation: styles.dotModeration,
};

function activityDotClass(type) {
  const t = String(type || "").toLowerCase();
  return DOT_BY_TYPE[t] || styles.dotDefault;
}

export default function AdminDashboardPage() {
  const { adminUser } = useAdmin();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(() => ({ ...MOCK_DASHBOARD }));
  const [membership, setMembership] = useState(() => ({ ...MOCK_MEMBERSHIP }));
  const [moderation, setModeration] = useState(() => ({ ...MOCK_MODERATION }));
  const [activities, setActivities] = useState(() => []);
  const [expandedOpp, setExpandedOpp] = useState(null);
  const [expandedConv, setExpandedConv] = useState(null);
  const [ctaState, setCtaState] = useState(getCtaEngineState);
  const [pwItems, setPwItems] = useState(() => PAYWALL_ITEMS.map((p) => structuredClone(p)));
  const [expandedPw, setExpandedPw] = useState(null);
  const ctaPool = getCtaPool();

  const toggleCtaEngine = useCallback(() => {
    const next = setCtaEngineState({ enabled: !ctaState.enabled });
    setCtaState(next);
  }, [ctaState.enabled]);

  const toggleAbTest = useCallback(() => {
    const next = setCtaEngineState({ abActive: !ctaState.abActive });
    setCtaState(next);
  }, [ctaState.abActive]);

  const handleResetAb = useCallback(() => {
    const next = resetAbTest(ctaState.variantA, ctaState.variantB);
    setCtaState(next);
  }, [ctaState.variantA, ctaState.variantB]);

  const changeVariant = useCallback((slot, id) => {
    const next = setCtaEngineState({ [slot]: id, winner: null });
    setCtaState(next);
  }, []);

  const declareWinner = useCallback((id) => {
    const next = setCtaEngineState({ winner: id, abActive: false });
    setCtaState(next);
  }, []);

  const applyPwAction = useCallback((pwId, actionIdx) => {
    setPwItems((prev) =>
      prev.map((p) => {
        if (p.id !== pwId) return p;
        const updated = { ...p, actions: p.actions.map((a, i) => (i === actionIdx ? { ...a, applied: true } : a)) };
        const allApplied = updated.actions.every((a) => a.applied);
        if (allApplied) updated.status = "optimized";
        return updated;
      }),
    );
  }, []);

  const handleCreateDraft = useCallback((item) => {
    navigate("/admin/okuma", {
      state: {
        newDraft: true,
        category: item.draft?.category || "matrix_okumasi",
        title: item.draft?.title || "",
        subtitle: item.draft?.subtitle || "",
      },
    });
  }, [navigate]);

  const handleCreateSimilar = useCallback((post) => {
    navigate("/admin/okuma", {
      state: {
        newDraft: true,
        title: post.similar?.title || "",
        subtitle: post.similar?.text || "",
        category: "matrix_okumasi",
      },
    });
  }, [navigate]);

  const [visitors, setVisitors] = useState(null);
  const [dashRaw, setDashRaw] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [analyticsRaw, setAnalyticsRaw] = useState(null);
  const [okumaStatsPayload, setOkumaStatsPayload] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [dashResult, memResult, modResult, visitorResult, funResult, anResult, okResult] =
        await Promise.all([
          fetchDashboard().catch(() => null),
          fetchMembership().catch(() => null),
          fetchModerationStats().catch(() => null),
          fetchVisitorStats().catch(() => null),
          fetchFunnelStats(7).catch(() => null),
          fetchAnalytics("7d").catch(() => null),
          fetchOkumaAllStats().catch(() => null),
        ]);

      if (cancelled) return;

      if (visitorResult != null) setVisitors(visitorResult);
      if (funResult != null) setFunnel(funResult);
      if (anResult != null) setAnalyticsRaw(anResult);
      if (okResult?.stats && typeof okResult.stats === "object") setOkumaStatsPayload(okResult.stats);

      if (dashResult != null) {
        setDashRaw(dashResult);
        setDashboard(normalizeDashboard(dashResult));
        const evFeed = formatRecentEventsForFeed(dashResult.recent_events);
        if (evFeed.length > 0) setActivities(evFeed);
        else {
          const fromApi = extractActivities(dashResult);
          setActivities(fromApi.length > 0 ? fromApi : []);
        }
      }

      if (memResult != null) {
        setMembership(normalizeMembership(memResult));
      }

      if (modResult != null) {
        setModeration(normalizeModeration(modResult));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const productSurfaces = aggregateProductSurfaces(visitors?.top_pages || []);
  const okumaTop = pickTopOkumaPost(OKUMA_POSTS, okumaStatsPayload || {});
  const sanriLines = buildSanriObservations({
    dashboard: dashRaw,
    visitors,
    funnel,
    analytics: analyticsRaw,
    okumaTop,
    modPending: moderation.pending,
  });

  const totalUsers = dashboard.total_users ?? MOCK_DASHBOARD.total_users;
  const dailyActive = dashboard.daily_active ?? MOCK_DASHBOARD.daily_active;
  const newSignups = dashboard.new_signups ?? MOCK_DASHBOARD.new_signups;
  const premiumCount = membership.premium_count ?? MOCK_MEMBERSHIP.premium_count;
  const pendingMod = moderation.pending ?? MOCK_MODERATION.pending;

  return (
    <div>
      <p className={styles.welcome}>Hoş geldin, {adminUser?.email ?? "yönetici"}</p>
      <h1 className={adminStyles.pageTitle}>Genel Bakış</h1>

      <section className={styles.topCards} aria-label="Özet istatistikler">
        <div className={adminStyles.grid5}>
          <StatCard label="Toplam Kullanıcı" value={totalUsers} icon="◇" />
          <StatCard
            label="Günlük Aktif"
            value={dailyActive}
            icon="◉"
            accent="#50c878"
          />
          <StatCard
            label="Premium"
            value={premiumCount}
            icon="✦"
            accent="#ffc832"
          />
          <StatCard
            label="Yeni Kayıt"
            value={newSignups}
            icon="⊕"
            sub="son 7 gün"
          />
          <StatCard
            label="Bekleyen Moderasyon"
            value={pendingMod}
            icon="⊙"
            accent="#ff9a6c"
          />
        </div>
      </section>

      {visitors && (
        <section style={{ marginBottom: 28 }}>
          <h2 className={adminStyles.sectionTitle}>Site Trafiği (Gerçek Zamanlı)</h2>
          <div className={adminStyles.grid5}>
            <StatCard
              label="Bugün Görüntülenme"
              value={visitors.views?.today ?? 0}
              icon="👁"
              accent="#7cf7d8"
            />
            <StatCard
              label="Bugün Tekil Ziyaretçi"
              value={visitors.unique_visitors?.today ?? 0}
              icon="◎"
              accent="#50c878"
            />
            <StatCard
              label="Haftalık Ziyaretçi"
              value={visitors.unique_visitors?.week ?? 0}
              icon="◈"
              accent="#6cc8ff"
            />
            <StatCard
              label="Aylık Ziyaretçi"
              value={visitors.unique_visitors?.month ?? 0}
              icon="◇"
              accent="#c8a0ff"
            />
            <StatCard
              label="Toplam Sayfa Görüntülenme"
              value={visitors.views?.total ?? 0}
              icon="∞"
            />
          </div>
          {visitors.top_pages?.length > 0 && (
            <div style={{
              marginTop: 16, padding: "16px 20px",
              background: "rgba(200,160,255,0.04)",
              border: "1px solid rgba(200,160,255,0.10)",
              borderRadius: 14,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#c8a0ff", marginBottom: 10, letterSpacing: ".06em" }}>
                EN ÇOK ZİYARET EDİLEN SAYFALAR (7 GÜN)
              </div>
              {visitors.top_pages.slice(0, 8).map((p, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "7px 0", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  fontSize: 13, color: "rgba(255,255,255,0.7)",
                }}>
                  <span style={{ fontFamily: "monospace", opacity: 0.9 }}>{p.path}</span>
                  <span style={{ fontWeight: 600, color: "#c8a0ff" }}>{p.views}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className={styles.productSection} aria-label="Ürün yüzeyleri">
        <h2 className={adminStyles.sectionTitle}>SANRI ürün katmanları (7 gün · sayfa görüntülenme)</h2>
        <p className={styles.realDataNote}>
          Aşağıdaki dağılım, <code>page_views</code> üst 10 yolun ürün eşlemesinden türetilir; tek sayfa birden fazla
          yüzeye düşmez (ilk eşleşen kazanır).
        </p>
        <div className={styles.productGrid}>
          {productSurfaces.map((s) => (
            <article key={s.id} className={styles.productTile}>
              <div className={styles.productTileLabel}>{s.label}</div>
              <div className={styles.productTileValue}>{s.views.toLocaleString("tr-TR")}</div>
              <div className={styles.productTileHint}>{s.hint}</div>
            </article>
          ))}
        </div>
      </section>

      <h2 className={adminStyles.sectionTitle}>Öne çıkan metrikler (ölçülen)</h2>
      <div className={adminStyles.grid3}>
        <article className={styles.contentCard}>
          <div className={styles.contentTitle}>Okuma — en çok görüntülenen</div>
          <div className={styles.contentValue}>
            {okumaTop?.views != null ? okumaTop.views.toLocaleString("tr-TR") : "—"}
          </div>
          <div className={styles.contentSub}>
            {okumaTop?.title
              ? `${okumaTop.title} · okuma_views`
              : "okuma/all-stats veya içerik henüz veri üretmedi"}
          </div>
        </article>
        <article className={styles.contentCard}>
          <div className={styles.contentTitle}>Yankı — kolektif alan</div>
          <div className={styles.contentValue}>
            {(dashRaw?.yanki?.published ?? 0).toLocaleString("tr-TR")}
          </div>
          <div className={styles.contentSub}>
            Yayında gönderi (DB) · Bekleyen moderasyon:{" "}
            {(dashRaw?.yanki?.pending ?? pendingMod ?? 0).toLocaleString("tr-TR")}
          </div>
        </article>
        <article className={styles.contentCard}>
          <div className={styles.contentTitle}>Matrix Rol hunisi (7 gün)</div>
          <div className={styles.contentValue}>
            {funnel?.role_funnel?.page_view != null
              ? funnel.role_funnel.page_view.toLocaleString("tr-TR")
              : "—"}
          </div>
          <div className={styles.contentSub}>
            Sayfa görüntüleme → tamamlanan ödeme:{" "}
            {funnel?.role_funnel?.unlock_success != null
              ? funnel.role_funnel.unlock_success.toLocaleString("tr-TR")
              : "—"}{" "}
            (funnel_events)
          </div>
        </article>
      </div>

      <h2 className={adminStyles.sectionTitle}>SANRI günlük gözlem</h2>
      <p className={styles.realDataNote}>
        Bu liste kurgu içermez: yalnızca dashboard, pageview, funnel ve okuma istatistiklerinden türetilmiş cümleler.
      </p>
      <div className={styles.insightPanel}>
        <div className={styles.insightHeader}>
          <span className={styles.insightGlyph}>✦</span>
          <span className={styles.insightLabel}>Veriye bağlı özet</span>
        </div>
        {sanriLines.length === 0 ? (
          <p className={styles.insightEmpty}>
            Henüz gösterilecek özet yok — API yanıtlarını veya events / page_views akışını kontrol edin.
          </p>
        ) : (
          <ul className={styles.insightList}>
            {sanriLines.map((item, i) => (
              <li key={i} className={styles.insightItem}>
                <span className={`${styles.insightDot} ${styles[`insightDot_${item.tone}`] || ""}`} />
                <span className={styles.insightText}>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {funnel?.role_funnel && (
        <section style={{ marginBottom: 24 }}>
          <h2 className={adminStyles.sectionTitle}>Matrix Rol · huni adımları (7 gün, gerçek)</h2>
          <div className={styles.funnelRealGrid}>
            {[
              ["Sayfa", funnel.role_funnel.page_view],
              ["Form başlangıç", funnel.role_funnel.form_start],
              ["Form gönderim", funnel.role_funnel.form_submit],
              ["Ücretsiz sonuç", funnel.role_funnel.free_result],
              ["Kilit görüntü", funnel.role_funnel.lock_view],
              ["Kilit tık", funnel.role_funnel.unlock_click],
              ["Shopier", funnel.role_funnel.shopier_redirect],
              ["Başarı", funnel.role_funnel.unlock_success],
            ].map(([label, n]) => (
              <div key={label} className={styles.funnelRealCell}>
                <span className={styles.funnelRealLabel}>{label}</span>
                <span className={styles.funnelRealNum}>{Number(n || 0).toLocaleString("tr-TR")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <details className={styles.scenarioDetails}>
        <summary className={styles.scenarioSummary}>
          <span className={styles.scenarioSummaryInner}>
            <span className={styles.scenarioSummaryTitle}>Şablon ve senaryo alanı</span>
            <span className={styles.scenarioSummaryHint}>
              İçerik ve dönüşüm örnek panelleri — rakamlar canlı ölçüme bağlı değil; taslak yönlendirmeleri gerçek.
            </span>
          </span>
        </summary>
        <p className={styles.scenarioIntro}>
          Bu alan <strong>ürün / editoryal iş akışı</strong> için hazırlanmış örnek metin ve kartlardır. Gerçek huni,
          trafik ve özet için üstteki <em>SANRI ürün katmanları</em>, <em>Matrix Rol · huni adımları</em>,{" "}
          <em>SANRI günlük gözlem</em> ve alttaki <em>Son aktiviteler</em> bölümlerini kullanın.
        </p>

        <div className={styles.scenarioZoneLabel} aria-hidden>
          İçerik şablonları
        </div>
      <h2 className={adminStyles.sectionTitle}>İçerik Fırsatları</h2>
      <div className={styles.opportunityPanel}>
        <div className={styles.opportunityHeader}>
          <span className={styles.opportunityGlyph}>⟁</span>
          <span className={styles.opportunityLabel}>Üretim Radarı</span>
        </div>
        <ul className={styles.opportunityList}>
          {CONTENT_OPPORTUNITIES.map((item, i) => {
            const isExpanded = expandedOpp === i;
            const hasDraft = item.type === "gap" || item.type === "action";
            const hasTrend = item.type === "trend" && item.expansion;
            return (
              <li key={i} className={`${styles.opportunityItem} ${isExpanded ? styles.oppItemExpanded : ""}`}>
                <div className={styles.oppRow}>
                  <span className={`${styles.opportunityTag} ${styles[`oppTag_${item.type}`] || ""}`}>
                    {item.type === "gap" ? "Boşluk" : item.type === "trend" ? "Trend" : "Aksiyon"}
                  </span>
                  <span className={styles.opportunityText}>{item.text}</span>
                  <span className={styles.oppActions}>
                    {hasDraft && (
                      <button
                        className={styles.oppBtn}
                        onClick={() => handleCreateDraft(item)}
                        title="İçerik taslağı oluştur"
                      >
                        ✦ İçerik Üret
                      </button>
                    )}
                    {hasTrend && (
                      <button
                        className={`${styles.oppBtn} ${styles.oppBtnTrend}`}
                        onClick={() => setExpandedOpp(isExpanded ? null : i)}
                      >
                        {isExpanded ? "✕ Kapat" : "◈ Temayı Büyüt"}
                      </button>
                    )}
                  </span>
                </div>
                {isExpanded && hasTrend && (
                  <div className={styles.trendExpansion}>
                    <div className={styles.trendSection}>
                      <div className={styles.trendSectionTitle}>İçerik Fikirleri</div>
                      <ul className={styles.trendIdeas}>
                        {item.expansion.ideas.map((idea, idx) => (
                          <li key={idx} className={styles.trendIdea}>
                            <span className={styles.trendIdeaNum}>{idx + 1}</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.trendRow}>
                      <div className={styles.trendSection}>
                        <div className={styles.trendSectionTitle}>Önerilen Ritüel</div>
                        <p className={styles.trendRitual}>{item.expansion.ritual}</p>
                      </div>
                      <div className={styles.trendSection}>
                        <div className={styles.trendSectionTitle}>Sanrı Sorusu</div>
                        <p className={styles.trendSanri}>"{item.expansion.sanriQuestion}"</p>
                      </div>
                    </div>
                    <button
                      className={styles.oppBtn}
                      onClick={() => {
                        const firstIdea = item.expansion.ideas[0] || "";
                        const dashIdx = firstIdea.indexOf("—");
                        navigate("/admin/okuma", {
                          state: {
                            newDraft: true,
                            title: dashIdx > 0 ? firstIdea.slice(0, dashIdx).trim() : firstIdea,
                            subtitle: dashIdx > 0 ? firstIdea.slice(dashIdx + 1).trim() : "",
                            category: "matrix_okumasi",
                          },
                        });
                      }}
                    >
                      ✦ İlk Fikri İçerik Olarak Aç
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

        <div className={styles.scenarioZoneLabel} aria-hidden>
          Dönüşüm senaryoları
        </div>
      <h2 className={adminStyles.sectionTitle}>Dönüşüm Analizi</h2>
      <div className={adminStyles.grid2}>
        {/* Premium Açtıran Postlar - Bar Chart */}
        <div className={styles.convCard}>
          <div className={styles.convCardTitle}>Premium Açtıran İçerikler</div>
          <div className={styles.barChart}>
            {CONVERSION_POSTS.map((p, i) => {
              const maxConv = Math.max(...CONVERSION_POSTS.map((x) => x.conversions));
              const pct = (p.conversions / maxConv) * 100;
              const isExpanded = expandedConv === i;
              return (
                <div key={p.name} className={styles.barGroup}>
                  <div className={styles.barRow}>
                    <span className={styles.barName}>{p.name.length > 24 ? p.name.slice(0, 24) + "…" : p.name}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%` }} />
                    </div>
                    <span className={styles.barVal}>{p.conversions}</span>
                    {p.similar && (
                      <button
                        className={styles.barActionBtn}
                        onClick={() => setExpandedConv(isExpanded ? null : i)}
                        title="Benzer içerik üret"
                      >
                        {isExpanded ? "✕" : "⊕"}
                      </button>
                    )}
                  </div>
                  {isExpanded && p.similar && (
                    <div className={styles.similarPanel}>
                      <div className={styles.similarTitle}>{p.similar.title}</div>
                      <div className={styles.similarAngle}>Açı: {p.similar.angle}</div>
                      <div className={styles.similarText}>{p.similar.text}</div>
                      <button
                        className={styles.oppBtn}
                        onClick={() => handleCreateSimilar(p)}
                      >
                        ✦ İçerik Olarak Oluştur
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className={styles.convCard}>
          <div className={styles.convCardTitle}>Preview → Premium Hunisi</div>
          <div className={styles.funnel}>
            {CONVERSION_FUNNEL.map((step, i) => (
              <div key={step.label} className={styles.funnelStep}>
                <span className={styles.funnelLabel}>{step.label}</span>
                <div className={styles.funnelBarWrap}>
                  <div
                    className={styles.funnelBar}
                    style={{ width: `${Math.max(step.width, 4)}%` }}
                  />
                </div>
                <span className={styles.funnelCount}>{step.count.toLocaleString("tr-TR")}</span>
                <span className={styles.funnelPct}>{i === 0 ? "" : step.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={adminStyles.grid2} style={{ marginTop: 16 }}>
        {/* En Çok Satan Kitaplar */}
        <div className={styles.convCard}>
          <div className={styles.convCardTitle}>En Çok Satan Kitaplar</div>
          <div className={styles.miniTable}>
            <div className={styles.miniHead}>
              <span>Kitap</span><span>Satış</span><span>Gelir</span>
            </div>
            {CONVERSION_BOOKS.map((b) => (
              <div key={b.name} className={styles.miniRow}>
                <span className={styles.miniName}>{b.name}</span>
                <span className={styles.miniNum}>{b.sales}</span>
                <span className={styles.miniRevenue}>{b.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trafik Kaynakları */}
        <div className={styles.convCard}>
          <div className={styles.convCardTitle}>Premium'a Nereden Geliyorlar?</div>
          <div className={styles.barChart}>
            {TRAFFIC_SOURCES.map((s) => {
              const maxVal = Math.max(...TRAFFIC_SOURCES.map((x) => x.value));
              const pct = (s.value / maxVal) * 100;
              return (
                <div key={s.source} className={styles.barRow}>
                  <span className={styles.barName}>{s.source}</span>
                  <div className={styles.barTrack}>
                    <div className={`${styles.barFill} ${styles.barFillTeal}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.barVal}>{s.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <h2 className={adminStyles.sectionTitle}>Derin Dönüşüm Analizi</h2>

      {/* Exit Points */}
      <div className={styles.deepPanel}>
        <div className={styles.deepHeader}>
          <span className={styles.deepGlyph}>⊘</span>
          <span className={styles.deepLabel}>Çıkış Noktaları — Kullanıcı Nerede Kayboluyor?</span>
        </div>
        <div className={styles.exitList}>
          {EXIT_POINTS.map((ep, i) => (
            <div key={i} className={styles.exitItem}>
              <div className={styles.exitTop}>
                <span className={styles.exitPost}>{ep.post}</span>
                <span className={styles.exitRate}>
                  <span className={styles.exitRateNum}>{ep.exitRate}%</span> çıkış
                </span>
              </div>
              <div className={styles.exitSentence}>
                <span className={styles.exitParaLabel}>Paragraf {ep.paragraph}</span>
                <span className={styles.exitQuote}>{ep.sentence}</span>
              </div>
              <div className={styles.exitNote}>{ep.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={adminStyles.grid2} style={{ marginTop: 16 }}>
        {/* Lock Click Analysis */}
        <div className={styles.deepPanel}>
          <div className={styles.deepHeader}>
            <span className={styles.deepGlyph}>⊙</span>
            <span className={styles.deepLabel}>Kilit Tıklama Haritası</span>
          </div>
          <div className={styles.lockTable}>
            <div className={styles.lockHead}>
              <span>İçerik</span>
              <span>Bölüm</span>
              <span>Tıklama</span>
              <span>Dönüşüm</span>
              <span>Oran</span>
            </div>
            {LOCK_CLICKS.map((lc, i) => (
              <div key={i} className={styles.lockRow}>
                <span className={styles.lockName}>{lc.post}</span>
                <span className={styles.lockSection}>{lc.section}</span>
                <span className={styles.lockNum}>{lc.clicks}</span>
                <span className={styles.lockNum}>{lc.converted}</span>
                <span className={`${styles.lockNum} ${lc.rate >= 18 ? styles.lockHigh : lc.rate < 13 ? styles.lockLow : ""}`}>
                  %{lc.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Triggers */}
        <div className={styles.deepPanel}>
          <div className={styles.deepHeader}>
            <span className={styles.deepGlyph}>✦</span>
            <span className={styles.deepLabel}>Satın Alma Tetikleyicileri</span>
          </div>
          <div className={styles.triggerList}>
            {PURCHASE_TRIGGERS.map((pt, i) => (
              <div key={i} className={styles.triggerItem}>
                <div className={styles.triggerTop}>
                  <span className={styles.triggerName}>{pt.trigger}</span>
                  <div className={styles.triggerNums}>
                    <span className={styles.triggerCount}>{pt.purchases}</span>
                    <span className={styles.triggerPct}>{pt.pct}%</span>
                  </div>
                </div>
                <div className={styles.triggerBarWrap}>
                  <div className={styles.triggerBar} style={{ width: `${pt.pct}%` }} />
                </div>
                <div className={styles.triggerInsight}>{pt.insight}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

        <div className={styles.scenarioZoneLabel} aria-hidden>
          CTA ve paywall — yerel simülasyon
        </div>
      {/* ── Auto CTA Engine ── */}
      <div className={styles.ctaPanel}>
        <div className={styles.ctaEngineHeader}>
          <div className={styles.deepHeader} style={{ marginBottom: 0 }}>
            <span className={styles.deepGlyph}>◈</span>
            <span className={styles.deepLabel}>Otomatik CTA Motoru</span>
          </div>
          <div className={styles.ctaToggles}>
            <div className={styles.ctaToggleWrap}>
              <span className={styles.ctaToggleLabel}>Auto CTA</span>
              <button
                type="button"
                className={`${styles.ctaToggle} ${ctaState.enabled ? styles.ctaToggleOn : ""}`}
                onClick={toggleCtaEngine}
              >
                <span className={styles.ctaToggleKnob} />
              </button>
            </div>
            <div className={styles.ctaToggleWrap}>
              <span className={styles.ctaToggleLabel}>A/B Test</span>
              <button
                type="button"
                className={`${styles.ctaToggle} ${ctaState.abActive ? styles.ctaToggleOn : ""}`}
                onClick={toggleAbTest}
                disabled={!ctaState.enabled}
              >
                <span className={styles.ctaToggleKnob} />
              </button>
            </div>
          </div>
        </div>

        {ctaState.enabled && ctaState.abActive && (
          <div className={styles.abSection}>
            <div className={styles.abHeader}>
              <span className={styles.abTitle}>A/B Test — Canlı Karşılaştırma</span>
              {ctaState.winner && (
                <span className={styles.abWinnerBadge}>
                  ✦ Kazanan belirlendi
                </span>
              )}
            </div>

            <div className={styles.abGrid}>
              {[
                { slot: "variantA", label: "Varyant A", stats: ctaState.statsA, id: ctaState.variantA },
                { slot: "variantB", label: "Varyant B", stats: ctaState.statsB, id: ctaState.variantB },
              ].map(({ slot, label, stats, id }) => {
                const cta = getCtaById(id);
                const convRate = stats?.impressions
                  ? ((stats.conversions / stats.impressions) * 100).toFixed(1)
                  : "0.0";
                const clickRate = stats?.impressions
                  ? ((stats.clicks / stats.impressions) * 100).toFixed(1)
                  : "0.0";
                const isWinner = ctaState.winner === id;

                return (
                  <div
                    key={slot}
                    className={`${styles.abCard} ${isWinner ? styles.abCardWinner : ""}`}
                  >
                    <div className={styles.abCardHead}>
                      <span className={styles.abCardLabel}>{label}</span>
                      {isWinner && <span className={styles.abWinTag}>KAZANAN</span>}
                    </div>

                    <select
                      className={styles.abSelect}
                      value={id}
                      onChange={(e) => changeVariant(slot, e.target.value)}
                      disabled={!!ctaState.winner}
                    >
                      {ctaPool.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.text.length > 45 ? c.text.slice(0, 45) + "…" : c.text} (skor: {c.score})
                        </option>
                      ))}
                    </select>

                    <div className={styles.abCtaPreview}>
                      "{cta?.text || "—"}"
                    </div>

                    <div className={styles.abStats}>
                      <div className={styles.abStat}>
                        <span className={styles.abStatNum}>{stats?.impressions ?? 0}</span>
                        <span className={styles.abStatLabel}>gösterim</span>
                      </div>
                      <div className={styles.abStat}>
                        <span className={styles.abStatNum}>{stats?.clicks ?? 0}</span>
                        <span className={styles.abStatLabel}>tıklama</span>
                      </div>
                      <div className={styles.abStat}>
                        <span className={styles.abStatNum}>{stats?.conversions ?? 0}</span>
                        <span className={styles.abStatLabel}>dönüşüm</span>
                      </div>
                    </div>

                    <div className={styles.abRates}>
                      <span className={styles.abRateItem}>
                        Tıklama: <strong>{clickRate}%</strong>
                      </span>
                      <span className={styles.abRateItem}>
                        Dönüşüm: <strong className={styles.abRateHighlight}>{convRate}%</strong>
                      </span>
                    </div>

                    {!ctaState.winner && (
                      <button
                        type="button"
                        className={styles.abDeclareBtn}
                        onClick={() => declareWinner(id)}
                      >
                        Kazanan Olarak Seç
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.abFooter}>
              <span className={styles.abFooterText}>
                Eşik: {ctaState.autoThreshold} gösterim sonrası otomatik seçim
              </span>
              <button
                type="button"
                className={styles.abResetBtn}
                onClick={handleResetAb}
              >
                ↻ Testi Sıfırla
              </button>
            </div>
          </div>
        )}

        {ctaState.enabled && ctaState.winner && !ctaState.abActive && (
          <div className={styles.abWinnerPanel}>
            <div className={styles.abWinnerText}>
              Aktif CTA: <strong>"{getCtaById(ctaState.winner)?.text || "—"}"</strong>
            </div>
            <button
              type="button"
              className={styles.abResetBtn}
              onClick={handleResetAb}
            >
              Yeni A/B Test Başlat
            </button>
          </div>
        )}

        <div className={styles.deepHeader} style={{ marginTop: 24 }}>
          <span className={styles.deepGlyph}>⊛</span>
          <span className={styles.deepLabel}>CTA Havuzu & Skorlar</span>
        </div>
        <div className={styles.ctaGrid}>
          {CTA_SUGGESTIONS.map((c, i) => (
            <div key={i} className={`${styles.ctaCard} ${i === 0 ? styles.ctaCardBest : ""}`}>
              {i === 0 && <div className={styles.ctaBestBadge}>EN GÜÇLÜ</div>}
              <div className={styles.ctaScore}>
                <span className={styles.ctaScoreNum}>{c.score}</span>
                <span className={styles.ctaScoreLabel}>skor</span>
              </div>
              <div className={styles.ctaBody}>
                <div className={styles.ctaText}>"{c.cta}"</div>
                <div className={styles.ctaWhere}>{c.where}</div>
                <div className={styles.ctaReason}>{c.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Paywall Auto-Optimize ── */}
      <h2 className={adminStyles.sectionTitle}>Paywall Otomatik Optimizasyon</h2>
      <div className={styles.pwList}>
        {pwItems.map((pw) => {
          const isOpen = expandedPw === pw.id;
          const isOptimized = pw.status === "optimized";
          const needsAction = pw.status === "needs_action";
          return (
            <div key={pw.id} className={`${styles.pwCard} ${isOptimized ? styles.pwCardOptimized : ""}`}>
              <div className={styles.pwCardHead} onClick={() => setExpandedPw(isOpen ? null : pw.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setExpandedPw(isOpen ? null : pw.id)}>
                <div className={styles.pwCardLeft}>
                  {isOptimized && <span className={styles.pwOptBadge}>✓ OPTİMİZE EDİLDİ</span>}
                  {needsAction && <span className={styles.pwNeedsBadge}>⊘ AKSİYON GEREKLİ</span>}
                  <span className={styles.pwPostName}>{pw.post}</span>
                </div>
                <div className={styles.pwCardRight}>
                  <span className={styles.pwLockPoint}>{pw.lockPoint}</span>
                  <span className={styles.pwClicks}>{pw.clicks} tıklama</span>
                  <span className={`${styles.pwRate} ${pw.rate >= 18 ? styles.pwRateGood : pw.rate < 14 ? styles.pwRateLow : styles.pwRateMid}`}>
                    %{pw.rate}
                  </span>
                  <span className={styles.pwExpand}>{isOpen ? "▴" : "▾"}</span>
                </div>
              </div>
              {isOpen && (
                <div className={styles.pwCardBody}>
                  <div className={styles.pwDiagnosis}>{pw.diagnosis}</div>
                  <div className={styles.pwActions}>
                    {pw.actions.map((action, ai) => (
                      <div key={ai} className={`${styles.pwAction} ${action.applied ? styles.pwActionDone : ""}`}>
                        <span className={styles.pwActionIcon}>
                          {action.type === "preview" ? "▣" : action.type === "cta" ? "◈" : "✎"}
                        </span>
                        <span className={styles.pwActionLabel}>{action.label}</span>
                        {!action.applied ? (
                          <button
                            type="button"
                            className={styles.pwApplyBtn}
                            onClick={() => applyPwAction(pw.id, ai)}
                          >
                            Uygula
                          </button>
                        ) : (
                          <span className={styles.pwAppliedTag}>Uygulandı</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Success Patterns ── */}
      <h2 className={adminStyles.sectionTitle}>Başarılı İçeriklerin Ortak Özellikleri</h2>
      <div className={styles.patternPanel}>
        <div className={styles.patternSummary}>{SUCCESS_PATTERNS.summary}</div>
        <div className={styles.patternGrid}>
          {SUCCESS_PATTERNS.patterns.map((p, i) => (
            <div key={i} className={styles.patternCard}>
              <div className={styles.patternCardHead}>
                <span className={styles.patternIcon}>{p.icon}</span>
                <span className={styles.patternLabel}>{p.label}</span>
              </div>
              <div className={styles.patternFinding}>{p.finding}</div>
              <div className={styles.patternDetail}>{p.detail}</div>
            </div>
          ))}
        </div>
        <div className={styles.patternFormula}>
          <span className={styles.patternFormulaIcon}>⟐</span>
          <span className={styles.patternFormulaText}>{SUCCESS_PATTERNS.formula}</span>
        </div>
      </div>

      </details>

      <h2 className={adminStyles.sectionTitle}>Son Aktiviteler</h2>
      <div className={`${styles.contentCard} ${styles.activitiesWrap}`}>
        <ul className={styles.activityList}>
          {activities.map((row, i) => (
            <li key={`${row.type}-${i}-${row.text.slice(0, 24)}`} className={styles.activityItem}>
              <span
                className={`${styles.activityDot} ${activityDotClass(row.type)}`}
                aria-hidden
              />
              <span className={styles.activityText}>{row.text}</span>
              <span className={styles.activityTime}>{row.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
