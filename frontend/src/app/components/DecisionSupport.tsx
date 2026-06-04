import { CheckCircle2, Ship, AlertTriangle, Info } from 'lucide-react';

export default function DecisionSupport() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Pendukung Keputusan</h2>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Status: Berlayar Aman</h3>
            <p className="text-sm text-green-600 font-medium">Kondisi Tenang - Cuaca Mendukung</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <Ship className="w-5 h-5 text-green-700 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">Rekomendasi Pelayaran</h4>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Kapal Kecil:</strong> Diperbolehkan berlayar dengan kondisi aman</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Kapal Sedang & Besar:</strong> Beroperasi normal tanpa pembatasan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span><strong>Aktivitas Nelayan:</strong> Kondisi optimal untuk aktivitas penangkapan ikan</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Perhatian Khusus</h4>
            <p className="text-sm text-blue-800">
              Pantau kondisi cuaca setiap 3 jam. Gelombang berpotensi meningkat pada sore hari (14:00-16:00 WIB) di area barat daya Sumenep.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium text-gray-600">Tingkat Keamanan</span>
          </div>
          <p className="text-lg font-bold text-gray-900">Tinggi</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-gray-600">Jarak Pandang</span>
          </div>
          <p className="text-lg font-bold text-gray-900">10 km</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-xs font-medium text-gray-600">Durasi Berlaku</span>
          </div>
          <p className="text-lg font-bold text-gray-900">12 Jam</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Pembaruan Terakhir:</strong> 3 Juni 2026, 09:00 WIB | <strong>Sumber Data:</strong> BMKG & Sensor IoT Maritim
        </p>
      </div>
    </div>
  );
}
