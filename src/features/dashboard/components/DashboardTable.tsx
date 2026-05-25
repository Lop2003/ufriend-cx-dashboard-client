import { useState, useEffect } from 'react';
import useCX from '../../../hooks/useCX';

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

export default function DashboardTable() {
  const {
    customers,
    navigateToCustomerDetail,
    searchQuery,
    selectedBranch,
    selectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useCX();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedBranch, selectedStatus]);

  // Sorting handlers
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
    <div className="bg-white rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] overflow-hidden font-body text-slate-800 antialiased">
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
                  ไม่พบรายชื่อบัญชีลูกค้าตามคำค้นหาและเงื่อนไขตัวกรอง
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
                    className={`group cursor-pointer transition-all duration-300 ${isOverdue
                        ? 'bg-[#FFF0F2] hover:bg-[#FFE3E7]'
                        : 'hover:bg-slate-50/80 hover:text-primary-dark'
                      }`}
                  >
                    <td className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3.5 text-gray-400 font-mono whitespace-nowrap border-l-4 ${isOverdue ? 'border-l-status-overdue' : 'border-l-transparent'
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
  );
}
