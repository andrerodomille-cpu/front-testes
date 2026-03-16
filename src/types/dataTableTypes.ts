import { ColumnDef } from "@tanstack/react-table";

export type AlignType = 'left' | 'center' | 'right';
export type FilterType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'datetime' | 'time' | 'range';
export type AggregationType = 'sum' | 'avg' | null;

export interface CustomColumnMeta<T> {
    visible: boolean;
    width?: number;
    label?: string;
    filterType?: FilterType;
    align?: AlignType;
    aggregation?: AggregationType;
    filterOptions?: {
        min?: number;
        max?: number;
        step?: number;
        options?: Array<{ label: string; value: any }>;
        dateFormat?: string;
        showTime?: boolean;
    };
}

export interface FilterState {
    columnId: string;
    type: FilterType;
    operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between' | 'in' | 'notIn' | 'notEqual' | 'after' | 'before' | 'today' | 'notContains';
    value: any;
    value2?: any;
    values?: any[];
}

export interface ColumnConfig<T> {
    id?: string;
    accessorKey: keyof T;
    header: string;
    filterType?: FilterType;
    width?: number;
    align?: AlignType;
    cell?: (props: { row: { original: T } }) => React.ReactNode;
    filterOptions?: CustomColumnMeta<T>['filterOptions'];
    aggregation?: AggregationType;
    enableSorting?: boolean;
    enableColumnFilter?: boolean;
}