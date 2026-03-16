import {
  formatCurrency,
  formatDecimal,
  formatInteger,
  formatPercentage
} from "@/utils/formatUtils";

type DataItem = Record<string, any>;

function formatValue(value: any, format: string): string {
  switch (format) {
    case 'c': return formatCurrency(value);
    case 'd': return formatDecimal(value);
    case 'i': return formatInteger(value);
    case 'p': return formatPercentage(value);
    default: return String(value);
  }
}

export function capitularString(input: string): string {
  function capitular(word: string): string {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
  return input.split(' ').map(capitular).join(' ');
}

export function calcularLinhaTendencia(
  vData: (string | number)[],
  vSerieFormatter: 'i' | 'd' | 'p' | 'c'
): { trendline: number[]; trendIncreasing: boolean } {
  const data = vSerieFormatter === 'i'
    ? vData.map(element => parseInt(String(element)))
    : vSerieFormatter === 'd'
    ? vData.map(element => parseFloat(String(element)))
    : vSerieFormatter === 'p'
    ? vData.map(element => {
        // Remove '%' e converte vírgula para ponto, depois transforma em decimal
        const str = String(element).replace('%', '').replace(',', '.');
        return parseFloat(str) / 100;
      })
    : vData.map(element => {
        // Remove símbolo de moeda e espaços, converte milhar/ponto para nada e vírgula decimal para ponto
        const str = String(element)
          //.replace(/[^\d,.-]/g, '') // remove tudo exceto dígitos, vírgula, ponto, e sinais
          //.replace(/\./g, '')       // remove separadores de milhar
          //.replace(',', '.');       // troca vírgula decimal por ponto
        return parseFloat(str);
      });

  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const trendline = x.map(xi => slope * xi + intercept);
  const trendIncreasing = trendline[n - 1] > trendline[0];
  return { trendline, trendIncreasing };
}

export function calcularTop5(
  data: DataItem[],
  totalizador: string,
  descritivo: string,
  maiorMelhor: number,
  formatacao: string
): { name: string; value: string }[] {
  const order = maiorMelhor === 0 ? 'asc' : 'desc';
  const n = 5;

  function sortByField(field: string, order: 'asc' | 'desc') {
    return (a: DataItem, b: DataItem) => {
      const valueA = a[field];
      const valueB = b[field];
      return order === 'desc' ? valueB - valueA : valueA - valueB;
    };
  }

  const sorted = [...data].sort(sortByField(totalizador, order)).slice(0, n);

  return sorted.map(item => ({
    name: capitularString(item[descritivo]),
    value: formatValue(item[totalizador], formatacao)
  }));
}

export function calcularBottom5(
  data: DataItem[],
  totalizador: string,
  descritivo: string,
  maiorMelhor: number,
  formatacao: string
): { name: string; value: string }[] {
  const order = maiorMelhor === 0 ? 'desc' : 'asc';
  const n = 5;

  function sortByField(field: string, order: 'asc' | 'desc') {
    return (a: DataItem, b: DataItem) => {
      const valueA = a[field];
      const valueB = b[field];
      return order === 'desc' ? valueB - valueA : valueA - valueB;
    };
  }

  const sorted = [...data].sort(sortByField(totalizador, order)).slice(0, n);

  return sorted.map(item => ({
    name: capitularString(item[descritivo]),
    value: formatValue(item[totalizador], formatacao)
  }));
}

export function obterMaiorEMenorValorPorCampo(
  data: any[],
  nomeCampo: string
): { maior: number; menor: number } {
  if (!data || data.length === 0) {
    return { maior: 0, menor: 0 };
  }

  const valores = data
    .map(item => Number(item[nomeCampo]))
    .filter(v => !isNaN(v));

  if (valores.length === 0) {
    return { maior: 0, menor: 0 };
  }

  const maior = Math.max(...valores);
  const menor = Math.min(...valores);

  return { maior, menor };
}
