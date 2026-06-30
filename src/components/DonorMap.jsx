import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useHospitalAuth } from "../lib/HospitalAuthContext";
import { hospitalApi } from "../lib/apiHospital";

const BLOOD_TYPES = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
const SPECTRUM_COLORS = ["#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#F1948A","#82E0AA","#85C1E9","#F8C471","#BB8FCE","#E59866","#A3E4D7","#F5B7B1","#AED6F1","#D7BDE2","#A9CCE3","#F9E79F","#D2B4DE","#A9DFBF","#FAD7A0","#E6B0AA","#AEB6BF","#D5F5E3","#FCF3CF","#E8DAEF","#D6EAF8","#FADBD8","#D1F2EB","#FDEBD0"];
const BLOOD_PALETTE = {"O+":"#FF6B6B","O-":"#C0392B","A+":"#3498DB","A-":"#85C1E9","B+":"#9B59B6","B-":"#BB8FCE","AB+":"#E91E63","AB-":"#F48FB1"};

function donorColor(donor) {
  if (donor.blood_type && BLOOD_PALETTE[donor.blood_type]) {
    return BLOOD_PALETTE[donor.blood_type];
  }
  return SPECTRUM_COLORS[donor.id % SPECTRUM_COLORS.length];
}

function makeIcon(color) {
  return L.divIcon({
    className: "custom-donor-marker",
    html: `<div style="background-color:${color};width:26px;height:26px;border-radius:50%;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.25);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -15],
  });
}

function FitBounds({ donors }) {
  const map = useMap();
  useEffect(() => {
    if (donors.length > 0) {
      const bounds = donors.map((d) => [d.lat, d.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [donors, map]);
  return null;
}

function DonorCard({ donor }) {
  const color = donorColor(donor);
  const statusColor = donor.availability_status ? "#5C7A5E" : "#7A1410";
  const statusText = donor.availability_status ? "Available" : "Unavailable";

  return (
    <div
      style={{
        background: "white",
        borderRadius: 18,
        padding: "14px 16px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
        border: `3px solid ${color}`,
        minWidth: 200,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <p style={{ margin: 0, marginBottom: 4, fontWeight: 700, fontSize: 15, color: "#2B1B16" }}>
        {donor.full_name}
      </p>
      <p style={{ margin: 0, marginBottom: 8, fontSize: 13, color: "#2B1B16", opacity: 0.7 }}>
        {donor.phone}
      </p>
      <div
        style={{
          display: "inline-block",
          background: color,
          color: "white",
          fontWeight: 700,
          fontSize: 12,
          padding: "4px 12px",
          borderRadius: 999,
          marginBottom: 6,
        }}
      >
        {donor.blood_type}
      </div>
      {donor.donor_type !== "blood" && (
        <p style={{ margin: 0, marginTop: 4, fontSize: 11, fontWeight: 600, color: "#570300" }}>
          {donor.donor_type === "both" ? "🫀 Blood & Organ" : "🫀 Organ Donor"}
        </p>
      )}
      <p style={{ margin: 0, marginTop: 6, fontSize: 11, fontWeight: 600, color: statusColor }}>
        ● {statusText}
      </p>
    </div>
  );
}

export default function DonorMap({ height = "75vh" }) {
  const { user } = useHospitalAuth();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    async function load() {
      try {
        const params = {};
        if (bloodFilter) params.blood_type = bloodFilter;
        if (typeFilter) params.donor_type = typeFilter;

        const data = await hospitalApi.donors.map(params);
        if (active) {
          setDonors(data.results || []);
        }
      } catch (err) {
        if (active) {
          setError("Could not load donor map.");
          console.error("Map load error:", err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user, bloodFilter, typeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white rounded-3xl border border-ink/10" style={{ height }}>
        <p className="font-body text-sm text-ink/50">Loading donor map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-ruby-50 rounded-3xl border border-ruby/15" style={{ height }}>
        <p className="font-body text-sm text-ruby-warm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display font-medium text-xl text-ink">National Donor Map</h2>
          <p className="font-body text-xs text-ink/55 mt-1">
            {donors.length} registered donor{donors.length !== 1 ? "s" : ""} across the country
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-ink/10 bg-white font-body text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ruby/20"
          >
            <option value="">All blood types</option>
            {BLOOD_TYPES.map((bt) => (
              <option key={bt} value={bt}>
                {bt}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-ink/10 bg-white font-body text-xs text-ink focus:outline-none focus:ring-2 focus:ring-ruby/20"
          >
            <option value="">All donor types</option>
            <option value="blood">Blood</option>
            <option value="organ">Organ</option>
            <option value="both">Blood & Organ</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-ink/10 shadow-xl bg-white">
        <MapContainer
          center={[-1.2921, 36.8219]}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height, width: "100%" }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <FitBounds donors={donors} />
          {donors.map((donor) => (
            <Marker
              key={donor.id}
              position={[donor.lat, donor.lng]}
              icon={makeIcon(donorColor(donor))}
            >
              <Tooltip direction="top" offset={[0, -15]} opacity={1}>
                <DonorCard donor={donor} />
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sage"></span>
          <span className="font-body text-xs text-ink/70">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-ruby-warm"></span>
          <span className="font-body text-xs text-ink/70">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
