import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import axios from "axios";
import { Expense, SortConfig, ChartDataItem, CategoryTotal } from "../types";
import { predefinedColors } from "../constants";
import { ChartConfig } from "@/components/ui/chart";

export function useExpensesData() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [hasAnyBase, setHasAnyBase] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() =>
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    String(new Date().getFullYear())
  );
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Função para determinar status visual
  function getVisualStatus(
    paymentStatus: "paid" | "unpaid" | "due",
    dueDate: string
  ): "paid" | "unpaid" | "due" {
    if (paymentStatus === "paid") return "paid";

    const today = new Date();
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return due < today ? "due" : "unpaid";
  }

  // Função para ordenação
  function handleSort(key: keyof Expense) {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  // Buscar dados das despesas
  const fetchData = useCallback(async (year: string, month: string) => {
    setTabLoading(true);
    try {
      const ym = `${year}-${String(month).padStart(2, "0")}`;

      const res = await fetch(`/api/bff/expenses/monthly?month=${ym}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        // Se a resposta não for OK (ex: 401 Unauthorized), redireciona para login
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Verifica se data é um array antes de usar .map()
      if (Array.isArray(data)) {
        setExpenses(
          data.map((expense: Expense) => ({
            ...expense,
            status: getVisualStatus(expense.status, expense.dueDate),
          }))
        );
      } else {
        console.error("Resposta da API não é um array:", data);
        setExpenses([]);
      }
    } catch (err) {
      console.error("Erro ao buscar despesas:", err);
      setExpenses([]);
    } finally {
      setTimeout(() => {
        setTabLoading(false);
      }, 400);
    }
  }, []);

  // Verificar se há despesas base
  const checkHasBaseExpenses = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`/api/bff/expenses/has-any`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Se a resposta não for OK (ex: 401 Unauthorized), redireciona para login
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setHasAnyBase(Boolean(data?.hasAny));
    } catch (err) {
      console.error("Erro ao verificar despesas base:", err);
      setHasAnyBase(false);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Deletar despesa
  const handleDelete = useCallback(
    async (scope: "future" | "all", expense: Expense) => {
      try {
        const month = expense.dueDate.slice(0, 7);

        await fetch(
          `/api/bff/expenses/${
            expense.expenseId
          }/delete?scope=${encodeURIComponent(scope)}&month=${month}`,
          {
            method: "DELETE",
            credentials: "include",
            cache: "no-store",
          }
        );

        toast.success("Despesa deletada com sucesso.");
        await fetchData(selectedYear, selectedMonth);
        await checkHasBaseExpenses();
      } catch (err) {
        console.error("Erro ao deletar:", err);
        toast.error("Erro ao deletar a despesa.");
      }
    },
    [selectedYear, selectedMonth, fetchData, checkHasBaseExpenses]
  );

  // Toggle pagamento
  const handleTogglePayment = useCallback(
    async (
      expenseId: string,
      dueDate: string,
      currentStatus: "paid" | "unpaid" | "due"
    ) => {
      try {
        const month = dueDate.slice(0, 7);
        const toggledStatus = currentStatus === "paid" ? "unpaid" : "paid";

        await fetch(`/api/bff/expenses/${expenseId}/edit`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            scope: "only",
            month,
            updates: { paymentStatus: toggledStatus },
          }),
        });

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
    },
    []
  );

  // Calcular dados derivados
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

  const categoryTotals: CategoryTotal = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as CategoryTotal);

  const categories = Object.entries(categoryTotals);
  const chartData: ChartDataItem[] = categories.map(
    ([category, value], index) => ({
      browser: category,
      visitors: value,
      fill: predefinedColors[index % predefinedColors.length],
    })
  );

  const chartConfig: ChartConfig = {
    visitors: {
      label: "Valor",
    },
    ...Object.fromEntries(
      chartData.map((d) => [d.browser, { label: d.browser, color: d.fill }])
    ),
  };

  const categoriaTop = chartData.sort((a, b) => b.visitors - a.visitors)[0];

  const visualExpenses = expenses.map((e) => ({
    ...e,
    status: getVisualStatus(e.status === "paid" ? "paid" : "unpaid", e.dueDate),
  }));

  const contasNaoPagas = visualExpenses.filter((e) => e.status !== "paid");
  const quantidadeContasNaoPagas = contasNaoPagas.length;
  const totalContasNaoPagas = contasNaoPagas.reduce(
    (acc, cur) => acc + cur.amount,
    0
  );
  const totalMes = visualExpenses.reduce((acc, cur) => acc + cur.amount, 0);
  const pagas = visualExpenses.filter((e) => e.status === "paid").length;
  const percentualPago = visualExpenses.length
    ? Math.round((pagas / visualExpenses.length) * 100)
    : 0;

  useEffect(() => {
    checkHasBaseExpenses();
  }, [checkHasBaseExpenses]);

  useEffect(() => {
    if (hasAnyBase) {
      fetchData(selectedYear, selectedMonth);
    }
  }, [hasAnyBase, selectedYear, selectedMonth, fetchData]);

  return {
    // Estado
    expenses,
    initialLoading,
    tabLoading,
    hasAnyBase,
    selectedMonth,
    selectedYear,
    sortConfig,

    // Setters
    setSelectedMonth,
    setSelectedYear,
    setHasAnyBase,

    // Dados calculados
    sortedExpenses,
    chartData,
    chartConfig,
    categoriaTop,
    quantidadeContasNaoPagas,
    totalContasNaoPagas,
    totalMes,
    percentualPago,

    // Funções
    handleSort,
    handleDelete,
    handleTogglePayment,
    fetchData,
    checkHasBaseExpenses,
  };
}
