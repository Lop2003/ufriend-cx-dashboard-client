import { createContext, useState, useMemo, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Customer, Feedback, FollowUp } from '../types';
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
  addFeedback: (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => Promise<boolean>;
  addFollowUp: (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => Promise<boolean>;

  // Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  resetFilters: () => void;

  // Sorting State
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;

  // Computed & Filtered Data
  filteredCustomers: Customer[];
  filteredFeedbacks: Feedback[];
  branchStats: api.BranchStatData[];
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
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [followUps] = useState<FollowUp[]>([]);
  const [branchStats, setBranchStats] = useState<api.BranchStatData[]>([]);

  // Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedCustomersRef = useRef(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Sorting State
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBranch('');
    setSelectedStatus('');
    setSortBy('created_at');
    setSortOrder('desc');
  };

  // ─── Fetch All Data from API (with fallback to mock) ───────────────
  const [apiSummary, setApiSummary] = useState<api.SummaryData | null>(null);

  // 1. Decoupled Dashboard Fetcher (Stats Summary + Stats by Branch + Feedbacks for charts)
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [summaryData, feedbacksData, customersData] = await Promise.all([
        api.fetchSummary(),
        api.fetchFeedbacks(),
        api.fetchCustomers(), // Fetch all customers to map customer_id -> branch dynamically
      ]);
      setApiSummary(summaryData);
      setFeedbacks(feedbacksData);
      setAllCustomers(customersData || []);
      setIsApiConnected(true);
    } catch (err) {
      console.error('Dashboard API unavailable:', err);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API สถิติได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1.5 Fetch Branch Stats dynamically
  const fetchBranchStats = useCallback(async (branch?: string) => {
    try {
      const data = await api.fetchBranchStats(branch);
      setBranchStats(data);
    } catch (err) {
      console.warn('Failed to fetch branch stats', err);
      setBranchStats([]);
    }
  }, []);

  // Every time selectedBranch changes, we must refetch branchStats according to user instructions.
  useEffect(() => {
    if (selectedBranch !== undefined) {
      fetchBranchStats(selectedBranch);
    }
  }, [selectedBranch, fetchBranchStats]);

  // 2. Decoupled Customer List Fetcher (Customers listing only)
  const loadCustomerListData = useCallback(async () => {
    if (!hasLoadedCustomersRef.current) {
      setIsLoading(true);
    }
    setApiError(null);
    try {
      const isFormPage = currentPage === 'add-feedback' || currentPage === 'add-followup';
      const customersData = await api.fetchCustomers({
        search: isFormPage ? '' : searchQuery,
        branch: isFormPage ? '' : selectedBranch,
        status: isFormPage ? '' : selectedStatus,
        sortBy: isFormPage ? 'name' : sortBy,
        sortOrder: isFormPage ? 'asc' : sortOrder,
      });
      setCustomers(customersData || []);
      setIsApiConnected(true);
      hasLoadedCustomersRef.current = true;
    } catch (err) {
      console.warn('Customer API unavailable:', err);
      setCustomers([]);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API รายชื่อลูกค้าได้');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBranch, selectedStatus, sortBy, sortOrder, currentPage]);

  // Load dashboard stats on mount or when switching to 'dashboard' page
  useEffect(() => {
    if (currentPage === 'dashboard') {
      loadDashboardData();
    }
  }, [currentPage, loadDashboardData]);

  // Reset initial load status when page changes to ensure loader shows on page transitions
  useEffect(() => {
    hasLoadedCustomersRef.current = false;
  }, [currentPage]);

  // Load customer table list when switching to 'dashboard', 'customers', 'add-feedback', or 'add-followup' pages
  useEffect(() => {
    if (currentPage === 'dashboard' || currentPage === 'customers' || currentPage === 'add-feedback' || currentPage === 'add-followup') {
      loadCustomerListData();
    }
  }, [currentPage, loadCustomerListData]);

  // Set default selected customer if none selected or if selected customer is no longer in the list (only in customers list view with modal closed)
  useEffect(() => {
    if (currentPage === 'customers' && !isDetailModalOpen && customers.length > 0) {
      if (!selectedCustomerId || !customers.some(c => c.id === selectedCustomerId)) {
        setSelectedCustomerId(customers[0].id);
      }
    }
  }, [customers, selectedCustomerId, currentPage, isDetailModalOpen]);

  // Compatibility aliases
  const filteredCustomers = customers;
  
  const filteredFeedbacks = useMemo(() => {
    if (!selectedBranch) return feedbacks;
    // Create a map of customer ID to branch dynamically
    const customerBranchMap = new Map(allCustomers.map(c => [c.id, c.branch]));
    // Filter feedbacks where the customer's branch matches the selected branch
    return feedbacks.filter(fb => customerBranchMap.get(fb.customer_id) === selectedBranch);
  }, [feedbacks, allCustomers, selectedBranch]);

  const summaryStats = useMemo(() => {
    // If a branch is selected, aggregate from branchStats
    if (selectedBranch && branchStats.length > 0) {
      const bStat = branchStats.find(s => s.branch === selectedBranch);
      if (bStat) {
        return {
          totalCustomers: bStat.customer_count,
          avgRating: bStat.avg_rating.toFixed(1),
          overdueCount: bStat.overdue_count,
          satisfactionRate: ((bStat.avg_rating / 5) * 100).toFixed(0),
        };
      }
    }

    // If API summary available, use server-computed stats
    if (apiSummary) {
      const satisfactionRate = feedbacks.length > 0
        ? ((feedbacks.filter(fb => fb.sentiment === 'positive').length / feedbacks.length) * 100).toFixed(0)
        : '0';
      return {
        totalCustomers: apiSummary.total_customers,
        avgRating: apiSummary.avg_rating.toFixed(1),
        overdueCount: apiSummary.overdue_count,
        satisfactionRate,
      };
    }

    // Fallback/Mock mode: compute from static data
    const totalCustomers = allCustomers.length > 0 ? allCustomers.length : customers.length;
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';
    const overdueCount = allCustomers.length > 0
      ? allCustomers.filter(c => c.status === 'overdue').length
      : customers.filter(c => c.status === 'overdue').length;
    const positiveFeedbacks = feedbacks.filter(fb => fb.sentiment === 'positive').length;
    const satisfactionRate = feedbacks.length > 0
      ? ((positiveFeedbacks / feedbacks.length) * 100).toFixed(0)
      : '0';

    return {
      totalCustomers,
      avgRating,
      overdueCount,
      satisfactionRate,
    };
  }, [apiSummary, customers, feedbacks, selectedBranch, branchStats]);

  // Add Feedback Action — POST to API then refetch
  const addFeedback = async (newFb: Omit<Feedback, 'id' | 'sentiment' | 'created_at'>) => {
    setSelectedCustomerId(newFb.customer_id);
    try {
      await api.createFeedback({
        customer_id: newFb.customer_id,
        rating: newFb.rating,
        comment: newFb.comment,
        category: newFb.category,
      });
      showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว ✨');
      setIsDetailModalOpen(true);
      return true;
    } catch (err) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  };

  // Add Follow-Up Action — POST to API then refetch
  const addFollowUp = async (newFu: Omit<FollowUp, 'id' | 'status' | 'created_at'>) => {
    setSelectedCustomerId(newFu.customer_id);
    try {
      await api.createFollowUp({
        customer_id: newFu.customer_id,
        type: newFu.type,
        note: newFu.note,
      });
      showToast('success', 'บันทึกการติดตามเรียบร้อยแล้ว 📞');
      setIsDetailModalOpen(true);
      return true;
    } catch (err) {
      showToast('error', `บันทึกไม่สำเร็จ: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
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
    branchStats,
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
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  }), [
    currentPage,
    selectedCustomerId,
    isDetailModalOpen,
    customers,
    feedbacks,
    followUps,
    branchStats,
    searchQuery,
    selectedBranch,
    selectedStatus,
    filteredCustomers,
    filteredFeedbacks,
    summaryStats,
    isLoading,
    apiError,
    isApiConnected,
    sortBy,
    sortOrder,
  ]);

  return (
    <CXContext.Provider value={contextValue}>
      {children}
    </CXContext.Provider>
  );
}
