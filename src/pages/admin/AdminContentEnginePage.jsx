import { useState, useCallback } from "react";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import s from "./AdminContentEnginePage.module.css";

const ENGINE_SLOTS = [
  {
    id: "okuma",
    label: "Okuma Postu",
    desc: "Trend ve boş kategorilerden günlük bir matrix okuması taslağı üretir.",
    time: "Her gün 08:00",
    icon: "◈",
  },
  {
    id: "yanki",
    label: "Yankı Sorusu",
    desc: "Kolektif bilinç akışına yön verecek günlük bir soru üretir.",
    time: "Her gün 10:00",
    icon: "◎",
  },
  {
    id: "rituel",
    label: "Ritüel Önerisi",
    desc: "Günün enerjisine uygun bir ritüel seçer veya yeni teklif üretir.",
    time: "Her gün 07:00",
    icon: "⬡",
  },
];

function generateMockDrafts() {
  const now = new Date();
  const fmt = (d) =>
    d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) +
    " " +
    d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

  return [
    {
      id: "gen-1",
      type: "okuma",
      title: "KONTROL = İLLÜZYON KODU",
      subtitle: "Kontrol ettiğini sandığın şey seni kontrol eder. Gerçek güç farkındalıktadır.",
      status: "pending",
      source: "trend: kontrol teması yükseliyor",
      createdAt: fmt(new Date(now.getTime() - 2 * 3600_000)),
    },
    {
      id: "gen-2",
      type: "yanki",
      title: "Bugünün Sorusu",
      subtitle: "Şu an en çok kaçındığın duygu hangisi — ve onun altında ne saklı?",
      status: "approved",
      source: "trend: kaçınma temaları artıyor",
      createdAt: fmt(new Date(now.getTime() - 5 * 3600_000)),
    },
    {
      id: "gen-3",
      type: "rituel",
      title: "Gece Kapanış Ritüeli",
      subtitle: "Yatmadan önce günü bilinçle kapatma pratiği. 3 dakika, nefes + niyet.",
      status: "pending",
      source: "gap: gece içerikleri eksik",
      createdAt: fmt(new Date(now.getTime() - 8 * 3600_000)),
    },
    {
      id: "gen-4",
      type: "okuma",
      title: "RÜYA = BİLİNÇALTININ KODU",
      subtitle: "Gördüğün her şey bir mesaj taşır. Ama sen mesajı okumayı seçmelisin.",
      status: "pending",
      source: "gap: rüya kategorisinde içerik eksik",
      createdAt: fmt(new Date(now.getTime() - 26 * 3600_000)),
    },
    {
      id: "gen-5",
      type: "yanki",
      title: "Bugünün Sorusu",
      subtitle: "Gece yalnız kaldığında senden ne konuşuyor?",
      status: "approved",
      source: "trend: yalnızlık teması patlıyor",
      createdAt: fmt(new Date(now.getTime() - 29 * 3600_000)),
    },
    {
      id: "gen-6",
      type: "rituel",
      title: "Sabah Ateşi — Niyet Ritüeli",
      subtitle: "Güne bir niyetle başla. Ateş elementi, solar çakra aktivasyonu.",
      status: "approved",
      source: "otomatik: sabah ritüeli döngüsü",
      createdAt: fmt(new Date(now.getTime() - 32 * 3600_000)),
    },
    {
      id: "gen-7",
      type: "okuma",
      title: "AYNA = YANSIMA KODU",
      subtitle: "Dışarıda gördüğün her şey senin bir parçanın yansıması.",
      status: "approved",
      source: "gap: sembol okuması kategorisi boş",
      createdAt: fmt(new Date(now.getTime() - 50 * 3600_000)),
    },
  ];
}

const TYPE_ICON = { okuma: "◈", yanki: "◎", rituel: "⬡" };
const TYPE_LABEL = { okuma: "Okuma", yanki: "Yankı", rituel: "Ritüel" };
const TYPE_STYLE = { okuma: s.draftTypeOkuma, yanki: s.draftTypeYanki, rituel: s.draftTypeRituel };

