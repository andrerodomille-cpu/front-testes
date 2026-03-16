import ApiService from './api';
import { GrupoProduto } from '../types';

class GrupoProdutoService extends ApiService {
  private readonly basePath = '/grupo-produto';

  async listar(): Promise<GrupoProduto[]> {
    return this.get<GrupoProduto[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<GrupoProduto> {
    return this.get<GrupoProduto>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<GrupoProduto, 'id_grupo_produto'>): Promise<GrupoProduto> {
    return this.post<GrupoProduto>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<GrupoProduto, 'id_grupo_produto'>>): Promise<GrupoProduto> {
    return this.put<GrupoProduto>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new GrupoProdutoService();