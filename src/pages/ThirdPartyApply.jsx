import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { thirdPartyApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function ThirdPartyApply() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    organization_name: "", organization_type: "", purpose: "", duration: "", requester_name: "", requester_email: "",
  });

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await thirdPartyApi.apply(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Application failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-clay px-6">
        <div className="text-center">
          <p className="font-body text-sm text-ink/60 mb-4">Please log in to apply for data access.</p>
          <Link to="/login" className="font-body text-sm font-semibold text-ruby-warm">Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">DamuLink</Link>
        <Link to="/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">Back</Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-2">Third-party data access</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Apply for anonymized aggregate dataset access.</p>

        {error && <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">{error}</p>}

        {success ? (
          <div className="rounded-3xl bg-white p-8 border border-ink/8 text-center">
            <div className="w-12 h-12 rounded-full bg-sage-soft flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#5C7A5E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 className="font-display text-xl text-ink mb-2">Application submitted</h2>
            <p className="font-body text-sm text-ink/55">Our legal team will review within 5–10 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Organization name" value={form.organization_name} onChange={(v)=>update("organization_name",v)} required />
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Organization type</span>
              <select value={form.organization_type} onChange={(e)=>update("organization_type",e.target.value)} className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35">
                <option value="">Select</option><option value="research">Academic / Research</option><option value="ngo">NGO</option><option value="government">Government</option><option value="insurance">Insurance</option><option value="other">Other</option>
              </select>
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Purpose</span>
              <textarea required value={form.purpose} onChange={(e)=>update("purpose",e.target.value)} rows={4} className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35" />
            </label>
            <Field label="Duration of access" value={form.duration} onChange={(v)=>update("duration",v)} placeholder="e.g. 6 months" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Requester name" value={form.requester_name} onChange={(v)=>update("requester_name",v)} required />
              <Field label="Requester email" type="email" value={form.requester_email} onChange={(v)=>update("requester_email",v)} required />
            </div>
            <button type="submit" disabled={submitting} className="w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]">
              {submitting ? "Submitting..." : "Submit application"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, required, placeholder }) {
  return (
    <label className="block">
      <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">{label}</span>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} required={required} placeholder={placeholder} className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-ruby-warm/35" />
    </label>
  );
}
