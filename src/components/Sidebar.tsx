import useCX from '../hooks/useCX';
import uFriendLogo from '../../Icon.png';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const { currentPage, setCurrentPage, setSelectedCustomerId } = useCX();

  return (
    <aside
      className={`bg-gradient-to-b from-[#0B0080] via-[#0D009C] to-[#0051BA] flex flex-col justify-between shadow-[8px_8px_24px_rgba(0,29,66,0.15)] border border-primary/20 overflow-hidden shrink-0 transition-all duration-300 ease-in-out z-50
        fixed md:relative inset-y-0 left-0 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-64 md:w-20' : 'w-64'} ${
          isMobileOpen ? 'rounded-none shadow-2xl h-full' : 'rounded-[24px]'
        }`}
    >
      {/* Decorative Premium Mesh Blurs */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header (Logo + Brand + Integrated Sleek Toggle Button) */}
        <div
          className={`border-b border-white/10 flex transition-all duration-300 ${
            isCollapsed 
              ? 'h-24 flex-col items-center justify-center gap-2 px-0 py-3 md:px-0 md:py-3' 
              : 'h-16 flex-row items-center justify-between px-6'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={uFriendLogo}
              alt="uFriend CX Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md bg-white/15 p-1 border border-white/15 transform hover:scale-110 transition-transform duration-300 shrink-0"
            />
            <div
              className={`flex flex-col transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'md:max-w-0 md:opacity-0 md:pointer-events-none' : 'max-w-[150px] opacity-100'
              }`}
            >
              <span className="font-display font-bold text-white tracking-wide text-md">uFriend CX</span>
              <span className="text-[10px] text-sky-200/80 font-semibold tracking-wider uppercase">แผงควบคุมหลัก</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 🛠️ Integrated Premium Toggle Sidebar Button */}
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? "ขยายแถบเมนูข้าง" : "พับแถบเมนูข้าง"}
              className="hidden md:flex rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sky-100 items-center justify-center transition-all cursor-pointer hover:text-white shrink-0 active:scale-95 w-7 h-7"
            >
              <svg
                className={`w-3.5 h-3.5 transform transition-transform duration-300 ease-out ${
                  isCollapsed ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            {/* Mobile Close Button (Shown only on Mobile Drawer) */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                title="ปิดแถบเมนู"
                className="md:hidden rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-sky-100 flex items-center justify-center transition-all cursor-pointer hover:text-white shrink-0 active:scale-95 w-7 h-7"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className={`p-4 space-y-1.5 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {/* แดชบอร์ด */}
          <button
            onClick={() => setCurrentPage('dashboard')}
            title="แดชบอร์ด"
            className={`flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              isCollapsed ? 'w-10 h-10 justify-center p-0 border-l-0' : 'w-full gap-3 px-4 py-2.5'
            } ${
              currentPage === 'dashboard'
                ? isCollapsed
                  ? 'bg-white/10 text-white shadow-inner scale-105 border-white/20'
                  : 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[150px] opacity-100'
              }`}
            >
              แดชบอร์ด
            </span>
          </button>

          {/* รายชื่อลูกค้า */}
          <button
            onClick={() => setCurrentPage('customers')}
            title="รายชื่อลูกค้า"
            className={`flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              isCollapsed ? 'w-10 h-10 justify-center p-0 border-l-0' : 'w-full gap-3 px-4 py-2.5'
            } ${
              currentPage === 'customers'
                ? isCollapsed
                  ? 'bg-white/10 text-white shadow-inner scale-105 border-white/20'
                  : 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[150px] opacity-100'
              }`}
            >
              รายชื่อลูกค้า
            </span>
          </button>

          {/* บันทึกคำติชม */}
          <button
            onClick={() => {
              setSelectedCustomerId('');
              setCurrentPage('add-feedback');
            }}
            title="บันทึกคำติชม"
            className={`flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              isCollapsed ? 'w-10 h-10 justify-center p-0 border-l-0' : 'w-full gap-3 px-4 py-2.5'
            } ${
              currentPage === 'add-feedback'
                ? isCollapsed
                  ? 'bg-white/10 text-white shadow-inner scale-105 border-white/20'
                  : 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[150px] opacity-100'
              }`}
            >
              บันทึกคำติชม
            </span>
          </button>

          {/* บันทึกการติดตาม */}
          <button
            onClick={() => {
              setSelectedCustomerId('');
              setCurrentPage('add-followup');
            }}
            title="บันทึกการติดตาม"
            className={`flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${
              isCollapsed ? 'w-10 h-10 justify-center p-0 border-l-0' : 'w-full gap-3 px-4 py-2.5'
            } ${
              currentPage === 'add-followup'
                ? isCollapsed
                  ? 'bg-white/10 text-white shadow-inner scale-105 border-white/20'
                  : 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span
              className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[150px] opacity-100'
              }`}
            >
              บันทึกการติดตาม
            </span>
          </button>
        </nav>
      </div>

      {/* Footer Info (User Identity Badge) */}
      <div
        className={`p-4 border-t border-blue-900/30 relative z-10 transition-all duration-300 ${
          isCollapsed ? 'flex justify-center' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 text-blue-100 flex items-center justify-center border border-white/15 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div
            className={`transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden ${
              isCollapsed ? 'max-w-0 opacity-0 pointer-events-none' : 'max-w-[180px] opacity-100'
            }`}
          >
            <p className="text-xs font-semibold text-white">ผู้ตรวจสอบคนที่ 2</p>
            <p className="text-[10px] text-blue-300/60">บทบาท: ตรวจสอบความถูกต้อง</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
