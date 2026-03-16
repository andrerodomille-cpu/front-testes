import React, { useState, useRef, useEffect, useCallback, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, EyeOff, Columns, Filter, X, Check, Trash2, FileText, Table, Table2 } from "lucide-react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    Column,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getFontSizeSubTitulo, getFontSizeTitulo } from "@/utils/fontSizes";
import { FileSpreadsheet, FileDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Card } from "../ui/card";
import { LabelCardSubTitulo } from "../labels/labelCardSubTitulo";
import { formatPercentage } from "@/utils/formatUtils";
import { cn } from "@/lib/utils";
import { LoadingCard } from "../cards/LoadingCard";
import { ErrorCard } from "../cards/ErrorCard";
import {
    DataTableProps,
    FilterState,
    CustomColumnMeta,
    AlignType,
    FilterOperator,
    FilterType,

} from "./types";
import { forwardRef } from "react";
const applyAdvancedFilter = <T,>(rowData: T, columnId: string, filter: FilterState): boolean => {
    if (!filter) return true;

    const value = (rowData as any)[columnId];
    if (value == null) return false;

    const filterType = filter.type;

    if (filterType === 'number' || filterType === 'range') {
        const numValue = Number(value);
        if (isNaN(numValue)) return false;

        const filterVal = Number(filter.value);
        const filterVal2 = filter.value2 ? Number(filter.value2) : undefined;

        switch (filter.operator) {
            case 'equals': return numValue === filterVal;
            case 'notEqual': return numValue !== filterVal;
            case 'greaterThan': return numValue > filterVal;
            case 'lessThan': return numValue < filterVal;
            case 'between':
                return filterVal2 !== undefined ? numValue >= filterVal && numValue <= filterVal2 : false;
            default: return true;
        }
    }

    if (filterType === 'date' || filterType === 'datetime') {
        const safeDateConversion = (dateValue: any): Date | null => {
            if (!dateValue) return null;
            if (dateValue instanceof Date) return dateValue;

            if (typeof dateValue === 'string') {
                if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                    const date = new Date(dateValue + 'T00:00:00');
                    return isNaN(date.getTime()) ? null : date;
                }

                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateValue)) {
                    const date = new Date(dateValue + ':00');
                    return isNaN(date.getTime()) ? null : date;
                }

                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateValue)) {
                    const date = new Date(dateValue);
                    return isNaN(date.getTime()) ? null : date;
                }
            }

            if (typeof dateValue === 'string' || typeof dateValue === 'number') {
                const date = new Date(dateValue);
                return isNaN(date.getTime()) ? null : date;
            }

            return null;
        };

        const dateValue = safeDateConversion(value);
        if (!dateValue) return false;

        const filterDate = safeDateConversion(filter.value);
        const filterDate2 = safeDateConversion(filter.value2);

        switch (filter.operator) {
            case 'equals': {
                if (!filterDate) return false;
                return dateValue.toDateString() === filterDate.toDateString();
            }
            case 'notEqual': {
                if (!filterDate) return false;
                return dateValue.toDateString() !== filterDate.toDateString();
            }
            case 'after': {
                return filterDate ? dateValue > filterDate : false;
            }
            case 'before': {
                return filterDate ? dateValue < filterDate : false;
            }
            case 'between': {
                return filterDate && filterDate2 ?
                    dateValue >= filterDate && dateValue <= filterDate2 : false;
            }
            case 'today': {
                const today = new Date();
                return dateValue.toDateString() === today.toDateString();
            }
            default: return true;
        }
    }

    if (filterType === 'time') {
        const timeToSeconds = (timeValue: any): number | null => {
            if (!timeValue) return null;
            if (typeof timeValue === 'number') return timeValue;

            if (typeof timeValue === 'string') {
                const timeParts = timeValue.split(':');
                if (timeParts.length >= 2) {
                    const hours = parseInt(timeParts[0], 10);
                    const minutes = parseInt(timeParts[1], 10);
                    const seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;

                    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
                        return hours * 3600 + minutes * 60 + seconds;
                    }
                }
            }

            if (timeValue instanceof Date) {
                return timeValue.getHours() * 3600 + timeValue.getMinutes() * 60 + timeValue.getSeconds();
            }

            return null;
        };

        const timeValueSec = timeToSeconds(value);
        if (timeValueSec === null) return false;

        const filterTimeSec = timeToSeconds(filter.value);
        const filterTimeSec2 = timeToSeconds(filter.value2);

        switch (filter.operator) {
            case 'equals':
                return filterTimeSec !== null ? timeValueSec === filterTimeSec : false;
            case 'notEqual':
                return filterTimeSec !== null ? timeValueSec !== filterTimeSec : false;
            case 'after':
            case 'greaterThan':
                return filterTimeSec !== null ? timeValueSec > filterTimeSec : false;
            case 'before':
            case 'lessThan':
                return filterTimeSec !== null ? timeValueSec < filterTimeSec : false;
            case 'between':
                return filterTimeSec !== null && filterTimeSec2 !== null ?
                    timeValueSec >= filterTimeSec && timeValueSec <= filterTimeSec2 : false;
            default:
                return true;
        }
    }

    const strValue = String(value).toLowerCase();
    const filterVal = filter.value ? String(filter.value).toLowerCase() : '';
    const filterVal2 = filter.value2 ? String(filter.value2).toLowerCase() : '';

    switch (filter.operator) {
        case 'contains': return strValue.includes(filterVal);
        case 'equals': return strValue === filterVal;
        case 'startsWith': return strValue.startsWith(filterVal);
        case 'endsWith': return strValue.endsWith(filterVal);
        case 'notContains': return !strValue.includes(filterVal);
        case 'notEqual': return strValue !== filterVal;
        case 'in': return filter.values?.includes(value) || false;
        case 'notIn': return !filter.values?.includes(value);
        default: return true;
    }
};

const alignClassMap: Record<AlignType, string> = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right'
};

