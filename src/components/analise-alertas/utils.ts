export const fmtMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const fmtInt = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0,
  }).format(value);

export const fmtDecimal = (value: number, digits = 2) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

export const fmtPct = (value: number, digits = 2) =>
  `${fmtDecimal(value, digits)}%`;

export const fmtTime = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}m ${sec}s`;
};

export const badgeTone = (value?: string) => {
  switch (value) {
    case "alto":
    case "alta":
      return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200";
    case "medio":
    case "media":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200";
    default:
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200";
  }
};

export function alertaTone(severidade: string) {
  switch (severidade) {
    case "alta":
      return {
        badge: "bg-red-100 text-red-700 border-red-200",
        card: "border-red-300 bg-red-50 dark:bg-red-900/10",
      };

    case "media":
      return {
        badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
        card: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10",
      };

    case "baixa":
      return {
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        card: "border-blue-300 bg-blue-50 dark:bg-blue-900/10",
      };

    default:
      return {
        badge: "bg-gray-100 text-gray-700 border-gray-200",
        card: "border-gray-200",
      };
  }
}

export function riscoTone(classificacao: string) {
  switch (classificacao) {
    case "alto":
      return "text-red-600";
    case "medio":
      return "text-yellow-600";
    case "baixo":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
}

export function eficienciaTone(classificacao: string) {
  switch (classificacao) {
    case "alta":
      return "text-green-600";
    case "media":
      return "text-yellow-600";
    case "baixa":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}