import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ExportForm } from '@/components/forms/ExportForm';

export const DataManagement: React.FC = () => {
  const { exportData, importData, importCSV } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExportClick = () => {
    setShowExportForm(true);
  };
  
  const handleCloseExportForm = () => {
    setShowExportForm(false);
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportResult(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Determine file type by extension
        const isCSV = file.name.toLowerCase().endsWith('.csv');
        
        if (isCSV) {
          // Import CSV data
          const result = importCSV(content);
          setImportResult(result);
        } else {
          // Import JSON data
          importData(content);
          setImportResult({ success: true, message: 'Data imported successfully.' });
        }
        
        setIsImporting(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import failed:', error);
        setImportResult({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error occurred during import.' 
        });
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <>
      <div className="flex flex-col space-y-2 p-4">
        <h2 className="text-lg font-semibold mb-2">Data Management</h2>
        
        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {isExporting ? 'Exporting...' : 'Export Data'}
        </button>
        
        <button
          onClick={handleImportClick}
          disabled={isImporting}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          {isImporting ? 'Importing...' : 'Import Data'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.csv,text/csv,application/vnd.ms-excel,application/csv"
          className="hidden"
        />
        
        {importResult && (
          <div className={`mt-2 p-2 rounded ${importResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {importResult.message}
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-2">
          Export your data to create a backup. Import previously exported data (JSON) or CSV data from other expense trackers.
        </p>
      </div>
      
      {showExportForm && <ExportForm onClose={handleCloseExportForm} />}
    </>
  );
}; 