
import React from 'react';
import { Calendar, Globe, ListOrdered } from 'lucide-react';
import { SearchFilters } from '../types';

interface FiltersBarProps {
  filters: SearchFilters;
  setFilters: (f: SearchFilters) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ filters, setFilters }) => {
  return (
    <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 px-2">
      <div className="glass-effect p-3 rounded-xl flex items-center gap-3">
        <div className="bg-slate-800 p-2 rounded-lg text-blue-400">
          <Calendar size={18} />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Time Horizon</label>
          <select 
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full cursor-pointer"
          >
            <option value="24h" className="bg-slate-900">Past 24 Hours</option>
            <option value="7d" className="bg-slate-900">Past Week</option>
            <option value="30d" className="bg-slate-900">Past Month</option>
            <option value="all" className="bg-slate-900">All Time (Recent)</option>
          </select>
        </div>
      </div>

      <div className="glass-effect p-3 rounded-xl flex items-center gap-3">
        <div className="bg-slate-800 p-2 rounded-lg text-emerald-400">
          <Globe size={18} />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Preferred Source</label>
          <input 
            type="text"
            placeholder="e.g. TechCrunch, arXiv, Reuters..."
            value={filters.specificSource || ''}
            onChange={(e) => setFilters({...filters, specificSource: e.target.value})}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full placeholder-slate-600"
          />
        </div>
      </div>

      <div className="glass-effect p-3 rounded-xl flex items-center gap-3">
        <div className="bg-slate-800 p-2 rounded-lg text-purple-400">
          <ListOrdered size={18} />
        </div>
        <div className="flex-1">
          <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Signal Density</label>
          <select 
            value={filters.itemCount}
            onChange={(e) => setFilters({...filters, itemCount: parseInt(e.target.value)})}
            className="bg-transparent text-slate-200 text-sm focus:outline-none w-full cursor-pointer"
          >
            <option value="5" className="bg-slate-900">5 Items (Quick Scan)</option>
            <option value="10" className="bg-slate-900">10 Items (Standard)</option>
            <option value="15" className="bg-slate-900">15 Items (Deep Dive)</option>
            <option value="20" className="bg-slate-900">20 Items (Full Buffer)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
