export type ClassificacaoRisco = "baixo" | "medio" | "alto";
export type ClassificacaoEficiencia = "baixa" | "media" | "alta";

export interface OperadorAnalise {
  nome_operador: string;
  loja: string;
  id_loja: number;
  id_empresa: number;
  valor_total_venda: number;
  quantidade_cupons: number;
  quantidade_itens_inclusos: number;
  quantidade_itens_cancelados: number;
  quantidade_vendas_canceladas: number;
  quantidade_itens_consultados: number;
  quantidade_itens_desconto: number;
  valor_itens_cancelados: number;
  valor_vendas_canceladas: number;
  valor_itens_desconto: number;
  ticket_medio: number;
  tempo_registro: number;
  cupons_por_hora: number;
  itens_por_hora: number;
  tempo_medio_por_cupom_seg: number;
  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  taxa_descontos: number;
  impacto_valor_cancelado: number;
  score_risco: number;
  classificacao_risco: ClassificacaoRisco;
  score_eficiencia: number;
  classificacao_eficiencia: ClassificacaoEficiencia;
}

export interface ResumoOperacao {
  loja: string;
  operadores_analisados: number;
  valor_total_venda: number;
  quantidade_cupons: number;
}

export interface MediasOperacao {
  ticket_medio: number;
  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  taxa_descontos: number;
  impacto_valor_cancelado: number;
  cupons_por_hora: number;
  itens_por_hora: number;
  tempo_medio_por_cupom_seg: number;
}

export interface DesviosOperacao {
  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  taxa_descontos: number;
  impacto_valor_cancelado: number;
  cupons_por_hora: number;
  itens_por_hora: number;
  tempo_medio_por_cupom_seg: number;
  ticket_medio: number;
}

export interface IndicadoresAnalise {
  resumo: ResumoOperacao;
  medias: MediasOperacao;
  desvios: DesviosOperacao;
  topRisco: OperadorAnalise[];
  topEficiencia: OperadorAnalise[];
  topFaturamento: OperadorAnalise[];
  topCancelamento: OperadorAnalise[];
  topVendasCanceladas: OperadorAnalise[];
  topConsultas: OperadorAnalise[];
  operadores: OperadorAnalise[];
}

export interface AnaliseOperadoresPayload {
  tipo_analise: string;
  indicadores: IndicadoresAnalise;
  texto_analitico: string;
}