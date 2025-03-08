/**
 * Represents the type of a financial transaction.
 * Can be either 'income' or 'expense'.
 */
export type TransactionType = 'income' | 'expense';

/**
 * Represents a transaction category.
 * Categories are used to organize and classify transactions.
 */
export type Category = {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Emoji or icon representation of the category */
  icon: string;
  /** Whether this category is for income or expenses */
  type: TransactionType;
};

/**
 * Represents a financial transaction.
 * Transactions are the core data entity of the application.
 */
export type Transaction = {
  /** Unique identifier for the transaction */
  id: string;
  /** Monetary amount of the transaction */
  amount: number;
  /** Optional memo or description of the transaction */
  description: string;
  /** ISO date string representing when the transaction occurred */
  date: string;
  /** Reference to the category this transaction belongs to */
  categoryId: string;
  /** Whether this is an income or expense transaction */
  type: TransactionType;
};

/**
 * Aggregated financial data for a specific month.
 * Contains summary information and all transactions for the month.
 */
export type MonthData = {
  /** Total income for the month */
  income: number;
  /** Total expenses for the month */
  expenses: number;
  /** Net balance (income - expenses) for the month */
  balance: number;
  /** All transactions that occurred during this month */
  transactions: Transaction[];
};

/**
 * Main application state.
 * Contains all data and actions for the expense calculator.
 */
export type AppState = {
  /** Currently selected month in 'YYYY-MM' format */
  currentMonth: string;
  /** List of all available transaction categories */
  categories: Category[];
  /** List of all transactions across all time */
  transactions: Transaction[];
  
  /** 
   * Derived data organized by month.
   * Keys are month strings in 'YYYY-MM' format.
   */
  monthlyData: Record<string, MonthData>;
  
  // Actions
  /**
   * Adds a new transaction to the application state.
   * @param transaction - The transaction data (without ID, which will be generated)
   */
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  
  /**
   * Deletes a transaction from the application state.
   * @param id - The ID of the transaction to delete
   */
  deleteTransaction: (id: string) => void;
  
  /**
   * Updates an existing transaction with new data.
   * @param id - The ID of the transaction to update
   * @param transaction - Partial transaction data to update
   */
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  
  /**
   * Changes the currently selected month.
   * @param month - The month to select in 'YYYY-MM' format
   */
  setCurrentMonth: (month: string) => void;
  
  /**
   * Exports all application data as a JSON string.
   * @returns JSON string containing all transactions and categories
   */
  exportData: () => string;
  
  /**
   * Imports application data from a JSON string.
   * @param data - JSON string containing transactions and categories
   */
  importData: (data: string) => void;
  
  /**
   * Imports data from a CSV file.
   * @param csvData - CSV data as a string
   * @returns Object with success status and message
   */
  importCSV: (csvData: string) => { success: boolean; message: string };
}; 