import ApiService from './api';
import { UnidadeFederativa } from '../types';

class UfService extends ApiService {
  private readonly basePath = '/uf';

  async listar(): Promise<UnidadeFederativa[]> {
    return this.get<UnidadeFederativa[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<UnidadeFederativa> {
    return this.get<UnidadeFederativa>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<UnidadeFederativa, 'id_uf'>): Promise<UnidadeFederativa> {
    return this.post<UnidadeFederativa>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<UnidadeFederativa, 'id_uf'>>): Promise<UnidadeFederativa> {
    return this.put<UnidadeFederativa>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new UfService();