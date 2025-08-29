"use client";

import { useCallback } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Modal } from "./_components/modal";
import { LoadingSkeleton } from "./_components/loading-skeleton";
import { ContentLoader } from "./_components/content-loader";
import { IndicatorCards } from "./_components/indicator-cards";
import { ExpenseChart } from "./_components/expense-chart";
import { ExpenseTable } from "./_components/expense-table";
import { NavigationTabs } from "./_components/navigation-tabs";
import { useExpensesData } from "./hooks/useExpensesData";
import { monthList } from "./constants";

export default function DespesasPage() {
  const {
    initialLoading,
    tabLoading,
    hasAnyBase,
    selectedMonth,
    selectedYear,
    sortConfig,
    sortedExpenses,
    chartData,
    chartConfig,
    categoriaTop,
    quantidadeContasNaoPagas,
    totalContasNaoPagas,
    totalMes,
    percentualPago,
    quantidadeContasTotal,
    setSelectedMonth,
    setSelectedYear,
    setHasAnyBase,
    handleSort,
    handleDelete,
    handleTogglePayment,
    fetchData,
  } = useExpensesData();

  const handleCreate = useCallback( ( { year, month }: { year: string; month: string } ) => {
    setHasAnyBase( true );
    setSelectedYear( year );
    setSelectedMonth( month );
    fetchData( year, month );
  }, [ setHasAnyBase, setSelectedYear, setSelectedMonth, fetchData ] );

  const handleEditSuccess = useCallback( () => {
    fetchData( selectedYear, selectedMonth );
  }, [ fetchData, selectedYear, selectedMonth ] );

  if ( initialLoading ) {
    return (
      <div className="w-full flex justify-center h-full p-4 sm:p-6">
        <div className="w-full max-w-5xl space-y-4 h-full grid grid-cols-1">
          <ContentLoader message="Carregando despesas..." />
        </div>
      </div>
    );
  }

  if ( !hasAnyBase ) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Você ainda não cadastrou nenhuma despesa.
          </p>
          <Modal onCreate={handleCreate} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center h-full p-0">
      <div className="w-full max-w-6xl h-full grid grid-cols-1">
        <Tabs
          className="w-full gap-0"
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <NavigationTabs
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onCreate={handleCreate}
          />

          {monthList.map( ( month ) => (
            <TabsContent key={month.value} value={month.value} className="mt-0 pb-4 px-4">
              {tabLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
                  {sortedExpenses.length > 0 ? (
                    <div className="space-y-4">
                      <IndicatorCards
                        categoriaTop={categoriaTop}
                        quantidadeContasNaoPagas={quantidadeContasNaoPagas}
                        totalContasNaoPagas={totalContasNaoPagas}
                        totalMes={totalMes}
                        percentualPago={percentualPago}
                        quantidadeContasTotal={quantidadeContasTotal}
                      />

                      <div className="space-y-4">
                        <ExpenseTable
                          expenses={sortedExpenses}
                          sortConfig={sortConfig}
                          onSort={handleSort}
                          onTogglePayment={handleTogglePayment}
                          onDelete={handleDelete}
                          onEditSuccess={handleEditSuccess}
                        />
                        <ExpenseChart
                          chartData={chartData}
                          chartConfig={chartConfig}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-4">
                          Você ainda não tem despesas cadastradas para {month.full.toLowerCase()} de {selectedYear}.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          ) )}
        </Tabs>
      </div>
    </div>
  );
}
