import { CheckCircle2, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

interface DecisionSupportProps {
  warningStatus?: {
    status: string;
    deskripsi: string;
  };
}

export default function DecisionSupport({ warningStatus }: DecisionSupportProps) {
  // Tampilan default jika user belum mencari lokasi
  if (!warningStatus) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-teal-600" /> Sistem Pendukung Keputusan
        </h2>
        <p className="text-gray-500">Pilih lokasi dan cari prediksi untuk melihat rekomendasi keselamatan layar.</p>
      </div>
    );
  }

  // Menentukan warna dan ikon berdasarkan kata kunci pada status
  const statusLower = warningStatus.status.toLowerCase();
  let bgColor = "bg-green-50";
  let borderColor = "border-green-200";
  let textColor = "text-green-800";
  let Icon = CheckCircle2;

  if (statusLower.includes("waspada")) {
    bgColor = "bg-orange-50";
    borderColor = "border-orange-200";
    textColor = "text-orange-800";
    Icon = AlertTriangle;
  } else if (statusLower.includes("bahaya") || statusLower.includes("awas")) {
    bgColor = "bg-red-50";
    borderColor = "border-red-200";
    textColor = "text-red-800";
    Icon = ShieldAlert;
  }

  return (
    <div className={`p-6 rounded-xl shadow-sm border ${borderColor} ${bgColor}`}>
      <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textColor}`}>
        <Icon className="w-6 h-6" /> Status: {warningStatus.status}
      </h2>
      <div className="bg-white/60 p-4 rounded-lg">
        <p className="text-gray-800 font-medium leading-relaxed">
          {warningStatus.deskripsi}
        </p>
      </div>
    </div>
  );
}