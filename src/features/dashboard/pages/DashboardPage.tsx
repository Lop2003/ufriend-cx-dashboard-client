import { useState, useEffect } from 'react';
import { useCX } from '../../../hooks/useCX';
import SummaryCards from '../components/SummaryCards';
import DashboardChart from '../components/DashboardChart';
import * as api from '../../../services/api';

const STATUS_MAP = {
  active: {
    label: 'ปกติ (Active)',
    className: 'bg-emerald-50 text-status-active border border-emerald-200/50 font-bold',
  },
  overdue: {
    label: 'ค้างชำระ (Overdue)',
    className: 'bg-red-50 text-status-overdue border border-red-200/60 font-black animate-pulse-slow',
  },
  completed: {
    label: 'จบสัญญา (Completed)',
    className: 'bg-slate-50 text-status-completed border border-slate-200/50 font-bold',
  },
} as const;

export default function DashboardPage() {
  const {
    customers,
    navigateToCustomerDetail,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    selectedBranch,
    setSelectedBranch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters
  } = useCX();

  const [branches, setBranches] = useState<string[]>([]);
  const [isFetchingBranches, setIsFetchingBranches] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedBranch, selectedStatus]);

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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <span className="text-gray-300 ml-1">↕</span>;
    return sortOrder === 'asc'
      ? <span className="text-primary ml-1">▲</span>
      : <span className="text-primary ml-1">▼</span>;
  };

  // Pagination calculations
  const totalItems = customers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedCustomers = customers.slice(startIndex, endIndex);

  return (
    <div className="font-body text-slate-800 antialiased space-y-6">
      
      {/* 🔮 Full Width Vertically Stacked Layout */}
      <div className="space-y-8">
        
        {/* 🔵 Top Section: KPI & Metrics (Full Width Horizontal) */}
        <div className="space-y-3">
          <div className="px-1 shrink-0 flex items-center justify-between">
            <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ดัชนีชี้วัดหลัก (KPI & METRICS)
            </h4>
            {selectedBranch && (
              <span className="text-[9px] font-extrabold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full animate-fade-in">
                📍 ฟิลเตอร์สาขา: {selectedBranch}
              </span>
            )}
          </div>
          <SummaryCards vertical={false} />
        </div>

        {/* 🖥️ Middle Section: Charts & Graphs (Full Width) */}
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

        {/* 📋 Bottom Section: High-Density Table Display (Full Width) */}
        <div className="space-y-3">
          <div className="px-1 mb-2">
            <h4 className="text-[10px] font-black text-gray-400 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              บัญชีรายชื่อลูกค้าสัญญา {selectedBranch ? `เฉพาะสาขา ${selectedBranch}` : 'ทั้งหมดในระบบ'} (CUSTOMER ACCOUNTS LIST)
            </h4>
          </div>

          {/* 🔍 Search & Filter Deck for the Table */}
          <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in">
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0 bg-slate-50/50 rounded-xl"
                placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto shrink-0">
              <div className="relative w-full md:w-40">
                <select
                  value={selectedBranch}
                  onFocus={handleFocusBranches}
                  onClick={handleFocusBranches}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full cursor-pointer appearance-none bg-slate-50/50 rounded-xl"
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full md:w-40 cursor-pointer bg-slate-50/50 rounded-xl"
              >
                <option value="">สถานะ: ทั้งหมด</option>
                <option value="active">ปกติ (Active)</option>
                <option value="overdue">ค้างชำระ (Overdue)</option>
                <option value="completed">จบสัญญา (Completed)</option>
              </select>
              
              {(searchQuery || selectedStatus || selectedBranch) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all flex items-center justify-center cursor-pointer border border-slate-200"
                >
                  รีเซ็ต
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100 text-left">
                <thead className="bg-slate-50/75 border-b border-gray-200 text-gray-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                  <tr>
                    <th 
                      scope="col" 
                      onClick={() => handleSort('created_at')}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 font-display whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors"
                    >
                      รหัสสัญญา {renderSortIcon('created_at')}
                    </th>
                    <th 
                      scope="col" 
                      onClick={() => handleSort('name')}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 font-display whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors"
                    >
                      ชื่อลูกค้าตามสัญญา {renderSortIcon('name')}
                    </th>
                    <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap">
                      เบอร์โทรศัพท์ติดต่อ
                    </th>
                    <th 
                      scope="col" 
                      onClick={() => handleSort('product')}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors"
                    >
                      สินค้าสัญญาผ่อน {renderSortIcon('product')}
                    </th>
                    <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap">
                      สาขาที่ดูแล
                    </th>
                    <th 
                      scope="col" 
                      onClick={() => handleSort('plan_months')}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors"
                    >
                      ระยะเวลา {renderSortIcon('plan_months')}
                    </th>
                    <th 
                      scope="col" 
                      onClick={() => handleSort('status')}
                      className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap cursor-pointer select-none hover:text-primary transition-colors"
                    >
                      สถานะบัญชี {renderSortIcon('status')}
                    </th>
                    <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-[10px] sm:text-[11px] font-semibold text-gray-700">
                  {paginatedCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 sm:px-4 md:px-5 py-10 text-center text-gray-400">
                        ไม่พบรายชื่อบัญชีลูกค้าในเงื่อนไขการกรอง
                      </td>
                    </tr>
                  ) : (
                    paginatedCustomers.map((c) => {
                      const isOverdue = c.status === 'overdue';
                      const s = STATUS_MAP[c.status] ?? STATUS_MAP.completed;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => navigateToCustomerDetail(c.id)}
                          className={`group cursor-pointer transition-all duration-300 ${
                            isOverdue
                               ? 'bg-[#FFF0F2] hover:bg-[#FFE3E7]'
                               : 'hover:bg-slate-50/80 hover:text-primary-dark'
                          }`}
                        >
                          <td className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-400 font-mono whitespace-nowrap border-l-4 ${
                            isOverdue ? 'border-l-status-overdue' : 'border-l-transparent'
                          }`}>uF-{c.id.padEnd(6, '0')}</td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 font-bold text-gray-900 font-display text-[11px] sm:text-xs whitespace-nowrap">
                            <div className="transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                              {c.name}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-500 font-mono whitespace-nowrap">{c.phone}</td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-800 font-bold whitespace-nowrap">{c.product}</td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-600 whitespace-nowrap">{c.branch}</td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-500 whitespace-nowrap">{c.plan_months} เดือน</td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] sm:text-[9px] tracking-wide uppercase whitespace-nowrap ${s.className}`}>
                              {s.label}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-right whitespace-nowrap">
                            <span className="text-primary hover:text-primary-dark inline-flex items-center gap-1 font-bold">
                              ดูประวัติเชิงลึก
                              <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Premium Pagination Footer */}
            {totalItems > 0 && (
              <div className="bg-slate-50/75 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left side: range display and page size selector */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-semibold">
                  <span>
                    แสดง <span className="text-gray-900 font-bold">{startIndex + 1}-{endIndex}</span> จากทั้งหมด <span className="text-primary font-bold">{totalItems}</span> รายการ
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">แสดงหน้าละ:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="bg-white border border-gray-200 text-gray-700 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary font-bold cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                {/* Right side: Page Navigation controls */}
                <div className="flex items-center gap-1.5 font-sans">
                  {/* First Page */}
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary transition-all text-xs font-bold"
                    title="หน้าแรก"
                  >
                    «
                  </button>

                  {/* Prev Page */}
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary transition-all text-xs font-bold"
                    title="หน้าก่อนหน้า"
                  >
                    ‹
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 5) return true;
                      return Math.abs(p - page) <= 1 || p === 1 || p === totalPages;
                    })
                    .map((p, idx, arr) => {
                      const isCurrent = p === page;
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;

                      return (
                        <div key={p} className="flex items-center gap-1.5">
                          {showEllipsis && <span className="text-gray-400 px-1 font-bold text-xs select-none">...</span>}
                          <button
                            onClick={() => setPage(p)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                              isCurrent
                                ? 'bg-primary text-white shadow-sm ring-1 ring-primary'
                                : 'border border-gray-200 bg-white text-gray-600 hover:bg-slate-50 hover:text-primary'
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      );
                    })}

                  {/* Next Page */}
                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary transition-all text-xs font-bold"
                    title="หน้าถัดไป"
                  >
                    ›
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed hover:text-primary transition-all text-xs font-bold"
                    title="หน้าสุดท้าย"
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
