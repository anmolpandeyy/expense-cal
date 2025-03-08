/**
 * Test script for CSV import functionality.
 * 
 * This script can be run with Node.js to test the CSV parsing functionality
 * without needing to use the UI. It reads the CSV file and logs the parsed data.
 * 
 * Usage: node scripts/test-csv-import.js
 */

const fs = require('fs');
const path = require('path');

// Mock implementation of the parseCSVData function
function parseCSVData(csvData) {
  // Split the CSV into lines and remove any empty lines
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  
  // Skip the header row
  const dataLines = lines.slice(1);
  
  // Track new categories we need to create
  const newCategories = [];
  const existingCategoryIds = new Set();
  
  // Process each line
  const transactions = dataLines.map(line => {
    // Handle potential commas within quoted fields
    const fields = [];
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
    
    // Ensure we have at least 5 fields
    while (fields.length < 5) {
      fields.push('');
    }
    
    // Extract data from fields
    const [dateStr, typeStr, categoryStr, description, amountStr] = fields;
    
    // Parse date (format: YYYY-M-D)
    const dateParts = dateStr.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month, day).toISOString();
    
    // Determine transaction type
    const type = typeStr.toLowerCase() === 'income' ? 'income' : 'expense';
    
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
    
    // Parse amount (remove commas and handle negative values)
    let amount = Math.abs(parseFloat(amountStr.replace(/,/g, '')));
    
    // Create the transaction object
    return {
      amount,
      description,
      date,
      categoryId,
      type
    };
  });
  
  return { transactions, newCategories };
}

function getCategoryIcon(categoryId) {
  const iconMap = {
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

// Main function
async function main() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, '..', 'ExpenseDataBackup.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse the CSV data
    const { transactions, newCategories } = parseCSVData(csvData);
    
    // Log some statistics
    console.log(`Parsed ${transactions.length} transactions`);
    console.log(`Found ${newCategories.length} new categories`);
    
    // Log a few sample transactions
    console.log('\nSample transactions:');
    transactions.slice(0, 5).forEach((t, i) => {
      console.log(`${i + 1}. ${t.date} - ${t.type} - ${t.categoryId} - ${t.description} - ${t.amount}`);
    });
    
    // Log all new categories
    console.log('\nNew categories:');
    newCategories.forEach((c, i) => {
      console.log(`${i + 1}. ${c.id} (${c.type}) - ${c.name} ${c.icon}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 