// src/contexts/LocaleProvider.tsx
import * as React from "react";
import { Locale, enUS, ptBR } from "date-fns/locale";
import i18n from "i18next";

type LocaleContextType = {
    locale: Locale;
};

const localeMap: Record<string, Locale> = {
    "en-US": enUS,
    "en-GB": enUS,
    "pt-BR": ptBR,
};

// Função para obter o locale baseado no idioma atual
function getLocale(language: string): Locale {
    return localeMap[language] || enUS;
}

// Cria o contexto
const LocaleContext = React.createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [locale, setLocale] = React.useState<Locale>(() => getLocale(i18n.language));

    // Sincroniza o locale com o idioma do i18n
    React.useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            setLocale(getLocale(lng));
        };

        // Listener para mudanças de idioma no i18n
        i18n.on("languageChanged", handleLanguageChange);

        // Limpa o listener ao desmontar o componente
        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, []);

    return (
        <LocaleContext.Provider value={{ locale }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocale = (): Locale => {
    const context = React.useContext(LocaleContext);
    if (!context) {
        throw new Error("useLocale deve ser usado dentro de um LocaleProvider");
    }
    return context.locale;
};