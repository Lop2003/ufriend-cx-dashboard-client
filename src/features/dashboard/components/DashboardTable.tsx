import { Customer } from '../../../types';

interface DashboardTableProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
}

const STATUS_MAP = {
  active: {
    label: 'ผ่อนชำระปกติ',
    className: 'bg-emerald-50 text-status-active border border-emerald-200/50 font-bold',
  },
  overdue: {
    label: 'ค้างชำระค่างวด',
    className: 'bg-red-50 text-status-overdue border border-red-200/60 font-black animate-pulse-slow',
  },
  completed: {
    label: 'ผ่อนชำระสำเร็จ',
    className: 'bg-slate-50 text-status-completed border border-slate-200/50 font-bold',
  },
} as const;

const StatusBadge = ({ status }: { status: Customer['status'] }) => {
  const s = STATUS_MAP[status] ?? STATUS_MAP.completed;
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] tracking-wide uppercase ${s.className}`}>
      {s.label}
    </span>
  );
};

export default function DashboardTable({ customers, onSelectCustomer }: DashboardTableProps) {
  if (customers.length === 0) {
    return (
      <div className="text-gray-400 text-xs py-12 text-center bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3">
        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0h-3.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 006.586 13H3" />
        </svg>
        <span>ไม่พบข้อมูลบัญชีลูกค้าที่คุณกำลังค้นหา</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] overflow-hidden font-body">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-left">
          {/* Table Header */}
          <thead className="bg-slate-50/75 border-b border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 font-display">ชื่อลูกค้าตามสัญญา</th>
              <th scope="col" className="px-6 py-4">เบอร์โทรศัพท์ติดต่อ</th>
              <th scope="col" className="px-6 py-4">สินค้าสัญญาผ่อน</th>
              <th scope="col" className="px-6 py-4">สาขาที่ดูแล</th>
              <th scope="col" className="px-6 py-4">ระยะเวลา</th>
              <th scope="col" className="px-6 py-4">สถานะบัญชี</th>
              <th scope="col" className="px-6 py-4 text-right">การจัดการ</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100 text-xs font-semibold text-gray-700">
            {customers.map((c) => {
              const isOverdue = c.status === 'overdue';
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCustomer(c.id)}
                  className={`group cursor-pointer transition-all duration-300 border-l-4 ${
                    isOverdue
                      ? 'border-l-status-overdue bg-red-50/10 hover:bg-red-50/30'
                      : 'border-l-transparent hover:bg-slate-50/80 hover:text-primary-dark'
                  }`}
                >
                  <td className="px-6 py-4 font-bold text-gray-900 font-display text-sm">
                    <div className="transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                      {c.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-mono">{c.phone}</td>
                  <td className="px-6 py-4 text-gray-800 font-bold">{c.product}</td>
                  <td className="px-6 py-4 text-gray-600">{c.branch}</td>
                  <td className="px-6 py-4 text-gray-500">{c.plan_months} เดือน</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-primary hover:text-primary-dark inline-flex items-center gap-1 font-bold">
                      ดูประวัติ
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50/50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-bold tracking-wide">
        <span>แสดงข้อมูล {customers.length} รายการสัญญาทั้งหมด</span>
        <span>uFriend Customer Experience System v1.1</span>
      </div>
    </div>
  );
}
