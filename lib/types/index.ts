export type TransactionType = 'income' | 'expense';

export type Category = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string
  categoryId: string;
  type: TransactionType;
};

export type MonthData = {
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
};

export type AppState = {
  currentMonth: string; // Format: 'YYYY-MM'
  categories: Category[];
  transactions: Transaction[];
  
  // Derived data
  monthlyData: Record<string, MonthData>;
  
  // Actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  setCurrentMonth: (month: string) => void;
  
  // Import/Export
  exportData: () => string;
  importData: (data: string) => void;
}; 