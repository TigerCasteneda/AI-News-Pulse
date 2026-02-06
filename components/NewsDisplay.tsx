
import React, { useState } from 'react';
import { NewsItem, NewsSource, LanguageCode } from '../types';
import { ExternalLink, Globe, Bookmark, BookmarkCheck, Share2, Copy, Check, Twitter, Linkedin, X, Languages, Zap, Activity, Users, ShieldCheck, MapPin } from 'lucide-react';

interface NewsDisplayProps {
  items: NewsItem[];
  sources: NewsSource[];
  savedIds: Set<string>;
  onToggleSave: (item: NewsItem) => void;
  currentLang: LanguageCode;
  isTranslating: boolean;
}

const NewsDisplay: React.FC<NewsDisplayProps> = ({ items, sources, savedIds, onToggleSave, currentLang, isTranslating }) => {
  const [sharingItem, setSharingItem] = useState<NewsItem | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (uri: string) => {
    try {
      await navigator.clipboard.writeText(uri);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const shareOnTwitter = (item: NewsItem) => {
    const text = encodeURIComponent(`Check out this AI news: ${item.title}`);
    const url = encodeURIComponent(item.uri);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = (item: NewsItem) => {
    const url = encodeURIComponent(item.uri);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const getDisseminationWidth = (level: string) => {
    switch (level) {
      case 'Niche': return '25%';
      case 'Growing': return '50%';
      case 'Widespread': return '75%';
      case 'Global': return '100%';
      default: return '50%';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {isTranslating && (
        <div className="flex items-center justify-center gap-3 py-4 glass-effect rounded-2xl border-blue-500/30 text-blue-400 animate-pulse">
          <Languages size={20} className="animate-bounce" />
          <span className="text-sm font-bold uppercase tracking-widest">Converting Intelligence Data...</span>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 transition-opacity duration-300 ${isTranslating ? 'opacity-40' : 'opacity-100'}`}>
        {items.map((item) => {
          const isSaved = savedIds.has(item.id) || savedIds.has(item.title);
          const displayTitle = item.translations?.[currentLang]?.title || item.title;
          const displaySummary = item.translations?.[currentLang]?.summary || item.summary;

          return (
            <div key={item.id} className={`glass-effect p-6 rounded-2xl shadow-xl transition-all group border-l-4 ${item.isHighImpact ? 'border-l-orange-500 shadow-orange-900/10' : 'border-l-blue-600'}`}>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {item.isHighImpact && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-black uppercase tracking-tighter animate-pulse border border-orange-500/20">
                        <Zap size={10} fill="currentColor" /> High Impact
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase border border-slate-700">
                      <ShieldCheck size={10} /> {item.sourceType}
                    </span>
                    {item.location && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                        <MapPin size={10} /> {item.location.name}
                      </span>
                    )}
                    {currentLang !== 'en' && item.translations?.[currentLang] && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase border border-emerald-500/20">
                        <Languages size={10} /> Translated
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors leading-tight mb-2">
                    {displayTitle}
                  </h3>
                  <div className="text-slate-500 text-xs font-medium flex items-center gap-2 mb-4">
                    <span className="text-blue-400">{item.sourceName}</span>
                    <span className="text-slate-800">•</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {item.disseminationLevel} Reach</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => setSharingItem(item)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-500 hover:text-blue-400 hover:bg-slate-700 transition-all"
                    title="Share article"
                  >
                    <Share2 size={20} />
                  </button>
                  <button 
                    onClick={() => onToggleSave(item)}
                    className={`p-2 rounded-lg transition-all ${
                      isSaved ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                    }`}
                    title={isSaved ? "Remove from saved" : "Save article"}
                  >
                    {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                  </button>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                {displaySummary}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Activity size={10} /> Dissemination</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.disseminationLevel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${item.disseminationLevel === 'Global' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500'}`}
                      style={{ width: getDisseminationWidth(item.disseminationLevel) }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Zap size={10} /> Impact Rank</span>
                    <span className={`text-[10px] font-black ${item.influenceScore > 80 ? 'text-orange-400' : 'text-blue-400'}`}>{item.influenceScore}/100</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-2 flex-1 rounded-sm ${i < Math.floor(item.influenceScore / 20) ? (item.influenceScore > 80 ? 'bg-orange-500' : 'bg-blue-500') : 'bg-slate-800'}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  Intelligence Feed
                </span>
                <a 
                  href={item.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                >
                  FULL STORY <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {sources.length > 0 && (
        <div className="pt-10 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-6 text-emerald-400">
            <Globe size={20} />
            <h2 className="text-xl font-bold tracking-tight">Search Grounding References</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 transition-all"
              >
                <Globe size={14} className="text-slate-600" />
                <span className="text-xs text-slate-400 truncate flex-1">{source.title}</span>
                <ExternalLink size={12} className="text-slate-700" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {sharingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-effect w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-white pr-8">Share Intelligence</h2>
              <button 
                onClick={() => setSharingItem(null)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-sm text-slate-400 mb-6 font-medium line-clamp-2">
              {sharingItem.translations?.[currentLang]?.title || sharingItem.title}
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => handleCopyLink(sharingItem.uri)}
                className="w-full flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3 text-slate-200">
                  <Copy size={18} className="text-blue-400" />
                  <span className="font-semibold text-sm">Copy Link</span>
                </div>
                {copied ? <Check size={18} className="text-emerald-400" /> : <div className="text-[10px] font-mono text-slate-600 uppercase group-hover:text-slate-400">URI</div>}
              </button>

              <button 
                onClick={() => shareOnTwitter(sharingItem)}
                className="w-full flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all group"
              >
                <Twitter size={18} className="text-sky-400" />
                <span className="font-semibold text-sm text-slate-200">Share on X (Twitter)</span>
              </button>

              <button 
                onClick={() => shareOnLinkedIn(sharingItem)}
                className="w-full flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all group"
              >
                <Linkedin size={18} className="text-blue-600" />
                <span className="font-semibold text-sm text-slate-200">Share on LinkedIn</span>
              </button>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-800">
              <p className="text-[10px] font-mono text-slate-600 text-center uppercase tracking-widest">
                Transmission Secure
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDisplay;
