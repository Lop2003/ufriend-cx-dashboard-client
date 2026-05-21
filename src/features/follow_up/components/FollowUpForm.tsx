import { useState, useEffect } from 'react';
import { Customer } from '../../../types';

interface FollowUpFormProps {
  selectedCustomerId: string;
  customers: Customer[];
  onSubmit: (data: { customer_id: string; type: 'payment_remind' | 'feedback_reply' | 'general'; note: string }) => void;
  onCancel: () => void;
}

export default function FollowUpForm({ selectedCustomerId, customers, onSubmit, onCancel }: FollowUpFormProps) {
  const [customerId, setCustomerId] = useState(selectedCustomerId || '');
  const [type, setType] = useState<'payment_remind' | 'feedback_reply' | 'general'>('payment_remind');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedCustomerId) {
      setCustomerId(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const selectedCust = customers.find(c => c.id === customerId);
  useEffect(() => {
    if (selectedCust && selectedCust.status === 'overdue') {
      setType('payment_remind');
    }
  }, [customerId, selectedCust]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError('กรุณาเลือกรายชื่อลูกค้าเพื่อบันทึกการติดตาม');
      return;
    }
    if (!note.trim()) {
      setError('กรุณากรอกบันทึกรายละเอียดการโทรติดตามลูกค้า');
      return;
    }

    onSubmit({
      customer_id: customerId,
      type,
      note: note.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-white/60 shadow-[6px_6px_15px_rgba(163,177,198,0.35),-6px_-6px_15px_rgba(255,255,255,0.8)] p-8 space-y-6 font-body text-slate-800 antialiased">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight font-display">บันทึกการติดตามความคืบหน้าลูกค้า (Follow-Up Log)</h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            บันทึกผลการเจรจาทวงถาม, ประสานงานคำติชม, หรือการชี้แจงเพื่อป้องกันปัญหาความเสี่ยงลูกค้าสัมพันธ์
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

      {/* Overdue alert banner (CX High Priority Alert) */}
      {selectedCust && selectedCust.status === 'overdue' && (
        <div className="bg-status-overdue-bg border-l-4 border-status-overdue p-4 rounded-r-lg">
          <div className="flex gap-2 text-[11px] text-status-overdue font-bold items-center">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>ลูกค้ารายนี้มียอดค้างชำระ (Overdue) แนะนำให้ใช้หัวข้อ "โทรแจ้งเตือนยอดชำระ" เพื่อบันทึกความคืบหน้า</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Customer select */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            เลือกบัญชีลูกค้าสัญญา *
          </label>
          <select
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setError('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800"
          >
            <option value="">-- กรุณาเลือกลูกค้าสัญญา --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.product} / {c.status === 'overdue' ? 'ค้างชำระ' : 'ปกติ'} / สาขา{c.branch})
              </option>
            ))}
          </select>
        </div>

        {/* Type select */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            ประเภทกิจกรรมการติดตาม *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800"
          >
            <option value="payment_remind">โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)</option>
            <option value="feedback_reply">โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)</option>
            <option value="general">บันทึกการโทรสอบถามทั่วไปหรือด้านบริการอื่นๆ (General)</option>
          </select>
        </div>

        {/* Note textbox */}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
            บันทึกรายละเอียดการประสานงานติดตาม *
          </label>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setError('');
            }}
            placeholder="ตัวอย่าง: โทรแจ้งยอดค้างงวดที่ 2 แล้ว ลูกค้าแจ้งเครื่องขัดข้องหน้าสาขา จะเข้ามาชำระยอดค้างสะสมพร้อมค่าบริการในวันพุธถัดไป..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Action buttons */}
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
          บันทึกการติดตาม
        </button>
      </div>
    </form>
  );
}
