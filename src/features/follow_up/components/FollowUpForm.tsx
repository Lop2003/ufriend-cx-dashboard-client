import { useState, useEffect } from 'react';
import useCX from '../../../hooks/useCX';

export default function FollowUpForm() {
  const { selectedCustomerId, customers, addFollowUp, setCurrentPage } = useCX();
  const [customerId, setCustomerId] = useState(selectedCustomerId || '');
  const [type, setType] = useState<'payment_remind' | 'feedback_reply' | 'promotion'>('payment_remind');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Searchable dropdown states
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === customerId);

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

  const handleCancel = () => {
    setCurrentPage('customers');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError('กรุณาเลือกรายชื่อลูกค้าเพื่อบันทึกการติดตาม');
      return;
    }
    if (!note.trim()) {
      setError('กรุณากรอกบันทึกรายละเอียดการโทรติดตามลูกค้า');
      return;
    }

    const success = await addFollowUp({
      customer_id: customerId,
      type,
      note: note.trim()
    });

    if (success) {
      setNote('');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-white/60 shadow-[8px_8px_30px_rgba(163,177,198,0.25),-8px_-8px_30px_rgba(255,255,255,0.7)] p-4 sm:p-6 md:p-8 space-y-4 md:space-y-5 font-body text-slate-800 antialiased">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm md:text-base font-bold text-gray-900 tracking-tight font-display">บันทึกการติดตามความคืบหน้าลูกค้า (Follow-Up Log)</h3>
          <p className="text-[11px] md:text-[13px] text-gray-400 mt-0.5 md:mt-1">
            บันทึกผลการเจรจาทวงถาม, ประสานงานคำติชม, หรือการชี้แจงเพื่อป้องกันปัญหาความเสี่ยงลูกค้าสัมพันธ์
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-status-overdue-bg text-status-overdue text-xs py-2 px-3 rounded-lg border border-status-overdue/20 font-bold flex items-center gap-2 animate-pulse-slow shadow-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {/* Overdue alert banner (CX High Priority Alert) */}
      {selectedCust && selectedCust.status === 'overdue' && (
        <div className="bg-status-overdue-bg border-l-4 border-status-overdue py-2 px-3.5 rounded-r-xl shadow-sm">
          <div className="flex gap-2 text-[11px] md:text-xs text-status-overdue font-bold items-center leading-relaxed">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>ลูกค้ารายนี้มียอดค้างชำระ (Overdue) แนะนำให้ใช้หัวข้อ "โทรแจ้งเตือนยอดชำระ" เพื่อบันทึกความคืบหน้า</span>
          </div>
        </div>
      )}

      <div className="space-y-3.5">
        {/* Custom Searchable Customer Dropdown */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            เลือกบัญชีลูกค้าสัญญา (ค้นหารายชื่อได้) *
          </label>
          
          <div className="relative">
            <input
              type="text"
              placeholder="พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า..."
              value={isOpen ? searchQuery : (selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.product} / สาขา${selectedCustomer.branch})` : searchQuery)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
                if (!e.target.value) {
                  setCustomerId('');
                }
              }}
              onFocus={() => {
                setIsOpen(true);
                setSearchQuery('');
              }}
              className="w-full px-3 py-2.5 pl-9 border border-gray-250 rounded-xl text-xs font-semibold bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 shadow-sm cursor-pointer"
            />
            
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {customerId && (
              <button
                type="button"
                onClick={() => {
                  setCustomerId('');
                  setSearchQuery('');
                  setError('');
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {!customerId && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>

          {isOpen && (
            <>
              <div 
                className="fixed inset-0 z-20 cursor-default" 
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery('');
                }}
              />
              
              <div className="absolute z-30 w-full mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-xl max-h-56 overflow-y-auto font-sans animate-fade-in-up">
                {filteredCustomers.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-400 text-center font-bold">
                    ไม่พบรายชื่อลูกค้าที่ตรงคำค้นหา
                  </div>
                ) : (
                  <div className="py-1.5 divide-y divide-gray-50">
                    {filteredCustomers.map((c) => {
                      const isSelected = c.id === customerId;
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            setCustomerId(c.id);
                            setIsOpen(false);
                            setSearchQuery('');
                            setError('');
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-semibold transition-all hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 cursor-pointer ${
                            isSelected ? 'bg-primary-light text-primary font-bold border-l-4 border-l-primary' : 'text-gray-700'
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="text-gray-900 font-bold">{c.name}</span>
                              {c.status === 'overdue' && (
                                <span className="text-[8px] bg-red-50 text-status-overdue border border-red-100/50 px-1 py-0.2 rounded font-extrabold tracking-wide uppercase animate-pulse">
                                  ค้างชำระ
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono mt-0.5">เบอร์: {c.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                              {c.product}
                            </span>
                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                              สาขา {c.branch}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Type select */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            ประเภทกิจกรรมการติดตาม *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 shadow-sm"
          >
            <option value="payment_remind">โทรแจ้งเตือนการค้างชำระเงิน (Payment Remind)</option>
            <option value="feedback_reply">โทรขอโทษและชี้แจงคำติชมความพึงพอใจ (Feedback Reply)</option>
            <option value="promotion">โทรแจ้งเสนอโปรโมชั่นพิเศษ (Promotion)</option>
          </select>
        </div>

        {/* Note textbox */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            บันทึกรายละเอียดการประสานงานติดตาม *
          </label>
          <textarea
            rows={5}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setError('');
            }}
            placeholder="ตัวอย่าง: โทรแจ้งยอดค้างงวดที่ 2 แล้ว ลูกค้าแจ้งเครื่องขัดข้องหน้าสาขา จะเข้ามาชำระยอดค้างสะสมพร้อมค่าบริการในวันพุธถัดไป..."
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 placeholder:text-gray-400 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white shadow-sm leading-relaxed min-h-[6.5rem] md:min-h-[8rem]"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer active:scale-95"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 hover-shimmer active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          บันทึกการติดตาม
        </button>
      </div>
    </form>
  );
}
