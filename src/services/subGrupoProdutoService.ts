import ApiService from './api';
import { SubGrupoProduto } from '../types';

class SubGrupoProdutoService extends ApiService {
  private readonly basePath = '/sub-grupo-produto';

  async listar(): Promise<SubGrupoProduto[]> {
    return this.get<SubGrupoProduto[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<SubGrupoProduto> {
    return this.get<SubGrupoProduto>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<SubGrupoProduto, 'id_sub_grupo_produto'>): Promise<SubGrupoProduto> {
    return this.post<SubGrupoProduto>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<SubGrupoProduto, 'id_sub_grupo_produto'>>): Promise<SubGrupoProduto> {
    return this.put<SubGrupoProduto>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new SubGrupoProdutoService();