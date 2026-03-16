import { ColumnDef } from "@tanstack/react-table";

export type AlignType = 'left' | 'center' | 'right';

export type FilterOperator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn' | 'notEqual' | 'after' | 'before' | 'today' | 'notContains';

export type FilterType = 'text' | 'number' | 'date' | 'time' | 'select' | 'boolean' | 'multiselect' | 'range' | 'datetime';

export interface FilterState {
    columnId: string;
    type: FilterType;
    operator: FilterOperator;
    value: any;
    value2?: any;
    values?: any[];
}

export interface CustomColumnMeta {
    visible: boolean;
    width: number;
    label?: string;
    filterType?: FilterType;
    align?: AlignType;
    aggregation?: 'sum' | 'avg' | null;
    filterOptions?: {
        min?: number;
        max?: number;
        step?: number;
        options?: Array<{ label: string; value: any }>;
        dateFormat?: string;
        showTime?: boolean;
    };
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    titulo: string;
    subTitulo: string;
    exportacao?: boolean;
    paginacao?: boolean;
    tamanhoPagina?: number;
    tamanhosPagina?: number[];
    selecaoColunas?: boolean;
    carregando: boolean;
    erro: boolean;
    rodape?: boolean;
    compacto?: boolean;
    navegaPagina?: boolean;
    tipoErro?: 'network' | 'server' | 'data' | 'auth' | 'generic';
    mensagemErro?: string;
    filtrosExternos?: FilterState[];
    onFiltrosChange?: (filtros: FilterState[], filtroGlobal: string) => void;
    filtroGlobalExterno?: string;
    selecaoLinha?: boolean; 
    onLinhaSelecionada?: (linha: T | null) => void;
    manterSelecaoAoClicarFora?: boolean;
    onPaginaChange?: (paginaAtual: number) => void;
    paginaExterna?: number;
    linhaSelecionadaExterna?: T | null;
    buscaGlobal?: boolean;
    
}