import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { useLanguage } from "../lib/LanguageContext";
import AuthSidePanel from "../components/AuthSidePanel";

export default function HospitalLogin() {
  const navigate = useNavigate();
  const { login } = useHospitalAuth();
  const { t } = useLanguage();
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
      navigate("/hospital/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't log you in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-clay">
      <AuthSidePanel
        eyebrow="Hospital portal"
        heading="Find donors when every minute counts."
        body="Log in to search verified donors, manage staff, and track subscriptions."
      />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <Link to="/" className="font-display text-xl tracking-tight text-ruby">
              {t("common.brand")}
            </Link>
          </div>

          <h1 className="font-display font-medium text-3xl text-ink mb-2">
            Hospital log in
          </h1>
          <p className="font-body text-sm text-ink/55 mb-8">
            Enter the email and password for your facility account.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Phone Number
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
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="font-body text-sm text-ink/55 text-center mt-7">
            New facility?{" "}
            <Link to="/hospital/register" className="text-ruby-warm font-semibold">
              Register hospital
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
