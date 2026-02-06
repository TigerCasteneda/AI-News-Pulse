
import React from 'react';
import { Search, Hash } from 'lucide-react';

interface SearchBarProps {
  keywords: string;
  setKeywords: (val: string) => void;
  onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ keywords, setKeywords, onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-10 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
        <Hash size={20} />
      </div>
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter keywords (e.g. LLMs, NVIDIA, Robotics, OpenAI)..."
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
  );
};

export default SearchBar;
