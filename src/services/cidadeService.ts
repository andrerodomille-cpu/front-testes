import ApiService from './api';
import { Cidade } from '../types';

class CidadeService extends ApiService {
  private readonly basePath = '/cidade';

  async listar(): Promise<Cidade[]> {
    return this.get<Cidade[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<Cidade> {
    return this.get<Cidade>(`${this.basePath}/${id}`);
  }

  async buscarPorUf(ufId: number): Promise<Cidade[]> {
    return this.get<Cidade[]>(`${this.basePath}/uf/${ufId}`);
  }

  async criar(data: Omit<Cidade, 'id_cidade'>): Promise<Cidade> {
    return this.post<Cidade>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<Cidade, 'id_cidade'>>): Promise<Cidade> {
    return this.put<Cidade>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new CidadeService();