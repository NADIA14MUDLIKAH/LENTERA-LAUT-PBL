import { Search, Plus, Minus, Layers, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchLocations } from '../services/api';

// Perbaikan bug icon default Leaflet di React/Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Tipe data berdasarkan JSON Swagger Anda
interface LocationData {
  id_location: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function MapSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('Memuat peta...');

  // Mengambil data lokasi saat komponen pertama kali dimuat
  useEffect(() => {
    async function getLocations() {
      const data = await fetchLocations();
      setLocations(data);
      if (data.length > 0) {
        setSelectedLocation('Pilih titik di peta');
      } else {
        setSelectedLocation('Gagal memuat lokasi');
      }
    }
    getLocations();
  }, []);

  // Pusat awal peta (koordinat Jawa Timur)
  const centerPos: [number, number] = [-7.5360639, 112.2384017]; 

  return (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      
      {/* UI Overlay: Bar Pencarian */}
      <div className="absolute top-4 left-4 z-[400] w-72">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Lokasi Peta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#088395] focus:border-transparent"
          />
        </div>
      </div>

      {/* Kontainer Peta Interaktif Leaflet */}
      <div className="h-[450px] w-full z-0">
        <MapContainer 
          center={centerPos} 
          zoom={8} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Mapping marker berdasarkan data API */}
          {locations.map((loc) => (
            <Marker 
              key={loc.id_location} 
              position={[loc.latitude, loc.longitude]}
              eventHandlers={{
                click: () => {
                  setSelectedLocation(loc.name);
                },
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong className="block text-[#088395]">{loc.name}</strong>
                  <span className="text-xs text-gray-500">Lat: {loc.latitude.toFixed(2)}, Lon: {loc.longitude.toFixed(2)}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* UI Overlay: Indikator Lokasi Terpilih */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-100 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-[#088395]" />
        <span className="text-sm font-semibold text-gray-800">
          Titik: {selectedLocation}
        </span>
      </div>
    </div>
  );
}