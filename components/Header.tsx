
import React from 'react';
import { Cpu, RefreshCw, Sparkles } from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { LanguageCode } from '../types';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
  lastUpdated: string | null;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading, lastUpdated, currentLang, onLanguageChange }) => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-slate-800 px-4 py-4 mb-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
            <Cpu className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter flex items-center gap-2">
              AI NEWS <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">PULSE</span>
              <Sparkles className="text-blue-400" size={16} />
            </h1>
            {lastUpdated && (
              <p className="text-[10px] text-slate-500 font-mono">
                LAST SCAN: {lastUpdated}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={onLanguageChange}
            disabled={isLoading}
          />
          
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg
              ${isLoading 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95 shadow-blue-900/40'
              }`}
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'REFRESHING...' : 'REFRESH INTEL'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
