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
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Credits</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Your redeemable health credits balance and recent activity.</p>

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : (
          <>
            <div className="rounded-3xl bg-ruby-night p-6 mb-8">
              <p className="font-body text-xs font-medium text-cream/50 uppercase tracking-wide">
                Available credits
              </p>
              <p className="font-display text-4xl text-mist mt-3">{displayBalance.toLocaleString()}</p>
              <p className="font-body text-xs text-cream/45 mt-2">Redeemable at any partnered hospital</p>
              <button
                onClick={handleRedeem}
                disabled={redeeming || !balance?.credits}
                className="mt-4 font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-mist text-ruby-night hover:bg-cream transition-colors disabled:opacity-50"
              >
                {redeeming ? "Redeeming..." : "Redeem all"}
              </button>
            </div>

            <section>
              <h2 className="font-body text-sm font-semibold text-ink mb-4">Ledger</h2>
              {ledger.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
                  <p className="font-body text-sm font-medium text-ink">No transactions yet.</p>
                </div>
              ) : (
                <div className="rounded-3xl bg-white divide-y divide-ink/8 border border-ink/8">
                  {ledger.map((item) => (
                    <div key={item.id || Math.random()} className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm font-medium text-ink">{item.transaction_type}</p>
                        <p className="font-body text-xs text-ink/55 mt-0.5">{item.reason || "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-clementine">
                          {item.transaction_type === "earn" ? "+" : "-"}{item.amount}
                        </p>
                        <p className="font-mono text-xs text-ink/45 mt-0.5">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
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
