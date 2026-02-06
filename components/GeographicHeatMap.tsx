
import React from 'react';
import { NewsItem } from '../types';
import { MapPin, Globe, Maximize2, Activity } from 'lucide-react';

interface GeographicHeatMapProps {
  items: NewsItem[];
}

const GeographicHeatMap: React.FC<GeographicHeatMapProps> = ({ items }) => {
  const geoItems = items.filter(item => item.location);
  
  /**
   * Projection: Equirectangular (Plate Carrée)
   * Precise mapping to a 360x180 degree coordinate system
   */
  const projectX = (lng: number) => ((lng + 180) * (100 / 360));
  const projectY = (lat: number) => ((90 - lat) * (100 / 180));

  return (
    <div className="glass-effect rounded-3xl border border-slate-800 p-6 mb-10 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe size={20} className="text-blue-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Global Signal Map</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium font-mono">Real-time geographic distribution of intelligence signals</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-black uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Spatial Scan Active
          </div>
        </div>
      </div>

      {/* The Map Container - Matching User-provided image contrast */}
      <div className="relative aspect-[2/1] bg-black rounded-2xl border border-slate-800 overflow-hidden group/map cursor-crosshair shadow-2xl">
        {/* Authentic World Map SVG - Simplified path set for high contrast white/black look */}
        <svg 
          viewBox="0 0 100 50" 
          className="w-full h-full text-white/90"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Detailed continental paths to simulate the authentic look */}
          <g fill="currentColor">
            {/* North America */}
            <path d="M15,10 L25,5 L38,10 L35,22 L22,25 L18,20 Z" />
            {/* South America */}
            <path d="M25,28 L32,30 L35,40 L30,48 L22,38 Z" />
            {/* Africa */}
            <path d="M42,20 L55,18 L62,25 L60,35 L55,48 L48,42 L42,32 Z" />
            {/* Eurasia */}
            <path d="M45,15 L55,5 L75,2 L90,10 L88,25 L75,30 L65,25 L55,18 Z" />
            {/* Australia */}
            <path d="M78,38 L85,35 L92,42 L88,48 L80,45 Z" />
            {/* Greenland */}
            <path d="M35,2 L42,5 L40,10 L32,8 Z" />
            {/* Islands / Details */}
            <circle cx="90" cy="22" r="1.5" />
            <circle cx="70" cy="35" r="1" />
            <circle cx="65" cy="42" r="1" />
          </g>

          {/* Authentic-looking coastlines (stroke-based for more detail) */}
          <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.8">
            <path d="M10,8 Q15,5 20,8 T30,5 T45,8 T60,5 T80,8 T95,5" />
            <path d="M10,40 Q15,45 20,40 T30,45 T45,40 T60,45 T80,40 T95,45" opacity="0.1" />
          </g>
        </svg>

        {/* Global Grid Overlay (Optional, keep faint) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '10% 20%' }}>
        </div>

        {/* Dynamic Map Pins & Heat Pulses */}
        {geoItems.map((item) => {
          const x = projectX(item.location!.lng);
          const y = projectY(item.location!.lat);
          const heatSize = item.influenceScore / 10; 

          return (
            <div 
              key={item.id} 
              className="absolute group/pin z-10"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {/* Heat Ring / Pulse - Blue against black is highly visible */}
              <div 
                className={`absolute inset-0 rounded-full animate-ping opacity-75 ${item.isHighImpact ? 'bg-orange-500/60' : 'bg-blue-500/60'}`}
                style={{ 
                  width: `${Math.max(16, heatSize * 5)}px`, 
                  height: `${Math.max(16, heatSize * 5)}px`, 
                  margin: `-${Math.max(16, heatSize * 5)/2}px` 
                }}
              ></div>
              
              {/* Core Pin */}
              <div className="relative cursor-pointer transition-transform duration-300 group-hover/pin:scale-150">
                <MapPin 
                  size={16} 
                  className={`drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] ${item.isHighImpact ? 'text-orange-400' : 'text-blue-400'}`} 
                  fill="currentColor"
                  fillOpacity={0.4}
                />
                
                {/* Advanced Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 p-4 glass-effect rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-700 opacity-0 invisible group-hover/pin:opacity-100 group-hover/pin:visible transition-all z-30 pointer-events-none translate-y-2 group-hover/pin:translate-y-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                      <Activity size={10} className="text-blue-400" /> {item.location?.name}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded bg-black border ${item.isHighImpact ? 'border-orange-500/50 text-orange-400' : 'border-blue-500/50 text-blue-400'}`}>
                      {item.influenceScore} IMPACT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-200 font-bold line-clamp-2 leading-snug mb-2">
                    {item.title}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[8px] text-slate-500 font-mono">{item.sourceName}</span>
                    <span className="text-[8px] text-blue-500 font-black uppercase">Click to Read</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {geoItems.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400/30 text-[10px] font-mono uppercase tracking-[0.4em] italic bg-black/40 backdrop-blur-[1px]">
            Target Acquisition in Progress...
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Standard Node</span>
            <span className="text-[8px] text-slate-600 font-mono">Routine Detection</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-pulse"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Critical Alert</span>
            <span className="text-[8px] text-slate-600 font-mono">High Market Impact</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-white opacity-20"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Empty Sector</span>
            <span className="text-[8px] text-slate-600 font-mono">No Active Signal</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <Maximize2 size={12} className="text-slate-500" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">High Contrast</span>
            <span className="text-[8px] text-slate-600 font-mono">Visual Authenticity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicHeatMap;
