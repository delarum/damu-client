import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function HospitalProfile() {
  const { user, hospitalProfile, refreshProfile } = useHospitalAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(hospitalProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(hospitalProfile);
  }, [hospitalProfile]);

  async function fetchProfile() {
    try {
      const data = await hospitalApi.getProfile();
      setProfile(data);
      await refreshProfile();
    } catch {
      setMessage("Couldn't load profile.");
    }
  }

  useEffect(() => {
    if (!user) return;
    fetchProfile();
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await hospitalApi.updateProfile({ facility_name: profile.facility_name });
      setMessage("Profile updated.");
      await refreshProfile();
    } catch {
      setMessage("Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    navigate("/hospital/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/hospital/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <Link to="/hospital/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-2">Facility profile</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Update your hospital details and public information.</p>

        {message && (
          <p className="font-body text-sm text-sage bg-sage-soft border border-sage/25 rounded-xl px-4 py-3 mb-6">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
              Facility name
            </span>
            <input
              required
              value={profile?.facility_name || ""}
              onChange={(e) => setProfile((p) => ({ ...p, facility_name: e.target.value }))}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
              Facility type
            </span>
            <input
              value={profile?.facility_type || ""}
              onChange={(e) => setProfile((p) => ({ ...p, facility_type: e.target.value }))}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
            />
          </label>

          <label className="block">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
              Address
            </span>
            <input
              value={profile?.address || ""}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50 shadow-[0_10px_24px_-10px_rgba(87,3,0,0.5)]"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
}
