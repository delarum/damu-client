import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../lib/AdminAuthContext";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
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
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't log you in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ruby-night px-6">
      <div className="w-full max-w-md">
        <h1 className="font-display font-medium text-3xl text-cream mb-2">Admin log in</h1>
        <p className="font-body text-sm text-cream/55 mb-8">DamuLink internal staff only.</p>

        {error && (
          <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="font-body text-xs font-medium text-cream/70 uppercase tracking-wide">
              Email
            </span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white/10 font-body text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-mist/40"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs font-medium text-cream/70 uppercase tracking-wide">
              Password
            </span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white/10 font-body text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-mist/40"
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-mist text-ruby-night hover:bg-cream transition-colors disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
