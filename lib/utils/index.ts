import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, startOfMonth, endOfMonth } from "date-fns";
import { Transaction, MonthData, Category, TransactionType } from "../types";

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

/**
 * Parses CSV data and converts it to the application's transaction format.
 * Designed specifically for the ExpenseDataBackup.csv format.
 * 
 * @param csvData - Raw CSV data as a string
 * @returns Object containing parsed transactions and any new categories
 */
export function parseCSVData(csvData: string): { 
  transactions: Omit<Transaction, 'id'>[],
  newCategories: Category[]
} {
  // Split the CSV into lines and remove any empty lines
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  
  // Skip the header row
  const dataLines = lines.slice(1);
  
  // Track new categories we need to create
  const newCategories: Category[] = [];
  const existingCategoryIds = new Set<string>();
  
  // Process each line
  const transactions = dataLines.map(line => {
    try {
      // Direct fix for the specific allowance entries with the problematic format
      if (line.match(/^\d{4}-\d{1,2}-\d{1,2},Income,Allowance ,,\d{2},\d{3}$/)) {
        // This is the exact pattern we're looking for: date,Income,Allowance ,,XX,XXX
        // Extract the amount directly using regex
        const amountMatch = line.match(/,(\d{2},\d{3})$/);
        if (amountMatch) {
          const fullAmount = amountMatch[1].replace(',', '');
          
          // Reconstruct the line with the correct format
          const datePart = line.split(',')[0];
          line = `${datePart},Income,Allowance ,Allowance,${fullAmount}`;
          
          console.log(`Fixed allowance line: ${line}`);
        }
      }
      
      // Handle potential commas within quoted fields
      const fields: string[] = [];
      let inQuotes = false;
      let currentField = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(currentField);
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      // Add the last field
      fields.push(currentField);
      
      // Special handling for allowance entries
      if (fields.length >= 3 && fields[1] === 'Income' && fields[2].trim() === 'Allowance') {
        // This is an allowance entry, check if we need to fix it
        
        // Look for the amount at the end of the original line
        const amountMatch = line.match(/(\d{1,2},\d{3})$/);
        if (amountMatch) {
          // We found a pattern like "40,000" at the end of the line
          const fullAmount = amountMatch[1].replace(',', '');
          
          // Ensure we have exactly 5 fields with the correct amount
          while (fields.length < 4) {
            fields.push(''); // Add empty fields if needed
          }
          
          // Set the amount field
          fields[4] = fullAmount;
          
          console.log(`Reconstructed allowance fields: ${fields.join(',')}`);
        }
      }
      
      // Ensure we have at least 5 fields
      while (fields.length < 5) {
        fields.push('');
      }
      
      // Extract data from fields
      let [dateStr, typeStr, categoryStr, description, amountStr] = fields;
      
      // Parse date (format: YYYY-M-D)
      const dateParts = dateStr.split('-');
      if (dateParts.length !== 3) {
        throw new Error(`Invalid date format: ${dateStr}`);
      }
      
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
      const day = parseInt(dateParts[2]);
      
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Invalid date components: ${dateStr}`);
      }
      
      const dateObj = new Date(year, month, day);
      if (isNaN(dateObj.getTime())) {
        throw new Error(`Invalid date: ${dateStr}`);
      }
      
      const date = dateObj.toISOString();
      
      // Determine transaction type
      const type: TransactionType = typeStr.toLowerCase() === 'income' ? 'income' : 'expense';
      
      // Process category
      let categoryId = categoryStr.toLowerCase().replace(/\s+/g, '_');
      
      // If this is a new category, add it to our list
      if (categoryId && !existingCategoryIds.has(categoryId)) {
        existingCategoryIds.add(categoryId);
        
        // Create a new category with an appropriate icon
        const icon = getCategoryIcon(categoryId);
        
        newCategories.push({
          id: categoryId,
          name: categoryStr,
          icon,
          type
        });
      }
      
      // If no category, use default
      if (!categoryId) {
        categoryId = type === 'income' ? 'other_income' : 'others';
      }
      
      // Parse amount - handle the specific format in the CSV
      let amount = 0;
      
      // First, clean the amount string
      const cleanedAmountStr = amountStr.trim();
      
      if (cleanedAmountStr) {
        // Remove any commas and convert to number
        const numericValue = cleanedAmountStr.replace(/,/g, '');
        amount = Math.abs(Number(numericValue));
        
        // If it's still NaN, try another approach
        if (isNaN(amount)) {
          // Try extracting just the digits and decimal points
          const digitsOnly = cleanedAmountStr.replace(/[^\d.-]/g, '');
          amount = Math.abs(Number(digitsOnly));
          
          // If still NaN, log warning and use 0
          if (isNaN(amount)) {
            console.warn(`Could not parse amount: ${amountStr}, using 0`);
            amount = 0;
          }
        }
      }
      
      // Special case for Allowance entries - check if the amount seems too small
      if (type === 'income' && categoryId === 'allowance_' && amount < 1000) {
        // This might be a case where the amount was incorrectly parsed
        // Check if the original line contains a larger number
        const amountMatch = line.match(/(\d{1,2},\d{3})$/);
        if (amountMatch) {
          const fullAmount = amountMatch[1].replace(',', '');
          const parsedAmount = Number(fullAmount);
          if (!isNaN(parsedAmount) && parsedAmount > amount) {
            console.log(`Corrected allowance amount from ${amount} to ${parsedAmount}`);
            amount = parsedAmount;
          }
        }
      }
      
      // Create the transaction object
      return {
        amount,
        description,
        date,
        categoryId,
        type
      };
    } catch (error) {
      console.error(`Error processing line: ${line}`, error);
      
      // Return a default transaction to avoid breaking the import
      return {
        amount: 0,
        description: `Error importing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        date: new Date().toISOString(),
        categoryId: 'others',
        type: 'expense' as TransactionType
      };
    }
  });
  
  // Filter out any invalid transactions
  const validTransactions = transactions.filter(t => 
    !isNaN(t.amount) && t.date && !isNaN(new Date(t.date).getTime())
  );
  
  return { 
    transactions: validTransactions,
    newCategories 
  };
}

/**
 * Helper function to assign an appropriate icon to a category based on its ID.
 * 
 * @param categoryId - The category ID
 * @returns An emoji icon for the category
 */
function getCategoryIcon(categoryId: string): string {
  const iconMap: Record<string, string> = {
    food: '🍔',
    transportation: '🚌',
    entertainment: '🎮',
    shopping: '🛍️',
    utilities: '💡',
    housing: '🏠',
    health: '💊',
    education: '📚',
    gifts: '🎁',
    bills: '📝',
    travel: '✈️',
    clothing: '👕',
    self_care: '💆',
    home: '🏡',
    salary: '💰',
    freelance: '💻',
    investments: '📈',
    allowance: '💵',
    rental: '🏢'
  };
  
  return iconMap[categoryId] || '📦';
} 