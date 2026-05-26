import { useState } from 'react';

interface Option {
  value: string;
  label: string;
  className?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  activeClassName?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  activeClassName = 'bg-blue-50/70 border-primary/30 text-primary font-extrabold',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full md:w-44">
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`pl-3.5 pr-9 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer w-full rounded-xl shadow-sm border text-left flex items-center justify-between ${
          value
            ? activeClassName
            : 'bg-slate-50/70 border-gray-200 text-gray-700 hover:bg-slate-100/60'
        }`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`fill-current h-4 w-4 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : value ? 'text-primary' : 'text-gray-400'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>

      {/* Floating Options Panel Overlay */}
      {isOpen && (
        <>
          {/* Backdrop overlay to close dropdown on clicking outside */}
          <div
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute z-30 w-full mt-1.5 bg-white/95 backdrop-blur-md border border-gray-150 rounded-2xl shadow-xl max-h-60 overflow-y-auto font-sans animate-fade-in-up py-1.5 divide-y divide-gray-50/80">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-all hover:bg-slate-50 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-primary-light text-primary border-l-4 border-l-primary'
                      : opt.className || 'text-gray-700'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <svg
                      className="w-3.5 h-3.5 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
