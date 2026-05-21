import { useState } from 'react';
import useCX from '../../../hooks/useCX';
import { Customer } from '../../../types';

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
  const { customers, navigateToCustomerDetail } = useCX();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Stats calculation
  const total = customers.length;
  const active = customers.filter(c => c.status === 'active').length;
  const overdue = customers.filter(c => c.status === 'overdue').length;
  const completed = customers.filter(c => c.status === 'completed').length;

  const branches = Array.from(new Set(customers.map(c => c.branch)));

  // Client-side search and filtering for this specific view
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === '' || c.branch === branchFilter;
    const matchesStatus = statusFilter === '' || c.status === statusFilter;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-body text-slate-800 antialiased animate-fade-in-up">
      {/* 🔮 Quick Customer Stats Deck (Soft UI) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-20">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">ลูกค้าทั้งหมด</span>
          <span className="text-xl font-black text-primary-dark">{total} ราย</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-20">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-active">ผ่อนชำระปกติ</span>
          <span className="text-xl font-black text-status-active">{active} ราย</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-20 relative overflow-hidden group">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-overdue flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-overdue rounded-full pulse-red-glow"></span>
            ค้างชำระค่างวด
          </span>
          <span className="text-xl font-black text-status-overdue">{overdue} ราย</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-20">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-completed">จบสัญญาแล้ว</span>
          <span className="text-xl font-black text-status-completed">{completed} ราย</span>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0"
            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all text-gray-700 soft-recessed border-0 w-full md:w-40"
          >
            <option value="">สาขา: ทั้งหมด</option>
            {branches.map((br, idx) => (
              <option key={idx} value={br}>{br}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            <thead className="bg-slate-50/75 border-b border-gray-200 text-gray-400 text-[11px] font-black uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-display">รหัสสัญญา</th>
                <th scope="col" className="px-5 py-3.5 font-display">ชื่อลูกค้าตามสัญญา</th>
                <th scope="col" className="px-5 py-3.5">เบอร์โทรศัพท์ติดต่อ</th>
                <th scope="col" className="px-5 py-3.5">สินค้าสัญญาผ่อน</th>
                <th scope="col" className="px-5 py-3.5">สาขาที่ดูแล</th>
                <th scope="col" className="px-5 py-3.5">ระยะเวลา</th>
                <th scope="col" className="px-5 py-3.5">สถานะบัญชี</th>
                <th scope="col" className="px-5 py-3.5 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-[11px] font-semibold text-gray-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400">
                    ไม่พบรายชื่อบัญชีลูกค้าตามคำค้นหาและเงื่อนไขตัวกรอง
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isOverdue = c.status === 'overdue';
                  const s = STATUS_MAP[c.status] ?? STATUS_MAP.completed;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigateToCustomerDetail(c.id)}
                      className={`group cursor-pointer transition-all duration-300 border-l-4 ${
                        isOverdue
                          ? 'border-l-status-overdue bg-red-50/10 hover:bg-red-50/30'
                          : 'border-l-transparent hover:bg-slate-50/80 hover:text-primary-dark'
                      }`}
                    >
                      <td className="px-5 py-3.5 text-gray-400 font-mono">uF-{c.id.padEnd(6, '0')}</td>
                      <td className="px-5 py-3.5 font-bold text-gray-900 font-display text-xs">
                        <div className="transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                          {c.name}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 font-mono">{c.phone}</td>
                      <td className="px-5 py-3.5 text-gray-800 font-bold">{c.product}</td>
                      <td className="px-5 py-3.5 text-gray-600">{c.branch}</td>
                      <td className="px-5 py-3.5 text-gray-500">{c.plan_months} เดือน</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] tracking-wide uppercase ${s.className}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
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
