"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
    Label,
} from "recharts";
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
import { useMemo } from "react";

interface ExpenseChartProps {
    chartData: ChartDataItem[];
    chartConfig: ChartConfig;
}

const resolveCssVar = ( c?: string ) => {
    if ( !c ) return undefined;
    const m = c.match( /var\((--[^)]+)\)/ );
    if ( !m ) return c;
    const raw = getComputedStyle( document.documentElement )
        .getPropertyValue( m[ 1 ] )
        .trim();
    return raw ? ( raw.includes( "%" ) ? `hsl(${ raw })` : raw ) : c;
};

const formatCurrency = ( v: number | string ) =>
    new Intl.NumberFormat( "pt-BR", { style: "currency", currency: "BRL" } )
        .format( typeof v === "number" ? v : Number( v ?? 0 ) );

export function ExpenseChart( { chartData, chartConfig }: ExpenseChartProps ) {
    const coloredData = useMemo<ChartDataItem[]>(
        () =>
            chartData.map( ( d ) => ( {
                ...d,
                fill: resolveCssVar( d.fill ) ?? d.fill ?? "#64748b",
            } ) ),
        [ chartData ]
    );

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
                    <BarChart data={coloredData} margin={{ top: 5, right: 5, left: 20, bottom: 5 }}>
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
                            width={50}
                            tickMargin={5}
                        >
                            <Label value="Real (R$)" angle={-90} position="left" offset={2} dy={-30} />
                        </YAxis>

                        <ChartTooltip
                            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                            content={
                                <ChartTooltipContent
                                    formatter={( value, name, item ) => {
                                        const leftLabel = chartConfig[ "visitors" ]?.label ?? ( name as string ) ?? "Valor";
                                        const indicatorColor =
                                            ( item?.payload as any )?.fill ||
                                            ( item?.color as string | undefined ) ||
                                            "#64748b";

                                        const formatted = formatCurrency(
                                            typeof value === "number" ? value : Number( value ?? 0 )
                                        );

                                        return (
                                            <>
                                                <div
                                                    className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                                                    style={{ backgroundColor: indicatorColor }}
                                                />
                                                <span className="text-muted-foreground">{leftLabel}</span>
                                                <div className="ml-auto font-mono font-medium tabular-nums">
                                                    {formatted}
                                                </div>
                                            </>
                                        );
                                    }}
                                />
                            }
                        />

                        <Bar dataKey="visitors" radius={[ 4, 4, 0, 0 ]}>
                            {coloredData.map( ( d, i ) => (
                                <Cell key={i} fill={d.fill as string} />
                            ) )}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
