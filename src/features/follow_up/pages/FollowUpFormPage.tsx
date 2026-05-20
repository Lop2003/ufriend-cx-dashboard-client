import { Customer } from '../../../types';
import FollowUpForm from '../components/FollowUpForm';

interface FollowUpFormPageProps {
  selectedCustomerId: string;
  customers: Customer[];
  onSubmit: (data: { customer_id: string; type: 'payment_remind' | 'feedback_reply' | 'general'; note: string }) => void;
  onCancel: () => void;
}

export default function FollowUpFormPage({ selectedCustomerId, customers, onSubmit, onCancel }: FollowUpFormPageProps) {
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

      <FollowUpForm
        selectedCustomerId={selectedCustomerId}
        customers={customers}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
