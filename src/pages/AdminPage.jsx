import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "https://api.asksanri.com";
const hdrs = () => {
  const t = localStorage.getItem("sanri_token");
  return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};
const fmtD = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); } catch { return iso; }
};
const fmtShort = (iso) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }); } catch { return ""; }
};

const TABS = [
  { key: "dashboard", icon: "◉", label: "Dashboard" },
  { key: "users", icon: "◎", label: "Users" },
  { key: "moderation", icon: "✦", label: "Moderation" },
  { key: "analytics", icon: "⟡", label: "Analytics" },
  { key: "membership", icon: "◇", label: "Membership" },
  { key: "security", icon: "⬡", label: "Security" },
  { key: "insight", icon: "◈", label: "Insight Center" },
];

/* ═══════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════ */

function StatCard({ label, value, color = "#7cf7d8", sub, icon }) {
  return (
    <div style={S.statCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={S.statLabel}>{label}</div>
        {icon && <span style={{ fontSize: 18, opacity: 0.3 }}>{icon}</span>}
      </div>
      <div style={{ ...S.statValue, color }}>{value ?? "—"}</div>
      {sub && <div style={S.statSub}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, height = 180, color = "#7cf7d8", label }) {
  if (!data?.length) return <div style={S.empty}>Veri yok</div>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={S.chartCard}>
      {label && <div style={S.chartLabel}>{label}</div>}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height, padding: "0 4px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color, fontWeight: 700, opacity: d.count > 0 ? 1 : 0 }}>{d.count}</div>
            <div
              style={{
                width: "100%",
                maxWidth: 36,
                height: `${Math.max((d.count / max) * (height - 40), 2)}px`,
                background: `linear-gradient(180deg, ${color}, ${color}44)`,
                borderRadius: "4px 4px 0 0",
                transition: "height 0.4s ease",
              }}
            />
            <div style={{ fontSize: 9, opacity: 0.4, whiteSpace: "nowrap", maxWidth: 40, overflow: "hidden", textOverflow: "ellipsis" }}>
              {d.label || fmtShort(d.day)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizBar({ items, color = "#7cf7d8", title }) {
  if (!items?.length) return null;
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={S.chartCard}>
      {title && <div style={S.chartLabel}>{title}</div>}
      {items.slice(0, 10).map((it) => (
        <div key={it.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 90, fontSize: 12, fontWeight: 600, opacity: 0.75, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</div>
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.max((it.count / max) * 100, 3)}%`, borderRadius: 4, background: `linear-gradient(90deg, ${color}, ${color}66)`, transition: "width 0.3s" }} />
          </div>
          <div style={{ width: 40, textAlign: "right", fontSize: 13, fontWeight: 800, color }}>{it.count}</div>
        </div>
      ))}
    </div>
  );
}

function Badge({ text, color = "rgba(124,247,216,0.8)", bg = "rgba(124,247,216,0.12)" }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color, background: bg }}>{text}</span>;
}

function Pager({ page, setPage, total, per }) {
  const pages = Math.max(1, Math.ceil(total / per));
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center", alignItems: "center" }}>
      <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={S.btnSm}>←</button>
      <span style={{ opacity: 0.5, fontSize: 13 }}>{page + 1} / {pages}</span>
      <button onClick={() => setPage((p) => p + 1)} disabled={page + 1 >= pages} style={S.btnSm}>→</button>
    </div>
  );
}

function Loading() { return <div style={S.empty}>Yükleniyor...</div>; }
function Empty({ text = "Veri bulunamadı." }) { return <div style={S.empty}>{text}</div>; }

/* ═══════════════════════════════════════════════
   1. DASHBOARD
   ═══════════════════════════════════════════════ */

function DashboardSection({ data, loading, onRefresh }) {
  if (loading) return <Loading />;
  if (!data) return <Empty text="Dashboard verisi yüklenemedi." />;
  const u = data.users || {};
  const ev = data.events || {};
  const yk = data.yanki || {};

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={S.secTitle}>Genel Bakış</div>
        <button onClick={onRefresh} style={S.btnPrimary}>↻ Yenile</button>
      </div>

      <div style={S.grid6}>
        <StatCard label="Toplam Kullanıcı" value={u.total} icon="◎" />
        <StatCard label="Aktif (24s)" value={u.active_24h} color="#cbbcff" icon="⚡" />
        <StatCard label="Premium" value={u.premium} color="#ffa726" icon="◇" />
        <StatCard label="Yeni (24s)" value={u.new_24h} color="#7cf7d8" sub={`7g: ${u.new_7d}`} icon="+" />
        <StatCard label="Doğrulanmış" value={u.verified} color="#81c784" icon="✓" />
        <StatCard label="Admin" value={u.admin} color="#ff6b6b" icon="⬡" />
      </div>

      <div style={S.grid4}>
        <StatCard label="Bugün Event" value={ev.last_24h} color="#7cf7d8" sub={`7g: ${ev.last_7d} • Toplam: ${ev.total}`} />
        <StatCard label="VIP Tıklama" value={ev.vip_clicks} color="#ffa726" sub={`7 gün`} />
        <StatCard label="VIP Açılma" value={ev.vip_unlocks} color="#7cf7d8" sub={ev.vip_clicks > 0 ? `%${Math.round((ev.vip_unlocks / ev.vip_clicks) * 100)} dönüşüm` : "—"} />
        <StatCard label="Hafıza" value={data.memories?.total} color="#cbbcff" />
      </div>

      <div style={S.secTitle}>Yankı Alanı</div>
      <div style={S.grid3}>
        <StatCard label="Bekleyen" value={yk.pending} color="#ffa726" icon="⏳" />
        <StatCard label="Yayında" value={yk.published} color="#7cf7d8" icon="✦" />
        <StatCard label="Reddedilen" value={yk.rejected} color="#ff6b6b" icon="✗" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        <HorizBar items={ev.top_actions} title="Top Actions (7g)" color="#7cf7d8" />
        <HorizBar items={ev.top_domains} title="Top Domains (7g)" color="#cbbcff" />
      </div>

      {data.recent_events?.length > 0 && (
        <>
          <div style={{ ...S.secTitle, marginTop: 24 }}>Canlı Event Akışı</div>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Action</th><th style={S.th}>Domain</th><th style={S.th}>User</th><th style={S.th}>Tarih</th></tr></thead>
              <tbody>
                {data.recent_events.slice(0, 15).map((e) => (
                  <tr key={e.id}>
                    <td style={S.td}><Badge text={e.action} /></td>
                    <td style={S.td}>{e.domain || "—"}</td>
                    <td style={S.td}>{e.user_id || "—"}</td>
                    <td style={S.tdMuted}>{fmtD(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   2. USERS
   ═══════════════════════════════════════════════ */

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleF, setRoleF] = useState("");
  const [pg, setPg] = useState(0);
  const [loading, setLoading] = useState(false);
  const PER = 30;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ limit: String(PER), offset: String(pg * PER) });
      if (search) p.set("search", search);
      if (roleF) p.set("role", roleF);
      const r = await fetch(`${API}/admin/users-list?${p}`, { headers: hdrs() });
      const d = await r.json();
      setUsers(d.items || []); setTotal(d.total || 0);
    } catch { setUsers([]); } finally { setLoading(false); }
  }, [pg, search, roleF]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (uid, role) => {
    if (!window.confirm(`Rol "${role}" olarak değiştirilsin mi?`)) return;
    await fetch(`${API}/admin/set-user-role`, { method: "POST", headers: hdrs(), body: JSON.stringify({ target_user_id: uid, role }) });
    load();
  };

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPg(0); }} placeholder="Email ara..." style={S.input} />
        <select value={roleF} onChange={(e) => { setRoleF(e.target.value); setPg(0); }} style={S.select}>
          <option value="">Tüm Roller</option>
          <option value="free">Free</option>
          <option value="vip">VIP</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={load} style={S.btnPrimary} disabled={loading}>{loading ? "..." : "↻"}</button>
      </div>
      <div style={{ opacity: 0.5, fontSize: 12, marginBottom: 10 }}>Toplam: {total}</div>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead><tr>
            <th style={S.th}>ID</th><th style={S.th}>Email</th><th style={S.th}>Rol</th>
            <th style={S.th}>Premium</th><th style={S.th}>Verified</th><th style={S.th}>Kayıt</th><th style={S.th}>İşlem</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={S.td}>{u.id}</td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}>
                  <Badge
                    text={u.role}
                    color={u.role === "admin" ? "#ff6b6b" : u.role === "vip" ? "#7cf7d8" : "rgba(255,255,255,0.6)"}
                    bg={u.role === "admin" ? "rgba(255,59,59,0.15)" : u.role === "vip" ? "rgba(124,247,216,0.15)" : "rgba(255,255,255,0.06)"}
                  />
                </td>
                <td style={S.td}>{u.is_premium ? "✓" : "—"}</td>
                <td style={S.td}>{u.email_verified ? "✓" : "✗"}</td>
                <td style={S.tdMuted}>{fmtD(u.created_at)}</td>
                <td style={S.td}>
                  <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} style={S.selectSm}>
                    {["free", "vip", "admin"].map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={pg} setPage={setPg} total={total} per={PER} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   3. CONTENT MODERATION
   ═══════════════════════════════════════════════ */

function ModerationSection() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusF, setStatusF] = useState("pending_review");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pR, sR] = await Promise.all([
        fetch(`${API}/admin/moderation/posts?status=${statusF}&limit=50`, { headers: hdrs() }),
        fetch(`${API}/admin/moderation/stats`, { headers: hdrs() }),
      ]);
      setPosts((await pR.json()).items || []);
      setStats(await sR.json());
    } catch { setPosts([]); } finally { setLoading(false); }
  }, [statusF]);

  useEffect(() => { load(); }, [load]);

  const review = async (id, action) => {
    const body = { action };
    const n = notes[id] || "";
    if (action === "approve" && n) body.sanri_note = n;
    if (action === "reject" && n) body.reject_reason = n;
    await fetch(`${API}/admin/moderation/posts/${id}/review`, { method: "POST", headers: hdrs(), body: JSON.stringify(body) });
    setNotes((x) => ({ ...x, [id]: "" }));
    load();
  };

  const STATUS_TABS = [
    { key: "pending_review", label: "Bekleyen", color: "#ffa726" },
    { key: "published", label: "Yayında", color: "#7cf7d8" },
    { key: "rejected", label: "Reddedilen", color: "#ff6b6b" },
  ];

  return (
    <>
      {stats && (
        <div style={S.grid5}>
          <StatCard label="Bekleyen" value={stats.pending} color="#ffa726" />
          <StatCard label="Yayında" value={stats.published} color="#7cf7d8" />
          <StatCard label="Reddedilen" value={stats.rejected} color="#ff6b6b" />
          <StatCard label="Toplam Tepki" value={stats.total_reactions} color="#cbbcff" />
          <StatCard label="Rapor" value={stats.total_reports} color="#ff6b6b" />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, margin: "20px 0", flexWrap: "wrap" }}>
        {STATUS_TABS.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusF(s.key)}
            style={{
              ...S.btnSm,
              background: statusF === s.key ? `${s.color}22` : "rgba(255,255,255,0.04)",
              borderColor: statusF === s.key ? `${s.color}55` : "rgba(255,255,255,0.08)",
              color: statusF === s.key ? s.color : "rgba(255,255,255,0.6)",
            }}
          >
            {s.label}
          </button>
        ))}
        <button onClick={load} style={S.btnSm} disabled={loading}>↻</button>
      </div>

      {loading ? <Loading /> : !posts.length ? <Empty text="Bu filtrede gönderi yok." /> : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <div key={p.id} style={S.glassCard}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Badge text={p.category || "—"} color="#cbbcff" bg="rgba(203,188,255,0.12)" />
                  <span style={{ fontSize: 11, opacity: 0.4 }}>{p.author_mode} • {fmtD(p.created_at)}</span>
                </div>
                {p.report_count > 0 && <Badge text={`🚩 ${p.report_count}`} color="#ff6b6b" bg="rgba(255,59,59,0.12)" />}
              </div>
              {p.title && <div style={{ fontWeight: 800, marginBottom: 6 }}>{p.title}</div>}
              <div style={{ opacity: 0.85, lineHeight: 1.6, fontSize: 14 }}>{(p.content_raw || "").slice(0, 400)}</div>

              {statusF === "pending_review" && (
                <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    value={notes[p.id] || ""}
                    onChange={(e) => setNotes((x) => ({ ...x, [p.id]: e.target.value }))}
                    placeholder="Sanrı Notu / Red sebebi..."
                    style={{ ...S.input, flex: 1, minWidth: 180 }}
                  />
                  <button onClick={() => review(p.id, "approve")} style={{ ...S.btnSm, background: "rgba(124,247,216,0.15)", borderColor: "rgba(124,247,216,0.35)", color: "#7cf7d8" }}>✓ Onayla</button>
                  <button onClick={() => review(p.id, "reject")} style={{ ...S.btnSm, background: "rgba(255,59,59,0.12)", borderColor: "rgba(255,59,59,0.25)", color: "#ff6b6b" }}>✗ Reddet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   4. ANALYTICS
   ═══════════════════════════════════════════════ */

function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("7d");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/admin/analytics?period=${period}`, { headers: hdrs() });
      setData(await r.json());
    } catch { setData(null); } finally { setLoading(false); }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Loading />;
  if (!data) return <Empty text="Analytics verisi yüklenemedi." />;

  const ec = data.event_counts || {};

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["7d", "30d", "90d"].map((p) => (
          <button key={p} onClick={() => setPeriod(p)} style={{ ...S.btnSm, background: period === p ? "rgba(124,247,216,0.15)" : "rgba(255,255,255,0.04)", borderColor: period === p ? "rgba(124,247,216,0.35)" : "rgba(255,255,255,0.08)", color: period === p ? "#7cf7d8" : "rgba(255,255,255,0.6)" }}>
            {p === "7d" ? "7 Gün" : p === "30d" ? "30 Gün" : "90 Gün"}
          </button>
        ))}
        <button onClick={load} style={S.btnSm}>↻</button>
      </div>

      <div style={S.secTitle}>Event Dağılımı</div>
      <div style={S.grid3}>
        <StatCard label="Page View" value={ec.page_view} color="#7cf7d8" />
        <StatCard label="Mode Switch" value={ec.mode_switch} color="#cbbcff" />
        <StatCard label="City Open" value={ec.city_open} color="#ffa726" />
        <StatCard label="VIP Click" value={ec.vip_click} color="#ff6b6b" />
        <StatCard label="VIP Unlock" value={ec.vip_unlock} color="#7cf7d8" />
        <StatCard label="Message Sent" value={ec.message_sent} color="#fff" />
        <StatCard label="Post Submitted" value={ec.post_submitted} color="#cbbcff" />
        <StatCard label="Purchase Attempt" value={ec.purchase_attempt} color="#ffa726" />
        <StatCard label="Purchase Success" value={ec.purchase_success} color="#7cf7d8" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <BarChart data={data.daily_events} label="Günlük Event Sayısı" color="#7cf7d8" />
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <BarChart data={data.daily_users} label="Günlük Yeni Kullanıcı" color="#cbbcff" />
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        <HorizBar items={data.by_action} title="Action Dağılımı" color="#7cf7d8" />
        <HorizBar items={data.by_domain} title="Domain Dağılımı" color="#cbbcff" />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   5. MEMBERSHIP
   ═══════════════════════════════════════════════ */

function MembershipSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API}/admin/membership`, { headers: hdrs() });
        setData(await r.json());
      } catch { setData(null); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Loading />;
  if (!data) return <Empty text="Membership verisi yüklenemedi." />;

  const funnelData = [
    { label: "VIP Tıklama", count: data.vip_clicks },
    { label: "VIP Açılma", count: data.vip_unlocks },
    { label: "Satın Alma", count: data.purchases },
  ];

  return (
    <>
      <div style={S.secTitle}>Kullanıcı Dağılımı</div>
      <div style={S.grid4}>
        <StatCard label="Toplam Kullanıcı" value={data.total_users} icon="◎" />
        <StatCard label="Premium" value={data.premium} color="#ffa726" icon="◇" />
        <StatCard label="Free" value={data.free} color="rgba(255,255,255,0.6)" />
        <StatCard label="Dönüşüm Oranı" value={`%${data.conversion_rate}`} color="#7cf7d8" icon="⟡" />
      </div>

      <div style={S.secTitle}>VIP Funnel</div>
      <div style={S.grid3}>
        <StatCard label="VIP Tıklama" value={data.vip_clicks} color="#ffa726" sub="Tüm zamanlar" />
        <StatCard label="VIP Açılma" value={data.vip_unlocks} color="#7cf7d8" sub="Tüm zamanlar" />
        <StatCard label="Satın Alma" value={data.purchases} color="#81c784" sub="Başarılı" />
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        <div style={{ flex: 1, minWidth: 300 }}>
          <BarChart data={funnelData} label="Dönüşüm Hunisi" color="#ffa726" height={160} />
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={S.glassCard}>
            <div style={S.chartLabel}>Premium Büyüme</div>
            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <StatCard label="Son 7 gün" value={data.new_premium_7d} color="#7cf7d8" />
              <StatCard label="Son 30 gün" value={data.new_premium_30d} color="#cbbcff" />
            </div>
          </div>
        </div>
      </div>

      {data.failed_purchases > 0 && (
        <div style={{ ...S.glassCard, marginTop: 16, borderColor: "rgba(255,59,59,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#ff6b6b", fontWeight: 800 }}>⚠</span>
            <span style={{ fontWeight: 700 }}>Başarısız Satın Alma: {data.failed_purchases}</span>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════
   6. SECURITY CENTER
   ═══════════════════════════════════════════════ */

function SecuritySection() {
  const [summary, setSummary] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [pg, setPg] = useState(0);
  const [loading, setLoading] = useState(false);
  const PER = 30;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sR, aR] = await Promise.all([
        fetch(`${API}/admin/security/summary`, { headers: hdrs() }),
        fetch(`${API}/admin/security/audit-log?limit=${PER}&offset=${pg * PER}`, { headers: hdrs() }),
      ]);
      setSummary(await sR.json());
      const ad = await aR.json();
      setAuditLog(ad.items || []); setAuditTotal(ad.total || 0);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [pg]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={S.secTitle}>Güvenlik Özeti (24s)</div>
        <button onClick={load} style={S.btnPrimary}>↻</button>
      </div>

      {summary && (
        <div style={S.grid3}>
          <StatCard label="Admin İşlem" value={summary.admin_actions_24h} color="#cbbcff" icon="⬡" />
          <StatCard label="Başarısız Giriş" value={summary.failed_logins_24h} color={summary.failed_logins_24h > 5 ? "#ff6b6b" : "#7cf7d8"} icon="⚠" />
          <StatCard label="Şüpheli Aktivite" value={summary.suspicious_24h} color={summary.suspicious_24h > 0 ? "#ff6b6b" : "#7cf7d8"} icon="🛡" />
        </div>
      )}

      {summary?.failed_logins_24h > 10 && (
        <div style={{ ...S.glassCard, borderColor: "rgba(255,59,59,0.3)", marginTop: 12, marginBottom: 12 }}>
          <span style={{ color: "#ff6b6b", fontWeight: 800 }}>🚨 Yüksek başarısız giriş sayısı tespit edildi. Olası brute-force saldırısı.</span>
        </div>
      )}

      <div style={{ ...S.secTitle, marginTop: 24 }}>Audit Log</div>
      {loading ? <Loading /> : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Admin</th><th style={S.th}>Action</th><th style={S.th}>Target</th><th style={S.th}>Tarih</th>
            </tr></thead>
            <tbody>
              {auditLog.map((a) => (
                <tr key={a.id}>
                  <td style={S.td}>{a.admin_email}</td>
                  <td style={S.td}><Badge text={a.action} /></td>
                  <td style={S.td}>{a.target_type ? `${a.target_type}#${a.target_id}` : "—"}</td>
                  <td style={S.tdMuted}>{fmtD(a.created_at)}</td>
                </tr>
              ))}
              {!auditLog.length && <tr><td colSpan={4} style={S.td}>Henüz kayıt yok.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      <Pager page={pg} setPage={setPg} total={auditTotal} per={PER} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   7. SANRI INSIGHT CENTER
   ═══════════════════════════════════════════════ */

function InsightSection({ dashData }) {
  const insights = useMemo(() => {
    if (!dashData) return [];
    const u = dashData.users || {};
    const ev = dashData.events || {};
    const yk = dashData.yanki || {};
    const out = [];

    out.push({
      title: "Bugünün Özeti",
      icon: "◉",
      color: "#7cf7d8",
      lines: [
        `Toplam ${u.total} kullanıcıdan ${u.active_24h} tanesi son 24 saatte aktif.`,
        `Bugün ${ev.last_24h} event oluştu, ${u.new_24h} yeni kayıt geldi.`,
        u.premium > 0 ? `Premium kullanıcı oranı: %${Math.round((u.premium / Math.max(u.total, 1)) * 100)}.` : "Henüz premium kullanıcı yok.",
      ],
    });

    if (yk.pending > 0) {
      out.push({
        title: "Moderasyon Uyarısı",
        icon: "⏳",
        color: "#ffa726",
        lines: [
          `${yk.pending} adet gönderi onay bekliyor.`,
          "Topluluk güvenini korumak için düzenli moderasyon kritik.",
        ],
      });
    }

    const convRate = ev.vip_clicks > 0 ? Math.round((ev.vip_unlocks / ev.vip_clicks) * 100) : 0;
    if (ev.vip_clicks > 0) {
      out.push({
        title: convRate < 20 ? "Düşük Dönüşüm Uyarısı" : "Dönüşüm Analizi",
        icon: convRate < 20 ? "⚠" : "◇",
        color: convRate < 20 ? "#ff6b6b" : "#7cf7d8",
        lines: [
          `VIP tıklama → açılma dönüşümü: %${convRate}.`,
          convRate < 20
            ? "Paywall metni veya fiyatlandırma gözden geçirilmeli. Kullanıcılar tıklıyor ama satın almıyor."
            : "Dönüşüm oranı sağlıklı görünüyor.",
        ],
      });
    }

    const topAction = ev.top_actions?.[0];
    const topDomain = ev.top_domains?.[0];
    if (topAction || topDomain) {
      out.push({
        title: "Kullanım Trendleri",
        icon: "⟡",
        color: "#cbbcff",
        lines: [
          topAction ? `En çok kullanılan action: "${topAction.name}" (${topAction.count} kez).` : "",
          topDomain ? `En aktif alan: "${topDomain.name}" (${topDomain.count} event).` : "",
          "Bu alanlara odaklanarak kullanıcı deneyimi iyileştirilebilir.",
        ].filter(Boolean),
      });
    }

    out.push({
      title: "Önerilen Geliştirmeler",
      icon: "✦",
      color: "#81c784",
      lines: [
        u.verified < u.total * 0.5 ? "Kullanıcıların çoğu email doğrulaması yapmamış. Onboarding akışını güçlendirin." : "",
        ev.last_24h < 10 ? "Günlük event sayısı düşük. Push notification veya engagement stratejisi değerlendirilmeli." : "",
        yk.published > 0 ? `Yayında ${yk.published} içerik var. En çok yankı alan içerikleri öne çıkarın.` : "Yankı Alanı'na ilk içerikleri ekleyerek topluluğu canlandırın.",
        "Sanrı Code/Decode modlarında günlük ücretsiz kullanımı artırarak dönüşümü test edin.",
      ].filter(Boolean),
    });

    return out;
  }, [dashData]);

  if (!dashData) return <Empty text="Insight Center'ı görmek için önce Dashboard verisi yüklenmelidir." />;

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div style={S.secTitle}>Sanrı Insight Center</div>
        <div style={{ opacity: 0.5, fontSize: 13 }}>Panel verilerine dayalı otomatik içgörüler</div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {insights.map((ins, i) => (
          <div key={i} style={{ ...S.glassCard, borderColor: `${ins.color}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 20 }}>{ins.icon}</span>
              <span style={{ fontWeight: 900, fontSize: 16, color: ins.color }}>{ins.title}</span>
            </div>
            {ins.lines.map((line, j) => (
              <div key={j} style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 14, paddingLeft: 30 }}>
                {line}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ ...S.glassCard, marginTop: 20, borderColor: "rgba(203,188,255,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>◈</span>
          <span style={{ fontWeight: 800, color: "#cbbcff" }}>Gelecek Sürüm</span>
        </div>
        <div style={{ opacity: 0.6, marginTop: 8, fontSize: 13, lineHeight: 1.6, paddingLeft: 26 }}>
          Insight Center ilerleyen sürümlerde gerçek AI modeli ile beslenecek.
          Dashboard verileri, kullanıcı davranışları ve trend analizleri otomatik
          olarak yorumlanarak aksiyon önerileri sunulacak.
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authOk, setAuthOk] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [dashLoad, setDashLoad] = useState(false);
  const [sideOpen, setSideOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("sanri_token");
      if (!token) { navigate("/giris"); return; }
      try {
        const r = await fetch(`${API}/auth/me`, { headers: hdrs() });
        if (!r.ok) throw new Error();
        const d = await r.json();
        if (d.role !== "admin") { navigate("/"); return; }
        setUser(d);
        setAuthOk(true);
        loadDash();
      } catch { navigate("/giris"); }
    })();
  }, []);

  const loadDash = async () => {
    setDashLoad(true);
    try {
      const r = await fetch(`${API}/admin/dashboard`, { headers: hdrs() });
      if (r.ok) setDashData(await r.json());
    } catch { /* silent */ } finally { setDashLoad(false); }
  };

  if (!authOk) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⬡</div>
          <div style={{ opacity: 0.6 }}>Yetki doğrulanıyor...</div>
        </div>
      </div>
    );
  }

  const curTab = TABS.find((t) => t.key === tab);

  return (
    <div style={S.page}>
      {/* Mobile toggle */}
      <button className="sct-mobile-toggle" onClick={() => setSideOpen((o) => !o)} style={S.mobileToggle}>
        {sideOpen ? "✕" : "☰"}
      </button>

      {/* SIDEBAR */}
      <aside className={`sct-sidebar${sideOpen ? "" : " sct-sidebar-hidden"}`} style={{ ...S.sidebar, ...(sideOpen ? {} : S.sidebarHidden) }}>
        <div style={S.sideHead}>
          <div style={S.logo}>SANRI</div>
          <div style={S.logoSub}>Control Tower</div>
        </div>

        <nav style={S.nav}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); if (window.innerWidth <= 768) setSideOpen(false); }}
              style={{
                ...S.navBtn,
                background: tab === t.key ? "rgba(124,247,216,0.10)" : "transparent",
                borderColor: tab === t.key ? "rgba(124,247,216,0.25)" : "transparent",
                color: tab === t.key ? "#7cf7d8" : "rgba(255,255,255,0.55)",
              }}
            >
              <span style={{ fontSize: 15, width: 22, textAlign: "center" }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div style={S.sideFoot}>
          <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 6, wordBreak: "break-all" }}>{user?.email}</div>
          <Badge text="ADMIN" color="#ff6b6b" bg="rgba(255,59,59,0.15)" />
          <button onClick={() => navigate("/")} style={{ ...S.btnSm, marginTop: 14, width: "100%", textAlign: "center" }}>← Ana Sayfa</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        <header className="sct-topbar" style={S.topbar}>
          <div>
            <h1 style={S.pageTitle}>{curTab?.icon} {curTab?.label}</h1>
            <div style={{ fontSize: 12, opacity: 0.35, marginTop: 2 }}>Sanri Control Tower</div>
          </div>
        </header>

        <div className="sct-content" style={S.content}>
          {tab === "dashboard" && <DashboardSection data={dashData} loading={dashLoad} onRefresh={loadDash} />}
          {tab === "users" && <UsersSection />}
          {tab === "moderation" && <ModerationSection />}
          {tab === "analytics" && <AnalyticsSection />}
          {tab === "membership" && <MembershipSection />}
          {tab === "security" && <SecuritySection />}
          {tab === "insight" && <InsightSection dashData={dashData} />}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════ */

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(145deg, #07080d 0%, #0a0c14 40%, #060810 100%)",
    color: "rgba(255,255,255,0.92)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
  },

  // Mobile toggle
  mobileToggle: {
    position: "fixed",
    top: 12,
    left: 12,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,12,18,0.9)",
    color: "#7cf7d8",
    fontSize: 18,
    cursor: "pointer",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(12px)",
  },

  // Sidebar
  sidebar: {
    width: 230,
    minHeight: "100vh",
    background: "rgba(8,10,16,0.97)",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    height: "100vh",
    backdropFilter: "blur(24px)",
    transition: "transform 0.25s ease",
    zIndex: 100,
  },
  sidebarHidden: {
    transform: "translateX(-100%)",
    position: "fixed",
    left: 0,
    top: 0,
  },
  sideHead: {
    padding: "22px 18px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  logo: {
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: "0.22em",
    background: "linear-gradient(135deg, #7cf7d8, #cbbcff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoSub: {
    fontSize: 10,
    opacity: 0.4,
    letterSpacing: "0.15em",
    marginTop: 4,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  nav: { flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
    textAlign: "left",
    transition: "all 0.15s",
    background: "transparent",
  },
  sideFoot: {
    padding: "14px 18px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },

  // Main
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: {
    padding: "18px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(8,10,16,0.6)",
    backdropFilter: "blur(14px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  pageTitle: { fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: "0.02em" },
  content: { flex: 1, padding: "20px 24px 60px", overflowY: "auto" },

  // Grids
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10, marginBottom: 8 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10, marginBottom: 8 },
  grid5: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10, marginBottom: 8 },
  grid6: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: 10, marginBottom: 8 },

  // Stat card
  statCard: {
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(8px)",
  },
  statLabel: { fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginBottom: 6 },
  statValue: { fontSize: 24, fontWeight: 900, lineHeight: 1.1 },
  statSub: { fontSize: 11, opacity: 0.45, marginTop: 4 },

  // Section
  secTitle: { fontWeight: 900, fontSize: 13, letterSpacing: "0.1em", color: "#7cf7d8", margin: "16px 0 10px", textTransform: "uppercase" },

  // Glass card
  glassCard: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.025)",
    backdropFilter: "blur(8px)",
  },

  // Chart
  chartCard: {
    flex: 1,
    minWidth: 260,
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.025)",
  },
  chartLabel: { fontWeight: 800, fontSize: 12, opacity: 0.55, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 },

  // Table
  tableWrap: { overflowX: "auto", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.4, borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" },
  td: { padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "top" },
  tdMuted: { padding: "9px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: 0.4, fontSize: 12, whiteSpace: "nowrap" },

  // Inputs
  input: { padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.2)", color: "rgba(255,255,255,0.9)", outline: "none", fontSize: 13 },
  select: { padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.9)", outline: "none", fontSize: 13, cursor: "pointer" },
  selectSm: { padding: "5px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)", color: "rgba(255,255,255,0.9)", fontSize: 11, cursor: "pointer" },

  // Buttons
  btnPrimary: { padding: "9px 16px", borderRadius: 10, border: "1px solid rgba(124,247,216,0.25)", background: "rgba(124,247,216,0.10)", color: "#7cf7d8", cursor: "pointer", fontWeight: 800, fontSize: 13 },
  btnSm: { padding: "7px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 700, fontSize: 12 },

  // Empty
  empty: { padding: 40, textAlign: "center", opacity: 0.4, fontSize: 15 },
};

/* ─── Responsive CSS injection ─── */
if (typeof document !== "undefined") {
  const id = "sanri-ct-responsive";
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      @media (max-width: 768px) {
        .sct-mobile-toggle { display: flex !important; }
        .sct-sidebar { position: fixed !important; left: 0; top: 0; z-index: 999; }
        .sct-sidebar-hidden { transform: translateX(-100%) !important; }
        .sct-content { padding: 16px 12px 60px !important; }
        .sct-topbar { padding: 14px 12px 14px 56px !important; }
      }
    `;
    document.head.appendChild(el);
  }
}
