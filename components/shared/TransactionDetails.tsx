import React, { useState, useEffect } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';

/**
 * Props for the TransactionDetails component.
 */
interface TransactionDetailsProps {
  /** ID of the transaction to display */
  transactionId: string;
  /** Callback function to close the details view */
  onClose: () => void;
  /** Callback function to edit the transaction */
  onEdit: (id: string) => void;
}

/**
 * TransactionDetails component.
 * Displays detailed information about a specific transaction.
 * Provides options to edit or delete the transaction.
 * 
 * @param props - Component props
 * @param props.transactionId - ID of the transaction to display
 * @param props.onClose - Callback function to close the details view
 * @param props.onEdit - Callback function to edit the transaction
 * @returns Transaction details component
 */
export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transactionId, 
  onClose,
  onEdit
}) => {
  const { transactions, categories, deleteTransaction } = useAppStore();
  const [isMounted, setIsMounted] = useState(false);
  
  /**
   * Handle client-side mounting to prevent hydration errors.
   * Next.js requires this to ensure client-side state matches server-side.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Find the transaction and its category
  const transaction = transactions.find(t => t.id === transactionId);
  const category = transaction ? categories.find(c => c.id === transaction.categoryId) : null;
  
  /**
   * Handles deleting the transaction.
   * Deletes the transaction and closes the details view.
   */
  const handleDelete = () => {
    if (transaction) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };
  
  /**
   * Handles editing the transaction.
   * Calls the onEdit callback with the transaction ID.
   */
  const handleEdit = () => {
    if (transaction) {
      onEdit(transaction.id);
    }
  };
  
  // If not mounted yet or transaction not found, return a placeholder
  if (!isMounted || !transaction || !category) {
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <h1 className="text-xl font-semibold text-slate-800">Details</h1>
          
          <div className="w-10 h-10"></div> {/* Spacer for alignment */}
        </header>
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-center text-slate-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Format the date and determine if it's an expense
  const formattedDate = format(new Date(transaction.date), 'dd MMM yyyy');
  const isExpense = transaction.type === 'expense';
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header with back and delete buttons */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <h1 className="text-xl font-semibold text-slate-800">Details</h1>
        
        <button 
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-100"
          type="button"
        >
          <Trash2 className="w-5 h-5 text-rose-500" />
        </button>
      </header>
      
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Category header with icon */}
          <div className="flex items-center mb-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
              style={{ 
                backgroundColor: isExpense ? '#f87171' : '#818cf8',
                opacity: 0.8
              }}
            >
              <span className="text-3xl text-white">{category.icon}</span>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800">{category.name}</h2>
              {transaction.description && (
                <p className="text-slate-600">{transaction.description}</p>
              )}
            </div>
          </div>
          
          {/* Transaction details */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-400">Category</span>
              <span className="font-medium text-slate-700">{isExpense ? 'Expenses' : 'Income'}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-400">Money</span>
              <span className="font-medium text-slate-700">{formatCurrency(transaction.amount)}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-slate-100">
              <span className="text-slate-400">Date</span>
              <span className="font-medium text-slate-700">{formattedDate}</span>
            </div>
            
            {transaction.description && (
              <div className="flex justify-between py-3 border-b border-slate-100">
                <span className="text-slate-400">Memo</span>
                <span className="font-medium text-slate-700">{transaction.description}</span>
              </div>
            )}
          </div>
          
          {/* Edit button */}
          <button
            onClick={handleEdit}
            className="w-full py-3 bg-amber-400 text-white rounded-lg flex items-center justify-center"
            type="button"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}; 