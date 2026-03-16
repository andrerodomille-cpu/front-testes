
export function getDateFormatByLang(i18nLang: string): string {
    switch (i18nLang) {
      case 'pt':
      case 'pt-BR':
        return 'dd/MM/yyyy';
      case 'en':
      case 'en-US':
        return 'MM/dd/yyyy';
      case 'es':
      case 'es-ES':
        return 'dd/MM/yyyy';
      default:
        return 'dd/MM/yyyy'; // fallback
    }
}  