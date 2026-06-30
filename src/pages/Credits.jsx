import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { creditsApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";
import { useCountUp } from "../lib/useCountUp";

export default function Credits() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [balance, setBalance] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const [b, l] = await Promise.allSettled([creditsApi.balance(), creditsApi.ledger()]);
      if (b.status === "fulfilled") setBalance(b.value);
      if (l.status === "fulfilled") setLedger(l.value.results || []);
    } catch {
      // ignore partial failures
    } finally {
      setLoading(false);
    }
  }

  async function handleRedeem() {
    setRedeeming(true);
    try {
      await creditsApi.redeem({ amount: balance?.credits || 0 });
      await load();
    } catch {
      alert("Redemption failed. Please try again.");
    } finally {
      setRedeeming(false);
    }
  }

  if (!user) return null;

  const displayBalance = useCountUp(balance?.credits ?? 0);

  // Separate ledger into earned (donations) and redeemed
  const earnedItems = ledger.filter(item => item.transaction_type === "earn");
  const redeemedItems = ledger.filter(item => item.transaction_type === "redeem");

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
            <h1 className="font-display font-medium text-3xl text-ink">Credits</h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">Your health credits and donation history</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div className="rounded-3xl bg-gradient-to-br from-ruby-night to-ruby-deep p-8 mb-8 shadow-xl">
              <p className="font-body text-xs font-medium text-cream/60 uppercase tracking-wide mb-2">
                Available Credits
              </p>
              <p className="font-display text-5xl text-mist mt-2 mb-1">{displayBalance.toLocaleString()}</p>
              <p className="font-body text-xs text-cream/50 mb-6">Redeemable at any partnered hospital</p>
              <button
                onClick={handleRedeem}
                disabled={redeeming || !balance?.credits}
                className="font-body text-sm font-bold px-6 py-3 rounded-full bg-gradient-to-r from-mist to-clementine-soft text-ruby-night hover:shadow-lg hover:shadow-mist/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {redeeming ? "Redeeming..." : "Redeem All Credits"}
              </button>
            </div>

            {/* Redeemed Credits Section */}
            <section className="mb-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2.5 h-2.5 rounded-full bg-sage shadow-lg shadow-sage/50" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50 font-semibold">
                  Redeemed Credits
                </h2>
              </div>
              {redeemedItems.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/60 px-8 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-sage-soft/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-display text-base font-semibold text-ink mb-1">No redeemed credits yet</p>
                  <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
                    When you redeem your credits at a hospital, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redeemedItems.map((item) => (
                    <div key={item.id} className="rounded-3xl border-2 border-sage/30 bg-gradient-to-br from-sage-soft/20 to-white p-5 hover:shadow-lg hover:border-sage/50 hover:-translate-y-0.5 transition-all duration-300">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage/20 to-sage-soft/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">🏥</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-display text-base font-semibold text-ink">
                              {item.reason || "Credit Redemption"}
                            </p>
                            <p className="font-mono text-[11px] text-ink/40 mt-1.5 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-bold text-clementine">
                            -{item.amount}
                          </p>
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-sage text-white mt-1">
                            Redeemed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Donation History / Ledger Section */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="h-px flex-1 bg-ink/10" />
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40 font-semibold">
                  Donation History ({earnedItems.length})
                </h2>
                <div className="h-px flex-1 bg-ink/10" />
              </div>
              {earnedItems.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/60 px-8 py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-ruby-warm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="font-display text-base font-semibold text-ink mb-1">No donations yet</p>
                  <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
                    When a hospital confirms your donation, it will appear here with the credits you earned.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {earnedItems.map((item) => (
                    <DonationCard key={item.id} item={item} t={t} />
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

function DonationCard({ item, t }) {
  // Parse the reason to extract donation details
  // Expected format might be: "Blood donation - O+" or "Organ donation - Kidney" or hospital name
  const reasonText = item.reason || "";
  
  // Try to extract blood type or organ type from reason
  const bloodTypeMatch = reasonText.match(/(O\+|A\+|B\+|AB\+|O\-|A\-|B\-|AB\-)/i);
  const organMatch = reasonText.match(/(kidney|liver|cornea|heart|bone marrow)/i);
  
  // Determine donation type and details
  let donationType = "Blood Donation";
  let donationDetail = "";
  let icon = "🩸";
  let iconBg = "from-ruby-soft/30 to-clementine-soft/20";
  
  if (organMatch) {
    donationType = "Organ Donation";
    donationDetail = organMatch[0];
    icon = "💚";
    iconBg = "from-sage/20 to-sage-soft/30";
  } else if (bloodTypeMatch) {
    donationDetail = bloodTypeMatch[0];
    icon = "🩸";
    iconBg = "from-ruby-soft/30 to-clementine-soft/20";
  }

  const donationDate = item.created_at ? new Date(item.created_at) : null;
  const formattedDate = donationDate ? donationDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }) : "Unknown date";

  return (
    <div className="rounded-3xl border-2 border-mist/30 bg-white p-5 md:p-6 hover:shadow-xl hover:shadow-mist/20 hover:border-mist/60 hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="flex-1">
            <p className="font-display text-lg font-semibold text-ink mb-1">
              {donationType}
            </p>
            {donationDetail && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ruby-warm bg-ruby-50 px-2.5 py-1 rounded-lg border border-ruby/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-ruby-warm"></span>
                  {donationDetail}
                </span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-ink/50">
              <span className="font-mono text-xs flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-xs text-ink/40 uppercase tracking-wide mb-1">Credits Earned</p>
          <p className="font-display text-2xl font-bold text-sage">
            +{item.amount}
          </p>
        </div>
      </div>
    </div>
  );
}
