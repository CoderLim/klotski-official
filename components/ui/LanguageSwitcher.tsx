'use client';

import { useState } from 'react';
import { useLocaleContext } from '@/lib/i18n/I18nProvider';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find((lang) => lang.code === locale);

  const handleLanguageChange = (newLocale: 'en' | 'zh' | 'ja' | 'es' | 'pt' | 'ko') => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center bg-gray-800/80 hover:bg-gray-700/80 text-white w-10 h-10 rounded-lg border border-gray-600 transition-all shadow-lg"
        aria-label={`Current language: ${currentLanguage?.name}`}
      >
        <span className="text-2xl">{currentLanguage?.flag}</span>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors text-left ${
                  locale === lang.code ? 'bg-gray-700 text-yellow-400' : 'text-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="flex-1">{lang.name}</span>
                {locale === lang.code && <span className="text-yellow-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

