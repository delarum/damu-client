import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { donorApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export default function Profile() {
  const { user, donorProfile, loading: authLoading, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(donorProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProfile(donorProfile);
  }, [donorProfile]);

  useEffect(() => {
    if (!authLoading && user && !donorProfile) navigate("/profile-setup", { replace: true });
    else if (!authLoading && !user) navigate("/login", { replace: true });
  }, [authLoading, user, donorProfile, navigate]);

  async function fetchProfile() {
    try {
      const data = await donorApi.getProfile();
      setProfile(data);
    } catch {
      setMessage("Couldn't load profile.");
    }
  }

  useEffect(() => {
    if (user && donorProfile) fetchProfile();
  }, [user, donorProfile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await donorApi.updateProfile(profile);
      setMessage("Profile updated.");
      // Refresh the profile in AuthContext to update avatar and other components
      await refreshProfile();
    } catch {
      setMessage("Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user || !donorProfile) return null;

  const ORGAN_OPTIONS = [
    { value: "kidney", label: "Kidney" },
    { value: "liver", label: "Liver" },
    { value: "cornea", label: "Cornea" },
    { value: "heart", label: "Heart" },
    { value: "bone_marrow", label: "Bone Marrow" },
    { value: "lung", label: "Lung" },
    { value: "pancreas", label: "Pancreas" },
  ];

  const toggleOrgan = (organ) => {
    setProfile((p) => {
      const current = p.organs_pledged || [];
      const updated = current.includes(organ)
        ? current.filter((o) => o !== organ)
        : [...current, organ];
      return { ...p, organs_pledged: updated };
    });
  };

  return (
    <div className="min-h-screen bg-clay">
      <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-ruby-night">
        <Link to="/dashboard" className="font-display text-lg tracking-tight text-cream">
          DamuLink
        </Link>
        <Link to="/dashboard" className="font-body text-sm text-cream/60 hover:text-cream">
          Back
        </Link>
      </header>

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-mist rounded-full" />
          <div>
            <h1 className="font-display font-medium text-3xl text-ink">Your Profile</h1>
            <p className="font-body text-sm text-ink/55 mt-0.5">Update your donor details and preferences</p>
          </div>
        </div>

        {message && (
          <p className="font-body text-sm text-sage bg-sage-soft border border-sage/25 rounded-xl px-4 py-3 mb-6">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <section className="rounded-3xl bg-white p-6 border border-ink/8">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Blood Type</span>
                <select
                  value={profile?.blood_type || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, blood_type: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                >
                  <option value="">Select</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Gender</span>
                <select
                  value={profile?.gender || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Prefer not to say</option>
                </select>
              </label>
            </div>
          </section>

          {/* Physical Measurements Section */}
          <section className="rounded-3xl bg-white p-6 border border-ink/8">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Physical Measurements</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Height (cm)</span>
                <input
                  type="number"
                  value={profile?.height_cm || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, height_cm: e.target.value ? parseInt(e.target.value) : null }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                  placeholder="e.g. 170"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Weight (kg)</span>
                <input
                  type="number"
                  value={profile?.weight_kg || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, weight_kg: e.target.value ? parseInt(e.target.value) : null }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                  placeholder="e.g. 70"
                />
              </label>
            </div>
          </section>

          {/* Organ Donation Preferences */}
          <section className="rounded-3xl bg-white p-6 border border-ink/8">
            <h2 className="font-display text-lg font-semibold text-ink mb-2">Organ Donation Preferences</h2>
            <p className="font-body text-xs text-ink/55 mb-4">Select which organs you're willing to donate</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ORGAN_OPTIONS.map((organ) => {
                const isSelected = (profile?.organs_pledged || []).includes(organ.value);
                return (
                  <button
                    key={organ.value}
                    type="button"
                    onClick={() => toggleOrgan(organ.value)}
                    className={`px-4 py-3 rounded-2xl border-2 font-body text-sm font-medium transition-all ${
                      isSelected
                        ? "border-sage bg-sage-soft text-sage"
                        : "border-ink/15 bg-cream/30 text-ink/70 hover:border-ink/30"
                    }`}
                  >
                    {organ.label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Location & Contact Section */}
          <section className="rounded-3xl bg-white p-6 border border-ink/8">
            <h2 className="font-display text-lg font-semibold text-ink mb-4">Location & Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">County</span>
                <input
                  value={profile?.county || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, county: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                />
              </label>
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Town</span>
                <input
                  value={profile?.town || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, town: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="block">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Contact Method</span>
                <select
                  value={profile?.preferred_contact_method || "sms"}
                  onChange={(e) => setProfile((p) => ({ ...p, preferred_contact_method: e.target.value }))}
                  className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-cream/50 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
                >
                  <option value="call">Call</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </label>
            </div>
          </section>

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
