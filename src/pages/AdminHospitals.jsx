import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { adminApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminHospitals() {
  const { user } = useAdminAuth();
  const { t } = useLanguage();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) window.location.href = "/admin/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await adminApi.hospitals.list();
      setHospitals(data.results || []);
    } catch {
      setError("Couldn't load hospitals.");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      await adminApi.hospitals.approve(id);
      await load();
    } catch {
      setError("Approval failed.");
    }
  }

  async function handleReject(id) {
    const reason = prompt("Rejection reason:");
    if (!reason) return;
    try {
      await adminApi.hospitals.reject(id, reason);
      await load();
    } catch {
      setError("Rejection failed.");
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
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Hospital approvals</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Review and approve facility registrations.</p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : hospitals.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
            <p className="font-body text-sm font-medium text-ink">No hospitals pending review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {hospitals.map((h) => (
              <div key={h.id} className="rounded-3xl bg-white p-6 border border-ink/8 flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-base font-semibold text-ink">{h.facility_name}</p>
                  <p className="font-body text-sm text-ink/65 mt-1">
                    {h.facility_type} · {h.email} · {h.phone}
                  </p>
                  <p className="font-body text-xs text-ink/45 mt-1 capitalize">
                    Status: {h.is_approved ? "Approved" : "Pending"}
                  </p>
                </div>
                {!h.is_approved && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(h.id)}
                      className="font-body text-xs font-semibold px-4 py-2 rounded-full bg-sage text-white hover:bg-sage/90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(h.id)}
                      className="font-body text-xs font-semibold px-4 py-2 rounded-full border border-ruby/25 text-ruby hover:bg-ruby-50"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
