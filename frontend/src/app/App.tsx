import { useState, useEffect } from 'react';
import { Navigation, Waves, Wind, CloudRain, Thermometer, Eye } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapSection from './components/MapSection';
import WeatherCard from './components/WeatherCard';
import WeatherChart from './components/WeatherChart';
import DecisionSupport from './components/DecisionSupport';

// Import kedua fungsi API
import { fetchPrediction, fetchLocations } from './services/api';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // State Global
  const [locations, setLocations] = useState<any[]>([]); // Untuk menyimpan daftar titik Jatim
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Ambil data lokasi saat web pertama kali dibuka
  useEffect(() => {
    const loadInitialData = async () => {
      const locData = await fetchLocations();
      if (locData && locData.length > 0) {
        setLocations(locData);
      }
    };
    loadInitialData();
  }, []);

  // 2. Fungsi dipanggil saat tombol cari di Header diklik
  const handleSearch = async (locationName: string, date: string) => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchPrediction(locationName);
      setPredictionData(data);
    } catch (err) {
      setError('Gagal mengambil data prediksi. Pastikan server API menyala.');
    } finally {
      setIsLoading(false);
    }
  };

  const weatherData = predictionData ? [
    { title: 'Arus Laut', value: predictionData.prediction.ocean_current_velocity.value, unit: predictionData.prediction.ocean_current_velocity.satuan, icon: Navigation, category: '-', color: '#088395', direction: 45 },
    { title: 'Tinggi Gelombang', value: predictionData.prediction.wave_height.value, unit: predictionData.prediction.wave_height.satuan, icon: Waves, category: predictionData.prediction.wave_height.kategori, color: '#05BFDB' },
    { title: 'Kecepatan Angin', value: predictionData.prediction.wind_speed_10m.value, unit: predictionData.prediction.wind_speed_10m.satuan, icon: Wind, category: predictionData.prediction.wind_speed_10m.kategori, color: '#37B7C3' },
    { title: 'Curah Hujan', value: predictionData.prediction.precipitation.value, unit: predictionData.prediction.precipitation.satuan, icon: CloudRain, category: predictionData.prediction.precipitation.kategori, color: '#71C9CE' },
    { title: 'Suhu Permukaan Laut', value: predictionData.prediction.sea_surface_temperature.value, unit: predictionData.prediction.sea_surface_temperature.satuan, icon: Thermometer, category: '-', color: '#FF6B6B' },
    { title: 'Jarak Pandang', value: predictionData.prediction.visibility.value, unit: predictionData.prediction.visibility.satuan, icon: Eye, category: predictionData.prediction.visibility.kategori, color: '#4ECDC4' }
  ] : [
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
          
          {/* Header menerima prop locations dan form submission */}
          <Header onSearch={handleSearch} isLoading={isLoading} locations={locations} />

          {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

          <div className="mb-6">
            {/* Map menerima prop locations untuk merender titik */}
            <MapSection locations={locations} />
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
            
            {/* Mengoper warning_status ke DecisionSupport */}
            <DecisionSupport
              warningStatus={predictionData?.prediction?.warning_status}
            />
          </div>
        </div>
      </main>
    </div>
  );
}