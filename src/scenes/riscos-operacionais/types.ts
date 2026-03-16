export type OperadorRiscoOperacional = {
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
};

export type MediasRiscoOperacional = {
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

export type DesviosRiscoOperacional = {
  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  impacto_valor_cancelado: number;
  cupons_por_hora: number;
};

export type AnaliseRiscoOperacionalPayload = {
  tipo_analise: string;
  indicadores: {
    resumo: {
      loja: string;
      operadores_analisados: number;
    };
    medias: MediasRiscoOperacional;
    desvios: DesviosRiscoOperacional;
    topCancelamento: OperadorRiscoOperacional[];
    topVendasCanceladas: OperadorRiscoOperacional[];
    topConsultas: OperadorRiscoOperacional[];
    topFaturamento: OperadorRiscoOperacional[];
    topProdutividade: OperadorRiscoOperacional[];
    operadores: OperadorRiscoOperacional[];
  };
  texto_analitico: string;
};

export type SeveridadeRisco = "danger" | "warning" | "info" | "success";

export type AlertaOperador = {
  label: string;
  severity: SeveridadeRisco;
  value: string;
};

export type OperadorScorado = OperadorRiscoOperacional & {
  riskScore: number;
  alerts: AlertaOperador[];
};
