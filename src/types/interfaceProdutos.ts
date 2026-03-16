export interface Produto {
  id_ordem_servico_item: number;
  id_ordem_servico: number;
  id_lancamento: number;
  codigo_ps: number;
  produto: string;
  quantidade: number;
  unidade: string;
  gerou_etiquetas: number;
  etiqueta_patrimonio: number;
  etiqueta_interna: number;
  tipo: string;
  data_geracao_etiquetas: Date;
}
