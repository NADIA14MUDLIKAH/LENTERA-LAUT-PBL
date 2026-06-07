import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngBoundsExpression } from "leaflet";

// 1. LETAKKAN BOUNDS JAWA TIMUR DI LUAR KOMPONEN (Paling Atas)
const eastJavaBounds: LatLngBoundsExpression = [
  [-8.9, 110.8], // Batas Barat Daya
  [-6.6, 114.7]  // Batas Timur Laut
];

export default function MapSection() {
  // Tempatkan state Anda di sini (misal untuk data lokasi dari API)
  const [locations, setLocations] = useState([]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* MAP CONTAINER (DIKUNCI KE JAWA TIMUR) */}
      <div className="w-full h-[450px] rounded-lg overflow-hidden border border-gray-200 shadow-inner">
        <MapContainer
          center={[-7.75, 112.75]} // Titik tengah Jatim
          zoom={8}                 // Zoom level awal
          minZoom={7}              // Batas zoom out maksimal
          maxBounds={eastJavaBounds} // Mengunci peta di area Jatim
          maxBoundsViscosity={1.0}   // Efek membal kuat jika digeser keluar batas
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render marker lokasi Anda di sini */}

        </MapContainer>
      </div>
    </div>
  );
}