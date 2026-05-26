import { useCX } from '../../../hooks/useCX';
import DashboardTable from '../../dashboard/components/DashboardTable';
import CustomSelect from '../../../components/CustomSelect';



export default function CustomerListPage() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedStatus,
    setSelectedStatus,
  } = useCX();

  // Stats calculation from the currently visible customer list
  const total = customers.length;
  const active = customers.filter(c => c.status === 'active').length;
  const overdue = customers.filter(c => c.status === 'overdue').length;
  const completed = customers.filter(c => c.status === 'completed').length;

  const branches = ["วงเวียนใหญ่", "รังสิต", "ลาดพร้าว", "สยาม"];

  // Custom select options
  const branchOptions = [
    { value: '', label: 'สาขา: ทั้งหมด' },
    ...branches.map(br => ({ value: br, label: br }))
  ];

  const statusOptions = [
    { value: '', label: 'สถานะ: ทั้งหมด' },
    { value: 'active', label: 'ปกติ (Active)', className: 'text-status-active' },
    { value: 'overdue', label: 'ค้างชำระ (Overdue)', className: 'text-status-overdue' },
    { value: 'completed', label: 'จบสัญญา (Completed)', className: 'text-status-completed' },
  ];

  const getStatusActiveClassName = () => {
    if (selectedStatus === 'overdue') return 'bg-red-50/70 border-red-300 text-status-overdue font-extrabold';
    if (selectedStatus === 'active') return 'bg-emerald-50/70 border-emerald-300 text-status-active font-extrabold';
    if (selectedStatus === 'completed') return 'bg-slate-100/80 border-slate-300 text-status-completed font-extrabold';
    return '';
  };

  return (
    <div className="space-y-6 font-body text-slate-800 antialiased animate-fade-in-up">
      {/* 🔮 Quick Customer Stats Deck (Soft UI) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div 
          onClick={() => setSelectedStatus('')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === '' ? 'ring-2 ring-primary border-transparent scale-[1.01] bg-blue-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider whitespace-nowrap">ลูกค้าทั้งหมด</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-primary-dark mt-1">{total} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('active')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'active' ? 'ring-2 ring-emerald-500 border-transparent scale-[1.01] bg-emerald-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-active whitespace-nowrap">ผ่อนชำระปกติ</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-active mt-1">{active} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('overdue')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto relative overflow-hidden group cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'overdue' ? 'ring-2 ring-red-500 border-transparent scale-[1.01] bg-red-50/20' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-overdue flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-status-overdue rounded-full pulse-red-glow shrink-0"></span>
            ค้างชำระค่างวด
          </span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-overdue mt-1">{overdue} ราย</span>
        </div>
        <div 
          onClick={() => setSelectedStatus('completed')}
          className={`bg-white p-3 sm:p-4 rounded-2xl border shadow-sm flex flex-col justify-between min-h-[5rem] h-auto cursor-pointer active:scale-95 hover:shadow-md transition-all duration-300 ${
            selectedStatus === 'completed' ? 'ring-2 ring-slate-400 border-transparent scale-[1.01] bg-slate-50' : 'border-gray-100'
          }`}
        >
          <span className="text-[9px] xs:text-[10px] lg:text-[9px] xl:text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-status-completed whitespace-nowrap">จบสัญญาแล้ว</span>
          <span className="text-lg xs:text-xl lg:text-lg xl:text-xl font-black text-status-completed mt-1">{completed} ราย</span>
        </div>
      </div>

      {/* 🔍 Filter Deck */}
      <div className="bg-white rounded-2xl border border-gray-150 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 text-gray-800 soft-recessed border-0"
            placeholder="ค้นหาชื่อลูกค้า, เบอร์โทร, สินค้าผ่อน..."
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto shrink-0">
          {/* Reusable Custom Branch Select */}
          <CustomSelect
            value={selectedBranch}
            onChange={setSelectedBranch}
            options={branchOptions}
            placeholder="สาขา: ทั้งหมด"
          />

          {/* Reusable Custom Status Select */}
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statusOptions}
            placeholder="สถานะ: ทั้งหมด"
            activeClassName={getStatusActiveClassName()}
          />
        </div>
      </div>

      <DashboardTable />
    </div>
  );
}
