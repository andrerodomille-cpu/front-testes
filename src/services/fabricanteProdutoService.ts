import ApiService from './api';
import { FabricanteProduto } from '../types';

class FabricanteProdutoService extends ApiService {
  private readonly basePath = '/fabricante-produto';

  async listar(): Promise<FabricanteProduto[]> {
    return this.get<FabricanteProduto[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<FabricanteProduto> {
    return this.get<FabricanteProduto>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<FabricanteProduto, 'id_fabricante_produto'>): Promise<FabricanteProduto> {
    return this.post<FabricanteProduto>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<FabricanteProduto, 'id_fabricante_produto'>>): Promise<FabricanteProduto> {
    return this.put<FabricanteProduto>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new FabricanteProdutoService();