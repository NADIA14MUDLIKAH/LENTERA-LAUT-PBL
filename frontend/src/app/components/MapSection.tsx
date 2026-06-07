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
  
  // 2. AMBIL TANGGAL HARI INI DI DALAM KOMPONEN
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* JUDUL SECTION */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sistem Pendukung Keputusan</h2>

      {/* 3. BARIS INPUT (TANGGAL, LOKASI, TOMBOL CARI SEJAJAR) */}
      <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
        
        {/* Input Tanggal */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">📅 Tanggal</label>
          <input 
            type="date" 
            min={today} // Membatasi tanggal mulai hari ini
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Dropdown Lokasi (Input search text & Dropdown Peringatan lama sudah dihapus) */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">📍 Lokasi Perairan</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none"
          >
            <option value="">-- Pilih Lokasi --</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Gresik">Gresik</option>
            <option value="Banyuwangi">Banyuwangi</option>
            <option value="Tuban">Tuban</option>
            <option value="Madura">Selat Madura</option>
          </select>
        </div>

        {/* Tombol Cari Prediksi (Sejajar di paling kanan) */}
        <div className="w-full md:w-1/3">
          <button 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium p-2 rounded-md transition-colors shadow-sm"
          >
            Cari Prediksi
          </button>
        </div>

      </div>

      {/* 4. KOPLENG MAP CONTAINER (DIKUNCI KE JAWA TIMUR) */}
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