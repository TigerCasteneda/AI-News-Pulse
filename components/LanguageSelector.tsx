
import React from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  disabled?: boolean;
}

const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange, disabled }) => {
  return (
    <div className="relative group">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-800' : 'border-slate-700 hover:border-blue-500/50 bg-slate-900/50'}
      `}>
        <Languages size={14} className="text-blue-400" />
        <span className="text-xs font-medium text-slate-300">
          {LANGUAGES.find(l => l.code === currentLang)?.label.split(' ')[0]}
        </span>
        <ChevronDown size={12} className="text-slate-500" />
      </div>
      
      {!disabled && (
        <div className="absolute right-0 mt-2 w-48 py-2 glass-effect rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-slate-800/50
                ${currentLang === lang.code ? 'text-blue-400 bg-blue-500/5' : 'text-slate-400 hover:text-white'}
              `}
            >
              <span>{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {currentLang === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
