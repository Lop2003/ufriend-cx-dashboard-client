import { Customer } from '../types';
// @ts-ignore
import uFriendLogo from '../../Icon.png';

interface SidebarProps {
  currentPage: 'dashboard' | 'customer-detail' | 'add-feedback' | 'add-followup';
  onPageChange: (page: 'dashboard' | 'customer-detail' | 'add-feedback' | 'add-followup') => void;
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomerId: (id: string) => void;
}

export default function Sidebar({
  currentPage,
  onPageChange,
  customers,
  selectedCustomerId,
  onSelectCustomerId,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-gradient-to-b from-[#0B0080] via-[#0D009C] to-[#0051BA] rounded-[24px] flex flex-col justify-between shadow-[8px_8px_24px_rgba(0,29,66,0.15)] border border-primary/20 relative overflow-hidden shrink-0">
      {/* Decorative Premium Mesh Blurs */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header (Uses Modern Brand Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 gap-3">
          <img
            src={uFriendLogo}
            alt="uFriend CX Logo"
            className="w-8 h-8 rounded-xl object-contain shadow-md bg-white/15 p-1 border border-white/15 transform hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-white tracking-wide text-md">uFriend CX</span>
            <span className="text-[10px] text-sky-200/80 font-semibold tracking-wider uppercase">แผงควบคุมหลัก</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          <button
            onClick={() => onPageChange('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              currentPage === 'dashboard'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            แดชบอร์ด
          </button>

          <button
            onClick={() => onPageChange('add-feedback')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              currentPage === 'add-feedback'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            บันทึกคำติชม
          </button>

          <button
            onClick={() => {
              if (!selectedCustomerId && customers.length > 0) {
                onSelectCustomerId(customers[0].id);
              }
              onPageChange('add-followup');
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              currentPage === 'add-followup'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            บันทึกการติดตาม
          </button>
        </nav>
      </div>

      {/* Footer Info (User Identity Badge) */}
      <div className="p-4 border-t border-blue-900/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 text-blue-100 flex items-center justify-center border border-white/15">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">ผู้ตรวจสอบคนที่ 2</p>
            <p className="text-[10px] text-blue-300/60">บทบาท: ตรวจสอบความถูกต้อง</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
