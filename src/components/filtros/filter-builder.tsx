// components/filter-builder.tsx
"use client"

import { useState, useEffect } from 'react'
import { 
  Filter, 
  X, 
  Plus, 
  ChevronDown, 
  Calendar, 
  Clock, 
  Hash, 
  Tag, 
  Package,
  DollarSign,
  Building,
  Camera,
  Layers,
  BarChart3,
  FileText,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export type FilterCondition = {
  id: string
  field: string
  operator: string
  value: any
  value2?: any
}

export type FilterGroup = {
  id: string
  conditions: FilterCondition[]
  logicalOperator: 'AND' | 'OR'
  isActive?: boolean
}

export type SavedFilter = {
  id: string
  name: string
  description?: string
  groups: FilterGroup[]
  createdAt: Date
}

export interface FilterBuilderProps {
  onFilterChange: (filters: FilterGroup[], sqlQuery?: string) => void
  onClearFilters?: () => void
  onSaveFilter?: (filter: SavedFilter) => void
  savedFilters?: SavedFilter[]
  onLoadFilter?: (filter: SavedFilter) => void
  onDeleteFilter?: (filterId: string) => void
  className?: string
  compact?: boolean
}

type OperatorType = {
  value: string
  label: string
  symbol: string
}

type OperatorsByType = {
  text: OperatorType[]
  number: OperatorType[]
  integer: OperatorType[]
  decimal: OperatorType[]
  date: OperatorType[]
  time: OperatorType[]
  select: OperatorType[]
}

type FieldType = keyof OperatorsByType

const FilterBuilder = ({ 
  onFilterChange, 
  onClearFilters,
  onSaveFilter,
  savedFilters = [],
  onLoadFilter,
  onDeleteFilter,
  className,
  compact = false
}: FilterBuilderProps) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    { id: 'group-1', conditions: [], logicalOperator: 'AND', isActive: true }
  ])
  const [activeTab, setActiveTab] = useState<'builder' | 'saved'>('builder')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [filterDescription, setFilterDescription] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['group-1']))

  type FieldDefinition = {
    name: string
    type: FieldType
    label: string
    icon: React.ReactNode
    table: string
    options?: string[]
  }

  const fields: FieldDefinition[] = [
    { name: 'data', type: 'date', label: 'Data', icon: <Calendar className="h-4 w-4" />, table: 'intercash' },
    { name: 'hora', type: 'time', label: 'Hora', icon: <Clock className="h-4 w-4" />, table: 'intercash' },
    { name: 'numcaixa', type: 'integer', label: 'Nº Caixa', icon: <Hash className="h-4 w-4" />, table: 'intercash' },
    { name: 'tipoacao', type: 'integer', label: 'Tipo Ação', icon: <Tag className="h-4 w-4" />, table: 'intercash' },
    { name: 'codigo', type: 'text', label: 'Código', icon: <Hash className="h-4 w-4" />, table: 'intercash' },
    { name: 'descricao', type: 'text', label: 'Descrição', icon: <FileText className="h-4 w-4" />, table: 'intercash' },
    { name: 'quantidade', type: 'decimal', label: 'Quantidade', icon: <Package className="h-4 w-4" />, table: 'intercash' },
    { name: 'unidade', type: 'text', label: 'Unidade', icon: <Tag className="h-4 w-4" />, table: 'intercash' },
    { name: 'valorunit', type: 'decimal', label: 'Valor Unit.', icon: <DollarSign className="h-4 w-4" />, table: 'intercash' },
    { name: 'valortotal', type: 'decimal', label: 'Valor Total', icon: <DollarSign className="h-4 w-4" />, table: 'intercash' },
    { name: 'indexacao', type: 'text', label: 'Indexação', icon: <Tag className="h-4 w-4" />, table: 'intercash' },
    { name: 'departamento', type: 'text', label: 'Departamento', icon: <Building className="h-4 w-4" />, table: 'intercash' },
    { name: 'loja', type: 'text', label: 'Loja', icon: <Building className="h-4 w-4" />, table: 'intercash' },
    { name: 'numcamera', type: 'integer', label: 'Nº Câmera', icon: <Camera className="h-4 w-4" />, table: 'intercash' },
    { name: 'id_cupom', type: 'integer', label: 'ID Cupom', icon: <Hash className="h-4 w-4" />, table: 'intercash' },
    { name: 'chavepdv', type: 'integer', label: 'Chave PDV', icon: <Hash className="h-4 w-4" />, table: 'intercash' },
    { name: 'status', type: 'select', label: 'Status', icon: <AlertCircle className="h-4 w-4" />, table: 'intercash', options: ['A', 'I', 'P'] }
  ]

  const operatorsByType: OperatorsByType = {
    text: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'contains', label: 'Contém', symbol: '⊃' },
      { value: 'notContains', label: 'Não contém', symbol: '⊅' },
      { value: 'startsWith', label: 'Começa com', symbol: '→' },
      { value: 'endsWith', label: 'Termina com', symbol: '←' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    number: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'greaterThan', label: 'Maior que', symbol: '>' },
      { value: 'greaterThanOrEqual', label: 'Maior ou igual', symbol: '≥' },
      { value: 'lessThan', label: 'Menor que', symbol: '<' },
      { value: 'lessThanOrEqual', label: 'Menor ou igual', symbol: '≤' },
      { value: 'between', label: 'Entre', symbol: '↔' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    integer: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'greaterThan', label: 'Maior que', symbol: '>' },
      { value: 'greaterThanOrEqual', label: 'Maior ou igual', symbol: '≥' },
      { value: 'lessThan', label: 'Menor que', symbol: '<' },
      { value: 'lessThanOrEqual', label: 'Menor ou igual', symbol: '≤' },
      { value: 'between', label: 'Entre', symbol: '↔' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    decimal: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'greaterThan', label: 'Maior que', symbol: '>' },
      { value: 'greaterThanOrEqual', label: 'Maior ou igual', symbol: '≥' },
      { value: 'lessThan', label: 'Menor que', symbol: '<' },
      { value: 'lessThanOrEqual', label: 'Menor ou igual', symbol: '≤' },
      { value: 'between', label: 'Entre', symbol: '↔' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    date: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'greaterThan', label: 'Depois de', symbol: '>' },
      { value: 'greaterThanOrEqual', label: 'Depois ou igual', symbol: '≥' },
      { value: 'lessThan', label: 'Antes de', symbol: '<' },
      { value: 'lessThanOrEqual', label: 'Antes ou igual', symbol: '≤' },
      { value: 'between', label: 'Entre datas', symbol: '↔' },
      { value: 'today', label: 'Hoje', symbol: '📅' },
      { value: 'last7Days', label: 'Últimos 7 dias', symbol: '7d' },
      { value: 'last30Days', label: 'Últimos 30 dias', symbol: '30d' },
      { value: 'thisMonth', label: 'Este mês', symbol: '📆' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    time: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'greaterThan', label: 'Depois de', symbol: '>' },
      { value: 'greaterThanOrEqual', label: 'Depois ou igual', symbol: '≥' },
      { value: 'lessThan', label: 'Antes de', symbol: '<' },
      { value: 'lessThanOrEqual', label: 'Antes ou igual', symbol: '≤' },
      { value: 'between', label: 'Entre horários', symbol: '↔' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ],
    select: [
      { value: 'equals', label: 'Igual a', symbol: '=' },
      { value: 'notEquals', label: 'Diferente de', symbol: '≠' },
      { value: 'in', label: 'Está em', symbol: '∈' },
      { value: 'notIn', label: 'Não está em', symbol: '∉' },
      { value: 'empty', label: 'É vazio', symbol: '∅' },
      { value: 'notEmpty', label: 'Não é vazio', symbol: '!∅' }
    ]
  }

  const addCondition = (groupId: string) => {
    const group = filterGroups.find(g => g.id === groupId)
    if (!group) return

    const newCondition: FilterCondition = {
      id: `cond-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      field: fields[0].name,
      operator: operatorsByType[fields[0].type][0].value,
      value: ''
    }

    setFilterGroups(groups =>
      groups.map(g =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, newCondition] }
          : g
      )
    )
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.filter(cond => cond.id !== conditionId)
            }
          : group
      )
    )
  }

  const updateCondition = (groupId: string, conditionId: string, updates: Partial<FilterCondition>) => {
    setFilterGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map(cond =>
                cond.id === conditionId 
                  ? { 
                      ...cond, 
                      ...updates,
                      ...(updates.field && updates.field !== cond.field ? { 
                        operator: getDefaultOperator(updates.field),
                        value: '',
                        value2: undefined 
                      } : {})
                    } 
                  : cond
              )
            }
          : group
      )
    )
  }

  const getDefaultOperator = (fieldName: string): string => {
    const fieldType = getFieldType(fieldName)
    return operatorsByType[fieldType]?.[0]?.value || 'equals'
  }

  const addFilterGroup = () => {
    const newGroupId = `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newGroup: FilterGroup = { 
      id: newGroupId, 
      conditions: [], 
      logicalOperator: 'AND',
      isActive: true 
    }
    
    setFilterGroups([...filterGroups, newGroup])
    setExpandedGroups(prev => new Set([...prev, newGroupId]))
  }

  const removeFilterGroup = (groupId: string) => {
    if (filterGroups.length > 1) {
      setFilterGroups(groups => groups.filter(group => group.id !== groupId))
      setExpandedGroups(prev => {
        const newSet = new Set(prev)
        newSet.delete(groupId)
        return newSet
      })
    }
  }

  const toggleGroupExpanded = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  const toggleGroupOperator = (groupId: string) => {
    setFilterGroups(groups =>
      groups.map(group =>
        group.id === groupId
          ? {
              ...group,
              logicalOperator: group.logicalOperator === 'AND' ? 'OR' : 'AND'
            }
          : group
      )
    )
  }

  const clearAllFilters = () => {
    setFilterGroups([{ id: 'group-1', conditions: [], logicalOperator: 'AND', isActive: true }])
    setExpandedGroups(new Set(['group-1']))
    onClearFilters?.()
  }

  const applyFilters = () => {
    const activeGroups = filterGroups.filter(group => group.isActive !== false)
    const sqlQuery = buildSQLQuery(activeGroups)
    onFilterChange(activeGroups, sqlQuery)
  }

  const getFieldType = (fieldName: string): FieldType => {
    const field = fields.find(f => f.name === fieldName)
    return field?.type || 'text'
  }

  const getFieldDefinition = (fieldName: string): FieldDefinition | undefined => {
    return fields.find(f => f.name === fieldName)
  }

  const getOperatorsForField = (fieldName: string): OperatorType[] => {
    const type = getFieldType(fieldName)
    return operatorsByType[type] || operatorsByType.text
  }

  const isSpecialOperator = (operator: string) => {
    const specialOperators = ['empty', 'notEmpty', 'today', 'last7Days', 'last30Days', 'thisMonth']
    return specialOperators.includes(operator)
  }

  const renderValueInput = (groupId: string, condition: FilterCondition) => {
    const field = getFieldDefinition(condition.field)
    if (!field) return null

    if (isSpecialOperator(condition.operator)) {
      return (
        <div className="px-3 py-2 text-sm text-muted-foreground bg-muted/50 rounded-md">
          {condition.operator === 'empty' && 'Campo vazio'}
          {condition.operator === 'notEmpty' && 'Campo não vazio'}
          {condition.operator === 'today' && 'Data atual'}
          {condition.operator === 'last7Days' && 'Últimos 7 dias'}
          {condition.operator === 'last30Days' && 'Últimos 30 dias'}
          {condition.operator === 'thisMonth' && 'Este mês'}
        </div>
      )
    }

    if (condition.operator === 'in' || condition.operator === 'notIn') {
      return (
        <Input
          placeholder="Valores separados por vírgula"
          value={condition.value || ''}
          onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
        />
      )
    }

    switch (field.type) {
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {condition.value ? format(new Date(condition.value), 'dd/MM/yyyy') : 'Selecione a data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={condition.value ? new Date(condition.value) : undefined}
                onSelect={(date) => 
                  updateCondition(
                    groupId,
                    condition.id,
                    { value: date ? format(date, 'yyyy-MM-dd') : '' }
                  )
                }
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        )

      case 'time':
        return (
          <Input
            type="time"
            value={condition.value || ''}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            className="h-10"
          />
        )

      case 'select':
        return (
          <Select
            value={condition.value}
            onValueChange={(value) => updateCondition(groupId, condition.id, { value })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            type={field.type === 'decimal' || field.type === 'integer' ? 'number' : 'text'}
            step={field.type === 'decimal' ? '0.01' : '1'}
            value={condition.value || ''}
            onChange={(e) => updateCondition(groupId, condition.id, { value: e.target.value })}
            placeholder="Digite o valor"
            className="h-10"
          />
        )
    }
  }

  const renderSecondValueInput = (groupId: string, condition: FilterCondition) => {
    if (condition.operator !== 'between' || isSpecialOperator(condition.operator)) return null

    const field = getFieldDefinition(condition.field)
    if (!field) return null

    switch (field.type) {
      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {condition.value2 ? format(new Date(condition.value2), 'dd/MM/yyyy') : 'Até'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={condition.value2 ? new Date(condition.value2) : undefined}
                onSelect={(date) => 
                  updateCondition(
                    groupId,
                    condition.id,
                    { value2: date ? format(date, 'yyyy-MM-dd') : '' }
                  )
                }
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        )

      case 'time':
        return (
          <Input
            type="time"
            value={condition.value2 || ''}
            onChange={(e) => updateCondition(groupId, condition.id, { value2: e.target.value })}
            className="h-10"
            placeholder="Até"
          />
        )

      default:
        return (
          <Input
            type={field.type === 'decimal' || field.type === 'integer' ? 'number' : 'text'}
            step={field.type === 'decimal' ? '0.01' : '1'}
            value={condition.value2 || ''}
            onChange={(e) => updateCondition(groupId, condition.id, { value2: e.target.value })}
            placeholder="Até"
            className="h-10"
          />
        )
    }
  }

  const buildSQLQuery = (groups: FilterGroup[]): string => {
    const whereClauses: string[] = []

    groups.forEach((group) => {
      if (group.conditions.length === 0) return

      const groupClauses = group.conditions.map(condition => {
        const field = condition.field
        const operator = condition.operator
        const value = condition.value
        const value2 = condition.value2
        const fieldType = getFieldType(field)

        let clause = ""

        switch (operator) {
          case 'equals':
            if (fieldType === 'text' || fieldType === 'select') {
              clause = `${field} = '${value}'`
            } else {
              clause = `${field} = ${value}`
            }
            break

          case 'notEquals':
            if (fieldType === 'text' || fieldType === 'select') {
              clause = `${field} != '${value}'`
            } else {
              clause = `${field} != ${value}`
            }
            break

          case 'contains':
            clause = `${field} ILIKE '%${value}%'`
            break

          case 'notContains':
            clause = `${field} NOT ILIKE '%${value}%'`
            break

          case 'startsWith':
            clause = `${field} ILIKE '${value}%'`
            break

          case 'endsWith':
            clause = `${field} ILIKE '%${value}'`
            break

          case 'greaterThan':
            clause = `${field} > ${fieldType === 'text' ? `'${value}'` : value}`
            break

          case 'greaterThanOrEqual':
            clause = `${field} >= ${fieldType === 'text' ? `'${value}'` : value}`
            break

          case 'lessThan':
            clause = `${field} < ${fieldType === 'text' ? `'${value}'` : value}`
            break

          case 'lessThanOrEqual':
            clause = `${field} <= ${fieldType === 'text' ? `'${value}'` : value}`
            break

          case 'between':
            clause = `${field} BETWEEN ${fieldType === 'text' ? `'${value}'` : value} AND ${fieldType === 'text' ? `'${value2}'` : value2}`
            break

          case 'in':
            const values = (value as string).split(',').map(v => v.trim()).filter(Boolean)
            if (values.length > 0) {
              clause = `${field} IN (${values.map(v => fieldType === 'text' ? `'${v}'` : v).join(', ')})`
            }
            break

          case 'notIn':
            const notValues = (value as string).split(',').map(v => v.trim()).filter(Boolean)
            if (notValues.length > 0) {
              clause = `${field} NOT IN (${notValues.map(v => fieldType === 'text' ? `'${v}'` : v).join(', ')})`
            }
            break

          case 'empty':
            clause = `(${field} IS NULL OR ${field} = '')`
            break

          case 'notEmpty':
            clause = `(${field} IS NOT NULL AND ${field} != '')`
            break

          case 'today':
            clause = `${field} = CURRENT_DATE`
            break

          case 'last7Days':
            clause = `${field} >= CURRENT_DATE - INTERVAL '7 days' AND ${field} <= CURRENT_DATE`
            break

          case 'last30Days':
            clause = `${field} >= CURRENT_DATE - INTERVAL '30 days' AND ${field} <= CURRENT_DATE`
            break

          case 'thisMonth':
            clause = `EXTRACT(MONTH FROM ${field}) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM ${field}) = EXTRACT(YEAR FROM CURRENT_DATE)`
            break

          default:
            clause = ""
        }

        return clause
      }).filter(clause => clause !== "")

      if (groupClauses.length > 0) {
        whereClauses.push(`(${groupClauses.join(` ${group.logicalOperator} `)})`)
      }
    })

    if (whereClauses.length === 0) {
      return "SELECT * FROM intercash ORDER BY data DESC, hora DESC"
    }

    return `SELECT * FROM intercash WHERE ${whereClauses.join(' AND ')} ORDER BY data DESC, hora DESC`
  }

  const handleSaveFilter = () => {
    if (!filterName.trim()) return

    const savedFilter: SavedFilter = {
      id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: filterName,
      description: filterDescription,
      groups: filterGroups,
      createdAt: new Date()
    }

    onSaveFilter?.(savedFilter)
    setFilterName('')
    setFilterDescription('')
    setSaveDialogOpen(false)
  }

  const handleLoadFilter = (filter: SavedFilter) => {
    setFilterGroups(filter.groups)
    setExpandedGroups(new Set(filter.groups.map(g => g.id)))
    onLoadFilter?.(filter)
    setActiveTab('builder')
  }

  useEffect(() => {
    applyFilters()
  }, [filterGroups])

  const totalConditions = filterGroups.reduce((sum, group) => sum + group.conditions.length, 0)

  return (
    <TooltipProvider>
      <Card className={cn("w-full", className)}>
        <CardHeader className={compact ? "pb-3" : "pb-6"}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Construtor de Filtros</CardTitle>
                <CardDescription>
                  Filtre os dados da tabela Intercash
                  {totalConditions > 0 && (
                    <span className="ml-2 font-medium text-primary">
                      • {totalConditions} condiç{totalConditions === 1 ? 'ão' : 'ões'} ativa{totalConditions === 1 ? '' : 's'}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {onSaveFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={totalConditions === 0}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Salvar Filtro
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                disabled={totalConditions === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Tudo
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">
                <Filter className="h-4 w-4 mr-2" />
                Construtor
              </TabsTrigger>
              <TabsTrigger value="saved" disabled={savedFilters.length === 0}>
                <Layers className="h-4 w-4 mr-2" />
                Filtros Salvos ({savedFilters.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-4 mt-4">
              {filterGroups.map((group, groupIndex) => (
                <div 
                  key={group.id} 
                  className="border rounded-lg overflow-hidden transition-all duration-200"
                >
                  <div 
                    className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleGroupExpanded(group.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-medium">
                          Grupo {groupIndex + 1}
                        </Badge>
                        {group.conditions.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleGroupOperator(group.id)
                            }}
                            className="h-7 px-2"
                          >
                            <span className="text-xs font-medium">
                              {group.logicalOperator === 'AND' ? 'E' : 'OU'}
                            </span>
                          </Button>
                        )}
                      </div>
                      {group.conditions.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {group.conditions.length} condiç{group.conditions.length === 1 ? 'ão' : 'ões'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          addCondition(group.id)
                        }}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Condição
                      </Button>
                      {filterGroups.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFilterGroup(group.id)
                          }}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform", 
                          expandedGroups.has(group.id) ? "rotate-180" : ""
                        )} 
                      />
                    </div>
                  </div>

                  {expandedGroups.has(group.id) && (
                    <div className="p-4 space-y-3">
                      {group.conditions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                          <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Nenhuma condição adicionada</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addCondition(group.id)}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar primeira condição
                          </Button>
                        </div>
                      ) : (
                        group.conditions.map((condition) => {
                          const fieldDef = getFieldDefinition(condition.field)
                          const operatorDef = getOperatorsForField(condition.field).find(op => op.value === condition.operator)

                          return (
                            <div 
                              key={condition.id} 
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card border rounded-lg group"
                            >
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
                                <div className="sm:col-span-3">
                                  <Select
                                    value={condition.field}
                                    onValueChange={(value) => updateCondition(group.id, condition.id, { field: value })}
                                  >
                                    <SelectTrigger className="w-full h-10">
                                      <SelectValue placeholder="Selecione campo">
                                        <div className="flex items-center gap-2">
                                          {fieldDef?.icon}
                                          <span className="truncate">{fieldDef?.label}</span>
                                        </div>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {fields.map(field => (
                                        <SelectItem key={field.name} value={field.name}>
                                          <div className="flex items-center gap-2">
                                            {field.icon}
                                            {field.label}
                                            <Badge variant="outline" className="ml-auto text-xs">
                                              {field.type}
                                            </Badge>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="sm:col-span-3">
                                  <Select
                                    value={condition.operator}
                                    onValueChange={(value) => updateCondition(group.id, condition.id, { operator: value })}
                                  >
                                    <SelectTrigger className="w-full h-10">
                                      <SelectValue placeholder="Operador">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono">
                                            {operatorDef?.symbol}
                                          </span>
                                          <span className="truncate">
                                            {operatorDef?.label}
                                          </span>
                                        </div>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getOperatorsForField(condition.field).map(op => (
                                        <SelectItem key={op.value} value={op.value}>
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono w-6">{op.symbol}</span>
                                            {op.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className={cn(
                                  "sm:col-span-5",
                                  condition.operator === 'between' ? "sm:col-span-3" : ""
                                )}>
                                  {renderValueInput(group.id, condition)}
                                </div>

                                {condition.operator === 'between' && (
                                  <div className="sm:col-span-3">
                                    {renderSecondValueInput(group.id, condition)}
                                  </div>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeCondition(group.id, condition.id)}
                                className="h-10 w-10 shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })
                      )}

                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addCondition(group.id)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Condição
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={addFilterGroup}
                  className="sm:flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Grupo de Filtros
                </Button>
                <Button 
                  onClick={applyFilters}
                  className="sm:flex-1"
                  disabled={totalConditions === 0}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>

              {totalConditions > 0 && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span>Consulta SQL gerada:</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(buildSQLQuery(filterGroups))}
                        className="h-6 text-xs"
                      >
                        Copiar
                      </Button>
                    </div>
                    <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                      {buildSQLQuery(filterGroups)}
                    </pre>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <div className="space-y-3">
                {savedFilters.map(filter => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{filter.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {filter.groups.reduce((sum, g) => sum + g.conditions.length, 0)} cond.
                        </Badge>
                      </div>
                      {filter.description && (
                        <p className="text-sm text-muted-foreground mb-2">{filter.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Criado em {format(new Date(filter.createdAt), 'dd/MM/yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleLoadFilter(filter)}
                      >
                        Aplicar
                      </Button>
                      {onDeleteFilter && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteFilter(filter.id)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {saveDialogOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Salvar Filtro</CardTitle>
              <CardDescription>
                Salve esta configuração de filtros para uso futuro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Filtro *</label>
                <Input
                  placeholder="Ex: Vendas do Mês"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição (opcional)</label>
                <Input
                  placeholder="Ex: Filtro para análise de vendas do mês atual"
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSaveDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveFilter}
                  disabled={!filterName.trim()}
                >
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </TooltipProvider>
  )
}

export { FilterBuilder }