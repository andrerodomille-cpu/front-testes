import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  useReactTable,
  ColumnDef,
  SortingState,
  PaginationState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  flexRender,
  FilterFn,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  initialPageSize: number;
  carregando?: boolean;
  erro?: boolean;
  procura?: boolean;
}

interface CustomColumnMeta {
  visible: boolean;
  width: number;
}

const DataTableModal = <T,>({
  data,
  columns,
  initialPageSize,
  carregando,
  erro,
  procura=false
}: DataTableProps<T>) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: initialPageSize });
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const { t } = useTranslation();
  const lblanterior = t("comum.anterior");
  const lblproximo = t("comum.proximo");
  const lblpagina = t("comum.pagina");
  const lblde = t("comum.de");
  const lblglobalfilter = t("comum.globalfilter");
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Estado para armazenar os filtros

  const visibleColumns = columns
  .filter((col) => {
    const meta = col.meta as CustomColumnMeta | undefined;
    return meta?.visible !== false;
  })
  .map((col) => {
    const meta = col.meta as CustomColumnMeta | undefined;
    return {
      ...col,
      size: meta?.width,
    };
  });

  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: {
      sorting,
      pagination,
      globalFilter,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(data.length / pagination.pageSize),
  });

  useEffect(() => {
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }
  }, []);

  if (carregando) {
    return (
      <Card className="w-full text-sm p-4 space-y-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-6 w-full" /><Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />                
      </Card>
    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700"
      >
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
        <div className="flex flex-col">
          <AlertTitle className="font-bold">{t("comum.errocarregardados")}</AlertTitle>
          <AlertDescription>
          {t("comum.naofoipossivelcarregarinformacoes")}
          </AlertDescription>
        </div>
      </Alert>
    );
  }


  return (
    <Card className="mt-2 p-2">
      <CardContent className="w-full h-full">
        {procura ? (
          <div className="flex items-center justify-between mb-4 gap-2">
            <Input
              placeholder={lblglobalfilter}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="hover:bg-gray-300 dark:hover:bg-gray-600 mt-2 mb-2 w-1/4 px-1 py-1 border border-gray-300 dark:border-gray-700  bg-gray-200 dark:bg-gray-900 dark:text-white rounded-t rounded-b text-xs h-8"
            />
          </div>
          ):(
          <></>
          )
        }

        <div className="overflow-auto">
          <Table className="table-fixed w-full">
            <TableHeader className="text-xs text-gray-600 dark:text-gray-300">
              <TableRow className="h-8 min-h-0 text-xs text-gray-600 dark:text-gray-300">
                {table.getHeaderGroups().map((headerGroup) =>
                  headerGroup.headers.map((header) => {
                    const columnMeta = header.column.columnDef.meta as
                      | CustomColumnMeta
                      | undefined;
                    const isVisible = columnMeta?.visible === true;
                    if (!isVisible) return null;
                    const width = columnMeta?.width
                      ? `${columnMeta.width}px`
                      : "auto";

                    return (
                      <TableHead
                        key={header.id}
                        style={{ width }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            onClick={header.column.getToggleSortingHandler()}
                            className="cursor-pointer"
                          >
                            {typeof header.column.columnDef.header ===
                              "function"
                              ? flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                              : header.column.columnDef.header}
                            {header.column.getIsSorted() === "asc" && " ↑"}
                            {header.column.getIsSorted() === "desc" && " ↓"}
                          </div>
                        )}
                        {/*
                          {header.column.id !== "actions" && (
                            <Input
                              value={(header.column.getFilterValue() as string) || ""}
                              onChange={(e) => header.column.setFilterValue(e.target.value)}
                              className="hover:bg-gray-300 dark:hover:bg-gray-600 mt-2 mb-2 w-full px-1 py-1 border border-gray-300 dark:border-gray-700  bg-gray-200 dark:bg-gray-900 dark:text-white rounded-t rounded-b text-xs h-6"
                            />
                          )}
                        */}
                      </TableHead>
                    );
                  })
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="py-1 h-6">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-xs p-2"
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>

        <div className="flex items-center justify-center mt-4 space-x-2">
          <Button
            className="text-xs"
            style={{ color: headerColor }}
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {lblanterior}
          </Button>
          <span className="text-xs" style={{ color: headerColor }}>
            {lblpagina} {table.getState().pagination.pageIndex + 1} {lblde}{" "}
            {table.getPageCount()}
          </span>
          <Button
            className="text-xs"
            style={{ color: headerColor }}
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {lblproximo}
          </Button>
        </div>
      </CardContent>

    </Card>

  );
};

export default DataTableModal;
