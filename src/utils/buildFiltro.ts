interface BuildFiltrosInput {
  numeroCupom?: number;
  numeroCaixa?: number;
  valorInicial?: number;
  nomeOperador?: string;
  valorFinal?: number;
  idLoja?: number;
  idEmpresa?: number;
  aberturaDataInicial?: Date;
  aberturaDataFinal?: Date;

  aberturaDataInicialAnterior?: Date;
  aberturaDataFinalAnterior?: Date;

  aberturaDataInicialPeriodo?: Date;
  aberturaDataFinalPeriodo?: Date;

  chaveCupom?: Number;
  dataInicial?: Date;
  dataFinal?: Date;
  idOperacoesCaixas?: number;

  codigo?: string;
  descricaoProduto?: string
}

export interface Filtro {
  coluna: string;
  operador: '=' | '>' | '<' | '>=' | '<=' | '!=' | 'LIKE';
  valor: string | number | boolean | undefined | Date | Number;
}

export function buildFiltro(input: BuildFiltrosInput): Filtro[] {
  const filtros: Filtro[] = [];

  if (input.valorInicial !== undefined && input.valorFinal !== undefined && input.valorInicial > input.valorFinal) {
    console.warn('Valor inicial é maior que o valor final — filtros de valor ignorados.');
    return filtros;
  }

  if (input.numeroCupom !== undefined && input.numeroCupom !== 0) {
    filtros.push({ coluna: 'id_cupom', operador: '=', valor: input.numeroCupom });
  }

  if (input.numeroCaixa !== undefined && input.numeroCaixa !== 0) {
    filtros.push({ coluna: 'id_caixa', operador: '=', valor: input.numeroCaixa });
  }

  if (input.idEmpresa !== undefined && input.idEmpresa !== 0) {
    filtros.push({ coluna: 'lojas.id_loja', operador: '=', valor: input.idEmpresa });
  }

  if (input.idLoja !== undefined && input.idLoja !== 0) {
    filtros.push({ coluna: 'lojas.id_empresa', operador: '=', valor: input.idLoja });
  }

  if (input.nomeOperador !== undefined && input.nomeOperador.trim() !== "") {
    filtros.push({ coluna: 'nome_operador', operador: '=', valor: `'${input.nomeOperador}'` });
  }

  if (input.valorInicial !== undefined && input.valorInicial !== 0) {
    filtros.push({ coluna: 'valor_total_venda', operador: '>=', valor: input.valorInicial });
  }

  if (input.valorFinal !== undefined && input.valorFinal !== 0) {
    filtros.push({ coluna: 'valor_total_venda', operador: '<=', valor: input.valorFinal });
  }

  if (input.aberturaDataInicial instanceof Date && !isNaN(input.aberturaDataInicial.getTime())) {
    const dataFormatada = input.aberturaDataInicial.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '>=', valor: `'${dataFormatada}'` });
  }

  if (input.aberturaDataFinal instanceof Date && !isNaN(input.aberturaDataFinal.getTime())) {
    const dataFormatada = input.aberturaDataFinal.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '<=', valor: `'${dataFormatada}'` });
  }

  if (input.chaveCupom !== undefined && input.chaveCupom !== 0) {
    filtros.push({ coluna: 'abertura_cupons.chave', operador: '=', valor: input.chaveCupom });
  }

  if (input.dataInicial instanceof Date && !isNaN(input.dataInicial.getTime())) {
    const dataFormatada = input.dataInicial.toISOString().split('T')[0];
    filtros.push({ coluna: 'data', operador: '>=', valor: `'${dataFormatada}'` });
  }

  if (input.dataFinal instanceof Date && !isNaN(input.dataFinal.getTime())) {
    const dataFormatada = input.dataFinal.toISOString().split('T')[0];
    filtros.push({ coluna: 'data', operador: '<=', valor: `'${dataFormatada}'` });
  }

  if (input.idOperacoesCaixas !== undefined && input.idOperacoesCaixas !== 0) {
    filtros.push({ coluna: 'id_operacoes_caixas', operador: '=', valor: input.idOperacoesCaixas });
  }

  if (input.aberturaDataInicialAnterior instanceof Date && !isNaN(input.aberturaDataInicialAnterior.getTime())) {
    const dataFormatada = input.aberturaDataInicialAnterior.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '>=', valor: `'${dataFormatada}'` });
  }

  if (input.aberturaDataFinalAnterior instanceof Date && !isNaN(input.aberturaDataFinalAnterior.getTime())) {
    const dataFormatada = input.aberturaDataFinalAnterior.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '<=', valor: `'${dataFormatada}'` });
  }

  if (input.aberturaDataInicialPeriodo instanceof Date && !isNaN(input.aberturaDataInicialPeriodo.getTime())) {
    const dataFormatada = input.aberturaDataInicialPeriodo.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '>=', valor: `'${dataFormatada}'` });
  }

  if (input.aberturaDataFinalPeriodo instanceof Date && !isNaN(input.aberturaDataFinalPeriodo.getTime())) {
    const dataFormatada = input.aberturaDataFinalPeriodo.toISOString().split('T')[0];
    filtros.push({ coluna: 'abertura_data', operador: '<=', valor: `'${dataFormatada}'` });
  }

  if (input.codigo !== undefined && input.codigo.trim() !== "") {
    filtros.push({ coluna: 'produtos.codigo', operador: '=', valor: `'${input.codigo.trim()}'` });
  }

  if (input.descricaoProduto !== undefined && input.descricaoProduto.trim() !== "") {
    filtros.push({ coluna: 'lower(produtos.descricao)', operador: 'LIKE', valor: `'${input.descricaoProduto.trim().toLowerCase()}%'` });
  }

  return filtros;
}
