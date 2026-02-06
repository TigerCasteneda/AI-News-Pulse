
import React, { useState } from 'react';
import { NewsItem, NewsSource, LanguageCode } from '../types';
import { ExternalLink, Globe, Bookmark, BookmarkCheck, Share2, Copy, Check, Twitter, Linkedin, X, Languages } from 'lucide-react';

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
          
          // Use translated content if available and language matches
          const displayTitle = item.translations?.[currentLang]?.title || item.title;
          const displaySummary = item.translations?.[currentLang]?.summary || item.summary;

          return (
            <div key={item.id} className="glass-effect p-6 rounded-2xl shadow-xl hover:border-blue-500/30 transition-all group">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  {currentLang !== 'en' && item.translations?.[currentLang] && (
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold uppercase mb-2">
                      <Languages size={10} /> Translated
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {displayTitle}
                  </h3>
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
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {displaySummary}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
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
