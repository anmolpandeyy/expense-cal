import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Upload, 
  Info, 
  X
} from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const [showAbout, setShowAbout] = useState(false);
  
  if (!isOpen) return null;

  const menuItems = [
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Chart', action: () => onNavigate('chart') },
    { icon: <Download className="w-5 h-5" />, label: 'Export', action: () => onNavigate('export') },
    { icon: <Upload className="w-5 h-5" />, label: 'Import', action: () => onNavigate('import') },
    { icon: <Info className="w-5 h-5" />, label: 'About', action: () => setShowAbout(true) },
  ];

  const AboutModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">About ExpenseCal</h3>
          <button 
            onClick={() => setShowAbout(false)}
            className="p-1 rounded-full hover:bg-slate-100"
            type="button"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-slate-600">
            Made with ❤️ by Anmol Pandey, with a little help from his trusty friend, Cursor. 😄
          </p>
          
          <p className="text-slate-600">
            This app makes tracking your expenses and income effortless—no judgment, just insights! Unlike your bank account, it won't side-eye your late-night pizza splurges. 🍕
          </p>
          
          <p className="text-slate-600">
            Remember, saving money is like doing squats—nobody loves it, but you'll thank yourself later!
          </p>
          
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">Version 1.0.0</p>
            <p className="text-sm text-slate-500">© 2025 ExpenseCal</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-100 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
        {/* User Profile */}
        <div className="flex flex-col items-center justify-center py-8 border-b border-slate-200">
          <div className="w-20 h-20 rounded-full bg-white mb-3 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <h3 className="text-lg font-medium text-slate-700">User</h3>
        </div>
        
        {/* Menu Items */}
        <nav className="mt-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.action}
                  className="flex items-center w-full px-6 py-3 text-slate-600 hover:bg-slate-200 transition-colors"
                  type="button"
                >
                  <span className="mr-4 text-slate-500">{item.icon}</span>
                  <span className="text-lg">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* About Modal */}
      {showAbout && <AboutModal />}
    </>
  );
}; 