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
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json: APIResponse<T> = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || json.error || `Request failed: ${res.status}`);
  }
  return json.data;
}

// ─── Customer Queries ────────────────────────────────────────────────
export async function fetchCustomers(): Promise<Customer[]> {
  return request<Customer[]>('/api/customers/');
}

export async function fetchCustomerDetail(id: string) {
  return request<Customer & { feedbacks: Feedback[]; follow_ups: FollowUp[] }>(`/api/customers/${id}`);
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

export async function fetchBranchStats(): Promise<BranchStatData[]> {
  return request<BranchStatData[]>('/api/stats/by-branch');
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
