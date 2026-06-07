import { useState, useEffect } from 'react';
import { Navigation, Waves, Wind, CloudRain, Thermometer, Eye, History, Settings } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapSection from './components/MapSection';
import WeatherCard from './components/WeatherCard';
import WeatherChart from './components/WeatherChart';
import DecisionSupport from './components/DecisionSupport';
import SafetyGuide from './components/SafetyGuide';

// Import KETIGA fungsi API
import { fetchPrediction, fetchLocations, fetchHistory } from './services/api';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const [locations, setLocations] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]); // State khusus untuk grafik gabungan
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      const locData = await fetchLocations();
      if (locData && locData.length > 0) {
        setLocations(locData);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async (locationName: string, date: string) => {
    setIsLoading(true);
    setError('');

    try {
      // Menjalankan API Prediksi dan Histori secara bersamaan (Paralel)
      const [predData, histData] = await Promise.all([
        fetchPrediction(locationName),
        fetchHistory(locationName, 5) // Ambil 5 data ke belakang
      ]);

      setPredictionData(predData);

      // Gabungkan array history (masa lalu) dengan prediction (masa depan)
      const historyArray = histData?.history || [];
      const combinedData = [...historyArray, predData.prediction];
      setChartData(combinedData); // Oper ini ke WeatherChart!

    } catch (err) {
      setError('Gagal mengambil data. Pastikan server API menyala.');
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

  // RENDER BERSIH (Sesuai Sidebar yang dibutuhkan saja)
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <>
            <Header onSearch={handleSearch} isLoading={isLoading} locations={locations} />
            {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

            <div className="mb-6">
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
                  <WeatherCard key={index} {...data} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* OPERKAN DATA GABUNGAN KE CHART */}
              <WeatherChart marineData={chartData} />
              <DecisionSupport warningStatus={predictionData?.prediction?.warning_status} />
            </div>
          </>
        );

      case 'history':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Cuaca Lanjutan</h1>
            <p className="text-gray-500 max-w-md">Laporan bulanan dan data unduhan lengkap akan segera hadir.</p>
          </div>
        );

      case 'guide':
        // MERENDER KOMPONEN SAFETY GUIDE YANG BARU KITA BUAT
        return <SafetyGuide />;

      case 'settings':
        return (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Pengaturan Sistem</h1>
            <p className="text-gray-500 max-w-md">Konfigurasi akun dan preferensi batas peringatan.</p>
          </div>
        );

      default:
        return <div>Halaman tidak ditemukan.</div>;
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}