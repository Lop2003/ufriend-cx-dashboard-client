// Types aligning exactly with the Go backend models and DTOs

export interface Customer {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  plan_months: number;
  status: 'active' | 'overdue' | 'completed';
  created_at: string;
}

export interface FeedbackSub {
  id: string;
  rating: number;
  comment: string;
  category: 'service' | 'payment' | 'product' | 'branch';
  sentiment: 'positive' | 'neutral' | 'negative';
  created_at: string;
}

export interface FollowUpSub {
  id: string;
  type: 'payment_remind' | 'feedback_reply' | 'promotion';
  note: string;
  status: 'pending' | 'done';
  created_at: string;
}

export interface CustomerDetailResponse {
  id: string;
  name: string;
  phone: string;
  product: string;
  branch: string;
  plan_months: number;
  status: 'active' | 'overdue' | 'completed';
  created_at: string;
  feedbacks: FeedbackSub[];
  follow_ups: FollowUpSub[];
}

export interface Feedback {
  id: string;
  customer_id: string;
  rating: number;
  comment: string;
  category: 'service' | 'payment' | 'product' | 'branch';
  sentiment: 'positive' | 'neutral' | 'negative';
  created_at: string;
}

export interface FollowUp {
  id: string;
  customer_id: string;
  type: 'payment_remind' | 'feedback_reply' | 'promotion';
  note: string;
  status: 'pending' | 'done';
  created_at: string;
}

export interface SummaryResponse {
  total_customers: number;
  avg_rating: number;
  overdue_count: number;
  active_count: number;
  completed_count: number;
}

export interface BranchStat {
  branch: string;
  customer_count: number;
  avg_rating: number;
  overdue_count: number;
}
