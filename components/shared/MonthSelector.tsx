import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths, parse, addYears, subYears } from 'date-fns';
import { useAppStore } from '@/lib/store';
import { getMonthName } from '@/lib/utils';

export const MonthSelector: React.FC = () => {
  const { currentMonth, setCurrentMonth } = useAppStore();
  const [isSelectingMonth, setIsSelectingMonth] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const currentDate = parse(currentMonth, 'yyyy-MM', new Date());
  const currentYear = format(currentDate, 'yyyy');
  const currentMonthName = getMonthName(currentMonth);
  
  const handlePreviousMonth = () => {
    const prevMonth = format(subMonths(currentDate, 1), 'yyyy-MM');
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = format(addMonths(currentDate, 1), 'yyyy-MM');
    setCurrentMonth(nextMonth);
  };
  
  const handlePreviousYear = () => {
    const prevYear = format(subYears(currentDate, 1), 'yyyy-MM');
    setCurrentMonth(prevYear);
  };
  
  const handleNextYear = () => {
    const nextYear = format(addYears(currentDate, 1), 'yyyy-MM');
    setCurrentMonth(nextYear);
  };
  
  const handleMonthSelect = (month: number) => {
    const selectedMonth = format(new Date(parseInt(currentYear), month, 1), 'yyyy-MM');
    setCurrentMonth(selectedMonth);
    setIsSelectingMonth(false);
  };
  
  const months = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 3 },
    { name: 'May', value: 4 },
    { name: 'Jun', value: 5 },
    { name: 'Jul', value: 6 },
    { name: 'Aug', value: 7 },
    { name: 'Sep', value: 8 },
    { name: 'Oct', value: 9 },
    { name: 'Nov', value: 10 },
    { name: 'Dec', value: 11 },
  ];
  
  const currentMonthValue = parseInt(format(currentDate, 'M')) - 1;
  
  // Generate years for the picker (5 years before and after current year)
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year, label: year.toString() };
  });
  
  // If not mounted yet, return a placeholder to prevent hydration errors
  if (!isMounted) {
    return <div className="flex items-center justify-center">
      <span className="text-xl font-semibold text-slate-800">Loading...</span>
    </div>;
  }
  
  if (isSelectingMonth) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setIsSelectingMonth(false)}
            className="p-2 rounded-full hover:bg-slate-100"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <h1 className="text-xl font-semibold text-slate-800">{currentYear}</h1>
          
          <div className="w-10 h-10"></div> {/* Spacer for alignment */}
        </header>
        
        {/* Year Selector */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <button 
              onClick={handlePreviousYear}
              className="p-2 rounded-full hover:bg-slate-100"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{currentYear}</div>
            </div>
            
            <button 
              onClick={handleNextYear}
              className="p-2 rounded-full hover:bg-slate-100 rotate-180"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </div>
        
        {/* Month Grid */}
        <div className="grid grid-cols-3 gap-4 p-6">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthSelect(month.value)}
              className={`py-4 px-6 rounded-full text-lg ${
                month.value === currentMonthValue
                  ? 'bg-amber-400 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              type="button"
            >
              {month.name}
            </button>
          ))}
        </div>
        
        {/* Year Picker (Wheel-like) */}
        <div className="mt-auto p-4 border-t">
          <div className="relative overflow-hidden h-40 bg-slate-50 rounded-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="w-full h-12 border-t border-b border-slate-200"></div>
            </div>
            
            <div className="h-full overflow-auto py-14 snap-y snap-mandatory scrollbar-hide">
              {years.map((year) => (
                <div 
                  key={year.value}
                  className={`h-12 flex items-center justify-center snap-center ${
                    year.value.toString() === currentYear 
                      ? 'text-xl font-bold text-amber-500' 
                      : 'text-lg text-slate-600'
                  }`}
                  onClick={() => {
                    const newDate = new Date(year.value, currentDate.getMonth(), 1);
                    setCurrentMonth(format(newDate, 'yyyy-MM'));
                  }}
                >
                  {year.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      <button 
        onClick={() => setIsSelectingMonth(true)}
        className="flex items-center focus:outline-none"
        type="button"
      >
        <span className="text-xl font-semibold text-slate-800">{currentMonthName}</span>
        <ChevronDown className="w-5 h-5 ml-1 text-slate-600" />
      </button>
    </div>
  );
}; 