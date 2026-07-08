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
      // Optimistically update local state so the bubble flips immediately
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
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
          {t("common.brand")}
        </Link>
        <Link
          to="/dashboard"
          className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
        >
          Back to dashboard
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-mist rounded-full" />
          <div>
            <h1 className="font-display font-medium text-3xl text-ink">Hospital messages</h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">
              Hospitals reach out here when they need your help. Respond directly below.
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
              here as a chat.
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
                    <ChatThread
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
                    <ChatThread key={req.request_id} request={req} readOnly />
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

function ChatThread({ request, onRespond, isResponding, readOnly }) {
  const { hospital, reason, status, requested_at, expires_at } = request;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";
  const isExpired = status === "expired";

  return (
    <div className="space-y-3">
      {/* Incoming message bubble — from the hospital */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-ruby-night flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-sm">🏥</span>
        </div>
        <div className="max-w-[85%]">
          <p className="font-body text-xs font-semibold text-ink/50 mb-1 pl-1">{hospital}</p>
          <div className="rounded-3xl rounded-tl-lg bg-white border border-ink/8 px-5 py-3.5 shadow-sm">
            <p className="font-body text-sm text-ink leading-relaxed">{reason}</p>
          </div>
          <div className="flex items-center gap-2 mt-1.5 pl-1">
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
      </div>

      {/* Response — either the action buttons, or your own reply bubble */}
      {isPending && !readOnly ? (
        <div className="flex items-center gap-2.5 justify-end pr-1">
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
        <div className="flex justify-end">
          <div className="max-w-[75%]">
            <div
              className={`rounded-3xl rounded-tr-lg px-5 py-3 shadow-sm ${
                isAccepted
                  ? "bg-sage text-white"
                  : isDeclined
                  ? "bg-ink/10 text-ink/60"
                  : "bg-ink/5 text-ink/50"
              }`}
            >
              <p className="font-body text-sm font-medium">
                {isAccepted && "You accepted — the hospital has your contact details."}
                {isDeclined && "You declined this request."}
                {isExpired && "This request expired before you responded."}
              </p>
            </div>
          </div>
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