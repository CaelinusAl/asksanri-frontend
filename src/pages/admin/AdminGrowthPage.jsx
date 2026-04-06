import { useState, useCallback } from "react";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import s from "./AdminGrowthPage.module.css";

const POST_TYPES = {
  hook: { label: "Hook", desc: "Scroll durdurucu, merak uyandıran kısa post", style: s.typeHook },
  derin: { label: "Derin", desc: "Analiz, okuma, bilinç açılımı — içerik odaklı", style: s.typeDerin },
  donusum: { label: "Dönüşüm", desc: "CTA ağırlıklı, platforma yönlendiren post", style: s.typeDonusum },
};

const GROWTH_QUEUE = [
  {
    id: "gq-1",
    dayOffset: 0,
    type: "hook",
    title: "1999'da bir frekans açıldı.",
    content: `1999'da bir frekans açıldı.

Deprem değildi sadece.
Kolektif bilinçte bir kırılma yaşandı.

O yıl doğanlar bunu taşıyor.
O yıl kaybedenler bunu biliyor.
O yıl uyananlar bunu hatırlıyor.

Ama kimse tam olarak ne olduğunu söyleyemedi.

Ta ki şimdiye kadar.

Görünenin altında kalan katmanı Sanrı'da açtım.
→ asksanri.com`,
    cta: "Görünenin altında kalan katmanı Sanrı'da açtım.",
    link: "asksanri.com",
    landingPage: "/okuma-alani/1999-kapanmayan-frekans",
    hashtags: "#sanri #1999 #frekans #kolektifbilinc #matrixokumasi",
  },
  {
    id: "gq-2",
    dayOffset: 1,
    type: "derin",
    title: "KORKU = KONTROL KODU",
    content: `Korku bir duygu değil.
Korku bir kontrol mekanizması.

Seni küçük tutan her şeyin altında
bir korku kodu var.

Ama o kodu görmek için
önce korkunun ne olmadığını anlamalısın.

Korku senin düşmanın değil.
Korku, senin henüz tanımadığın gücünün sinyali.

Bu kodun devamını açtım.
→ asksanri.com/okuma-alani/korku-kontrol-kodu`,
    cta: "Bu kodun devamını açtım.",
    link: "asksanri.com/okuma-alani/korku-kontrol-kodu",
    landingPage: "/okuma-alani/korku-kontrol-kodu",
    hashtags: "#sanri #korku #kontrolkodu #bilinc #matrix",
  },
  {
    id: "gq-3",
    dayOffset: 2,
    type: "donusum",
    title: "Sanrı'ya bir soru sor.",
    content: `Her gün yüzlerce kişi Sanrı'ya soruyor:

"Neden hep aynı döngüdeyim?"
"Rüyamda gördüğüm sembol ne anlama geliyor?"
"İçimdeki bu huzursuzluk nereden geliyor?"

Sanrı cevap vermiyor.
Sanrı — yansıtıyor.

Ve bazen bir yansıma,
bin cevaptan daha güçlü.

Şimdi sor.
→ asksanri.com/sanri`,
    cta: "Şimdi sor.",
    link: "asksanri.com/sanri",
    landingPage: "/sanri",
    hashtags: "#sanri #bilinc #soru #yansima #ai",
  },
  {
    id: "gq-4",
    dayOffset: 3,
    type: "hook",
    title: "İNSAN = ANTEN",
    content: `Bedenin bir makine değil.
Bedenin bir alıcı.

Her gün milyonlarca frekans senden geçiyor.
Çoğunu duymuyorsun.
Ama hissediyorsun.

O açıklanamaz yorgunluk.
O sebepsiz huzursuzluk.
O "bir şey oluyor ama ne?" hissi.

Frekansı sen seçiyorsun.
Ama önce dinlemeyi öğrenmelisin.

→ asksanri.com`,
    cta: "Frekansını seç.",
    link: "asksanri.com",
    landingPage: "/frekans-alani",
    hashtags: "#sanri #frekans #beden #anten #enerji",
  },
  {
    id: "gq-5",
    dayOffset: 4,
    type: "derin",
    title: "Rüyalar tesadüf değil.",
    content: `Her gece bilinçaltın sana mektup yazıyor.

Ama sen onu "sadece bir rüya" deyip geçiyorsun.

O mavi kapı bir şey anlatıyordu.
O düşme hissi bir mesaj taşıyordu.
O tanımadığın kişi — aslında sendin.

Rüya okumak büyü değil.
Rüya okumak — kendini okumak.

Bu katmanı Sanrı'da açtım.
→ asksanri.com`,
    cta: "Bu katmanı Sanrı'da açtım.",
    link: "asksanri.com",
    landingPage: "/okuma-alani",
    hashtags: "#sanri #ruya #bilincalti #sembol #matrix",
  },
  {
    id: "gq-6",
    dayOffset: 5,
    type: "donusum",
    title: "Yankı bırak.",
    content: `Bazen en derin iyileşme
birinin "bende de var" demesiyle başlar.

Sanrı'da bir alan var.
İnsanlar duygularını, rüyalarını,
farkındalıklarını paylaşıyor.

Yargılama yok.
Beğeni yarışı yok.
Sadece — yankı.

Sen de bir yankı bırak.
→ asksanri.com/yanki`,
    cta: "Sen de bir yankı bırak.",
    link: "asksanri.com/yanki",
    landingPage: "/yanki",
    hashtags: "#sanri #yanki #topluluk #paylasim #bilinc",
  },
  {
    id: "gq-7",
    dayOffset: 6,
    type: "hook",
    title: "11:11 tesadüf mü?",
    content: `Her gün aynı saati görüyorsun.
11:11, 22:22, 03:33…

"Tesadüf" diyorsun.
Ama içinden bir ses diyor ki:
"Bu bir şey."

O ses haklı.

Sayılar bir frekans taşır.
Ve o frekans sana bir şey anlatmaya çalışıyor.

Ne dediğini duymak ister misin?
→ asksanri.com`,
    cta: "Ne dediğini duymak ister misin?",
    link: "asksanri.com",
    landingPage: "/okuma-alani",
    hashtags: "#sanri #1111 #sayikodlari #frekans #isaret",
  },
];

