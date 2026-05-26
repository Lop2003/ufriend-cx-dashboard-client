import { CXProvider } from './context/CXContext';
import useCX from './hooks/useCX';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CustomerDetailPage from './features/customer/pages/CustomerDetailPage';
import CustomerListPage from './features/customer/pages/CustomerListPage';
import AddFeedbackPage from './features/feedback/pages/AddFeedbackPage';
import AddFollowUpPage from './features/follow_up/pages/FollowUpFormPage';
import MainLayout from './components/Layout/MainLayout';
import CustomerDetailModal from './features/customer/components/CustomerDetailModal';
import ToastContainer from './components/Toast';

function AppContent() {
  const { currentPage, isDetailModalOpen, isLoading, apiError, isApiConnected } = useCX();

  return (
    <MainLayout>
      {/* API Connection Banner */}
      {!isLoading && apiError && (
        <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2">
          <span>⚠️</span>
          <span>{apiError}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 font-bold">กำลังโหลดข้อมูล{isApiConnected ? ' จาก API' : ''}...</p>
          </div>
        </div>
      ) : (
        <>
          {currentPage === 'dashboard' && (
            <div className="animate-fade-in-up">
              <DashboardPage />
            </div>
          )}

          {currentPage === 'customers' && (
            <div className="animate-fade-in-up">
              <CustomerListPage />
            </div>
          )}

          {currentPage === 'customer-detail' && (
            <div className="animate-fade-in-up">
              <CustomerDetailPage />
            </div>
          )}

          {currentPage === 'add-feedback' && (
            <div className="animate-fade-in-up">
              <AddFeedbackPage />
            </div>
          )}

          {currentPage === 'add-followup' && (
            <div className="animate-fade-in-up">
              <AddFollowUpPage />
            </div>
          )}

          {/* 🔮 Highly-Interactive Glassmorphic Modal for Customer Details */}
          {isDetailModalOpen && <CustomerDetailModal />}
        </>
      )}
    </MainLayout>
  );
}

export default function App() {
  return (
    <CXProvider>
      <AppContent />
      <ToastContainer />
    </CXProvider>
  );
}
