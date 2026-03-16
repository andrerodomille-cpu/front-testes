export type SeveridadeAlerta = "alta" | "media" | "baixa";

export type ClassificacaoRisco = "alto" | "medio" | "baixo";
export type ClassificacaoEficiencia = "alta" | "media" | "baixa";

export interface OperadorResumoRisco {
  nome_operador: string;
  score_risco: number;
  classificacao_risco: ClassificacaoRisco;
}

export interface OperadorResumoEficiencia {
  nome_operador: string;
  score_eficiencia?: number;
  classificacao_eficiencia?: ClassificacaoEficiencia;
}

export interface ResumoExecutivo {
  loja: string;
  operadores_analisados: number;
  valor_total_venda: number;
  quantidade_cupons: number;
  operador_maior_risco: OperadorResumoRisco | null;
  operador_referencia_positiva: OperadorResumoEficiencia | null;
}

export interface PontoCritico {
  tipo: string;
  titulo: string;
  descricao: string;
  operador: string;
}

export interface AlertaAutomatico {
  severidade: SeveridadeAlerta;
  tipo: string;
  operador: string;
  mensagem: string;
}

export interface OperadorBase {
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

export interface OperadorPrioritario {
  nome_operador: string;
  loja: string;
  score_risco: number;
  classificacao_risco: ClassificacaoRisco;
  score_eficiencia: number;
  classificacao_eficiencia: ClassificacaoEficiencia;
  valor_total_venda: number;
  quantidade_cupons: number;
  taxa_itens_cancelados: number;
  taxa_vendas_canceladas: number;
  taxa_consultas: number;
  taxa_descontos: number;
  impacto_valor_cancelado: number;
  motivo_principal: string;
}

export interface IndicadoresResumo {
  loja: string;
  operadores_analisados: number;
  valor_total_venda: number;
  quantidade_cupons: number;
}

export interface IndicadoresMedias {
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

export interface IndicadoresDesvios {
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

export interface Indicadores {
  resumo: IndicadoresResumo;
  medias: IndicadoresMedias;
  desvios: IndicadoresDesvios;
  topRisco: OperadorBase[];
  topEficiencia: OperadorBase[];
  topFaturamento: OperadorBase[];
  topCancelamento: OperadorBase[];
  topVendasCanceladas: OperadorBase[];
  topConsultas: OperadorBase[];
  operadores: OperadorBase[];
}

export interface AnaliseIARiscoOperacionalComAlertas {
  tipo_analise: "analise_ia_risco_operacional_com_alertas";
  resumo_executivo: ResumoExecutivo;
  pontos_criticos: PontoCritico[];
  alertas_automaticos: AlertaAutomatico[];
  operadores_prioritarios: OperadorPrioritario[];
  referencias_positivas: OperadorBase[];
  indicadores: Indicadores;
  texto_analitico: string;
}