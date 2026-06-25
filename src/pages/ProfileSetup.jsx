import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { donorApi } from "../lib/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DONOR_TYPES = [
  { value: "blood", label: "Blood only" },
  { value: "organ", label: "Organ only" },
  { value: "both", label: "Both" },
];
const ORGANS = ["kidney", "liver", "cornea", "heart", "bone marrow"];
const CONTACT_METHODS = [
  { value: "call", label: "Call" },
  { value: "sms", label: "SMS" },
  { value: "whatsapp", label: "WhatsApp" },
];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    blood_type: "",
    donor_type: "blood",
    organs_pledged: [],
    county: "",
    town: "",
    preferred_contact_method: "sms",
    insurance_provider: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleOrgan(organ) {
    setForm((f) => ({
      ...f,
      organs_pledged: f.organs_pledged.includes(organ)
        ? f.organs_pledged.filter((o) => o !== organ)
        : [...f.organs_pledged, organ],
    }));
  }

  async function getLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 5000 }
      );
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const coords = await getLocation();
      const payload = {
        ...form,
        organs_pledged: form.donor_type === "blood" ? [] : form.organs_pledged,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      };
      await donorApi.createProfile(payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Couldn't save your profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-clay flex flex-col">
      <header className="bg-ruby-night px-6 md:px-12 py-5">
        <Link to="/" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
      </header>

      <main className="flex-1 flex items-start md:items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ruby-warm/70 mb-3">
            Last step
          </p>
          <h1 className="font-display font-medium text-3xl text-ink mb-2">
            Your donor profile
          </h1>
          <p className="font-body text-sm text-ink/55 mb-8">
            This is what hospitals see when they search for a match. Your exact
            location and full contact details stay private until you say yes.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby-warm bg-ruby-50 border border-ruby/15 rounded-xl px-4 py-3 mb-6">
              {error}
            </p>
          )}

          {/* Blood type — ruby, the core identity choice */}
          <div className="bg-white rounded-3xl p-5 mb-6 shadow-[0_8px_24px_-12px_rgba(43,27,22,0.15)]">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide block mb-3">
              Blood type
            </span>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => update("blood_type", bt)}
                  className={`font-mono text-sm py-3.5 rounded-2xl border transition-colors ${
                    form.blood_type === bt
                      ? "bg-ruby text-cream border-ruby"
                      : "border-ink/12 text-ink hover:border-ruby-warm/40"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          {/* Donor type — sage, the "what kind of giving" choice */}
          <div className="bg-sage-soft rounded-3xl p-5 mb-6">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide block mb-3">
              What would you like to donate?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DONOR_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => update("donor_type", dt.value)}
                  className={`font-body text-sm py-2.5 rounded-xl border transition-colors ${
                    form.donor_type === dt.value
                      ? "bg-sage text-white border-sage"
                      : "border-sage/25 bg-white text-ink hover:border-sage/60"
                  }`}
                >
                  {dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Organs, if relevant — clementine, a distinct third identity */}
          {form.donor_type !== "blood" && (
            <div className="bg-clementine-soft rounded-3xl p-5 mb-6">
              <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide block mb-3">
                Which organs would you pledge?
              </span>
              <div className="flex flex-wrap gap-2">
                {ORGANS.map((organ) => (
                  <button
                    key={organ}
                    type="button"
                    onClick={() => toggleOrgan(organ)}
                    className={`font-body text-sm capitalize px-4 py-2 rounded-full border transition-colors ${
                      form.organs_pledged.includes(organ)
                        ? "bg-clementine border-clementine text-white"
                        : "border-clementine/30 bg-white text-ink hover:border-clementine/60"
                    }`}
                  >
                    {organ}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location — dusk, the cool note, "where to find you" */}
          <div className="bg-dusk-soft rounded-3xl p-5 mb-6">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide block mb-3">
              Where to find you
            </span>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="font-body text-xs text-ink/50">County</span>
                <input
                  required
                  value={form.county}
                  onChange={(e) => update("county", e.target.value)}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-dusk/40 transition-shadow"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs text-ink/50">Town</span>
                <input
                  required
                  value={form.town}
                  onChange={(e) => update("town", e.target.value)}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-dusk/40 transition-shadow"
                />
              </label>
            </div>
          </div>

          {/* Contact preference */}
          <div className="mb-6">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide block mb-2">
              Preferred contact method
            </span>
            <div className="grid grid-cols-3 gap-2">
              {CONTACT_METHODS.map((cm) => (
                <button
                  key={cm.value}
                  type="button"
                  onClick={() => update("preferred_contact_method", cm.value)}
                  className={`font-body text-sm py-2.5 rounded-xl border transition-colors ${
                    form.preferred_contact_method === cm.value
                      ? "bg-ruby text-cream border-ruby"
                      : "border-ink/12 bg-white text-ink hover:border-ruby-warm/40"
                  }`}
                >
                  {cm.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-8">
            <span className="font-body text-xs font-medium text-ink/55 uppercase tracking-wide">
              Insurance provider (optional)
            </span>
            <input
              value={form.insurance_provider}
              placeholder="e.g. SHA, Jubilee Health, AAR"
              onChange={(e) => update("insurance_provider", e.target.value)}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
            />
          </label>

          <button
            type="submit"
            disabled={submitting || !form.blood_type}
            className="w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
          >
            {submitting ? "Saving…" : "Save profile and continue"}
          </button>
        </form>
      </main>
    </div>
  );
}