import useCX from '../../../hooks/useCX';

interface SummaryCardsProps {
  vertical?: boolean;
}

export default function SummaryCards({ vertical }: SummaryCardsProps) {
  const { summaryStats, selectedStatus, setSelectedStatus } = useCX();

  return (
    <div className={vertical ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-5 font-body" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6 font-body"}>
      {/* 🔵 ลูกค้าทั้งหมด */}
      <div 
        onClick={() => setSelectedStatus('')}
        className={`bg-gradient-to-br from-blue-50/90 to-blue-100/40 border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[7.5rem] md:min-h-[8rem] h-auto relative overflow-hidden group cursor-pointer active:scale-95 ${
          selectedStatus === '' ? 'ring-2 ring-primary border-transparent scale-[1.01]' : 'border-blue-200/60'
        }`}
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-primary-dark text-[10px] xs:text-[11px] lg:text-[10px] xl:text-[11px] font-extrabold tracking-wider uppercase">ลูกค้าทั้งหมด</p>
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 mt-2">
          <h2 className="text-primary-dark text-2xl xs:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight mt-1">
            {summaryStats.totalCustomers} <span className="text-[10px] sm:text-xs font-semibold text-primary/70">ราย</span>
          </h2>
          <p className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-primary/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
            จำนวนลูกค้าสะสมในระบบ
          </p>
        </div>
      </div>

      {/* 🟡 คะแนนเฉลี่ย */}
      <div className="bg-gradient-to-br from-amber-50/90 to-amber-100/40 border border-amber-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[7.5rem] md:min-h-[8rem] h-auto relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-amber-800 text-[10px] xs:text-[11px] lg:text-[10px] xl:text-[11px] font-extrabold tracking-wider uppercase">คะแนนเฉลี่ย</p>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 mt-2">
          <h2 className="text-amber-800 text-2xl xs:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight mt-1">
            {summaryStats.avgRating} <span className="text-[10px] sm:text-xs font-semibold text-amber-700/70">/ 5.0</span>
          </h2>
          <p className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-amber-700/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
            คะแนนความพึงพอใจสะสม
          </p>
        </div>
      </div>

      {/* 🔴 ค้างชำระ */}
      <div 
        onClick={() => setSelectedStatus(selectedStatus === 'overdue' ? '' : 'overdue')}
        className={`bg-gradient-to-br from-red-50 to-red-100/50 border-2 rounded-2xl p-4 sm:p-5 shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[7.5rem] md:min-h-[8rem] h-auto relative overflow-hidden group cursor-pointer active:scale-95 ${
          selectedStatus === 'overdue' ? 'ring-2 ring-red-500 border-transparent shadow-md scale-[1.02] bg-red-100/80' : 'border-red-200 pulse-overdue-glow'
        }`}
      >
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-overdue/5 rounded-full blur-xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-overdue text-[10px] xs:text-[11px] lg:text-[10px] xl:text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 bg-status-overdue rounded-full pulse-red-glow"></span>
            ค้างชำระ
          </p>
          <div className="w-8 h-8 rounded-xl bg-status-overdue-bg text-status-overdue flex items-center justify-center shadow-sm transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 mt-2">
          <h2 className="text-status-overdue text-2xl xs:text-3xl lg:text-2xl xl:text-3xl font-black tracking-tight mt-1">
            {summaryStats.overdueCount} <span className="text-[10px] sm:text-xs font-bold text-status-overdue/70">ราย</span>
          </h2>
          <p className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-status-overdue font-black mt-1.5 flex items-center gap-1">
            🚨 เร่งโทรเจรจาติดตามหนี้ด่วน
          </p>
        </div>
      </div>

      {/* 🟢 % พอใจ */}
      <div className="bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 border border-emerald-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[7.5rem] md:min-h-[8rem] h-auto relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-status-active/5 rounded-full blur-xl group-hover:bg-status-active/10 transition-colors duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-status-active text-[10px] xs:text-[11px] lg:text-[10px] xl:text-[11px] font-extrabold tracking-wider uppercase">% พอใจ</p>
          <div className="w-8 h-8 rounded-xl bg-status-active-bg text-status-active flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="relative z-10 mt-2">
          <h2 className="text-status-active text-2xl xs:text-3xl lg:text-2xl xl:text-3xl font-extrabold tracking-tight mt-1">
            {summaryStats.satisfactionRate}% <span className="text-[10px] sm:text-xs font-semibold text-status-active/70">ของลูกค้า</span>
          </h2>
          <p className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-status-active/80 font-bold mt-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-status-active rounded-full shrink-0"></span>
            ลูกค้าประเมินความพึงพอใจ
          </p>
        </div>
      </div>
    </div>
  );
}
