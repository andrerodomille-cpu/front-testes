export const fmtMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const fmtNumber = (value: number, digits = 2) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value || 0));

export const fmtPct = (value: number, digits = 2) => `${fmtNumber(value, digits)}%`;
export const fmtInt = (value: number) => new Intl.NumberFormat("pt-BR").format(Number(value || 0));
export const fmtSeconds = (value: number) => `${fmtNumber(value, 1)} s`;
