import { useState } from "react";
import { Phone, Navigation, Star, MapPin, Clock, Map } from "lucide-react";
import { doctors, SPECIALTIES, Doctor } from "../data/mockData";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={12} className="text-amber-400 fill-amber-400" />
      <span className="text-xs font-semibold text-foreground">{rating}</span>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .split(" ")
    .filter((_, i) => i > 0)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const avatarColors = [
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
  ];
  const colorIdx = doctor.id.charCodeAt(0) % avatarColors.length;

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${avatarColors[colorIdx]}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-semibold text-foreground text-sm leading-tight">{doctor.name}</h4>
              <p className="text-xs text-primary font-medium mt-0.5">{doctor.specialty}</p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                doctor.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {doctor.available ? "Available" : "Busy"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={doctor.rating} />
            <span className="text-xs text-muted-foreground">({doctor.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-primary flex-shrink-0" />
          <span className="truncate">{doctor.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-primary flex-shrink-0" />
          <span>{doctor.distance} away</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <a
          href={`tel:${doctor.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-green-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-all"
        >
          <Phone size={13} />
          Call
        </a>
        <button
          onClick={() => alert(`Directions to: ${doctor.address}\n\n(Connect to Google Maps API for real directions)`)}
          className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-primary/40 hover:bg-secondary text-foreground py-2.5 rounded-xl text-xs font-medium transition-all"
        >
          <Navigation size={13} />
          Directions
        </button>
      </div>
    </div>
  );
}

// TODO: connect to Google Maps / Places API
// Replace this component with a real map (Leaflet, Google Maps, Mapbox) showing pinned doctor locations.
// Example: import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
function MapPlaceholder({ specialty }: { specialty: string }) {
  const pins = [
    { x: 25, y: 40, label: "GP" },
    { x: 55, y: 25, label: "Cardio" },
    { x: 70, y: 60, label: "Derm" },
    { x: 38, y: 70, label: "Dental" },
    { x: 80, y: 35, label: "Peds" },
    { x: 15, y: 65, label: "Neuro" },
    { x: 90, y: 55, label: "Ortho" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Map size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Nearby Doctors</span>
        </div>
        <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
          {/* TODO: connect to Google Maps/Places API */}
          Mock map — connect Maps API for live locations
        </div>
      </div>
      <div
        className="relative w-full h-52 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 30%, #a5d6a7 60%, #dcfce7 100%)",
        }}
      >
        {/* Grid lines */}
        {[20, 40, 60, 80].map((p) => (
          <div key={`h${p}`} className="absolute w-full border-t border-green-200/60" style={{ top: `${p}%` }} />
        ))}
        {[20, 40, 60, 80].map((p) => (
          <div key={`v${p}`} className="absolute h-full border-l border-green-200/60" style={{ left: `${p}%` }} />
        ))}

        {/* Road-like paths */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 50 Q25 45 50 50 T100 48" stroke="#b2dfdb" strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M30 0 Q35 30 30 50 T32 100" stroke="#b2dfdb" strokeWidth="1.5" fill="none" opacity="0.7" />
          <path d="M60 20 Q65 40 68 60 Q70 80 65 100" stroke="#b2dfdb" strokeWidth="1.5" fill="none" opacity="0.5" />
        </svg>

        {/* You marker */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div className="text-[8px] text-center mt-0.5 font-bold text-blue-600 whitespace-nowrap -translate-x-1/4">You</div>
        </div>

        {/* Doctor pins */}
        {pins.map((pin, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: "translate(-50%,-100%)" }}
          >
            <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-md flex items-center justify-center">
              <MapPin size={10} className="text-white" />
            </div>
            <div className="text-[7px] bg-white px-1.5 py-0.5 rounded-full shadow-sm mt-0.5 font-semibold text-primary whitespace-nowrap">
              {pin.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FindDoctors() {
  const [specialty, setSpecialty] = useState("All");

  const filtered =
    specialty === "All" ? doctors : doctors.filter((d) => d.specialty === specialty);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Find Doctors</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {filtered.length} {specialty === "All" ? "doctors" : specialty + "s"} nearby
        </p>
      </div>

      {/* Specialty filter */}
      <div className="flex flex-wrap gap-2">
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpecialty(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              specialty === s
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-secondary"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Map */}
      <MapPlaceholder specialty={specialty} />

      {/* Doctor grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <MapPin size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No doctors found for this specialty</p>
            <p className="text-sm mt-1">Try a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
