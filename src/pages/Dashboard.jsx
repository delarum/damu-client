import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { creditsApi, gamificationApi, donorApi, matchingApi } from "../lib/api";
import { useCountUp } from "../lib/useCountUp";
import { useNewBadges } from "../lib/useNewBadges";
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
  const [badges, setBadges] = useState([]);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);
  const [availability, setAvailability] = useState(donorProfile?.availability_status ?? true);
  const [justToggled, setJustToggled] = useState(false);
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
        if (badgesRes.status === "fulfilled") setBadges(badgesRes.value.results || []);
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
  const newBadgeNames = useNewBadges(badges);
  const badgeCount = badges.length;
  const latestBadge = badges[0]?.badge ?? null;

  async function toggleAvailability() {
    const next = !availability;
    setAvailability(next);
    setJustToggled(true);
    setSavingAvailability(true);
    try {
      await donorApi.setAvailability({ availability_status: next });
    } catch {
      setAvailability(!next); // revert on failure
    } finally {
      setSavingAvailability(false);
    }
    setTimeout(() => setJustToggled(false), 350);
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const firstName = (user?.full_name || donorProfile?.full_name || "").split(" ")[0];

  // Copy reacts to real state: veteran donors get acknowledged, a pending
  // request raises the stakes of the message, first-timers get the default.
  const bloodTypeKey =
    pendingRequestCount > 0
      ? "dashboard.bloodTypeCopyPending"
      : badgeCount > 0
      ? "dashboard.bloodTypeCopyVeteran"
      : "dashboard.bloodTypeCopy";

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
        <div className="flex items-center gap-5">
          <Link
            to="/about"
            className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
          >
            {t("nav.about")}
          </Link>
          <button
            onClick={handleLogout}
            className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
          >
            {t("common.logout")}
          </button>
        </div>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <h1 className="font-display font-medium text-3xl text-ink mb-1 animate-riseIn">
          {firstName ? t("dashboard.welcomeNamed", { name: firstName }) : t("dashboard.welcome")}
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10 animate-riseIn" style={{ animationDelay: "60ms" }}>
          {t(bloodTypeKey, {
            bloodType: donorProfile?.blood_type
              ? t("dashboard.bloodTypeValue", { bloodType: donorProfile.blood_type })
              : "",
          })}
        </p>

        {pendingRequestCount > 0 && (
          <Link
            to="/requests"
            className="flex items-center justify-between gap-4 rounded-2xl bg-clementine-soft border border-clementine/25 px-5 py-4 mb-8 hover:border-clementine/50 transition-colors animate-riseIn animate-attentionPulse"
            style={{ animationDelay: "100ms" }}
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

        {/* Summary cards — staggered entrance, each a link out to its own full page */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          <Link
            to="/credits"
            className="md:col-span-1 rounded-3xl bg-ruby-night p-6 flex flex-col justify-between hover:bg-ruby-deep transition-colors animate-riseIn"
            style={{ animationDelay: "140ms" }}
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

          {/* Availability toggle — settles with a tiny overshoot, card pulses briefly on change */}
          <div
            className={`md:col-span-1 rounded-3xl p-6 flex flex-col justify-between transition-colors animate-riseIn ${
              availability ? "bg-sage-soft" : "bg-white"
            } ${justToggled ? "animate-pulseGlow" : ""}`}
            style={{ animationDelay: "180ms" }}
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
                } ${justToggled ? "animate-toggleSettle" : ""}`}
              />
            </button>
            <span className="font-body text-xs text-ink/55 mt-3">
              {availability ? t("dashboard.available") : t("dashboard.hidden")}
            </span>
          </div>

          <Link
            to="/badges"
            className="md:col-span-1 rounded-3xl bg-clementine-soft p-6 flex flex-col justify-between hover:bg-clementine/20 transition-colors animate-riseIn relative"
            style={{ animationDelay: "220ms" }}
          >
            {newBadgeNames.length > 0 && (
              <span className="absolute top-4 right-4 font-mono text-[10px] uppercase tracking-wide bg-clementine text-white px-2 py-0.5 rounded-full animate-newBadge">
                {t("badges.new")}
              </span>
            )}
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
        <section className="animate-riseIn" style={{ animationDelay: "260ms" }}>
          <h2 className="font-body text-sm font-semibold text-ink mb-4">{t("nav.account")}</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {accountLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center justify-between rounded-2xl bg-white border border-ink/8 px-5 py-4 hover:border-ruby-warm/30 hover:-translate-y-0.5 transition-all"
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