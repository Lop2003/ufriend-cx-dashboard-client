import { useState } from 'react';
import { Customer } from '../../../types';

interface FeedbackFormProps {
  customers: Customer[];
  onSubmit: (data: { customer_id: string; rating: number; comment: string; category: 'service' | 'payment' | 'product' | 'branch' }) => void;
  onCancel: () => void;
}

export default function FeedbackForm({ customers, onSubmit, onCancel }: FeedbackFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<'service' | 'payment' | 'product' | 'branch'>('service');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('กรุณาเลือกบัญชีลูกค้าเพื่อบันทึกคำติชม');
      return;
    }
    if (!comment.trim()) {
      setError('กรุณากรอกความคิดเห็นหรือรายละเอียดคำติชม');
      return;
    }

    onSubmit({
      customer_id: selectedCustomerId,
      rating,
      comment: comment.trim(),
      category
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] p-8 space-y-6 font-body text-slate-800 antialiased">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.371 1.24.588 1.81l-3.97 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.89a1 1 0 00-1.175 0l-3.97 2.89c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.89c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight font-display">กรอกบันทึกคำติชมความพึงพอใจลูกค้า</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            บันทึกข้อมูลคะแนนดาวและข้อความวิจารณ์ลงในแบบสอบถามระดับความพึงพอใจ (CSAT)
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-status-overdue-bg text-status-overdue text-xs py-3 px-4 rounded border border-status-overdue/20 font-bold flex items-center gap-2 animate-pulse-slow">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Customer Select */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            เลือกลูกค้าสัญญา *
          </label>
          <select
            value={selectedCustomerId}
            onChange={(e) => {
              setSelectedCustomerId(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800"
          >
            <option value="">-- กรุณาเลือกรายชื่อลูกค้า --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.product} / สาขา{c.branch})
              </option>
            ))}
          </select>
        </div>

        {/* Rating Stars Selector */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            ให้คะแนนความพึงพอใจ (1 - 5 ดาว) *
          </label>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, idx) => {
              const starVal = idx + 1;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setRating(starVal)}
                  className="text-2xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span className={starVal <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              );
            })}
            <span className="text-xs font-bold text-gray-500 ml-2">
              ({rating} เต็ม 5 คะแนน / {rating >= 4 ? 'พึงพอใจมาก' : rating <= 2 ? 'ไม่พึงพอใจ' : 'ทั่วไป'})
            </span>
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            หมวดหมู่หัวข้อคำร้องเรียนติชม *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800"
          >
            <option value="service">ด้านการบริการของพนักงานสาขา/ฝ่ายขาย</option>
            <option value="payment">ด้านช่องทางการจ่ายค่างวดและกระบวนการทวงถาม</option>
            <option value="product">ด้านอุปกรณ์/สินค้าและสัญญา (iPhone, iPad)</option>
            <option value="branch">ด้านสถานที่และการเดินทางอำนวยความสะดวกในสาขา</option>
          </select>
        </div>

        {/* Comment detail Textbox */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            รายละเอียดคำวิจารณ์/ความคิดเห็นเพิ่มเติม *
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              setError('');
            }}
            placeholder="เช่น บริการรวดเร็วมากค่ะ พนักงานสาขาพูดจาสุภาพ หรือ พนักงานทวงหนี้พูดจาไม่สุภาพ..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Button controls */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 hover-shimmer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          บันทึกคำติชม
        </button>
      </div>
    </form>
  );
}
