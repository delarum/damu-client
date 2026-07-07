import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { adminApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminUsers() {
  const { user } = useAdminAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) window.location.href = "/admin/login";
    else load();
  }, [user, filter]);

  async function load() {
    setLoading(true);
    try {
      const params = filter !== "all" ? { role: filter } : {};
      const data = await adminApi.users.list(params);
      setUsers(data.results || []);
    } catch {
      setError("Couldn't load users.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(id) {
    const email = prompt("Enter user's email to send password reset link:");
    if (!email) return;
    try {
      await adminApi.users.resetPassword(id, { email });
      alert("Password reset link sent to " + email);
    } catch {
      setError("Failed to send password reset.");
    }
  }

  async function handleToggleActive(id, currentStatus) {
    const action = currentStatus ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      await adminApi.users.update(id, { is_active: !currentStatus });
      await load();
    } catch {
      setError(`Failed to ${action} user.`);
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

      <main className="px-6 md:px-12 py-10 max-w-6xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">User management</h1>
        <p className="font-body text-sm text-ink/55 mb-6">View and manage all platform users.</p>

        <div className="flex gap-2 mb-6">
          {["all", "donor", "hospital_admin", "superadmin"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`font-body text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                filter === role
                  ? "bg-ruby text-cream"
                  : "bg-white text-ink border border-ink/15 hover:border-ruby/25"
              }`}
            >
              {role === "all" ? "All" : role.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
            <p className="font-body text-sm font-medium text-ink">No users found.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white divide-y divide-ink/8 border border-ink/8">
            {users.map((u) => (
              <div key={u.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-ink">{u.email}</p>
                  <p className="font-body text-xs text-ink/55 mt-1">
                    {u.full_name || "No name"} · {u.role || "user"} · {u.phone || "No phone"}
                  </p>
                  <p className="font-mono text-xs text-ink/40 mt-1">
                    ID: {u.id} · Created: {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResetPassword(u.id)}
                    className="font-body text-xs font-semibold px-3 py-1.5 rounded-full border border-ink/15 text-ink hover:bg-ink/5"
                  >
                    Reset PW
                  </button>
                  <button
                    onClick={() => handleToggleActive(u.id, u.is_active)}
                    className={`font-body text-xs font-semibold px-3 py-1.5 rounded-full ${
                      u.is_active
                        ? "border border-ruby/25 text-ruby hover:bg-ruby-50"
                        : "bg-sage text-white hover:bg-sage/90"
                    }`}
                  >
                    {u.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}