import ApiService from './api';
import { SegmentoAtuacao } from '../types';

class SegmentoAtuacaoService extends ApiService {
  private readonly basePath = '/segmento-atuacao';

  async listar(): Promise<SegmentoAtuacao[]> {
    return this.get<SegmentoAtuacao[]>(this.basePath);
  }

  async buscarPorId(id: number): Promise<SegmentoAtuacao> {
    return this.get<SegmentoAtuacao>(`${this.basePath}/${id}`);
  }

  async criar(data: Omit<SegmentoAtuacao, 'id_segmento_atuacao_entidade'>): Promise<SegmentoAtuacao> {
    return this.post<SegmentoAtuacao>(this.basePath, data);
  }

  async atualizar(id: number, data: Partial<Omit<SegmentoAtuacao, 'id_segmento_atuacao_entidade'>>): Promise<SegmentoAtuacao> {
    return this.put<SegmentoAtuacao>(`${this.basePath}/${id}`, data);
  }

  async excluir(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`${this.basePath}/${id}`);
  }
}

export default new SegmentoAtuacaoService();