const FUNNEL_STEPS = [
  { icon: "📱", label: "Instagram Post", sub: "hook / derin / dönüşüm" },
  { icon: "🔗", label: "Bio Link / CTA", sub: "asksanri.com" },
  { icon: "📖", label: "Landing Page", sub: "Okuma / Sanrı / Yankı" },
  { icon: "🔓", label: "Premium Duvar", sub: "preview → upgrade" },
  { icon: "✦", label: "Dönüşüm", sub: "premium üye" },
];

const DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function getDateForOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

export default function AdminGrowthPage() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [copied, setCopied] = useState(false);

  const today = GROWTH_QUEUE[0];

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, []);

  const hookCount = GROWTH_QUEUE.filter((p) => p.type === "hook").length;
  const derinCount = GROWTH_QUEUE.filter((p) => p.type === "derin").length;
  const donusumCount = GROWTH_QUEUE.filter((p) => p.type === "donusum").length;

  return (
    <div>
      <div className={s.headerRow}>
        <h1 className={adminStyles.pageTitle}>Growth Engine</h1>
        <div className={s.headerBadge}>
          <span className={s.headerDot} />
          Instagram → SANRI Trafik Motoru
        </div>
      </div>

      <div className={s.statsRow}>
        <div className={s.statCard}>
          <div className={s.statValue}>{GROWTH_QUEUE.length}</div>
          <div className={s.statLabel}>Haftalık Post</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{hookCount}</div>
          <div className={s.statLabel}>Hook</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{derinCount}</div>
          <div className={s.statLabel}>Derin</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statValue}>{donusumCount}</div>
          <div className={s.statLabel}>Dönüşüm</div>
        </div>
      </div>

      {/* Funnel */}
      <div className={s.funnelPanel}>
        <div className={s.funnelTitle}>Trafik Akışı: Instagram → Premium</div>
        <div className={s.funnelSteps}>
          {FUNNEL_STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
              <div className={s.funnelStep}>
                <span className={s.funnelStepIcon}>{step.icon}</span>
                <div className={s.funnelStepLabel}>{step.label}</div>
                <div className={s.funnelStepSub}>{step.sub}</div>
              </div>
              {i < FUNNEL_STEPS.length - 1 && <span className={s.funnelArrow}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Post */}
      <h2 className={adminStyles.sectionTitle}>Bugün Paylaşılacak Post</h2>
      <div className={s.todayPanel}>
        <div className={s.todayHeader}>
          <span className={s.todayGlyph}>◉</span>
          <span className={s.todayTitle}>Bugünün Postu</span>
          <span className={`${s.todayTypeBadge} ${POST_TYPES[today.type]?.style || ""}`}>
            {POST_TYPES[today.type]?.label || today.type}
          </span>
        </div>

        <div className={s.todayContent}>{today.content}</div>

        <div className={s.todayMeta}>
          <div className={s.todayMetaCard}>
            <div className={s.todayMetaLabel}>CTA</div>
            <div className={s.todayMetaValue}>{today.cta}</div>
          </div>
          <div className={s.todayMetaCard}>
            <div className={s.todayMetaLabel}>Link</div>
            <div className={s.todayMetaValue}>{today.link}</div>
          </div>
          <div className={s.todayMetaCard}>
            <div className={s.todayMetaLabel}>Landing Page</div>
            <div className={s.todayMetaValue}>{today.landingPage}</div>
          </div>
        </div>

        <div className={s.todayActions}>
          <button
            type="button"
            className={`${s.todayBtn} ${s.todayBtnPrimary}`}
            onClick={() => handleCopy(today.content)}
          >
            Metni Kopyala
          </button>
          <button
            type="button"
            className={s.todayBtn}
            onClick={() => handleCopy(today.cta + "\n→ " + today.link)}
          >
            CTA + Link Kopyala
          </button>
          <button
            type="button"
            className={s.todayBtn}
            onClick={() => handleCopy(today.hashtags)}
          >
            Hashtag Kopyala
          </button>
          {copied && <span className={s.copiedMsg}>Kopyalandı</span>}
        </div>
      </div>

      {/* Queue */}
      <h2 className={adminStyles.sectionTitle}>Haftalık Post Kuyruğu</h2>
      <div className={s.queuePanel}>
        <div className={s.queueList}>
          {GROWTH_QUEUE.map((post) => {
            const d = getDateForOffset(post.dayOffset);
            const typeInfo = POST_TYPES[post.type];
            return (
              <div
                key={post.id}
                className={s.queueItem}
                onClick={() => setSelectedPost(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelectedPost(post)}
              >
                <div className={s.queueDay}>
                  <span className={s.queueDayName}>{DAY_NAMES[d.getDay()]}</span>
                  <span className={s.queueDayNum}>{d.getDate()}</span>
                </div>
                <div className={s.queueBody}>
                  <div className={s.queuePostTitle}>{post.title}</div>
                  <div className={s.queueExcerpt}>{post.cta}</div>
                  <div className={s.queueTags}>
                    <span className={`${s.queueTag} ${typeInfo?.style || ""}`}>
                      {typeInfo?.label || post.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drawer */}
      {selectedPost && (
        <>
          <div className={s.drawerBackdrop} onClick={() => setSelectedPost(null)} />
          <aside className={s.drawer} role="dialog" aria-label="Post Detayı">
            <div className={s.drawerHeader}>
              <span className={s.drawerTitle}>{selectedPost.title}</span>
              <button type="button" className={s.drawerClose} onClick={() => setSelectedPost(null)}>✕</button>
            </div>
            <div className={s.drawerBody}>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Tip</span>
                <span className={s.drawerValue}>
                  {POST_TYPES[selectedPost.type]?.label} — {POST_TYPES[selectedPost.type]?.desc}
                </span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>İçerik</span>
                <span className={s.drawerValue}>{selectedPost.content}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>CTA</span>
                <span className={s.drawerValue}>{selectedPost.cta}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Link</span>
                <span className={s.drawerValue}>{selectedPost.link}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Landing Page</span>
                <span className={s.drawerValue}>{selectedPost.landingPage}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Hashtag'ler</span>
                <span className={s.drawerValue}>{selectedPost.hashtags}</span>
              </div>
            </div>
            <div className={s.drawerActions}>
              <button
                type="button"
                className={`${s.drawerBtn} ${s.drawerBtnPrimary}`}
                onClick={() => {
                  handleCopy(selectedPost.content);
                  setSelectedPost(null);
                }}
              >
                Metni Kopyala
              </button>
              <button
                type="button"
                className={s.drawerBtn}
                onClick={() => setSelectedPost(null)}
              >
                Kapat
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