const getAlignClass = (align: AlignType | undefined): string => {
    const defaultAlign: AlignType = 'left';
    const validAlign = align && ['left', 'center', 'right'].includes(align)
        ? align as AlignType
        : defaultAlign;
    return alignClassMap[validAlign];
};

export function DataTableComplete<T>({
    data,
    columns,
    titulo,
    subTitulo,
    exportacao = false,
    paginacao = false,
    tamanhoPagina = 50,
    tamanhosPagina = [10, 20, 50, 100],
    selecaoColunas = false,
    carregando = false,
    erro = false,
    rodape = false,
    navegaPagina = false,
    tipoErro,
    mensagemErro,
    compacto = false,
    filtrosExternos = [],
    onFiltrosChange,
    filtroGlobalExterno = "",
    selecaoLinha = true,
    onLinhaSelecionada,
    manterSelecaoAoClicarFora = false,
    onPaginaChange,
    paginaExterna,
    linhaSelecionadaExterna,
    buscaGlobal = true
}: DataTableProps<T>) {
    const [filtrosInternos, setFiltrosInternos] = useState<FilterState[]>([]);
    const [filtroGlobalInterno, setFiltroGlobalInterno] = useState<string>("");
    const activeFilters = filtrosExternos.length > 0 || onFiltrosChange ? filtrosExternos : filtrosInternos;
    const globalFilter = filtroGlobalExterno !== undefined ? filtroGlobalExterno : filtroGlobalInterno;
    const [filterMenuOpen, setFilterMenuOpen] = useState<string | null>(null);
    const [isFirefox, setIsFirefox] = useState(false);
    const [linhaSelecionadaId, setLinhaSelecionadaId] = useState<string | number | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { t } = useTranslation();
    const corDestaqueFinal = (isDark ? "#c2410c" : "#fed7aa");
    const corIconePadrao = isDark ? "#60a5fa" : "#3b82f6";
    const corFundoIconePadrao = isDark
        ? "rgba(96, 165, 250, 0.2)"
        : "rgba(59, 130, 246, 0.1)";
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const lblanterior = t("comum.anterior");
    const lblproximo = t("comum.proximo");
    const lblpagina = t("comum.pagina");
    const lblde = t("comum.de");
    const lblglobalfilter = t("comum.globalfilter");
    const lblitensPorPagina = t("comum.itensPorPagina");
    const lblselecionarColunas = t("comum.selecionarColunas");
    const lbltodasColunas = t("comum.todasColunas");
    const lblnenhumaColuna = t("comum.nenhumaColuna");
    const tamanhoFonteTitulo = getFontSizeTitulo(false);
    const tamanhoFonteSubTitulo = getFontSizeSubTitulo(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState<"csv" | "xls" | null>(null);
    const [fileName, setFileName] = useState(titulo);
    const [goToPageInput, setGoToPageInput] = useState("");

    const getRowId = useCallback((row: T): string | number => {
        if ((row as any).id !== undefined) return (row as any).id;
        if ((row as any).ID !== undefined) return (row as any).ID;
        if ((row as any).codigo !== undefined) return (row as any).codigo;
        if ((row as any).code !== undefined) return (row as any).code;
        if ((row as any).key !== undefined) return (row as any).key;
        if ((row as any)._id !== undefined) return (row as any)._id;
        return JSON.stringify(row);
    }, []);

    const handleSelecionarLinha = useCallback((row: T, event?: React.MouseEvent) => {
        if (!selecaoLinha) return;
        if (event) {
            event.stopPropagation();
        }
        const rowId = getRowId(row);
        if (linhaSelecionadaId === rowId && !manterSelecaoAoClicarFora) {
            setLinhaSelecionadaId(null);
            onLinhaSelecionada?.(null);
        }
        else if (linhaSelecionadaId !== rowId) {
            setLinhaSelecionadaId(rowId);
            onLinhaSelecionada?.(row);
        }
    }, [selecaoLinha, linhaSelecionadaId, onLinhaSelecionada, getRowId, manterSelecaoAoClicarFora]);

    const columnsComSelecao = React.useMemo(() => {
        if (!selecaoLinha) return columns;

        return columns.map(column => {
            const meta = column.meta as any;
            const isActionColumn = column.id === 'acoes' ||
                column.id === 'actions' ||
                column.id?.includes('acao') ||
                meta?.isAction === true;

            if (isActionColumn) {
                const originalCell = column.cell;

                return {
                    ...column,
                    cell: (props: any) => {
                        const row = props.row.original as T;
                        const originalContent = originalCell ? flexRender(originalCell, props) : null;
                        if (originalContent && typeof originalContent !== 'string') {
                            return (
                                <div
                                    className="flex items-center gap-1"
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).tagName !== 'BUTTON') {
                                            handleSelecionarLinha(row, e);
                                        }
                                    }}
                                >
                                    {originalContent}
                                </div>
                            );
                        }

                        return originalContent;
                    }
                };
            }

            return column;
        });
    }, [columns, selecaoLinha, handleSelecionarLinha]);

    const getRowStyles = useCallback((row: T) => {
        if (!selecaoLinha) return {};

        const rowId = getRowId(row);
        const isSelected = linhaSelecionadaId === rowId;

        if (!isSelected) return {};

        return {
            backgroundColor: isDark
                ? `${corDestaqueFinal}`
                : `${corDestaqueFinal}`,
            borderLeft: `3px solid ${corDestaqueFinal}`,
            position: 'relative' as const,
        };
    }, [selecaoLinha, linhaSelecionadaId, corDestaqueFinal, isDark, getRowId]);

    const updateFilters = useCallback((novosFiltros: FilterState[], novoFiltroGlobal: string) => {
        if (onFiltrosChange) {
            onFiltrosChange(novosFiltros, novoFiltroGlobal);
            paginaExterna = 1;

        } else {
            setFiltrosInternos(novosFiltros);
            setFiltroGlobalInterno(novoFiltroGlobal);
        }
    }, [onFiltrosChange]);

    const handleGlobalFilterChange = (value: string) => {
        if (onFiltrosChange) {
            onFiltrosChange(activeFilters, value);
            paginaExterna = 1;
        } else {
            setFiltroGlobalInterno(value);
        }
    };

    const addFilter = (filter: FilterState) => {
        const novosFiltros = [...activeFilters.filter(f => f.columnId !== filter.columnId), filter];
        updateFilters(novosFiltros, globalFilter);
        setFilterMenuOpen(null);
    };

    const removeFilter = (columnId: string) => {
        const novosFiltros = activeFilters.filter(f => f.columnId !== columnId);
        updateFilters(novosFiltros, globalFilter);
    };

    const clearAllFilters = () => {
        updateFilters([], "");
    };

    const filteredData = React.useMemo(() => {
        if (activeFilters.length === 0 && !globalFilter) return data;

        return data.filter((rowData) => {
            const columnFilterPass = activeFilters.every(filter => {
                return applyAdvancedFilter(rowData, filter.columnId, filter);
            });
            const globalFilterPass = !globalFilter || Object.values(rowData as any).some(value =>
                String(value ?? "").toLowerCase().includes(globalFilter.toLowerCase())
            );

            return columnFilterPass && globalFilterPass;
        });
    }, [data, activeFilters, globalFilter]);

    const table = useReactTable({
        data: filteredData,
        columns: columnsComSelecao,
        autoResetPageIndex: false,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: paginacao ? getPaginationRowModel() : undefined,
        initialState: paginacao ? {
            pagination: {
                pageSize: tamanhoPagina,
                pageIndex: 0,
            },
        } : {},
    });

    const ColumnFilter = ({
        column,
        activeFilters,
        addFilter,
        removeFilter,
        clearAllFilters,
        setFilterMenuOpen,
        getOperators,
        getDefaultOperator,
        getColumnLabel,
        formatFilterValue,
        table,
        t
    }: any) => {
        if (!column || !column.columnDef) {
            return <div className="p-3 text-xs text-gray-500">Coluna não disponível</div>;
        }

        const meta = column.columnDef.meta as CustomColumnMeta;
        const filterType = meta?.filterType || "text";
        const currentFilter = activeFilters.find((f: any) => f.columnId === column.id);
        const [localFilter, setLocalFilter] = React.useState(
            currentFilter || {
                columnId: column.id,
                type: filterType,
                operator: getDefaultOperator(filterType),
                value: "",
            }
        );

        const isBetween = localFilter.operator === "between";
        const isMultiSelect = filterType === "multiselect";
        const isSelect = filterType === "select";
        const renderFilterInput = () => {
            const isBoolean = filterType === "boolean";
            const isDate = filterType === "date" || filterType === "datetime";
            const isTime = filterType === "time";

            const specialOps = ["today"];
            const isSpecialOperator = specialOps.includes(localFilter.operator || "");

            if (isSpecialOperator) {
                return (
                    <div className="rounded text-xs p-2 bg-gray-200">
                        {localFilter.operator === "today" && "Filtrará os registros de hoje"}
                    </div>
                );
            }

            if (isBoolean) {
                return (
                    <select
                        value={localFilter.value || ""}
                        onChange={(e) =>
                            setLocalFilter({ ...localFilter, value: e.target.value === "true" })
                        }
                        className="w-full h-8 text-xs border rounded px-2"
                    >
                        <option value="">Selecione…</option>
                        <option value="true">Verdadeiro</option>
                        <option value="false">Falso</option>
                    </select>
                );
            }

            if (isSelect || isMultiSelect) {
                const options = meta?.filterOptions?.options || [];

                if (isMultiSelect) {
                    return (
                        <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
                            {options.map((opt: { label: string; value: string }) => (
                                <div key={opt.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={localFilter.values?.includes(opt.value) || false}
                                        onCheckedChange={(checked: boolean) => {
                                            const curr: string[] = localFilter.values || [];
                                            const newValues = checked
                                                ? [...curr, opt.value]
                                                : curr.filter((v: string) => v !== opt.value);

                                            setLocalFilter({ ...localFilter, values: newValues });
                                        }}
                                    />
                                    <label className="text-xs">{opt.label}</label>
                                </div>
                            ))}

                        </div>
                    );
                }

                return (
                    <select
                        value={localFilter.value || ""}
                        onChange={(e) =>
                            setLocalFilter({ ...localFilter, value: e.target.value })
                        }
                        className="w-full h-8 text-xs rounded px-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white"
                    >
                        <option value="">Selecione...</option>
                        {options.map((opt: { value: string; label: string }) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            }

            if (isDate) {
                return (
                    <div className={isBetween ? "space-y-2" : ""}>
                        <Input
                            type={filterType === "datetime" ? "datetime-local" : "date"}
                            value={localFilter.value || ""}
                            onChange={(e) =>
                                setLocalFilter({ ...localFilter, value: e.target.value })
                            }
                            className="h-8 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                        />

                        {isBetween && (
                            <Input
                                type={filterType === "datetime" ? "datetime-local" : "date"}
                                value={localFilter.value2 || ""}
                                onChange={(e) =>
                                    setLocalFilter({ ...localFilter, value2: e.target.value })
                                }
                                className="h-8 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                                placeholder="Até"
                            />
                        )}
                    </div>
                );
            }

            if (isTime) {
                return (
                    <div className={isBetween ? "space-y-2" : ""}>
                        <Input
                            type="time"
                            step="1"
                            value={localFilter.value || ""}
                            onChange={(e) =>
                                setLocalFilter({ ...localFilter, value: e.target.value })
                            }
                            className="h-8 text-sxs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                        />

                        {isBetween && (
                            <Input
                                type="time"
                                step="1"
                                value={localFilter.value2 || ""}
                                onChange={(e) =>
                                    setLocalFilter({ ...localFilter, value2: e.target.value })
                                }
                                className="h-8 text-sxs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                                placeholder="Até"
                            />
                        )}
                    </div>
                );
            }

            return (
                <div className={isBetween ? "space-y-2" : ""}>
                    <Input
                        type={filterType === "number" ? "number" : "text"}
                        value={localFilter.value || ""}
                        onChange={(e) =>
                            setLocalFilter({ ...localFilter, value: e.target.value })
                        }
                        className="h-8 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                        placeholder="Valor"
                    />

                    {isBetween && (
                        <Input
                            type={filterType === "number" ? "number" : "text"}
                            value={localFilter.value2 || ""}
                            onChange={(e) =>
                                setLocalFilter({ ...localFilter, value2: e.target.value })
                            }
                            className="h-8 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-t rounded-b"
                            placeholder="Até"
                        />
                    )}
                </div>
            );
        };

        const handleApply = () => {
            if (localFilter.operator === "today") {
                const todayStr = new Date().toISOString().split("T")[0];
                addFilter({ ...localFilter, value: todayStr });
                return;
            }

            if (localFilter.value || localFilter.value2 || localFilter.values?.length) {
                addFilter(localFilter);
            } else {
                removeFilter(column.id);
            }
        };

        return (
            <div className="bg-gray-50 dark:bg-gray-800 p-2 space-y-2 min-w-32 rounded-b rounded-t">
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm">
                        Filtrar por {getColumnLabel(column)}
                    </h4>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilterMenuOpen(null)}
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                <div>
                    <label className="text-xs font-medium">Operador</label>
                    <select
                        value={localFilter.operator}
                        onChange={(e) =>
                            setLocalFilter({
                                ...localFilter,
                                operator: e.target.value,
                            })
                        }
                        className="w-full h-8 text-xs px-2 mt-1 rounded border bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white">
                        {getOperators(filterType).map((op: any) => (
                            <option key={op.value} value={op.value}>
                                {op.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-medium">Valor</label>
                    {renderFilterInput()}
                </div>

                <div className="flex gap-2 pt-2">
                    <Button
                        onClick={handleApply}
                        size="sm"
                        className="flex-1 h-8 text-xs bg-blue-600 text-white rounded hover:bg-blue-800">
                        <Check className="h-3 w-3 mr-1" />
                        Aplicar
                    </Button>
                </div>

                {activeFilters.length > 0 && (
                    <>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-medium">Filtros ativos:</span>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearAllFilters}
                                className="h-6 text-xs"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Limpar todos
                            </Button>
                        </div>

                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {activeFilters.map((f: any) => (
                                <Badge
                                    key={f.columnId}
                                    variant="secondary"
                                    className="flex justify-between items-center w-full text-xs p-1 rounded"
                                >
                                    <span className="truncate flex-1">
                                        {getColumnLabel(table.getColumn(f.columnId)!)}:{" "}
                                        {t(`operadores.${f.operator}`)}{" "}
                                        {formatFilterValue(f, f.value)}
                                        {f.value2 &&
                                            ` e ${formatFilterValue(f, f.value2)}`}
                                    </span>

                                    <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFilter(f.columnId)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    const getDefaultOperator = (type: FilterType): FilterOperator => {
        switch (type) {
            case 'number': return 'equals';
            case 'date': return 'equals';
            case 'datetime': return 'equals';
            case 'time': return 'equals';
            case 'boolean': return 'equals';
            case 'select': return 'equals';
            case 'multiselect': return 'in';
            case 'range': return 'between';
            default: return 'contains';
        }
    };

    const getOperators = (type: FilterType) => {
        switch (type) {
            case 'text':
                return [
                    { value: 'contains', label: 'Contém' },
                    { value: 'equals', label: 'Igual a' },
                    { value: 'startsWith', label: 'Começa com' },
                    { value: 'endsWith', label: 'Termina com' },
                    { value: 'notContains', label: 'Não contém' }
                ];
            case 'number':
            case 'range':
                return [
                    { value: 'equals', label: 'Igual a' },
                    { value: 'greaterThan', label: 'Maior que' },
                    { value: 'lessThan', label: 'Menor que' },
                    { value: 'between', label: 'Entre' },
                    { value: 'notEqual', label: 'Diferente de' }
                ];
            case 'date':
            case 'datetime':
                return [
                    { value: 'equals', label: 'Igual a' },
                    { value: 'greaterThan', label: 'Maior que' },
                    { value: 'lessThan', label: 'Menor que' },
                    { value: 'between', label: 'Entre' },
                    { value: 'today', label: 'Hoje' },
                ];
            case 'boolean':
                return [{ value: 'equals', label: 'Igual a' }];
            case 'select':
                return [
                    { value: 'equals', label: 'Igual a' },
                    { value: 'notEqual', label: 'Diferente de' }
                ];
            case 'multiselect':
                return [
                    { value: 'in', label: 'Inclui' },
                    { value: 'notIn', label: 'Não inclui' }
                ];
            case 'time':
                return [
                    { value: 'equals', label: 'Igual a' },
                    { value: 'greaterThan', label: 'Maior que' },
                    { value: 'lessThan', label: 'Menor que' },
                    { value: 'between', label: 'Entre' },
                ];
            default:
                return [];
        }
    };

    function downloadFile(filename: string, content: BlobPart, type: string) {
        const blob = new Blob([content], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    const exportToCSV = (customName?: string) => {
        const allData = data;
        if (!allData?.length) return;

        const headers = table
            .getAllColumns()
            .filter((col) => (col.columnDef.meta as CustomColumnMeta)?.visible !== false)
            .map((col) => col.id);

        const rows = allData.map((row: any) => {
            return headers.map((key) => row[key]);
        });

        const csvContent =
            headers.join(";") + "\n" + rows.map((r) => r.join(";")).join("\n");

        const filename = customName
            ? customName.endsWith(".csv")
                ? customName
                : `${customName}.csv`
            : `${titulo}.csv`;

        downloadFile(filename, csvContent, "text/csv;charset=utf-8;");
    };

    const exportToXLS = (customName?: string) => {
        const allData = data;
        if (!allData?.length) return;

        const headers = table
            .getAllColumns()
            .filter((col) => (col.columnDef.meta as CustomColumnMeta)?.visible !== false)
            .map((col) => col.id);

        const rows = allData.map((row: any) =>
            headers.reduce((acc: any, key) => {
                acc[key] = row[key];
                return acc;
            }, {})
        );

        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Dados");

        const filename = customName
            ? customName.endsWith(".xlsx")
                ? customName
                : `${customName}.xlsx`
            : `${titulo}.xlsx`;

        XLSX.writeFile(wb, filename);
    };

    const showAllColumns = () => {
        table.getAllColumns().forEach(column => {
            column.toggleVisibility(true);
        });
    };

    const hideAllColumns = () => {
        table.getAllColumns().forEach(column => {
            column.toggleVisibility(false);
        });
    };

    const getColumnLabel = (column: Column<any>): string => {
        const meta = column.columnDef.meta as CustomColumnMeta;
        if (meta?.label) return meta.label;

        const header = column.columnDef.header;
        if (typeof header === 'string') return header;
        if (typeof header === 'function') {
            try {
                const context = { column };
                const result = header(context as any);
                if (typeof result === 'string') return result;
            } catch (error) {
                console.warn('Não foi possível obter o label da coluna:', column.id);
            }
        }

        return column.id;
    };

    const formatFilterValue = (filter: FilterState, value: any): string => {
        if (!value && value !== 0) return '';

        try {
            if (filter.type === 'datetime') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                    return adjustedDate.toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }

            if (filter.type === 'date') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                    return adjustedDate.toLocaleDateString('pt-BR');
                }
            }

            if (filter.type === 'time') {
                if (typeof value === 'string') {
                    if (value.includes(':')) {
                        const parts = value.split(':');
                        if (parts.length === 2) {
                            return `${value}:00`;
                        }
                        return value;
                    }
                }
                if (typeof value === 'number') {
                    const hours = Math.floor(value / 3600);
                    const minutes = Math.floor((value % 3600) / 60);
                    const seconds = value % 60;
                    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                }
            }

            if (filter.type === 'boolean') {
                return value ? 'Verdadeiro' : 'Falso';
            }

            if (Array.isArray(value)) {
                return value.join(', ');
            }
        } catch (error) {
            console.warn('Erro ao formatar valor do filtro:', error, { filter, value });
        }

        return String(value);
    };

    const calculateAggregations = (data: T[], columnId: string, aggregationType: 'sum' | 'avg' | null): string => {
        if (!aggregationType) return '';

        const columnValues = data
            .map(row => (row as any)[columnId])
            .filter(value => {
                const num = Number(value);
                return typeof num === 'number' && !isNaN(num) && isFinite(num);
            })
            .map(value => Number(value));

        if (columnValues.length === 0) return '';

        let result = 0;
        if (aggregationType === 'sum') {
            result = columnValues.reduce((acc, val) => acc + val, 0);
        } else if (aggregationType === 'avg') {
            result = columnValues.reduce((acc, val) => acc + val, 0) / columnValues.length;
        }

        if (Number.isInteger(result)) {
            return result.toLocaleString('pt-BR');
        } else {
            return result.toLocaleString('pt-BR', {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4
            });
        }
    };

    const formatAggregationValue = (value: string, aggregationType: 'sum' | 'avg' | null | undefined): string => {
        if (!value || value === '' || !aggregationType) return '';
        const prefix = aggregationType === 'sum' ? 'Total: ' : 'Média: ';

        if (aggregationType === 'avg') {
            let newValue = value.replace(",", ".");
            return `${prefix}${formatPercentage(Number(newValue), 2)}`;
        }
        else
            return `${prefix}${value}`;
    };

    useEffect(() => {
        setIsFirefox(navigator.userAgent.includes('Firefox'));
    }, [data, columns]);

    useEffect(() => {
        const headerEl = headerRef.current;
        const bodyEl = bodyRef.current;
        if (!headerEl || !bodyEl) return;

        const syncScroll = () => {
            headerEl.scrollLeft = bodyEl.scrollLeft;
        };
        bodyEl.addEventListener("scroll", syncScroll);
        return () => bodyEl.removeEventListener("scroll", syncScroll);
    }, []);

    useEffect(() => {
        if (isFirefox && table) {
            const timer = setTimeout(() => {
                const tableElement = document.querySelector('table');
                if (tableElement) {
                    tableElement.style.display = 'none';
                    tableElement.offsetHeight;
                    tableElement.style.display = '';
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [isFirefox, table, data]);

    const rowsToDisplay = paginacao ? table.getRowModel().rows : table.getRowModel().rows;

    useEffect(() => {
        if (onPaginaChange && paginacao) {
            onPaginaChange(table.getState().pagination.pageIndex + 1);
        }
    }, [table.getState().pagination.pageIndex, onPaginaChange, paginacao]);

    useEffect(() => {
        if (paginacao && paginaExterna !== undefined && paginaExterna >= 1) {
            const targetPageIndex = paginaExterna - 1;
            if (targetPageIndex !== table.getState().pagination.pageIndex &&
                targetPageIndex < table.getPageCount()) {
                table.setPageIndex(targetPageIndex);

                if (onPaginaChange) {
                    onPaginaChange(paginaExterna);
                }
            }
        }
    }, [paginaExterna, paginacao, table]);

    if (carregando) {
        return (
            <LoadingCard
                isDark={isDark}
                type="table"
            />
        );
    }

    if (erro) {
        return (
            <ErrorCard
                error={mensagemErro}
                type={tipoErro}
                showDetails={process.env.NODE_ENV === 'development'}
            />
        );
    }

    return (
        <div ref={tableRef}>
            <Card className={cn("w-full rounded-b rounded-t border transition-all duration-300 p-3", "bg-white", "dark:bg-gray-900")}>
                {compacto ? (
                    <>
                        <div className="rounded-b rounded-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <div
                                        className="p-2 rounded-b rounded-t flex items-center justify-center"
                                        style={{
                                            backgroundColor: corFundoIconePadrao,
                                            color: corIconePadrao,
                                        }}>
                                        <Table2 className="w-5 h-5" />
                                    </div>

                                    <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>
                                </div>

                                <Badge
                                    variant="secondary"
                                    className="mb-3 rounded-t rounded-b
                                        text-xs h-6 px-2 p-2
                                        bg-orange-600/10 text-orange-700
                                        dark:bg-orange-500/20 dark:text-orange-300
                                        hover:bg-orange-600/10">
                                    {subTitulo}
                                </Badge>

                                <p></p>


                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-3">
                            <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>
                            <p></p>
                            <LabelCardSubTitulo bold={false} size={tamanhoFonteSubTitulo}>
                                {subTitulo}
                            </LabelCardSubTitulo>
                        </div>

                        <div className="mt-2 w-full h-full flex items-center justify-between mb-3">
                            <div className="relative w-1/4">
                                {buscaGlobal && (
                                    <Input
                                        placeholder={lblglobalfilter}
                                        value={globalFilter}
                                        onChange={(e) => handleGlobalFilterChange(e.target.value)}
                                        className="pl-12 p-2 w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-t rounded-b"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-1">

                                {selecaoColunas && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button

                                                className="dark:bg-blue-300 dark:hover:bg-blue-200 
                                            bg-blue-100 hover:bg-blue-200 text-gray-800 text-xs font-medium py-2 px-4 rounded shadow transition"
                                            >
                                                <Columns className="w-4 h-4 mr-2" />
                                                {lblselecionarColunas}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56 max-h-80 overflow-y-auto"
                                        >
                                            <div className="px-2 py-1.5 text-xs font-semibold border-b">
                                                {lblselecionarColunas}
                                            </div>

                                            <DropdownMenuItem
                                                onClick={showAllColumns}
                                                className="text-xs cursor-pointer"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                {lbltodasColunas}
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={hideAllColumns}
                                                className="text-xs cursor-pointer"
                                            >
                                                <EyeOff className="w-4 h-4 mr-2" />
                                                {lblnenhumaColuna}
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            {table.getAllColumns().map(column => {
                                                const meta = column.columnDef.meta as CustomColumnMeta;
                                                if (meta?.visible === false) return null;

                                                return (
                                                    <DropdownMenuCheckboxItem
                                                        key={column.id}
                                                        checked={column.getIsVisible()}
                                                        onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                                                        className="text-xs cursor-pointer"
                                                    >
                                                        {getColumnLabel(column)}
                                                    </DropdownMenuCheckboxItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}

                                {exportacao && (
                                    <>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        className="bg-orange-300 dark:bg-orange-500 dark:hover:bg-orange-300 hover:bg-orange-500 text-gray-800 text-xs font-medium px-2 rounded shadow transition"
                                                        onClick={() => {
                                                            setExportType("csv");
                                                            setFileName(titulo);
                                                            setIsExportModalOpen(true);
                                                        }}
                                                    >
                                                        <FileDown size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="dark:bg-gray-800 bg-gray-300 dark:text-gray-100 text-gray-800 rounded-t rounded-b">
                                                    <p>Exportar para CSV</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>

                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        className="bg-orange-300 dark:bg-orange-500 dark:hover:bg-orange-300 hover:bg-orange-500 text-gray-800 text-xs font-medium px-2 rounded shadow transition"
                                                        onClick={() => {
                                                            setExportType("xls");
                                                            setFileName(titulo);
                                                            setIsExportModalOpen(true);
                                                        }}
                                                    >
                                                        <FileSpreadsheet size={14} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="dark:bg-gray-800 bg-gray-300 dark:text-gray-100 text-gray-800 rounded-t rounded-b">
                                                    <p>Exportar para Excel</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </>
                                )}

                                {navegaPagina && (
                                    <div className="ml-5 flex items-center gap-2 w-32">
                                        <Input

                                            min={1}
                                            value={goToPageInput}
                                            onChange={(e) => setGoToPageInput(e.target.value)}
                                            className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded"
                                            placeholder="Página"
                                        />

                                        <Button
                                            onClick={() => {
                                                const page = Number(goToPageInput);
                                                if (!isNaN(page) && page >= 1 && page <= table.getPageCount()) {
                                                    table.setPageIndex(page - 1);
                                                }
                                            }}
                                            className="h-8 w-8 text-xs rounded-b rounded-t bg-blue-600 dark:bg-blue-300"
                                        >
                                            Ir
                                        </Button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </>
                )}

                {(activeFilters.length > 0 || globalFilter) && (
                    <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-t rounded-b">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-medium">Filtros ativos:</span>
                                <div className="flex gap-1 flex-wrap">
                                    {globalFilter && (
                                        <Badge variant="outline" className="text-xs">
                                            Global: {globalFilter}
                                            <X
                                                className="h-3 w-3 ml-1 cursor-pointer"
                                                onClick={() => handleGlobalFilterChange("")}
                                            />
                                        </Badge>
                                    )}
                                    {activeFilters.map(filter => (
                                        <Badge key={filter.columnId} variant="outline" className="text-xs">
                                            {getColumnLabel(table.getColumn(filter.columnId)!)} : {" "}
                                            {t(`operadores.${filter.operator}`)} {formatFilterValue(filter, filter.value)}
                                            {filter.value2 && ` e ${formatFilterValue(filter, filter.value2)}`}
                                            <X
                                                className="h-3 w-3 ml-1 cursor-pointer"
                                                onClick={() => removeFilter(filter.columnId)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 text-xs">
                                Limpar todos
                            </Button>
                        </div>
                    </div>
                )}

                <div className={`text-xs relative border rounded-t rounded-b max-h-[600px] ${isFirefox ? 'overflow-x-auto' : 'overflow-auto'}`}>
                    <div className={isFirefox ? 'min-w-max inline-block align-middle' : 'min-w-full inline-block align-middle'}>
                        <table className={`w-full text-xs border-collapse ${isFirefox ? 'min-w-max' : 'min-w-full'}`}>
                            <thead className="text-xs sticky top-0 z-20 shadow-sm bg-blue-100 dark:bg-blue-800">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const meta = header.column.columnDef.meta as CustomColumnMeta;
                                            const visible = meta?.visible !== false && header.column.getIsVisible();

                                            if (!visible) return null;

                                            const width = meta?.width || 120;
                                            const align = meta?.align || 'left';
                                            const alignClass = getAlignClass(align);
                                            const hasFilter = activeFilters.some(f => f.columnId === header.column.id);
                                            const filterType = meta?.filterType;

                                            if (!filterType) {
                                                return (
                                                    <th
                                                        key={header.id}
                                                        className={`px-2 py-2 border-b font-semibold ${alignClass}`}
                                                        style={{
                                                            minWidth: `${width}px`,
                                                            width: `${width}px`,
                                                            position: 'sticky',
                                                            top: 0
                                                        }}
                                                    >
                                                        <div
                                                            className={`flex items-center cursor-pointer select-none ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            <span className="ml-1 text-xs">
                                                                {header.column.getIsSorted() === "asc" && "↑"}
                                                                {header.column.getIsSorted() === "desc" && "↓"}
                                                            </span>
                                                        </div>
                                                    </th>
                                                );
                                            }

                                            return (
                                                <th
                                                    key={header.id}
                                                    className={`px-2 py-2 border-b font-semibold ${alignClass}`}
                                                    style={{
                                                        minWidth: `${width}px`,
                                                        width: `${width}px`,
                                                        position: 'sticky',
                                                        top: 0
                                                    }}
                                                >
                                                    <div className={`flex items-center ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
                                                        <div
                                                            className={`flex items-center cursor-pointer select-none flex-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            <span className="ml-1 text-xs">
                                                                {header.column.getIsSorted() === "asc" && "↑"}
                                                                {header.column.getIsSorted() === "desc" && "↓"}
                                                            </span>
                                                        </div>

                                                        <DropdownMenu
                                                            open={filterMenuOpen === header.column.id}
                                                            onOpenChange={(open) => setFilterMenuOpen(open ? header.column.id : null)}
                                                        >
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    className={`dark:bg-blue-800 bg-blue-100 hover:bg-blue-200 dark:hover:bg-blue-700 rounded-t rounded-b h-5 w-5 p-0 ml-1 ${hasFilter ? 'text-blue-800 dark:text-blue-600' : 'text-blue-300'}`}
                                                                >
                                                                    <Filter className="h-3 w-3" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="start" className="w-80">
                                                                <ColumnFilter
                                                                    column={header.column}
                                                                    activeFilters={activeFilters}
                                                                    addFilter={addFilter}
                                                                    removeFilter={removeFilter}
                                                                    clearAllFilters={clearAllFilters}
                                                                    setFilterMenuOpen={setFilterMenuOpen}

                                                                    getOperators={getOperators}
                                                                    getDefaultOperator={getDefaultOperator}
                                                                    getColumnLabel={getColumnLabel}
                                                                    formatFilterValue={formatFilterValue}

                                                                    table={table}
                                                                    t={t}
                                                                />

                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {rowsToDisplay.map((row) => {
                                    const rowData = row.original as T;
                                    const rowId = getRowId(rowData);
                                    const isSelected = selecaoLinha && linhaSelecionadaId === rowId;

                                    return (
                                        <tr
                                            key={row.id}
                                            data-row-id={rowId}
                                            className={cn(
                                                "text-xs transition-all duration-150",
                                                isSelected
                                                    ? "bg-blue-50/50 dark:bg-blue-900/10"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800",
                                                selecaoLinha && "cursor-pointer"
                                            )}
                                            style={getRowStyles(rowData)}
                                            onClick={() => handleSelecionarLinha(rowData)}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                const meta = cell.column.columnDef.meta as CustomColumnMeta;
                                                const visible = meta?.visible !== false && cell.column.getIsVisible();
                                                if (!visible) return null;

                                                const align = meta?.align || 'left';
                                                const alignClass = getAlignClass(align);

                                                const isActionColumn = cell.column.id === 'acoes' ||
                                                    cell.column.id === 'actions' ||
                                                    cell.column.id?.includes('acao') ||
                                                    (meta as any)?.isAction === true;

                                                return (
                                                    <td
                                                        key={cell.id}
                                                        className={cn(
                                                            `px-2 py-2 truncate ${alignClass}`,
                                                            isActionColumn && "cursor-default"
                                                        )}
                                                        style={{
                                                            minWidth: meta?.width ? `${meta.width}px` : undefined,
                                                            width: meta?.width ? `${meta.width}px` : undefined
                                                        }}
                                                        onClick={(e) => {
                                                            if ((e.target as HTMLElement).tagName === 'BUTTON' ||
                                                                (e.target as HTMLElement).closest('button')) {
                                                                e.stopPropagation();
                                                            } else if (!isActionColumn) {
                                                                handleSelecionarLinha(rowData);
                                                            }
                                                        }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>

                            {rodape && (
                                <tfoot className="sticky bottom-0 z-10 bg-background border-t-2 border-blue-200 dark:border-blue-800">
                                    <tr className="text-xs font-semibold">
                                        {table.getAllColumns().map(column => {
                                            const meta = column.columnDef.meta as CustomColumnMeta;
                                            const visible = meta?.visible !== false && column.getIsVisible();
                                            if (!visible) return null;

                                            const width = meta?.width || 120;
                                            const align = meta?.align || 'left';
                                            const alignClass = getAlignClass(align);
                                            const aggregation = meta?.aggregation;
                                            const aggregationValue = aggregation ? calculateAggregations(filteredData, column.id, aggregation) : '';

                                            return (
                                                <td
                                                    key={`footer-${column.id}`}
                                                    style={{
                                                        minWidth: `${width}px`,
                                                        width: `${width}px`
                                                    }}
                                                    className={`px-2 py-2 font-semibold bg-blue-50 dark:bg-blue-900/20 ${alignClass}`}
                                                >
                                                    {aggregationValue ? (
                                                        <div className="font-bold text-blue-700 dark:text-blue-300">
                                                            {formatAggregationValue(aggregationValue, aggregation)}
                                                        </div>
                                                    ) : (
                                                        <div className="font-bold text-gray-400 dark:text-gray-500">—</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>

                {paginacao && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-b rounded-t">

                        {!compacto && (
                            <div className="flex items-center gap-2 text-xs">
                                <span>{lblitensPorPagina}:</span>
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        const newPageSize = Number(e.target.value);
                                        table.setPageSize(newPageSize);
                                        if (onPaginaChange) {
                                            onPaginaChange(newPageSize);
                                        }
                                    }}
                                    className="h-7 pl-2 text-xs border border-gray-300 dark:border-gray-700 
                            bg-white dark:bg-gray-700 dark:text-white rounded text-gray-700
                            focus:outline-none focus:border-gray-500">
                                    {tamanhosPagina.map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center gap-1 text-xs">
                            <span>
                                {lblpagina} {table.getState().pagination.pageIndex + 1} {lblde} {table.getPageCount()}
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Button
                                className="h-7 w-7 p-0 text-gray-100 hover:bg-blue-800 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-500 shadow transition"
                                onClick={() => {
                                    table.setPageIndex(0);
                                    if (onPaginaChange) {
                                        onPaginaChange(1);
                                    }
                                }}
                                disabled={!table.getCanPreviousPage()}>
                                <ChevronsLeft className="h-3 w-3" />
                            </Button>

                            <Button
                                className="h-7 w-7 p-0 text-gray-100 hover:bg-blue-800 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-500 shadow transition"
                                onClick={() => {
                                    table.previousPage();
                                    if (onPaginaChange) {
                                        onPaginaChange(table.getState().pagination.pageIndex);
                                    }
                                }}
                                disabled={!table.getCanPreviousPage()}>
                                <ChevronLeft className="h-3 w-3" />
                            </Button>

                            <Button
                                className="h-7 w-7 p-0 text-gray-100 hover:bg-blue-800 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-500 shadow transition"
                                onClick={() => {
                                    table.nextPage();
                                    if (onPaginaChange) {
                                        onPaginaChange(table.getState().pagination.pageIndex + 2);
                                    }
                                }}
                                disabled={!table.getCanNextPage()}>
                                <ChevronRight className="h-3 w-3" />
                            </Button>

                            <Button
                                className="h-7 w-7 p-0 text-gray-100 hover:bg-blue-800 bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-500 shadow transition"
                                onClick={() => {
                                    const lastPageIndex = table.getPageCount() - 1;
                                    table.setPageIndex(lastPageIndex);
                                    if (onPaginaChange) {
                                        onPaginaChange(lastPageIndex + 1);
                                    }
                                }}
                                disabled={!table.getCanNextPage()}>
                                <ChevronsRight className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                )}

            </Card>

            <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
                <DialogContent className="w-[90vw] max-w-md sm:max-w-lg md:max-w-xl rounded-b rounded-t border-0 bg-white dark:bg-gray-900 shadow-2xl backdrop-blur-sm dark:shadow-gray-900/50 p-0 overflow-hidden">
                    <div className="bg-blue-500 px-6 py-5">
                        <DialogHeader className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                                    {exportType === "csv" ? (
                                        <FileDown className="w-6 h-6 text-white" />
                                    ) : (
                                        <FileSpreadsheet className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <DialogTitle className="text-sm font-bold text-white tracking-tight">
                                        Exportar dados
                                    </DialogTitle>
                                    <p className="text-sm text-blue-100 font-medium">
                                        {exportType === "csv" ? "Arquivo CSV" : "Planilha Excel"}
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <LabelCardTitulo
                                    size={tamanhoFonteSubTitulo}
                                    bold={true}

                                >
                                    Nome do arquivo
                                </LabelCardTitulo>
                            </div>

                            <div className="relative">
                                <Input
                                    id="filename"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className="pl-10 pr-4 py-3 h-11 rounded-b rounded-t border-2 border-gray-200 dark:border-gray-700 
                                        bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                                        focus:border-blue-500 focus:ring-2 focus:ring-blue-500
                                        transition-all duration-200 placeholder:text-gray-400"
                                    placeholder="ex: relatorio-clientes"
                                />
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                    .
                                    {exportType === "csv" ? "csv" : "xlsx"}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 px-1">
                                A extensão {exportType === "csv" ? ".csv" : ".xlsx"} será adicionada automaticamente
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Formato selecionado
                                </span>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${exportType === "csv"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    }`}>
                                    {exportType === "csv" ? "CSV" : "Excel"}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                {exportType === "csv" ? (
                                    <>
                                        <FileText className="w-4 h-4" />
                                        <span>Compatível com Excel, Google Sheets e outros</span>
                                    </>
                                ) : (
                                    <>
                                        <Table className="w-4 h-4" />
                                        <span>Suporta múltiplas planilhas e formatação</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex-col sm:flex-row gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsExportModalOpen(false)}
                            className="rounded-b rounded-t h-11 px-5 border border-gray-300 dark:border-gray-600 
                                text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                                transition-colors duration-200 flex-1 sm:flex-none order-2 sm:order-1"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>

                        <Button
                            onClick={() => {
                                if (exportType === "csv") exportToCSV(fileName);
                                else exportToXLS(fileName);
                                setIsExportModalOpen(false);
                            }}
                            className="rounded-b rounded-t h-11 px-6 bg-blue-600 
                                hover:bg-blue-400 text-white font-medium                 
                                flex-1 sm:flex-none order-1 sm:order-2"
                        >
                            {exportType === "csv" ? (
                                <FileDown className="w-4 h-4 mr-2" />
                            ) : (
                                <FileSpreadsheet className="w-4 h-4 mr-2" />
                            )}
                            Exportar agora
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}