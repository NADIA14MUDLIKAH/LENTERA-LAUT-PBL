import { Search, Plus, Minus, Layers, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function MapSection() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="absolute top-4 left-4 z-10 w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-transparent"
          />
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200">
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200">
          <Minus className="w-5 h-5 text-gray-700" />
        </button>
        <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 border border-gray-200">
          <Layers className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="relative h-96 bg-gradient-to-br from-[#B4DFE5] to-[#D2E9E9]">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#05BFDB', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#088395', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#0A4D68', stopOpacity: 0.4 }} />
            </linearGradient>
          </defs>

          <rect width="800" height="400" fill="url(#oceanGradient)" />

          <path
            d="M 150 100 Q 250 80, 350 120 T 550 140 L 580 160 L 600 180 Q 620 200, 640 240 L 650 280 L 640 320 L 620 350 L 580 380 L 500 400 L 400 400 L 300 390 L 200 370 L 150 340 Q 120 300, 110 250 L 100 200 Q 110 150, 150 100 Z"
            fill="#8DB596"
            opacity="0.7"
          />

          <path
            d="M 150 100 Q 250 80, 350 120 T 550 140 L 580 160 L 600 180 Q 620 200, 640 240 L 650 280 L 640 320 L 620 350 L 580 380 L 500 400 L 400 400 L 300 390 L 200 370 L 150 340 Q 120 300, 110 250 L 100 200 Q 110 150, 150 100 Z"
            fill="none"
            stroke="#5A8F69"
            strokeWidth="2"
            opacity="0.5"
          />

          <text x="300" y="250" fill="#2D5F3F" fontSize="16" fontWeight="bold">
            JAWA TIMUR
          </text>

          <g transform="translate(520, 280)">
            <circle cx="0" cy="0" r="8" fill="#0A4D68" />
            <circle cx="0" cy="0" r="12" fill="#088395" opacity="0.3" />
            <circle cx="0" cy="0" r="16" fill="#05BFDB" opacity="0.2" />
            <path d="M 0 -15 L -3 -8 L 3 -8 Z" fill="#FF6B6B" />
            <rect x="-1.5" y="-8" width="3" height="8" fill="#FF6B6B" />
          </g>

          <g transform="translate(520, 260)">
            <text x="0" y="0" fill="#0A4D68" fontSize="13" fontWeight="bold" textAnchor="middle">
              Sumenep
            </text>
          </g>

          <path d="M 100 150 Q 150 140, 200 155" stroke="#0A4D68" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M 250 180 Q 300 170, 350 185" stroke="#0A4D68" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M 450 220 Q 500 210, 550 225" stroke="#0A4D68" strokeWidth="1" fill="none" opacity="0.3" />
        </svg>
      </div>

      <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#088395]" />
        <span className="text-sm font-medium text-gray-700">Lokasi Terpilih: Sumenep</span>
      </div>
    </div>
  );
}
