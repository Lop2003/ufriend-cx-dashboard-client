import { ReactNode, useState } from 'react';
import useCX from '../../hooks/useCX';
import Sidebar from '../Sidebar';
import azulBg from '../../../coolbackgrounds-fractalize-azul.png';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const {
    currentPage,
  } = useCX();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  return (
    <div
      className="flex flex-col md:flex-row min-h-screen md:h-screen overflow-y-auto md:overflow-hidden font-body text-slate-800 antialiased p-0 sm:p-4 md:p-6 gap-0 md:gap-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${azulBg})` }}
    >
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 md:hidden cursor-pointer"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 🚀 Floating uFriend Sidebar with self-contained Toggle Collapse */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 🖥️ Main Display Canvas */}
      <main className="flex-1 flex flex-col overflow-visible md:overflow-hidden">
        {/* 🔮 Soft UI Extruded Main Panel */}
        <div className="flex-1 flex flex-col soft-extruded overflow-visible md:overflow-hidden relative">
          
          {/* Navigation Status Bar (Modern Top Header with Integrated Filters) */}
          <header className="h-16 bg-white border-b border-slate-100 px-4 md:px-8 flex items-center justify-between shrink-0 rounded-none sm:rounded-t-[24px]">
            {/* Hamburger Button for Mobile */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all shrink-0 cursor-pointer border border-slate-100"
              title="เปิดเมนูนำทาง"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <div className="flex items-center gap-2 mr-4">
              <span className="text-[9px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {currentPage}
              </span>
              {currentPage !== 'dashboard' && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-xs font-bold text-slate-500 font-display uppercase tracking-wide">
                    {currentPage === 'customers' && 'รายชื่อลูกค้า'}
                    {currentPage === 'customer-detail' && 'ข้อมูลลูกค้า'}
                    {currentPage === 'add-feedback' && 'บันทึกคำติชม'}
                    {currentPage === 'add-followup' && 'บันทึกการติดตาม'}
                  </span>
                </>
              )}
            </div>

            {/* User Profile avatar on the far right */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-gray-900 leading-none">ผู้ตรวจสอบคนที่ 2</p>
                <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">แผงควบคุมนูนต่ำ</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark transition-all duration-300 text-white flex items-center justify-center border border-white shadow-[2px_2px_6px_#cacad0,-2px_-2px_6px_#ffffff] cursor-pointer hover:scale-105">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </header>

          {/* Page Containers */}
          <div className="flex-1 overflow-y-visible md:overflow-y-auto p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
