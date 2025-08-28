import { createContext, useState, useEffect, ReactNode } from 'react';
import { LanguageContext, type Language, type LanguageContextType } from '@/hooks/useLanguage';

interface LanguageProviderProps {
  children: ReactNode;
}

const translations: Record<string, Record<Language, string>> = {
  // Header
  toggleTheme: {
    en: 'Toggle theme',
    pl: 'Przełącz motyw',
  },
  donate: {
    en: 'Donate',
    pl: 'Wsparcie',
  },

  // Footer
  personalWebsite: {
    en: 'Personal Website',
    pl: 'Strona Osobista',
  },
  footerDescription: {
    en: 'Fast and secure URL shortener',
    pl: 'Szybki i bezpieczny skracacz URL',
  },
  allRightsReserved: {
    en: 'All rights reserved.',
    pl: 'Wszelkie prawa zastrzeżone.',
  },

  // URL Shortener
  shortenYourUrl: {
    en: 'Shorten Your URL',
    pl: 'Skróć Swój URL',
  },
  createShortLinksDescription: {
    en: 'Create short links with custom lifetimes and track your URLs',
    pl: 'Twórz krótkie linki z niestandardowym czasem życia i śledź swoje URL',
  },
  enterUrl: {
    en: 'Enter URL',
    pl: 'Wprowadź URL',
  },
  linkLifetime: {
    en: 'Link Lifetime',
    pl: 'Czas Życia Linku',
  },
  shortenUrl: {
    en: 'Shorten URL',
    pl: 'Skróć URL',
  },
  shortening: {
    en: 'Shortening...',
    pl: 'Skracanie...',
  },
  yourShortUrl: {
    en: 'Your Short URL',
    pl: 'Twój Krótki URL',
  },
  lifetime: {
    en: 'Lifetime',
    pl: 'Czas życia',
  },
  created: {
    en: 'Created',
    pl: 'Utworzono',
  },

  // Lifetime options
  '1day': {
    en: '1 Day',
    pl: '1 Dzień',
  },
  '7days': {
    en: '7 Days',
    pl: '7 Dni',
  },
  '30days': {
    en: '30 Days',
    pl: '30 Dni',
  },
  '1year': {
    en: '1 Year',
    pl: '1 Rok',
  },
  forever: {
    en: 'Forever',
    pl: 'Na Zawsze',
  },

  // Messages
  error: {
    en: 'Error',
    pl: 'Błąd',
  },
  success: {
    en: 'Success',
    pl: 'Sukces',
  },
  pleaseEnterUrl: {
    en: 'Please enter a URL',
    pl: 'Proszę wprowadzić URL',
  },
  pleaseEnterValidUrl: {
    en: 'Please enter a valid URL',
    pl: 'Proszę wprowadzić prawidłowy URL',
  },
  urlShortenedSuccessfully: {
    en: 'URL shortened successfully!',
    pl: 'URL skrócony pomyślnie!',
  },
  copied: {
    en: 'Copied!',
    pl: 'Skopiowano!',
  },
  urlCopiedToClipboard: {
    en: 'URL copied to clipboard',
    pl: 'URL skopiowany do schowka',
  },

  // Hero section
  heroTitle: {
    en: 'Shorten URLs with Style',
    pl: 'Skracaj URL-e ze Stylem',
  },
  heroSubtitle: {
    en: 'Fast, secure, and beautiful URL shortener with custom lifetimes',
    pl: 'Szybki, bezpieczny i piękny skracacz URL z niestandardowym czasem życia',
  },
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};