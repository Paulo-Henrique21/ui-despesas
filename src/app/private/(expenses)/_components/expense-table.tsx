"use client";

import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditModal } from "./edit-modal";
import { Expense, SortConfig } from "../types";
import { useState, CSSProperties } from "react";
import {
    Column,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";

interface ExpenseTableProps {
    expenses: Expense[];
    sortConfig: SortConfig | null;
    onSort: ( key: keyof Expense ) => void;
    onTogglePayment: ( expenseId: string, dueDate: string, currentStatus: "paid" | "unpaid" | "due" | "due_today" ) => void;
    onDelete: ( scope: "future" | "all", expense: Expense ) => void;
    onEditSuccess: () => void;
}

// Helper function to compute pinning styles for columns
const getPinningStyles = ( column: Column<Expense>, isHeader: boolean = false ): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
        left: isPinned === "left" ? `${ column.getStart( "left" ) }px` : undefined,
        right: isPinned === "right" ? `${ column.getAfter( "right" ) }px` : undefined,
        position: isPinned ? "sticky" : "relative",
        width: column.getSize(),
        zIndex: isPinned ? ( isHeader ? 6 : 3 ) : ( isHeader ? 2 : 0 ), // Headers de colunas fixas bem acima de suas células
        top: isPinned && isHeader ? "0px" : undefined, // Apenas headers de colunas fixas têm top: 0
    };
};

