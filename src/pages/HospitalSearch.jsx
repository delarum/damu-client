import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";
import { useLanguage } from "../lib/LanguageContext";

const BLOOD_TYPES = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
const ORGAN_TYPES = [
  { value: "kidney", label: "Kidney" },
  { value: "liver", label: "Liver" },
  { value: "cornea", label: "Cornea" },
  { value: "heart", label: "Heart" },
  { value: "bone_marrow", label: "Bone Marrow" },
  { value: "lung", label: "Lung" },
  { value: "pancreas", label: "Pancreas" },
];

export default function HospitalSearch() {
  const { user } = useHospitalAuth();
  const { t } = useLanguage();
  const [searchType, setSearchType] = useState("blood"); // "blood" or "organ"
  const [bloodType, setBloodType] = useState("");
  const [organType, setOrganType] = useState("");
  const [radius, setRadius] = useState("10");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
  }, [user]);

  async function handleSearch(e) {
    e.preventDefault();
    
    setLoading(true);
    setSearched(true);
    try {
      if (searchType === "blood") {
        if (!bloodType) {
          setResults([]);
          return;
        }
        const data = await hospitalApi.search.blood({
          blood_type: bloodType,
          radius: Number(radius),
        });
        setResults(data.results || []);
        setSearchCount(data.count || 0);
      } else {
        if (!organType) {
          setResults([]);
          return;
        }
        const data = await hospitalApi.search.organs({
          organ: organType,
          radius: Number(radius),
        });
        setResults(data.results || []);
        setSearchCount(data.count || 0);
      }
    } catch {
      setResults([]);
      setSearchCount(0);
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
        <p className="font-body text-sm text-ink/55 mb-8">
          Find verified blood and organ donors across the country.
        </p>

        {/* Search Type Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setSearchType("blood")}
            className={`px-6 py-2.5 rounded-full font-body text-sm font-semibold transition-all ${
              searchType === "blood"
                ? "bg-ruby text-cream shadow-lg"
                : "bg-white text-ink/70 border border-ink/15 hover:border-ruby/30"
            }`}
          >
            🩸 Blood Donors
          </button>
          <button
            type="button"
            onClick={() => setSearchType("organ")}
            className={`px-6 py-2.5 rounded-full font-body text-sm font-semibold transition-all ${
              searchType === "organ"
                ? "bg-sage text-white shadow-lg"
                : "bg-white text-ink/70 border border-ink/15 hover:border-sage/30"
            }`}
          >
            🫀 Organ Donors
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 mb-10">
          {searchType === "blood" ? (
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
                  Blood Type
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
            </div>
          ) : (
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <span className="font-body text-xs font-medium text-ink/60 uppercase tracking-wide block mb-2">
                  Organ Type
                </span>
                <select
                  value={organType}
                  onChange={(e) => setOrganType(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
                >
                  <option value="">Select organ</option>
                  {ORGAN_TYPES.map((organ) => (
                    <option key={organ.value} value={organ.value}>{organ.label}</option>
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
                  className="w-full px-4 py-3 rounded-2xl border border-transparent bg-white font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage/30"
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
                disabled={loading || !organType}
                className="font-body text-sm font-semibold px-6 py-3 rounded-full bg-sage text-white hover:bg-sage/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          )}
        </form>

        {searched && !loading && (
          <section>
            <h2 className="font-body text-sm font-semibold text-ink mb-4">
              {searchCount} donor{searchCount !== 1 ? "s" : ""} found
            </h2>
            {results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-ink/15 bg-white/50 px-6 py-10 text-center">
                <p className="font-body text-sm font-medium text-ink">No donors match this search.</p>
                <p className="font-body text-sm text-ink/50 mt-1">
                  Try a wider radius or different {searchType === "blood" ? "blood type" : "organ type"}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((d) => {
                  const donorOrgans = d.organs_pledged || [];
                  const hasOrgans = donorOrgans.length > 0;
                  
                  return (
                    <div 
                      key={d.donor_id || d.id} 
                      className="rounded-3xl border-2 border-mist/30 bg-white p-5 md:p-6 hover:shadow-xl hover:shadow-mist/20 hover:border-mist/60 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            d.donor_type === "organ" || d.donor_type === "both"
                              ? "bg-gradient-to-br from-sage/20 to-sage-soft/30"
                              : "bg-gradient-to-br from-mist/20 to-clementine-soft/20"
                          }`}>
                            <span className="text-lg">
                              {d.donor_type === "organ" || d.donor_type === "both" ? "💚" : "🩸"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-display text-lg font-semibold text-ink">{d.name}</p>
                            
                            {/* Blood Type Badge */}
                            {d.blood_type && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-ruby-warm bg-ruby-50 px-2.5 py-1 rounded-lg border border-ruby/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-ruby-warm"></span>
                                  {d.blood_type}
                                </span>
                                
                                {/* Distance */}
                                {d.distance_km !== undefined && (
                                  <span className="inline-flex items-center gap-1 font-body text-xs text-ink/50 bg-ink/5 px-2.5 py-1 rounded-lg">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {d.distance_km} km
                                  </span>
                                )}

                                {/* Gender */}
                                {d.gender && (
                                  <span className="font-mono text-xs text-ink/50">
                                    {d.gender === "male" ? "♂ Male" : d.gender === "female" ? "♀ Female" : "⚧ Other"}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Organ Type Badge (for organ search) */}
                            {searchType === "organ" && d.organ && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                                <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-sage bg-sage-soft px-2.5 py-1 rounded-lg border border-sage/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sage"></span>
                                  {d.organ}
                                </span>
                              </div>
                            )}
                            
                            {/* Physical measurements */}
                            {(d.height_cm || d.weight_kg) && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                                {d.height_cm && (
                                  <span className="font-mono text-[11px] text-ink/45">
                                    📏 {d.height_cm} cm
                                  </span>
                                )}
                                {d.weight_kg && (
                                  <span className="font-mono text-[11px] text-ink/45">
                                    ⚖️ {d.weight_kg} kg
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {/* Organs pledged */}
                            {hasOrgans && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                                <span className="font-body text-[11px] text-ink/50 uppercase tracking-wide">Organs:</span>
                                {donorOrgans.map((organ) => (
                                  <span key={organ} className="font-mono text-[11px] font-semibold text-sage bg-sage-soft px-2 py-0.5 rounded-md border border-sage/20">
                                    {organ}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-ink/45">
                              <span className="font-mono text-[11px]">
                                Last donation: {d.last_donation_date || "N/A"}
                              </span>
                              <span className="font-mono text-[11px]">
                                Contact: {d.contact_preference || d.preferred_contact_method || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
