import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || "https://api.asksanri.com";

const getHeaders = () => {
  const t = localStorage.getItem("sanri_token");
  return t
    ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};

const TABS = [
  { key: "dashboard", icon: "◉", label: "Dashboard" },
  { key: "users", icon: "◎", label: "Kullanıcılar" },
  { key: "yanki", icon: "✦", label: "Yankı Moderasyon" },
  { key: "events", icon: "⟡", label: "Event Log" },
  { key: "memories", icon: "◈", label: "Memories" },
];

// ─────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────

function StatCard({ label, value, color = "#7cf7d8", sub }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLabel}>{label}</div>
      <div style={{ ...S.statValue, color }}>{value ?? "—"}</div>
      {sub ? <div style={S.statSub}>{sub}</div> : null}
    </div>
  );
}

// ─────────────────────────────────────
// DASHBOARD TAB
// ─────────────────────────────────────

function DashboardTab({ data, loading }) {
  if (loading) return <div style={S.empty}>Yükleniyor...</div>;
  if (!data) return <div style={S.empty}>Veri yüklenemedi.</div>;

  const u = data.users || {};
  const ev = data.events || {};
  const yk = data.yanki || {};

  return (
    <>
      <div style={S.sectionTitle}>Kullanıcılar</div>
      <div style={S.grid}>
        <StatCard label="Toplam" value={u.total} color="#7cf7d8" />
        <StatCard label="Premium" value={u.premium} color="#cbbcff" />
        <StatCard label="Admin" value={u.admin} color="#ff6b6b" />
        <StatCard label="Doğrulanmış" value={u.verified} color="#7cf7d8" />
        <StatCard label="Son 24 Saat" value={u.new_24h} color="#fff" />
        <StatCard label="Son 7 Gün" value={u.new_7d} color="#cbbcff" />
      </div>

      <div style={S.sectionTitle}>Eventler</div>
      <div style={S.grid}>
        <StatCard label="Toplam Event" value={ev.total} color="#7cf7d8" />
        <StatCard label="Son 24 Saat" value={ev.last_24h} color="#fff" />
        <StatCard label="Son 7 Gün" value={ev.last_7d} color="#cbbcff" />
      </div>

      <div style={S.sectionTitle}>Yankı Alanı</div>
      <div style={S.grid}>
        <StatCard label="Bekleyen" value={yk.pending} color="#ffa726" />
        <StatCard label="Yayında" value={yk.published} color="#7cf7d8" />
        <StatCard label="Reddedilen" value={yk.rejected} color="#ff6b6b" />
      </div>

      <div style={S.sectionTitle}>Memories</div>
      <div style={S.grid}>
        <StatCard label="Toplam Hafıza" value={data.memories?.total} color="#cbbcff" />
      </div>

      {/* Distributions */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
        {ev.top_domains?.length > 0 && (
          <DistList title="Top Domains (7g)" items={ev.top_domains} />
        )}
        {ev.top_actions?.length > 0 && (
          <DistList title="Top Actions (7g)" items={ev.top_actions} />
        )}
      </div>

      {/* Recent Events */}
      {data.recent_events?.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div style={S.sectionTitle}>Son Eventler</div>
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Action</th>
                  <th style={S.th}>Domain</th>
                  <th style={S.th}>User</th>
                  <th style={S.th}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_events.map((e) => (
                  <tr key={e.id}>
                    <td style={S.td}>{e.action}</td>
                    <td style={S.td}>{e.domain || "—"}</td>
                    <td style={S.td}>{e.user_id || "—"}</td>
                    <td style={S.tdMuted}>{fmtDate(e.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function DistList({ title, items }) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div style={S.distCard}>
      <div style={S.distTitle}>{title}</div>
      {items.map((i) => (
        <div key={i.name} style={S.distRow}>
          <div style={S.distLabel}>{i.name}</div>
          <div style={S.distBarWrap}>
            <div
              style={{
                ...S.distBar,
                width: `${Math.max((i.count / max) * 100, 4)}%`,
              }}
            />
          </div>
          <div style={S.distCount}>{i.count}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────
// USERS TAB
// ─────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const PER_PAGE = 30;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(PER_PAGE),
        offset: String(page * PER_PAGE),
      });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);

      const res = await fetch(`${API}/admin/users-list?${params}`, { headers: getHeaders() });
      const d = await res.json();
      setUsers(d.items || []);
      setTotal(d.total || 0);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  const changeRole = async (userId, newRole) => {
    if (!window.confirm(`Rol ${newRole} olarak değiştirilsin mi?`)) return;
    try {
      await fetch(`${API}/admin/set-user-role`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ target_user_id: userId, role: newRole }),
      });
      load();
    } catch (e) {
      alert("Hata: " + e.message);
    }
  };

  const ROLES = ["free", "vip", "admin"];

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Email ara..."
          style={S.input}
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          style={S.select}
        >
          <option value="">Tüm Roller</option>
          <option value="free">Free</option>
          <option value="vip">VIP</option>
          <option value="admin">Admin</option>
        </select>
        <button onClick={load} style={S.btnPrimary} disabled={loading}>
          {loading ? "..." : "Yenile"}
        </button>
      </div>

      <div style={S.statSub}>Toplam: {total} kullanıcı</div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Rol</th>
              <th style={S.th}>Premium</th>
              <th style={S.th}>Verified</th>
              <th style={S.th}>Kayıt</th>
              <th style={S.th}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={S.td}>{u.id}</td>
                <td style={S.td}>{u.email}</td>
                <td style={S.td}>
                  <span style={{
                    ...S.badge,
                    background: u.role === "admin" ? "rgba(255,59,59,0.2)" : u.role === "vip" ? "rgba(124,247,216,0.2)" : "rgba(255,255,255,0.08)",
                    color: u.role === "admin" ? "#ff6b6b" : u.role === "vip" ? "#7cf7d8" : "rgba(255,255,255,0.7)",
                  }}>
                    {u.role}
                  </span>
                </td>
                <td style={S.td}>{u.is_premium ? "✓" : "—"}</td>
                <td style={S.td}>{u.email_verified ? "✓" : "✗"}</td>
                <td style={S.tdMuted}>{fmtDate(u.created_at)}</td>
                <td style={S.td}>
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    style={S.selectSmall}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          style={S.btnSmall}
        >
          ← Önceki
        </button>
        <span style={{ color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>
          Sayfa {page + 1} / {Math.max(1, Math.ceil(total / PER_PAGE))}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={(page + 1) * PER_PAGE >= total}
          style={S.btnSmall}
        >
          Sonraki →
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────
// YANKI TAB
// ─────────────────────────────────────

const YANKI_STATUSES = ["pending_review", "published", "rejected"];

function YankiTab() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/yanki/admin/posts?status=${statusFilter}&limit=50`, { headers: getHeaders() }),
        fetch(`${API}/yanki/admin/stats`, { headers: getHeaders() }),
      ]);
      const pd = await pRes.json();
      const sd = await sRes.json();
      setPosts(pd.items || pd || []);
      setStats(sd);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const review = async (postId, action) => {
    const body = { action };
    const note = notes[postId] || "";
    if (action === "approve" && note) body.sanri_note = note;
    if (action === "reject" && note) body.reject_reason = note;

    try {
      await fetch(`${API}/yanki/admin/posts/${postId}/review`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
      });
      setNotes((n) => ({ ...n, [postId]: "" }));
      load();
    } catch (e) {
      alert("Hata: " + e.message);
    }
  };

  return (
    <>
      {stats && (
        <div style={S.grid}>
          <StatCard label="Bekleyen" value={stats.pending} color="#ffa726" />
          <StatCard label="Yayında" value={stats.published} color="#7cf7d8" />
          <StatCard label="Reddedilen" value={stats.rejected} color="#ff6b6b" />
          <StatCard label="Tepkiler" value={stats.total_reactions} color="#cbbcff" />
          <StatCard label="Raporlar" value={stats.total_reports} color="#ff6b6b" />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
        {YANKI_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              ...S.btnSmall,
              background: statusFilter === s ? "rgba(124,247,216,0.2)" : "rgba(255,255,255,0.06)",
              borderColor: statusFilter === s ? "rgba(124,247,216,0.4)" : "rgba(255,255,255,0.1)",
              color: statusFilter === s ? "#7cf7d8" : "rgba(255,255,255,0.7)",
            }}
          >
            {s === "pending_review" ? "Bekleyen" : s === "published" ? "Yayında" : "Reddedilen"}
          </button>
        ))}
        <button onClick={load} style={S.btnSmall} disabled={loading}>Yenile</button>
      </div>

      {loading ? (
        <div style={S.empty}>Yükleniyor...</div>
      ) : !posts.length ? (
        <div style={S.empty}>Bu filtrede gönderi yok.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {posts.map((p) => (
            <div key={p.id} style={S.card}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div>
                  {p.title && <div style={{ fontWeight: 800, marginBottom: 4 }}>{p.title}</div>}
                  <div style={{ opacity: 0.85, lineHeight: 1.5 }}>
                    {(p.content_raw || p.contentRaw || "").slice(0, 300)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <span style={{ ...S.badge, background: "rgba(203,188,255,0.15)", color: "#cbbcff" }}>
                    {p.category}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.5 }}>
                    {p.author_mode || p.authorMode} • {fmtDate(p.created_at || p.createdAt)}
                  </span>
                  {(p.report_count > 0) && (
                    <span style={{ fontSize: 11, color: "#ff6b6b" }}>🚩 {p.report_count} rapor</span>
                  )}
                </div>
              </div>

              {statusFilter === "pending_review" && (
                <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    value={notes[p.id] || ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [p.id]: e.target.value }))}
                    placeholder="Not ekle (Sanrı Notu / Red sebebi)..."
                    style={{ ...S.input, flex: 1, minWidth: 200 }}
                  />
                  <button
                    onClick={() => review(p.id, "approve")}
                    style={{ ...S.btnSmall, background: "rgba(124,247,216,0.2)", borderColor: "rgba(124,247,216,0.4)", color: "#7cf7d8" }}
                  >
                    ✓ Onayla
                  </button>
                  <button
                    onClick={() => review(p.id, "reject")}
                    style={{ ...S.btnSmall, background: "rgba(255,59,59,0.15)", borderColor: "rgba(255,59,59,0.3)", color: "#ff6b6b" }}
                  >
                    ✗ Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────
// EVENTS TAB
// ─────────────────────────────────────

function EventsTab() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [domain, setDomain] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const PER = 40;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ limit: String(PER), offset: String(page * PER) });
      if (domain) p.set("domain", domain);
      if (action) p.set("action", action);
      const res = await fetch(`${API}/admin/events-list?${p}`, { headers: getHeaders() });
      const d = await res.json();
      setEvents(d.items || []);
      setTotal(d.total || 0);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [page, domain, action]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={domain}
          onChange={(e) => { setDomain(e.target.value); setPage(0); }}
          placeholder="Domain filtrele..."
          style={{ ...S.input, maxWidth: 200 }}
        />
        <input
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(0); }}
          placeholder="Action filtrele..."
          style={{ ...S.input, maxWidth: 200 }}
        />
        <button onClick={load} style={S.btnPrimary} disabled={loading}>
          {loading ? "..." : "Yenile"}
        </button>
      </div>

      <div style={S.statSub}>Toplam: {total} event</div>

      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Action</th>
              <th style={S.th}>Domain</th>
              <th style={S.th}>User ID</th>
              <th style={S.th}>Meta</th>
              <th style={S.th}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td style={S.td}>
                  <span style={{ ...S.badge, background: "rgba(124,247,216,0.12)", color: "#7cf7d8" }}>
                    {e.action}
                  </span>
                </td>
                <td style={S.td}>{e.domain || "—"}</td>
                <td style={S.td}>{e.user_id || "—"}</td>
                <td style={S.tdMeta}>
                  {e.meta ? JSON.stringify(e.meta).slice(0, 80) : "—"}
                </td>
                <td style={S.tdMuted}>{fmtDate(e.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={S.btnSmall}>
          ← Önceki
        </button>
        <span style={{ color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>
          Sayfa {page + 1} / {Math.max(1, Math.ceil(total / PER))}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * PER >= total} style={S.btnSmall}>
          Sonraki →
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────
// MEMORIES TAB
// ─────────────────────────────────────

function MemoriesTab() {
  const [memories, setMemories] = useState([]);
  const [total, setTotal] = useState(0);
  const [memType, setMemType] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const PER = 30;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ limit: String(PER), offset: String(page * PER) });
      if (memType) p.set("mem_type", memType);
      const res = await fetch(`${API}/admin/memories-list?${p}`, { headers: getHeaders() });
      const d = await res.json();
      setMemories(d.items || []);
      setTotal(d.total || 0);
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  }, [page, memType]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          value={memType}
          onChange={(e) => { setMemType(e.target.value); setPage(0); }}
          placeholder="Tip filtrele..."
          style={{ ...S.input, maxWidth: 200 }}
        />
        <button onClick={load} style={S.btnPrimary} disabled={loading}>
          {loading ? "..." : "Yenile"}
        </button>
      </div>

      <div style={S.statSub}>Toplam: {total} hafıza kaydı</div>

      <div style={{ display: "grid", gap: 10 }}>
        {memories.map((m) => (
          <div
            key={m.id}
            style={S.card}
            onClick={() => setExpanded((x) => ({ ...x, [m.id]: !x[m.id] }))}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ ...S.badge, background: "rgba(203,188,255,0.15)", color: "#cbbcff" }}>{m.type}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>User #{m.user_id}</span>
              </div>
              <span style={{ opacity: 0.5, fontSize: 12 }}>{fmtDate(m.created_at)}</span>
            </div>
            {m.context && <div style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>Bağlam: {m.context}</div>}
            <div style={{ marginTop: 8, opacity: 0.85, fontSize: 14 }}>
              <strong>Input:</strong> {expanded[m.id] ? m.input_text : (m.input_text || "").slice(0, 120) + ((m.input_text || "").length > 120 ? "..." : "")}
            </div>
            {m.output_text && (
              <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 6 }}>
                <strong>Output:</strong> {expanded[m.id] ? m.output_text : (m.output_text || "").slice(0, 150) + ((m.output_text || "").length > 150 ? "..." : "")}
              </div>
            )}
            {!expanded[m.id] && <div style={{ marginTop: 4, fontSize: 11, opacity: 0.4 }}>Tıkla → genişlet</div>}
          </div>
        ))}
        {!memories.length && !loading && <div style={S.empty}>Kayıt bulunamadı.</div>}
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
        <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={S.btnSmall}>
          ← Önceki
        </button>
        <span style={{ color: "rgba(255,255,255,0.6)", alignSelf: "center" }}>
          Sayfa {page + 1} / {Math.max(1, Math.ceil(total / PER))}
        </span>
        <button onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * PER >= total} style={S.btnSmall}>
          Sonraki →
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────
// HELPERS
// ─────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

// ─────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dashData, setDashData] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const token = localStorage.getItem("sanri_token");
    if (!token) {
      navigate("/giris");
      return;
    }
    try {
      const res = await fetch(`${API}/auth/me`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      if (data.role !== "admin") {
        navigate("/");
        return;
      }
      setUser(data);
      setAuthLoading(false);
      loadDashboard();
    } catch {
      navigate("/giris");
    }
  };

  const loadDashboard = async () => {
    setDashLoading(true);
    try {
      const res = await fetch(`${API}/admin/dashboard`, { headers: getHeaders() });
      if (res.ok) {
        const d = await res.json();
        setDashData(d);
      }
    } catch {
      // silent
    } finally {
      setDashLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>Yetki kontrol ediliyor...</div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHeader}>
          <div style={S.logo}>SANRI</div>
          <div style={S.logoSub}>Admin Panel</div>
        </div>

        <nav style={S.nav}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                ...S.navBtn,
                background: tab === t.key ? "rgba(124,247,216,0.12)" : "transparent",
                borderColor: tab === t.key ? "rgba(124,247,216,0.3)" : "transparent",
                color: tab === t.key ? "#7cf7d8" : "rgba(255,255,255,0.65)",
              }}
            >
              <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>{user?.email}</div>
          <span style={{ ...S.badge, background: "rgba(255,59,59,0.2)", color: "#ff6b6b" }}>ADMIN</span>
          <button
            onClick={() => navigate("/")}
            style={{ ...S.btnSmall, marginTop: 12, width: "100%" }}
          >
            ← Ana Sayfa
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={S.main}>
        <div style={S.topbar}>
          <h1 style={S.pageTitle}>
            {TABS.find((t) => t.key === tab)?.icon}{" "}
            {TABS.find((t) => t.key === tab)?.label}
          </h1>
          {tab === "dashboard" && (
            <button onClick={loadDashboard} style={S.btnPrimary} disabled={dashLoading}>
              {dashLoading ? "..." : "↻ Yenile"}
            </button>
          )}
        </div>

        <div style={S.content}>
          {tab === "dashboard" && <DashboardTab data={dashData} loading={dashLoading} />}
          {tab === "users" && <UsersTab />}
          {tab === "yanki" && <YankiTab />}
          {tab === "events" && <EventsTab />}
          {tab === "memories" && <MemoriesTab />}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────
// STYLES
// ─────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #07080d 0%, #0b0d14 50%, #06070b 100%)",
    color: "rgba(255,255,255,0.92)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  // Sidebar
  sidebar: {
    width: 240,
    minHeight: "100vh",
    background: "rgba(10,12,18,0.95)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    backdropFilter: "blur(20px)",
  },
  sidebarHeader: {
    padding: "24px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  logo: {
    fontWeight: 900,
    fontSize: 20,
    letterSpacing: "0.2em",
    background: "linear-gradient(135deg, #7cf7d8, #cbbcff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoSub: {
    fontSize: 11,
    opacity: 0.5,
    letterSpacing: "0.12em",
    marginTop: 4,
    textTransform: "uppercase",
  },
  nav: {
    flex: 1,
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  navBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    textAlign: "left",
    transition: "all 0.15s",
  },
  sidebarFooter: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  // Main
  main: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    padding: "20px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,12,18,0.5)",
    backdropFilter: "blur(12px)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 900,
    margin: 0,
  },
  content: {
    flex: 1,
    padding: "24px 28px 60px",
    overflowY: "auto",
  },

  // Grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 8,
  },

  // Stat Card
  statCard: {
    padding: "16px 18px",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    opacity: 0.55,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 900,
  },
  statSub: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 8,
  },

  // Section
  sectionTitle: {
    fontWeight: 900,
    fontSize: 15,
    letterSpacing: "0.08em",
    color: "#7cf7d8",
    margin: "20px 0 10px",
    textTransform: "uppercase",
  },

  // Card
  card: {
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    cursor: "pointer",
  },

  // Table
  tableWrap: {
    overflowX: "auto",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.02)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  th: {
    textAlign: "left",
    padding: "12px 14px",
    fontWeight: 800,
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    opacity: 0.55,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    verticalAlign: "top",
  },
  tdMuted: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    opacity: 0.5,
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  tdMeta: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    opacity: 0.6,
    fontSize: 12,
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // Inputs
  input: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.2)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 14,
    minWidth: 180,
  },
  select: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.3)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 14,
    cursor: "pointer",
  },
  selectSmall: {
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.3)",
    color: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 12,
    cursor: "pointer",
  },

  // Buttons
  btnPrimary: {
    padding: "10px 18px",
    borderRadius: 12,
    border: "1px solid rgba(124,247,216,0.3)",
    background: "rgba(124,247,216,0.12)",
    color: "#7cf7d8",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 14,
  },
  btnSmall: {
    padding: "8px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },

  // Badge
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },

  // Distribution
  distCard: {
    flex: 1,
    minWidth: 280,
    padding: 16,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
  },
  distTitle: {
    fontWeight: 800,
    fontSize: 13,
    marginBottom: 12,
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  distRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  distLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: 600,
    opacity: 0.8,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  distBarWrap: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    background: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  distBar: {
    height: "100%",
    borderRadius: 3,
    background: "linear-gradient(90deg, #7cf7d8, #cbbcff)",
    transition: "width 0.3s",
  },
  distCount: {
    width: 40,
    textAlign: "right",
    fontSize: 13,
    fontWeight: 800,
    color: "#cbbcff",
  },

  // Empty
  empty: {
    padding: 40,
    textAlign: "center",
    opacity: 0.5,
    fontSize: 16,
  },
};