export default function AdminContentEnginePage() {
  const [engineActive, setEngineActive] = useState(true);
  const [slots, setSlots] = useState(() =>
    ENGINE_SLOTS.reduce((acc, sl) => ({ ...acc, [sl.id]: true }), {}),
  );
  const [drafts, setDrafts] = useState(generateMockDrafts);
  const [running, setRunning] = useState(false);

  const toggleSlot = useCallback((id) => {
    setSlots((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const approveDraft = useCallback((id) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d)));
  }, []);

  const removeDraft = useCallback((id) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const runNow = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      const now = new Date();
      const fmt = (d) =>
        d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) +
        " " +
        d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

      const newDrafts = [];
      if (slots.okuma) {
        newDrafts.push({
          id: `gen-${Date.now()}-okuma`,
          type: "okuma",
          title: "GECE FREKANSINDA — Karanlığın Kodu",
          subtitle: "Karanlık, bilinçaltının konuşma saatidir. Gece uyanıyorsan bir sinyal var.",
          status: "pending",
          source: "motor: anlık üretim",
          createdAt: fmt(now),
        });
      }
      if (slots.yanki) {
        newDrafts.push({
          id: `gen-${Date.now()}-yanki`,
          type: "yanki",
          title: "Bugünün Sorusu",
          subtitle: "Bugün bedeninde en çok hangi duyguyu taşıdın — ve onu nereye koydun?",
          status: "pending",
          source: "motor: anlık üretim",
          createdAt: fmt(now),
        });
      }
      if (slots.rituel) {
        newDrafts.push({
          id: `gen-${Date.now()}-rituel`,
          type: "rituel",
          title: "Sessiz Merkez — Netlik Pratiği",
          subtitle: "Zihnin gürültüsünü 3 dakikada sustur. Üçüncü göz, nefes odağı.",
          status: "pending",
          source: "motor: anlık üretim",
          createdAt: fmt(now),
        });
      }
      setDrafts((prev) => [...newDrafts, ...prev]);
      setRunning(false);
    }, 2200);
  }, [slots]);

  const pendingCount = drafts.filter((d) => d.status === "pending").length;
  const approvedCount = drafts.filter((d) => d.status === "approved").length;
  const activeSlots = Object.values(slots).filter(Boolean).length;

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>Otomatik İçerik Motoru</h1>

      <div className={s.engineHeader}>
        <div className={s.engineStatus}>
          <div className={`${s.engineBadge} ${engineActive ? s.engineBadgeActive : s.engineBadgeOff}`}>
            <span className={`${s.engineDot} ${engineActive ? s.engineDotOn : s.engineDotOff}`} />
            {engineActive ? "Motor Aktif" : "Motor Kapalı"}
          </div>
          <div className={s.toggleWrap}>
            <span className={s.toggleLabel}>{engineActive ? "Aktif" : "Pasif"}</span>
            <button
              type="button"
              className={`${s.toggle} ${engineActive ? s.toggleActive : ""}`}
              onClick={() => setEngineActive((v) => !v)}
              aria-label="Motoru aç/kapat"
            >
              <span className={s.toggleKnob} />
            </button>
          </div>
        </div>
        <button
          type="button"
          className={s.manualRunBtn}
          onClick={runNow}
          disabled={running || !engineActive}
        >
          {running ? "Üretiliyor…" : "▶ Şimdi Çalıştır"}
        </button>
      </div>

      <div className={s.statsRow}>
        <div className={s.statMini}>
          <div className={s.statMiniValue}>{drafts.length}</div>
          <div className={s.statMiniLabel}>Toplam Üretim</div>
        </div>
        <div className={s.statMini}>
          <div className={s.statMiniValue}>{pendingCount}</div>
          <div className={s.statMiniLabel}>Onay Bekleyen</div>
        </div>
        <div className={s.statMini}>
          <div className={s.statMiniValue}>{approvedCount}</div>
          <div className={s.statMiniLabel}>Onaylanan</div>
        </div>
        <div className={s.statMini}>
          <div className={s.statMiniValue}>{activeSlots}/3</div>
          <div className={s.statMiniLabel}>Aktif Kanal</div>
        </div>
      </div>

      <div className={s.configPanel}>
        <div className={s.configTitle}>Üretim Kanalları</div>
        <div className={s.configGrid}>
          {ENGINE_SLOTS.map((slot) => (
            <div key={slot.id} className={`${s.configCard} ${slots[slot.id] ? s.configCardActive : ""}`}>
              <div className={s.configCardHeader}>
                <span className={s.configCardLabel}>{slot.icon} {slot.label}</span>
                <button
                  type="button"
                  className={`${s.configCardCheck} ${slots[slot.id] ? s.configCardCheckOn : ""}`}
                  onClick={() => toggleSlot(slot.id)}
                  aria-label={`${slot.label} ${slots[slot.id] ? "kapat" : "aç"}`}
                >
                  {slots[slot.id] ? "✓" : ""}
                </button>
              </div>
              <div className={s.configCardDesc}>{slot.desc}</div>
              <div className={s.configCardTime}>{slot.time}</div>
            </div>
          ))}
        </div>
        <div className={s.scheduleRow}>
          <span className={s.scheduleIcon}>⏱</span>
          <span className={s.scheduleText}>
            {activeSlots} kanal aktif — günde {activeSlots} taslak üretilecek
          </span>
          <span className={s.scheduleNextRun}>
            Sonraki çalışma: {engineActive ? "yarın 07:00" : "kapalı"}
          </span>
        </div>
      </div>

      <h2 className={adminStyles.sectionTitle}>Üretilen Taslaklar</h2>

      {running && (
        <div className={s.runningOverlay}>
          <div className={s.spinner} />
          <span className={s.runningText}>İçerik motoru çalışıyor… Taslaklar üretiliyor.</span>
        </div>
      )}

      <div className={s.panel}>
        {drafts.length === 0 ? (
          <div className={s.emptyState}>Henüz üretilmiş taslak yok. Motoru çalıştırın.</div>
        ) : (
          <ul className={s.draftsList}>
            {drafts.map((d) => (
              <li key={d.id} className={s.draftItem}>
                <div className={`${s.draftTypeIcon} ${TYPE_STYLE[d.type] || ""}`}>
                  {TYPE_ICON[d.type] || "◇"}
                </div>
                <div className={s.draftBody}>
                  <div className={s.draftTitle}>{d.title}</div>
                  <div className={s.draftSubtitle}>{d.subtitle}</div>
                  <div className={s.draftMeta}>
                    <span
                      className={`${s.draftTag} ${
                        d.status === "approved" ? s.draftTagApproved : s.draftTagPending
                      }`}
                    >
                      {d.status === "approved" ? "Onaylandı" : "Onay Bekliyor"}
                    </span>
                    <span className={s.draftTime}>
                      {TYPE_LABEL[d.type]} · {d.createdAt}
                    </span>
                  </div>
                </div>
                <div className={s.draftActions}>
                  {d.status === "pending" && (
                    <button
                      type="button"
                      className={`${s.draftActionBtn} ${s.draftActionApprove}`}
                      onClick={() => approveDraft(d.id)}
                    >
                      ✓ Onayla
                    </button>
                  )}
                  <button
                    type="button"
                    className={s.draftActionBtn}
                    onClick={() => removeDraft(d.id)}
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
