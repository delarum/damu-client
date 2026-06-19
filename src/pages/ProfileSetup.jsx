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
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-6 md:px-12 py-6">
        <Link to="/" className="font-display text-lg tracking-tight text-ruby">
          DamuLink
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
          <h1 className="font-display text-2xl text-ink mb-2">YOUR DONOR PROFILE</h1>
          <p className="font-body text-sm text-ink/60 mb-8">
            This is what hospitals see when they search for a match. Your exact
            location and full contact details stay private until you say yes.
          </p>

          {error && (
            <p className="font-body text-sm text-ruby bg-ruby-50 border border-ruby/20 rounded-lg px-4 py-3 mb-5">
              {error}
            </p>
          )}

          {/* Blood type grid */}
          <div className="mb-6">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
              Blood type
            </span>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  onClick={() => update("blood_type", bt)}
                  className={`font-mono text-sm py-3 rounded-xl border transition-colors ${
                    form.blood_type === bt
                      ? "bg-ruby text-white border-ruby"
                      : "border-ink/15 text-ink hover:border-ruby/40"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          {/* Donor type */}
          <div className="mb-6">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
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
                      ? "bg-ruby text-white border-ruby"
                      : "border-ink/15 text-ink hover:border-ruby/40"
                  }`}
                >
                  {dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Organs, if relevant */}
          {form.donor_type !== "blood" && (
            <div className="mb-6">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
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
                        ? "bg-mist border-mist text-ink"
                        : "border-ink/15 text-ink hover:border-ruby/40"
                    }`}
                  >
                    {organ}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                County
              </span>
              <input
                required
                value={form.county}
                onChange={(e) => update("county", e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 font-body text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Town
              </span>
              <input
                required
                value={form.town}
                onChange={(e) => update("town", e.target.value)}
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 font-body text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby"
              />
            </label>
          </div>

          {/* Contact preference */}
          <div className="mb-6">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
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
                      ? "bg-ruby text-white border-ruby"
                      : "border-ink/15 text-ink hover:border-ruby/40"
                  }`}
                >
                  {cm.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block mb-8">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
              Insurance provider (optional)
            </span>
            <input
              value={form.insurance_provider}
              placeholder="e.g. SHA, Jubilee Health, AAR"
              onChange={(e) => update("insurance_provider", e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border border-ink/15 font-body text-sm text-ink bg-white focus:outline-none focus:ring-2 focus:ring-ruby/30 focus:border-ruby"
            />
          </label>

          <button
            type="submit"
            disabled={submitting || !form.blood_type}
            className="w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-white hover:bg-ruby-deep transition-colors disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save profile and continue"}
          </button>
        </form>
      </main>
    </div>
  );
}