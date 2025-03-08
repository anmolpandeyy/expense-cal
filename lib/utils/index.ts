import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { Transaction, MonthData } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(new Date(date), 'MM/dd EEE');
}

export function getCurrentMonth(): string {
  return format(new Date(), 'yyyy-MM');
}

export function getMonthName(month: string): string {
  const date = parse(month, 'yyyy-MM', new Date());
  return format(date, 'MMM');
}

export function getMonthRange(month: string) {
  const date = parse(month, 'yyyy-MM', new Date());
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
}

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

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

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