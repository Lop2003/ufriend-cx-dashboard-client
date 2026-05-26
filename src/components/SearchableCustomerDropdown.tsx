import { useState } from 'react';
import { Customer } from '../types';

interface SearchableCustomerDropdownProps {
  customers: Customer[];
  selectedCustomerId: string;
  onChange: (id: string) => void;
  label?: string;
  placeholder?: string;
  showOverdueBadges?: boolean;
}

export default function SearchableCustomerDropdown({
  customers,
  selectedCustomerId,
  onChange,
  label = 'เลือกบัญชีลูกค้าสัญญา',
  placeholder = 'พิมพ์เพื่อค้นหาชื่อลูกค้า, เบอร์โทร, สาขา หรือสินค้า...',
  showOverdueBadges = false,
}: SearchableCustomerDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="relative">
      {label && (
        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={isOpen ? searchQuery : (selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.product} / สาขา${selectedCustomer.branch})` : searchQuery)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) {
              onChange('');
            }
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery('');
          }}
          className="w-full px-3 py-2.5 pl-9 border border-gray-250 rounded-xl text-xs font-semibold bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 shadow-sm cursor-pointer"
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {selectedCustomerId && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setSearchQuery('');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {!selectedCustomerId && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20 cursor-default" 
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          />
          
          <div className="absolute z-30 w-full mt-1.5 bg-white border border-gray-150 rounded-2xl shadow-xl max-h-56 overflow-y-auto font-sans animate-fade-in-up">
            {filteredCustomers.length === 0 ? (
              <div className="px-4 py-3 text-xs text-gray-400 text-center font-bold">
                ไม่พบรายชื่อลูกค้าที่ตรงคำค้นหา
              </div>
            ) : (
              <div className="py-1.5 divide-y divide-gray-50">
                {filteredCustomers.map((c) => {
                  const isSelected = c.id === selectedCustomerId;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => {
                        onChange(c.id);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-semibold transition-all hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 cursor-pointer ${
                        isSelected ? 'bg-primary-light text-primary font-bold border-l-4 border-l-primary' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-900 font-bold">{c.name}</span>
                          {showOverdueBadges && c.status === 'overdue' && (
                            <span className="text-[8px] bg-red-50 text-status-overdue border border-red-100/50 px-1 py-0.2 rounded font-extrabold tracking-wide uppercase animate-pulse">
                              ค้างชำระ
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">เบอร์: {c.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 self-start sm:self-center shrink-0">
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                          {c.product}
                        </span>
                        <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">
                          สาขา {c.branch}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
