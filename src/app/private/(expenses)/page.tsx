"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { PieChart, Pie } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Modal } from "./_components/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EditModal } from "./_components/edit-modal";
import { toast } from "sonner";
import axios from "axios";

type Expense = {
  expenseId: string;
  name: string;
  amount: number;
  dueDay: number;
  dueDate: string;
  category: string;
  status: "paid" | "unpaid" | "due";
};

const monthList = [
  { label: "Jan", full: "Janeiro", value: "01" },
  { label: "Fev", full: "Fevereiro", value: "02" },
  { label: "Mar", full: "Março", value: "03" },
  { label: "Abr", full: "Abril", value: "04" },
  { label: "Mai", full: "Maio", value: "05" },
  { label: "Jun", full: "Junho", value: "06" },
  { label: "Jul", full: "Julho", value: "07" },
  { label: "Ago", full: "Agosto", value: "08" },
  { label: "Set", full: "Setembro", value: "09" },
  { label: "Out", full: "Outubro", value: "10" },
  { label: "Nov", full: "Novembro", value: "11" },
  { label: "Dez", full: "Dezembro", value: "12" },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) =>
  String(currentYear - 2 + i)
);

// Cores fixas para até 10 categorias
const predefinedColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
  "var(--chart-11)",
  "var(--chart-12)",
  "var(--chart-13)",
  "var(--chart-14)",
  "var(--chart-15)",
  "var(--chart-16)",
  "var(--chart-17)",
  "var(--chart-18)",
  "var(--chart-19)",
  "var(--chart-20)",
];

