import { createContext, useState, useMemo, ReactNode } from 'react';
import { Customer, Feedback, FollowUp } from '../types';
import { initialCustomers, initialFeedbacks, initialFollowUps } from '../data/mockData';

export type PageType = 'dashboard' | 'customers' | 'customer-detail' | 'add-feedback' | 'add-followup';

interface CXContextType {
  // Navigation & Modal State
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedCustomerId: string;
  setSelectedCustomerId: (id: string) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (isOpen: boolean) => void;
  navigateToCustomerDetail: (id: string) => void;

  // Data State
  customers: Customer[];
  feedbacks: Feedback[];
  followUps: FollowUp[];
  addFeedback: (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => void;
  addFollowUp: (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => void;

  // Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;

  // Computed & Filtered Data
  filteredCustomers: Customer[];
  filteredFeedbacks: Feedback[];
  summaryStats: {
    totalCustomers: number;
    avgRating: string;
    overdueCount: number;
    satisfactionRate: string;
  };
}

export const CXContext = createContext<CXContextType | undefined>(undefined);

interface CXProviderProps {
  children: ReactNode;
}

export function CXProvider({ children }: CXProviderProps) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('1');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Data State
  const [customers] = useState<Customer[]>(initialCustomers);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedStatus('');
  };

  // Filter customers based on search and selected branch/status
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.product.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch = selectedBranch === '' || c.branch === selectedBranch;
      const matchesStatus = selectedStatus === '' || c.status === selectedStatus;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [customers, searchQuery, selectedBranch, selectedStatus]);

  // Feedbacks associated with the filtered customers
  const filteredFeedbacks = useMemo(() => {
    const customerIds = new Set(filteredCustomers.map((c) => c.id));
    return feedbacks.filter((fb) => customerIds.has(fb.customer_id));
  }, [feedbacks, filteredCustomers]);

  // Memoized stats based on filtered data
  const summaryStats = useMemo(() => {
    const totalCustomers = filteredCustomers.length;
    
    // Average rating of feedbacks for filtered customers
    const avgRating = filteredFeedbacks.length > 0 
      ? (filteredFeedbacks.reduce((acc, fb) => acc + fb.rating, 0) / filteredFeedbacks.length).toFixed(1)
      : '0.0';

    // Overdue count of filtered customers
    const overdueCount = filteredCustomers.filter(c => c.status === 'overdue').length;

    // Satisfaction rate (positive sentiment percentage) of filtered customers
    const positiveFeedbacks = filteredFeedbacks.filter(fb => fb.sentiment === 'positive').length;
    const satisfactionRate = filteredFeedbacks.length > 0
      ? ((positiveFeedbacks / filteredFeedbacks.length) * 100).toFixed(0)
      : '0';

    return {
      totalCustomers,
      avgRating,
      overdueCount,
      satisfactionRate,
    };
  }, [filteredCustomers, filteredFeedbacks]);

  // Add Feedback Action
  const addFeedback = (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => {
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (newFb.rating >= 4) sentiment = 'positive';
    else if (newFb.rating <= 2) sentiment = 'negative';

    const created: Feedback = {
      ...newFb,
      id: 'f_' + Math.random().toString(36).substring(2, 11),
      sentiment,
      created_at: new Date().toISOString(),
    };

    setFeedbacks((prev) => [created, ...prev]);
    setCurrentPage('dashboard');
    setIsDetailModalOpen(true);
  };

  // Add Follow-Up Action
  const addFollowUp = (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => {
    const created: FollowUp = {
      ...newFu,
      id: 'fu_' + Math.random().toString(36).substring(2, 11),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setFollowUps((prev) => [created, ...prev]);
    setSelectedCustomerId(newFu.customer_id);
    setCurrentPage('dashboard');
    setIsDetailModalOpen(true);
  };

  // Navigate to customer details (opens modal)
  const navigateToCustomerDetail = (id: string) => {
    setSelectedCustomerId(id);
    setIsDetailModalOpen(true);
  };

  const contextValue = useMemo(() => ({
    currentPage,
    setCurrentPage,
    selectedCustomerId,
    setSelectedCustomerId,
    isDetailModalOpen,
    setIsDetailModalOpen,
    navigateToCustomerDetail,
    customers,
    feedbacks,
    followUps,
    addFeedback,
    addFollowUp,
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
    filteredCustomers,
    filteredFeedbacks,
    summaryStats,
  }), [
    currentPage,
    selectedCustomerId,
    isDetailModalOpen,
    customers,
    feedbacks,
    followUps,
    searchQuery,
    selectedBranch,
    selectedStatus,
    filteredCustomers,
    filteredFeedbacks,
    summaryStats,
  ]);

  return (
    <CXContext.Provider value={contextValue}>
      {children}
    </CXContext.Provider>
  );
}
