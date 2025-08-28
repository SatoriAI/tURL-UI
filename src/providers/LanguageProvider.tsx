
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

  // URL Checker
  checkUrlStatus: {
    en: 'Check URL Status',
    pl: 'Sprawdź Status URL',
  },
  checkExistingUrlDescription: {
    en: 'Enter a shortened URL to check its status and extend its lifetime',
    pl: 'Wprowadź skrócony URL, aby sprawdzić jego status i przedłużyć jego czas życia',
  },
  enterShortUrl: {
    en: 'Enter Short URL',
    pl: 'Wprowadź Krótki URL',
  },
  checkStatus: {
    en: 'Check Status',
    pl: 'Sprawdź Status',
  },
  checking: {
    en: 'Checking...',
    pl: 'Sprawdzanie...',
  },
  urlStatus: {
    en: 'URL Status',
    pl: 'Status URL',
  },
  status: {
    en: 'Status',
    pl: 'Status',
  },
  active: {
    en: 'Active',
    pl: 'Aktywny',
  },
  expired: {
    en: 'Expired',
    pl: 'Wygasły',
  },
  expiresIn: {
    en: 'Expires in',
    pl: 'Wygasa za',
  },
  extendLifetime: {
    en: 'Extend Lifetime',
    pl: 'Przedłuż Czas Życia',
  },
  extending: {
    en: 'Extending...',
    pl: 'Przedłużanie...',
  },
  newLifetime: {
    en: 'New Lifetime',
    pl: 'Nowy Czas Życia',
  },
  urlNotFound: {
    en: 'URL not found or invalid',
    pl: 'URL nie został znaleziony lub jest nieprawidłowy',
  },
  lifetimeExtendedSuccessfully: {
    en: 'Lifetime extended successfully!',
    pl: 'Czas życia przedłużony pomyślnie!',
  },
  days: {
    en: 'days',
    pl: 'dni',
  },
  day: {
    en: 'day',
    pl: 'dzień',
  },
  hours: {
    en: 'hours',
    pl: 'godzin',
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
