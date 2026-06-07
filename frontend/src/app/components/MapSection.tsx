import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngBoundsExpression } from "leaflet";
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Memperbaiki bug icon Leaflet yang hilang di Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const eastJavaBounds: LatLngBoundsExpression = [
  [-8.9, 110.8], 
  [-6.6, 114.7]  
];

interface MapSectionProps {
  locations: any[]; // Menerima data lokasi dari App.tsx
}

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

          {/* Menggambar pin marker otomatis dari API */}
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lon]}>
              <Popup>
                <div className="font-bold text-[#088395]">{loc.name}</div>
                <div className="text-xs text-gray-600">Lat: {loc.lat}</div>
                <div className="text-xs text-gray-600">Lon: {loc.lon}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}