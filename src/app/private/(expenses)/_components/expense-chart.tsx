import { PieChart, Pie } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDataItem } from "../types";

interface ExpenseChartProps {
    chartData: ChartDataItem[];
    chartConfig: ChartConfig;
}

export function ExpenseChart( { chartData, chartConfig }: ExpenseChartProps ) {
    return (
        <Card className="flex flex-col shadow-none bg-background xl:col-span-1">
            <CardHeader className="items-center pb-0">
                <CardTitle>Distribuição por categoria</CardTitle>
                <CardDescription>Mês atual</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-1 gap-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-full max-w-[400px] xl:max-w-[300px]"
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
                            content={<ChartLegendContent nameKey="browser" />}
                            className="flex-wrap gap-2 *:basis-1/7 *:justify-start"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
