import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import AuthSidePanel from "../components/AuthSidePanel";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't log you in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-clay">
      <AuthSidePanel
        eyebrow="Welcome back"
        heading="Your blood type is needed somewhere, right now."
        body="Log in to check your credits, badges, and the donations that got you here."
      />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link to="/" className="font-display text-xl tracking-tight text-ruby">
              DamuLink
            </Link>
          </div>

          <h1 className="font-display font-medium text-3xl text-ink mb-2">
            Log in
          </h1>
          <p className="font-body text-sm text-ink/55 mb-8">
            Enter the phone number and password you registered with.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Phone number
              </span>
              <input
                type="tel"
                required
                placeholder="+254712345678"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 focus:border-ruby-warm/40 transition-shadow"
              />
            </label>

            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Password
              </span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 focus:border-ruby-warm/40 transition-shadow"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="font-body text-sm text-ink/55 text-center mt-7">
            New to DamuLink?{" "}
            <Link to="/signup" className="text-ruby-warm font-semibold">
              Register as a donor
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}