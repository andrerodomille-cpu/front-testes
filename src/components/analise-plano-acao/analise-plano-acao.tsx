import React from 'react';
import Header from './Header';
import MetricsCards from './MetricsCards';
import CriticidadeBadge from './CriticidadeBadge';
import PontosCriticos from './PontosCriticos';
import AlertasAutomaticos from './AlertasAutomaticos';
import OperadorPrioritarioCard from './OperadorPrioritarioCard';
import Recomendacoes from './Recomendacoes';
import PlanoAcao from './PlanoAcao';
import TextoAnalitico from './TextoAnalitico';
import { mockAnaliseRisco } from './mock';
import { ArrowLeft, FileText } from 'lucide-react';

const AnalisePlanoAcao: React.FC = () => {
  const data = mockAnaliseRisco;

  // Calcular métricas adicionais com verificação de undefined
  const taxaMediaCancelamento = data.operadores_prioritarios.reduce(
    (acc, op) => acc + (op.taxa_vendas_canceladas || 0), 
    0
  ) / (data.operadores_prioritarios.length || 1);

  const handleVoltar = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-10 container">
 
        {/* Header com informações da análise */}
        <div className="mb-8">
          <Header 
            loja={data.resumo_executivo.loja}
            operadoresAnalisados={data.resumo_executivo.operadores_analisados}
            valorTotalVenda={data.resumo_executivo.valor_total_venda}
            quantidadeCupons={data.resumo_executivo.quantidade_cupons}
          />
        </div>

 {/* Grid de 2 colunas para Recomendações e Plano de Ação */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <PlanoAcao plano={data.plano_de_acao_sugerido} />
        </div>

        {/* Metrics Cards
          <MetricsCards 
            totalOperadores={data.resumo_executivo.operadores_analisados}
            valorTotalVenda={data.resumo_executivo.valor_total_venda}
            totalCupons={data.resumo_executivo.quantidade_cupons}
            taxaMediaCancelamento={taxaMediaCancelamento}
            operadoresRisco={data.operadores_prioritarios.length}
          />
        </div>
 */}
        <div className="mb-8"></div>
        {/* Criticidade Badge */}
        <div className="mb-8">
          <CriticidadeBadge 
            nivel={data.nivel_criticidade_loja.nivel}
            score={data.nivel_criticidade_loja.score}
            justificativa={data.nivel_criticidade_loja.justificativa}
          />
        </div>

        {/* Grid de 2 colunas para Pontos Críticos e Alertas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PontosCriticos pontos={data.pontos_criticos} />
          <AlertasAutomaticos alertas={data.alertas_automaticos} />
        </div>

        {/* Operadores Prioritários */}
        {data.operadores_prioritarios.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Operadores Prioritários
            </h2>
            <div className="space-y-4">
              {data.operadores_prioritarios.map((operador, index) => (
                <OperadorPrioritarioCard key={index} operador={operador} />
              ))}
            </div>
          </div>
        )}

        {/* Grid de 2 colunas para Recomendações e Plano de Ação */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
          <Recomendacoes recomendacoes={data.recomendacoes_objetivas} />
        </div>

        {/* Texto Analítico */}
        <div className="mb-8">
          <TextoAnalitico texto={data.texto_analitico} />
        </div>


      </div>
    </div>
  );
};

export default AnalisePlanoAcao;