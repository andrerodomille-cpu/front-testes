import { AnaliseRiscoOperacional } from './types';

export const mockAnaliseRisco: AnaliseRiscoOperacional = {
  tipo_analise: "analise_ia_risco_operacional_plano_acao",
  resumo_executivo: {
    loja: "LOJA01",
    operadores_analisados: 17,
    valor_total_venda: 1746219.75,
    quantidade_cupons: 37826,
    operador_maior_risco: {
      nome_operador: "CARMINHA",
      score_risco: 1.7883,
      classificacao_risco: "medio"
    },
    operador_referencia_positiva: null
  },
  nivel_criticidade_loja: {
    nivel: "baixo",
    score: 1,
    justificativa: "Criticidade baseada em concentração de operadores de alto risco, média de risco consolidada e pressão dos indicadores de cancelamento."
  },
  pontos_criticos: [
    {
      tipo: "risco_operacional",
      titulo: "Maior risco consolidado",
      descricao: "CARMINHA apresenta o maior score de risco da amostra, com classificação medio.",
      operador: "CARMINHA"
    },
    {
      tipo: "cancelamentos",
      titulo: "Maior taxa de itens cancelados",
      descricao: "BABI lidera em taxa de itens cancelados (1.6%).",
      operador: "BABI"
    },
    {
      tipo: "vendas_canceladas",
      titulo: "Maior taxa de vendas canceladas",
      descricao: "CARMINHA apresenta a maior taxa de vendas canceladas (16.27%).",
      operador: "CARMINHA"
    },
    {
      tipo: "consultas",
      titulo: "Maior taxa de consultas",
      descricao: "CLARICE concentra a maior taxa de consultas (2.22%).",
      operador: "CLARICE"
    },
    {
      tipo: "eficiencia",
      titulo: "Melhor eficiência operacional",
      descricao: "LUCAS apresenta o melhor score de eficiência da amostra, com classificação media.",
      operador: "LUCAS"
    }
  ],
  alertas_automaticos: [
    {
      severidade: "alta",
      tipo: "auditoria_prioritaria",
      operador: "CARMINHA",
      mensagem: "CARMINHA deve ser priorizado(a) para auditoria, com score de risco 1.7883 e destaque para maior pressão em impacto financeiro de cancelamentos."
    },
    {
      severidade: "alta",
      tipo: "anomalia_vendas_canceladas",
      operador: "CARMINHA",
      mensagem: "CARMINHA apresenta anomalia em vendas canceladas e merece validação gerencial mais próxima."
    },
    {
      severidade: "media",
      tipo: "anomalia_itens_cancelados",
      operador: "BABI",
      mensagem: "BABI apresenta taxa de itens cancelados acima da média e deve ser acompanhado(a)."
    },
    {
      severidade: "media",
      tipo: "consultas_acima_da_media",
      operador: "CLARICE",
      mensagem: "CLARICE apresenta volume de consultas acima da média, o que pode indicar fragilidade operacional ou dependência excessiva de conferência."
    }
  ],
  operadores_prioritarios: [
    {
      nome_operador: "CARMINHA",
      loja: "LOJA01",
      score_risco: 1.7883,
      classificacao_risco: "medio",
      score_eficiencia: 0,
      classificacao_eficiencia: "baixa",
      valor_total_venda: 41938.81,
      quantidade_cupons: 1893,
      taxa_itens_cancelados: 0.02,
      taxa_vendas_canceladas: 16.27,
      taxa_consultas: 0.02,
      taxa_descontos: 0.039,
      impacto_valor_cancelado: 20.87,
      motivo_principal: "Maior pressão em impacto financeiro de cancelamentos."
    }
  ],
  referencias_positivas: [],
  recomendacoes_objetivas: [
    "Executar auditoria amostral direcionada sobre CARMINHA.",
    "Avaliar a rotina operacional de CLARICE, pois o volume de consultas sugere possível fragilidade de processo ou dependência excessiva de conferência.",
    "Validar os motivos de vendas canceladas de CARMINHA e revisar se há falha operacional, reversões indevidas ou necessidade de orientação."
  ],
  plano_de_acao_sugerido: [
    {
      prioridade: 1,
      acao: "Auditar operadores de maior risco",
      descricao: "Revisar amostras de operações, cancelamentos, vendas canceladas, consultas e descontos dos operadores classificados com maior risco.",
      foco: ["CARMINHA"]
    },
    {
      prioridade: 2,
      acao: "Revisar causas de anomalias operacionais",
      descricao: "Analisar origem de cancelamentos acima da média, consultas excessivas e impacto financeiro de reversões para identificar fragilidade de processo ou comportamento fora da curva.",
      foco: ["BABI", "CARMINHA", "CLARICE"]
    },
    {
      prioridade: 3,
      acao: "Aplicar ação corretiva e reciclagem",
      descricao: "Direcionar feedback, acompanhamento e reciclagem operacional aos operadores com pior equilíbrio entre risco e eficiência.",
      foco: ["CARMINHA"]
    },
    {
      prioridade: 5,
      acao: "Acompanhar criticidade da loja",
      descricao: "Manter monitoramento recorrente, pois a criticidade consolidada da loja foi classificada como baixo.",
      foco: ["LOJA01"]
    }
  ],
  texto_analitico: "Análise das vendas por operadores da loja com ID 1:\n\n1. Operador(a) Vendas Total: 1.692.437,51 (valor aproximado)\n2. Quantidade de Vendas: 37.058 (valor aproximado)\n3. Média por Venda: R$ 45.95 (valor aproximado)\n4. Operadores com maiores números de vendas:\n   - Leticia: 12.789 itens, 3037 cupons e R$ 148.455,51\n   - Mateus: 16.918 itens, 3778 cupons e R$ 185.701,05\n5. Operadores com maior percentual de itens cancelados (itens cancelados divididos por total de itens):\n   - Floquinho: 4,09%\n   - Leticia: 7,43%\n6. Operadores com maior percentual de vendas canceladas (valor aproximado) (vendas canceladas dividido por total de vendas):\n   - Floquinho: 2,98%\n   - Matheus: 5,56%\n7. Operador(a) com o menor percentual de itens cancelados (valor aproximado):\n   - Fluquinho: 4,09%\n8. Operadores com maior percentual de consultas (itens consultados dividido por total de itens):\n   - Leticia: 4,3%\n   - Floquinho: 2,91%\n9. Operadores com menor percentual de consultas:\n   - Floquinho: 2,91%\n10. Valor total dos itens cancelados: R$ 7.862,59 (valor aproximado)\n11. Valor total das vendas canceladas: R$ 835,47 (valor aproximado)\n12. Operador(a) com o menor impacto do valor dos itens cancelados (valor aproximado): Floquinho\n13. Operador(a) com o maior impacto do valor das vendas canceladas (valor aproximado): Matheus\n14. Scores de risco: 0,2863 (Leticia), 0,0203 (Matheus), 0,0068 (Floquinho) - menor número significa risco mais baixo.\n15. Scores de eficiência: 0,111 (Leticia), 0,6849 (Matheus), 0,1433 (Floquinho) - menor número significa eficiência mais baixa."
};