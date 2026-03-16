
import { ptBR, enUS, es } from 'date-fns/locale';
import { Locale } from 'date-fns';

export function getDateFnsLocale(i18nLang: string): Locale {
  switch (i18nLang) {
    case 'pt':
    case 'pt-BR':
      return ptBR;
    case 'en':
    case 'en-US':
      return enUS;
    case 'es':
    case 'es-ES':
      return es;
    default:
      return enUS; // fallback
  }
}
