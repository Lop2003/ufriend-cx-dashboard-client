import { Customer } from '../../../types';

interface CustomerInfoProps {
  customer: Customer;
}

const StatusBadgeDetail = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    active:    { label: 'ผ่อนชำระปกติ (Active)',    className: 'bg-status-active-bg text-status-active font-medium' },
    overdue:   { label: 'ค้างชำระค่างวดสัญญา (Overdue)',    className: 'bg-status-overdue-bg text-status-overdue font-extrabold animate-pulse-slow' },
    completed: { label: 'ปิดสัญญาผ่อนชำระแล้ว (Completed)', className: 'bg-status-completed-bg text-status-completed font-medium' },
  };
  const s = map[status] ?? map.completed;
  return (
    <span className={`px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide border border-current/10 ${s.className}`}>
      {s.label}
    </span>
  );
};

export default function CustomerInfo({ customer }: CustomerInfoProps) {
  const isOverdue = customer.status === 'overdue';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6 font-body text-slate-800">
      {/* Name and Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-100 gap-4">
        <div>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">ชื่อลูกค้าตามสัญญา</span>
          <h2 className="text-xl font-bold text-gray-900 font-display mt-0.5">{customer.name}</h2>
        </div>
        <div>
          <StatusBadgeDetail status={customer.status} />
        </div>
      </div>

      {/* Critical Overdue Warning alert box (CX High Priority Alert) */}
      {isOverdue && (
        <div className="bg-status-overdue-bg border-l-4 border-status-overdue p-4 rounded-r-lg animate-pulse-slow">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-status-overdue text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-status-overdue font-display">ตรวจพบบัญชีมียอดค้างชำระ (Payment Overdue)</h4>
              <p className="text-[11px] text-status-overdue font-medium mt-1 leading-relaxed">
                สัญญาของลูกค้ารายนี้มียอดค้างชำระค่าสินค้ารายเดือน กรุณาดำเนินการโทรติดต่อแจ้งเตือน โน้มน้าว และแนะนำการชำระผ่านช่องทางด่วนที่สุด เพื่อความต่อเนื่องของสัญญาการผ่อนชำระ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* General Information Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">สินค้าสัญญาผ่อน</span>
            <span className="text-xs font-bold text-gray-950 block mt-1">{customer.product}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">เบอร์ติดต่อสายด่วน</span>
            <span className="text-xs font-bold text-gray-950 block mt-1">{customer.phone}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">สาขาที่ทำเรื่องทำสัญญา</span>
            <span className="text-xs font-bold text-gray-950 block mt-1">สาขา{customer.branch}</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">ระยะเวลาการผ่อนสัญญา</span>
            <span className="text-xs font-bold text-gray-950 block mt-1">{customer.plan_months} เดือน</span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">วันที่เปิดเรื่องทำสัญญา</span>
            <span className="text-xs font-bold text-gray-950 block mt-1">
              {new Date(customer.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">รหัสสัญญาอ้างอิง</span>
            <span className="text-xs font-bold text-gray-500 block mt-1">uF-{customer.id.padEnd(8, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
