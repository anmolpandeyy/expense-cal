'use client';

import React, { useState, useEffect } from 'react';
import { Menu, Plus, ChevronLeft, RefreshCw } from 'lucide-react';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { Summary } from '@/components/shared/Summary';
import { TransactionList } from '@/components/shared/TransactionList';
import { AddTransactionForm } from '@/components/forms/AddTransactionForm';
import { Drawer } from '@/components/shared/Drawer';
import { ExpenseChart } from '@/components/shared/ExpenseChart';
import { TransactionDetails } from '@/components/shared/TransactionDetails';
import { ExportForm } from '@/components/forms/ExportForm';
import { useAppStore } from '@/lib/store';

/**
 * Main application page component.
 * Handles the overall layout and navigation between different views.
 * Manages state for transaction operations and UI interactions.
 */
export default function Home() {
  // UI state
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'chart' | 'export' | 'import'>('main');
  const [isMounted, setIsMounted] = useState(false);
  
  // Transaction state
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  
  // Store actions
  const { exportData, importData, importCSV } = useAppStore();
  
  /**
   * Handle client-side mounting to prevent hydration errors.
   * Next.js requires this to ensure client-side state matches server-side.
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  /**
   * Handles navigation between different app views.
   * Triggered by the drawer menu options.
   * 
   * @param route - The route/view to navigate to
   */
  const handleNavigate = (route: string) => {
    setIsDrawerOpen(false);
    
    switch (route) {
      case 'chart':
        setCurrentView('chart');
        break;
      case 'export':
        setCurrentView('export');
        break;
      case 'import':
        setCurrentView('import');
        // Open file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.csv,text/csv,application/vnd.ms-excel,application/csv';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result as string;
              
              // Determine file type by extension
              const isCSV = file.name.toLowerCase().endsWith('.csv');
              
              if (isCSV) {
                // Import CSV data
                importCSV(content);
              } else {
                // Import JSON data
                importData(content);
              }
            };
            reader.readAsText(file);
          }
        };
        input.click();
        setCurrentView('main');
        break;
      default:
        setCurrentView('main');
    }
  };
  
  /**
   * Handles refreshing the main view.
   * Resets the current view to the main screen.
   */
  const handleRefresh = () => {
    setCurrentView('main');
  };
  
  /**
   * Handles clicking on a transaction in the list.
   * Shows the transaction details view.
   * 
   * @param id - ID of the clicked transaction
   */
  const handleTransactionClick = (id: string) => {
    setSelectedTransactionId(id);
  };
  
  /**
   * Handles closing the transaction details view.
   * Returns to the main view.
   */
  const handleCloseTransactionDetails = () => {
    setSelectedTransactionId(null);
  };
  
  /**
   * Handles editing a transaction.
   * Opens the transaction form with the selected transaction data.
   * 
   * @param id - ID of the transaction to edit
   */
  const handleEditTransaction = (id: string) => {
    setEditingTransactionId(id);
    setSelectedTransactionId(null);
    setIsAddingTransaction(true);
  };
  
  /**
   * Handles closing the transaction form.
   * Returns to the previous view.
   */
  const handleCloseTransactionForm = () => {
    setIsAddingTransaction(false);
    setEditingTransactionId(null);
  };
  
  /**
   * Handles adding a transaction from the empty state.
   * Opens the transaction form.
   */
  const handleEmptyStateAdd = () => {
    setIsAddingTransaction(true);
  };
  
  // If not mounted yet, return a minimal layout to prevent hydration errors
  if (!isMounted) {
    return (
      <div className="flex flex-col h-screen bg-slate-50">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <div className="w-10 h-10"></div>
          <div className="h-10 flex items-center">
            <span className="text-xl font-semibold text-slate-800">Loading...</span>
          </div>
          <div className="w-10 h-10"></div>
        </header>
        <div className="flex-1"></div>
      </div>
    );
  }
  
  // Render transaction details view if a transaction is selected
  if (selectedTransactionId) {
    return (
      <TransactionDetails 
        transactionId={selectedTransactionId}
        onClose={handleCloseTransactionDetails}
        onEdit={handleEditTransaction}
      />
    );
  }
  
  // Render export form if export view is active
  if (currentView === 'export') {
    return (
      <ExportForm onClose={() => setCurrentView('main')} />
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white">
        {currentView === 'chart' ? (
          <button 
            onClick={() => setCurrentView('main')}
            className="p-2 rounded-full hover:bg-slate-100"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
        ) : (
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100"
            type="button"
          >
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
        )}
        
        <MonthSelector />
        
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-slate-100"
          type="button"
        >
          <RefreshCw className="w-5 h-5 text-slate-600" />
        </button>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isAddingTransaction ? (
          <AddTransactionForm 
            onClose={handleCloseTransactionForm} 
            transactionId={editingTransactionId || undefined}
          />
        ) : currentView === 'chart' ? (
          <ExpenseChart />
        ) : (
          <>
            <div className="p-4 relative">
              <Summary />
            </div>
            
            <div className="mt-2">
              <TransactionList onTransactionClick={handleTransactionClick} />
            </div>

            {/* Empty state */}
            {!isAddingTransaction && currentView === 'main' && 
             (!useAppStore.getState().monthlyData[useAppStore.getState().currentMonth]?.transactions.length) && (
              <div className="flex flex-col items-center justify-center mt-20 text-slate-400">
                <div className="w-40 h-40 mb-6">
                  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M80 80H120V120H80V80Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M120 80L140 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M80 120L60 140" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M120 120L140 140" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M80 80L60 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No Transactions</h3>
                <p className="text-center mb-6">Tap + to add one</p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add Transaction Button */}
      {!isAddingTransaction && currentView === 'main' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setIsAddingTransaction(true)}
            className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center shadow-lg"
            type="button"
          >
            <Plus className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
      
      {/* Drawer */}
      <Drawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onNavigate={handleNavigate}
      />
    </div>
  );
} 