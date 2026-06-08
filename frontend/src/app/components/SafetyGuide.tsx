import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function SafetyGuide() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Panduan Keselamatan Maritim Lentera Laut</h2>
      
      <div className="space-y-4">
        {/* Aman */}
        <div className="p-5 border border-green-200 bg-green-50 rounded-xl flex items-start gap-4">
          <ShieldCheck className="w-8 h-8 text-green-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-green-800 text-lg">Aman (&lt; 1.5 meter)</h3>
            <p className="text-green-700 mt-1">
              <b>Kondisi:</b> Kondisi laut relatif aman untuk aktivitas melaut nelayan pesisir. <br/>
              <b>SOP:</b> Aman untuk perahu tradisional berukuran kecil. Tetap patuhi protokol standar dan pastikan selalu membawa alat keselamatan dasar seperti <i>life jacket</i>.
            </p>
          </div>
        </div>

        {/* Waspada */}
        <div className="p-5 border border-yellow-200 bg-yellow-50 rounded-xl flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-yellow-800 text-lg">Waspada (1.5 - 2.0 meter)</h3>
            <p className="text-yellow-700 mt-1">
              <b>Kondisi:</b> Gelombang berisiko bagi kapal nelayan kecil dan perahu tradisional. <br/>
              <b>SOP:</b> <span className="font-bold">Sangat disarankan untuk menunda pelayaran ke laut lepas.</span> Pastikan peralatan navigasi dan radio komunikasi maritim selalu aktif jika terpaksa beroperasi di sekitar pesisir.
            </p>
          </div>
        </div>

        {/* Bahaya */}
        <div className="p-5 border border-red-200 bg-red-50 rounded-xl flex items-start gap-4">
          <AlertOctagon className="w-8 h-8 text-red-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-800 text-lg">Bahaya (&gt; 2.0 meter)</h3>
            <p className="text-red-700 mt-1">
              <b>Kondisi:</b> Gelombang melampaui 2 meter. Berpotensi membahayakan seluruh jenis kapal. <br/>
              <b>SOP:</b> <span className="font-bold">Dilarang keras melaut bagi perahu nelayan kecil maupun sedang.</span> Pihak Syahbandar wajib menunda izin berlayar hingga kondisi tinggi gelombang kembali stabil di bawah 1.5 meter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}