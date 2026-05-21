import SummaryCards from '../components/SummaryCards';
import DashboardChart from '../components/DashboardChart';
import DashboardTable from '../components/DashboardTable';

export default function DashboardPage() {
  return (
    <div className="font-body text-slate-800 antialiased">
      {/* 🔮 Soft UI Split Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* 🔵 Left Column: KPI & Metrics */}
        <div className="lg:col-span-1 flex flex-col gap-5">
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
        <div className="lg:col-span-3 space-y-6">
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
