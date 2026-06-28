import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { useLanguage } from "../lib/LanguageContext";
import AuthSidePanel from "../components/AuthSidePanel";

export default function HospitalRegister() {
  const navigate = useNavigate();
  const { register } = useHospitalAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    facility_name: "",
    facility_type: "private",
    email: "",
    phone: "",
    password: "",
    license_number: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/hospital/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-clay">
      <AuthSidePanel
        eyebrow="Hospital onboarding"
        heading="Join the national donor network."
        body="Once verified, your facility can search donors and manage requests in real time."
      />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="font-display text-xl tracking-tight text-ruby">
              DamuLink
            </Link>
          </div>

          <h1 className="font-display font-medium text-3xl text-ink mb-2">
            Register facility
          </h1>
          <p className="font-body text-sm text-ink/55 mb-8">
            Submit your details for review. Approval takes up to 2 business days.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Facility name"
              value={form.facility_name}
              onChange={(v) => update("facility_name", v)}
              required
            />
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Facility type
              </span>
              <select
                value={form.facility_type}
                onChange={(e) => update("facility_type", e.target.value)}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="ngo">NGO</option>
                <option value="blood_bank">Blood Bank</option>
              </select>
            </label>
            <Field
              label="License number"
              value={form.license_number}
              onChange={(v) => update("license_number", v)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                required
              />
            </div>
            <Field
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => update("password", v)}
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>

          <p className="font-body text-sm text-ink/55 text-center mt-7">
            Already registered?{" "}
            <Link to="/hospital/login" className="text-ruby-warm font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required }) {
  return (
    <label className="block">
      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
      />
    </label>
  );
}
