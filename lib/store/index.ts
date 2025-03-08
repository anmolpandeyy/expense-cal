import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Transaction, MonthData } from '../types';
import { 
  getCurrentMonth, 
  generateId, 
  calculateMonthData,
  parseCSVData
} from '../utils';

/**
 * Default categories for expenses and income.
 * These are pre-populated in the store when the app is first initialized.
 */
const defaultCategories = [
  { id: 'food', name: 'Food', icon: '🍔', type: 'expense' },
  { id: 'transportation', name: 'Transportation', icon: '🚌', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', type: 'expense' },
  { id: 'utilities', name: 'Utilities', icon: '💡', type: 'expense' },
  { id: 'housing', name: 'Housing', icon: '🏠', type: 'expense' },
  { id: 'health', name: 'Health', icon: '💊', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', type: 'expense' },
  { id: 'gifts', name: 'Gifts', icon: '🎁', type: 'expense' },
  { id: 'others', name: 'Others', icon: '📦', type: 'expense' },
  { id: 'salary', name: 'Salary', icon: '💰', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', type: 'income' },
  { id: 'investments', name: 'Investments', icon: '📈', type: 'income' },
  { id: 'other_income', name: 'Other Income', icon: '💵', type: 'income' },
] as const;

/**
 * Main application store using Zustand.
 * Implements the AppState interface and persists data to localStorage.
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentMonth: getCurrentMonth(),
      categories: [...defaultCategories],
      transactions: [],
      monthlyData: {},

      /**
       * Adds a new transaction to the store.
       * Generates a unique ID and recalculates monthly data.
       * 
       * @param transaction - Transaction data without ID
       */
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: generateId(),
        };

        set((state) => {
          const transactions = [...state.transactions, newTransaction];
          const monthlyData = recalculateMonthlyData(transactions, state.currentMonth);
          
          return {
            transactions,
            monthlyData,
          };
        });
      },

      /**
       * Deletes a transaction from the store.
       * Recalculates monthly data after deletion.
       * 
       * @param id - ID of the transaction to delete
       */
      deleteTransaction: (id) => {
        set((state) => {
          const transactions = state.transactions.filter(t => t.id !== id);
          const monthlyData = recalculateMonthlyData(transactions, state.currentMonth);
          
          return {
            transactions,
            monthlyData,
          };
        });
      },

      /**
       * Updates an existing transaction with new data.
       * Recalculates monthly data after update.
       * 
       * @param id - ID of the transaction to update
       * @param updatedFields - Partial transaction data to update
       */
      updateTransaction: (id, updatedFields) => {
        set((state) => {
          const transactions = state.transactions.map(t => 
            t.id === id ? { ...t, ...updatedFields } : t
          );
          const monthlyData = recalculateMonthlyData(transactions, state.currentMonth);
          
          return {
            transactions,
            monthlyData,
          };
        });
      },

      /**
       * Changes the currently selected month.
       * Recalculates monthly data for the new month.
       * 
       * @param month - Month to select in YYYY-MM format
       */
      setCurrentMonth: (month) => {
        set((state) => {
          const monthlyData = recalculateMonthlyData(state.transactions, month);
          
          return {
            currentMonth: month,
            monthlyData,
          };
        });
      },

      /**
       * Exports all application data as a JSON string.
       * Includes transactions and categories.
       * 
       * @returns JSON string of app data
       */
      exportData: () => {
        const { transactions, categories } = get();
        return JSON.stringify({ transactions, categories });
      },

      /**
       * Imports application data from a JSON string.
       * Validates the data format before importing.
       * 
       * @param data - JSON string containing app data
       */
      importData: (data) => {
        try {
          const parsedData = JSON.parse(data);
          
          if (!parsedData.transactions || !Array.isArray(parsedData.transactions)) {
            throw new Error('Invalid data format');
          }
          
          set((state) => {
            const transactions = parsedData.transactions;
            const categories = parsedData.categories || state.categories;
            const monthlyData = recalculateMonthlyData(transactions, state.currentMonth);
            
            return {
              transactions,
              categories,
              monthlyData,
            };
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      /**
       * Imports data from a CSV file.
       * Parses the CSV format and adds transactions to the store.
       * 
       * @param csvData - CSV data as a string
       */
      importCSV: (csvData: string) => {
        try {
          const { transactions: newTransactions, newCategories } = parseCSVData(csvData);
          
          set((state) => {
            // Generate IDs for new transactions
            const transactionsWithIds = newTransactions.map(t => ({
              ...t,
              id: generateId()
            }));
            
            // Merge transactions
            const allTransactions = [...state.transactions, ...transactionsWithIds];
            
            // Merge categories (avoiding duplicates)
            const existingCategoryIds = new Set(state.categories.map(c => c.id));
            const categoriesToAdd = newCategories.filter(c => !existingCategoryIds.has(c.id));
            const allCategories = [...state.categories, ...categoriesToAdd];
            
            // Recalculate monthly data
            const monthlyData = recalculateMonthlyData(allTransactions, state.currentMonth);
            
            return {
              transactions: allTransactions,
              categories: allCategories,
              monthlyData,
            };
          });
          
          return {
            success: true,
            message: `Imported ${newTransactions.length} transactions and ${newCategories.length} new categories.`
          };
        } catch (error) {
          console.error('Failed to import CSV data:', error);
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      },
    }),
    {
      name: 'expense-calculator-storage',
    }
  )
);

/**
 * Helper function to recalculate monthly data for all relevant months.
 * Extracts unique months from transactions and calculates data for each.
 * 
 * @param transactions - All transactions
 * @param currentMonth - Currently selected month
 * @returns Record of monthly data indexed by month string
 */
function recalculateMonthlyData(
  transactions: Transaction[], 
  currentMonth: string
): Record<string, MonthData> {
  const monthlyData: Record<string, MonthData> = {};
  
  // Get unique months from transactions
  const months = new Set<string>();
  transactions.forEach(t => {
    const month = new Date(t.date).toISOString().substring(0, 7);
    months.add(month);
  });
  
  // Always include current month
  months.add(currentMonth);
  
  // Calculate data for each month
  months.forEach(month => {
    monthlyData[month] = calculateMonthData(transactions, month);
  });
  
  return monthlyData;
} 