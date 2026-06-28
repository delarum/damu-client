import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

const BLOOD_TYPES = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export default function HospitalSearch() {
  const { user } = useHospitalAuth();
  const { t } = useLanguage();
  const [bloodType, setBloodType] = useState("");
  const [radius, setRadius] = useState("10");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
  }, [user]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!bloodType) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await hospitalApi.search.blood({
        blood_type: bloodType,
        radius: Number(radius),
      });
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
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

      <main className="px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <h1 className="font-display font-medium text-3xl text-ink mb-1">Search donors</h1>
        <p className="font-body text-sm text-ink/55 mb-8">Find verified blood donors near your facility.</p>

        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4 mb-10">
          <div className="flex-1 min-w-[200px]">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
              Blood type
            </span>
            <select
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
            >
              <option value="">Select type</option>
              {BLOOD_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          <div className="w-40">
            <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
              Radius (km)
            </span>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ruby-warm/35"
            >
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="25">25 km</option>
              <option value="50">50 km</option>
              <option value="1000">National</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !bloodType}
            className="font-body text-sm font-semibold px-6 py-3 rounded-full bg-ruby text-cream hover:bg-ruby-deep transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {searched && !loading && (
          <section>
            <h2 className="font-body text-sm font-semibold text-ink mb-4">
              {results.length} donor{results.length !== 1 ? "s" : ""} found
            </h2>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
                <p className="font-body text-sm font-medium text-ink">No donors match this search.</p>
                <p className="font-body text-sm text-ink/50 mt-1">Try a wider radius or different blood type.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((d) => (
                  <div key={d.donor_id} className="rounded-3xl bg-white p-5 border border-ink/8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-body text-base font-semibold text-ink">{d.name}</p>
                        <p className="font-body text-sm text-ink/65 mt-0.5">
                          {d.blood_type} · {d.distance_km} km away · Last donation: {d.last_donation_date || "N/A"}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-ruby-warm whitespace-nowrap">
                        Contact: {d.contact_preference}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
