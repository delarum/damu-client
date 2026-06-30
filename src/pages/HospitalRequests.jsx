import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalRequests() {
  const { user } = useHospitalAuth();
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
  }, [user]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await hospitalApi.contactRequests.list();
        setRequests(res.results || []);
      } catch (err) {
        setError(err.message || t("requests.loadError"));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  const pending = requests.filter((r) => r.status === "pending");
  const responded = requests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/hospital/dashboard" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <Link
          to="/hospital/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          {t("requests.backDashboard")}
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-mist rounded-full" />
          <div>
            <h1 className="font-display font-medium text-3xl text-ink">
              {t("requests.hospital.title")}
            </h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">
              {t("requests.hospital.body")}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-ruby-50 border border-ruby/15 px-5 py-4 mb-8">
            <p className="font-body text-sm text-ruby-warm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/60 px-8 py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center mx-auto mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3c4 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 3-7 7-12z"
                  fill="#570300"
                />
              </svg>
            </div>
            <p className="font-body text-sm font-semibold text-ink mb-1">
              {t("requests.emptyTitle")}
            </p>
            <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
              {t("requests.hospital.emptyBody")}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-mist animate-pulse shadow-lg shadow-mist/50" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50 font-semibold">
                    {t("requests.needsResponse")} ({pending.length})
                  </h2>
                </div>
                <div className="space-y-4">
                  {pending.map((req) => (
                    <HospitalRequestCard key={req.request_id} request={req} />
                  ))}
                </div>
              </section>
            )}

            {responded.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="h-px flex-1 bg-ink/10" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40 font-semibold">
                    {t("requests.past")} ({responded.length})
                  </h2>
                  <div className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="space-y-4">
                  {responded.map((req) => (
                    <HospitalRequestCard key={req.request_id} request={req} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function HospitalRequestCard({ request }) {
  const { status, donor_name, blood_type, organ_type, reason, requested_at, distance_km } =
    request;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";

  const cardStyles = isPending
    ? "border-mist/40 bg-white hover:shadow-xl hover:shadow-mist/20 hover:border-mist/60 hover:-translate-y-0.5"
    : isAccepted
    ? "border-sage/40 bg-gradient-to-br from-sage-soft/30 to-white hover:shadow-xl hover:shadow-sage/20 hover:border-sage/60 hover:-translate-y-0.5"
    : "border-ink/15 bg-white/80 hover:shadow-lg hover:border-ink/25 hover:-translate-y-0.5";

  const statusBadge = isPending
    ? { 
        label: t("requests.status.pending"), 
        cls: "bg-gradient-to-r from-mist to-clementine-soft text-ruby-night shadow-sm shadow-mist/50",
        icon: "⏳"
      }
    : isAccepted
    ? { 
        label: t("requests.status.accepted"), 
        cls: "bg-gradient-to-r from-sage to-sage/90 text-white shadow-sm shadow-sage/50",
        icon: "✓"
      }
    : { 
        label: t("requests.status.declined"), 
        cls: "bg-ink/10 text-ink/60",
        icon: "✕"
      };

  return (
    <div className={`rounded-3xl border-2 p-5 md:p-6 ${cardStyles} transition-all duration-300 ease-out`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isPending 
              ? "bg-linear-to-br from-mist/20 to-clementine-soft/20" 
              : isAccepted 
              ? "bg-linear-to-br from-sage/20 to-sage-soft/30" 
              : "bg-ink/5"
          }`}>
            <span className="text-lg">{isPending ? "🩸" : isAccepted ? "💚" : "💔"}</span>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink">
              {donor_name || t("requests.hospital.unknownDonor")}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
              {blood_type && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ruby-warm font-bold bg-ruby-50 px-2.5 py-1 rounded-lg border border-ruby/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-ruby-warm"></span>
                  {blood_type}
                </span>
              )}
              {organ_type && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-dusk font-bold bg-dusk/5 px-2.5 py-1 rounded-lg border border-dusk/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-dusk"></span>
                  {organ_type}
                </span>
              )}
              {distance_km != null && (
                <span className="inline-flex items-center gap-1 font-body text-xs text-ink/50 bg-ink/5 px-2.5 py-1 rounded-lg">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {distance_km} {t("requests.hospital.kmAway")}
                </span>
              )}
              {requested_at && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-ink/40">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatWhen(requested_at)}
                </span>
              )}
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full whitespace-nowrap font-bold ${statusBadge.cls} shadow-sm`}
        >
          <span>{statusBadge.icon}</span>
          {statusBadge.label}
        </span>
      </div>

      {reason && (
        <div className="mt-4 pt-4 border-t border-ink/8">
          <p className="font-body text-sm text-ink/65 leading-relaxed">
            <span className="font-semibold text-ink/70">{t("requests.hospital.reasonLabel")}</span>
            <span className="mt-1 block">{reason}</span>
          </p>
        </div>
      )}
    </div>
  );
}

function formatWhen(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

