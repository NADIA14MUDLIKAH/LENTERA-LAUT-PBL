import { Anchor, LayoutDashboard, Map, Brain, FileText, Settings } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dasbor', icon: LayoutDashboard },
    { id: 'map', label: 'Peta Interaktif', icon: Map },
    { id: 'decision', label: 'Sistem Keputusan', icon: Brain },
    { id: 'report', label: 'Laporan Cuaca', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#0A4D68] h-full flex flex-col text-white">
      <div className="p-6 flex flex-col items-center border-b border-[#0B5C7F]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#088395] to-[#05BFDB] flex items-center justify-center mb-3 shadow-lg">
          <Anchor className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-semibold text-center">Lentera Laut</h1>
        <p className="text-xs text-[#7DD3E8] mt-1">Sistem Prediksi Cuaca Maritim</p>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                isActive
                  ? 'bg-[#088395] text-white shadow-md'
                  : 'text-[#B4DFE5] hover:bg-[#0B5C7F] hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#0B5C7F]">
        <div className="text-xs text-[#7DD3E8]">
          <p>© 2026 Lentera Laut</p>
          <p className="mt-1">Sistem Pendukung Keputusan Maritim</p>
        </div>
      </div>
    </div>
  );
}
