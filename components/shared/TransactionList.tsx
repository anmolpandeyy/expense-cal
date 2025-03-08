import React from 'react';
import { useAppStore } from '@/lib/store';
import { formatDate, formatCurrency, groupTransactionsByDate } from '@/lib/utils';

/**
 * Props for the TransactionList component.
 */
interface TransactionListProps {
  /** Callback function when a transaction is clicked */
  onTransactionClick: (id: string) => void;
}

/**
 * TransactionList component.
 * Displays a list of transactions grouped by date.
 * Shows the newest transactions first.
 * 
 * @param props - Component props
 * @param props.onTransactionClick - Callback function when a transaction is clicked
 * @returns Transaction list component or null if no transactions
 */
export const TransactionList: React.FC<TransactionListProps> = ({ onTransactionClick }) => {
  // Get data from store
  const { currentMonth, monthlyData, categories, deleteTransaction } = useAppStore();
  
  // Get current month data or use empty defaults
  const currentMonthData = monthlyData[currentMonth] || {
    income: 0,
    expenses: 0,
    balance: 0,
    transactions: [],
  };
  
  const { transactions } = currentMonthData;
  
  // Group transactions by date
  const groupedTransactions = groupTransactionsByDate(transactions);
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Return null for empty state, letting parent component handle it
  if (transactions.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-col divide-y">
      {sortedDates.map(date => {
        const dailyTransactions = groupedTransactions[date];
        
        // Calculate daily total (income positive, expenses negative)
        const dailyTotal = dailyTransactions.reduce((sum, t) => 
          sum + (t.type === 'income' ? t.amount : -t.amount), 0
        );
        
        // Sort transactions within each day to show newest first
        const sortedTransactions = [...dailyTransactions].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        return (
          <div key={date} className="bg-white mb-2">
            {/* Date header with daily total */}
            <div className="flex justify-between items-center px-4 py-3 bg-slate-50">
              <div className="text-slate-500">{formatDate(date)}</div>
              <div className={`font-medium ${dailyTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {dailyTotal >= 0 ? '+' : ''}{formatCurrency(Math.abs(dailyTotal))}
              </div>
            </div>
            
            {/* Transaction list for this date */}
            <div className="divide-y">
              {sortedTransactions.map(transaction => {
                const category = categories.find(c => c.id === transaction.categoryId);
                
                return (
                  <div 
                    key={transaction.id} 
                    className="flex items-center px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer"
                    onClick={() => onTransactionClick(transaction.id)}
                  >
                    {/* Category icon */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ 
                        backgroundColor: transaction.type === 'income' ? '#818cf8' : '#f87171',
                        opacity: 0.8
                      }}
                    >
                      <span className="text-lg text-white">{category?.icon || '💰'}</span>
                    </div>
                    
                    {/* Transaction description */}
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">
                        {transaction.description || category?.name || 'Uncategorized'}
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-slate-500">{category?.name}</div>
                      )}
                    </div>
                    
                    {/* Transaction amount */}
                    <div className={`font-medium ${transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 