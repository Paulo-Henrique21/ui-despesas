import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { ChartDataItem } from "../types";

interface IndicatorCardsProps {
    categoriaTop: ChartDataItem;
    quantidadeContasNaoPagas: number;
    totalContasNaoPagas: number;
    totalMes: number;
    percentualPago: number;
}

export function IndicatorCards( {
    categoriaTop,
    quantidadeContasNaoPagas,
    totalContasNaoPagas,
    totalMes,
    percentualPago,
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
                            totalizou R$ {categoriaTop.visitors.toFixed( 0 )}
                        </p>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
            </Card>

            {/* Contas Pendentes */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Contas Pendentes</p>
                        <p className="text-2xl font-bold">{quantidadeContasNaoPagas}</p>
                        <p className="text-xs text-muted-foreground">
                            R$ {totalContasNaoPagas.toFixed( 2 )} em aberto
                        </p>
                    </div>
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>
            </Card>

            {/* Total do mês */}
            <Card className="p-6 border rounded-lg shadow-none bg-background">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Total do mês</p>
                        <p className="text-2xl font-bold">R$ {totalMes.toFixed( 0 )}</p>
                        <p className="text-xs text-muted-foreground">valor total</p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
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
