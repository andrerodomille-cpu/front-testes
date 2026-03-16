// components/filtros/ReusableFilter.tsx
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface FilterComponentProps<T> {
  data: T[];
  filterFields: (keyof T)[];
  onFilterChange: (filteredData: T[], activeFilters: FilterState<T>) => void;
  title?: string;
  showSearch?: boolean;
}

interface FilterState<T> {
  [key: string]: string[];
}

interface FilterOption {
  field: string;
  value: string;
  count: number;
}

export function ReusableFilter<T extends Record<string, any>>({
  data,
  filterFields,
  onFilterChange,
  title = 'Filtros',
  showSearch = true
}: FilterComponentProps<T>) {
  const [filters, setFilters] = useState<FilterState<T>>({});
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

  // Extrair valores distintos para cada campo de filtro
  useEffect(() => {
    const options: FilterOption[] = [];

    filterFields.forEach(field => {
      const fieldStr = field as string;
      const values = data.map(item => item[fieldStr]);
      const uniqueValues = Array.from(new Set(values.filter(val => 
        val != null && val !== '' && String(val).trim() !== ''
      )));

      uniqueValues.forEach(value => {
        const count = data.filter(item => item[fieldStr] === value).length;
        options.push({
          field: fieldStr,
          value: String(value),
          count
        });
      });
    });

    setFilterOptions(options);
  }, [data, filterFields]);

  // Aplicar filtros sempre que eles mudarem
  useEffect(() => {
    const filteredData = applyFilters();
    onFilterChange(filteredData, filters);
  }, [filters, data]);

  const handleFilterToggle = (field: string, value: string) => {
    setFilters(prev => {
      const currentFieldFilters = prev[field] || [];
      const isSelected = currentFieldFilters.includes(value);

      if (isSelected) {
        // Remover filtro
        const newFieldFilters = currentFieldFilters.filter(v => v !== value);
        if (newFieldFilters.length === 0) {
          const { [field]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [field]: newFieldFilters };
      } else {
        // Adicionar filtro
        return { ...prev, [field]: [...currentFieldFilters, value] };
      }
    });
  };

  const clearFilter = (field: string, value?: string) => {
    if (value) {
      // Limpar valor específico
      handleFilterToggle(field, value);
    } else {
      // Limpar campo inteiro
      setFilters(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const applyFilters = (): T[] => {
    if (Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.entries(filters).every(([field, selectedValues]) => {
        if (selectedValues.length === 0) return true;
        const itemValue = String(item[field]);
        return selectedValues.includes(itemValue);
      });
    });
  };

  const getFieldOptions = (field: string) => {
    return filterOptions.filter(option => option.field === field);
  };

  const isFilterActive = (field: string, value: string) => {
    return filters[field]?.includes(value) || false;
  };

  const toggleFieldExpansion = (field: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  // Agrupar opções por campo e filtrar pela busca
  const groupedOptions = filterFields.reduce((acc, field) => {
    const fieldStr = field as string;
    const options = getFieldOptions(fieldStr);
    
    // Filtrar opções pelo termo de busca
    const filteredOptions = searchTerm
      ? options.filter(option => 
          option.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fieldStr.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    if (filteredOptions.length > 0) {
      acc[fieldStr] = filteredOptions;
    }

    return acc;
  }, {} as Record<string, FilterOption[]>);

  // Contar filtros ativos
  const activeFilterCount = Object.values(filters).reduce(
    (total, values) => total + values.length, 0
  );

  return (
    <div className="space-y-4">
      {/* Barra de busca */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar filtros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Filtros ativos */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Filtros aplicados:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-6 text-xs"
            >
              Limpar tudo
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([field, values]) =>
              values.map(value => (
                <Badge
                  key={`${field}-${value}`}
                  variant="secondary"
                  className="gap-1 pl-2 pr-1 py-1"
                >
                  <span className="text-xs">
                    <span className="font-medium capitalize">
                      {field.replace('_', ' ')}:
                    </span> {value}
                  </span>
                  <button
                    onClick={() => clearFilter(field, value)}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>
      )}

      {/* Opções de filtro */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {Object.entries(groupedOptions).map(([field, options]) => {
          const isExpanded = expandedFields.has(field) || options.length <= 10;
          const displayOptions = isExpanded ? options : options.slice(0, 5);
          const hasMoreOptions = options.length > 5 && !isExpanded;

          return (
            <div key={field} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium capitalize">
                  {field.replace('_', ' ')}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {options.length}
                  </Badge>
                </Label>
                <div className="flex items-center gap-2">
                  {filters[field] && filters[field].length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => clearFilter(field)}
                      className="h-6 text-xs"
                    >
                      Limpar
                    </Button>
                  )}
                  {options.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFieldExpansion(field)}
                      className="h-6 text-xs"
                    >
                      {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                {displayOptions.map(option => (
                  <div
                    key={`${field}-${option.value}`}
                    className="flex items-center justify-between space-x-2 p-2 hover:bg-muted/50 rounded-md transition-colors"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox
                        id={`${field}-${option.value}`}
                        checked={isFilterActive(field, option.value)}
                        onCheckedChange={() => handleFilterToggle(field, option.value)}
                      />
                      <Label
                        htmlFor={`${field}-${option.value}`}
                        className="text-sm font-normal cursor-pointer flex-1 truncate"
                        title={option.value}
                      >
                        {option.value}
                      </Label>
                    </div>
                    <Badge variant="outline" className="text-xs min-w-[2rem] justify-center">
                      {option.count}
                    </Badge>
                  </div>
                ))}
                
                {hasMoreOptions && (
                  <div className="text-center pt-1">
                    <span className="text-xs text-muted-foreground">
                      +{options.length - 5} opções
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      {activeFilterCount > 0 && (
        <div className="text-sm text-muted-foreground pt-2 border-t">
          {activeFilterCount} filtro(s) aplicado(s)
        </div>
      )}
    </div>
  );
}