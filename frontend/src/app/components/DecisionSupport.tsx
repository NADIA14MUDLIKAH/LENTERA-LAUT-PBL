import { CheckCircle2, Ship, AlertTriangle, Info } from 'lucide-react';

// 1. Definisikan tipe data Props yang akan diterima dari App.tsx
interface DecisionSupportProps {
  warningStatus?: {
    status: string;
    deskripsi: string;
  };
}

export default function DecisionSupport({ warningStatus }: DecisionSupportProps) {
  // 2. Tentukan status default jika data belum dimuat (sebelum pengguna mencari lokasi)
  const currentStatus = warningStatus?.status?.toLowerCase() || 'aman';
  const deskripsi = warningStatus?.deskripsi || 'Kondisi Tenang - Cuaca Mendukung. Masukkan lokasi untuk melihat prediksi.';

  // 3. Logika untuk mengubah warna dan ikon berdasarkan status SPK
  const isWaspada = currentStatus === 'waspada';
  const isBahaya = currentStatus === 'bahaya' || currentStatus === 'buruk';

  // Konfigurasi Tema Otomatis
  const theme = {
    icon: isBahaya ? AlertTriangle : isWaspada ? AlertTriangle : CheckCircle2,
    iconColor: isBahaya ? 'text-red-600' : isWaspada ? 'text-amber-600' : 'text-green-600',
    iconBg: isBahaya ? 'bg-red-100' : isWaspada ? 'bg-amber-100' : 'bg-green-100',
    boxBg: isBahaya ? 'bg-gradient-to-r from-red-50 to-rose-50' : isWaspada ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gradient-to-r from-green-50 to-emerald-50',
    borderColor: isBahaya ? 'border-red-500' : isWaspada ? 'border-amber-500' : 'border-green-500',
    titleColor: isBahaya ? 'text-red-900' : isWaspada ? 'text-amber-900' : 'text-green-900',
    textColor: isBahaya ? 'text-red-800' : isWaspada ? 'text-amber-800' : 'text-green-800',
    bulletColor: isBahaya ? 'text-red-600' : isWaspada ? 'text-amber-600' : 'text-green-600',
    titleText: isBahaya ? 'Status: Bahaya Berlayar!' : isWaspada ? 'Status: Waspada' : 'Status: Berlayar Aman',
    securityLevel: isBahaya ? 'Rendah (Bahaya)' : isWaspada ? 'Menengah (Hati-hati)' : 'Tinggi (Aman)'
  };

  const StatusIcon = theme.icon;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Pendukung Keputusan</h2>

      <div className="mb-6">
        {/* Bagian Header Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${theme.iconBg}`}>
            <StatusIcon className={`w-6 h-6 ${theme.iconColor}`} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{theme.titleText}</h3>
            {/* Menggunakan deskripsi dari API */}
            <p className={`text-sm font-medium ${theme.iconColor}`}>{deskripsi}</p>
          </div>
        </div>

        {/* Bagian Rekomendasi Pelayaran Dinamis */}
        <div className={`${theme.boxBg} border-l-4 ${theme.borderColor} p-4 rounded-lg`}>
          <div className="flex items-start gap-2 mb-3">
            <Ship className={`w-5 h-5 mt-0.5 ${theme.titleColor}`} />
            <div>
              <h4 className={`font-semibold mb-2 ${theme.titleColor}`}>Rekomendasi Pelayaran</h4>
              <ul className={`space-y-2 text-sm ${theme.textColor}`}>
                <li className="flex items-start gap-2">
                  <span className={`${theme.bulletColor} mt-0.5`}>•</span>
                  <span>
                    <strong>Kapal Kecil:</strong> {isBahaya ? 'Dilarang keras berlayar' : isWaspada ? 'Sangat berisiko, tunda pelayaran' : 'Diperbolehkan berlayar dengan kondisi aman'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className={`${theme.bulletColor} mt-0.5`}>•</span>
                  <span>
                    <strong>Kapal Sedang & Besar:</strong> {isBahaya ? 'Perlu kewaspadaan ekstra dan pertimbangan matang' : isWaspada ? 'Beroperasi dengan hati-hati' : 'Beroperasi normal tanpa pembatasan'}
                  </span>
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
            <h4 className="font-semibold text-blue-900 mb-1">Catatan Sistem</h4>
            <p className="text-sm text-blue-800">
              Rekomendasi di atas dihasilkan otomatis oleh model machine learning berdasarkan prediksi parameter maritim terkini. Selalu pantau informasi resmi BMKG.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isBahaya ? 'bg-red-500' : isWaspada ? 'bg-amber-500' : 'bg-green-500'}`}></div>
            <span className="text-xs font-medium text-gray-600">Tingkat Keamanan</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{theme.securityLevel}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs font-medium text-gray-600">Sumber Data</span>
          </div>
          <p className="text-sm font-bold text-gray-900 mt-1">API Lentera Laut</p>
        </div>
      </div>
    </div>
  );
}