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
  const [showLocationHelp, setShowLocationHelp] = useState(false);

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
      const updateData = {
        facility_name: profile.facility_name,
        address: profile.address,
        county: profile.county,
        lat: profile.lat ? parseFloat(profile.lat) : null,
        lng: profile.lng ? parseFloat(profile.lng) : null,
      };
      await hospitalApi.updateProfile(updateData);
      setMessage("Profile updated successfully!");
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
              County
            </span>
            <input
              value={profile?.county || ""}
              onChange={(e) => setProfile((p) => ({ ...p, county: e.target.value }))}
              className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
              placeholder="e.g. Nairobi"
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
              placeholder="e.g. Moi Avenue, Nairobi"
            />
          </label>

          {/* Location Coordinates */}
          <div className="rounded-2xl bg-mist/5 border border-mist/15 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="font-body text-xs font-semibold text-ink/70 uppercase tracking-wide">
                  📍 Location Coordinates
                </span>
                <p className="font-body text-xs text-ink/55 mt-1">
                  Required for donor search functionality
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLocationHelp(!showLocationHelp)}
                className="font-body text-xs text-ruby-warm hover:text-ruby transition-colors"
              >
                {showLocationHelp ? "Hide" : "How to get coordinates?"}
              </button>
            </div>

            {showLocationHelp && (
              <div className="mb-4 p-3 rounded-xl bg-white border border-ink/10">
                <p className="font-body text-xs text-ink/70 mb-2">
                  To get your hospital's coordinates:
                </p>
                <ol className="font-body text-xs text-ink/60 list-decimal list-inside space-y-1">
                  <li>Go to Google Maps</li>
                  <li>Search for your hospital address</li>
                  <li>Right-click on the location</li>
                  <li>Copy the latitude and longitude values</li>
                  <li>Paste them below</li>
                </ol>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                  Latitude *
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  value={profile?.lat || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, lat: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
                  placeholder="e.g. -1.2921"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                  Longitude *
                </span>
                <input
                  type="number"
                  step="any"
                  required
                  value={profile?.lng || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, lng: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35 transition-shadow"
                  placeholder="e.g. 36.8219"
                />
              </label>
            </div>

            {(!profile?.lat || !profile?.lng) && (
              <p className="font-body text-xs text-clementine mt-3">
                ⚠️ Location coordinates are required to search for donors.
              </p>
            )}
          </div>

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
