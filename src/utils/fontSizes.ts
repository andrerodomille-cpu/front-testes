export const graficoFontSize = {
  labelApresentacao: "18px",
  labelNormal: "10px",
  labelZoom: "12px",

  eixoXApresentacao: "15px",
  eixoXNormal: "10px",
  eixoXZoom: "12px",

  eixoYApresentacao: "15px",
  eixoYNormal: "10px",
  eixoYZoom: "12px",

  CategoriaApresentacao: "15px",
  CategoriaNormal: "10px",
  CategoriaZoom: "12px",

  LegendaDonutApresentacao: "18px",
  LegendaDonutNormal: "10px",
  LegendaDonutZoom: "12px",

  CategoriaDonutApresentacao: "15px",
  CategoriaDonutNormal: "10px",
  CategoriaDonutZoom: "16px",
  
  eixoYRaking: "8px",
  eixoXRaking: "8px",

} as const;

export const fontSizes = {
  "text-xxs": "0.5rem",   // 12px
  "text-xs": "0.50rem",   // 12px
  "text-sm": "0.875rem",  // 14px
  "text-base": "1rem",    // 16px
  "text-lg": "1.125rem",  // 18px
  "text-xl": "1.25rem",   // 20px
  "text-2xl": "1.5rem",   // 24px
  "text-3xl": "1.875rem", // 30px
  "text-4xl": "2.25rem",  // 36px
  "text-5xl": "3rem",     // 48px
  "text-6xl": "3.75rem",  // 60px
  "text-7xl": "4.5rem",   // 72px
  "text-8xl": "6rem",     // 96px
  "text-9xl": "8rem"      // 128px
};

export function getFontSizeDataList(apresentacao: boolean): string {
  return apresentacao ? "text-xl" : "text-xs";
}

export function getFontSizeTitulo(apresentacao: boolean): string {
  return apresentacao ? fontSizes["text-3xl"] : fontSizes["text-base"];
}

export function getFontSizeSubTitulo(apresentacao: boolean): string {
  return apresentacao ? fontSizes["text-xl"] : fontSizes["text-sm"];
}

export function getFontSizeDetalhe(apresentacao: boolean): string {
  return apresentacao ? fontSizes["text-base"] : fontSizes["text-xs"];
}

export function getFontSizeValor(apresentacao: boolean): string {
  return apresentacao ? fontSizes["text-4xl"] : fontSizes["text-2xl"];
}

export function getFontSizeCellDataTable(apresentacao: boolean): string {
  return apresentacao ? "text-4xl" : "text-xs";
}
