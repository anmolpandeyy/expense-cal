import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Transaction, TransactionType } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend);

export const ExpenseChart: React.FC = () => {
  const { currentMonth, monthlyData, categories } = useAppStore();
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [categoryPercentages, setCategoryPercentages] = useState<Record<string, number>>({});
  const [viewType, setViewType] = useState<TransactionType>('expense');
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const currentMonthData = monthlyData[currentMonth] || {
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: [],
  };
  
  useEffect(() => {
    if (!isMounted) return;
    
    // Calculate totals by category
    const totals: Record<string, number> = {};
    const filteredTransactions = currentMonthData.transactions.filter(
      (t: Transaction) => t.type === viewType
    );
    
    filteredTransactions.forEach((transaction: Transaction) => {
      const { categoryId, amount } = transaction;
      totals[categoryId] = (totals[categoryId] || 0) + amount;
    });
    
    setCategoryTotals(totals);
    
    // Calculate percentages
    const totalAmount = viewType === 'expense' ? currentMonthData.expenses : currentMonthData.income;
    const percentages: Record<string, number> = {};
    
    Object.entries(totals).forEach(([categoryId, amount]) => {
      percentages[categoryId] = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    });
    
    setCategoryPercentages(percentages);
  }, [currentMonthData, viewType, isMounted]);
  
  // If not mounted yet, return a placeholder to prevent hydration errors
  if (!isMounted) {
    return <div className="flex flex-col p-4">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 h-64 flex items-center justify-center">
        <p className="text-slate-400">Loading chart data...</p>
      </div>
    </div>;
  }
  
  // Prepare chart data
  const filteredCategories = categories.filter(c => c.type === viewType);
  
  const chartData = {
    labels: filteredCategories
      .filter(category => categoryTotals[category.id] > 0)
      .map(category => category.name),
    datasets: [
      {
        data: filteredCategories
          .filter(category => categoryTotals[category.id] > 0)
          .map(category => categoryTotals[category.id]),
        backgroundColor: [
          '#FF6384', // Red
          '#FFCE56', // Yellow
          '#36A2EB', // Blue
          '#4BC0C0', // Teal
          '#9966FF', // Purple
          '#FF9F40', // Orange
          '#8AC926', // Green
          '#FF5733', // Coral
          '#1982C4', // Sky Blue
          '#6A4C93', // Violet
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  
  // Sort categories by amount (descending)
  const sortedCategories = filteredCategories
    .filter(category => categoryTotals[category.id] > 0)
    .sort((a, b) => (categoryTotals[b.id] || 0) - (categoryTotals[a.id] || 0));
  
  const totalAmount = viewType === 'expense' ? currentMonthData.expenses : currentMonthData.income;
  
  return (
    <div className="flex flex-col p-4">
      {/* Toggle */}
      <div className="bg-white mb-4 rounded-lg shadow-sm">
        <div className="flex rounded-full bg-slate-100 p-1 mx-4 my-4">
          <button
            className={`flex-1 py-2 px-4 rounded-full ${viewType === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
            onClick={() => setViewType('expense')}
            type="button"
          >
            Expenses
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-full ${viewType === 'income' ? 'bg-indigo-500 text-white' : 'text-slate-600'}`}
            onClick={() => setViewType('income')}
            type="button"
          >
            Income
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">{viewType === 'expense' ? 'Expenses' : 'Income'}</h2>
          <p className="text-4xl font-bold text-slate-800">{formatCurrency(totalAmount)}</p>
        </div>
        
        <div className="h-64 relative">
          {sortedCategories.length > 0 ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>No {viewType === 'expense' ? 'expenses' : 'income'} for this month</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-slate-700 mb-4">{viewType === 'expense' ? 'Expenses' : 'Income'} list</h3>
        
        {sortedCategories.length > 0 ? (
          <div className="space-y-4">
            {sortedCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: viewType === 'expense' ? '#f87171' : '#818cf8',
                      opacity: 0.8
                    }}
                  >
                    <span className="text-lg text-white">{category.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{category.name}</div>
                    <div className="text-sm text-slate-500">
                      {categoryPercentages[category.id]?.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className="text-lg font-semibold text-slate-800">
                  {formatCurrency(categoryTotals[category.id] || 0)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <p>No {viewType === 'expense' ? 'expenses' : 'income'} for this month</p>
          </div>
        )}
      </div>
    </div>
  );
}; 