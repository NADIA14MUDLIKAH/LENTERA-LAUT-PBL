import { useState } from 'react';
import { Navigation, Waves, Wind, CloudRain, Thermometer, Eye } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapSection from './components/MapSection';
import WeatherCard from './components/WeatherCard';
import WeatherChart from './components/WeatherChart';
import DecisionSupport from './components/DecisionSupport';

// PENTING: Impor fungsi fetch dari service API yang sudah dibuat
import { fetchPrediction } from './services/api'; 

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  
  // 1. State untuk integrasi API
  const [locationInput, setLocationInput] = useState('');
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Fungsi untuk menangani pencarian (Submit)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationInput) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await fetchPrediction(locationInput);
      setPredictionData(data);
    } catch (err) {
      setError('Gagal mengambil data prediksi. Pastikan server API menyala.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Logika Data Dinamis (Jika API sukses, pakai data API. Jika tidak, pakai default)
  const weatherData = predictionData ? [
    {
      title: 'Arus Laut',
      value: predictionData.prediction.ocean_current_velocity.value,
      unit: predictionData.prediction.ocean_current_velocity.satuan,
      icon: Navigation,
      category: '-', // Jika tidak ada di JSON, kosongi atau beri nilai default
      color: '#088395',
      direction: 45 // Sesuaikan jika API nantinya mengirim data arah arus
    },
    {
      title: 'Tinggi Gelombang',
      value: predictionData.prediction.wave_height.value,
      unit: predictionData.prediction.wave_height.satuan,
      icon: Waves,
      category: predictionData.prediction.wave_height.kategori,
      color: '#05BFDB'
    },
    {
      title: 'Kecepatan Angin',
      value: predictionData.prediction.wind_speed_10m.value,
      unit: predictionData.prediction.wind_speed_10m.satuan,
      icon: Wind,
      category: predictionData.prediction.wind_speed_10m.kategori,
      color: '#37B7C3'
    },
    {
      title: 'Curah Hujan',
      value: predictionData.prediction.precipitation.value,
      unit: predictionData.prediction.precipitation.satuan,
      icon: CloudRain,
      category: predictionData.prediction.precipitation.kategori,
      color: '#71C9CE'
    },
    {
      title: 'Suhu Permukaan Laut',
      value: predictionData.prediction.sea_surface_temperature.value,
      unit: predictionData.prediction.sea_surface_temperature.satuan,
      icon: Thermometer,
      category: '-', 
      color: '#FF6B6B'
    },
    {
      title: 'Jarak Pandang',
      value: predictionData.prediction.visibility.value,
      unit: predictionData.prediction.visibility.satuan,
      icon: Eye,
      category: predictionData.prediction.visibility.kategori,
      color: '#4ECDC4'
    }
  ] : [
    // Ini adalah data default/statis saat web pertama kali dimuat (sebelum mencari lokasi)
    { title: 'Arus Laut', value: 0.2, unit: 'm/s', icon: Navigation, category: 'Tenang', color: '#088395', direction: 45 },
    { title: 'Tinggi Gelombang', value: 0.1, unit: 'm', icon: Waves, category: 'Ringan', color: '#05BFDB' },
    { title: 'Kecepatan Angin', value: 1.3, unit: 'm/s', icon: Wind, category: 'Sepoi-sepoi', color: '#37B7C3' },
    { title: 'Curah Hujan', value: 0, unit: 'mm', icon: CloudRain, category: 'Tidak Ada Hujan', color: '#71C9CE' },
    { title: 'Suhu Permukaan Laut', value: 31, unit: '°C', icon: Thermometer, category: 'Hangat', color: '#FF6B6B' },
    { title: 'Jarak Pandang', value: 10, unit: 'km', icon: Eye, category: 'Sangat Baik', color: '#4ECDC4' }
  ];

  return (
    <div className="size-full flex bg-gray-50">
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Header />

          {/* 4. Form Pencarian Lokasi */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleSearch} className="flex gap-4">
              <input 
                type="text"
                placeholder="Masukkan lokasi (contoh: Grajagan, Sendang Biru...)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#05BFDB]"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-[#088395] text-white rounded-lg hover:bg-opacity-90 transition-all font-medium disabled:opacity-50"
              >
                {isLoading ? 'Mengambil Data...' : 'Cari Prediksi'}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-6">
            <MapSection />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Parameter Cuaca Maritim {predictionData ? `- ${predictionData.location.name}` : ''}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weatherData.map((data, index) => (
                <WeatherCard
                  key={index}
                  title={data.title}
                  value={data.value}
                  unit={data.unit}
                  icon={data.icon}
                  category={data.category}
                  color={data.color}
                  direction={data.direction}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherChart />
            {/* 5. Oper data SPK ke komponen DecisionSupport jika sudah tersedia */}
            <DecisionSupport 
              warningStatus={predictionData?.prediction?.warning_status} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}