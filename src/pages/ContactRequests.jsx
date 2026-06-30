import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { matchingApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export default function ContactRequests() {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingOn, setActingOn] = useState(null);

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
      setError(err.message || t("requests.loadError"));
    } finally {
      setLoading(false);
    }
  }

  async function respond(requestId, action) {
    setActingOn(requestId);
    setError("");
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
      setError(err.message || t("requests.actionError"));
    } finally {
      setActingOn(null);
    }
  }

  const pending = requests.filter((r) => r.status === "pending");
  const resolved = requests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <Link
          to="/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          {t("common.backDashboard")}
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">
          {t("requests.title")}
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10">
          {t("requests.body")}
        </p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-ink/50">{t("requests.loading")}</p>
        ) : requests.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <>
            {pending.length > 0 && (
              <section className="mb-10">
                <h2 className="font-body text-sm font-semibold text-ink mb-4">
                  {t("requests.needsResponse")}
                </h2>
                <div className="space-y-3">
                  {pending.map((req) => (
                    <RequestCard
                      key={req.request_id}
                      request={req}
                      onRespond={respond}
                      busy={actingOn === req.request_id}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}

            {resolved.length > 0 && (
              <section>
                <h2 className="font-body text-sm font-semibold text-ink mb-4">
                  {t("requests.past")}
                </h2>
                <div className="space-y-3">
                  {resolved.map((req) => (
                    <RequestCard key={req.request_id} request={req} t={t} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function RequestCard({ request, onRespond, busy, t }) {
  const { hospital, reason, status, requested_at } = request;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";

  const cardStyles = isPending
    ? "border-mist/40 bg-white hover:shadow-xl hover:shadow-mist/20 hover:border-mist/60 hover:-translate-y-0.5"
    : isAccepted
    ? "border-sage/40 bg-gradient-to-br from-sage-soft/30 to-white hover:shadow-xl hover:shadow-sage/20 hover:border-sage/60 hover:-translate-y-0.5"
    : "border-ink/15 bg-white/80 hover:shadow-lg hover:border-ink/25 hover:-translate-y-0.5";

  return (
    <div className={`rounded-3xl border-2 p-5 md:p-6 ${cardStyles} transition-all duration-300 ease-out`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isPending 
              ? "bg-linear-to-br from-mist/20 to-clementine-soft/20" 
              : isAccepted 
              ? "bg-linear-to-br from-sage/20 to-sage-soft/30" 
              : "bg-ink/5"
          }`}>
            <span className="text-lg">{isPending ? "🩸" : isAccepted ? "💚" : "💔"}</span>
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-ink">{hospital}</p>
            {requested_at && (
              <p className="font-mono text-[11px] text-ink/40 mt-1.5 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatWhen(requested_at)}
              </p>
            )}
          </div>
        </div>
        <StatusPill status={status} t={t} />
      </div>
      
      {reason && (
        <div className="mt-3 pt-3 border-t border-ink/8">
          <p className="font-body text-sm text-ink/65 leading-relaxed">
            <span className="font-semibold text-ink/70">Reason: </span>
            {reason}
          </p>
        </div>
      )}

      {isPending && onRespond && (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ink/8">
          <button
            onClick={() => onRespond(request.request_id, "accept")}
            disabled={busy}
            className="font-body text-sm font-bold px-6 py-2.5 rounded-full bg-linear-to-r from-sage to-sage/90 text-white hover:shadow-lg hover:shadow-sage/30 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("requests.busy")}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>✓</span>
                {t("requests.accept")}
              </span>
            )}
          </button>
          <button
            onClick={() => onRespond(request.request_id, "decline")}
            disabled={busy}
            className="font-body text-sm font-semibold px-6 py-2.5 rounded-full border-2 border-ink/15 text-ink hover:border-ruby/40 hover:bg-ruby-50/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center gap-1.5">
              <span>✕</span>
              {t("requests.decline")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, t }) {
  const config = {
    pending: { 
      label: t("requests.status.pending"), 
      cls: "bg-gradient-to-r from-mist to-clementine-soft text-ruby-night shadow-sm shadow-mist/50",
      icon: "⏳"
    },
    accepted: { 
      label: t("requests.status.accepted"), 
      cls: "bg-gradient-to-r from-sage to-sage/90 text-white shadow-sm shadow-sage/50",
      icon: "✓"
    },
    declined: { 
      label: t("requests.status.declined"), 
      cls: "bg-ink/10 text-ink/60",
      icon: "✕"
    },
    expired: { 
      label: t("requests.status.expired"), 
      cls: "bg-ink/10 text-ink/60",
      icon: "⏰"
    },
  }[status] || { label: status, cls: "bg-ink/10 text-ink/60", icon: "●" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider px-3.5 py-2 rounded-full whitespace-nowrap font-bold ${config.cls} shadow-sm`}
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

function EmptyState({ t }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-cream to-white flex items-center justify-center mx-auto mb-6 shadow-lg">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-ruby-warm">
          <path
            d="M12 3c4 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 3-7 7-12z"
            fill="currentColor"
            opacity="0.2"
          />
          <path
            d="M12 3c4 5 7 8.5 7 12a7 7 0 11-14 0c0-3.5 3-7 7-12z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-display text-base font-semibold text-ink mb-2">{t("requests.emptyTitle")}</p>
      <p className="font-body text-sm text-ink/50 max-w-sm mx-auto leading-relaxed">
        {t("requests.emptyBody")}
      </p>
    </div>
  );
}
