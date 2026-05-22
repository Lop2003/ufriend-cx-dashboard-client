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
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [branchStats, setBranchStats] = useState<api.BranchStatData[]>([]);

  // Loading & Error State
  const [isLoading, setIsLoading] = useState(true);
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
      const [summaryData, feedbacksData] = await Promise.all([
        api.fetchSummary(),
        api.fetchFeedbacks(),
      ]);
      setApiSummary(summaryData);
      setFeedbacks(feedbacksData);
      setIsApiConnected(true);
    } catch (err) {
      console.warn('Dashboard API unavailable, falling back to mock stats:', err);

      // Construct Mock Stats Summary
      setApiSummary({
        total_customers: initialCustomers.length,
        avg_rating: initialFeedbacks.reduce((acc, f) => acc + f.rating, 0) / initialFeedbacks.length,
        overdue_count: initialCustomers.filter(c => c.status === 'overdue').length,
        active_count: initialCustomers.filter(c => c.status === 'active').length,
        completed_count: initialCustomers.filter(c => c.status === 'completed').length,
      });
      setFeedbacks(initialFeedbacks);
      setFollowUps(initialFollowUps);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API สถิติได้ — กำลังใช้ข้อมูลตัวอย่าง (Mock Data)');
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
      // Construct Mock Branch Stats on failure
      const branchMap = new Map<string, { customer_count: number; avg_rating: number; overdue_count: number }>();
      initialCustomers.forEach(c => {
        if (branch && c.branch !== branch) return; // filter by branch in mock fallback
        if (!branchMap.has(c.branch)) branchMap.set(c.branch, { customer_count: 0, avg_rating: 0, overdue_count: 0 });
        const item = branchMap.get(c.branch)!;
        item.customer_count++;
        if (c.status === 'overdue') item.overdue_count++;
      });
      const fallbackStats = Array.from(branchMap.entries()).map(([br, item]) => {
        const branchCustomerIds = new Set(initialCustomers.filter(c => c.branch === br).map(c => c.id));
        const fbForBranch = initialFeedbacks.filter(f => branchCustomerIds.has(f.customer_id));
        const avg = fbForBranch.length > 0 ? fbForBranch.reduce((a, f) => a + f.rating, 0) / fbForBranch.length : 0;
        return { branch: br, ...item, avg_rating: parseFloat(avg.toFixed(1)) };
      });
      setBranchStats(fallbackStats);
    }
  }, []);

  // Every time selectedBranch changes, we must refetch branchStats according to user instructions.
  useEffect(() => {
    if (selectedBranch !== undefined) {
      fetchBranchStats(selectedBranch);
    }
  }, [selectedBranch, fetchBranchStats]);

  // 2. Decoupled Customer List Fetcher (Customers listing + Feedbacks)
  const loadCustomerListData = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const [customersData, feedbacksData] = await Promise.all([
        api.fetchCustomers({
          search: searchQuery,
          branch: selectedBranch,
          status: selectedStatus,
          sortBy,
          sortOrder,
        }),
        api.fetchFeedbacks(),
      ]);
      setCustomers(customersData);
      setFeedbacks(feedbacksData);
      setIsApiConnected(true);
    } catch (err) {
      console.warn('Customer API unavailable, falling back to mock data:', err);

      // Client-side filtering & sorting for Mock Data fallback
      let localCustomers = [...initialCustomers];
      if (searchQuery) {
        localCustomers = localCustomers.filter(c =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone.includes(searchQuery) ||
          c.product.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedBranch) {
        localCustomers = localCustomers.filter(c => c.branch === selectedBranch);
      }
      if (selectedStatus) {
        localCustomers = localCustomers.filter(c => c.status === selectedStatus);
      }
      localCustomers.sort((a, b) => {
        let valA: any = a[sortBy as keyof typeof a];
        let valB: any = b[sortBy as keyof typeof b];

        if (valA === undefined) valA = '';
        if (valB === undefined) valB = '';

        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        } else {
          return sortOrder === 'asc'
            ? (valA > valB ? 1 : -1)
            : (valB > valA ? 1 : -1);
        }
      });

      setCustomers(localCustomers);
      setFeedbacks(initialFeedbacks);
      setFollowUps(initialFollowUps);
      setIsApiConnected(false);
      setApiError('ไม่สามารถเชื่อมต่อ API รายชื่อลูกค้าได้ — กำลังใช้ข้อมูลตัวอย่าง (Mock Data)');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedBranch, selectedStatus, sortBy, sortOrder]);

  // Load dashboard stats on mount or when switching to 'dashboard' page
  useEffect(() => {
    if (currentPage === 'dashboard') {
      loadDashboardData();
    }
  }, [currentPage, loadDashboardData]);

  // Load customer table list when switching to 'customers' page or when active filters change
  useEffect(() => {
    if (currentPage === 'customers') {
      loadCustomerListData();
    }
  }, [currentPage, loadCustomerListData]);

  // Set default selected customer if none selected or if selected customer is no longer in the list
  useEffect(() => {
    if (customers.length > 0) {
      if (!selectedCustomerId || !customers.some(c => c.id === selectedCustomerId)) {
        setSelectedCustomerId(customers[0].id);
      }
    }
  }, [customers, selectedCustomerId]);

  // Compatibility aliases
  const filteredCustomers = customers;
  
  const filteredFeedbacks = feedbacks;

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
    const totalCustomers = customers.length;
    const avgRating = feedbacks.length > 0
      ? (feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';
    const overdueCount = customers.filter(c => c.status === 'overdue').length;
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
    if (isApiConnected) {
      try {
        await api.createFeedback({
          customer_id: newFb.customer_id,
          rating: newFb.rating,
          comment: newFb.comment,
          category: newFb.category,
        });
        showToast('success', 'บันทึกคำติชมเรียบร้อยแล้ว ✨');
        await Promise.all([loadDashboardData(), loadCustomerListData()]);
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
        await Promise.all([loadDashboardData(), loadCustomerListData()]);
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
