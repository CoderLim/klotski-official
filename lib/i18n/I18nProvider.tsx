'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IntlProvider } from 'next-intl';

type Locale = 'en' | 'zh' | 'ja' | 'es' | 'pt' | 'ko';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const DEFAULT_LOCALE: Locale = 'zh';
const LOCALE_STORAGE_KEY = 'klotski-locale';

// 所有支持的语言
export const SUPPORTED_LOCALES: Locale[] = ['en', 'zh', 'ja', 'es', 'pt', 'ko'];

// 消息模块映射
const messagesModule = {
  en: () => import('@/messages/en.json'),
  zh: () => import('@/messages/zh.json'),
  ja: () => import('@/messages/ja.json'),
  es: () => import('@/messages/es.json'),
  pt: () => import('@/messages/pt.json'),
  ko: () => import('@/messages/ko.json'),
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载语言设置
  useEffect(() => {
    const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  // 加载对应语言的消息
  useEffect(() => {
    let isCancelled = false;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const module = await messagesModule[locale]();
        if (!isCancelled) {
          setMessages(module.default);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isCancelled = true;
    };
  }, [locale]);

  // 切换语言
  const setLocale = (newLocale: Locale) => {
    if (SUPPORTED_LOCALES.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    }
  };

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages}>
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useLocaleContext must be used within I18nProvider');
  }
  return context;
}

