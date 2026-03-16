export interface Etiqueta {
  id_ordem_servico_item_etiquetas: number;
  id_ordem_servico_item: number;
  id_ordem_servico: number;
  id_lancamento: number;
  ordem_servico: number;
  codigo_ps: number;
  produto: string;
  quantidade: number;
  unidade: string;
  codigo_etiqueta: string;
  status_etiqueta: number;
  alocado_acabado: number;
  id_ordem_servico_produto: number;
  id_produto_cadastro: number;
  nome_produto: string;
  etiqueta_patrimonio: number;
  etiqueta_interna: number;
  tipo: string;
  etiqueta_patrimonio_impressa: number;
}
