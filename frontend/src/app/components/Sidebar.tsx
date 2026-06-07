import { Anchor, LayoutDashboard, History, LifeBuoy } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  // Hanya menyisakan 3 menu yang fungsional dan relevan
  const menuItems = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: LayoutDashboard },
    { id: 'history', label: 'Riwayat Prediksi', icon: History },
    { id: 'guide', label: 'Panduan Keselamatan', icon: LifeBuoy },
  ];

  return (
    <div className="w-64 bg-[#0A4D68] h-full flex flex-col text-white shadow-xl z-10">
      <div className="p-6 flex flex-col items-center border-b border-[#0B5C7F]/50">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#088395] to-[#05BFDB] flex items-center justify-center mb-3 shadow-lg border-2 border-white/10">
          <Anchor className="w-10 h-10 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-wide text-center">Lentera Laut</h1>
        <p className="text-xs text-[#7DD3E8] mt-1 font-medium">Sistem Prediksi Maritim</p>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#088395] to-[#0B5C7F] text-white shadow-md font-semibold'
                  : 'text-[#B4DFE5] hover:bg-[#0B5C7F]/40 hover:text-white font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-[#0B5C7F]/50 bg-[#083D53]">
        <div className="text-xs text-[#7DD3E8]/70 text-center">
          <p className="font-semibold text-[#7DD3E8]">© 2026 Lentera Laut</p>
          <p className="mt-1">Marine Decision Support</p>
        </div>
      </div>
    </div>
  );
}