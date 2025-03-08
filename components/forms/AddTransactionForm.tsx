import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { TransactionType } from '@/lib/types';
import { ChevronLeft, Check, Calendar, ChevronDown } from 'lucide-react';
import { format, parse, addDays, subDays } from 'date-fns';

/**
 * Props for the AddTransactionForm component.
 */
interface AddTransactionFormProps {
  /** Callback function to close the form */
  onClose: () => void;
  /** Optional ID of transaction to edit */
  transactionId?: string;
}

/**
 * AddTransactionForm component.
 * Provides a form for adding or editing transactions.
 * Includes a calculator, date picker, and category selection.
 * 
 * @param props - Component props
 * @param props.onClose - Callback function to close the form
 * @param props.transactionId - Optional ID of transaction to edit
 * @returns Transaction form component
 */
export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ 
  onClose,
  transactionId
}) => {
  // Get store actions and data
  const { categories, addTransaction, transactions, updateTransaction } = useAppStore();
  
  // Form state
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>('');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  /**
   * Handle client-side mounting to prevent hydration errors.
   * Next.js requires this to ensure client-side state matches server-side.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  /**
   * Load transaction data if editing an existing transaction.
   * Populates the form with the transaction's data.
   */
  useEffect(() => {
    if (isMounted && transactionId) {
      console.log('Loading transaction data for editing:', transactionId);
      const transaction = transactions.find(t => t.id === transactionId);
      if (transaction) {
        console.log('Found transaction:', transaction);
        setIsEditing(true);
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || '');
        setCategoryId(transaction.categoryId);
        setTransactionDate(new Date(transaction.date));
      } else {
        console.log('Transaction not found');
      }
    }
  }, [isMounted, transactionId, transactions]);
  
  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(category => category.type === type);
  
  // Reset expression when amount changes
  useEffect(() => {
    if (!isCalculating) {
      setExpression('');
    }
  }, [amount, isCalculating]);
  
  /**
   * Handles form submission.
   * If in calculation mode, evaluates the expression.
   * Otherwise, adds or updates the transaction.
   */
  const handleSubmit = () => {
    if (isCalculating) {
      try {
        // Evaluate the expression
        // eslint-disable-next-line no-eval
        const result = eval(expression);
        setAmount(result.toString());
        setIsCalculating(false);
      } catch (error) {
        console.error('Invalid expression:', error);
      }
      return;
    }
    
    if (!amount || !categoryId) {
      return;
    }
    
    const transactionData = {
      amount: parseFloat(amount),
      description,
      categoryId,
      type,
      date: transactionDate.toISOString(),
    };
    
    if (isEditing && transactionId) {
      updateTransaction(transactionId, transactionData);
    } else {
      addTransaction(transactionData);
    }
    
    onClose();
  };
  
  /**
   * Handles numpad button presses.
   * Manages both calculator mode and normal input mode.
   * 
   * @param key - The key that was pressed (number, operator, or special key)
   */
  const handleNumpadPress = (key: string | number) => {
    if (isCalculating) {
      // In calculation mode
      if (key === '=') {
        try {
          // Evaluate the expression
          // eslint-disable-next-line no-eval
          const result = eval(expression);
          setAmount(result.toString());
          setIsCalculating(false);
        } catch (error) {
          console.error('Invalid expression:', error);
        }
      } else if (key === 'del') {
        setExpression(prev => prev.slice(0, -1));
        if (expression.length <= 1) {
          setIsCalculating(false);
        }
      } else {
        setExpression(prev => prev + key);
      }
    } else {
      // In normal input mode
      if (['+', '-', '*', '/'].includes(key.toString())) {
        setIsCalculating(true);
        setExpression(amount + key);
      } else if (key === 'del') {
        setAmount(prev => prev.slice(0, -1));
      } else if (key === '.' && amount.includes('.')) {
        // Prevent multiple decimal points
        return;
      } else if (key === '=') {
        // Ignore equals in normal mode
        return;
      } else {
        setAmount(prev => prev + key);
      }
    }
  };
  
  const selectedCategory = categories.find(c => c.id === categoryId);
  
  /**
   * Date picker component.
   * Allows selecting a date for the transaction.
   * Provides month, day, and year selection.
   * 
   * @returns Date picker component
   */
  const DatePicker = () => {
    const [selectedYear, setSelectedYear] = useState<number>(transactionDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(transactionDate.getMonth());
    const [selectedDay, setSelectedDay] = useState<number>(transactionDate.getDate());
    
    // Month names for the dropdown
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Generate a range of years (5 years before and 4 years after current year)
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
    
    /**
     * Confirms the selected date and closes the picker.
     * Creates a new Date object from the selected year, month, and day.
     */
    const confirmDate = () => {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      setTransactionDate(newDate);
      setIsDatePickerOpen(false);
    };
    
    /**
     * Handles navigating to the previous day.
     * Updates year, month, and day state accordingly.
     */
    const handlePrevDay = () => {
      const currentDate = new Date(selectedYear, selectedMonth, selectedDay);
      const prevDate = subDays(currentDate, 1);
      setSelectedYear(prevDate.getFullYear());
      setSelectedMonth(prevDate.getMonth());
      setSelectedDay(prevDate.getDate());
    };
    
    /**
     * Handles navigating to the next day.
     * Updates year, month, and day state accordingly.
     */
    const handleNextDay = () => {
      const currentDate = new Date(selectedYear, selectedMonth, selectedDay);
      const nextDate = addDays(currentDate, 1);
      setSelectedYear(nextDate.getFullYear());
      setSelectedMonth(nextDate.getMonth());
      setSelectedDay(nextDate.getDate());
    };
    
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setIsDatePickerOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          
          <h1 className="text-xl font-semibold text-slate-800">Select Date</h1>
          
          <button
            onClick={confirmDate}
            className="p-2 text-indigo-500 font-medium"
            type="button"
          >
            Confirm
          </button>
        </header>
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={handlePrevDay}
              className="p-2 rounded-full hover:bg-slate-100"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-800">
                {selectedDay}
              </div>
              <div className="text-slate-500">
                {months[selectedMonth]} {selectedYear}
              </div>
            </div>
            
            <button 
              onClick={handleNextDay}
              className="p-2 rounded-full hover:bg-slate-100 rotate-180"
              type="button"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Month</label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="block w-full py-3 pl-4 pr-10 text-base border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>{month}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Year</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="block w-full py-3 pl-4 pr-10 text-base border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Day</label>
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                  className="block w-full py-3 pl-4 pr-10 text-base border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // If not mounted yet, return a placeholder to prevent hydration errors
  if (!isMounted) {
    return <div className="flex flex-col h-full bg-slate-50"></div>;
  }
  
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <h1 className="text-xl font-semibold text-slate-800">{isEditing ? 'Edit' : 'Add'}</h1>
        
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100"
          type="button"
        >
          <Calendar className="w-5 h-5 text-slate-600" />
        </button>
      </header>
      
      {/* Transaction Type Selector */}
      <div className="bg-white mb-4">
        <div className="flex rounded-full bg-slate-100 p-1 mx-4 my-4">
          <button
            className={`flex-1 py-2 px-4 rounded-full ${type === 'expense' ? 'bg-rose-500 text-white' : 'text-slate-600'}`}
            onClick={() => setType('expense')}
            type="button"
          >
            Expenses
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-full ${type === 'income' ? 'bg-indigo-500 text-white' : 'text-slate-600'}`}
            onClick={() => setType('income')}
            type="button"
          >
            Income
          </button>
        </div>
      </div>
      
      {/* Category Grid */}
      <div className="bg-white p-4 mb-4">
        <div className="grid grid-cols-4 gap-4">
          {filteredCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setCategoryId(category.id)}
              className={`flex flex-col items-center p-2 rounded-lg ${categoryId === category.id ? 'bg-slate-100' : ''}`}
              type="button"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${categoryId === category.id ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <span className="text-2xl">{category.icon}</span>
              </div>
              <span className="text-xs text-slate-600 text-center">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Amount and Description */}
      <div className="bg-white p-4 flex-1">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-3">
            <span className="text-2xl">{selectedCategory?.icon || '📝'}</span>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1 border-none bg-transparent text-lg text-slate-700 placeholder-slate-400 focus:outline-none"
            placeholder="Memo"
          />
          <div className="text-3xl font-bold text-slate-800">
            {isCalculating ? expression : (amount ? amount : '0')}
          </div>
        </div>
        
        <div className="text-sm text-slate-500 mb-4 text-right">
          {format(transactionDate, 'MMM dd, yyyy')}
        </div>
        
        {/* Numpad */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, '.', 0, 'del'].map((key, index) => (
            <button
              key={index}
              className="py-4 text-center text-2xl font-medium text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => handleNumpadPress(key)}
              type="button"
            >
              {key === 'del' ? '⌫' : key}
            </button>
          ))}
        </div>
        
        {/* Calculator Operators */}
        <div className="grid grid-cols-4 gap-1 mt-2">
          {['+', '-', '*', '/'].map((op, index) => (
            <button
              key={index}
              className="py-3 text-center text-xl font-medium text-slate-700 hover:bg-slate-100 rounded"
              onClick={() => handleNumpadPress(op)}
              type="button"
            >
              {op}
            </button>
          ))}
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="p-4 bg-white border-t">
        <button
          onClick={handleSubmit}
          disabled={(!amount || !categoryId) && !isCalculating}
          className={`w-full py-3 ${isCalculating ? 'bg-amber-400' : type === 'expense' ? 'bg-rose-500' : 'bg-indigo-500'} text-white rounded-lg flex items-center justify-center disabled:opacity-50`}
          type="button"
        >
          {isCalculating ? (
            <span className="text-xl font-bold">=</span>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              {isEditing ? 'Update' : 'Save'}
            </>
          )}
        </button>
      </div>
      
      {/* Date Picker */}
      {isDatePickerOpen && <DatePicker />}
    </div>
  );
}; 