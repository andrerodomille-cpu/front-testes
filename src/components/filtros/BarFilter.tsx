import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronRight, Filter, X, Search, Calendar, Trash2, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LabelCardTitulo } from "../labels/labelCardTitulo";

interface FilterBarProps {
    datasets: any[][]; // Agora é um array de datasets
    datasetNames?: string[]; // Nomes opcionais para identificar cada dataset
    fields: string[];
    onFilter: (filteredDatasets: any[][]) => void; // Retorna array de datasets filtrados
    className?: string;
    defaultExpanded?: boolean;
}

export default function BarFilter({
    datasets,
    datasetNames = [],
    fields,
    onFilter,
    className,
    defaultExpanded = true
}: FilterBarProps) {
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
    const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
    const [openPopover, setOpenPopover] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const { t } = useTranslation();

    const [headerColor, setHeaderColor] = useState<string>("");

    // 🔹 Verifica quais campos existem em cada dataset
    const fieldExistence = useMemo(() => {
        return datasets.map(dataset => {
            if (dataset.length === 0) return {};
            
            // Pega todas as chaves do primeiro item do dataset
            const firstItem = dataset[0];
            const existingFields = new Set(Object.keys(firstItem));
            
            // Cria um mapa de campo -> booleano
            const fieldMap: Record<string, boolean> = {};
            fields.forEach(field => {
                fieldMap[field] = existingFields.has(field);
            });
            
            return fieldMap;
        });
    }, [datasets, fields]);

    // 🔹 Gera opções únicas combinando todos os datasets (apenas para campos que existem)
    const fieldOptions = useMemo(() => {
        const options: Record<string, string[]> = {};

        fields.forEach((field) => {
            // Coleta valores únicos apenas de datasets que têm este campo
            const allValues = datasets.flatMap((dataset, index) => {
                // Verifica se este dataset tem o campo
                if (fieldExistence[index][field]) {
                    return dataset
                        .map((item) => item[field])
                        .filter((value) => value !== null && value !== undefined)
                        .map((value) => String(value));
                }
                return []; // Dataset não tem este campo, ignora
            });
            
            if (allValues.length > 0) {
                const uniqueValues = [...new Set(allValues)];
                options[field] = uniqueValues.sort();
            } else {
                options[field] = []; // Nenhum dataset tem este campo
            }
        });

        return options;
    }, [datasets, fields, fieldExistence]);

    // 🔹 Verifica se um campo existe em pelo menos um dataset
    const fieldExists = useMemo(() => {
        const existence: Record<string, boolean> = {};
        fields.forEach(field => {
            existence[field] = fieldExistence.some(ex => ex[field]);
        });
        return existence;
    }, [fields, fieldExistence]);

    // 🔹 Filtra opções baseado no termo de busca
    const getFilteredOptions = (field: string) => {
        const searchTerm = searchTerms[field]?.toLowerCase() || "";
        if (!searchTerm) return fieldOptions[field] || [];

        return (fieldOptions[field] || []).filter(option =>
            option.toLowerCase().includes(searchTerm)
        );
    };

    // 🔹 Aplica filtros em todos os datasets (apenas se o campo existir no dataset)
    useEffect(() => {
        // Filtra cada dataset individualmente
        const filteredDatasets = datasets.map((dataset, datasetIndex) => {
            let filtered = [...dataset];

            Object.entries(activeFilters).forEach(([field, values]) => {
                if (values.length > 0) {
                    // Verifica se este campo existe neste dataset específico
                    if (fieldExistence[datasetIndex][field]) {
                        filtered = filtered.filter((item) => {
                            const itemValue = String(item[field]).toLowerCase();
                            return values.some(value =>
                                itemValue.includes(value.toLowerCase())
                            );
                        });
                    }
                    // Se o campo não existe neste dataset, mantém todos os itens (não filtra)
                }
            });

            return filtered;
        });

        onFilter(filteredDatasets);
    }, [activeFilters, datasets, onFilter, fieldExistence]);

    function handleSelect(field: string, value: string) {
        setActiveFilters((prev) => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [field]: newValues
            };
        });
    }

    function removeFilter(field: string, value?: string) {
        setActiveFilters((prev) => {
            if (value) {
                // Remove um valor específico
                const currentValues = prev[field] || [];
                const newValues = currentValues.filter(v => v !== value);

                if (newValues.length === 0) {
                    const { [field]: _, ...rest } = prev;
                    return rest;
                }

                return {
                    ...prev,
                    [field]: newValues
                };
            } else {
                // Remove todos os valores do campo
                const { [field]: _, ...rest } = prev;
                return rest;
            }
        });
    }

    function clearAll() {
        setActiveFilters({});
        setSearchTerms({});
    }

    useEffect(() => {
        const savedColor = localStorage.getItem("headerColor");
        if (savedColor) {
            setHeaderColor(savedColor);
        }
    }, []);

    const getPrimaryColor = () => {
        if (headerColor.includes('from-')) {
            const match = headerColor.match(/from-([^\s]+)/);
            return match ? match[1].split('-')[1] || 'blue' : 'blue';
        }
        return 'blue';
    };

    const primaryColor = getPrimaryColor();

    const totalActiveFilters = Object.values(activeFilters).reduce(
        (acc, values) => acc + values.length,
        0
    );

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    // Calcula estatísticas para mostrar informações sobre os datasets
    const datasetStats = useMemo(() => {
        return datasets.map((dataset, index) => ({
            name: datasetNames[index] || `Dataset ${index + 1}`,
            total: dataset.length,
            filtered: dataset.length // Será atualizado pelo useEffect
        }));
    }, [datasets, datasetNames]);

    // Filtra apenas campos que existem em pelo menos um dataset
    const availableFields = useMemo(() => {
        return fields.filter(field => fieldExists[field]);
    }, [fields, fieldExists]);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between p-1" onClick={toggleExpanded}>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className={`h-4 w-4 text-${primaryColor}-500`} />
                        <LabelCardTitulo bold={false}>
                            {t("comum.filtrospersonalizados")}
                        </LabelCardTitulo>
                    </div>
                </div>

                {totalActiveFilters > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            clearAll();
                        }}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Limpar tudo
                    </Button>
                )}
            </div>

            {/* Conteúdo expansível */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-1 pt-0">
                            {/* Informações dos datasets */}
                            {datasets.length > 1 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-3 p-2 bg-muted/30 rounded-lg text-xs"
                                >
                                    <div className="flex flex-wrap gap-3">
                                        {datasetStats.map((stat, idx) => (
                                            <Badge key={idx} variant="outline" className="bg-background">
                                                <span className="font-medium">{stat.name}:</span>
                                                <span className="ml-1 text-muted-foreground">{stat.total} registros</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Filtros - apenas campos que existem em pelo menos um dataset */}
                            {availableFields.length > 0 ? (
                                <div className="flex flex-wrap gap-2 rounded-t rounded-b">
                                    {availableFields.map((field) => (
                                        <Popover
                                            key={field}
                                            open={openPopover === field}
                                            onOpenChange={(open) => setOpenPopover(open ? field : null)}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    className={cn(
                                                        "rounded-t rounded-b transition-colors",
                                                        activeFilters[field]?.length
                                                            ? "bg-blue-900 text-blue-200 border-blue-200 hover:bg-blue-900"
                                                            : "bg-transparent border text-gray-800 dark:text-gray-100 hover:bg-blue-900"
                                                    )}
                                                >
                                                    <span>{field.replace(/_/g, " ")}</span>
                                                    {activeFilters[field]?.length > 0 && (
                                                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-orange-500 rounded-full">
                                                            {activeFilters[field].length}
                                                        </Badge>
                                                    )}
                                                    <ChevronDown className="ml-1 w-3 h-3 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-64 p-2 rounded-b rounded-t" align="start">
                                                <div className="space-y-2">
                                                    {/* Busca */}
                                                    <div className="relative">
                                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Buscar..."
                                                            value={searchTerms[field] || ""}
                                                            onChange={(e) => setSearchTerms(prev => ({
                                                                ...prev,
                                                                [field]: e.target.value
                                                            }))}
                                                            className="rounded-b rounded-t pl-8 h-9"
                                                        />
                                                    </div>

                                                    {/* Lista de opções */}
                                                    <div className="max-h-60 overflow-y-auto space-y-1">
                                                        {getFilteredOptions(field).map((option, index) => {
                                                            const isSelected = activeFilters[field]?.includes(option);

                                                            return (
                                                                <motion.div
                                                                    key={option}
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.03 }}
                                                                    className={cn(
                                                                        "flex items-center justify-between px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors",
                                                                        isSelected
                                                                            ? "bg-primary/10 text-primary"
                                                                            : "hover:bg-muted"
                                                                    )}
                                                                    onClick={() => handleSelect(field, option)}
                                                                >
                                                                    <span className="truncate flex-1">{option}</span>
                                                                    {isSelected && (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                        >
                                                                            <Check className="w-4 h-4 ml-2 flex-shrink-0" />
                                                                        </motion.div>
                                                                    )}
                                                                </motion.div>
                                                            );
                                                        })}

                                                        {getFilteredOptions(field).length === 0 && (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="text-center py-6 text-sm text-muted-foreground"
                                                            >
                                                                Nenhuma opção encontrada
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground p-2 text-center">
                                    Nenhum campo disponível para filtro nos datasets atuais
                                </div>
                            )}

                            {/* Badges ativos */}
                            <AnimatePresence>
                                {totalActiveFilters > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mt-2 flex flex-wrap gap-2 pt-2 border-t"
                                    >
                                        {Object.entries(activeFilters).map(([field, values]) => (
                                            values.map((value, index) => (
                                                <motion.div
                                                    key={`${field}-${value}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-orange-600 text-blue-200 border flex items-center gap-1 px-3 py-1 rounded-full text-sm group"
                                                    >
                                                        <span className="font-medium">{field.replace(/_/g, " ")}:</span>
                                                        <span className="max-w-[150px] truncate">{value}</span>
                                                        
                                                            <Trash
                                                                className="w-5 h-5 ml-2 cursor-pointer opacity-50 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    removeFilter(field, value);
                                                                }}
                                                            />
                                                        
                                                    </Badge>
                                                </motion.div>
                                            ))
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}