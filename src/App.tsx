import { useState } from 'react';
import { Customer, Feedback, FollowUp } from './types';
import DashboardPage from './features/dashboard/pages/DashboardPage';
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
    setCurrentPage('customer-detail');
  };

  const navigateToCustomerDetail = (id: string) => {
    setSelectedCustomerId(id);
    setCurrentPage('customer-detail');
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-body text-slate-800 antialiased">
      {/* 🚀 uFriend Sidebar */}
      <aside className="w-64 bg-blue-900 border-r border-blue-800 flex flex-col justify-between shadow-xl">
        <div>
          {/* Header (Uses Modern Phone Vector Icon) */}
          <div className="h-16 flex items-center px-6 border-b border-blue-800 gap-3">
            <svg className="w-6 h-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex flex-col">
              <span className="font-display font-bold text-white tracking-wide text-md">uFriend CX</span>
              <span className="text-[10px] text-blue-200 font-semibold tracking-wider uppercase">แผงควบคุมหลัก</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${currentPage === 'dashboard'
                  ? 'bg-blue-800 text-white shadow-lg shadow-blue-950/30'
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              แดชบอร์ด CX
            </button>

            <button
              onClick={() => setCurrentPage('add-feedback')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${currentPage === 'add-feedback'
                  ? 'bg-blue-800 text-white shadow-lg shadow-blue-950/30'
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              บันทึกคำติชม (Feedback)
            </button>

            <button
              onClick={() => {
                if (!selectedCustomerId && customers.length > 0) setSelectedCustomerId(customers[0].id);
                setCurrentPage('add-followup');
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${currentPage === 'add-followup'
                  ? 'bg-blue-800 text-white shadow-lg shadow-blue-950/30'
                  : 'text-blue-100 hover:bg-blue-800/60 hover:text-white'
                }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              บันทึกการติดตาม (Follow-Up)
            </button>
          </nav>
        </div>

        {/* Footer Info (User Identity Badge) */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-blue-100 flex items-center justify-center border border-blue-800">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">ผู้ตรวจสอบคนที่ 2</p>
              <p className="text-[10px] text-blue-200">บทบาท: ตรวจสอบความถูกต้อง</p>
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
            <DashboardPage
              customers={customers}
              feedbacks={feedbacks}
              onSelectCustomer={navigateToCustomerDetail}
            />
          )}

          {currentPage === 'customer-detail' && (
            <CustomerDetailPage
              customerId={selectedCustomerId}
              customers={customers}
              feedbacks={feedbacks}
              followUps={followUps}
              onBack={() => setCurrentPage('dashboard')}
              onAddFollowUp={() => setCurrentPage('add-followup')}
            />
          )}

          {currentPage === 'add-feedback' && (
            <AddFeedbackPage
              customers={customers}
              onSubmit={handleAddFeedback}
              onCancel={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'add-followup' && (
            <AddFollowUpPage
              selectedCustomerId={selectedCustomerId}
              customers={customers}
              onSubmit={handleAddFollowUp}
              onCancel={() => setCurrentPage('dashboard')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
