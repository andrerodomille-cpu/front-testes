import ApiService from './api';
import { UnidadeMedida } from '../types';

class UnidadeMedidaService extends ApiService {
  private readonly basePath = '/unidade-medida';

  async listar(): Promise<UnidadeMedida[]> {
    return this.get<UnidadeMedida[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<UnidadeMedida> {
    return this.get<UnidadeMedida>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<UnidadeMedida, 'id_unidade_medida'>): Promise<UnidadeMedida> {
    return this.post<UnidadeMedida>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<UnidadeMedida, 'id_unidade_medida'>>): Promise<UnidadeMedida> {
    return this.put<UnidadeMedida>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new UnidadeMedidaService();