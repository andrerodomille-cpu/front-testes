export interface Ordem {
  id_ordem_servico: number;
  origem: string;
  data: Date;
  ordem_servico: number;
  parceiro: string;
  nome_fantasia: string;
  id_ordem_servico_status: number;
  descricao_ordem_servico_status: string;
  gerou_etiquetas: number;
  data_geracao_etiquetas: Date;
}
