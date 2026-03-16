import i18n from "@/i18n";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfDay,
  differenceInDays
} from 'date-fns';
import dayjs from 'dayjs';

type Periodo = {
  inicio: string;
  fim: string;
};

function formatPeriodo(dataInicio: Date, dataFim: Date): Periodo {
  return {
    inicio: dataInicio.toISOString().split('T')[0],
    fim: dataFim.toISOString().split('T')[0]
  };
}

export function formatarData(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const [year, month, day] = dateStr.split("-").map(Number);

  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
    timeZone: "UTC"
  }).format(date);
}

export function formatarDataHoraShort(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "short",
    timeStyle: "short" 
  }).format(date);
}

export function formatarDataHoraLong(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "long",
    timeStyle: "short" 
  }).format(date);
}

export function formatarHoraString(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Define formato 24h (remova para 12h com AM/PM)
  }).format(date);
}

export function dataAtualString(): string {
  const currentDate = new Date();
  
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à frente se necessário
  const day = currentDate.getDate().toString().padStart(2, '0'); // Adiciona zero à frente se necessário
  
  return `${year}-${month}-${day}`;
}

export function intervaloRetroativo(days: number): { currentDate: string; pastDate: string } {
  const today = new Date();
  const pastDate = new Date();
  pastDate.setDate(today.getDate() - days); 

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajusta mês (0-11) para (1-12)
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return { currentDate: formatDate(today), pastDate: formatDate(pastDate) };
}

export function intervaloDiaAnterior(days: number): { startDate: string; endDate: string } {
  const today = new Date();
  today.setDate(today.getDate() - 1); // Data final: hoje menos um dia

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days); // Subtrai os dias a partir da nova data final

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajusta mês (0-11) para (1-12)
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return { startDate: formatDate(startDate), endDate: formatDate(today) };
}

export function formatarInteiroHoras(segundos: number): string {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = Math.floor(segundos % 60);
  return `${horas < 10 ? "0" + horas : horas}:${minutos < 10 ? "0" + minutos : minutos}:${segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes}`;
}

export function calcularPeriodo(tipo: number): Periodo  {
  const dataAtual = new Date();
  const dataRef = new Date(dataAtual);

  if (tipo === 1) {
    return formatPeriodo(dataAtual, dataAtual);
  }

  if (tipo === 2) {
    dataRef.setDate(dataAtual.getDate() - 1);
    return formatPeriodo(dataRef, dataRef);
  }

  if (tipo >= 3 && tipo <= 23) {
    const dias = [1, 2, 3, 4, 5, 6, 7, 9, 14, 19, 29, 59, 89, 119, 149, 179, 209, 239, 269, 299, 329, 359][tipo - 3];
    dataRef.setDate(dataAtual.getDate() - dias);
    return formatPeriodo(dataRef, dataAtual);
  }

  throw new Error(`Tipo de período inválido: ${tipo}`);
  
}

export function mesAtual(data: Date): Periodo {
  const inicio = startOfMonth(data);
  const fim = endOfMonth(data);
  fim.setDate(fim.getDate() - 1);
  return formatPeriodo(inicio, fim);
}

export function mesAnterior(data: Date): Periodo {
  const anterior = subMonths(data, 1);
  const inicio = startOfMonth(anterior);
  const fim = endOfMonth(anterior);
  fim.setDate(fim.getDate() - 1);
  return formatPeriodo(inicio, fim);
}

export function semanaAtual(data: Date): Periodo {
  const inicio = startOfWeek(data, { weekStartsOn: 1 });
  const fim = endOfWeek(data, { weekStartsOn: 1 });
  fim.setDate(fim.getDate() - 1);
  return formatPeriodo(inicio, fim);
}

export function semanaAnterior(data: Date): Periodo {
  const anterior = new Date(data);
  anterior.setDate(anterior.getDate() - 7);
  const inicio = startOfWeek(anterior, { weekStartsOn: 1 });
  const fim = endOfWeek(anterior, { weekStartsOn: 1 });
  fim.setDate(fim.getDate() - 1);
  return formatPeriodo(inicio, fim);
}

export function ultimos15Dias(data: Date): Periodo {
  const fim = startOfDay(data);
  const inicio = subDays(fim, 14);
  return formatPeriodo(inicio, fim);
}

export function ultimos30Dias(data: Date): Periodo {
  const fim = startOfDay(data);
  const inicio = subDays(fim, 29);
  return formatPeriodo(inicio, fim);
}

export function ultimos60Dias(data: Date): Periodo {
  const fim = startOfDay(data);
  const inicio = subDays(fim, 59);
  return formatPeriodo(inicio, fim);
}

export function ultimas08Semanas(data: Date): Periodo {
  const fim = startOfDay(data);
  const inicio = subDays(fim, 54);
  return formatPeriodo(inicio, fim);
}

export function periodoAnterior(dataI: Date, dataF: Date): Periodo {
  if (dayjs(dataI).isValid() && dayjs(dataF).isValid()) {
    const dias = differenceInDays(startOfDay(dataF), startOfDay(dataI));
    const fimAnterior = startOfDay(dataI);
    const inicioAnterior = subDays(fimAnterior, dias);
    return formatPeriodo(inicioAnterior, fimAnterior);
  }
  return { inicio: '2001-01-01', fim: '2001-01-01' };
}

export function anoAnteriorCompleto(date: Date): Periodo {
  const ano = date.getFullYear() - 1;
  const inicio = new Date(ano, 0, 1);
  const fim = new Date(ano, 11, 31);

  if (dayjs(inicio).isValid() && dayjs(fim).isValid()) {
    return formatPeriodo(inicio, fim);
  }

  return { inicio: '2001-01-01', fim: '2001-01-01' };
}

export function ultimosDozeMeses(): Periodo {
  const dataAtual = new Date();
  const inicio = new Date(dataAtual.getFullYear() - 1, dataAtual.getMonth() + 1, 1);
  const fim = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), dataAtual.getDate() - 1);
  return formatPeriodo(inicio, fim);
}

export function ultimosDozeMesesFechado(): Periodo {
  const dataAtual = new Date();
  const inicio = new Date(dataAtual.getFullYear() - 1, dataAtual.getMonth(), 1);
  const fim = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 0); // último dia do mês anterior
  return formatPeriodo(inicio, fim);
}