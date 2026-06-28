import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi, paymentsApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

const PLANS = [
  { tier: "starter", label: "Starter", price: "KES 5,000", searches: "100 searches/mo" },
  { tier: "professional", label: "Professional", price: "KES 15,000", searches: "500 searches/mo" },
  { tier: "enterprise", label: "Enterprise", price: "KES 40,000", searches: "Unlimited" },
  { tier: "public", label: "Public Hospital", price: "KES 1,500", searches: "300 searches/mo" },
];

export default function HospitalSubscription() {
  const { user } = useHospitalAuth();
  const { t } = useLanguage();
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await hospitalApi.subscription.current();
      setCurrent(data);
    } catch {
      setCurrent(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(tier) {
    setSubscribing(true);
    try {
      if (tier === "public" || tier === "starter" || tier === "professional" || tier === "enterprise") {
        await hospitalApi.subscription.create({ tier });
        await load();
      }
    } catch {
      alert("Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel your subscription?")) return;
    try {
      await hospitalApi.subscription.cancel();
      await load();
    } catch {
      alert("Couldn't cancel. Please contact support.");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/hospital/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <Link to="/hospital/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Subscriptions</h1>
        <p className="font-body text-sm text-ink/55 mb-10">Choose a plan that fits your facility.</p>

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : current ? (
          <div className="rounded-3xl bg-white p-6 border border-ink/8 mb-10">
            <p className="font-body text-sm font-medium text-ink">Current plan</p>
            <p className="font-display text-2xl text-ruby mt-2 capitalize">{current.tier}</p>
            <p className="font-body text-xs text-ink/50 mt-1">
              Status: {current.status} · Expires: {current.expires_at || "—"}
            </p>
            {current.status === "active" && (
              <button
                onClick={handleCancel}
                className="mt-4 font-body text-sm font-semibold px-5 py-2.5 rounded-full border border-ruby/25 text-ruby hover:bg-ruby-50 transition-colors"
              >
                Cancel subscription
              </button>
            )}
          </div>
        ) : null}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map((plan) => (
            <div key={plan.tier} className="rounded-3xl bg-white p-6 border border-ink/8 flex flex-col">
              <p className="font-display text-lg text-ink">{plan.label}</p>
              <p className="font-display text-2xl text-ruby mt-2">{plan.price}</p>
              <p className="font-body text-xs text-ink/55 mt-1">{plan.searches}</p>
              <button
                onClick={() => handleSubscribe(plan.tier)}
                disabled={subscribing}
                className="mt-6 w-full font-body text-sm font-semibold px-5 py-3 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50"
              >
                {subscribing ? "Processing..." : current?.tier === plan.tier ? "Current" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
