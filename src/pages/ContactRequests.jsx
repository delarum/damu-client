import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { matchingApi } from "../lib/api";

export default function ContactRequests() {
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
      setError(err.message || "Couldn't load your requests right now.");
    } finally {
      setLoading(false);
    }
  }

  async function respond(requestId, action) {
    setActingOn(requestId);
    setError("");
    try {
      await matchingApi.respond(requestId, action);
      // Optimistically update status locally rather than re-fetching everything
      setRequests((prev) =>
        prev.map((r) =>
          r.request_id === requestId
            ? { ...r, status: action === "accept" ? "accepted" : "declined" }
            : r
        )
      );
    } catch (err) {
      setError(err.message || "That didn't go through. Please try again.");
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
          DamuLink
        </Link>
        <Link
          to="/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          Back to dashboard
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">
          Hospital requests
        </h1>
        <p className="font-body text-sm text-ink/55 mb-10">
          When a verified hospital wants to reach you, it shows up here first.
          Nothing is shared until you say yes.
        </p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading…</p>
        ) : requests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {pending.length > 0 && (
              <section className="mb-10">
                <h2 className="font-body text-sm font-semibold text-ink mb-4">
                  Needs your response
                </h2>
                <div className="space-y-3">
                  {pending.map((req) => (
                    <RequestCard
                      key={req.request_id}
                      request={req}
                      onRespond={respond}
                      busy={actingOn === req.request_id}
                    />
                  ))}
                </div>
              </section>
            )}

            {resolved.length > 0 && (
              <section>
                <h2 className="font-body text-sm font-semibold text-ink mb-4">
                  Past requests
                </h2>
                <div className="space-y-3">
                  {resolved.map((req) => (
                    <RequestCard key={req.request_id} request={req} />
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

function RequestCard({ request, onRespond, busy }) {
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
        <StatusPill status={status} />
      </div>
      {reason && (
        <p className="font-body text-sm text-ink/65 mb-3">{reason}</p>
      )}
      {requested_at && (
        <p className="font-mono text-xs text-ink/45 mb-4">
          {formatWhen(requested_at)}
        </p>
      )}

      {isPending && onRespond && (
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onRespond(request.request_id, "accept")}
            disabled={busy}
            className="font-body text-sm font-semibold px-5 py-2.5 rounded-full bg-sage text-white hover:bg-sage/90 transition-colors disabled:opacity-50"
          >
            {busy ? "…" : "Accept and share contact"}
          </button>
          <button
            onClick={() => onRespond(request.request_id, "decline")}
            disabled={busy}
            className="font-body text-sm font-medium px-5 py-2.5 rounded-full border border-ink/15 text-ink hover:border-ink/30 transition-colors disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const config = {
    pending: { label: "Awaiting your response", cls: "bg-clementine text-white" },
    accepted: { label: "Accepted", cls: "bg-sage text-white" },
    declined: { label: "Declined", cls: "bg-ink/10 text-ink/60" },
    expired: { label: "Expired", cls: "bg-ink/10 text-ink/60" },
  }[status] || { label: status, cls: "bg-ink/10 text-ink/60" };

  return (
    <span className={`font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full whitespace-nowrap ${config.cls}`}>
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

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
      <p className="font-body text-sm font-medium text-ink">No requests yet</p>
      <p className="font-body text-sm text-ink/50 mt-1 max-w-sm mx-auto">
        When a hospital near you needs your blood type, you'll see it here
        before anything else happens.
      </p>
    </div>
  );
}