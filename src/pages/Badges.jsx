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

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-mist rounded-full" />
          <div>
            <h1 className="font-display font-medium text-3xl text-ink">Badges & Leaderboard</h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">Your achievements and community ranking</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Your Badges Section */}
            <section className="mb-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-clementine shadow-lg shadow-clementine/50" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50 font-semibold">
                  Your Badges ({badges.length})
                </h2>
              </div>
              {badges.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/60 px-8 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-clementine" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <p className="font-display text-base font-semibold text-ink mb-1">No badges yet</p>
                  <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
                    Your first donation unlocks Rookie Lifesaver. Start donating to earn badges!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((b) => {
                    const badgeName = b.badge?.name || b.badge;
                    const badgeTitle = b.badge?.title || "Badge";
                    const badgeIcon = b.badge?.icon || "🏆";
                    const isNew = newBadgeNames.includes(badgeName);
                    return (
                      <div
                        key={badgeName}
                        className={`relative rounded-3xl border-2 p-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
                          isNew 
                            ? "border-clementine/40 bg-linear-to-br from-clementine-soft/40 to-white shadow-lg shadow-clementine/20" 
                            : "border-clementine/25 bg-clementine-soft/30"
                        } ${isNew ? "animate-newBadge" : ""}`}
                      >
                        {isNew && (
                          <span className="absolute -top-2 -right-2 font-mono text-[10px] uppercase tracking-wide bg-clementine text-white px-2.5 py-1 rounded-full shadow-md">
                            {t("badges.new")}
                          </span>
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-clementine/20 to-clementine-soft/30 flex items-center justify-center shrink-0 text-2xl">
                            {badgeIcon}
                          </div>
                          <div className="flex-1">
                            <p className="font-display text-base font-semibold text-ink">{badgeName}</p>
                            <p className="font-body text-xs text-ink/60 mt-0.5">{badgeTitle}</p>
                          </div>
                        </div>
                        {b.earned_at && (
                          <div className="mt-3 pt-3 border-t border-ink/8">
                            <p className="font-mono text-[11px] text-ink/45 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Earned {new Date(b.earned_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Leaderboard Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-px flex-1 bg-ink/10" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40 font-semibold">
                  Community Leaderboard
                </h2>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              {leaderboard.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/60 px-8 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-ruby-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="font-display text-base font-semibold text-ink mb-1">No rankings yet</p>
                  <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
                    Be the first to donate and appear on the leaderboard!
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl bg-white border-2 border-ink/8 overflow-hidden">
                  {leaderboard.map((entry, idx) => {
                    const rank = idx + 1;
                    const isTopThree = rank <= 3;
                    const rankColors = {
                      1: "text-yellow-500",
                      2: "text-gray-400",
                      3: "text-orange-600"
                    };
                    
                    return (
                      <div 
                        key={entry.donor_id || idx} 
                        className={`px-5 py-4 flex items-center justify-between hover:bg-ink/5 transition-colors ${
                          idx < leaderboard.length - 1 ? "border-b border-ink/8" : ""
                        }`}
                      >
                      <div className="flex items-center gap-4">
                        <span className={`font-display text-2xl font-bold w-8 text-center ${
                          isTopThree ? rankColors[rank] : "text-ink/30"
                        }`}>
                          {rank}
                        </span>
                        <div>
                          <p className="font-body text-sm font-semibold text-ink">{entry.name}</p>
                          <p className="font-body text-xs text-ink/55 mt-0.5">
                            {entry.badge?.name || entry.badge?.title || "—"}
                          </p>
                        </div>
                      </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-bold text-clementine">{entry.credits ?? 0}</p>
                          <p className="font-mono text-[10px] text-ink/40 uppercase tracking-wide">credits</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
