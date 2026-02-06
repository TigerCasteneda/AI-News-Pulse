
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FiltersBar from './components/FiltersBar';
import NewsDisplay from './components/NewsDisplay';
import SavedArticlesSection from './components/SavedArticlesSection';
import { fetchAiNews } from './services/geminiService';
import { translateArticles } from './services/translationService';
import { NewsState, SearchFilters, SavedArticle, NewsItem, LanguageCode } from './types';
import { AlertCircle, Terminal, RefreshCw, Sparkles, LayoutGrid, Bookmark } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'saved'>('feed');
  const [keywords, setKeywords] = useState('Latest AI breakthroughs, LLM models, NVIDIA');
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: '7d',
    specificSource: '',
    language: 'en'
  });
  
  const [news, setNews] = useState<NewsState>({
    items: [],
    sources: [],
    isLoading: false,
    isTranslating: false,
    error: null,
    lastUpdated: null
  });

  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>(() => {
    const stored = localStorage.getItem('ai_news_saved');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('ai_news_saved', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const handleFetchNews = useCallback(async () => {
    if (!keywords.trim()) {
      setNews(prev => ({ ...prev, error: 'Please enter keywords to start monitoring.' }));
      return;
    }

    setNews(prev => ({ ...prev, isLoading: true, error: null }));
    setActiveTab('feed');
    
    try {
      const data = await fetchAiNews(keywords, filters);
      let items = data.items;

      setNews(prev => ({
        ...prev,
        items,
        sources: data.sources,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toLocaleTimeString()
      }));

      // Automatically trigger translation if non-English language is set
      if (filters.language !== 'en' && items.length > 0) {
        handleTranslateItems(items, filters.language);
      }
    } catch (err: any) {
      setNews(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message || 'An unexpected error occurred.' 
      }));
    }
  }, [keywords, filters]);

  const handleTranslateItems = async (itemsToTranslate: NewsItem[], lang: LanguageCode) => {
    // Only translate items that don't already have this translation
    const needsTranslation = itemsToTranslate.filter(item => !item.translations?.[lang]);
    
    if (needsTranslation.length === 0) return;

    setNews(prev => ({ ...prev, isTranslating: true }));
    try {
      const translationMap = await translateArticles(needsTranslation, lang);
      
      setNews(prev => ({
        ...prev,
        isTranslating: false,
        items: prev.items.map(item => {
          if (translationMap[item.id]) {
            return {
              ...item,
              translations: {
                ...(item.translations || {}),
                [lang]: translationMap[item.id]
              }
            };
          }
          return item;
        })
      }));
    } catch (err) {
      console.error("Translation failed", err);
      setNews(prev => ({ ...prev, isTranslating: false }));
    }
  };

  const onLanguageChange = (lang: LanguageCode) => {
    setFilters(prev => ({ ...prev, language: lang }));
    if (lang !== 'en' && news.items.length > 0) {
      handleTranslateItems(news.items, lang);
    }
  };

  const toggleSaveArticle = (item: NewsItem) => {
    setSavedArticles(prev => {
      const exists = prev.some(a => a.id === item.id || a.title === item.title);
      if (exists) {
        return prev.filter(a => a.id !== item.id && a.title !== item.title);
      }
      return [...prev, { ...item, savedAt: Date.now() }];
    });
  };

  const removeSavedArticle = (id: string) => {
    setSavedArticles(prev => prev.filter(a => a.id !== id));
  };

  const savedIds = useMemo(() => new Set(savedArticles.map(a => a.id)), [savedArticles]);

  // Initial fetch
  useEffect(() => {
    handleFetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-20 custom-scrollbar overflow-y-auto bg-slate-950">
      <Header 
        onRefresh={handleFetchNews} 
        isLoading={news.isLoading} 
        lastUpdated={news.lastUpdated}
        currentLang={filters.language}
        onLanguageChange={onLanguageChange}
      />

      <main className="max-w-6xl mx-auto px-4">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-900/80 p-1 rounded-2xl border border-slate-800 flex gap-1">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'feed' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LayoutGrid size={18} />
              DISCOVERY FEED
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'saved' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark size={18} />
              SAVED ARTICLES
              {savedArticles.length > 0 && (
                <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{savedArticles.length}</span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'feed' ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                Pulse of <span className="text-blue-500">Intelligence</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
                Curated AI signals from across the digital horizon. Use filters to narrow your search parameters.
              </p>
            </div>

            <SearchBar 
              keywords={keywords} 
              setKeywords={setKeywords} 
              onSearch={handleFetchNews} 
            />
            
            <FiltersBar 
              filters={filters}
              setFilters={(f) => setFilters(f)}
            />

            {news.isLoading && news.items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <RefreshCw size={48} className="text-blue-600 animate-spin mb-4" />
                <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Initializing Neural Scan...</p>
              </div>
            )}

            {news.error && (
              <div className="bg-red-900/10 border border-red-900/50 p-8 rounded-3xl flex items-start gap-5 text-red-400 mb-12">
                <AlertCircle className="flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="text-lg font-bold mb-2">Sync Error Detected</h3>
                  <p className="text-sm opacity-80 leading-relaxed">{news.error}</p>
                  <button 
                    onClick={handleFetchNews}
                    className="mt-6 px-6 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-900/50 rounded-xl text-xs font-bold transition-all"
                  >
                    RE-ESTABLISH CONNECTION
                  </button>
                </div>
              </div>
            )}

            {!news.error && news.items.length > 0 && (
              <div className={news.isLoading ? 'opacity-40 pointer-events-none' : ''}>
                <NewsDisplay 
                  items={news.items} 
                  sources={news.sources} 
                  savedIds={savedIds}
                  onToggleSave={toggleSaveArticle}
                  currentLang={filters.language}
                  isTranslating={news.isTranslating}
                />
              </div>
            )}

            {!news.isLoading && news.items.length === 0 && !news.error && (
              <div className="text-center py-24 glass-effect border-2 border-dashed border-slate-800 rounded-3xl">
                <Terminal size={48} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium">Monitoring idle. Enter keywords to begin scan.</p>
              </div>
            )}
          </>
        ) : (
          <div className={news.isTranslating ? 'opacity-50' : ''}>
            <SavedArticlesSection 
              articles={savedArticles} 
              onRemove={removeSavedArticle} 
            />
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-900 pt-10 pb-20 text-center">
        <div className="max-w-xs mx-auto flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] flex-1 bg-slate-800"></div>
          <Sparkles className="text-slate-800" size={16} />
          <div className="h-[1px] flex-1 bg-slate-800"></div>
        </div>
        <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">
          Neural Aggregate Engine v2.1 // Gemini-3 Flash // Multilingual Grounding 
        </p>
      </footer>
    </div>
  );
};

export default App;
