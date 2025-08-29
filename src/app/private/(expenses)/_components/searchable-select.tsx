import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useId, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: ( value: string ) => void;
  options: Option[];
  placeholder?: string;
}

export function SearchableSelect( {
  value,
  onChange,
  options,
  placeholder,
}: SearchableSelectProps ) {
  const id = useId();
  const [ open, setOpen ] = useState( false );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
        >
          <span className={cn( "truncate", !value && "text-muted-foreground" )}>
            {value
              ? options.find( ( opt ) => opt.value === value )?.label
              : placeholder}
          </span>
          <ChevronDownIcon
            size={16}
            className="text-muted-foreground/80 shrink-0"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={`Buscar...`} />
          <CommandList
            onWheel={( e ) => e.stopPropagation()}
            className="max-h-40"
          >
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup>
              {options.map( ( opt ) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={( currentValue ) => {
                    onChange( currentValue );
                    setOpen( false );
                  }}
                >
                  {opt.label}
                  {value === opt.value && (
                    <CheckIcon size={16} className="ml-auto" />
                  )}
                </CommandItem>
              ) )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
