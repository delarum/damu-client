import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { creditsApi, gamificationApi, donationApi, donorApi } from "../lib/api";
import { useCountUp } from "../lib/useCountUp";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, donorProfile, logout, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && !donorProfile) {
      navigate("/profile-setup", { replace: true });
    }
  }, [authLoading, user, donorProfile, navigate]);

  const [credits, setCredits] = useState(null);
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [availability, setAvailability] = useState(donorProfile?.availability_status ?? true);
  const [loading, setLoading] = useState(true);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [creditsRes, badgesRes, historyRes] = await Promise.allSettled([
          creditsApi.balance(),
          gamificationApi.badges(),
          donationApi.history(),
        ]);
        if (!active) return;
        if (creditsRes.status === "fulfilled") setCredits(creditsRes.value);
        if (badgesRes.status === "fulfilled") setBadges(badgesRes.value.results || []);
        if (historyRes.status === "fulfilled") setHistory(historyRes.value.results || []);
      } catch {
        if (active) setError("Couldn't load everything just now. Pull to refresh in a bit.");
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

  return (
    <div className="min-h-screen bg-clay">
      {/* Dark header — carries the brand across from onboarding */}
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <button
          onClick={handleLogout}
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          Log out
        </button>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        <h1 className="font-display font-medium text-3xl text-ink mb-1">
          {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10">
          Your blood type{donorProfile?.blood_type ? ` — ${donorProfile.blood_type}` : ""} could be
          exactly what someone needs today.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {/* Credit balance — ruby, the core metric */}
          <div className="md:col-span-1 rounded-3xl bg-ruby-night p-6 flex flex-col justify-between">
            <span className="font-body text-xs font-medium text-cream/50 uppercase tracking-wide">
              Credit balance
            </span>
            <span className="font-display text-4xl text-mist mt-3">
              {loading ? "—" : creditValue.toLocaleString()}
            </span>
            <span className="font-body text-xs text-cream/45 mt-2">
              Redeemable at any partnered hospital
            </span>
          </div>

          {/* Availability toggle — sage when on, communicates "active/healthy" */}
          <div
            className={`md:col-span-1 rounded-3xl p-6 flex flex-col justify-between transition-colors ${
              availability ? "bg-sage-soft" : "bg-white"
            }`}
          >
            <span className="font-body text-xs font-medium text-ink/50 uppercase tracking-wide">
              Availability
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
              {availability
                ? "Hospitals can find and contact you"
                : "You're hidden from new requests"}
            </span>
          </div>

          {/* Badge count — clementine, celebratory/achievement tone */}
          <div className="md:col-span-1 rounded-3xl bg-clementine-soft p-6 flex flex-col justify-between">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide">
              Badges earned
            </span>
            <span className="font-display text-4xl text-clementine mt-3">{badges.length}</span>
            <span className="font-body text-xs text-ink/55 mt-2">
              {badges[0]?.badge ? `Latest: ${badges[0].badge}` : "Donate to earn your first"}
            </span>
          </div>
        </div>

        {/* Badges row */}
        <section className="mb-10">
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Your badges</h2>
          {badges.length === 0 ? (
            <EmptyState
              title="No badges yet"
              body="Your first donation unlocks Rookie Lifesaver. It's closer than you think."
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              {badges.map((b) => (
                <BadgeChip key={b.badge} label={b.badge} earnedAt={b.earned_at} />
              ))}
            </div>
          )}
        </section>

        {/* Donation history */}
        <section>
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Donation history</h2>
          {history.length === 0 ? (
            <EmptyState
              title="No donations recorded yet"
              body="Once a hospital confirms your donation, it shows up here with the credits you earned."
            />
          ) : (
            <div className="rounded-3xl bg-white divide-y divide-ink/8 overflow-hidden">
              {history.map((d) => (
                <div
                  key={d.donation_id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <div>
                    <p className="font-body text-sm font-medium text-ink capitalize">
                      {d.type?.replace("_", " ")}
                    </p>
                    <p className="font-mono text-xs text-ink/50 mt-0.5">
                      {d.hospital} · {d.date}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-clementine">+{d.credits_awarded}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function BadgeChip({ label, earnedAt }) {
  return (
    <div
      className="group relative rounded-2xl border border-clementine/25 bg-clementine-soft px-5 py-4 cursor-default
        transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-8px_rgba(217,119,66,0.3)]"
    >
      <p className="font-body text-sm font-semibold text-ink">{label}</p>
      {earnedAt && (
        <p className="font-mono text-[11px] text-ink/50 mt-0.5">
          Earned {earnedAt}
        </p>
      )}
    </div>
  );
}

function EmptyState({ title, body }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-8 text-center">
      <p className="font-body text-sm font-medium text-ink">{title}</p>
      <p className="font-body text-sm text-ink/50 mt-1">{body}</p>
    </div>
  );
}