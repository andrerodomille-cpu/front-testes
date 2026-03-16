// Tipos básicos
export interface NumeroCas {
  id_numero_cas: number;
  numero_cas?: string | null;
  descricao_numero_cas?: string | null;
}

export interface Cidade {
  id_cidade: number;
  id_uf?: number | null;
  codigo_ibge?: string | null;
  nome_cidade?: string | null;
  // joined fields
  nome_uf?: string;
  sigla_uf?: string;
}

export interface UnidadeFederativa {
  id_uf: number;
  nome_uf?: string | null;
  sigla_uf?: string | null;
}

export type CreateCidadeDto = Omit<Cidade, 'id_cidade'>;
export type UpdateCidadeDto = Partial<Omit<Cidade, 'id_cidade'>>;


export interface NumeroOnu {
  id_numero_onu: number;
  numero_onu?: string;
  descricao_onu?: string;
}

export interface Ncm {
  id_ncm: number;
  codigo_ncm: string;
  descricao_ncm: string;
}

export interface FabricanteProduto {
  id_fabricante_produto: number;
  nome_fabricante: string;
}

export interface FamiliaProduto {
  id_familia_produto: number;
  descricao_familia_produto: string;
}

export interface GrupoProduto {
  id_grupo_produto: number;
  descricao_grupo_produto: string;
  formula?: number;
}

export interface SubGrupoProduto {
  id_sub_grupo_produto: number;
  descricao_sub_grupo_produto: string;
  id_grupo?: number;
  descricao_grupo_produto?: string; // joined field
}

export interface UnidadeMedida {
  id_unidade_medida: number;
  descricao_unidade_medida: string;
  sigla_unidade_medida: string;
}

export interface TipoEntidade {
  id_tipo_entidade: number;
  descricao_tipo_entidade?: string;
}

export interface TipoPessoaEntidade {
  id_tipo_pessoa_entidade: number;
  descricao_tipo_pessoa_entidade?: string;
}

export interface SegmentoAtuacao {
  id_segmento_atuacao_entidade: number;
  descricao_segmento_atuacao_entidade?: string;
}

export interface ComoConheceu {
  id_como_conheceu: number;
  descricao_como_conheceu?: string;
}




export interface Entidade {
  id_entidade: number;
  id_tipo_entidade?: number;
  id_tipo_pessoa_entidade?: number;
  id_segmento_atuacao_entidade?: number;
  id_como_conheceu?: number;
  id_cidade?: number;
  razao_social?: string;
  nome_fantasia?: string;
  cnpj_cpf?: string;
  ie_rg?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  complemento?: string;
  cep?: string;
  nome_contato?: string;
  celular_contato?: string;
  telefone_contato?: string;
  email_contato?: string;
  site?: string;
  data_cadastro: Date;
  // joined fields
  descricao_tipo_entidade?: string;
  descricao_tipo_pessoa_entidade?: string;
  descricao_segmento_atuacao_entidade?: string;
  descricao_como_conheceu?: string;
  nome_cidade?: string;
  sigla_uf?: string;
}

export interface Produto {
  id_produto: number;
  codigo_produto: string;
  id_familia_produto: number;
  id_grupo_produto: number;
  id_sub_grupo_produto: number;
  id_unidade_medida: number;
  id_fabricante_produto: number;
  nome_produto: string;
  quantidade_estoque_atual: number;
  preco_custo: number;
  preco_venda: number;
  preco_formula: number;
  ponto_reabastecimento: number;
  id_numero_onu?: number;
  id_numero_cas?: number;
  descricao_odor?: string;
  nome_mercado01?: string;
  nome_mercado02?: string;
  nome_mercado03?: string;
  formula_validada?: number;
  tara?: number;
  quantidade_reservada?: number;
  id_produto_versao?: number;
  // joined fields
  descricao_familia_produto?: string;
  descricao_grupo_produto?: string;
  descricao_sub_grupo_produto?: string;
  descricao_unidade_medida?: string;
  sigla_unidade_medida?: string;
  nome_fabricante?: string;
  descricao_onu?: string;
  descricao_numero_cas?: string;
}

// Tipos para criação/atualização (omitindo campos auto-gerados ou opcionais)
export type CreateNumeroCasDto = Omit<NumeroCas, 'id_numero_cas'>;
export type UpdateNumeroCasDto = Partial<Omit<NumeroCas, 'id_numero_cas'>>;


export type CreateProdutoDto = Omit<Produto, 'id_produto'>;
export type UpdateProdutoDto = Partial<Omit<Produto, 'id_produto'>>;
export type UpdateEstoqueDto = Pick<Produto, 'quantidade_estoque_atual' | 'quantidade_reservada'>;

// Tipo para resposta da API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  error: string;
}