import { Customer } from '../../../types';
import FeedbackForm from '../components/FeedbackForm';

interface AddFeedbackPageProps {
  customers: Customer[];
  onSubmit: (data: { customer_id: string; rating: number; comment: string; category: 'service' | 'payment' | 'product' | 'branch' }) => void;
  onCancel: () => void;
}

export default function AddFeedbackPage({ customers, onSubmit, onCancel }: AddFeedbackPageProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 font-body">
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-sm font-semibold text-primary hover:text-primary-dark transition-all flex items-center gap-1"
        >
          ← กลับแดชบอร์ดหลัก
        </button>
      </div>

      <FeedbackForm
        customers={customers}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
