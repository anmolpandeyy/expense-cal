import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Transaction, MonthData } from '../types';
import { 
  getCurrentMonth, 
  generateId, 
  calculateMonthData 
} from '../utils';

// Default categories
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

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentMonth: getCurrentMonth(),
      categories: [...defaultCategories],
      transactions: [],
      monthlyData: {},

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

      setCurrentMonth: (month) => {
        set((state) => {
          const monthlyData = recalculateMonthlyData(state.transactions, month);
          
          return {
            currentMonth: month,
            monthlyData,
          };
        });
      },

      exportData: () => {
        const { transactions, categories } = get();
        return JSON.stringify({ transactions, categories });
      },

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
    }),
    {
      name: 'expense-calculator-storage',
    }
  )
);

// Helper function to recalculate monthly data
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