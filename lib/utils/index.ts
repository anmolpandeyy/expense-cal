import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { Transaction, MonthData } from "../types";

/**
 * Merges Tailwind CSS classes with proper precedence.
 * Combines clsx and tailwind-merge for optimal class handling.
 * 
 * @param inputs - Class values to be merged
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency without decimal places.
 * 
 * @param amount - The number to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a date string into a short readable format (MM/DD Day).
 * 
 * @param date - ISO date string to format
 * @returns Formatted date string (e.g., "03/08 Fri")
 */
export function formatDate(date: string): string {
  return format(new Date(date), 'MM/dd EEE');
}

/**
 * Gets the current month in YYYY-MM format.
 * 
 * @returns Current month string
 */
export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

/**
 * Gets the month name from a YYYY-MM formatted string.
 * 
 * @param month - Month in YYYY-MM format
 * @returns Month name (e.g., "Mar")
 */
export function getMonthName(month: string): string {
  const date = parse(month, 'yyyy-MM', new Date());
  return format(date, 'MMM');
}

/**
 * Gets the start and end dates for a given month.
 * 
 * @param month - Month in YYYY-MM format
 * @returns Object containing start and end Date objects
 */
export function getMonthRange(month: string) {
  const date = parse(month, 'yyyy-MM', new Date());
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

/**
 * Calculates financial data for a specific month.
 * Filters transactions for the month and computes totals.
 * 
 * @param transactions - All transactions to process
 * @param month - Month in YYYY-MM format
 * @returns MonthData object with income, expenses, balance and filtered transactions
 */
export function calculateMonthData(transactions: Transaction[], month: string): MonthData {
  const { start, end } = getMonthRange(month);
  
  const monthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= start && transactionDate <= end;
  });
  
  const income = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  return {
    income,
    expenses,
    balance: income - expenses,
    transactions: monthTransactions,
  };
}

/**
 * Generates a random ID string.
 * Used for creating unique identifiers for transactions.
 * 
 * @returns Random string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Groups transactions by their date.
 * Creates a dictionary with date keys and arrays of transactions.
 * 
 * @param transactions - Transactions to group
 * @returns Object with date keys and transaction arrays
 */
export function groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  
  transactions.forEach(transaction => {
    const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  
  return grouped;
} 