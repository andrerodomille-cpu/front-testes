import ApiService from './api';
import { ComoConheceu } from '../types';

class ComoConheceuService extends ApiService {
  private readonly basePath = '/como-conheceu';

  async listar(): Promise<ComoConheceu[]> {
    return this.get<ComoConheceu[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<ComoConheceu> {
    return this.get<ComoConheceu>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<ComoConheceu, 'id_como_conheceu'>): Promise<ComoConheceu> {
    return this.post<ComoConheceu>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<ComoConheceu, 'id_como_conheceu'>>): Promise<ComoConheceu> {
    return this.put<ComoConheceu>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new ComoConheceuService();