export function ExpenseTable( {
    expenses,
    sortConfig,
    onSort,
    onTogglePayment,
    onDelete,
    onEditSuccess,
}: ExpenseTableProps ) {
    const [ deleteDialog, setDeleteDialog ] = useState<{
        isOpen: boolean;
        expense: Expense | null;
        scope: "future" | "all" | null;
    }>( {
        isOpen: false,
        expense: null,
        scope: null,
    } );

    const [ sorting, setSorting ] = useState<SortingState>( [] );

    const handleDeleteClick = ( scope: "future" | "all", expense: Expense ) => {
        setDeleteDialog( {
            isOpen: true,
            expense,
            scope,
        } );
    };

    const handleDeleteConfirm = () => {
        if ( deleteDialog.scope && deleteDialog.expense ) {
            onDelete( deleteDialog.scope, deleteDialog.expense );
        }
        setDeleteDialog( {
            isOpen: false,
            expense: null,
            scope: null,
        } );
    };

    const handleDeleteCancel = () => {
        setDeleteDialog( {
            isOpen: false,
            expense: null,
            scope: null,
        } );
    };

    const getDeleteMessage = () => {
        if ( deleteDialog.scope === "future" ) {
            return "Tem certeza que deseja deletar esta despesa e todas as futuras?";
        }
        return "Tem certeza que deseja deletar esta despesa em todos os meses?";
    };

    const getStatusColor = ( status: "paid" | "unpaid" | "due" | "due_today" ) => {
        switch ( status ) {
            case "paid":
                return "bg-green-600 text-white hover:bg-green-700";
            case "due":
                return "bg-red-600 text-white hover:bg-red-700";
            case "due_today":
                return "bg-orange-600 text-white hover:bg-orange-700";
            default:
                return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }
    };

    const getStatusText = ( status: "paid" | "unpaid" | "due" | "due_today" ) => {
        switch ( status ) {
            case "paid":
                return "Pago";
            case "due":
                return "Vencido";
            case "due_today":
                return "Vence hoje";
            default:
                return "Não pago";
        }
    };

    const columns: ColumnDef<Expense>[] = [
        {
            header: "Nome",
            accessorKey: "name",
            enableSorting: true,
            size: 250,
            cell: ( { row } ) => (
                <div className="font-medium truncate">
                    {row.getValue( "name" )}
                </div>
            ),
        },
        {
            header: "Categoria",
            accessorKey: "category",
            enableSorting: true,
            size: 180,
            cell: ( { row } ) => (
                <div className="truncate">
                    {row.getValue( "category" )}
                </div>
            ),
        },
        {
            header: "Dia de Vencimento",
            accessorKey: "dueDay",
            enableSorting: true,
            size: 160,
        },
        {
            header: "Valor",
            accessorKey: "amount",
            enableSorting: true,
            size: 130,
            cell: ( { row } ) => {
                const amount = parseFloat( row.getValue( "amount" ) );
                return (
                    <div className="text-left">
                        R$ {amount.toFixed( 2 )}
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessorKey: "status",
            enableSorting: true,
            size: 120,
            cell: ( { row } ) => {
                const status = row.getValue( "status" ) as "paid" | "unpaid" | "due" | "due_today";
                return (
                    <Badge className={getStatusColor( status )}>
                        {getStatusText( status )}
                    </Badge>
                );
            },
        },
        {
            header: "Ações",
            accessorKey: "status", // Usar status como base para ordenação
            id: "actions", // ID específico para identificar a coluna
            enableSorting: true,
            enablePinning: false,
            size: 100,
            sortingFn: ( rowA, rowB ) => {
                // Ordenação customizada: paid < unpaid < due_today < due
                const statusOrder = { "paid": 0, "unpaid": 1, "due_today": 2, "due": 3 };
                const statusA = rowA.original.status;
                const statusB = rowB.original.status;
                return statusOrder[ statusA ] - statusOrder[ statusB ];
            },
            cell: ( { row } ) => {
                const expense = row.original;
                return (
                    <Button
                        variant={expense.status === "paid" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() =>
                            onTogglePayment( expense.expenseId, expense.dueDate, expense.status )
                        }
                    >
                        {expense.status === "paid" ? "Desfazer" : "Pagar"}
                    </Button>
                );
            },
        },
        {
            header: "Opções",
            accessorKey: "options",
            enableSorting: false,
            enablePinning: false,
            size: 80,
            cell: ( { row } ) => {
                const expense = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="overflow-y-hidden">
                            {/* Submenu: Editar */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Editar</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem asChild>
                                        <EditModal
                                            expense={{
                                                expenseId: expense.expenseId,
                                                name: expense.name,
                                                category: expense.category,
                                                amount: expense.amount,
                                                dueDay: expense.dueDay,
                                                startDate: expense.dueDate.slice( 0, 7 ),
                                                paymentStatus: expense.status,
                                                description: "",
                                            }}
                                            scope="only"
                                            onSuccess={onEditSuccess}
                                            nameButton="Este mês"
                                        />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <EditModal
                                            expense={{
                                                expenseId: expense.expenseId,
                                                name: expense.name,
                                                category: expense.category,
                                                amount: expense.amount,
                                                dueDay: expense.dueDay,
                                                startDate: expense.dueDate.slice( 0, 7 ),
                                                paymentStatus: expense.status,
                                                description: "",
                                            }}
                                            scope="future"
                                            onSuccess={onEditSuccess}
                                            nameButton="Este e próximos"
                                        />
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <EditModal
                                            expense={{
                                                expenseId: expense.expenseId,
                                                name: expense.name,
                                                category: expense.category,
                                                amount: expense.amount,
                                                dueDay: expense.dueDay,
                                                startDate: expense.dueDate.slice( 0, 7 ),
                                                paymentStatus: expense.status,
                                                description: "",
                                            }}
                                            scope="all"
                                            onSuccess={onEditSuccess}
                                            nameButton="Todos os meses"
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Submenu: Deletar */}
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Deletar</DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteClick( "future", expense )}
                                    >
                                        Este mês e os próximos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteClick( "all", expense )}
                                    >
                                        Todos os meses
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable( {
        data: expenses,
        columns,
        columnResizeMode: "onEnd",
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        defaultColumn: {
            minSize: 60,
            maxSize: 400,
        },
        state: {
            sorting,
            columnPinning: {
                right: [ "actions", "options" ], // Ações e Opções fixas na direita
            },
        },
        enableSortingRemoval: false,
        initialState: {
            columnPinning: {
                right: [ "actions", "options" ],
            },
        },
    } );

    return (
        <div className="w-full">
            <div className="bg-background rounded-md border border-t-0 flex flex-col h-[300px] sm:h-[350px] md:h-[416px] overflow-hidden w-full">
                <Table
                    className="[&_td]:border-border [&_th]:border-border table-fixed border-separate border-spacing-0 [&_tfoot_td]:border-t [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b flex-1 w-full"
                >
                    <TableHeader className="sticky top-0 z-[4] bg-background">
                        {table.getHeaderGroups().map( ( headerGroup ) => (
                            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                                {headerGroup.headers.map( ( header ) => {
                                    const { column } = header;
                                    const isPinned = column.getIsPinned();
                                    const isLastLeftPinned =
                                        isPinned === "left" && column.getIsLastColumn( "left" );
                                    const isFirstRightPinned =
                                        isPinned === "right" && column.getIsFirstColumn( "right" );

                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="[&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/50 relative h-10 truncate border-t data-pinned:backdrop-blur-xs [&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-l cursor-pointer select-none bg-muted/50"
                                            colSpan={header.colSpan}
                                            style={{ ...getPinningStyles( column, true ) }}
                                            data-pinned={isPinned || undefined}
                                            data-last-col={
                                                isLastLeftPinned
                                                    ? "left"
                                                    : isFirstRightPinned
                                                        ? "right"
                                                        : undefined
                                            }
                                            onClick={column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                                    <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </span>
                                                    {column.getIsSorted() === "asc" && (
                                                        <ArrowUp className="w-4 h-4 flex-shrink-0" />
                                                    )}
                                                    {column.getIsSorted() === "desc" && (
                                                        <ArrowDown className="w-4 h-4 flex-shrink-0" />
                                                    )}
                                                </div>

                                                {header.column.getCanResize() && (
                                                    <div
                                                        {...{
                                                            onDoubleClick: () => header.column.resetSize(),
                                                            onMouseDown: header.getResizeHandler(),
                                                            onTouchStart: header.getResizeHandler(),
                                                            className:
                                                                "absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:-translate-x-px",
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                } )}
                            </TableRow>
                        ) )}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map( ( row ) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map( ( cell ) => {
                                        const { column } = cell;
                                        const isPinned = column.getIsPinned();
                                        const isLastLeftPinned =
                                            isPinned === "left" && column.getIsLastColumn( "left" );
                                        const isFirstRightPinned =
                                            isPinned === "right" && column.getIsFirstColumn( "right" );

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={`[&[data-pinned][data-last-col]]:border-border data-pinned:bg-background data-pinned:backdrop-blur-xs [&[data-pinned=left][data-last-col=left]]:border-r [&[data-pinned=right][data-last-col=right]]:border-l ${ column.id === 'actions' || column.id === 'options' ? '' : 'truncate' }`}
                                                style={{ ...getPinningStyles( column, false ) }}
                                                data-pinned={isPinned || undefined}
                                                data-last-col={
                                                    isLastLeftPinned
                                                        ? "left"
                                                        : isFirstRightPinned
                                                            ? "right"
                                                            : undefined
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        );
                                    } )}
                                </TableRow>
                            ) )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhuma despesa encontrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={deleteDialog.isOpen} onOpenChange={handleDeleteCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            {getDeleteMessage()}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Deletar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
