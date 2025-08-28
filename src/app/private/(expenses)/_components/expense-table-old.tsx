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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditModal } from "./edit-modal";
import { Expense, SortConfig } from "../types";
import { useState } from "react";

interface ExpenseTableProps {
    expenses: Expense[];
    sortConfig: SortConfig | null;
    onSort: ( key: keyof Expense ) => void;
    onTogglePayment: ( expenseId: string, dueDate: string, currentStatus: "paid" | "unpaid" | "due" | "due_today" ) => void;
    onDelete: ( scope: "future" | "all", expense: Expense ) => void;
    onEditSuccess: () => void;
}

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

    return (
        <div className="xl:col-span-2">
            <div className="bg-background rounded-md border flex flex-col h-[416px] overflow-hidden">
                <div className="overflow-auto flex-1">
                    <table className="min-w-max w-full caption-bottom text-sm [&_td]:border-border [&_th]:border-border border-separate border-spacing-0 [&_th]:border-b [&_tr]:border-none [&_tr:not(:last-child)_td]:border-b">
                        <thead className="bg-background/90 sticky top-0 z-10 backdrop-blur-xs">
                            <tr className="hover:bg-transparent">
                                <th
                                    onClick={() => onSort( "name" )}
                                    className="cursor-pointer select-none text-muted-foreground h-12 px-3 text-left align-middle font-medium"
                                >
                                    <div className="flex items-center gap-1">
                                        Nome
                                        {sortConfig?.key === "name" &&
                                            ( sortConfig.direction === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ) )}
                                    </div>
                                </th>
                                <th
                                    onClick={() => onSort( "category" )}
                                    className="cursor-pointer select-none text-muted-foreground h-12 px-3 text-left align-middle font-medium"
                                >
                                    <div className="flex items-center gap-1">
                                        Categoria
                                        {sortConfig?.key === "category" &&
                                            ( sortConfig.direction === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ) )}
                                    </div>
                                </th>
                                <th
                                    onClick={() => onSort( "dueDay" )}
                                    className="cursor-pointer select-none text-muted-foreground h-12 px-3 text-left align-middle font-medium"
                                >
                                    <div className="flex items-center gap-1">
                                        Dia de Vencimento
                                        {sortConfig?.key === "dueDay" &&
                                            ( sortConfig.direction === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ) )}
                                    </div>
                                </th>
                                <th
                                    onClick={() => onSort( "amount" )}
                                    className="cursor-pointer select-none text-muted-foreground h-12 px-3 text-right align-middle font-medium"
                                >
                                    <div className="flex items-center gap-1 justify-end">
                                        Valor
                                        {sortConfig?.key === "amount" &&
                                            ( sortConfig.direction === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ) )}
                                    </div>
                                </th>
                                <th
                                    onClick={() => onSort( "status" )}
                                    className="cursor-pointer select-none text-muted-foreground h-12 px-3 text-left align-middle font-medium"
                                >
                                    <div className="flex items-center gap-1">
                                        Status
                                        {sortConfig?.key === "status" &&
                                            ( sortConfig.direction === "asc" ? (
                                                <ArrowUp className="w-4 h-4" />
                                            ) : (
                                                <ArrowDown className="w-4 h-4" />
                                            ) )}
                                    </div>
                                </th>
                                <th className="text-muted-foreground h-12 px-3 text-left align-middle font-medium">Ações</th>
                                <th className="text-muted-foreground h-12 px-3 text-right align-middle font-medium sticky right-0 bg-background/90 backdrop-blur-xs border-l"></th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {expenses.map( ( expense ) => (
                                <tr key={expense.expenseId} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <td className="p-3 align-middle font-medium max-w-[220px] truncate">
                                        {expense.name}
                                    </td>
                                    <td className="p-3 align-middle max-w-[220px] truncate">
                                        {expense.category}
                                    </td>
                                    <td className="p-3 align-middle">{expense.dueDay}</td>
                                    <td className="p-3 align-middle text-right">
                                        R$ {expense.amount.toFixed( 2 )}
                                    </td>
                                    <td className="p-3 align-middle max-w-[220px] truncate">
                                        <Badge className={getStatusColor( expense.status )}>
                                            {getStatusText( expense.status )}
                                        </Badge>
                                    </td>
                                    <td className="p-3 align-middle max-w-[220px] truncate">
                                        <Button
                                            variant={expense.status === "paid" ? "secondary" : "outline"}
                                            size="sm"
                                            onClick={() =>
                                                onTogglePayment( expense.expenseId, expense.dueDate, expense.status )
                                            }
                                        >
                                            {expense.status === "paid" ? "Desfazer" : "Pagar"}
                                        </Button>
                                    </td>
                                    <td className="p-3 align-middle text-right max-w-[220px] truncate sticky right-0 bg-background/90 backdrop-blur-xs border-l">
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
                                                                    startDate: expense.dueDate.slice( 0, 7 ), // "2024-08-15" -> "2024-08"
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
                                                                    startDate: expense.dueDate.slice( 0, 7 ), // "2024-08-15" -> "2024-08"
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
                                                                    startDate: expense.dueDate.slice( 0, 7 ), // "2024-08-15" -> "2024-08"
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
                                    </td>
                                </tr>
                            ) )}
                        </tbody>
                    </table>
                </div>
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
