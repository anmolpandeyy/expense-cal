import React from 'react';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

/**
 * Summary component.
 * Displays a financial summary with income, expenses, and balance.
 * Shows data for the currently selected month.
 * 
 * @returns Summary component with financial overview
 */
export const Summary: React.FC = () => {
  // Get current month and data from store
  const { currentMonth, monthlyData } = useAppStore();
  
  // Get current month data or use empty defaults
  const currentMonthData = monthlyData[currentMonth] || {
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: [],
  };
  
  const { income, expenses, balance } = currentMonthData;
  
  return (
    <div className="flex flex-col w-full overflow-hidden rounded-lg shadow-sm">
      <div className="flex h-40">
        {/* Income Section */}
        <div className="w-1/2 bg-indigo-500 p-4 flex flex-col justify-center items-center text-white">
          <span className="text-xl font-light mb-2">Income</span>
          <span className="text-4xl font-bold">{formatCurrency(income)}</span>
          <button className="mt-4 bg-white/20 text-white px-4 py-1 rounded-full text-sm">
            Details
          </button>
        </div>
        
        {/* Expenses Section */}
        <div className="w-1/2 bg-rose-500 p-4 flex flex-col justify-center items-center text-white">
          <span className="text-xl font-light mb-2">Expenses</span>
          <span className="text-4xl font-bold">{formatCurrency(expenses)}</span>
          <button className="mt-4 bg-white/20 text-white px-4 py-1 rounded-full text-sm">
            Details
          </button>
        </div>
      </div>
      
      {/* Balance Section */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 rounded-lg shadow-md">
        <div className="text-center">
          <span className="text-sm text-gray-500">Balance</span>
          <div className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
          </div>
        </div>
      </div>
    </div>
  );
}; 