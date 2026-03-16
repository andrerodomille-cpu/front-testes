import ApiService from './api';
import { NumeroCas, CreateNumeroCasDto, UpdateNumeroCasDto } from '../types';

class NumeroCasService extends ApiService {
  private readonly basePath = '/numero-cas';

  async listar(): Promise<NumeroCas[]> {
    return this.get<NumeroCas[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<NumeroCas> {
    return this.get<NumeroCas>(`${this.basePath}/${id}`);
  }

  async criar(data: CreateNumeroCasDto): Promise<NumeroCas> {
    return this.post<NumeroCas>(this.basePath, data);
  }

  async atualizar(id: number, data: UpdateNumeroCasDto): Promise<NumeroCas> {
    return this.put<NumeroCas>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new NumeroCasService();