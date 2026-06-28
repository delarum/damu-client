import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { creditsApi, gamificationApi, donorApi, matchingApi } from "../lib/api";
import { useCountUp } from "../lib/useCountUp";
import { useLanguage } from "../lib/LanguageContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, donorProfile, logout, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!authLoading && user && !donorProfile) {
      navigate("/profile-setup", { replace: true });
    }
  }, [authLoading, user, donorProfile, navigate]);

  const [credits, setCredits] = useState(null);
  const [badgeCount, setBadgeCount] = useState(0);
  const [latestBadge, setLatestBadge] = useState(null);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [availability, setAvailability] = useState(donorProfile?.availability_status ?? true);
  const [loading, setLoading] = useState(true);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [creditsRes, badgesRes, requestsRes] = await Promise.allSettled([
          creditsApi.balance(),
          gamificationApi.badges(),
          matchingApi.myContactRequests(),
        ]);
        if (!active) return;
        if (creditsRes.status === "fulfilled") setCredits(creditsRes.value);
        if (badgesRes.status === "fulfilled") {
          const results = badgesRes.value.results || [];
          setBadgeCount(results.length);
          setLatestBadge(results[0]?.badge ?? null);
        }
        if (requestsRes.status === "fulfilled") {
          const pending = (requestsRes.value.results || []).filter((r) => r.status === "pending");
          setPendingRequestCount(pending.length);
        }
      } catch {
        if (active) setError(t("dashboard.loadError"));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const creditValue = useCountUp(credits?.credits ?? 0);

  async function toggleAvailability() {
    const next = !availability;
    setAvailability(next);
    setSavingAvailability(true);
    try {
      await donorApi.setAvailability({ availability_status: next });
    } catch {
      setAvailability(!next); // revert on failure
    } finally {
      setSavingAvailability(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const firstName = (user?.full_name || donorProfile?.full_name || "").split(" ")[0];

  const accountLinks = [
    { to: "/profile", label: t("nav.profile") },
    { to: "/donations", label: t("nav.donations") },
    { to: "/verification", label: t("nav.verification") },
    { to: "/third-party/apply", label: t("nav.thirdParty") },
  ];

  return (
    <div className="min-h-screen bg-clay">
      {/* Dark header — carries the brand across from onboarding */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <button
          onClick={handleLogout}
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          {t("common.logout")}
        </button>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <h1 className="font-display font-medium text-3xl text-ink mb-1">
          {firstName ? t("dashboard.welcomeNamed", { name: firstName }) : t("dashboard.welcome")}
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10">
          {t("dashboard.bloodTypeCopy", {
            bloodType: donorProfile?.blood_type
              ? t("dashboard.bloodTypeValue", { bloodType: donorProfile.blood_type })
              : "",
          })}
        </p>

        {pendingRequestCount > 0 && (
          <Link
            to="/requests"
            className="flex items-center justify-between gap-4 rounded-2xl bg-clementine-soft border border-clementine/25 px-5 py-4 mb-8 hover:border-clementine/50 transition-colors"
          >
            <div>
              <p className="font-body text-sm font-semibold text-ink">
                {pendingRequestCount === 1
                  ? t("dashboard.oneRequest")
                  : t("dashboard.manyRequests", { count: pendingRequestCount })}
              </p>
              <p className="font-body text-xs text-ink/55 mt-0.5">
                {t("dashboard.reviewRequest")}
              </p>
            </div>
            <span className="font-body text-sm font-semibold text-clementine whitespace-nowrap">
              {t("dashboard.view")}
            </span>
          </Link>
        )}

        {/* Summary cards — each is now a link out to its own full page */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <Link
            to="/credits"
            className="md:col-span-1 rounded-3xl bg-ruby-night p-6 flex flex-col justify-between hover:bg-ruby-deep transition-colors"
          >
            <span className="font-body text-xs font-medium text-cream/50 uppercase tracking-wide">
              {t("dashboard.credits")}
            </span>
            <span className="font-display text-4xl text-mist mt-3">
              {loading ? "—" : creditValue.toLocaleString()}
            </span>
            <span className="font-body text-xs text-cream/45 mt-2">
              {t("dashboard.redeemable")}
            </span>
          </Link>

          {/* Availability toggle stays inline — it's a quick action, not a page */}
          <div
            className={`md:col-span-1 rounded-3xl p-6 flex flex-col justify-between transition-colors ${
              availability ? "bg-sage-soft" : "bg-white"
            }`}
          >
            <span className="font-body text-xs font-medium text-ink/50 uppercase tracking-wide">
              {t("dashboard.availability")}
            </span>
            <button
              onClick={toggleAvailability}
              disabled={savingAvailability}
              className={`mt-3 self-start flex items-center gap-3 px-1 py-1 rounded-full transition-colors ${
                availability ? "bg-sage" : "bg-ink/15"
              }`}
              aria-pressed={availability}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  availability ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span className="font-body text-xs text-ink/55 mt-3">
              {availability ? t("dashboard.available") : t("dashboard.hidden")}
            </span>
          </div>

          <Link
            to="/badges"
            className="md:col-span-1 rounded-3xl bg-clementine-soft p-6 flex flex-col justify-between hover:bg-clementine/20 transition-colors"
          >
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide">
              {t("dashboard.badgesEarned")}
            </span>
            <span className="font-display text-4xl text-clementine mt-3">{badgeCount}</span>
            <span className="font-body text-xs text-ink/55 mt-2">
              {latestBadge ? t("dashboard.latestBadge", { badge: latestBadge }) : t("dashboard.firstBadge")}
            </span>
          </Link>
        </div>

        {/* Account navigation — every remaining donor page, one click away */}
        <section>
          <h2 className="font-body text-sm font-semibold text-ink mb-4">{t("nav.account")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {accountLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between rounded-2xl bg-white border border-ink/8 px-5 py-4 hover:border-ruby-warm/30 transition-colors"
              >
                <span className="font-body text-sm font-medium text-ink">{link.label}</span>
                <span className="text-ink/30">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}