import { useState } from 'react';
import { Customer, Feedback } from '../../../types';
import SummaryCards from '../components/SummaryCards';
import DashboardChart from '../components/DashboardChart';
import DashboardTable from '../components/DashboardTable';

interface DashboardPageProps {
  customers: Customer[];
  feedbacks: Feedback[];
  onSelectCustomer: (id: string) => void;
}

export default function DashboardPage({ customers, feedbacks, onSelectCustomer }: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const uniqueBranches = Array.from(new Set(customers.map(c => c.branch)));

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.phone.includes(searchQuery) ||
                          c.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === '' || c.branch === selectedBranch;
    const matchesStatus = selectedStatus === '' || c.status === selectedStatus;
    
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6 font-body text-slate-800 antialiased">
      {/* Summary Metrics Grid */}
      <SummaryCards customers={customers} feedbacks={feedbacks} />

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          {/* Search Box with SVG Search Icon */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-400 text-gray-800"
              placeholder="ค้นหาชื่อลูกค้า, สินค้า, หรือเบอร์โทร..."
            />
          </div>

          {/* Branch Select */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-700"
          >
            <option value="">ทุกสาขา ({uniqueBranches.length}+ สาขา)</option>
            {uniqueBranches.map((br, idx) => (
              <option key={idx} value={br}>{br}</option>
            ))}
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-700"
          >
            <option value="">ทุกสถานะบัญชี</option>
            <option value="active">ผ่อนชำระปกติ (Active)</option>
            <option value="overdue">ค้างชำระค่าชำระ (Overdue)</option>
            <option value="completed">ผ่อนจบสัญญา (Completed)</option>
          </select>

          {/* Reset button */}
          {(searchQuery || selectedBranch || selectedStatus) && (
            <button
              onClick={handleResetFilters}
              className="text-gray-500 hover:text-gray-800 text-[11px] font-bold px-2 py-1 transition-all underline"
            >
              รีเซ็ตตัวกรอง
            </button>
          )}
        </div>

        {/* CX Quick Hint Badge */}
        <div className="text-[10px] font-bold text-status-overdue bg-status-overdue-bg px-3 py-2 rounded border border-status-overdue/20 flex items-center gap-2 self-start md:self-auto animate-pulse-slow">
          <span className="w-1.5 h-1.5 bg-status-overdue rounded-full pulse-red-glow"></span>
          แถบค้างชำระ (Overdue) จะแสดงผลเด่นชัดเป็นพิเศษเพื่อความปลอดภัย
        </div>
      </div>

      {/* Grid of Analytics + Customer Data List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <DashboardChart customers={filteredCustomers} feedbacks={feedbacks} />
        </div>

        {/* Main Database Table */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs font-black text-gray-500 tracking-wider font-display uppercase flex items-center gap-1.5">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              บัญชีสัญญาที่ตรงตามเงื่อนไข ({filteredCustomers.length} รายการ)
            </h4>
            <span className="text-[10px] text-gray-400 font-bold">
              คลิกแถวสัญญาเพื่อเข้าจัดการและโทรติดตามรายบุคคล
            </span>
          </div>
          <DashboardTable customers={filteredCustomers} onSelectCustomer={onSelectCustomer} />
        </div>
      </div>
    </div>
  );
}
