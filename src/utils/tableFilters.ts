import { FilterFn } from '@tanstack/react-table';
import { FilterState } from '@/types/dataTableTypes';

const convertToDate = (value: any): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;

    try {
        if (typeof value === 'string') {
            // Tenta converter do formato brasileiro
            const brMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
            if (brMatch) {
                const [_, day, month, year] = brMatch;
                return new Date(`${year}-${month}-${day}`);
            }

            // Se já for ISO, usa direto
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;
        }

        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
};

export const dateFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState, addMeta) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const cellDate = convertToDate(cellValue);
    if (!cellDate) return false;

    const { operator, value, value2 } = filterValue;

    switch (operator) {
        case 'equals': {
            const filterDate = convertToDate(value);
            if (!filterDate) return false;
            return cellDate.toDateString() === filterDate.toDateString();
        }
        case 'notEqual': {
            const filterDate = convertToDate(value);
            if (!filterDate) return false;
            return cellDate.toDateString() !== filterDate.toDateString();
        }
        case 'after': {
            const filterDate = convertToDate(value);
            return filterDate ? cellDate > filterDate : false;
        }
        case 'before': {
            const filterDate = convertToDate(value);
            return filterDate ? cellDate < filterDate : false;
        }
        case 'between': {
            const filterDate1 = convertToDate(value);
            const filterDate2 = convertToDate(value2);
            return filterDate1 && filterDate2
                ? cellDate >= filterDate1 && cellDate <= filterDate2
                : false;
        }
        case 'today': {
            const today = new Date();
            return cellDate.toDateString() === today.toDateString();
        }
        default:
            return true;
    }
};

export const textFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const cellString = String(cellValue || '').toLowerCase();
    const { operator, value } = filterValue;
    const filterString = String(value || '').toLowerCase();

    switch (operator) {
        case 'contains': return cellString.includes(filterString);
        case 'equals': return cellString === filterString;
        case 'startsWith': return cellString.startsWith(filterString);
        case 'endsWith': return cellString.endsWith(filterString);
        case 'notContains': return !cellString.includes(filterString);
        case 'notEqual': return cellString !== filterString;
        default: return true;
    }
};

export const numberFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const cellNumber = Number(cellValue);
    if (isNaN(cellNumber)) return false;

    const { operator, value, value2 } = filterValue;
    const filterNumber = Number(value);
    const filterNumber2 = value2 ? Number(value2) : undefined;

    if (isNaN(filterNumber) && operator !== 'between') return true;

    switch (operator) {
        case 'equals': return cellNumber === filterNumber;
        case 'notEqual': return cellNumber !== filterNumber;
        case 'greaterThan': return cellNumber > filterNumber;
        case 'lessThan': return cellNumber < filterNumber;
        case 'between':
            return filterNumber2 !== undefined
                ? cellNumber >= filterNumber && cellNumber <= filterNumber2
                : false;
        default: return true;
    }
};

export const booleanFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const filterBool = filterValue.value === 'true';

    return cellValue === filterBool;
};

export const selectFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const { operator, value } = filterValue;

    switch (operator) {
        case 'equals': return cellValue === value;
        case 'notEqual': return cellValue !== value;
        default: return true;
    }
};

export const multiselectFilterFn: FilterFn<any> = (row, columnId, filterValue: FilterState) => {
    if (!filterValue) return true;

    const cellValue = row.getValue(columnId);
    const { operator, values } = filterValue;

    switch (operator) {
        case 'in': return values?.includes(cellValue) || false;
        case 'notIn': return !values?.includes(cellValue);
        default: return true;
    }
};

export const getFilterFn = (filterType?: string): FilterFn<any> | undefined => {
    if (!filterType) return undefined;

    const filterFnMap: Record<string, FilterFn<any>> = {
        'text': textFilterFn,
        'number': numberFilterFn,
        'date': dateFilterFn,
        'datetime': dateFilterFn,
        'boolean': booleanFilterFn,
        'select': selectFilterFn,
        'multiselect': multiselectFilterFn,
        'time': numberFilterFn,
        'range': numberFilterFn,
    };

    return filterFnMap[filterType];
};