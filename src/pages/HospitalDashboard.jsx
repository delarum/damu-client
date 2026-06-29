import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";
import DonorMap from "../components/DonorMap";

export default function HospitalDashboard() {
  const { user, hospitalProfile, logout, loading: authLoading } = useHospitalAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) return;
    let active = true;
    async function load() {
      try {
        const [p, s] = await Promise.allSettled([
          hospitalApi.getProfile(),
          hospitalApi.subscription.current(),
        ]);
        if (!active) return;
        if (p.status === "fulfilled") setProfile(p.value);
        if (s.status === "fulfilled") setSubscription(s.value);
      } catch {
        if (active) setError("Couldn't load dashboard data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [authLoading, user]);

  async function handleLogout() {
    await logout();
    window.location.href = "/";
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay">
        <p className="font-body text-sm text-ink/50">Loading...</p>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/hospital/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <div className="flex items-center gap-5">
          <Link
            to="/hospital/about"
            className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
          >
            {t("nav.about")}
          </Link>
          <button
            onClick={handleLogout}
            className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">
          {profile?.facility_name || "Hospital Dashboard"}
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10">
          Manage donors, staff, and subscriptions from one place.
        </p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <section className="mb-10">
          <DonorMap height="65vh" />
        </section>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <DashCard title="Search donors" href="/hospital/search" label="Find matches ->" />
          <DashCard title="Contact requests" href="/hospital/requests" label="Review requests ->" />
          <DashCard title="Staff management" href="/hospital/staff" label="Manage team ->" />
          <DashCard title="Subscription" href="/hospital/subscription" label="View plan ->" />
          <DashCard title="Facility profile" href="/hospital/profile" label="Edit details ->" />
        </div>

        <section>
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Subscription status</h2>
          <div className="rounded-3xl bg-white p-6 border border-ink/8">
            {subscription ? (
              <div>
                <p className="font-body text-sm font-medium text-ink capitalize">
                  {subscription.tier || "—"} · {subscription.status || "—"}
                </p>
                {subscription.expires_at && (
                  <p className="font-mono text-xs text-ink/50 mt-1">
                    Expires {subscription.expires_at}
                  </p>
                )}
              </div>
            ) : (
              <p className="font-body text-sm text-ink/50">No active subscription.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function DashCard({ title, href, label }) {
  return (
    <Link
      to={href}
      className="rounded-3xl bg-white p-6 border border-ink/8 hover:border-ruby/25 transition-colors"
    >
      <p className="font-body text-sm font-medium text-ink">{title}</p>
      <p className="font-body text-xs text-ruby-warm mt-2 font-semibold">{label}</p>
    </Link>
  );
}