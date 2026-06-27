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

  const statusStyles = isPending
    ? "bg-clementine-soft border-clementine/25"
    : isAccepted
    ? "bg-sage-soft border-sage/25"
    : "bg-white border-ink/10";

  return (
    <div className={`rounded-3xl border p-5 ${statusStyles}`}>
      <div className="flex items-start justify-between gap-4 mb-1">
        <p className="font-body text-base font-semibold text-ink">{hospital}</p>
        <StatusPill status={status} t={t} />
      </div>
      {reason && <p className="font-body text-sm text-ink/65 mb-3">{reason}</p>}
      {requested_at && (
        <p className="font-mono text-xs text-ink/45 mb-4">{formatWhen(requested_at)}</p>
      )}

      {isPending && onRespond && (
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onRespond(request.request_id, "accept")}
            disabled={busy}
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-sage text-white hover:bg-sage/90 transition-colors disabled:opacity-50"
          >
            {busy ? t("requests.busy") : t("requests.accept")}
          </button>
          <button
            onClick={() => onRespond(request.request_id, "decline")}
            disabled={busy}
            className="font-body text-sm font-medium px-5 py-2.5 rounded-full border border-ink/15 text-ink hover:border-ink/30 transition-colors disabled:opacity-50"
          >
            {t("requests.decline")}
          </button>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, t }) {
  const config = {
    pending: { label: t("requests.status.pending"), cls: "bg-clementine text-white" },
    accepted: { label: t("requests.status.accepted"), cls: "bg-sage text-white" },
    declined: { label: t("requests.status.declined"), cls: "bg-ink/10 text-ink/60" },
    expired: { label: t("requests.status.expired"), cls: "bg-ink/10 text-ink/60" },
  }[status] || { label: status, cls: "bg-ink/10 text-ink/60" };

  return (
    <span
      className={`font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${config.cls}`}
    >
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
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
      <p className="font-body text-sm font-medium text-ink">{t("requests.emptyTitle")}</p>
      <p className="font-body text-sm text-ink/50 mt-1 max-w-sm mx-auto">
        {t("requests.emptyBody")}
      </p>
    </div>
  );
}