import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { gamificationApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { useNewBadges } from "../lib/useNewBadges";

export default function Badges() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) window.location.href = "/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [b, l] = await Promise.allSettled([gamificationApi.badges(), gamificationApi.leaderboard()]);
      if (b.status === "fulfilled") setBadges(b.value.results || []);
      if (l.status === "fulfilled") setLeaderboard(l.value.results || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  const newBadgeNames = useNewBadges(badges);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <Link to="/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Badges & leaderboard</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Your achievements and community ranking.</p>

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="font-body text-sm font-semibold text-ink mb-4">Your badges</h2>
              {badges.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
                  <p className="font-body text-sm font-medium text-ink">No badges yet.</p>
                  <p className="font-body text-sm text-ink/50 mt-1">
                    Your first donation unlocks Rookie Lifesaver.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {badges.map((b) => {
                    const isNew = newBadgeNames.includes(b.badge);
                    return (
                      <div
                        key={b.badge}
                        className={`relative rounded-2xl border border-clementine/25 bg-clementine-soft px-5 py-4 ${
                          isNew ? "animate-newBadge" : ""
                        }`}
                      >
                        {isNew && (
                          <span className="absolute -top-2 -right-2 font-mono text-[10px] uppercase tracking-wide bg-clementine text-white px-2 py-0.5 rounded-full">
                            {t("badges.new")}
                          </span>
                        )}
                        <p className="font-body text-sm font-semibold text-ink">{b.badge}</p>
                        {b.earned_at && (
                          <p className="font-mono text-[11px] text-ink/50 mt-0.5">
                            Earned {new Date(b.earned_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-body text-sm font-semibold text-ink mb-4">Leaderboard</h2>
              {leaderboard.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
                  <p className="font-body text-sm font-medium text-ink">No rankings available yet.</p>
                </div>
              ) : (
                <div className="rounded-3xl bg-white divide-y divide-ink/8 border border-ink/8">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry.donor_id || idx} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-display text-lg text-ruby w-6 text-center">{idx + 1}</span>
                        <div>
                          <p className="font-body text-sm font-semibold text-ink">{entry.name}</p>
                          <p className="font-body text-xs text-ink/55 mt-0.5">{entry.badge || "—"}</p>
                        </div>
                      </div>
                      <span className="font-mono text-sm text-clementine">{entry.credits ?? 0} pts</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}