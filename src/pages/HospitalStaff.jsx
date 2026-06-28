import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalStaff() {
  const { user } = useHospitalAuth();
  const { t } = useLanguage();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [newStaff, setNewStaff] = useState({ name: "", email: "", title: "" });

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
    else loadStaff();
  }, [user]);

  async function loadStaff() {
    setLoading(true);
    try {
      const data = await hospitalApi.staff.list();
      setStaff(data.results || []);
    } catch {
      setError("Couldn't load staff.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true);
    try {
      await hospitalApi.staff.add(newStaff);
      setNewStaff({ name: "", email: "", title: "" });
      await loadStaff();
    } catch {
      setError("Failed to add staff member.");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(id) {
    if (!confirm("Remove this staff member?")) return;
    try {
      await hospitalApi.staff.remove(id);
      await loadStaff();
    } catch {
      setError("Failed to remove staff member.");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/hospital/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <Link to="/hospital/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Staff management</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Add or remove authorized users for your facility.</p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <form onSubmit={handleAdd} className="rounded-3xl bg-white p-6 border border-ink/8 mb-8">
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Add staff member</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Name</span>
              <input
                required
                value={newStaff.name}
                onChange={(e) => setNewStaff((s) => ({ ...s, name: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Email</span>
              <input
                type="email"
                required
                value={newStaff.email}
                onChange={(e) => setNewStaff((s) => ({ ...s, email: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Title</span>
              <input
                required
                value={newStaff.title}
                onChange={(e) => setNewStaff((s) => ({ ...s, title: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="mt-4 font-body text-sm font-semibold px-6 py-3 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add member"}
          </button>
        </form>

        <section>
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Current staff</h2>
          {loading ? (
            <p className="font-body text-sm text-ink/50">Loading...</p>
          ) : staff.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
              <p className="font-body text-sm font-medium text-ink">No staff added yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {staff.map((s) => (
                <div key={s.id} className="rounded-3xl bg-white p-5 border border-ink/8 flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-semibold text-ink">{s.name}</p>
                    <p className="font-body text-xs text-ink/55 mt-0.5">{s.title} · {s.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="font-body text-xs text-ruby-warm hover:text-ruby"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
