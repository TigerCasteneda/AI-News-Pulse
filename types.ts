
export interface User {
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface NewsSource {
  title: string;
  uri: string;
}

export interface NewsLocation {
  name: string;
  lat: number;
  lng: number;
  countryCode: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  uri: string;
  // Influence Analysis Metrics
  influenceScore: number; // 0-100
  disseminationLevel: 'Niche' | 'Growing' | 'Widespread' | 'Global';
  sourceType: 'Top-tier Media' | 'Research Institution' | 'KOL / Industry Expert' | 'General Source';
  sourceName: string;
  isHighImpact: boolean;
  // Geographic Analysis
  location?: NewsLocation;
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
  itemCount: number;
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
