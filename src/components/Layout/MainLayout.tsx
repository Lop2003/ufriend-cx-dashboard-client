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
    customers,
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
  } = useCX();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Dynamic list of branches
  const uniqueBranches = Array.from(new Set(customers.map((c) => c.branch)));

  return (
    <div
      className="flex h-screen overflow-hidden font-body text-slate-800 antialiased p-6 gap-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${azulBg})` }}
    >
      {/* 🚀 Floating uFriend Sidebar with self-contained Toggle Collapse */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 🖥️ Main Display Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 🔮 Soft UI Extruded Main Panel */}
        <div className="flex-1 flex flex-col soft-extruded overflow-hidden relative">
          
          {/* Navigation Status Bar (Modern Top Header with Integrated Filters) */}
          <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 rounded-t-[24px]">
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

            {/* Integrated Top Filter Deck */}
            {currentPage === 'dashboard' ? (
              <div className="flex items-center gap-3 flex-1 max-w-xl mx-4">
                {/* Search Box */}
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none z-10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0"
                    placeholder="ค้นหาชื่อลูกค้า, สินค้า..."
                  />
                </div>

                {/* Branch Dropdown */}
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 max-w-[150px]"
                >
                  <option value="">สาขา: ทั้งหมด</option>
                  {uniqueBranches.map((br, idx) => (
                    <option key={idx} value={br}>{br}</option>
                  ))}
                </select>

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 max-w-[150px]"
                >
                  <option value="">สถานะ: ทั้งหมด</option>
                  <option value="active">ปกติ (Active)</option>
                  <option value="overdue">ค้างชำระ (Overdue)</option>
                  <option value="completed">จบสัญญา (Completed)</option>
                </select>
              </div>
            ) : null}

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
          <div className="flex-1 overflow-y-auto p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
