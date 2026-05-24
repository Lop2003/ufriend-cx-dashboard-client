/**
 * API Service Layer — UFriend CX Dashboard
 * 
 * Centralized HTTP client for the Go Fiber backend.
 * Vite dev server proxies `/api` → `http://localhost:3000`.
 * 
 * Unwraps the standard response envelope: { success, message, data }
 */

import type { Customer, Feedback, FollowUp } from '../types';

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const baseURL = 'http://localhost:3000';
  const res = await fetch(`${baseURL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json: APIResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || `Request failed: ${res.status}`);
  }
  return json.data;
}

export interface FetchCustomersParams {
  search?: string;
  branch?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function fetchCustomers(params?: FetchCustomersParams): Promise<Customer[]> {
  const query = new URLSearchParams();
  if (params) {
    if (params.search) query.append('search', params.search);
    if (params.branch) query.append('branch', params.branch);
    if (params.status) query.append('status', params.status);
    if (params.sortBy) query.append('sort_by', params.sortBy);
    if (params.sortOrder) query.append('sort_order', params.sortOrder);
  }
  const queryString = query.toString();
  const url = `/api/customers/${queryString ? `?${queryString}` : ''}`;
  return request<Customer[]>(url);
}

// ─── Request deduplication for detail fetches ────────────────────────
// If a fetch for the same customer ID is already in-flight, reuse the
// pending promise instead of firing a duplicate HTTP request.
const pendingDetailRequests = new Map<string, Promise<Customer & { feedbacks: Feedback[]; follow_ups: FollowUp[] }>>();

export async function fetchCustomerDetail(id: string) {
  const existing = pendingDetailRequests.get(id);
  if (existing) return existing;

  const promise = request<Customer & { feedbacks: Feedback[]; follow_ups: FollowUp[] }>(`/api/customers/${id}`)
    .finally(() => pendingDetailRequests.delete(id));

  pendingDetailRequests.set(id, promise);
  return promise;
}

// ─── Stats ───────────────────────────────────────────────────────────
export interface SummaryData {
  total_customers: number;
  avg_rating: number;
  overdue_count: number;
  active_count: number;
  completed_count: number;
}

export async function fetchSummary(): Promise<SummaryData> {
  return request<SummaryData>('/api/stats/summary');
}

export interface BranchStatData {
  branch: string;
  customer_count: number;
  avg_rating: number;
  overdue_count: number;
}

export async function fetchBranchStats(branch?: string): Promise<BranchStatData[]> {
  const url = branch ? `/api/stats/by-branch?branch=${encodeURIComponent(branch)}` : '/api/stats/by-branch';
  return request<BranchStatData[]>(url);
}

// ─── Feedback ────────────────────────────────────────────────────────
export async function fetchFeedbacks(): Promise<Feedback[]> {
  return request<Feedback[]>('/api/feedbacks/');
}

export interface CreateFeedbackPayload {
  customer_id: string;
  rating: number;
  comment: string;
  category: 'service' | 'payment' | 'product' | 'branch';
}

export async function createFeedback(payload: CreateFeedbackPayload): Promise<Feedback> {
  return request<Feedback>('/api/feedbacks/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Follow-Up ───────────────────────────────────────────────────────
export interface CreateFollowUpPayload {
  customer_id: string;
  type: 'payment_remind' | 'feedback_reply' | 'general';
  note: string;
}

export async function createFollowUp(payload: CreateFollowUpPayload): Promise<FollowUp> {
  return request<FollowUp>('/api/follow-ups/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateFollowUpStatus(id: string, status: 'pending' | 'done'): Promise<FollowUp> {
  return request<FollowUp>(`/api/follow-ups/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
