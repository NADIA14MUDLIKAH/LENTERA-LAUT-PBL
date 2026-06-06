import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 1. Definisikan tipe data yang diterima dari API (App.tsx)
interface WeatherChartProps {
  marineData?: any[]; // Array data dari endpoint /marine-weather
}

// 2. Data default jika API sedang kosong/loading
const defaultData = [
  { hari: 'Sen', tinggiGelombang: 0.15, kecepatanAngin: 1.5, suhuLaut: 30 },
  { hari: 'Sel', tinggiGelombang: 0.12, kecepatanAngin: 1.2, suhuLaut: 30.5 },
  { hari: 'Rab', tinggiGelombang: 0.18, kecepatanAngin: 1.8, suhuLaut: 31 },
  { hari: 'Kam', tinggiGelombang: 0.10, kecepatanAngin: 1.3, suhuLaut: 31 },
];

export default function WeatherChart({ marineData = [] }: WeatherChartProps) {
  
  // 3. Memformat data API JSON menjadi format yang dimengerti oleh Recharts
  const formattedChartData = marineData.length > 0 
    ? marineData.map((item) => {
        // Mengubah format string waktu ISO dari API menjadi nama Hari + Jam (contoh: "Sen 14:00")
        const dateObj = new Date(item.time || item.time_prediction);
        const namaHari = dateObj.toLocaleDateString('id-ID', { weekday: 'short' });
        const jam = dateObj.getHours().toString().padStart(2, '0') + ':00';

        return {
          hari: `${namaHari} ${jam}`,
          // Menyesuaikan struktur JSON API Anda (sesuaikan key-nya jika berbeda)
          tinggiGelombang: item.wave_height?.value || item.wave_height || 0,
          kecepatanAngin: item.wind_speed_10m?.value || item.wind_speed || 0,
          suhuLaut: item.sea_surface_temperature?.value || item.temp || 0,
        };
      })
    : defaultData; // Gunakan default jika data API belum masuk

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Grafik Tren Cuaca Maritim</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="hari"
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: '12px', fontWeight: 500 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 500 }} iconType="line" />
          
          <Line
            type="monotone"
            dataKey="tinggiGelombang"
            stroke="#088395"
            strokeWidth={3}
            name="Tinggi Gelombang (m)"
            dot={{ fill: '#088395', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="kecepatanAngin"
            stroke="#05BFDB"
            strokeWidth={3}
            name="Kecepatan Angin (m/s)"
            dot={{ fill: '#05BFDB', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="suhuLaut"
            stroke="#FF6B6B"
            strokeWidth={3}
            name="Suhu Laut (°C)"
            dot={{ fill: '#FF6B6B', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#088395]"></div>
          <span>Prediksi 24 Jam Kedepan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span>Sumber: Model ML</span>
        </div>
      </div>
    </div>
  );
}