import { Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onSearch: (location: string, date: string) => void;
  isLoading: boolean;
  locations: any[]; // Menerima data dinamis dari App.tsx
}

export default function Header({ onSearch, isLoading, locations }: HeaderProps) {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedLocation, setSelectedLocation] = useState('Surabaya');

  // Mengatur nilai default dropdown jika data lokasi dari API sudah masuk
  useEffect(() => {
    if (locations.length > 0 && !locations.find(l => l.name === selectedLocation)) {
      setSelectedLocation(locations[0].name);
    }
  }, [locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedLocation, selectedDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Prediksi Cuaca Laut & Sistem Pendukung Keputusan
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#088395]" /> Tanggal
          </label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088395]"
          />
        </div>

        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#088395]" /> Lokasi Perairan
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#088395]"
          >
            {/* Opsi lokasi otomatis dirender dari database API */}
            {locations.length > 0 ? (
              locations.map((loc, index) => (
                <option key={index} value={loc.name}>{loc.name}</option>
              ))
            ) : (
              <option value="Surabaya">Surabaya</option> // Fallback
            )}
          </select>
        </div>

        <div className="w-full md:w-1/3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-2.5 bg-[#088395] text-white rounded-lg hover:bg-opacity-90 font-medium disabled:opacity-50"
          >
            {isLoading ? 'Mengambil Data...' : 'Cari Prediksi'}
          </button>
        </div>
      </form>
    </div>
  );
}