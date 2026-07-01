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
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [donorDetails, setDonorDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!user) window.location.href = "/hospital/login";
  }, [user]);

  const hasActiveSubscription = hospitalProfile?.is_active_subscriber;
  const searchesRemaining = hospitalProfile?.searches_remaining || 0;
  const canSearch = hasActiveSubscription && searchesRemaining > 0;

  async function handleSearch(e) {
    e.preventDefault();
    
    // Validate that required field is selected
    if (searchType === "blood" && !bloodType) {
      return;
    }
    if (searchType === "organ" && !organType) {
      return;
    }
    
    setLoading(true);
    setSearched(true);
    try {
      if (searchType === "blood") {
        const data = await hospitalApi.search.blood({
          blood_type: bloodType,
          radius: Number(radius),
        });
        setResults(data.results || []);
        setSearchCount(data.count || 0);
      } else {
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

  async function handleViewDonorDetails(donorId) {
    setSelectedDonor(donorId);
    setLoadingDetails(true);
    setDonorDetails(null);
    try {
      const data = await hospitalApi.getDonorDetails(donorId);
      setDonorDetails(data);
    } catch (error) {
      console.error("Failed to load donor details:", error);
      alert("Failed to load donor details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  }

  function handleCloseModal() {
    setSelectedDonor(null);
    setDonorDetails(null);
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
              <div className="flex-1 min-w-50">
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
              <div className="flex-1 min-w-50">
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
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            d.donor_type === "organ" || d.donor_type === "both"
                              ? "bg-linear-to-br from-sage/20 to-sage-soft/30"
                              : "bg-linear-to-br from-mist/20 to-clementine-soft/20"
                          }`}>
                            <span className="text-lg">
                              {d.donor_type === "organ" || d.donor_type === "both" ? "💚" : "🩸"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <button
                              onClick={() => handleViewDonorDetails(d.donor_id || d.id)}
                              className="font-display text-lg font-semibold text-ruby-warm hover:text-ruby transition-colors text-left underline decoration-2 underline-offset-2 hover:decoration-ruby"
                            >
                              {d.name}
                            </button>
                            
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
                          
                          {/* View Details Button */}
                          <button
                            onClick={() => handleViewDonorDetails(d.donor_id || d.id)}
                            className="mt-3 px-4 py-2 rounded-xl bg-ruby/10 text-ruby text-xs font-semibold hover:bg-ruby/20 transition-colors"
                          >
                            View Full Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
        
        {/* Donor Details Modal */}
        {selectedDonor && (
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {loadingDetails ? (
                <div className="p-10 text-center">
                  <p className="font-body text-sm text-ink/60">Loading donor details...</p>
                </div>
              ) : donorDetails ? (
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl font-semibold text-ink">Donor Details</h3>
                    <button onClick={handleCloseModal} className="text-ink/40 hover:text-ink transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="rounded-2xl bg-mist/5 p-5">
                      <h4 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-body text-xs text-ink/50">Name</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.name}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Phone</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.phone}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Blood Type</p>
                          <p className="font-display text-base font-semibold text-ruby-warm">{donorDetails.blood_type}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Donor Type</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.donor_type}</p>
                        </div>
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="rounded-2xl bg-sage-soft/30 p-5">
                      <h4 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Medical Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-body text-xs text-ink/50">Gender</p>
                          <p className="font-display text-base font-semibold text-ink capitalize">{donorDetails.gender || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Height</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.height_cm ? `${donorDetails.height_cm} cm` : "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Weight</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.weight_kg ? `${donorDetails.weight_kg} kg` : "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Last Donation</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.last_donation_date || "N/A"}</p>
                        </div>
                      </div>
                      
                      {donorDetails.organs_pledged && donorDetails.organs_pledged.length > 0 && (
                        <div className="mt-4">
                          <p className="font-body text-xs text-ink/50 mb-2">Organs Pledged</p>
                          <div className="flex flex-wrap gap-2">
                            {donorDetails.organs_pledged.map((organ) => (
                              <span key={organ} className="px-3 py-1 rounded-full bg-sage text-white text-xs font-semibold">
                                {organ}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div className="rounded-2xl bg-clementine-soft/30 p-5">
                      <h4 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Location</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-body text-xs text-ink/50">County</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.county || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Town</p>
                          <p className="font-display text-base font-semibold text-ink">{donorDetails.town || "Not specified"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Availability & Contact */}
                    <div className="rounded-2xl bg-ruby-soft/30 p-5">
                      <h4 className="font-body text-xs font-semibold text-ink/60 uppercase tracking-wide mb-3">Availability & Contact</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-body text-xs text-ink/50">Status</p>
                          <p className={`font-display text-base font-semibold ${donorDetails.is_available ? 'text-sage' : 'text-clementine'}`}>
                            {donorDetails.is_available ? '✓ Available' : '✕ Unavailable'}
                          </p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Contact Method</p>
                          <p className="font-display text-base font-semibold text-ink capitalize">{donorDetails.preferred_contact_method || "N/A"}</p>
                        </div>
                        <div>
                          <p className="font-body text-xs text-ink/50">Verification</p>
                          <p className={`font-display text-base font-semibold capitalize ${donorDetails.verification_status === 'verified' ? 'text-sage' : 'text-clementine'}`}>
                            {donorDetails.verification_status || "Pending"}
                          </p>
                        </div>
                        {donorDetails.cooldown_until && (
                          <div>
                            <p className="font-body text-xs text-ink/50">Cooldown Until</p>
                            <p className="font-display text-base font-semibold text-ink">
                              {new Date(donorDetails.cooldown_until).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => alert("Contact request feature coming soon!")}
                      className="flex-1 px-6 py-3 rounded-full bg-ruby text-cream font-body text-sm font-semibold hover:bg-ruby-deep transition-colors"
                    >
                      Request Contact
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 rounded-full bg-ink/10 text-ink font-body text-sm font-semibold hover:bg-ink/20 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <p className="font-body text-sm text-ruby-warm">Failed to load donor details</p>
                  <button onClick={handleCloseModal} className="mt-4 px-6 py-2 rounded-full bg-ruby text-cream text-sm font-semibold">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
