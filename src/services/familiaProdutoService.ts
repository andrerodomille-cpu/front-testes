import ApiService from './api';
import { FamiliaProduto } from '../types';

class FamiliaProdutoService extends ApiService {
  private readonly basePath = '/familia-produto';

  async listar(): Promise<FamiliaProduto[]> {
    return this.get<FamiliaProduto[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<FamiliaProduto> {
    return this.get<FamiliaProduto>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<FamiliaProduto, 'id_familia_produto'>): Promise<FamiliaProduto> {
    return this.post<FamiliaProduto>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<FamiliaProduto, 'id_familia_produto'>>): Promise<FamiliaProduto> {
    return this.put<FamiliaProduto>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new FamiliaProdutoService();