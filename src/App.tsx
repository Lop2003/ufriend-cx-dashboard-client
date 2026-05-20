import { useState } from 'react';
import { Customer, Feedback, FollowUp } from './types';
import DashboardPage from './features/dashboard/pages/DashboardPage';
// @ts-ignore
import uFriendLogo from '../Icon.png';
import CustomerDetailPage from './features/customer/pages/CustomerDetailPage';
import AddFeedbackPage from './features/feedback/pages/AddFeedbackPage';
import AddFollowUpPage from './features/follow_up/pages/FollowUpFormPage';

const initialCustomers: Customer[] = [
  { id: '1', name: 'กิตติศักดิ์ พรหมสร', phone: '081-234-5678', product: 'iPhone 15 Pro Max', branch: 'ลาดพร้าว', plan_months: 12, status: 'active', created_at: '2025-01-10T08:00:00Z' },
  { id: '2', name: 'มณีรัตน์ วงศ์เทวา', phone: '089-876-5432', product: 'iPad Pro 11"', branch: 'เชียงใหม่ นิมาน', plan_months: 24, status: 'overdue', created_at: '2025-02-15T09:30:00Z' },
  { id: '3', name: 'ปกรณ์ มงคลธนเวช', phone: '085-444-1122', product: 'iPhone 14', branch: 'ขอนแก่น มข.', plan_months: 6, status: 'completed', created_at: '2024-11-20T10:15:00Z' },
  { id: '4', name: 'สุดารัตน์ ใจดีกุล', phone: '086-777-8899', product: 'iPad Air 5', branch: 'ลาดพร้าว', plan_months: 36, status: 'active', created_at: '2025-03-01T14:20:00Z' },
  { id: '5', name: 'อนันต์ ทรัพย์แสนล้าน', phone: '083-999-5566', product: 'iPhone 15', branch: 'หาดใหญ่ เซ็นทรัล', plan_months: 24, status: 'overdue', created_at: '2025-01-20T11:00:00Z' },
  { id: '6', name: 'ชลดา เลิศวรวิทย์', phone: '082-111-3344', product: 'iPhone 15 Pro Max', branch: 'ชลบุรี อมตะ', plan_months: 12, status: 'active', created_at: '2025-02-28T09:00:00Z' },
  { id: '7', name: 'ธนพล เกษมศิริ', phone: '087-555-6677', product: 'iPad 10.2"', branch: 'เชียงใหม่ นิมาน', plan_months: 12, status: 'completed', created_at: '2024-10-15T15:45:00Z' },
  { id: '8', name: 'ภัทรา วรรณสิงห์', phone: '084-222-7788', product: 'iPhone 13', branch: 'หาดใหญ่ เซ็นทรัล', plan_months: 18, status: 'active', created_at: '2025-03-10T13:10:00Z' },
  { id: '9', name: 'สมชาย รักชาติ', phone: '088-333-4455', product: 'iPhone 15 Pro Max', branch: 'ขอนแก่น มข.', plan_months: 6, status: 'overdue', created_at: '2025-02-05T16:00:00Z' },
  { id: '10', name: 'ศิริพร บุญยืน', phone: '089-111-2233', product: 'iPad Air 5', branch: 'ชลบุรี อมตะ', plan_months: 12, status: 'active', created_at: '2025-03-12T10:30:00Z' }
];

