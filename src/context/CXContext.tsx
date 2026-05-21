import { createContext, useState, useMemo, useEffect, useCallback, ReactNode } from 'react';
import { Customer, Feedback, FollowUp } from '../types';
import { initialCustomers, initialFeedbacks, initialFollowUps } from '../data/mockData';
import * as api from '../services/api';
import { showToast } from '../components/Toast';

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

  // Loading & Error
  isLoading: boolean;
  apiError: string | null;
  isApiConnected: boolean;
}

export const CXContext = createContext<CXContextType | undefined>(undefined);

interface CXProviderProps {
  children: ReactNode;
}

export function CXProvider({ children }: CXProviderProps) {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  // Data State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);

  // Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

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

  // ─── Fetch All Data from API (with fallback to mock) ───────────────
  const [apiSummary, setApiSummary] = useState<api.SummaryData | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [customersData, feedbacksData, summaryData] = await Promise.all([
        api.fetchCustomers(),
        api.fetchFeedbacks(),
        api.fetchSummary(),
      ]);
      setCustomers(customersData);
      setFeedbacks(feedbacksData);
      setApiSummary(summaryData);
      setIsApiConnected(true);

      // Set default selected customer if none selected
      if (!selectedCustomerId && customersData.length > 0) {
        setSelectedCustomerId(customersData[0].id);
      }
    } catch (err) {
      console.warn('API unavailable, falling back to mock data:', err);
      setCustomers(initialCustomers);
      setFeedbacks(initialFeedbacks);
      setFollowUps(initialFollowUps);
      setApiSummary(null);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API ได้ — กำลังใช้ข้อมูลตัวอย่าง (Mock Data)');

      if (!selectedCustomerId) {
        setSelectedCustomerId(initialCustomers[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCustomerId]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Memoized stats — use API summary when no filters active, else compute client-side
  const hasFilters = searchQuery !== '' || selectedBranch !== '' || selectedStatus !== '';

  const summaryStats = useMemo(() => {
    // If API summary available and no filters active, use server-computed stats
    if (apiSummary && !hasFilters) {
      const satisfactionRate = filteredFeedbacks.length > 0
        ? ((filteredFeedbacks.filter(fb => fb.sentiment === 'positive').length / filteredFeedbacks.length) * 100).toFixed(0)
        : '0';
      return {
        totalCustomers: apiSummary.total_customers,
        avgRating: apiSummary.avg_rating.toFixed(1),
        overdueCount: apiSummary.overdue_count,
        satisfactionRate,
      };
    }

    // Filtered mode: compute from client-side data
    const totalCustomers = filteredCustomers.length;
    const avgRating = filteredFeedbacks.length > 0 
      ? (filteredFeedbacks.reduce((acc, fb) => acc + fb.rating, 0) / filteredFeedbacks.length).toFixed(1)
      : '0.0';
    const overdueCount = filteredCustomers.filter(c => c.status === 'overdue').length;
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
  }, [apiSummary, hasFilters, filteredCustomers, filteredFeedbacks]);

  // Add Feedback Action — POST to API then refetch
  const addFeedback = async (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => {
    if (isApiConnected) {
      try {
        await api.createFeedback({
          customer_id: newFb.customer_id,
          rating: newFb.rating,
          comment: newFb.comment,
          category: newFb.category,
        });
        showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว ✨');
        await loadData();
      } catch (err) {
        showToast('error', `บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
      }
    } else {
      // Fallback: local state
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
      showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว (Mock Mode) ✨');
    }

    setCurrentPage('dashboard');
    setIsDetailModalOpen(true);
  };

  // Add Follow-Up Action — POST to API then refetch
  const addFollowUp = async (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => {
    if (isApiConnected) {
      try {
        await api.createFollowUp({
          customer_id: newFu.customer_id,
          type: newFu.type,
          note: newFu.note,
        });
        showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว 📞');
        await loadData();
      } catch (err) {
        showToast('error', `บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return;
      }
    } else {
      // Fallback: local state
      const created: FollowUp = {
        ...newFu,
        id: 'fu_' + Math.random().toString(36).substring(2, 11),
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      setFollowUps((prev) => [created, ...prev]);
      showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว (Mock Mode) 📞');
    }

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
    isLoading,
    apiError,
    isApiConnected,
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
    isLoading,
    apiError,
    isApiConnected,
  ]);

  return (
    <CXContext.Provider value={contextValue}>
      {children}
    </CXContext.Provider>
  );
}
