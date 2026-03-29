import React, { useEffect, useState } from "react";

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/overview`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>Sanrı Admin Panel</h2>
      <p>Total Users: {stats.total_users}</p>
      <p>Premium Users: {stats.premium_users}</p>
      <p>Today Registrations: {stats.today_users}</p>
    </div>
  );
}
