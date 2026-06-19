import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 md:px-12 py-6">
        <Link to="/" className="font-display text-lg tracking-tight text-ruby">
          DamuLink
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl text-ink mb-2">WELCOME BACK</h1>
          <p className="font-body text-sm text-ink/60 mb-8">
            Log in to check your credits, badges, and donation history.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby bg-ruby-50 border border-ruby/20 rounded-lg px-4 py-3 mb-5">
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
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 font-body text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby"
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
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 font-body text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors disabled:opacity-50"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="font-body text-sm text-ink/60 text-center mt-6">
            New to DamuLink?{" "}
            <Link to="/signup" className="text-ruby font-medium">
              Register as a donor
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}