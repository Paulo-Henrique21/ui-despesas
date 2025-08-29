import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoadingSkeletonProps {
    showTabsHeader?: boolean;
}

export function LoadingSkeleton( { showTabsHeader = false }: LoadingSkeletonProps ) {
    return (
        <div className="space-y-4">
            {showTabsHeader && (
                <div className="flex gap-2 w-full">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-32 ml-auto" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[ 1, 2, 3, 4 ].map( ( i ) => (
                    <Card key={i} className="p-6 border rounded-lg shadow-none bg-background">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </Card>
                ) )}
            </div>

            <div className="space-y-4">
                <div>
                    <div className="bg-background rounded-md border flex flex-col h-[300px] sm:h-[350px] md:h-[416px]">
                        <div className="overflow-auto flex-1">
                            <div className="min-w-max w-full">
                                {/* Header da tabela */}
                                <div className="border-b bg-muted/50 px-4 py-3">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                                {/* Linhas da tabela */}
                                <div className="divide-y">
                                    {/* Mobile: 5 linhas, Tablet: 6 linhas, Desktop: 8 linhas */}
                                    {[ 1, 2, 3, 4, 5 ].map( ( i ) => (
                                        <div key={i} className="px-4 py-3 block sm:block">
                                            <div className="flex gap-4 items-center">
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                                <Skeleton className="h-8 w-14" />
                                                <Skeleton className="h-8 w-8 ml-auto" />
                                            </div>
                                        </div>
                                    ) )}
                                    {/* Linhas extras para tablets e desktop */}
                                    {[ 6, 7 ].map( ( i ) => (
                                        <div key={i} className="px-4 py-3 hidden sm:block md:block">
                                            <div className="flex gap-4 items-center">
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                                <Skeleton className="h-8 w-14" />
                                                <Skeleton className="h-8 w-8 ml-auto" />
                                            </div>
                                        </div>
                                    ) )}
                                    {/* Linha extra apenas para desktop */}
                                    <div className="px-4 py-3 hidden md:block">
                                        <div className="flex gap-4 items-center">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-6 w-16 rounded-full" />
                                            <Skeleton className="h-8 w-14" />
                                            <Skeleton className="h-8 w-8 ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skeleton do gráfico */}
                <Card className="flex flex-col rounded-lg shadow-none bg-background">
                    <CardHeader className="items-center pb-0">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-20 mt-1" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center flex-1 gap-4">
                        <div className="aspect-video w-full h-[200px] sm:h-[250px] md:h-[300px] flex items-end justify-center gap-2 px-4">
                            {/* Skeleton das barras do gráfico de colunas */}
                            <Skeleton className="w-8 h-[60%] rounded-t" />
                            <Skeleton className="w-8 h-[85%] rounded-t" />
                            <Skeleton className="w-8 h-[45%] rounded-t" />
                            <Skeleton className="w-8 h-[70%] rounded-t" />
                            <Skeleton className="w-8 h-[30%] rounded-t" />
                            <Skeleton className="w-8 h-[55%] rounded-t" />
                            <Skeleton className="w-8 h-[25%] rounded-t" />
                            <Skeleton className="w-8 h-[40%] rounded-t" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
