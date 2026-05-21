import useCX from '../../../hooks/useCX';
import { Customer } from '../../../types';

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
    <span className={`px-2 py-0.5 rounded text-[8.5px] sm:text-[9px] tracking-wide uppercase whitespace-nowrap ${s.className}`}>
      {s.label}
    </span>
  );
};

export default function DashboardTable() {
  const { filteredCustomers, navigateToCustomerDetail } = useCX();

  if (filteredCustomers.length === 0) {
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
          <thead className="bg-slate-50/75 border-b border-gray-200 text-gray-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 font-display whitespace-nowrap">ชื่อลูกค้าตามสัญญา</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">เบอร์โทรศัพท์ติดต่อ</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">สินค้าสัญญาผ่อน</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">สาขาที่ดูแล</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">ระยะเวลา</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">สถานะบัญชี</th>
              <th scope="col" className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-right whitespace-nowrap">การจัดการ</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-100 text-[10px] sm:text-[11px] font-semibold text-gray-700">
            {filteredCustomers.map((c) => {
              const isOverdue = c.status === 'overdue';
              return (
                <tr
                  key={c.id}
                  onClick={() => navigateToCustomerDetail(c.id)}
                  className={`group cursor-pointer transition-all duration-300 ${isOverdue
                    ? 'bg-[#FFF0F2] hover:bg-[#FFE3E7]'
                    : 'hover:bg-slate-50/80 hover:text-primary-dark'
                    }`}
                >
                  <td className={`px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 font-bold text-gray-900 font-display text-[11px] sm:text-xs whitespace-nowrap border-l-4 ${
                    isOverdue ? 'border-l-status-overdue' : 'border-l-transparent'
                  }`}>
                    <div className="transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out">
                      {c.name}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-gray-500 font-mono whitespace-nowrap">{c.phone}</td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-gray-800 font-bold whitespace-nowrap">{c.product}</td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-gray-600 whitespace-nowrap">{c.branch}</td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-gray-500 whitespace-nowrap">{c.plan_months} เดือน</td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-right whitespace-nowrap">
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
      <div className="bg-slate-50/50 px-6 py-2.5 border-t border-gray-100 flex items-center justify-between text-[9px] text-gray-400 font-bold tracking-wide whitespace-nowrap">
        <span>แสดงข้อมูล {filteredCustomers.length} รายการสัญญาทั้งหมด</span>
        <span>uFriend Customer Experience System v1.1</span>
      </div>
    </div>
  );
}
