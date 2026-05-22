import { useState } from 'react';
import { useCX } from '../../../hooks/useCX';
import SummaryCards from '../components/SummaryCards';
import DashboardChart from '../components/DashboardChart';
import * as api from '../../../services/api';

export default function DashboardPage() {
  const { selectedBranch, setSelectedBranch } = useCX();
  const [branches, setBranches] = useState<string[]>([]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  // Fetch branches on demand when the user interacts with the filter
  const handleFocusBranches = async () => {
    if (branches.length > 0 || isFetchingBranches) return;
    setIsFetchingBranches(true);
    try {
      const stats = await api.fetchBranchStats();
      const uniqueBranches = Array.from(new Set(stats.map(s => s.branch)));
      setBranches(uniqueBranches);
    } catch (err) {
      console.warn("Could not fetch branches dynamically", err);
      // Fallback for demo
      setBranches(["วงเวียนใหญ่", "รังสิต", "ลาดพร้าว", "สยาม"]);
    } finally {
      setIsFetchingBranches(false);
    }
  };

  return (
    <div className="font-body text-slate-800 antialiased space-y-6">
      
      {/* 🔍 Premium Dashboard Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-gray-900 tracking-wide font-display uppercase">ภาพรวมข้อมูลแดชบอร์ด</h3>
          <p className="text-[10px] text-gray-400">วิเคราะห์ข้อมูลความพึงพอใจและสถิติภาพรวมแยกตามพื้นที่สาขา</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-48">
            <select
              value={selectedBranch}
              onFocus={handleFocusBranches}
              onClick={handleFocusBranches} // Also trigger on click for mobile/safari consistency
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full cursor-pointer appearance-none bg-white rounded-xl"
            >
              <option value="">สาขา: ทั้งหมด</option>
              {branches.map((br, idx) => (
                <option key={idx} value={br}>{br}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {selectedBranch && (
            <button
              onClick={() => setSelectedBranch('')}
              className="px-3 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-slate-200"
            >
              รีเซ็ต
            </button>
          )}
        </div>
      </div>

      {/* 🔮 Full Width Vertically Stacked Layout */}
      <div className="space-y-8">
        
        {/* 🔵 Top Section: KPI & Metrics (Full Width Horizontal) */}
        <div className="space-y-3">
          <div className="px-1 shrink-0">
            <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ดัชนีชี้วัดหลัก (KPI & METRICS)
            </h4>
          </div>
          <SummaryCards vertical={false} />
        </div>

        {/* 🖥️ Bottom Section: Charts & Graphs (Full Width) */}
        <div className="space-y-3">
          <div className="px-1 mb-2">
            <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              การวิเคราะห์และแนวโน้มความพึงพอใจ (CHARTS & GRAPHS)
            </h4>
          </div>
          <DashboardChart />
        </div>
        
      </div>
    </div>
  );
}
