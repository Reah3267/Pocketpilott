import React, { createContext, useContext, useState } from "react";

export type CurrencyCode =
  | "USD" | "EUR" | "GBP" | "INR" | "JPY" | "CAD" | "AUD"
  | "SGD" | "AED" | "CHF" | "CNY" | "MXN" | "BRL" | "ZAR"
  | "NGN" | "KRW";

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  flag: string;
  locale: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", name: "US Dollar",          flag: "🇺🇸", locale: "en-US" },
  { code: "EUR", name: "Euro",               flag: "🇪🇺", locale: "de-DE" },
  { code: "GBP", name: "British Pound",      flag: "🇬🇧", locale: "en-GB" },
  { code: "INR", name: "Indian Rupee",       flag: "🇮🇳", locale: "en-IN" },
  { code: "JPY", name: "Japanese Yen",       flag: "🇯🇵", locale: "ja-JP" },
  { code: "CAD", name: "Canadian Dollar",    flag: "🇨🇦", locale: "en-CA" },
  { code: "AUD", name: "Australian Dollar",  flag: "🇦🇺", locale: "en-AU" },
  { code: "SGD", name: "Singapore Dollar",   flag: "🇸🇬", locale: "en-SG" },
  { code: "AED", name: "UAE Dirham",         flag: "🇦🇪", locale: "ar-AE" },
  { code: "CHF", name: "Swiss Franc",        flag: "🇨🇭", locale: "de-CH" },
  { code: "CNY", name: "Chinese Yuan",       flag: "🇨🇳", locale: "zh-CN" },
  { code: "MXN", name: "Mexican Peso",       flag: "🇲🇽", locale: "es-MX" },
  { code: "BRL", name: "Brazilian Real",     flag: "🇧🇷", locale: "pt-BR" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", locale: "en-ZA" },
  { code: "NGN", name: "Nigerian Naira",     flag: "🇳🇬", locale: "en-NG" },
  { code: "KRW", name: "South Korean Won",   flag: "🇰🇷", locale: "ko-KR" },
];

const STORAGE_KEY = "pocketpilot-currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  currencyOption: CurrencyOption;
  setCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

function makeFormatter(option: CurrencyOption) {
  return (amount: number) =>
    new Intl.NumberFormat(option.locale, {
      style: "currency",
      currency: option.code,
      maximumFractionDigits: option.code === "JPY" || option.code === "KRW" ? 0 : 2,
    }).format(amount);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    return stored && CURRENCIES.some((c) => c.code === stored) ? stored : "USD";
  });

  const currencyOption = CURRENCIES.find((c) => c.code === currency)!;

  const setCurrency = (code: CurrencyCode) => {
    localStorage.setItem(STORAGE_KEY, code);
    setCurrencyState(code);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyOption,
        setCurrency,
        formatCurrency: makeFormatter(currencyOption),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
