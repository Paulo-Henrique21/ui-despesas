import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { ChartDataItem } from "../types";
import { formatCurrency } from "@/lib/utils";

interface IndicatorCardsProps {
    categoriaTop: ChartDataItem;
    quantidadeContasNaoPagas: number;
    totalContasNaoPagas: number;
    totalMes: number;
    percentualPago: number;
    quantidadeContasTotal: number;
}

export function IndicatorCards( {
    categoriaTop,
    quantidadeContasNaoPagas,
    totalContasNaoPagas,
    totalMes,
    percentualPago,
    quantidadeContasTotal,
}: IndicatorCardsProps ) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Maior Categoria */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Maior Categoria</p>
                        <p className="text-2xl font-bold">{categoriaTop.browser}</p>
                        <p className="text-xs text-muted-foreground truncate">
                            total: {formatCurrency( categoriaTop.visitors )}
                        </p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </Card>

            {/* Gasto Mensal Total */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Gasto Mensal Total</p>
                        <p className="text-2xl font-bold">{formatCurrency( totalMes )}</p>
                        <p className="text-xs text-muted-foreground">
                            contas totais: {quantidadeContasTotal}
                        </p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                </div>
            </Card>

            {/* Gasto Mensal em Aberto */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Gasto Mensal em Aberto</p>
                        <p className="text-2xl font-bold">{formatCurrency( totalContasNaoPagas )}</p>
                        <p className="text-xs text-muted-foreground">
                            contas pendentes: {quantidadeContasNaoPagas}
                        </p>
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>
            </Card>

            {/* Contas Pagas */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1 mr-4">
                        <p className="text-sm text-muted-foreground">Contas Pagas</p>
                        <p className="text-2xl font-bold">{percentualPago}%</p>
                        <div className="space-y-1">
                            <Progress value={percentualPago} className="w-full h-2" />
                        </div>
                    </div>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </Card>
        </div>
    );
}
