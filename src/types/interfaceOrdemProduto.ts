export interface OrdemProduto {
    id_ordem_servico_produto: number;
    id_ordem_servico: number;
    id_empresa: number;
    nome_produto: string;
    codigo_patrimonio: string;
    id_tipo_produto: number;
    tipo: string;
    status_produto: number;
    quantidade: number;
    etiqueta_volume: string;
    id_ordem_servico_volumes_produtos: number;
}
