"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RocketIcon, EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import axios from "axios";
import { Plus } from "lucide-react";
import { Select, SelectTrigger } from "@/components/ui/select";
import SelectField from "./_components/select-field";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Modal } from "./_components/modal";

interface Expense {
  expenseId: string;
  name: string;
  category: string;
  amount: number;
  dueDate: string;
  status: string;
  payment: {
    amount: number;
    paidAt: string;
    method: string;
    note: string;
  } | null;
}

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

export default function Page() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = String(today.getMonth() + 1).padStart(2, "0");

  const [hasExpenses, setHasExpenses] = useState<boolean | null>(null);

  const checkIfUserHasExpenses = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/expenses/monthly?month=${currentYear}-${currentMonth}`,
        { withCredentials: true }
      );

      setHasExpenses(response.data.length > 0);
    } catch (error) {
      console.error("Erro ao verificar despesas:", error);
      setHasExpenses(false);
    }
  };

  useEffect(() => {
    checkIfUserHasExpenses();
  }, []);

  if (hasExpenses === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!hasExpenses) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 space-y-4">
        <RocketIcon className="text-muted-foreground" size={38} />
        <p className="text-muted-foreground">
          Você ainda não tem nenhuma despesa cadastrada.
        </p>
        <Modal />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center h-full">
      <div className="w-full max-w-5xl space-y-4 h-full">
        <Tabs className="w-full" defaultValue={currentMonth}>
          <div className="flex gap-2">
            <ScrollArea className="grid pb-3" type="always">
              <TabsList>
                {monthList.map((month) => (
                  <TooltipProvider key={month.value}>
                    <Tooltip>
                      <TooltipTrigger>
                        <TabsTrigger
                          value={month.value}
                          className="capitalize cursor-pointer"
                        >
                          {month.label}
                        </TabsTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add to library</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <SelectField />
            <Button className="ml-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Despesa
            </Button>
          </div>
          <TabsContent value={"01"}>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">
                Vence dia 10
              </span>
              <div className="px-4 py-3 border rounded-md">
                <div className="flex gap-2 md:items-center">
                  <div className="flex grow gap-3 md:items-center">
                    <div
                      className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
                      aria-hidden="true"
                    >
                      <RocketIcon className="opacity-80" size={16} />
                    </div>

                    <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">Aluguel</p>
                        <p className="text-muted-foreground text-sm">
                          R$ 1.200,00
                        </p>
                      </div>
                      <Badge className="text-background bg-emerald-500">
                        Pago
                      </Badge>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="size-8 shrink-0 p-0"
                          aria-label="Ações"
                        >
                          <EllipsisVertical
                            size={16}
                            className="opacity-60 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem disabled>Duplicar</DropdownMenuItem>

                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              Editar
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                  Essa despesa
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Esta despesa e as próximas
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Todas as despesas
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Deletar
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem variant="destructive">
                                Despesa desse mês
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive">
                                Despesa desse mês e dos próximos
                              </DropdownMenuItem>
                              <DropdownMenuItem variant="destructive">
                                Todas as despesas
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
