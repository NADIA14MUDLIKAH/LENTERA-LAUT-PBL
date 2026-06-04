import { useState } from 'react';
import { Navigation, Waves, Wind, CloudRain, Thermometer, Eye } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MapSection from './components/MapSection';
import WeatherCard from './components/WeatherCard';
import WeatherChart from './components/WeatherChart';
import DecisionSupport from './components/DecisionSupport';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const weatherData = [
    {
      title: 'Arus Laut',
      value: 0.2,
      unit: 'm/s',
      icon: Navigation,
      category: 'Tenang',
      color: '#088395',
      direction: 45
    },
    {
      title: 'Tinggi Gelombang',
      value: 0.1,
      unit: 'm',
      icon: Waves,
      category: 'Ringan',
      color: '#05BFDB'
    },
    {
      title: 'Kecepatan Angin',
      value: 1.3,
      unit: 'm/s',
      icon: Wind,
      category: 'Sepoi-sepoi',
      color: '#37B7C3'
    },
    {
      title: 'Curah Hujan',
      value: 0,
      unit: 'mm',
      icon: CloudRain,
      category: 'Tidak Ada Hujan',
      color: '#71C9CE'
    },
    {
      title: 'Suhu Permukaan Laut',
      value: 31,
      unit: '°C',
      icon: Thermometer,
      category: 'Hangat',
      color: '#FF6B6B'
    },
    {
      title: 'Jarak Pandang',
      value: 10,
      unit: 'km',
      icon: Eye,
      category: 'Sangat Baik',
      color: '#4ECDC4'
    }
  ];

  return (
    <div className="size-full flex bg-gray-50">
      <Sidebar activeMenu={activeMenu} onMenuClick={setActiveMenu} />

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Header />

          <div className="mb-6">
            <MapSection />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parameter Cuaca Maritim</h2>
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
            <DecisionSupport />
          </div>
        </div>
      </main>
    </div>
  );
}