const initialFeedbacks: Feedback[] = [
  { id: 'f1', customer_id: '1', rating: 5, comment: 'เจ้าหน้าที่บริการรวดเร็วมาก อนุมัติไวผ่านง่ายดีค่ะ', category: 'service', sentiment: 'positive', created_at: '2025-01-15T10:00:00Z' },
  { id: 'f2', customer_id: '2', rating: 2, comment: 'ไม่มีพนักงานโทรแจ้งเตือนล่วงหน้า ก่อนปรับยอดเป็นค้างชำระ ดอกเบี้ยแอบแพง', category: 'payment', sentiment: 'negative', created_at: '2025-03-02T11:30:00Z' },
  { id: 'f3', customer_id: '3', rating: 4, comment: 'เครื่องใช้งานได้ดีมาก เงื่อนไขตรงตามสัญญา พนักงานสาขาน่ารัก', category: 'product', sentiment: 'positive', created_at: '2025-01-05T14:00:00Z' },
  { id: 'f4', customer_id: '4', rating: 5, comment: 'ใช้บัตรประชาชนใบเดียวจริงๆ สะดวกรวดเร็วประทับใจค่ะ', category: 'service', sentiment: 'positive', created_at: '2025-03-05T15:20:00Z' },
  { id: 'f5', customer_id: '5', rating: 1, comment: 'พนักงานโทรทวงถามยอดเงินพูดจาไม่สุภาพเลย แย่มากๆ ควรตักเตือนด่วน', category: 'service', sentiment: 'negative', created_at: '2025-02-20T09:15:00Z' },
  { id: 'f6', customer_id: '6', rating: 3, comment: 'เครื่องผ่อนดีค่ะ แต่สาขาหาที่จอดรถค่อนข้างยากเวลามารับเครื่อง', category: 'branch', sentiment: 'neutral', created_at: '2025-03-01T10:45:00Z' }
];

