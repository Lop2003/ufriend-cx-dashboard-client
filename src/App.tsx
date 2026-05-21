import { CXProvider } from './context/CXContext';
import useCX from './hooks/useCX';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CustomerDetailPage from './features/customer/pages/CustomerDetailPage';
import CustomerListPage from './features/customer/pages/CustomerListPage';
import AddFeedbackPage from './features/feedback/pages/AddFeedbackPage';
import AddFollowUpPage from './features/follow_up/pages/FollowUpFormPage';
import MainLayout from './components/Layout/MainLayout';
import CustomerDetailModal from './features/customer/components/CustomerDetailModal';

function AppContent() {
  const { currentPage, isDetailModalOpen } = useCX();

  return (
    <MainLayout>
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
    </MainLayout>
  );
}

export default function App() {
  return (
    <CXProvider>
      <AppContent />
    </CXProvider>
  );
}
