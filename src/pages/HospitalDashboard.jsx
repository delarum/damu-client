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
      {/* Accent header */}
      <header className="relative bg-ruby-night overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, #FFFBF5 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, #FFFBF5 0%, transparent 40%)`,
          }}
        />
        <div className="relative flex items-center justify-between px-6 md:px-14 py-6">
          <Link to="/" className="font-display text-xl tracking-tight text-cream">
            {t("common.brand")}
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/hospital/about"
              className="font-body text-sm text-cream/55 hover:text-cream px-3 py-2 rounded-full hover:bg-cream/5 transition-colors"
            >
              {t("nav.about")}
            </Link>
            <button
              onClick={handleLogout}
              className="font-body text-sm text-cream/55 hover:text-cream px-3 py-2 rounded-full hover:bg-cream/5 transition-colors"
            >
              {t("common.logout")}
            </button>
          </nav>
        </div>
      </header>

      <main className="px-6 md:px-14 pt-10 pb-20 max-w-5xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-7 bg-mist rounded-full" />
            <h1 className="font-display font-medium text-[2.1rem] leading-tight text-ink">
              {profile?.facility_name || t("hospital.dashboard.title")}
            </h1>
          </div>
          <p className="font-body text-sm text-ink/55 max-w-lg leading-relaxed pl-5">
            {t("hospital.dashboard.body")}
          </p>
        </div>

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