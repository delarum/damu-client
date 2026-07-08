import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { matchingApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export default function DonorContactRequests() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await matchingApi.myContactRequests();
      setRequests(res.results || []);
    } catch (err) {
      setError(err.message || "Couldn't load your contact requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRespond(requestId, action) {
    setRespondingId(requestId);
    try {
      await matchingApi.respond(requestId, action);
      setRequests((prev) =>
        prev.map((r) =>
          r.request_id === requestId
            ? { ...r, status: action === "accept" ? "accepted" : "declined" }
            : r
        )
      );
    } catch (err) {
      setError(err.message || "Couldn't send your response. Please try again.");
    } finally {
      setRespondingId(null);
    }
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-clay">
      <header className="relative bg-ruby-night overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, #FFFBF5 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, #FFFBF5 0%, transparent 40%)`,
          }}
        />
        <div className="relative flex items-center justify-between px-6 md:px-12 py-6">
          <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
            {t("common.brand")}
          </Link>
          <Link
            to="/dashboard"
            className="font-body text-sm text-cream/60 hover:text-cream px-3 py-2 rounded-full hover:bg-cream/5 transition-colors"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-mist rounded-full" />
          <div>
            <h1 className="font-display font-medium text-3xl text-ink">Hospital messages</h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">
              Hospitals reach out here when they need your help. Review who's asking and respond
              directly.
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
              <span className="text-2xl">💬</span>
            </div>
            <p className="font-body text-sm font-semibold text-ink mb-1">No messages yet</p>
            <p className="font-body text-sm text-ink/50 max-w-sm mx-auto">
              When a hospital needs a donor matching your profile, their message will appear
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-mist animate-pulse shadow-lg shadow-mist/50" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50 font-semibold">
                    Needs your response ({pending.length})
                  </h2>
                </div>
                <div className="space-y-6">
                  {pending.map((req) => (
                    <RequestCard
                      key={req.request_id}
                      request={req}
                      onRespond={handleRespond}
                      isResponding={respondingId === req.request_id}
                    />
                  ))}
                </div>
              </section>
            )}

            {resolved.length > 0 && (
              <section>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="h-px flex-1 bg-ink/10" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/40 font-semibold">
                    Past ({resolved.length})
                  </h2>
                  <div className="h-px flex-1 bg-ink/10" />
                </div>
                <div className="space-y-6">
                  {resolved.map((req) => (
                    <RequestCard key={req.request_id} request={req} readOnly />
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

const FACILITY_ICONS = {
  public: "🏥",
  private: "🏨",
  ngo: "🤝",
  blood_bank: "🩸",
};

function RequestCard({ request, onRespond, isResponding, readOnly }) {
  const { hospital, reason, status, requested_at, expires_at } = request;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";
  const isExpired = status === "expired";

  const cardStyles = isPending
    ? "border-mist/40 bg-white"
    : isAccepted
    ? "border-sage/40 bg-gradient-to-br from-sage-soft/25 to-white"
    : "border-ink/15 bg-white/80";

  return (
    <div className={`rounded-3xl border-2 overflow-hidden transition-all ${cardStyles}`}>
      {/* Hospital identity header */}
      <div className="px-5 md:px-6 pt-5 pb-4 border-b border-ink/8">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-ruby-night flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-lg">{FACILITY_ICONS[hospital?.facility_type] || "🏥"}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-display text-lg font-semibold text-ink">{hospital?.name}</p>
                {hospital?.is_verified && (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wide text-sage bg-sage-soft px-2 py-0.5 rounded-full border border-sage/20">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="font-body text-xs text-ink/50 mt-1 capitalize">
                {hospital?.facility_type?.replace("_", " ")}
                {hospital?.county && ` · ${hospital.county}`}
              </p>
            </div>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Hospital detail strip */}
        {(hospital?.address || hospital?.phone) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pl-15">
            {hospital?.address && (
              <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink/50">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {hospital.address}
              </span>
            )}
            {hospital?.phone && (isAccepted ? (
              <a
                href={`tel:${hospital.phone}`}
                className="inline-flex items-center gap-1.5 font-body text-xs text-ruby-warm font-semibold hover:text-ruby transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {hospital.phone}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-body text-xs text-ink/35">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
                Phone hidden until accepted
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div className="px-5 md:px-6 py-4">
        <div className="rounded-2xl rounded-tl-md bg-cream/60 border border-ink/6 px-4 py-3">
          <p className="font-body text-sm text-ink leading-relaxed">{reason}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 pl-1">
          {requested_at && (
            <span className="font-mono text-[11px] text-ink/40">{formatWhen(requested_at)}</span>
          )}
          {isPending && expires_at && (
            <span className="font-mono text-[11px] text-ruby-warm">
              · expires {formatWhen(expires_at)}
            </span>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="px-5 md:px-6 pb-5">
        {isPending && !readOnly ? (
          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={() => onRespond(request.request_id, "decline")}
              disabled={isResponding}
              className="font-body text-sm font-semibold px-5 py-2.5 rounded-full border border-ink/15 text-ink/60 hover:bg-ink/5 transition-colors disabled:opacity-50"
            >
              Decline
            </button>
            <button
              onClick={() => onRespond(request.request_id, "accept")}
              disabled={isResponding}
              className="font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50"
            >
              {isResponding ? "Sending..." : "Accept"}
            </button>
          </div>
        ) : (
          !isPending && (
            <div
              className={`rounded-2xl px-4 py-3 text-center ${
                isAccepted
                  ? "bg-sage-soft/50 text-sage"
                  : isDeclined
                  ? "bg-ink/5 text-ink/50"
                  : "bg-ink/5 text-ink/40"
              }`}
            >
              <p className="font-body text-sm font-medium">
                {isAccepted && "You accepted — the hospital can now reach you directly."}
                {isDeclined && "You declined this request."}
                {isExpired && "This request expired before you responded."}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    pending: { label: "Pending", icon: "⏳", cls: "bg-gradient-to-r from-mist to-clementine-soft text-ruby-night" },
    accepted: { label: "Accepted", icon: "✓", cls: "bg-gradient-to-r from-sage to-sage/90 text-white" },
    declined: { label: "Declined", icon: "✕", cls: "bg-ink/10 text-ink/60" },
    expired: { label: "Expired", icon: "⏱", cls: "bg-ink/10 text-ink/50" },
  }[status] || { label: status, icon: "", cls: "bg-ink/10 text-ink/50" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full whitespace-nowrap font-bold shadow-sm shrink-0 ${config.cls}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
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