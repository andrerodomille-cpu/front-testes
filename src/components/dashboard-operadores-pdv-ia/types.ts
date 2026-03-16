export interface OperadorPDVIA {  
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
}

export interface IndicadoresPDVIA {
  resumo: {
    loja: string;
    operadores_analisados: number;
  };
  medias: {
    ticket_medio: number;
    taxa_itens_cancelados: number;
    taxa_vendas_canceladas: number;
    taxa_consultas: number;
    taxa_descontos: number;
    impacto_valor_cancelado: number;
    cupons_por_hora: number;
    itens_por_hora: number;
    tempo_medio_por_cupom_seg: number;
  };
  desvios: {
    taxa_itens_cancelados: number;
    taxa_vendas_canceladas: number;
    taxa_consultas: number;
    impacto_valor_cancelado: number;
    cupons_por_hora: number;
  };
  topCancelamento?: OperadorPDVIA[];
  topVendasCanceladas?: OperadorPDVIA[];
  topConsultas?: OperadorPDVIA[];
  topFaturamento?: OperadorPDVIA[];
  topProdutividade?: OperadorPDVIA[];
  operadores: OperadorPDVIA[];
}

export interface DashboardOperadoresPDVIAData {
  tipo_analise: string;
  indicadores: IndicadoresPDVIA;
  texto_analitico?: string;
}

export interface OperadorAnalisado {
  nome_operador: string;

  quantidade_cupons: number;
  quantidade_itens_inclusos: number;

  valor_total_venda: number;

  ticket_medio: number;

  cupons_por_hora: number;
  itens_por_hora: number;

  tempo_medio_por_cupom_seg: number;

  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  taxa_descontos: number;

  impacto_valor_cancelado: number;

  total_alertas: number;

  alertas: {
    id: string;
    label: string;
  }[];

  pontos_positivos: string[];
}