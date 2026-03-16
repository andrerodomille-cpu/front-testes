import ApiService from './api';
import { NumeroOnu } from '../types';

class NumeroOnuService extends ApiService {
  private readonly basePath = '/numero-onu';

  async listar(): Promise<NumeroOnu[]> {
    return this.get<NumeroOnu[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<NumeroOnu> {
    return this.get<NumeroOnu>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<NumeroOnu, 'id_numero_onu'>): Promise<NumeroOnu> {
    return this.post<NumeroOnu>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<NumeroOnu, 'id_numero_onu'>>): Promise<NumeroOnu> {
    return this.put<NumeroOnu>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new NumeroOnuService();