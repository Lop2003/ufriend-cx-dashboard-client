import useCX from '../../../hooks/useCX';
import CustomerInfo from '../components/CustomerInfo';

interface CustomerDetailPageProps {
  onBack?: () => void;
  onAddFollowUp?: () => void;
}

// Mappers for translating data values to beautiful Thai labels
const CATEGORY_MAP = {
  service: 'บริการ',
  payment: 'ค่างวด/การชำระ',
  product: 'สินค้า',
  branch: 'สาขา',
} as const;

const SENTIMENT_MAP = {
  positive: { label: 'พึงพอใจ', className: 'bg-emerald-50 text-status-active border border-emerald-100/50' },
  neutral: { label: 'ทั่วไป', className: 'bg-amber-50 text-sentiment-neutral border border-amber-100/50' },
  negative: { label: 'ไม่พอใจ', className: 'bg-red-50 text-sentiment-negative border border-red-100/50' },
} as const;

const FOLLOW_UP_TYPE_MAP = {
  payment_remind: { label: 'โทรแจ้งเตือนยอดชำระ', nodeColor: 'bg-status-overdue text-white' },
  feedback_reply: { label: 'ตอบกลับความพึงพอใจ', nodeColor: 'bg-primary text-white' },
  general: { label: 'บันทึกการติดตามทั่วไป', nodeColor: 'bg-slate-400 text-white' },
} as const;

const RatingStar = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1.5">
    <span className="text-yellow-400 text-sm tracking-tight font-sans drop-shadow-sm">
      {'★'.repeat(rating)}
      <span className="text-gray-300">{'★'.repeat(5 - rating)}</span>
    </span>
    {rating >= 4 && (
      <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-200/60 px-1.5 py-0.5 rounded font-black tracking-wide flex items-center gap-0.5 shadow-sm animate-pulse-slow">
        ✨ คะแนนดีเยี่ยม
      </span>
    )}
  </div>
);

export default function CustomerDetailPage({
  onBack,
  onAddFollowUp,
}: CustomerDetailPageProps) {
  const { 
    selectedCustomerId, 
    customers, 
    feedbacks, 
    followUps, 
    setCurrentPage, 
    setIsDetailModalOpen 
  } = useCX();

  const customer = customers.find((c) => c.id === selectedCustomerId);

  // Fallback handlers
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setCurrentPage('dashboard');
    }
  };

  const handleAddFollowUp = () => {
    if (onAddFollowUp) {
      onAddFollowUp();
    } else {
      setIsDetailModalOpen(false);
      setCurrentPage('add-followup');
    }
  };

  if (!customer) {
    return (
      <div className="space-y-4 font-body text-slate-800">
        <button onClick={handleBack} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
          ← ย้อนกลับไปแดชบอร์ด
        </button>
        <div className="text-gray-400 text-sm py-12 text-center bg-white border border-gray-200 rounded-xl">
          ไม่พบข้อมูลลูกค้า
        </div>
      </div>
    );
  }

  const customerFeedbacks = feedbacks.filter((fb) => fb.customer_id === customer.id);
  const customerFollowUps = followUps.filter((fu) => fu.customer_id === customer.id);

  return (
    <div className="space-y-6 font-body text-slate-800 antialiased">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <button
          onClick={handleBack}
          className="text-xs font-bold text-primary hover:text-primary-dark transition-all flex items-center gap-1.5 font-display self-start"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          ย้อนกลับแดชบอร์ดหลัก
        </button>

        <button
          onClick={handleAddFollowUp}
          className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 hover-shimmer w-full sm:w-auto justify-center"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          บันทึกการติดตามลูกค้า
        </button>
      </div>

      {/* 📋 Customer Information card */}
      <CustomerInfo customer={customer} />

      {/* Grid of Feedbacks and Follow-Ups timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Timelines of Feedbacks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-gray-800 tracking-wider font-display uppercase">
              ประวัติคำติชมของลูกค้า (Feedback History)
            </h3>
          </div>

          {customerFeedbacks.length === 0 ? (
            <div className="text-gray-400 text-xs py-8 text-center">
              ยังไม่มีประวัติคำติชมหรือรีวิวจากลูกค้าคนนี้
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {customerFeedbacks.map((fb) => {
                const sentimentMeta = SENTIMENT_MAP[fb.sentiment];
                return (
                  <div
                    key={fb.id}
                    className="p-4 rounded-xl bg-slate-50 border border-gray-100 hover:border-gray-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <RatingStar rating={fb.rating} />
                      <span className="text-[10px] text-gray-400 font-bold">
                        {new Date(fb.created_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed font-bold">"{fb.comment}"</p>

                    {/* Category and Sentiment indicators */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[9px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded">
                        หมวด: {CATEGORY_MAP[fb.category]}
                      </span>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${sentimentMeta.className}`}>
                        อารมณ์: {sentimentMeta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Premium Vertical Timeline of Follow-ups */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-gray-800 tracking-wider font-display uppercase">
              บันทึกประวัติการติดตาม (Follow-Up Logs)
            </h3>
          </div>

          {customerFollowUps.length === 0 ? (
            <div className="text-gray-400 text-xs py-8 text-center">
              ยังไม่มีบันทึกประวัติการโทรหรือติดตามลูกค้า
            </div>
          ) : (
            <div className="relative space-y-6 max-h-[400px] overflow-y-auto pr-1 py-2 pl-1 ml-1">
              {customerFollowUps.map((fu, idx) => {
                const typeMeta = FOLLOW_UP_TYPE_MAP[fu.type] || FOLLOW_UP_TYPE_MAP.general;

                return (
                  <div key={fu.id} className="relative pl-8 group">
                    {/* Vertical connecting line connecting circles between items */}
                    {idx !== customerFollowUps.length - 1 && (
                      <div className="absolute left-[7px] top-5 -bottom-7 w-0.5 bg-slate-200/60 pointer-events-none z-0"></div>
                    )}

                    {/* Absolutely Positioned Node Circle inside padding viewport */}
                    <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm z-10 ${typeMeta.nodeColor}`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </span>

                    <div className="p-4 rounded-xl bg-slate-50 border border-gray-100 group-hover:border-gray-200 transition-all space-y-3 relative z-10 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                          {typeMeta.label}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {new Date(fu.created_at).toLocaleDateString('th-TH')}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-100 font-bold leading-relaxed shadow-sm">
                        {fu.note}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-gray-400 font-bold">โดย: ฝ่ายบริการลูกค้า uFriend</span>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-lg border ${
                          fu.status === 'done'
                            ? 'bg-emerald-50 text-status-active border-emerald-100/50'
                            : 'bg-red-50 text-status-overdue border-red-100/50 animate-pulse-slow'
                        }`}>
                          {fu.status === 'done' ? 'สำเร็จแล้ว' : 'รอดำเนินการ'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
