type LanguageCode = "AR" | "BR" | "CL" | "DE" | "ES" | "IT" | "PT" | "US";
type DayAbbreviation = "Dom." | "Seg." | "Ter." | "Qua." | "Qui." | "Sex." | "Sáb.";
type YesNoText = "Sim" | "Não";

class Translation {
    private static dayTranslations: Record<DayAbbreviation, Record<LanguageCode, string>> = {
        "Dom.": { AR: "Dom.", BR: "Dom.", CL: "Dom.", DE: "Son.", ES: "Dom.", IT: "Dom.", PT: "Dom.", US: "Sun." },
        "Seg.": { AR: "Lun.", BR: "Seg.", CL: "Lun.", DE: "Mon.", ES: "Lun.", IT: "Lun.", PT: "Seg.", US: "Mon." },
        "Ter.": { AR: "Mar.", BR: "Ter.", CL: "Mar.", DE: "Die.", ES: "Mar.", IT: "Mer.", PT: "Ter.", US: "Tue." },
        "Qua.": { AR: "Mié.", BR: "Qua.", CL: "Mié.", DE: "Mit.", ES: "Mié.", IT: "Mer.", PT: "Qua.", US: "Wed." },
        "Qui.": { AR: "Jue.", BR: "Qui.", CL: "Jue.", DE: "Don.", ES: "Jue.", IT: "Gio", PT: "Qui.", US: "Thu." },
        "Sex.": { AR: "Vie.", BR: "Sex.", CL: "Vie.", DE: "Fre.", ES: "Vie.", IT: "Ven.", PT: "Sex.", US: "Fri." },
        "Sáb.": { AR: "Sáb.", BR: "Sáb.", CL: "Sáb", DE: "Sam.", ES: "Sáb.", IT: "Sab", PT: "Sáb.", US: "Sat." },
    };

    private static yesNoTranslations: Record<YesNoText, Record<LanguageCode, string>> = {
        "Sim": { AR: "Si", BR: "Sim", CL: "Si", DE: "Ja", ES: "Si", IT: "Si", PT: "Sim", US: "Yes" },
        "Não": { AR: "No", BR: "Não", CL: "No", DE: "Nein", ES: "No", IT: "No", PT: "Não", US: "No" },
    };

    static obterDiaSemana(dia: DayAbbreviation, language: LanguageCode): string | undefined {
        return this.dayTranslations[dia]?.[language];
    }

    static simNao(texto: YesNoText, language: LanguageCode): string | undefined {
        return this.yesNoTranslations[texto]?.[language];
    }
}

export default Translation;
