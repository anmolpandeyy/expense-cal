import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';

export const DataManagement: React.FC = () => {
  const { exportData, importData } = useAppStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
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
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        importData(content);
        setIsImporting(false);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Import failed:', error);
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="flex flex-col space-y-2 p-4">
      <h2 className="text-lg font-semibold mb-2">Data Management</h2>
      
      <button
        onClick={handleExport}
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
        accept=".json"
        className="hidden"
      />
      
      <p className="text-sm text-gray-500 mt-2">
        Export your data to create a backup. Import previously exported data to restore.
      </p>
    </div>
  );
}; 