export default function DespesasPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [hasAnyBase, setHasAnyBase] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    String(new Date().getFullYear())
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Expense;
    direction: "asc" | "desc";
  } | null>(null);

  function handleSort(key: keyof Expense) {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  const categories = Object.entries(categoryTotals);
  const chartData = categories.map(([category, value], index) => ({
    browser: category,
    visitors: value,
    fill: predefinedColors[index % predefinedColors.length],
  }));

  const chartConfig = {
    visitors: {
      label: "Valor",
    },
    ...Object.fromEntries(
      chartData.map((d) => [d.browser, { label: d.browser, color: d.fill }])
    ),
  } satisfies ChartConfig;

  const categoriaTop = chartData.sort((a, b) => b.visitors - a.visitors)[0];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7 = new Date(today);
  next7.setDate(today.getDate() + 7);
  next7.setHours(23, 59, 59, 999); // inclui até o final do 7º dia

  const visualExpenses = expenses.map((e) => ({
    ...e,
    status: getVisualStatus(e.status === "paid" ? "paid" : "unpaid", e.dueDate),
  }));

  const total7Dias = visualExpenses
    .filter((e) => e.status !== "paid")
    .filter((e) => {
      const due = new Date(e.dueDate);
      due.setHours(0, 0, 0, 0); // Zera para evitar problemas
      return due >= today && due <= next7;
    })
    .reduce((acc, cur) => acc + cur.amount, 0);

  const totalMes = visualExpenses.reduce((acc, cur) => acc + cur.amount, 0);

  const pagas = visualExpenses.filter((e) => e.status === "paid").length;

  const percentualPago = visualExpenses.length
    ? Math.round((pagas / visualExpenses.length) * 100)
    : 0;

  const fetchData = async (year: string, month: string) => {
    setTabLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/expenses/monthly?month=${year}-${month}`,
        { credentials: "include" }
      );
      const data = await res.json();
      // setExpenses(data);
      setExpenses(
        data.map((expense: Expense) => ({
          ...expense,
          status: getVisualStatus(expense.status, expense.dueDate),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar despesas:", err);
    } finally {
      // ← delay antes de desativar o loading da tab
      setTimeout(() => {
        setTabLoading(false);
      }, 400); // 400ms para um UX suave
    }
  };

  const checkHasBaseExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/expenses/has-any", {
        credentials: "include",
      });
      const data = await res.json();
      setHasAnyBase(Boolean(data?.hasAny));
    } catch (err) {
      console.error("Erro ao verificar despesas base:", err);
      setHasAnyBase(false);
    } finally {
      setInitialLoading(false); // ← só aqui
    }
  };

  async function handleDelete(scope: "future" | "all", expense: Expense) {
    const confirmMsg =
      scope === "future"
        ? "Tem certeza que deseja deletar esta despesa e todas as futuras?"
        : "Tem certeza que deseja deletar esta despesa em todos os meses?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const month = expense.dueDate.slice(0, 7);

      await fetch(
        `${apiUrl}/api/expenses/${expense.expenseId}/delete?scope=${scope}&month=${month}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      toast.success("Despesa deletada com sucesso.");

      // Atualiza a lista da tab atual
      await fetchData(selectedYear, selectedMonth);

      // Checa se ainda existem despesas base após a exclusão
      await checkHasBaseExpenses();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      toast.error("Erro ao deletar a despesa.");
    }
  }

  function getVisualStatus(
    paymentStatus: "paid" | "unpaid",
    dueDate: string
  ): "paid" | "unpaid" | "due" {
    if (paymentStatus === "paid") return "paid";

    const today = new Date();
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return due < today ? "due" : "unpaid";
  }

  async function handleTogglePayment(
    expenseId: string,
    dueDate: string,
    currentStatus: "paid" | "unpaid" | "due"
  ) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const month = dueDate.slice(0, 7);
      const toggledStatus = currentStatus === "paid" ? "unpaid" : "paid";

      await axios.patch(
        `${apiUrl}/api/expenses/${expenseId}/edit`,
        {
          scope: "only",
          month,
          updates: {
            paymentStatus: toggledStatus,
          },
        },
        { withCredentials: true }
      );

      const newVisualStatus = getVisualStatus(toggledStatus, dueDate);

      setExpenses((prev) =>
        prev.map((item) =>
          item.expenseId === expenseId
            ? { ...item, status: newVisualStatus }
            : item
        )
      );

      toast.success(
        newVisualStatus === "paid"
          ? "Despesa marcada como paga!"
          : "Pagamento desfeito com sucesso!"
      );
    } catch (error: any) {
      console.error("Erro ao alterar status de pagamento:", error);
      toast.error("Erro ao alterar o status da despesa.");
    }
  }

  useEffect(() => {
    checkHasBaseExpenses();
  }, []);

  useEffect(() => {
    if (hasAnyBase) {
      fetchData(selectedYear, selectedMonth);
    }
  }, [hasAnyBase, selectedYear, selectedMonth]);

  if (initialLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!hasAnyBase) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          Você ainda não cadastrou nenhuma despesa.
        </p>
        <Modal
          onCreate={({ year, month }) => {
            setHasAnyBase(true);
            setSelectedYear(year);
            setSelectedMonth(month);
            fetchData(year, month);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center h-full">
      <div className="w-full max-w-5xl space-y-4 h-full">
        <Tabs
          className="w-full"
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <div className="flex gap-2 w-full">
            <ScrollArea className="grid pb-3" type="always">
              <TabsList>
                {monthList.map((month) => (
                  <TooltipProvider key={month.value}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <TabsTrigger
                            value={month.value}
                            className="cursor-pointer capitalize"
                          >
                            {month.label}
                          </TabsTrigger>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{month.full}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Select onValueChange={setSelectedYear} value={selectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto">
              <Modal
                onCreate={({ year, month }) => {
                  setHasAnyBase(true);
                  setSelectedYear(year);
                  setSelectedMonth(month);
                  fetchData(year, month);
                }}
              />
            </div>
          </div>

          {monthList.map((month) => (
            <TabsContent key={month.value} value={month.value}>
              {tabLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <>
                  {/* Indicadores */}
                  {expenses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Gráfico de Pizza */}
                      <Card className="flex flex-col gap-0">
                        <CardHeader className="items-center pb-0">
                          <CardTitle>Distribuição por categoria</CardTitle>
                          <CardDescription>Mês atual</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center flex-1 gap-4">
                          <ChartContainer
                            config={chartConfig}
                            className="aspect-square w-full max-w-[350px]"
                          >
                            <PieChart>
                              <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                              />
                              <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="browser"
                                stroke="0"
                              />
                              <ChartLegend
                                content={
                                  <ChartLegendContent nameKey="browser" />
                                }
                                className="flex-wrap gap-2 *:basis-1/7 *:justify-start"
                              />
                            </PieChart>
                          </ChartContainer>
                        </CardContent>

                        
                      </Card>
                      <div className="grid gap-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Maior Categoria</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {categoriaTop.browser} (R${" "}
                            {categoriaTop.visitors.toFixed(2)})
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Próx. 7 dias não pagos</CardTitle>
                          </CardHeader>
                          <CardContent>R$ {total7Dias.toFixed(2)}</CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>Total do mês</CardTitle>
                          </CardHeader>
                          <CardContent>R$ {totalMes.toFixed(2)}</CardContent>
                        </Card>
                        <Card>
                          <CardHeader>
                            <CardTitle>% Pagas</CardTitle>
                          </CardHeader>
                          <CardContent>{percentualPago}%</CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                  {/* <p className="text-sm text-muted-foreground mb-4">
                    Despesas de {month.full}: {expenses.length}
                  </p> */}
                  <Table className="mt-6">
                    {/* <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader> */}
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          onClick={() => handleSort("name")}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1">
                            Nome
                            {sortConfig?.key === "name" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort("amount")}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1">
                            Valor
                            {sortConfig?.key === "amount" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort("category")}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1">
                            Categoria
                            {sortConfig?.key === "category" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort("dueDay")}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1">
                            Vencimento
                            {sortConfig?.key === "dueDay" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead
                          onClick={() => handleSort("status")}
                          className="cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-1">
                            Status
                            {sortConfig?.key === "status" &&
                              (sortConfig.direction === "asc" ? (
                                <ArrowUp className="w-4 h-4" />
                              ) : (
                                <ArrowDown className="w-4 h-4" />
                              ))}
                          </div>
                        </TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sortedExpenses.map((expense) => (
                        <TableRow key={expense.expenseId}>
                          <TableCell>{expense.name}</TableCell>
                          <TableCell>
                            {expense.amount.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell>{expense.dueDay}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                expense.status === "paid"
                                  ? "success"
                                  : expense.status === "due"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="rounded-full"
                            >
                              {expense.status === "paid"
                                ? "Pago"
                                : expense.status === "due"
                                ? "Vencido"
                                : "Não pago"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={
                                expense.status === "paid"
                                  ? "secondary"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                handleTogglePayment(
                                  expense.expenseId,
                                  expense.dueDate,
                                  expense.status
                                )
                              }
                            >
                              {expense.status === "paid" ? "Desfazer" : "Pagar"}
                            </Button>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              {/* <DropdownMenuContent align="end">
                                <EditModal
                                  expense={{
                                    expenseId: expense.expenseId,
                                    name: expense.name,
                                    category: expense.category,
                                    amount: expense.amount,
                                    dueDay: expense.dueDay,
                                    startDate: expense.dueDate, // assumindo que `dueDate` pode servir como `startDate`
                                    paymentStatus: expense.status, // `status` -> `paymentStatus`
                                    description: "", // pode ser vazio se não tiver ainda
                                  }}
                                  scope="only"
                                  onSuccess={() =>
                                    fetchData(selectedYear, selectedMonth)
                                  }
                                  nameButton="Editar despesa"
                                />
                                <EditModal
                                  expense={{
                                    expenseId: expense.expenseId,
                                    name: expense.name,
                                    category: expense.category,
                                    amount: expense.amount,
                                    dueDay: expense.dueDay,
                                    startDate: expense.dueDate, // assumindo que `dueDate` pode servir como `startDate`
                                    paymentStatus: expense.status, // `status` -> `paymentStatus`
                                    description: "", // pode ser vazio se não tiver ainda
                                  }}
                                  scope="future"
                                  onSuccess={() =>
                                    fetchData(selectedYear, selectedMonth)
                                  }
                                  nameButton="Editar essa despesas e as futuras"
                                />
                                <EditModal
                                  expense={{
                                    expenseId: expense.expenseId,
                                    name: expense.name,
                                    category: expense.category,
                                    amount: expense.amount,
                                    dueDay: expense.dueDay,
                                    startDate: expense.dueDate, // assumindo que `dueDate` pode servir como `startDate`
                                    paymentStatus: expense.status, // `status` -> `paymentStatus`
                                    description: "", // pode ser vazio se não tiver ainda
                                  }}
                                  scope="all"
                                  onSuccess={() =>
                                    fetchData(selectedYear, selectedMonth)
                                  }
                                  nameButton="Editar todas as despesas"
                                />
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    handleDelete("future", expense);
                                  }}
                                >
                                  Deletar esta e as futuras
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    handleDelete("all", expense);
                                  }}
                                >
                                  Deletar todas
                                </DropdownMenuItem>
                              </DropdownMenuContent> */}
                              <DropdownMenuContent align="end">
                                {/* Submenu: Editar */}
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    Editar
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem asChild>
                                      <EditModal
                                        expense={{
                                          expenseId: expense.expenseId,
                                          name: expense.name,
                                          category: expense.category,
                                          amount: expense.amount,
                                          dueDay: expense.dueDay,
                                          startDate: expense.dueDate,
                                          paymentStatus: expense.status,
                                          description: "",
                                        }}
                                        scope="only"
                                        onSuccess={() =>
                                          fetchData(selectedYear, selectedMonth)
                                        }
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
                                          startDate: expense.dueDate,
                                          paymentStatus: expense.status,
                                          description: "",
                                        }}
                                        scope="future"
                                        onSuccess={() =>
                                          fetchData(selectedYear, selectedMonth)
                                        }
                                        nameButton="Este mês e os próximos"
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
                                          startDate: expense.dueDate,
                                          paymentStatus: expense.status,
                                          description: "",
                                        }}
                                        scope="all"
                                        onSuccess={() =>
                                          fetchData(selectedYear, selectedMonth)
                                        }
                                        nameButton="Todos os meses"
                                      />
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {/* Submenu: Deletar */}
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    Deletar
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        handleDelete("future", expense);
                                      }}
                                    >
                                      Este mês e os próximos
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        handleDelete("all", expense);
                                      }}
                                    >
                                      Todos os meses
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              </DropdownMenuContent>

                              {/* Você pode adicionar mais opções aqui, como deletar ou duplicar */}
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
