import ApiService from './api';
import { Entidade } from '../types';

class EntidadeService extends ApiService {
  private readonly basePath = '/entidade';

  async listar(): Promise<Entidade[]> {
    return this.get<Entidade[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<Entidade> {
    return this.get<Entidade>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<Entidade, 'id_entidade'>): Promise<Entidade> {
    return this.post<Entidade>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<Entidade, 'id_entidade'>>): Promise<Entidade> {
    return this.put<Entidade>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new EntidadeService();