import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { verificationApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

export default function Verification() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    else loadStatus();
  }, [user]);

  async function loadStatus() {
    try {
      const data = await verificationApi.status();
      setStatus(data);
    } catch {
      setStatus(null);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("front_image", e.target.front.files[0]);
      formData.append("back_image", e.target.back.files[0]);
      formData.append("selfie_image", e.target.selfie.files[0]);
      await verificationApi.uploadId(formData);
      setMessage("Documents uploaded. We'll verify them shortly.");
      await loadStatus();
    } catch {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (!user) return null;

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
        <h1 className="font-display font-medium text-3xl text-ink mb-2">Identity verification</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Upload your ID to unlock full donor features.</p>

        {message && (
          <p className="font-body text-sm text-sage bg-sage-soft border border-sage/25 rounded-xl px-4 py-3 mb-6">
            {message}
          </p>
        )}

        {status?.verification_status && (
          <div className="rounded-3xl bg-white p-6 border border-ink/8 mb-8">
            <p className="font-body text-sm font-medium text-ink">Status: {status.verification_status}</p>
          </div>
        )}

        <form onSubmit={handleUpload} className="rounded-3xl bg-white p-6 border border-ink/8">
          <h2 className="font-body text-sm font-semibold text-ink mb-4">Upload documents</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                ID (front)
              </span>
              <input
                type="file"
                name="front"
                required
                accept="image/*"
                className="mt-1.5 block w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ruby-50 file:text-ruby hover:file:bg-ruby-100"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                ID (back)
              </span>
              <input
                type="file"
                name="back"
                required
                accept="image/*"
                className="mt-1.5 block w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ruby-50 file:text-ruby hover:file:bg-ruby-100"
              />
            </label>
            <label className="block">
              <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide">
                Selfie
              </span>
              <input
                type="file"
                name="selfie"
                required
                accept="image/*"
                className="mt-1.5 block w-full text-sm text-ink file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-ruby-50 file:text-ruby hover:file:bg-ruby-100"
              />
            </label>
            <button
              type="submit"
              disabled={uploading}
              className="w-full font-body text-sm font-semibold px-6 py-3.5 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload for verification"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
