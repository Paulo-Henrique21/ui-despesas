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

            {/* Skeleton para os 4 cards de indicadores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[ 1, 2, 3, 4 ].map( ( i ) => (
                    <Card key={i} className="p-6 border rounded-lg shadow-none bg-background">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </Card>
                ) )}
            </div>

            {/* Skeleton para gráfico e tabela */}
            <div className="space-y-4 xl:space-y-0 xl:grid xl:grid-cols-3 xl:gap-4">
                {/* Skeleton do gráfico */}
                <Card className="flex flex-col shadow-none bg-background xl:col-span-1">
                    <CardHeader className="items-center pb-0">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-20 mt-1" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <Skeleton className="aspect-square w-full max-w-[250px] xl:max-w-[200px] rounded-full" />
                    </CardContent>
                </Card>

                {/* Skeleton da tabela */}
                <div className="xl:col-span-2">
                    <div className="bg-background rounded-md border flex flex-col h-[397px]">
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
                                    {[ 1, 2, 3, 4, 5, 6 ].map( ( i ) => (
                                        <div key={i} className="px-4 py-3">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
