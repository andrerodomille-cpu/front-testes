export class StorageUtils {

  static salvarArrayString(key: string, valor: string[]): void {
    localStorage.setItem(key, JSON.stringify(valor));
  }
  /*
    static lerArrayString(key: string): string[] {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) as string[] : [];
      } catch {
        return [];
      }
    }
  */
  static lerArrayString(chave: string): string[] {
    try {
      const valor = localStorage.getItem(chave);
      if (!valor) return [];
      const arr = JSON.parse(valor);
      if (!Array.isArray(arr)) return [];

      return arr.filter((v: any) => typeof v === "string" && v !== "undefined" && v !== "null" && v.trim() !== "");
    } catch {
      return [];
    }
  }

  static salvarString(key: string, valor: string): void {
    localStorage.setItem(key, JSON.stringify(valor));
  }
  static lerString(key: string): string | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as string : null;
    } catch {
      return null;
    }
  }


  static salvarData(key: string, data: Date): void {
    localStorage.setItem(key, JSON.stringify(data.toISOString()));
  }
  static lerData(key: string): Date | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      const dateString = JSON.parse(item);
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  }

  static removerItem(key: string): void {
    localStorage.removeItem(key);
  }
}
