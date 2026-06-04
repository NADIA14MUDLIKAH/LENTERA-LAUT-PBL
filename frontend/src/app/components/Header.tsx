import { Calendar, MapPin, AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [selectedDate, setSelectedDate] = useState('3 Juni 2026');
  const [selectedLocation, setSelectedLocation] = useState('Sumenep');
  const [selectedWarning, setSelectedWarning] = useState('Semua');

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Prediksi Cuaca Laut & Sistem Pendukung Keputusan
      </h1>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Tanggal
          </label>
          <div className="relative">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-[#088395] focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-colors"
            >
              <option>3 Juni 2026</option>
              <option>4 Juni 2026</option>
              <option>5 Juni 2026</option>
              <option>6 Juni 2026</option>
              <option>7 Juni 2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Lokasi
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-[#088395] focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-colors"
            >
              <option>Sumenep</option>
              <option>Surabaya</option>
              <option>Probolinggo</option>
              <option>Banyuwangi</option>
              <option>Gresik</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex-1 min-w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Tingkat Peringatan
          </label>
          <div className="relative">
            <select
              value={selectedWarning}
              onChange={(e) => setSelectedWarning(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-[#088395] focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-colors"
            >
              <option>Semua</option>
              <option>Rendah</option>
              <option>Sedang</option>
              <option>Tinggi</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
