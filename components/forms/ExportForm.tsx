import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { format, parse, addMonths, subMonths } from 'date-fns';
import { useAppStore } from '@/lib/store';

interface ExportFormProps {
  onClose: () => void;
}

/**
 * Export form component that allows users to select a date range and export format.
 * Provides options to export data as JSON or CSV.
 */
export const ExportForm: React.FC<ExportFormProps> = ({ onClose }) => {
  const { exportData, transactions } = useAppStore();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Handles the export action based on selected parameters.
   * Filters transactions by date range and exports in the selected format.
   */
  const handleExport = () => {
    try {
      setIsExporting(true);

      // Parse dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Set to end of day

      // Filter transactions by date range
      const filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= start && transactionDate <= end;
      });

      // Get categories for these transactions
      const { categories } = useAppStore.getState();

      // Prepare data for export
      const exportObj = {
        transactions: filteredTransactions,
        categories
      };

      // Export based on format
      if (exportFormat === 'json') {
        // JSON export
        const jsonData = JSON.stringify(exportObj, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-data-${startDate}-to-${endDate}.json`;
        document.body.appendChild(a);
        a.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // CSV export
        const csvRows = [
          // Header row
          ['Date', 'Income/Expenses', 'Category', 'Memo', 'Amount'].join(',')
        ];

        // Data rows
        filteredTransactions.forEach(t => {
          const category = categories.find(c => c.id === t.categoryId);
          const categoryName = category ? category.name : t.categoryId;
          const type = t.type === 'income' ? 'Income' : 'Expenses';
          
          // Format amount - ensure it's a valid number
          const amount = t.type === 'income' ? t.amount : -t.amount; // Negative for expenses
          const formattedAmount = amount.toString(); // No commas to avoid parsing issues
          
          // Format date as YYYY-M-D to match original CSV
          const date = format(new Date(t.date), 'yyyy-M-d');
          
          // Handle description with commas by quoting if needed
          const description = t.description.includes(',') 
            ? `"${t.description}"` 
            : t.description;
          
          csvRows.push([date, type, categoryName, description, formattedAmount].join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense-data-${startDate}-to-${endDate}.csv`;
        document.body.appendChild(a);
        a.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      setIsExporting(false);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-slate-100"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-semibold">Export Form</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-lg text-slate-500">Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="block text-lg text-slate-500">End</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-3 border rounded-lg text-lg"
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="block text-lg text-slate-500">Format</label>
            <div className="flex border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setExportFormat('json')}
                className={`flex-1 py-3 text-center ${
                  exportFormat === 'json' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-slate-700'
                }`}
              >
                JSON
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`flex-1 py-3 text-center ${
                  exportFormat === 'csv' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-slate-700'
                }`}
              >
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="p-4 border-t">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full text-white font-semibold text-lg"
        >
          {isExporting ? 'Exporting...' : 'OK'}
        </button>
      </footer>
    </div>
  );
}; 