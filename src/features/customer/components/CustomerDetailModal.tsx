import useCX from '../../../hooks/useCX';
import CustomerDetailPage from '../pages/CustomerDetailPage';

export default function CustomerDetailModal() {
  const { setIsDetailModalOpen, setCurrentPage } = useCX();

  const handleClose = () => {
    setIsDetailModalOpen(false);
  };

  const handleAddFollowUp = () => {
    setIsDetailModalOpen(false);
    setCurrentPage('add-followup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300">
      {/* Backdrop click close */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={handleClose}></div>

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
            onClick={handleClose}
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
            onBack={handleClose}
            onAddFollowUp={handleAddFollowUp}
          />
        </div>
      </div>
    </div>
  );
}
