import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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
        <Card className="flex flex-col shadow-none bg-background rounded-lg">
            <CardHeader className="items-center pb-0">
                <CardTitle className="mb-2">Distribuição por categoria</CardTitle>
                <CardDescription>Mês atual</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-1 gap-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-video w-full h-[200px] sm:h-[250px] md:h-[300px]"
                >
                    <BarChart
                        data={chartData}
                        margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="browser"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            width={40}
                            tickMargin={5}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="visitors"
                            fill="var(--color-visitors)"
                            radius={[ 4, 4, 0, 0 ]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
