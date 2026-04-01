import { useState, useMemo, useCallback } from "react";
import adminStyles from "../../components/admin/AdminStyles.module.css";
import s from "./AdminCalendarPage.module.css";

const DAY_NAMES_TR = ["Pzr", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
const MONTH_NAMES_TR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function getWeekDates(refDate) {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const dd = new Date(monday);
    dd.setDate(monday.getDate() + i);
    dates.push(dd);
  }
  return dates;
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isToday(d) {
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function generateCalendarItems() {
  const now = new Date();
  const items = [];
  const base = [
    { type: "okuma", title: "KONTROL = İLLÜZYON KODU", status: "draft", offset: 0 },
    { type: "yanki", title: "Bugünün Sorusu: Kaçındığın duygu", status: "published", offset: 0 },
    { type: "rituel", title: "Gece Kapanış Ritüeli", status: "scheduled", offset: 0 },
    { type: "okuma", title: "1999 — Kapanmayan Frekans (güncelleme)", status: "published", offset: -1 },
    { type: "yanki", title: "Soru: Gece senden ne konuşuyor?", status: "published", offset: -1 },
    { type: "rituel", title: "Sabah Ateşi — Niyet Ritüeli", status: "published", offset: -1 },
    { type: "okuma", title: "RÜYA = BİLİNÇALTININ KODU", status: "draft", offset: 1 },
    { type: "yanki", title: "Soru: İçindeki en sessiz ses ne söylüyor?", status: "scheduled", offset: 1 },
    { type: "rituel", title: "Kalp Yumuşatma — Affediş", status: "scheduled", offset: 1 },
    { type: "okuma", title: "AYNA = YANSIMA KODU", status: "draft", offset: 2 },
    { type: "yanki", title: "Soru: Bugün sana ne ayna tuttu?", status: "scheduled", offset: 2 },
    { type: "okuma", title: "GECE FREKANSINDA — Karanlığın Kodu", status: "draft", offset: 3 },
    { type: "rituel", title: "Sessiz Merkez — Netlik", status: "scheduled", offset: 3 },
    { type: "okuma", title: "İNSAN = ANTEN — Beden Okuması", status: "draft", offset: -2 },
    { type: "yanki", title: "Soru: Hayatında hangi frekansı seçiyorsun?", status: "published", offset: -2 },
    { type: "rituel", title: "47 Nefes — Sakinleştir", status: "published", offset: -2 },
    { type: "yanki", title: "Soru: Bedenin şu an sana ne diyor?", status: "scheduled", offset: 4 },
    { type: "rituel", title: "Bırakma Nefesi — Kontrol Temizleme", status: "scheduled", offset: 4 },
  ];

  base.forEach((b, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + b.offset);
    items.push({
      id: `cal-${i}`,
      date: dateKey(d),
      type: b.type,
      title: b.title,
      status: b.status,
      subtitle: "",
    });
  });

  return items;
}

const TYPE_STYLE = { okuma: s.calItemOkuma, yanki: s.calItemYanki, rituel: s.calItemRituel };
const TYPE_LABEL = { okuma: "Okuma", yanki: "Yankı", rituel: "Ritüel" };
const STATUS_STYLE = { draft: s.calItemDraft, published: s.calItemPublished, scheduled: s.calItemScheduled };
const STATUS_LABEL = { draft: "Taslak", published: "Yayında", scheduled: "Planlandı" };

export default function AdminCalendarPage() {
  const [weekRef, setWeekRef] = useState(() => new Date());
  const [items, setItems] = useState(generateCalendarItems);
  const [selectedItem, setSelectedItem] = useState(null);

  const weekDates = useMemo(() => getWeekDates(weekRef), [weekRef]);

  const weekLabel = useMemo(() => {
    const first = weekDates[0];
    const last = weekDates[6];
    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()} – ${last.getDate()} ${MONTH_NAMES_TR[first.getMonth()]} ${first.getFullYear()}`;
    }
    return `${first.getDate()} ${MONTH_NAMES_TR[first.getMonth()]} – ${last.getDate()} ${MONTH_NAMES_TR[last.getMonth()]} ${last.getFullYear()}`;
  }, [weekDates]);

  const itemsByDate = useMemo(() => {
    const map = {};
    items.forEach((it) => {
      if (!map[it.date]) map[it.date] = [];
      map[it.date].push(it);
    });
    return map;
  }, [items]);

  const prevWeek = useCallback(() => {
    setWeekRef((r) => {
      const d = new Date(r);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const nextWeek = useCallback(() => {
    setWeekRef((r) => {
      const d = new Date(r);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const goToday = useCallback(() => setWeekRef(new Date()), []);

  const changeStatus = useCallback((id, newStatus) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: newStatus } : it)));
    setSelectedItem((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
  }, []);

  const totalDrafts = items.filter((i) => i.status === "draft").length;
  const totalScheduled = items.filter((i) => i.status === "scheduled").length;
  const totalPublished = items.filter((i) => i.status === "published").length;

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>İçerik Takvimi</h1>

      <div className={s.summaryRow}>
        <div className={s.summaryCard}>
          <div className={s.summaryValue}>{totalDrafts}</div>
          <div className={s.summaryLabel}>Taslak</div>
        </div>
        <div className={s.summaryCard}>
          <div className={s.summaryValue}>{totalScheduled}</div>
          <div className={s.summaryLabel}>Planlanmış</div>
        </div>
        <div className={s.summaryCard}>
          <div className={s.summaryValue}>{totalPublished}</div>
          <div className={s.summaryLabel}>Yayında</div>
        </div>
      </div>

      <div className={s.calendarHeader}>
        <div className={s.weekNav}>
          <button type="button" className={s.weekBtn} onClick={prevWeek} aria-label="Önceki hafta">‹</button>
          <span className={s.weekLabel}>{weekLabel}</span>
          <button type="button" className={s.weekBtn} onClick={nextWeek} aria-label="Sonraki hafta">›</button>
          <button type="button" className={s.todayBtn} onClick={goToday}>Bugün</button>
        </div>
        <div className={s.legend}>
          <span className={s.legendItem}><span className={`${s.legendDot} ${s.legendDotOkuma}`} /> Okuma</span>
          <span className={s.legendItem}><span className={`${s.legendDot} ${s.legendDotYanki}`} /> Yankı</span>
          <span className={s.legendItem}><span className={`${s.legendDot} ${s.legendDotRituel}`} /> Ritüel</span>
        </div>
      </div>

      <div className={s.weekGrid}>
        {weekDates.map((d) => {
          const key = dateKey(d);
          const dayItems = itemsByDate[key] || [];
          const today = isToday(d);
          return (
            <div key={key} className={`${s.dayColumn} ${today ? s.dayColumnToday : ""}`}>
              <div className={s.dayHeader}>
                <div className={s.dayName}>{DAY_NAMES_TR[d.getDay()]}</div>
                <div className={`${s.dayNumber} ${today ? s.dayNumberToday : ""}`}>{d.getDate()}</div>
              </div>
              <div className={s.dayBody}>
                {dayItems.length === 0 && <div className={s.dayEmpty}>·</div>}
                {dayItems.map((it) => (
                  <div
                    key={it.id}
                    className={`${s.calItem} ${TYPE_STYLE[it.type] || ""}`}
                    onClick={() => setSelectedItem(it)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedItem(it)}
                  >
                    <div className={s.calItemTitle}>{it.title}</div>
                    <div className={s.calItemMeta}>
                      <span className={s.calItemType}>{TYPE_LABEL[it.type]}</span>
                      <span className={`${s.calItemStatus} ${STATUS_STYLE[it.status] || ""}`}>
                        {STATUS_LABEL[it.status] || it.status}
                      </span>
                    </div>
                  </div>
                ))}
                <button type="button" className={s.dayAddBtn} title="İçerik ekle">+</button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <>
          <div className={s.drawerBackdrop} onClick={() => setSelectedItem(null)} />
          <aside className={s.drawer} role="dialog" aria-label="İçerik Detayı">
            <div className={s.drawerHeader}>
              <span className={s.drawerTitle}>İçerik Detayı</span>
              <button type="button" className={s.drawerClose} onClick={() => setSelectedItem(null)}>✕</button>
            </div>
            <div className={s.drawerBody}>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Başlık</span>
                <span className={s.drawerValue}>{selectedItem.title}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Tip</span>
                <span className={s.drawerValue}>{TYPE_LABEL[selectedItem.type]}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Tarih</span>
                <span className={s.drawerValue}>{selectedItem.date}</span>
              </div>
              <div className={s.drawerField}>
                <span className={s.drawerLabel}>Durum</span>
                <span
                  className={`${s.drawerStatusBadge} ${STATUS_STYLE[selectedItem.status] || ""}`}
                >
                  {STATUS_LABEL[selectedItem.status] || selectedItem.status}
                </span>
              </div>
            </div>
            <div className={s.drawerActions}>
              {selectedItem.status === "draft" && (
                <button
                  type="button"
                  className={`${s.drawerBtn} ${s.drawerBtnPrimary}`}
                  onClick={() => changeStatus(selectedItem.id, "scheduled")}
                >
                  Planla
                </button>
              )}
              {selectedItem.status === "scheduled" && (
                <button
                  type="button"
                  className={`${s.drawerBtn} ${s.drawerBtnPrimary}`}
                  onClick={() => changeStatus(selectedItem.id, "published")}
                >
                  Yayınla
                </button>
              )}
              {selectedItem.status !== "draft" && (
                <button
                  type="button"
                  className={s.drawerBtn}
                  onClick={() => changeStatus(selectedItem.id, "draft")}
                >
                  Taslağa Al
                </button>
              )}
              <button
                type="button"
                className={s.drawerBtn}
                onClick={() => setSelectedItem(null)}
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
