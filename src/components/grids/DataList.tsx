import { useState, useEffect } from "react";
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
  flexRender
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { LabelCardTitulo } from "../labels/labelCardTitulo";
import { getFontSizeDataList } from "@/utils/fontSizes";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  titulo:string,
  initialPageSize: number;
  carregando?: boolean;
  erro?: boolean;
  apresentacao?: boolean;
  onPageIndexChange?: (index: number) => void;
}

interface CustomColumnMeta {
  visible: boolean;
  width: number;
}

const DataListComponent = <T,>({
  data,
  columns,
  titulo,
  initialPageSize,
  carregando,
  erro,
  apresentacao=true,
  onPageIndexChange
}: DataTableProps<T>) => {

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: initialPageSize });
  const { t } = useTranslation();
  const tamanhoFonte = getFontSizeDataList(apresentacao);
  const lblanterior = t("comum.anterior");
  const lblproximo = t("comum.proximo");
  const lblpagina = t("comum.pagina");
  const lblde = t("comum.de");
  const lblglobalfilter = t("comum.globalfilter");
  const [headerColor, setHeaderColor] = useState<string>("#fff");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); 
  const [pageIndex, setPageIndex] = useState(0);

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
    },

    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil(data.length / pagination.pageSize),
    autoResetPageIndex: false,
  });

  useEffect(() => {    
    const savedColor = localStorage.getItem("headerColor");
    if (savedColor) {
      setHeaderColor(savedColor);
    }

  }, []);

  useEffect(() => {
    onPageIndexChange?.(pagination.pageIndex);
  }, [pagination.pageIndex]);

  if (carregando) {
    return (
      <Card className="w-full h-full bg-gray-100 dark:bg-gray-800 p-3 sm:p-4 rounded-t rounded-b">
        <Skeleton className="h-20 w-full" />
        {Array.from({ length: initialPageSize }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-2 mt-2 mb-2">
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </Card>

    );
  }

  if (erro) {
    return (
      <Alert
        variant="destructive"
        className="mt-4 w-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border border-red-300 dark:border-red-700 rounded-t rounded-b"
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
    <Card className="bg-gray-100 dark:bg-gray-800 p-2 rounded-t rounded-b">
      <CardContent className="w-full h-full">
        <LabelCardTitulo bold={false}>{titulo}</LabelCardTitulo>

        <div className="overflow-auto ">
          <Table className="table-fixed w-full bg-gray-100 dark:bg-gray-800">
            <TableHeader  className={`p-2 ${tamanhoFonte}`}>
              <TableRow className="h-8 min-h-0">
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
                        className="text-gray-800 dark:text-gray-200 bg-transparent pb-2"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            //onClick={header.column.getToggleSortingHandler()}
                            className="cursor-pointer"
                          >
                            {typeof header.column.columnDef.header ===
                              "function"
                              ? flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                              : header.column.columnDef.header}
                    
                          </div>
                        )}
                        

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
                      className={`p-2 ${tamanhoFonte}`}
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

      </CardContent>

    </Card>

  );
};

export default DataListComponent;