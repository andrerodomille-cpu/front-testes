import ApiService from './api';
import { Ncm } from '../types';

class NcmService extends ApiService {
  private readonly basePath = '/ncm';

  async listar(): Promise<Ncm[]> {
    return this.get<Ncm[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<Ncm> {
    return this.get<Ncm>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<Ncm, 'id_ncm'>): Promise<Ncm> {
    return this.post<Ncm>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<Ncm, 'id_ncm'>>): Promise<Ncm> {
    return this.put<Ncm>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new NcmService();