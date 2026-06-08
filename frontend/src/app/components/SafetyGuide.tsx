import { ShieldCheck, AlertTriangle, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function SafetyGuide() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Panduan Keselamatan Maritim (Standar BMKG)</h2>
      
      <div className="space-y-4">
        {/* Aman */}
        <div className="p-5 border border-green-200 bg-green-50 rounded-xl flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-green-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-green-800 text-lg">Aman / Tenang (0.1 - 0.5 meter)</h3>
            <p className="text-green-700 mt-1"><b>Kondisi:</b> Laut tenang. <br/><b>SOP:</b> Aman untuk semua jenis perahu, termasuk perahu tradisional berukuran kecil. Tetap bawa alat keselamatan dasar seperti <i>life jacket</i>.</p>
          </div>
        </div>

        {/* Waspada */}
        <div className="p-5 border border-yellow-200 bg-yellow-50 rounded-xl flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 text-lg">Waspada / Sedang (1.25 - 2.5 meter)</h3>
            <p className="text-yellow-700 mt-1"><b>Kondisi:</b> Gelombang mulai berisiko. <br/><b>SOP:</b> <span className="font-bold">Sangat Berbahaya bagi Perahu Nelayan Kecil / Tradisional.</span> Harap menunda pelayaran ke laut lepas. Pastikan radio komunikasi maritim selalu aktif.</p>
          </div>
        </div>

        {/* Bahaya */}
        <div className="p-5 border border-orange-200 bg-orange-50 rounded-xl flex items-start gap-4">
          <ShieldAlert className="w-8 h-8 text-orange-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-orange-800 text-lg">Bahaya / Tinggi (2.5 - 4.0 meter)</h3>
            <p className="text-orange-700 mt-1"><b>Kondisi:</b> Laut kasar. <br/><b>SOP:</b> <span className="font-bold">Berbahaya bagi Kapal Tongkang dan Kapal Feri Kecil.</span> Nelayan dilarang keras melaut. Pihak Syahbandar umumnya akan menunda izin berlayar.</p>
          </div>
        </div>

        {/* Sangat Bahaya */}
        <div className="p-5 border border-red-200 bg-red-50 rounded-xl flex items-start gap-4">
          <AlertOctagon className="w-8 h-8 text-red-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-800 text-lg">Sangat Bahaya / Sangat Tinggi (&gt; 4.0 meter)</h3>
            <p className="text-red-700 mt-1"><b>Kondisi:</b> Badai / Ekstrem. <br/><b>SOP:</b> <span className="font-bold">Berbahaya bagi Kapal Kargo dan Kapal Penumpang Besar.</span> Semua aktivitas maritim di area tersebut wajib dihentikan tanpa terkecuali.</p>
          </div>
        </div>
      </div>
    </div>
  );
}