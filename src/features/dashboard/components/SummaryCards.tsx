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

  // Count overdue status
  const overdueCount = customers.filter(c => c.status === 'overdue').length;

  // Calculate % พอใจ (Satisfaction Percentage - positive sentiment ratio)
  const positiveFeedbacks = feedbacks.filter(fb => fb.sentiment === 'positive').length;
  const satisfactionRate = feedbacks.length > 0
    ? ((positiveFeedbacks / feedbacks.length) * 100).toFixed(0)
    : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 font-body">
      {/* 🔵 ลูกค้าทั้งหมด */}
      <div className="bg-gradient-to-br from-blue-50/90 to-blue-100/40 border border-blue-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-primary-dark text-[11px] font-extrabold tracking-wider uppercase">ลูกค้าทั้งหมด</p>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-primary-dark text-3xl font-extrabold tracking-tight mt-1">{totalCustomers} <span className="text-xs font-semibold text-primary/70">ราย</span></h2>
          <p className="text-[10px] text-primary/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
            จำนวนลูกค้าสัมพันธ์ทั้งหมดในระบบ
          </p>
        </div>
      </div>

      {/* 🟡 คะแนนเฉลี่ย */}
      <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-amber-800 text-[11px] font-extrabold tracking-wider uppercase">คะแนนเฉลี่ย</p>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-amber-800 text-3xl font-extrabold tracking-tight mt-1">{avgRating} <span className="text-xs font-semibold text-amber-700/70">/ 5.0</span></h2>
          <p className="text-[10px] text-amber-700/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            คะแนนความพึงพอใจเฉลี่ยสะสม
          </p>
        </div>
      </div>

      {/* 🔴 ค้างชำระ - เด่นและมีลูกเล่น Glow เคลื่อนไหวที่สุด */}
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 border-2 border-red-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 transition-all duration-300 pulse-overdue-glow flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-overdue/5 rounded-full blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-overdue text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 bg-status-overdue rounded-full pulse-red-glow"></span>
            ค้างชำระ
          </p>
          <div className="w-8 h-8 rounded-xl bg-status-overdue-bg text-status-overdue flex items-center justify-center shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-status-overdue text-3xl font-black tracking-tight mt-1">{overdueCount} <span className="text-xs font-bold text-status-overdue/70">ราย</span></h2>
          <p className="text-[10px] text-status-overdue font-black mt-1.5 flex items-center gap-1">
            🚨 ต้องเร่งโทรเจรจาติดตามหนี้ด่วน
          </p>
        </div>
      </div>

      {/* 🟢 % พอใจ */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border border-emerald-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-active/5 rounded-full blur-xl group-hover:bg-status-active/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-active text-[11px] font-extrabold tracking-wider uppercase">% พอใจ</p>
          <div className="w-8 h-8 rounded-xl bg-status-active-bg text-status-active flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-status-active text-3xl font-extrabold tracking-tight mt-1">{satisfactionRate}% <span className="text-xs font-semibold text-status-active/70">ของลูกค้า</span></h2>
          <p className="text-[10px] text-status-active/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-active rounded-full"></span>
            สัดส่วนลูกค้าที่ตอบความเห็นพึงพอใจ
          </p>
        </div>
      </div>
    </div>
  );
}
