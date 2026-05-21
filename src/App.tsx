import { useState } from 'react';
import { Customer, Feedback, FollowUp } from './types';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CustomerDetailPage from './features/customer/pages/CustomerDetailPage';
import AddFeedbackPage from './features/feedback/pages/AddFeedbackPage';
import AddFollowUpPage from './features/follow_up/pages/FollowUpFormPage';
import MainLayout from './components/Layout/MainLayout';
import CustomerDetailModal from './features/customer/components/CustomerDetailModal';
import { initialCustomers, initialFeedbacks, initialFollowUps } from './data/mockData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'customer-detail' | 'add-feedback' | 'add-followup'>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.product.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === '' || c.branch === selectedBranch;
    const matchesStatus = selectedStatus === '' || c.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

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
    setIsDetailModalOpen(true);
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
    setIsDetailModalOpen(true);
  };

  const navigateToCustomerDetail = (id: string) => {
    setSelectedCustomerId(id);
    setIsDetailModalOpen(true);
  };

  return (
    <MainLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      customers={customers}
      selectedCustomerId={selectedCustomerId}
      onSelectCustomerId={setSelectedCustomerId}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedBranch={selectedBranch}
      onBranchChange={setSelectedBranch}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
    >
      {currentPage === 'dashboard' && (
        <div className="animate-fade-in-up">
          <DashboardPage
            customers={filteredCustomers}
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

      {/* 🔮 Highly-Interactive Glassmorphic Modal for Customer Details */}
      {isDetailModalOpen && (
        <CustomerDetailModal
          selectedCustomerId={selectedCustomerId}
          customers={customers}
          feedbacks={feedbacks}
          followUps={followUps}
          onClose={() => setIsDetailModalOpen(false)}
          onAddFollowUp={() => {
            setIsDetailModalOpen(false);
            setCurrentPage('add-followup');
          }}
        />
      )}
    </MainLayout>
  );
}
