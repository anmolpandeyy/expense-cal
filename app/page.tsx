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
import { useAppStore } from '@/lib/store';

export default function Home() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'chart' | 'export' | 'import'>('main');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const { exportData, importData } = useAppStore();
  
  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleNavigate = (route: string) => {
    setIsDrawerOpen(false);
    
    switch (route) {
      case 'chart':
        setCurrentView('chart');
        break;
      case 'export':
        setCurrentView('export');
        handleExport();
        break;
      case 'import':
        setCurrentView('import');
        // Open file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result as string;
              importData(content);
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
      setCurrentView('main');
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleRefresh = () => {
    // Refresh data or reset view as needed
    setCurrentView('main');
  };
  
  const handleTransactionClick = (id: string) => {
    setSelectedTransactionId(id);
  };
  
  const handleCloseTransactionDetails = () => {
    setSelectedTransactionId(null);
  };
  
  const handleEditTransaction = (id: string) => {
    setSelectedTransactionId(null);
    setIsEditingTransaction(true);
    setIsAddingTransaction(true);
  };
  
  const handleCloseTransactionForm = () => {
    setIsAddingTransaction(false);
    setIsEditingTransaction(false);
    setSelectedTransactionId(null);
  };
  
  // Function to handle empty state
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
            transactionId={isEditingTransaction ? selectedTransactionId || undefined : undefined}
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