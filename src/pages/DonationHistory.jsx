import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { donationApi } from "../lib/api";
import { useLanguage } from "../lib/LanguageContext";

export default function DonationHistory() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) window.location.href = "/login";
    else load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await donationApi.history();
      setHistory(data.results || []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
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

      <main className="px-6 md:px-12 py-10 max-w-3xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Donation history</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Every confirmed donation and the credits it earned you.</p>

        {loading ? (
          <p className="font-body text-sm text-ink/50">Loading...</p>
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
            <p className="font-body text-sm font-medium text-ink">No donations recorded yet.</p>
            <p className="font-body text-sm text-ink/50 mt-1">
              Once a hospital confirms your donation, it shows up here.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white divide-y divide-ink/8 border border-ink/8">
            {history.map((d) => (
              <div key={d.donation_id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-body text-sm font-medium text-ink capitalize">
                    {d.type?.replace("_", " ")}
                  </p>
                  <p className="font-mono text-xs text-ink/50 mt-0.5">
                    {d.hospital} · {d.date}
                  </p>
                </div>
                <span className="font-mono text-sm text-clementine">+{d.credits_awarded} pts</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
