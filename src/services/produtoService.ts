import ApiService from './api';
import { Produto, CreateProdutoDto, UpdateProdutoDto, UpdateEstoqueDto } from '../types';

class ProdutoService extends ApiService {
  private readonly basePath = '/produto';

  async listar(): Promise<Produto[]> {
    return this.get<Produto[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<Produto> {
    return this.get<Produto>(`${this.basePath}/${id}`);
  }

  async buscarPorCodigo(codigo: string): Promise<Produto> {
    return this.get<Produto>(`${this.basePath}/codigo/${codigo}`);
  }

  async criar(data: CreateProdutoDto): Promise<Produto> {
    return this.post<Produto>(this.basePath, data);
  }

  async atualizar(id: number, data: UpdateProdutoDto): Promise<Produto> {
    return this.put<Produto>(`${this.basePath}/${id}`, data);
  }

  async atualizarEstoque(id: number, data: UpdateEstoqueDto): Promise<Produto> {
    return this.put<Produto>(`${this.basePath}/${id}/estoque`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new ProdutoService();