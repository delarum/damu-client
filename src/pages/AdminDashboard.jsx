import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { adminApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminDashboard() {
  const { user, logout } = useAdminAuth();
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) window.location.href = "/admin/login";
    else loadMetrics();
  }, [user]);

  async function loadMetrics() {
    setLoading(true);
    try {
      const data = await adminApi.metrics();
      setMetrics(data);
    } catch {
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <span className="font-display text-lg tracking-tight text-cream">DamuLink Admin</span>
        <button onClick={handleLogout} className="font-body text-sm text-cream/60 hover:text-cream">
          Log out
        </button>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Admin dashboard</h1>
        <p className="font-body text-sm text-ink/55 mb-10">Platform overview and management.</p>

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading metrics...</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <StatCard label="Total donors" value={metrics?.total_donors ?? "—"} />
            <StatCard label="Hospitals" value={metrics?.total_hospitals ?? "—"} />
            <StatCard label="Active subscriptions" value={metrics?.active_subscriptions ?? "—"} />
            <StatCard label="Pending reviews" value={metrics?.pending_reviews ?? "—"} />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <DashLink title="Hospital approvals" href="/admin/hospitals" />
          <DashLink title="Audit logs" href="/admin/audit-logs" />
          <DashLink title="User management" href="/admin/users" />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 border border-ink/8">
      <p className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl text-ruby mt-3">{value}</p>
    </div>
  );
}

function DashLink({ title, href }) {
  return (
    <Link
      to={href}
      className="rounded-3xl bg-white p-6 border border-ink/8 hover:border-ruby/25 transition-colors"
    >
      <p className="font-body text-sm font-medium text-ink">{title}</p>
      <p className="font-body text-xs text-ruby-warm mt-2 font-semibold">{'Open ->'}</p>
    </Link>
  );
}
