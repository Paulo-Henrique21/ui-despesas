import { Loader2 } from "lucide-react";

interface ContentLoaderProps {
    message?: string;
}

export function ContentLoader( { message = "Carregando..." }: ContentLoaderProps ) {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground text-sm">{message}</p>
            </div>
        </div>
    );
}
