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
import { AlertCircle, ZoomIn, ZoomOut } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/ThemeProvider";
import { graficoFontSize, getFontSizeTitulo, getFontSizeCellDataTable } from "@/utils/fontSizes";
import { InputInteiro } from "../input/InputInteiro";
import { Label } from "../ui/label";
import { LabelLabel } from "../labels/LabelLabel";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  titulo: string;
  initialPageSize: number;
  carregando?: boolean;
  erro?: boolean;
  localization?: boolean;
  globalFilterMenu?: boolean;
  columnFilterMenu?: boolean;
  onPageIndexChange?: (index: number) => void;
  zoom?: boolean;
  apresentacao?: boolean;
  irPara?: boolean;
}

interface CustomColumnMeta {
  visible: boolean;
  width: number;
}

const DataTableComponent = <T,>({
  data,
  columns,
  titulo,
  initialPageSize,
  carregando,
  erro,
  globalFilterMenu = true,
  columnFilterMenu = true,
  localization = false,
  onPageIndexChange,
  zoom = true,
  apresentacao = false,
  irPara = false,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const lblanterior = t("comum.anterior");
  const lblproximo = t("comum.proximo");
  const lblpagina = t("comum.pagina");
  const lblde = t("comum.de");
  const lblglobalfilter = t("comum.globalfilter");
  const tamanhoFonteTitulo = getFontSizeTitulo(apresentacao);
  const tamanhoFonteCellDataTable = getFontSizeCellDataTable(apresentacao);

  const visibleColumns = columns
    .filter((col) => {
      const meta = col.meta as CustomColumnMeta | undefined;
      return meta?.visible !== false;
    })
    .map((col) => {
      const meta = col.meta as CustomColumnMeta | undefined;
      return { ...col, size: meta?.width };
    });

  const table = useReactTable({
    data,
    columns: visibleColumns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
  });

  useEffect(() => {
    onPageIndexChange?.(pagination.pageIndex);
  }, [pagination.pageIndex]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [globalFilter, columnFilters]);

  const tablePadding = apresentacao ? "p-4" : "p-2";

  if (carregando) {
    return (
      <div className="flex flex-col gap-2 mt-5 mb-2">
        <Skeleton className="h-20 w-full" />
        {Array.from({ length: 24 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-2 mt-2 mb-2">
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (erro) {
    return (
      <div className="h-full ">
        <Alert variant="destructive" className="rounded-t rounded-b w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-300" />
          
            <AlertTitle className="font-bold">{t("comum.errocarregardados")}</AlertTitle>
            <AlertDescription>{t("comum.naofoipossivelcarregarinformacoes")}</AlertDescription>
          
        </Alert>
      </div>
    );
  }


  return (
    <div className="h-full">
      <Card className="rounded-t rounded-b w-full h-full bg-gray-100 dark:bg-gray-800 p-2 sm:p-2">
        <CardContent className="w-full h-full">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-1">
            <div className="col-span-3">
              <LabelCardTitulo bold={false} size={tamanhoFonteTitulo}>{titulo}</LabelCardTitulo>
            </div>

            {zoom && (
              <div className="col-span-1 flex justify-end items-right">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`p-2 ${isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}`}
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            )}
          </div>

          {irPara && (
          <div className="mb-5 flex items-end gap-2 justify-end ml-auto mt-2">
            <LabelLabel>Ir para a página: </LabelLabel>
            <InputInteiro
              id="pagina"
              value={pageIndex + 1}
              label=""
              colSpan={1}
              readOnly={false}
              obrigatorio={false}
              onChange={(_, newValue) => {
                const value = newValue ? Number(newValue) - 1 : 0;
                setPageIndex(value);
              }} />
            <Button
              size="sm"
              className={`h-7 text-xs rounded-b rounded-t bg-blue-600 dark:bg-blue-300"

                        }`}
              onClick={() => {
                if (pageIndex >= 0 && pageIndex < table.getPageCount()) {
                  table.setPageIndex(pageIndex);
                }
              }}
            >
              Ir
            </Button>
          </div>
          )}

          <div className="overflow-auto">

            <Table className={cn("table-fixed w-full")}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className={tamanhoFonteCellDataTable}>
                    {headerGroup.headers.map((header) => {
                      const columnMeta = header.column.columnDef.meta as CustomColumnMeta | undefined;
                      const isVisible = columnMeta?.visible === true;
                      if (!isVisible) return null;
                      const width = columnMeta?.width ? `${columnMeta.width}px` : "auto";

                      return (
                        <TableHead key={header.id} style={{ width }} className={tablePadding}>
                          {header.isPlaceholder ? null : (
                            <div onClick={header.column.getToggleSortingHandler()} className="cursor-pointer">
                              {typeof header.column.columnDef.header === "function"
                                ? flexRender(header.column.columnDef.header, header.getContext())
                                : header.column.columnDef.header}
                              {header.column.getIsSorted() === "asc" && " ↑"}
                              {header.column.getIsSorted() === "desc" && " ↓"}
                            </div>
                          )}
                          {columnFilterMenu && header.column.id !== "actions" && (
                            <Input
                              value={(header.column.getFilterValue() as string) || ""}
                              onChange={(e) => header.column.setFilterValue(e.target.value)}
                              className={(

                                "!h-7 mt-1 mb-2 border rounded focus:outline-none focus:border-gray-500"
                              )}
                            />
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}
                    className={`${tamanhoFonteCellDataTable} hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer`}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={tamanhoFonteCellDataTable}>
                        {localization && typeof cell.getValue() === "string"
                          ? t(cell.getValue() as string)
                          : flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>


          <div className="flex flex-wrap items-center justify-center mt-4 gap-2">
            <Button
              className="!text-xs"
              variant="ghost"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {lblanterior}
            </Button>

            <span className="text-xs">
              {lblpagina} {table.getState().pagination.pageIndex + 1} {lblde} {table.getPageCount()}
            </span>

            <Button
              className="!text-xs"
              variant="ghost"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {lblproximo}
            </Button>


          </div>


          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-6xl" style={{ width: "80%" }}>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-1 mb-4">
                  <div className="col-span-3">
                    <LabelCardTitulo bold={false} size={tamanhoFonteTitulo}>{titulo}</LabelCardTitulo>
                  </div>

                  <div className="col-span-1 flex justify-end items-right">
                    <button onClick={() => setIsModalOpen(false)} className={`p-2 ${isDark ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800"}`} >
                      <ZoomOut size={20} />
                    </button>
                  </div>

                </div>

                <div className="overflow-auto">
                  <Table className={cn("table-fixed w-full text-md")}>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className={tablePadding}>
                          {headerGroup.headers.map((header) => {
                            const columnMeta = header.column.columnDef.meta as CustomColumnMeta | undefined;
                            const isVisible = columnMeta?.visible === true;
                            if (!isVisible) return null;
                            const width = columnMeta?.width ? `${columnMeta.width}px` : "auto";

                            return (
                              <TableHead key={header.id} style={{ width }} className={tablePadding}>
                                {header.isPlaceholder ? null : (
                                  <div onClick={header.column.getToggleSortingHandler()} className="cursor-pointer">
                                    {typeof header.column.columnDef.header === "function"
                                      ? flexRender(header.column.columnDef.header, header.getContext())
                                      : header.column.columnDef.header}
                                    {header.column.getIsSorted() === "asc" && " ↑"}
                                    {header.column.getIsSorted() === "desc" && " ↓"}
                                  </div>
                                )}
                                {columnFilterMenu && header.column.id !== "actions" && (
                                  <Input
                                    value={(header.column.getFilterValue() as string) || ""}
                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                    className={cn(
                                      "mt-1 mb-2 border rounded focus:outline-none focus:border-gray-500 text-md"
                                    )}
                                  />
                                )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>

                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className={tablePadding}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className={tablePadding}>
                              {localization && typeof cell.getValue() === "string"
                                ? t(cell.getValue() as string)
                                : flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação dentro do modal */}
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <Button
                    className={"text-md"}
                    variant="ghost"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {lblanterior}
                  </Button>

                  <span className={"text-md"}>
                    {lblpagina} {table.getState().pagination.pageIndex + 1} {lblde} {table.getPageCount()}
                  </span>

                  <Button
                    className={"text-md"}
                    variant="ghost"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {lblproximo}
                  </Button>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default DataTableComponent;