const initialFollowUps: FollowUp[] = [
  { id: 'w1', customer_id: '2', type: 'payment_remind', note: 'โทรเตือนยอดค้างชำระ ลูกค้าแจ้งว่าจะรีบจ่ายภายในวันศุกร์นี้ผ่านแอป', status: 'pending', created_at: '2025-03-10T09:00:00Z' },
  { id: 'w2', customer_id: '5', type: 'feedback_reply', note: 'โทรติดต่อกลับเพื่อขออภัยเรื่องพนักงานทวงถามพูดจาไม่ดี แจ้งเรื่องตรวจสอบพนักงานรายดังกล่าวแล้ว', status: 'done', created_at: '2025-02-22T14:30:00Z' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-detail' | 'add-feedback' | 'add-followup'>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);

  const handleAddFeedback = (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => {
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (newFb.rating >= 4) sentiment = 'positive';
    else if (newFb.rating <= 2) sentiment = 'negative';

    const created: Feedback = {
      ...newFb,
      id: 'f_' + Math.random().toString(36).substr(2, 9),
      sentiment,
      created_at: new Date().toISOString()
    };

    setFeedbacks([created, ...feedbacks]);
    setCurrentPage('dashboard');
    setIsDetailModalOpen(true); // Pop details modal so they see their new feedback instantly!
  };

  const handleAddFollowUp = (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => {
    const created: FollowUp = {
      ...newFu,
      id: 'fu_' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setFollowUps([created, ...followUps]);
    setSelectedCustomerId(newFu.customer_id);
    setCurrentPage('dashboard');
    setIsDetailModalOpen(true); // Pop details modal so they see their follow-up logged instantly!
  };

  const navigateToCustomerDetail = (id: string) => {
    setSelectedCustomerId(id);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-body text-slate-800 antialiased">
      {/* 🚀 uFriend Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#001D42] via-[#003375] to-[#0051BA] border-r border-primary/20 flex flex-col justify-between shadow-2xl relative overflow-hidden">
        {/* Decorative Premium Mesh Blurs */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Header (Uses Modern Brand Logo) */}
          <div className="h-16 flex items-center px-6 border-b border-white/10 gap-3">
            <img 
              src={uFriendLogo} 
              alt="uFriend CX Logo" 
              className="w-8 h-8 rounded-xl object-contain shadow-md bg-white/15 p-1 border border-white/15 transform hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-white tracking-wide text-md">uFriend CX</span>
              <span className="text-[10px] text-sky-200/80 font-semibold tracking-wider uppercase">แผงควบคุมหลัก</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${currentPage === 'dashboard'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              แดชบอร์ด
            </button>

            <button
              onClick={() => setCurrentPage('add-feedback')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${currentPage === 'add-feedback'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              บันทึกคำติชม
            </button>

            <button
              onClick={() => {
                if (!selectedCustomerId && customers.length > 0) setSelectedCustomerId(customers[0].id);
                setCurrentPage('add-followup');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border-l-4 ${currentPage === 'add-followup'
                ? 'bg-white/10 text-white border-primary shadow-inner'
                : 'text-sky-100/80 hover:bg-white/5 hover:text-white border-transparent'
                }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              บันทึกการติดตาม
            </button>
          </nav>
        </div>

        {/* Footer Info (User Identity Badge) */}
        <div className="p-4 border-t border-blue-900/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 text-blue-100 flex items-center justify-center border border-white/15">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">ผู้ตรวจสอบคนที่ 2</p>
              <p className="text-[10px] text-blue-300/60">บทบาท: ตรวจสอบความถูกต้อง</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 🖥️ Main Display Canvas */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
        {/* Navigation Status Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              {currentPage}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-500 font-display uppercase tracking-wide">
              {currentPage === 'dashboard' && 'แดชบอร์ดภาพรวมลูกค้าสัมพันธ์ uFriend'}
              {currentPage === 'customer-detail' && 'ข้อมูลเชิงลึกและประวัติการผ่อนลูกค้า'}
              {currentPage === 'add-feedback' && 'ฟอร์มบันทึกคำติชม (Feedback)'}
              {currentPage === 'add-followup' && 'บันทึกประวัติการติดตาม (Follow-Up)'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 bg-status-active rounded-full animate-pulse"></span>
            เชื่อมต่อข้อมูลแบบเรียลไทม์
          </div>
        </header>

        {/* Page Containers */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentPage === 'dashboard' && (
            <div className="animate-fade-in-up">
              <DashboardPage
                customers={customers}
                feedbacks={feedbacks}
                onSelectCustomer={navigateToCustomerDetail}
              />
            </div>
          )}

          {currentPage === 'customer-detail' && (
            <div className="animate-fade-in-up">
              <CustomerDetailPage
                customerId={selectedCustomerId}
                customers={customers}
                feedbacks={feedbacks}
                followUps={followUps}
                onBack={() => setCurrentPage('dashboard')}
                onAddFollowUp={() => setCurrentPage('add-followup')}
              />
            </div>
          )}

          {currentPage === 'add-feedback' && (
            <div className="animate-fade-in-up">
              <AddFeedbackPage
                customers={customers}
                onSubmit={handleAddFeedback}
                onCancel={() => setCurrentPage('dashboard')}
              />
            </div>
          )}

          {currentPage === 'add-followup' && (
            <div className="animate-fade-in-up">
              <AddFollowUpPage
                selectedCustomerId={selectedCustomerId}
                customers={customers}
                onSubmit={handleAddFollowUp}
                onCancel={() => setCurrentPage('dashboard')}
              />
            </div>
          )}
        </div>
      </main>

      {/* 🔮 Highly-Interactive Glassmorphic Modal for Customer Details */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300">
          {/* Backdrop click close */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsDetailModalOpen(false)}></div>
          
          {/* Modal Container */}
          <div className="relative bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh] z-10 animate-fade-in-up">
            {/* Header bar with Close Button */}
            <div className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-primary-light text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  CX Insight
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-slate-500 font-display">
                  ข้อมูลประวัติลูกค้าสัมพันธ์เชิงลึก
                </span>
              </div>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Scrollable details canvas */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
              <CustomerDetailPage
                customerId={selectedCustomerId}
                customers={customers}
                feedbacks={feedbacks}
                followUps={followUps}
                onBack={() => setIsDetailModalOpen(false)}
                onAddFollowUp={() => {
                  setIsDetailModalOpen(false);
                  setCurrentPage('add-followup');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
