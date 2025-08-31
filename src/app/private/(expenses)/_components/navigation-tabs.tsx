import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Modal } from "./modal";
import { monthList, yearOptions } from "../constants";
import { CreateExpenseCallback } from "../types";

interface NavigationTabsProps {
    selectedYear: string;
    onYearChange: ( year: string ) => void;
    onCreate: ( info: CreateExpenseCallback ) => void;
}

export function NavigationTabs( {
    selectedYear,
    onYearChange,
    onCreate,
}: NavigationTabsProps ) {
    return (
        <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
            <div className="flex items-start w-full gap-2">
                <div className="flex items-start gap-2 flex-1">
                    <ScrollArea className="grid pb-2" type="always">
                        <TabsList>
                            {monthList.map( ( month ) => (
                                <TooltipProvider key={month.value}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div>
                                                <TabsTrigger
                                                    value={month.value}
                                                    className="cursor-pointer capitalize"
                                                >
                                                    {month.label}
                                                </TabsTrigger>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{month.full}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) )}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <Select onValueChange={onYearChange} value={selectedYear}>
                        <SelectTrigger className="w-28">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {yearOptions.map( ( year ) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ) )}
                        </SelectContent>
                    </Select>
                </div>
                <Modal onCreate={onCreate} />
            </div>
        </div>
    );
}
