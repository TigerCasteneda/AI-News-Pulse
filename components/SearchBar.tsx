
import React, { useState } from 'react';
import { Search, Hash, Info, Command } from 'lucide-react';

interface SearchBarProps {
  keywords: string;
  setKeywords: (val: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ keywords, setKeywords, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-10">
      <div className="relative group">
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${isFocused ? 'text-blue-400' : 'text-slate-500'}`}>
          <Hash size={20} />
        </div>
        <input
          type="text"
          value={keywords}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="NVIDIA AND (LLMs OR Robotics) NOT Gaming..."
          className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-28 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-600/50 transition-all shadow-inner"
        />
        <button
          onClick={onSearch}
          className="absolute right-2 top-2 bottom-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
        >
          <Search size={16} />
          Search
        </button>
      </div>
      
      {/* Boolean Syntax Helper */}
      <div className={`mt-3 px-4 flex flex-wrap gap-x-6 gap-y-2 transition-all duration-300 ${isFocused ? 'opacity-100 translate-y-0' : 'opacity-60 -translate-y-1'}`}>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-blue-500 font-bold">AND</span>
          <span className="text-slate-500">Includes both</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-emerald-500 font-bold">OR</span>
          <span className="text-slate-500">Includes either</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-red-500 font-bold">NOT</span>
          <span className="text-slate-500">Excludes term</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-purple-500 font-bold">( )</span>
          <span className="text-slate-500">Group logic</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-[10px] text-slate-600 italic">
          <Command size={10} /> Boolean Scan Active
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
