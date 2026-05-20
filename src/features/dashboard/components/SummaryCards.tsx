import { Customer, Feedback } from '../../../types';

interface SummaryCardsProps {
  customers: Customer[];
  feedbacks: Feedback[];
}

export default function SummaryCards({ customers, feedbacks }: SummaryCardsProps) {
  const totalCustomers = customers.length;
  
  // Calculate average rating
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length).toFixed(1)
    : '0.0';

  // Count states
  const activeCount = customers.filter(c => c.status === 'active').length;
  const overdueCount = customers.filter(c => c.status === 'overdue').length;
  const completedCount = customers.filter(c => c.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 font-body">
      {/* 🔵 น้ำเงิน: ลูกค้าทั้งหมด */}
      <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/40 border border-blue-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-primary-dark text-[11px] font-extrabold tracking-wider uppercase">ลูกค้าในดูแลทั้งหมด</p>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-primary-dark text-3xl font-extrabold tracking-tight mt-1">{totalCustomers} <span className="text-xs font-semibold text-primary/70">ราย</span></h2>
          <p className="text-[10px] text-primary/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            คะแนนเฉลี่ยความเห็น: {avgRating} ★
          </p>
        </div>
      </div>

      {/* 🟢 เขียว: ผ่อนอยู่ (Active) */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border border-emerald-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-active/5 rounded-full blur-xl group-hover:bg-status-active/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-active text-[11px] font-extrabold tracking-wider uppercase">ผ่อนปกติ (Active)</p>
          <div className="w-8 h-8 rounded-xl bg-status-active-bg text-status-active flex items-center justify-center">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-status-active text-3xl font-extrabold tracking-tight mt-1">{activeCount} <span className="text-xs font-semibold text-status-active/70">ราย</span></h2>
          <p className="text-[10px] text-status-active/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-active rounded-full"></span>
            ชำระตรงตามระยะเวลาสัญญา
          </p>
        </div>
      </div>

      {/* 🔴 แดง: ค้างชำระ (Overdue) - เด่นและมีลูกเล่น Glow เคลื่อนไหวที่สุด */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-all duration-300 pulse-overdue-glow flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-overdue/5 rounded-full blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-overdue text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 bg-status-overdue rounded-full pulse-red-glow"></span>
            ค้างชำระ (Overdue)
          </p>
          <div className="w-8 h-8 rounded-xl bg-status-overdue-bg text-status-overdue flex items-center justify-center shadow-sm">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-status-overdue text-3xl font-black tracking-tight mt-1">{overdueCount} <span className="text-xs font-bold text-status-overdue/70">ราย</span></h2>
          <p className="text-[10px] text-status-overdue font-black mt-1.5 flex items-center gap-1">
            🚨 ต้องเจรจาโทรติดตามหนี้ด่วน
          </p>
        </div>
      </div>

      {/* ⚫ เทา: ผ่อนสำเร็จ (Completed) */}
      <div className="bg-gradient-to-br from-slate-50/90 to-slate-100/40 border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-completed/5 rounded-full blur-xl group-hover:bg-status-completed/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-completed text-[11px] font-extrabold tracking-wider uppercase">ผ่อนสำเร็จ (Completed)</p>
          <div className="w-8 h-8 rounded-xl bg-status-completed-bg text-status-completed flex items-center justify-center">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-status-completed text-3xl font-extrabold tracking-tight mt-1">{completedCount} <span className="text-xs font-semibold text-status-completed/70">ราย</span></h2>
          <p className="text-[10px] text-status-completed/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-completed rounded-full"></span>
            ปิดบัญชีสัญญาเรียบร้อยแล้ว
          </p>
        </div>
      </div>
    </div>
  );
}
