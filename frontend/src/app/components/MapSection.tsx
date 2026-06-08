import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";

const eastJavaBounds: LatLngBoundsExpression = [
  [-8.9, 110.8],
  [-6.6, 114.7]
];

interface MapSectionProps {
  locations: any[];
}

// Fungsi penentu warna berdasarkan status
const getMarkerColor = (status?: string) => {
  if (!status) return "bg-green-500"; // Default hijau jika belum ada status
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes("bahaya") || lowerStatus.includes("awas")) return "bg-red-500 animate-pulse";
  if (lowerStatus.includes("waspada")) return "bg-orange-500";
  return "bg-green-500";
};

export default function MapSection({ locations }: MapSectionProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="w-full h-[450px] rounded-lg overflow-hidden border border-gray-200 shadow-inner relative z-0">
        <MapContainer
          center={[-7.75, 112.75]}
          zoom={8}
          minZoom={7}
          maxBounds={eastJavaBounds}
          maxBoundsViscosity={1.0}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((loc, index) => {
            // Membuat Custom Marker HTML menggunakan Tailwind CSS
            const customIcon = L.divIcon({
              className: 'custom-icon', // hapus styling default leaflet
              html: `<div class="w-5 h-5 rounded-full border-2 border-white shadow-md ${getMarkerColor(loc.status)}"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            return (
              // [PERBAIKAN]: Menggunakan loc.latitude dan loc.longitude sesuai dengan output API FastAPI
              <Marker key={index} position={[loc.latitude, loc.longitude]} icon={customIcon}>
                <Popup>
                  <div className="font-bold text-[#088395]">{loc.name}</div>
                  <div className="text-xs text-gray-600">Lat: {loc.latitude}, Lon: {loc.longitude}</div>
                  {loc.status && <div className="text-xs font-semibold mt-1">Status: {loc.status}</div>}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}