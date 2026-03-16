export interface Operador {
  nome_operador: string;
  loja?: string;
  score_risco?: number;
  classificacao_risco?: string;
  score_eficiencia?: number;
  classificacao_eficiencia?: string;
  valor_total_venda?: number;
  quantidade_cupons?: number;
  taxa_itens_cancelados?: number;
  taxa_vendas_canceladas?: number;
  taxa_consultas?: number;
  taxa_descontos?: number;
  impacto_valor_cancelado?: number;
  motivo_principal?: string;
}

export interface PontoCritico {
  tipo: string;
  titulo: string;
  descricao: string;
  operador: string;
}

export interface AlertaAutomatico {
  severidade: 'alta' | 'media' | 'baixa';
  tipo: string;
  operador: string;
  mensagem: string;
}

export interface PlanoAcao {
  prioridade: number;
  acao: string;
  descricao: string;
  foco: string[];
}

export interface ResumoExecutivo {
  loja: string;
  operadores_analisados: number;
  valor_total_venda: number;
  quantidade_cupons: number;
  operador_maior_risco: {
    nome_operador: string;
    score_risco: number;
    classificacao_risco: string;
  };
  operador_referencia_positiva: null | Operador;
}

export interface NivelCriticidadeLoja {
  nivel: 'baixo' | 'medio' | 'alto';
  score: number;
  justificativa: string;
}

export interface AnaliseRiscoOperacional {
  tipo_analise: string;
  resumo_executivo: ResumoExecutivo;
  nivel_criticidade_loja: NivelCriticidadeLoja;
  pontos_criticos: PontoCritico[];
  alertas_automaticos: AlertaAutomatico[];
  operadores_prioritarios: Operador[];
  referencias_positivas: Operador[];
  recomendacoes_objetivas: string[];
  plano_de_acao_sugerido: PlanoAcao[];
  texto_analitico: string;
}