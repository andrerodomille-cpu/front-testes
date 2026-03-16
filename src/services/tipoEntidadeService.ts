import ApiService from './api';
import { TipoEntidade } from '../types';

class TipoEntidadeService extends ApiService {
  private readonly basePath = '/tipo-entidade';

  async listar(): Promise<TipoEntidade[]> {
    return this.get<TipoEntidade[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<TipoEntidade> {
    return this.get<TipoEntidade>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<TipoEntidade, 'id_tipo_entidade'>): Promise<TipoEntidade> {
    return this.post<TipoEntidade>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<TipoEntidade, 'id_tipo_entidade'>>): Promise<TipoEntidade> {
    return this.put<TipoEntidade>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new TipoEntidadeService();