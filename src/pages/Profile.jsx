import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { donorApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export default function Profile() {
  const { user, donorProfile, loading: authLoading } = useAuth();
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
    } catch {
      setMessage("Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!user || !donorProfile) return null;

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

      <main className="px-6 md:px-12 py-10 max-w-2xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-2">Your profile</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Update your donor details and preferences.</p>

        {message && (
          <p className="font-body text-sm text-sage bg-sage-soft border border-sage/25 rounded-xl px-4 py-3 mb-6">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Blood type</span>
              <select
                value={profile?.blood_type || ""}
                onChange={(e) => setProfile((p) => ({ ...p, blood_type: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              >
                <option value="">Select</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Contact method</span>
              <select
                value={profile?.preferred_contact_method || "sms"}
                onChange={(e) => setProfile((p) => ({ ...p, preferred_contact_method: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              >
                <option value="call">Call</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">County</span>
              <input
                value={profile?.county || ""}
                onChange={(e) => setProfile((p) => ({ ...p, county: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">Town</span>
              <input
                value={profile?.town || ""}
                onChange={(e) => setProfile((p) => ({ ...p, town: e.target.value }))}
                className="mt-1.5 w-full px-4 py-3.5 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
              />
            </label>
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
