
import React from 'react';
import { SavedArticle } from '../types';
import { Trash2, ExternalLink, BookmarkX, Clock, Zap, ShieldCheck } from 'lucide-react';

interface SavedArticlesSectionProps {
  articles: SavedArticle[];
  onRemove: (id: string) => void;
}

const SavedArticlesSection: React.FC<SavedArticlesSectionProps> = ({ articles, onRemove }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-24 glass-effect rounded-3xl border-2 border-dashed border-slate-800">
        <BookmarkX size={48} className="mx-auto text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-slate-400 mb-2">No saved articles yet</h3>
        <p className="text-slate-600 text-sm max-w-xs mx-auto">
          Articles you bookmark from the main feed will appear here for later analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2 px-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Your Collection <span className="text-xs font-mono bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">{articles.length}</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {articles.sort((a, b) => b.savedAt - a.savedAt).map((article) => (
          <div key={article.id} className="glass-effect p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all group">
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    <Clock size={10} />
                    Saved {new Date(article.savedAt).toLocaleDateString()}
                  </div>
                  {article.isHighImpact && (
                    <span className="text-[9px] text-orange-400 font-black uppercase tracking-tighter flex items-center gap-0.5">
                      <Zap size={10} fill="currentColor" /> High Impact
                    </span>
                  )}
                  <span className="text-[9px] text-blue-500 font-bold uppercase tracking-tighter flex items-center gap-0.5">
                    <ShieldCheck size={10} /> {article.sourceName}
                  </span>
                </div>
                <h3 className="text-md font-bold text-slate-100 mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {article.summary}
                </p>
                <div className="flex items-center gap-4">
                  <a 
                    href={article.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-400"
                  >
                    READ ARTICLE <ExternalLink size={12} />
                  </a>
                  <button 
                    onClick={() => onRemove(article.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-500/70 hover:text-red-400 transition-colors"
                  >
                    REMOVE <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedArticlesSection;
