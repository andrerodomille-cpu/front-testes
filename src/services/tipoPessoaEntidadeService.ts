import ApiService from './api';
import { TipoPessoaEntidade } from '../types';

class TipoPessoaEntidadeService extends ApiService {
  private readonly basePath = '/tipo-pessoa-entidade';

  async listar(): Promise<TipoPessoaEntidade[]> {
    return this.get<TipoPessoaEntidade[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<TipoPessoaEntidade> {
    return this.get<TipoPessoaEntidade>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<TipoPessoaEntidade, 'id_tipo_pessoa_entidade'>): Promise<TipoPessoaEntidade> {
    return this.post<TipoPessoaEntidade>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<TipoPessoaEntidade, 'id_tipo_pessoa_entidade'>>): Promise<TipoPessoaEntidade> {
    return this.put<TipoPessoaEntidade>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new TipoPessoaEntidadeService();