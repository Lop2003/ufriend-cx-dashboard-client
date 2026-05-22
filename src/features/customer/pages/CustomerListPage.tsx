import { useCX } from '../../../hooks/useCX';

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

export default function CustomerListPage() {
  const {
    customers,
    navigateToCustomerDetail,
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useCX();

  // Stats calculation from the currently visible customer list
  const total = customers.length;
  const active = customers.filter(c => c.status === 'active').length;
  const overdue = customers.filter(c => c.status === 'overdue').length;
  const completed = customers.filter(c => c.status === 'completed').length;

  const branches = ["วงเวียนใหญ่", "รังสิต", "ลาดพร้าว", "สยาม"];

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

  return (
    <div className="space-y-6 font-body text-slate-800 antialiased animate-fade-in-up">
      {/* 🔮 Quick Customer Stats Deck (Soft UI) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedStatus('')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === '' ? 'ring-2 ring-primary border-transparent scale-[1.01] bg-blue-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider whitespace-nowrap">ลูกค้าทั้งหมด</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-primary-dark mt-1">{total} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('active')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'active' ? 'ring-2 ring-emerald-500 border-transparent scale-[1.01] bg-emerald-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-active whitespace-nowrap">ผ่อนชำระปกติ</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-active mt-1">{active} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('overdue')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto relative overflow-hidden group cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'overdue' ? 'ring-2 ring-red-500 border-transparent scale-[1.01] bg-red-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-overdue flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-status-overdue rounded-full pulse-red-glow shrink-0"></span>
            ค้างชำระค่างวด
          </span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-overdue mt-1">{overdue} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('completed')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'completed' ? 'ring-2 ring-slate-400 border-transparent scale-[1.01] bg-slate-50' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-completed whitespace-nowrap">จบสัญญาแล้ว</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-completed mt-1">{completed} ราย</span>
        </div>
      </div>

      {/* 🔍 Filter Deck */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
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
            className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0"
            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full md:w-40"
          >
            <option value="">สาขา: ทั้งหมด</option>
            {branches.map((br, idx) => (
              <option key={idx} value={br}>{br}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full md:w-40"
          >
            <option value="">สถานะ: ทั้งหมด</option>
            <option value="active">ปกติ (Active)</option>
            <option value="overdue">ค้างชำระ (Overdue)</option>
            <option value="completed">จบสัญญา (Completed)</option>
          </select>
        </div>
      </div>

      {/* 📋 High-Density Table Display */}
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
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 sm:px-4 md:px-5 py-10 text-center text-gray-400">
                    ไม่พบรายชื่อบัญชีลูกค้าตามคำค้นหาและเงื่อนไขตัวกรอง
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
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
      </div>
    </div>
  );
}
