import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Filter,
  TrendingUp,
  BarChart3,
  Download,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LabelCardTitulo } from '../labels/labelCardTitulo';
import { LoadingCard } from '../cards/LoadingCard';
import { useTheme } from "@/components/theme/ThemeProvider";
import { ErrorCard } from '../cards/ErrorCard';
import { CampoSingleSelect } from '../crud/CampoSingleSelect';

export interface ColumnConfig {
  key: string;
  label: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => React.ReactNode;
}

export interface DataTableCardProps<T> {
  titulo: string;
  subTitulo?: string;
  dados: T[];
  colunas: ColumnConfig[];
  carregando?: boolean;
  filterOptions?: {
    label: string;
    value: string;
  }[];
  onFilterChange?: (value: string) => void;
  currentFilter?: string;
  compact?: boolean;
  erro: boolean;
}

export function DataTableCard<T extends Record<string, any>>({
  titulo,
  subTitulo,
  dados,
  colunas,
  carregando,
  filterOptions = [
    { label: "Top 5", value: "5" },
    { label: "Top 10", value: "10" },
    { label: "Top 20", value: "20" },
    { label: "Top 30", value: "30" },
    { label: "Top 40", value: "40" },
    { label: "Top 50", value: "50" },
  ],
  onFilterChange,
  currentFilter = "10",
  compact,
  erro
}: DataTableCardProps<T>) {
  const colorSchemes = {
    gray: {
      card: 'border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/10 dark:to-gray-900',
      header: 'text-gray-700 dark:text-gray-300',
      accent: 'text-gray-600 dark:text-gray-400',
      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    }
  };

  const colors = colorSchemes["gray"];


  const renderValue = (value: any, row: T, column: ColumnConfig) => {
    if (column.render) {
      return column.render(value, row);
    }

    if (typeof value === 'number') {
      if (column.key.toLowerCase().includes('count') || column.key.toLowerCase().includes('qtd')) {
        return (
          <Badge variant="secondary" className="font-medium">
            {value.toLocaleString()}
          </Badge>
        );
      }
    }

    return value;
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const corIconePadrao = isDark ? "#60a5fa" : "#3b82f6";
  const corFundoIconePadrao = isDark
    ? "rgba(96, 165, 250, 0.2)"
    : "rgba(59, 130, 246, 0.1)";

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
                  error={""}
                  type={"server"}
                  showDetails={process.env.NODE_ENV === 'development'}
              />
          );
      }
  

  return (
    <Card className={cn(
            "w-full h-full rounded-b rounded-t border transition-all duration-300 p-3",
            "bg-gray-50",
            "dark:bg-gray-900",
          )}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3">
                    <div
                            className="p-2 rounded-b rounded-t flex items-center justify-center"
                            style={{
                              backgroundColor: corFundoIconePadrao,
                              color: corIconePadrao
                            }}>
                            <TrendingUp className="w-5 h-5" />
                          </div>
                    <LabelCardTitulo bold={false}>
                      {titulo}
                    </LabelCardTitulo>
            </div>
            {subTitulo && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subTitulo}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">

              <Select value={currentFilter} onValueChange={onFilterChange}>
  <SelectTrigger className="w-32 h-8 gap-2">
    <Filter className="h-3 w-3" />
    <SelectValue placeholder="Filtrar" />
  </SelectTrigger>

  <SelectContent>
    {filterOptions.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
           
          </div>
        </div>

       
      </CardHeader>

      <CardContent>
          <div className="rounded-b rounded-t border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className={cn("text-xs", compact && "text-xs")}>
                <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
                  <TableRow>
                    {colunas.map((column) => (
                      <TableHead
                        key={column.key}
                        className={cn(
                          "font-semibold",
                          getAlignmentClass(column.align),
                          column.className
                        )}
                      >
                        {column.label}
                      </TableHead>
                    ))}
                    
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dados.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {colunas.map((column) => (
                        <TableCell
                          key={`${rowIndex}-${column.key}`}
                          className={cn(
                            "py-2",
                            getAlignmentClass(column.align),
                            column.key.toLowerCase().includes('count') || 
                            column.key.toLowerCase().includes('qtd')
                              ? "font-medium"
                              : ""
                          )}
                        >
                          {renderValue(row[column.key], row, column)}
                        </TableCell>
                      ))}
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div> 
      </CardContent>
    </Card>
  );
}