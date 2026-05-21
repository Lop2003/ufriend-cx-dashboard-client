import useCX from '../../../hooks/useCX';
import SummaryCards from '../components/SummaryCards';
import DashboardChart from '../components/DashboardChart';
import DashboardTable from '../components/DashboardTable';

export default function DashboardPage() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
  } = useCX();

  // Dynamic list of branches
  const uniqueBranches = Array.from(new Set(customers.map((c) => c.branch)));

  return (
    <div className="font-body text-slate-800 antialiased space-y-6">
      {/* 🔍 Mobile & Tablet Filter Deck (Visible only below md breakpoint) */}
      <div className="md:hidden bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3 animate-fade-in-up">
        <div className="px-1">
          <h4 className="text-[9px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            ตัวกรองบัญชีลูกค้า (Filters)
          </h4>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none z-10">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0"
            placeholder="ค้นหาชื่อลูกค้า, สินค้า..."
          />
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0"
          >
            <option value="">สาขา: ทั้งหมด</option>
            {uniqueBranches.map((br, idx) => (
              <option key={idx} value={br}>{br}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0"
          >
            <option value="">สถานะ: ทั้งหมด</option>
            <option value="active">ปกติ (Active)</option>
            <option value="overdue">ค้างชำระ (Overdue)</option>
            <option value="completed">จบสัญญา (Completed)</option>
          </select>
        </div>
      </div>

      {/* 🔮 Soft UI Split Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* 🔵 Left Column: KPI & Metrics */}
        <div className="xl:col-span-1 flex flex-col gap-5">
          <div className="px-1 shrink-0">
            <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ดัชนีชี้วัดหลัก (KPI & METRICS)
            </h4>
          </div>
          <SummaryCards vertical={true} />
        </div>

        {/* 🖥️ Right Column: Charts & Tables */}
        <div className="xl:col-span-3 space-y-6">
          {/* Charts & Graphs Section */}
          <div>
            <div className="px-1 mb-2">
              <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase">
                การวิเคราะห์และแนวโน้มความพึงพอใจ (CHARTS & GRAPHS)
              </h4>
            </div>
            <DashboardChart />
          </div>

          {/* Tables Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ฐานข้อมูลสัญญาที่ตรงตามเงื่อนไข (CONTRACT TABLES)
              </h4>
              <span className="text-[10px] text-gray-400 font-bold hidden sm:inline">
                คลิกแถวสัญญาเพื่อเปิดบันทึกติดตามด่วน
              </span>
            </div>
            <DashboardTable />
          </div>
        </div>
        
      </div>
    </div>
  );
}
