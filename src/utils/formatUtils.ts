// src/utils/formatUtils.ts
import i18n from "@/i18n";

const currencyByLanguage: Record<string, string> = {
  "pt-BR": "BRL",
  "en-US": "USD",
  "es-ES": "EUR",
};

export function formatInteger(value: number ): string {
  return new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDecimal(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentageInteger(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat(i18n.language, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value); // Dividindo por 100 para aplicar o formato correto
}


export function formatCurrency(value: number): string {
  const currency = currencyByLanguage[i18n.language] || "USD";

  return new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSecondsToHHMMSS(totalSeconds: number): string {
  const secondsInt = Math.floor(totalSeconds);
  const hours = Math.floor(secondsInt / 3600);
  const minutes = Math.floor((secondsInt % 3600) / 60);
  const seconds = secondsInt % 60;
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
