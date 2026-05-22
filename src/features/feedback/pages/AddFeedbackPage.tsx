import useCX from '../../../hooks/useCX';
import FeedbackForm from '../components/FeedbackForm';

export default function AddFeedbackPage() {
  const { setCurrentPage } = useCX();

  const handleCancel = () => {
    setCurrentPage('customers');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-body">
      <div className="flex items-center justify-between">
        <button
          onClick={handleCancel}
          className="text-sm font-semibold text-primary hover:text-primary-dark transition-all flex items-center gap-1"
        >
          ← กลับหน้ารายชื่อลูกค้า
        </button>
      </div>

      <FeedbackForm />
    </div>
  );
}
