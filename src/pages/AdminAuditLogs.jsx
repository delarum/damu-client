import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { adminApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminAuditLogs() {
  const { user } = useAdminAuth();
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) window.location.href = "/admin/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.auditLogs();
      setLogs(data.results || []);
    } catch {
      setError("Couldn't load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/admin/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink Admin
        </Link>
        <Link to="/admin/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Audit logs</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Immutable record of sensitive actions across the platform.</p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : logs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
            <p className="font-body text-sm font-medium text-ink">No logs yet.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white divide-y divide-ink/8 border border-ink/8">
            {logs.map((log) => (
              <div key={log.id || Math.random()} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4 mb-1">
                  <p className="font-body text-sm font-semibold text-ink">{log.action}</p>
                  <span className="font-mono text-xs text-ink/45">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                  </span>
                </div>
                <p className="font-body text-xs text-ink/55">
                  Actor: {log.actor || "—"} · Role: {log.actor_role || "—"} · IP: {log.ip_address || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
