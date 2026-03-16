// components/filter/FilterBuilder.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Filter as FilterIcon, 
  X, 
  Save, 
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Tipos independentes
export interface FilterField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'datetime' | 'select';
  options?: string[]; // Para campos do tipo select
}

export interface FilterCondition {
  id: string;
  fieldId: string | null;
  operator: string;
  value: any;
  value2?: any; // Para operadores "between"
  values?: any[];
}

export interface FilterGroup {
  id: string;
  name?: string;
  conditions: FilterCondition[];
  logicalOperator: 'AND' | 'OR';
  isActive?: boolean;
}

export interface FilterBuilderProps {
  fields: FilterField[];
  initialFilters?: FilterGroup[];
  onFiltersChange?: (filters: FilterGroup[]) => void;
  onApply?: (filters: FilterGroup[]) => void;
  onSave?: (name: string, filters: FilterGroup[]) => void;
  onLoad?: (filters: FilterGroup[]) => void;
  title?: string;
  description?: string;
  showSQLPreview?: boolean;
  showExportOptions?: boolean;
  maxGroups?: number;
}

// Operadores por tipo de campo
const OPERATORS_BY_TYPE: Record<string, string[]> = {
  string: [
    'equals', 
    'not equals', 
    'contains', 
    'does not contain',
    'starts with', 
    'ends with', 
    'is empty', 
    'is not empty',
    'is null',
    'is not null'
  ],
  number: [
    'equals', 
    'not equals', 
    'greater than', 
    'less than', 
    'greater than or equal', 
    'less than or equal', 
    'between',
    'is null',
    'is not null'
  ],
  date: [
    'equals',
    'not equals',
    'greater than',
    'less than',
    'greater than or equal',
    'less than or equal',
    'between',
    'is null',
    'is not null',
    'is today',
    'is this week',
    'is this month',
    'is this year'
  ],
  datetime: [
    'equals',
    'not equals',
    'greater than',
    'less than',
    'between',
    'is null',
    'is not null'
  ],
  boolean: [
    'equals',
    'not equals'
  ],
  select: [
    'equals',
    'not equals',
    'in',
    'not in'
  ]
};

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  fields,
  initialFilters = [],
  onFiltersChange,
  onApply,
  onSave,
  onLoad,
  title = 'Filter Builder',
  description = 'Create and manage your data filters',
  showSQLPreview = true,
  showExportOptions = true,
  maxGroups = 10
}) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>(initialFilters);
  const [savedFilters, setSavedFilters] = useState<{ id: string; name: string; filters: FilterGroup[]; timestamp: Date }[]>([]);
  const [activeTab, setActiveTab] = useState('builder');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [importJson, setImportJson] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Carregar filtros salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('saved-filters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Salvar filtros no localStorage
  const saveToLocalStorage = (filters: typeof savedFilters) => {
    localStorage.setItem('saved-filters', JSON.stringify(filters));
  };

  // Adicionar novo grupo de filtros
  const addFilterGroup = () => {
    if (filterGroups.length >= maxGroups) {
      alert(`Maximum ${maxGroups} filter groups allowed`);
      return;
    }

    const newGroup: FilterGroup = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Filter Group ${filterGroups.length + 1}`,
      conditions: [],
      logicalOperator: 'AND',
      isActive: true
    };
    
    const updatedGroups = [...filterGroups, newGroup];
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Remover grupo de filtros
  const removeFilterGroup = (groupId: string) => {
    const updatedGroups = filterGroups.filter(group => group.id !== groupId);
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Toggle grupo ativo/inativo
  const toggleGroupActive = (groupId: string) => {
    const updatedGroups = filterGroups.map(group => 
      group.id === groupId ? { ...group, isActive: !group.isActive } : group
    );
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Adicionar condição ao grupo
  const addCondition = (groupId: string) => {
    const updatedGroups = filterGroups.map(group => {
      if (group.id === groupId) {
        const newCondition: FilterCondition = {
          id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fieldId: fields.length > 0 ? fields[0].id : null,
          operator: 'equals',
          value: '',
        };
        return {
          ...group,
          conditions: [...group.conditions, newCondition],
        };
      }
      return group;
    });
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Remover condição
  const removeCondition = (groupId: string, conditionId: string) => {
    const updatedGroups = filterGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.filter(cond => cond.id !== conditionId),
        };
      }
      return group;
    });
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Atualizar condição
  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    const updatedGroups = filterGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          conditions: group.conditions.map(cond =>
            cond.id === conditionId ? { ...cond, ...updates } : cond
          ),
        };
      }
      return group;
    });
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Atualizar operador lógico do grupo
  const updateGroupOperator = (groupId: string, operator: 'AND' | 'OR') => {
    const updatedGroups = filterGroups.map(group =>
      group.id === groupId ? { ...group, logicalOperator: operator } : group
    );
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Atualizar nome do grupo
  const updateGroupName = (groupId: string, name: string) => {
    const updatedGroups = filterGroups.map(group =>
      group.id === groupId ? { ...group, name } : group
    );
    setFilterGroups(updatedGroups);
    onFiltersChange?.(updatedGroups);
  };

  // Aplicar filtros
  const handleApply = () => {
    const activeFilters = filterGroups.filter(group => group.isActive !== false);
    onApply?.(activeFilters);
  };

  // Salvar filtros
  const handleSave = () => {
    if (!filterName.trim()) {
      alert('Please enter a name for your filter');
      return;
    }

    const newSavedFilter = {
      id: `saved-${Date.now()}`,
      name: filterName,
      filters: [...filterGroups],
      timestamp: new Date()
    };
    
    const updatedSaved = [...savedFilters, newSavedFilter];
    setSavedFilters(updatedSaved);
    saveToLocalStorage(updatedSaved);
    onSave?.(filterName, filterGroups);
    
    setFilterName('');
    setShowSaveDialog(false);
  };

  // Carregar filtros salvos
  const loadSavedFilter = (savedFilterId: string) => {
    const savedFilter = savedFilters.find(f => f.id === savedFilterId);
    if (savedFilter) {
      setFilterGroups([...savedFilter.filters]);
      onFiltersChange?.([...savedFilter.filters]);
      onLoad?.([...savedFilter.filters]);
    }
  };

  // Exportar filtros como JSON
  const exportFilters = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      filters: filterGroups
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `filters-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Importar filtros de JSON
  const importFilters = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed.filters && Array.isArray(parsed.filters)) {
        setFilterGroups(parsed.filters);
        onFiltersChange?.(parsed.filters);
        setImportJson('');
        alert('Filters imported successfully!');
      } else {
        alert('Invalid JSON format. Expected "filters" array.');
      }
    } catch (error) {
      alert('Error parsing JSON: ' + error);
    }
  };

  // Copiar SQL para clipboard
  const copySQLToClipboard = () => {
    const sql = generateSQLWhereClause(filterGroups);
    navigator.clipboard.writeText(sql).then(() => {
      alert('SQL copied to clipboard!');
    });
  };

  // Obter campo pelo ID
  const getFieldById = (fieldId: string | null) => {
    return fields.find(f => f.id === fieldId);
  };

  // Obter operadores para um campo
  const getOperatorsForField = (fieldId: string | null) => {
    const field = getFieldById(fieldId);
    if (!field) return [];
    return OPERATORS_BY_TYPE[field.type] || [];
  };

  // Renderizar input de valor baseado no tipo de campo
  const renderValueInput = (
    condition: FilterCondition,
    onChange: (value: any) => void,
    onValue2Change?: (value: any) => void
  ) => {
    const field = getFieldById(condition.fieldId);
    if (!field) return null;

    // Operadores que não precisam de valor
    const noValueOperators = ['is null', 'is not null', 'is empty', 'is not empty', 'is today', 'is this week', 'is this month', 'is this year'];
    if (noValueOperators.includes(condition.operator)) {
      return null;
    }

    switch (field.type) {
      case 'boolean':
        return (
          <Select
            value={condition.value?.toString()}
            onValueChange={(value) => onChange(value === 'true')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'number':
        if (condition.operator === 'between') {
          return (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="From"
                value={condition.value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
              />
              <span className="text-gray-500 text-sm">to</span>
              <Input
                type="number"
                placeholder="To"
                value={condition.value2 || ''}
                onChange={(e) => onValue2Change?.(e.target.value)}
                className="w-full"
              />
            </div>
          );
        }
        return (
          <Input
            type="number"
            value={condition.value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case 'date':
      case 'datetime':
        if (condition.operator === 'between') {
          return (
            <div className="flex items-center gap-2">
              <Input
                type={field.type === 'datetime' ? 'datetime-local' : 'date'}
                value={condition.value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full"
              />
              <span className="text-gray-500 text-sm">to</span>
              <Input
                type={field.type === 'datetime' ? 'datetime-local' : 'date'}
                value={condition.value2 || ''}
                onChange={(e) => onValue2Change?.(e.target.value)}
                className="w-full"
              />
            </div>
          );
        }
        return (
          <Input
            type={field.type === 'datetime' ? 'datetime-local' : 'date'}
            value={condition.value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
        );

      case 'select':
        if (!field.options) return null;
        
        if (condition.operator === 'in' || condition.operator === 'not in') {
          // Múltipla seleção
          const selectedValues = Array.isArray(condition.value) ? condition.value : [];
          return (
            <Select
              value={selectedValues[0] || ''}
              onValueChange={(value) => {
                const newValues = selectedValues.includes(value)
                  ? selectedValues.filter(v => v !== value)
                  : [...selectedValues, value];
                onChange(newValues);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Selected (${selectedValues.length})`} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        
        return (
          <Select
            value={condition.value || ''}
            onValueChange={onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default: // string
        return (
          <Input
            value={condition.value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter value"
            className="w-full"
          />
        );
    }
  };

  // Gerar SQL WHERE clause
  const generateSQLWhereClause = (groups: FilterGroup[]): string => {
    const activeGroups = groups.filter(group => group.isActive !== false);
    
    if (activeGroups.length === 0) {
      return '-- No active filters\n-- Add filters to see SQL preview';
    }

    const groupsSQL = activeGroups.map(group => {
      if (group.conditions.length === 0) return '1 = 1';

      const conditionsSQL = group.conditions.map(condition => {
        const field = getFieldById(condition.fieldId);
        if (!field) return '1 = 1';

        const fieldName = field.name;
        const operator = condition.operator;
        const value = condition.value;

        switch (operator) {
          case 'equals':
            return field.type === 'string' || field.type === 'select'
              ? `${fieldName} = '${value}'`
              : `${fieldName} = ${value}`;
          
          case 'not equals':
            return field.type === 'string' || field.type === 'select'
              ? `${fieldName} != '${value}'`
              : `${fieldName} != ${value}`;
          
          case 'contains':
            return `${fieldName} LIKE '%${value}%'`;
          
          case 'does not contain':
            return `${fieldName} NOT LIKE '%${value}%'`;
          
          case 'starts with':
            return `${fieldName} LIKE '${value}%'`;
          
          case 'ends with':
            return `${fieldName} LIKE '%${value}'`;
          
          case 'greater than':
            return field.type === 'string'
              ? `${fieldName} > '${value}'`
              : `${fieldName} > ${value}`;
          
          case 'less than':
            return field.type === 'string'
              ? `${fieldName} < '${value}'`
              : `${fieldName} < ${value}`;
          
          case 'greater than or equal':
            return field.type === 'string'
              ? `${fieldName} >= '${value}'`
              : `${fieldName} >= ${value}`;
          
          case 'less than or equal':
            return field.type === 'string'
              ? `${fieldName} <= '${value}'`
              : `${fieldName} <= ${value}`;
          
          case 'between':
            return `${fieldName} BETWEEN ${value} AND ${condition.value2}`;
          
          case 'in':
            const inValues = Array.isArray(value) ? value : [value];
            return `${fieldName} IN (${inValues.map(v => `'${v}'`).join(', ')})`;
          
          case 'not in':
            const notInValues = Array.isArray(value) ? value : [value];
            return `${fieldName} NOT IN (${notInValues.map(v => `'${v}'`).join(', ')})`;
          
          case 'is null':
            return `${fieldName} IS NULL`;
          
          case 'is not null':
            return `${fieldName} IS NOT NULL`;
          
          case 'is empty':
            return `(${fieldName} IS NULL OR ${fieldName} = '')`;
          
          case 'is not empty':
            return `(${fieldName} IS NOT NULL AND ${fieldName} != '')`;
          
          case 'is today':
            return `${fieldName} = CURDATE()`;
          
          case 'is this week':
            return `YEARWEEK(${fieldName}) = YEARWEEK(CURDATE())`;
          
          case 'is this month':
            return `MONTH(${fieldName}) = MONTH(CURDATE()) AND YEAR(${fieldName}) = YEAR(CURDATE())`;
          
          case 'is this year':
            return `YEAR(${fieldName}) = YEAR(CURDATE())`;
          
          default:
            return '1 = 1';
        }
      }).join(` ${group.logicalOperator} `);

      return group.conditions.length > 1 ? `(${conditionsSQL})` : conditionsSQL;
    });

    return `WHERE ${groupsSQL.join(' AND\n      ')}`;
  };

  // Contar filtros ativos
  const activeFilterCount = filterGroups.filter(g => g.isActive !== false).reduce(
    (total, group) => total + group.conditions.length, 
    0
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-gray-600 mt-1">{description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          
          {showExportOptions && (
            <Button
              variant="outline"
              size="sm"
              onClick={exportFilters}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          
          <Button
            onClick={handleApply}
            disabled={activeFilterCount === 0}
          >
            Apply Filters ({activeFilterCount})
          </Button>
        </div>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="builder">Filter Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Filters</TabsTrigger>
          <TabsTrigger value="import">Import/Export</TabsTrigger>
        </TabsList>

        {/* Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          {/* Campos disponíveis */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Available Fields</CardTitle>
              <CardDescription>
                {fields.length} field{fields.length !== 1 ? 's' : ''} available for filtering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {fields.map(field => (
                  <Badge
                    key={field.id}
                    variant="outline"
                    className={`${
                      field.type === 'string' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      field.type === 'number' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      field.type === 'date' || field.type === 'datetime' ? 'bg-green-50 text-green-700 border-green-200' :
                      field.type === 'boolean' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {field.name}
                    <span className="ml-1 text-xs opacity-75">({field.type})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grupos de Filtros */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filter Groups</h3>
              <Button
                onClick={addFilterGroup}
                disabled={filterGroups.length >= maxGroups}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Group ({filterGroups.length}/{maxGroups})
              </Button>
            </div>

            {filterGroups.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FilterIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No filter groups yet</h4>
                  <p className="text-gray-500 mb-4">Start by creating your first filter group</p>
                  <Button onClick={addFilterGroup}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Filter Group
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filterGroups.map((group, groupIndex) => (
                  <Card key={group.id} className={`${group.isActive === false ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleGroupActive(group.id)}
                            className={`h-8 w-8 p-0 rounded-full ${
                              group.isActive === false 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {group.isActive === false ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <FilterIcon className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Input
                            value={group.name || `Filter Group ${groupIndex + 1}`}
                            onChange={(e) => updateGroupName(group.id, e.target.value)}
                            className="font-medium border-none p-0 h-auto focus:ring-0"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Select
                            value={group.logicalOperator}
                            onValueChange={(value: 'AND' | 'OR') => updateGroupOperator(group.id, value)}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">AND</SelectItem>
                              <SelectItem value="OR">OR</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFilterGroup(group.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {group.conditions.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">
                          <p>No conditions in this group</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addCondition(group.id)}
                            className="mt-2"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add First Condition
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {group.conditions.map((condition, condIndex) => {
                            const field = getFieldById(condition.fieldId);
                            return (
                              <div key={condition.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                                  {/* Campo */}
                                  <div className="md:col-span-3">
                                    <Label className="text-xs mb-1 block">Field</Label>
                                    <Select
                                      value={condition.fieldId || ''}
                                      onValueChange={(fieldId) => {
                                        const newField = fields.find(f => f.id === fieldId);
                                        updateCondition(group.id, condition.id, { 
                                          fieldId,
                                          operator: newField ? OPERATORS_BY_TYPE[newField.type]?.[0] || 'equals' : 'equals',
                                          value: ''
                                        });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select field" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {fields.map((field) => (
                                          <SelectItem key={field.id} value={field.id}>
                                            <div className="flex items-center gap-2">
                                              <Badge
                                                variant="outline"
                                                className={`text-xs ${
                                                  field.type === 'string' ? 'bg-purple-50' :
                                                  field.type === 'number' ? 'bg-blue-50' :
                                                  field.type === 'date' ? 'bg-green-50' :
                                                  field.type === 'boolean' ? 'bg-yellow-50' :
                                                  'bg-gray-50'
                                                }`}
                                              >
                                                {field.type}
                                              </Badge>
                                              {field.name}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Operador */}
                                  <div className="md:col-span-3">
                                    <Label className="text-xs mb-1 block">Operator</Label>
                                    <Select
                                      value={condition.operator}
                                      onValueChange={(operator) =>
                                        updateCondition(group.id, condition.id, { operator })
                                      }
                                      disabled={!condition.fieldId}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select operator" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {getOperatorsForField(condition.fieldId).map((op) => (
                                          <SelectItem key={op} value={op}>
                                            {op}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Valor */}
                                  <div className="md:col-span-4">
                                    <Label className="text-xs mb-1 block">Value</Label>
                                    {renderValueInput(
                                      condition,
                                      (value) => updateCondition(group.id, condition.id, { value }),
                                      (value2) => updateCondition(group.id, condition.id, { value2 })
                                    )}
                                  </div>

                                  {/* Número da condição */}
                                  <div className="md:col-span-2 flex items-end">
                                    <span className="text-xs text-gray-500">
                                      Condition {condIndex + 1}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCondition(group.id, condition.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 mt-6"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addCondition(group.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Condition
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Saved Filters Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Filters</CardTitle>
              <CardDescription>
                Load previously saved filter configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedFilters.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Save className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No saved filters yet</p>
                  <p className="text-sm mt-1">Save your current filters to see them here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedFilters.map((savedFilter) => (
                    <div
                      key={savedFilter.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <h4 className="font-medium">{savedFilter.name}</h4>
                        <p className="text-sm text-gray-500">
                          {savedFilter.filters.length} group{savedFilter.filters.length !== 1 ? 's' : ''} • 
                          {savedFilter.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => loadSavedFilter(savedFilter.id)}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newSaved = savedFilters.filter(f => f.id !== savedFilter.id);
                            setSavedFilters(newSaved);
                            saveToLocalStorage(newSaved);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Current Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Save Current Filters</CardTitle>
              <CardDescription>
                Save your current filter configuration for later use
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Enter filter name"
                  className="flex-1"
                />
                <Button onClick={handleSave} disabled={!filterName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import/Export Tab */}
        <TabsContent value="import" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export */}
            <Card>
              <CardHeader>
                <CardTitle>Export Filters</CardTitle>
                <CardDescription>
                  Export your current filters as JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={JSON.stringify(filterGroups, null, 2)}
                  readOnly
                  className="h-48 font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={copySQLToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy SQL
                  </Button>
                  <Button onClick={exportFilters} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Import */}
            <Card>
              <CardHeader>
                <CardTitle>Import Filters</CardTitle>
                <CardDescription>
                  Import filters from JSON
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder='Paste JSON here (should contain "filters" array)'
                  className="h-48 font-mono text-sm"
                />
                <Button onClick={importFilters} className="w-full" disabled={!importJson.trim()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Filters
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* SQL Preview */}
      {showSQLPreview && showPreview && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>SQL Preview</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={copySQLToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy SQL
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
              {generateSQLWhereClause(filterGroups)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{filterGroups.length}</div>
              <div className="text-sm text-gray-500">Filter Groups</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{activeFilterCount}</div>
              <div className="text-sm text-gray-500">Active Conditions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {filterGroups.filter(g => g.isActive !== false).length}
              </div>
              <div className="text-sm text-gray-500">Active Groups</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{savedFilters.length}</div>
              <div className="text-sm text-gray-500">Saved Filters</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};