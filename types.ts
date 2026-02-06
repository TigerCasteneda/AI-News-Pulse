
export interface NewsSource {
  title: string;
  uri: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  uri: string;
  // Store translations to avoid redundant API calls
  translations?: Record<string, { title: string; summary: string }>;
}

export interface SavedArticle extends NewsItem {
  savedAt: number;
}

export type LanguageCode = 'en' | 'zh' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export interface SearchFilters {
  dateRange: '24h' | '7d' | '30d' | 'all';
  specificSource?: string;
  language: LanguageCode;
}

export interface NewsState {
  items: NewsItem[];
  sources: NewsSource[];
  isLoading: boolean;
  isTranslating: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
