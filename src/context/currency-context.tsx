
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type { Currency, SiteSettings } from '@/lib/types';
import { getSiteSettings } from '@/lib/services/settings-service';

interface CurrencyContextType {
  currencies: Currency[];
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const defaultCurrency: Currency = { code: 'USD', name: 'US Dollar', rate: 1 };

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(defaultCurrency);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const siteSettings = await getSiteSettings();
        setSettings(siteSettings);

        const savedCurrencyCode = localStorage.getItem('selectedCurrency');
        const initialCurrency = siteSettings.currencies.find(c => c.code === savedCurrencyCode) || siteSettings.currencies[0] || defaultCurrency;
        setSelectedCurrencyState(initialCurrency);
      } catch (error) {
        console.error("Failed to fetch site settings for currency context", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const currencies = useMemo(() => settings?.currencies || [defaultCurrency], [settings]);

  const setSelectedCurrency = (currency: Currency) => {
    setSelectedCurrencyState(currency);
    localStorage.setItem('selectedCurrency', currency.code);
  };

  const value = {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    loading,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
