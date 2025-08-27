import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useId, useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Button as AriaButton,
  Group,
  Input as AriaInput,
  NumberField,
} from "react-aria-components";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react"; // Adicione este import para um spinner
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "./searchable-select";
import axios from "axios";
import { categories, inputDescriptions } from "../constants";
import { apiFetch } from "@/lib/apiFetch";

interface ModalProps {
  onCreate?: ( info: { year: string; month: string } ) => void;
}

// Função utilitária para buscar a descrição pelo nome do campo
function getDescription( name: string ) {
  return (
    inputDescriptions.find( ( item ) => item.name === name )?.description || ""
  );
}
const FormSchema = z.object( {
  name: z
    .string()
    .min( 2, { message: "O título deve ter pelo menos 2 caracteres." } ),
  description: z.string(),
  category: z.string().nonempty( { message: "A categoria é obrigatória." } ),
  dueDay: z.number().min( 1 ).max( 31 ),
  startDate: z
    .string()
    .nonempty( { message: "A data de início é obrigatória." } ),
  amount: z.number().min( 0.01, { message: "O valor deve ser maior que zero." } ),
  paymentStatus: z.string(),
} );

export function Modal( { onCreate }: ModalProps ) {
  const [ open, setOpen ] = useState( false );

  const defaultValues = {
    name: "Internet",
    description: "",
    startDate: new Date().toISOString(),
    amount: 70,
    paymentStatus: "unpaid",
    dueDay: 10,
    category: "Casa",
  };

  const form = useForm<z.infer<typeof FormSchema>>( {
    resolver: zodResolver( FormSchema ),
    defaultValues,
  } );

  useEffect( () => {
    if ( open ) {
      form.reset( defaultValues );
    }
  }, [ open, form ] );

  async function onSubmit( data: z.infer<typeof FormSchema> ) {
    try {
      const res = await apiFetch( `/api/bff/expenses`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify( data ),
      } );

      if ( !res.ok ) {
        let msg = "Erro ao criar a despesa. Verifique os campos e tente novamente.";
        try {
          const payload = await res.json();
          msg = payload?.message || msg;
        } catch {
          /* ignore parse error */
        }
        throw new Error( msg );
      }

      toast.success( "Despesa criada com sucesso!" );
      setOpen( false );

      const start = new Date( data.startDate );
      const year = String( start.getFullYear() );
      const month = String( start.getMonth() + 1 ).padStart( 2, "0" );

      onCreate?.( { year, month } );
    } catch ( error ) {
      console.error( "Erro ao criar despesa:", error );
      toast.error( error instanceof Error ? error.message : "Erro ao criar a despesa." );
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusIcon size={16} aria-hidden="true" />
          Nova despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base font-semibold">
            Nova Despesa
          </DialogTitle>
          <div className="overflow-y-auto">
            <DialogDescription className="text-foreground" asChild>
              <div className="px-6 py-4">
                <div className="[&_strong]:text-foreground space-y-4 [&_strong]:font-semibold">
                  <div className="space-y-1">
                    <p>
                      <strong>Adicionar uma nova despesa ao sistema</strong>
                    </p>
                    <p>
                      Preencha os campos abaixo com os detalhes da despesa. Você
                      poderá editar estas informações posteriormente se
                      necessário.
                    </p>
                  </div>
                  <Form {...form}>
                    <form
                      id="dialog-form"
                      onSubmit={form.handleSubmit( onSubmit )}
                      className="space-y-6"
                    >
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">Título</FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "title" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                placeholder="Evolução de Obra"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">Descrição</FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "description" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="descrição da despesa"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">Categoria</FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "category" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <SearchableSelect
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Selecione uma categoria"
                                options={categories}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Due Day */}
                      <FormField
                        control={form.control}
                        name="dueDay"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">
                                Dia de Vencimento
                              </FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "dueDay" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <SearchableSelect
                                value={String( field.value )}
                                onChange={( val ) => field.onChange( Number( val ) )}
                                placeholder="Selecione o dia"
                                options={Array.from( { length: 31 }, ( _, i ) => ( {
                                  value: String( i + 1 ),
                                  label: String( i + 1 ),
                                } ) )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Start Date */}
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={( { field } ) => {
                          const id = useId();
                          const date = field.value
                            ? new Date( field.value )
                            : undefined;

                          return (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="mr-1">
                                  Data de Início
                                </FormLabel>
                                <TooltipProvider delayDuration={0}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span tabIndex={-1}>
                                        <HelpCircle
                                          size={16}
                                          className="text-muted-foreground cursor-pointer"
                                        />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="right"
                                      className="max-w-72"
                                    >
                                      {getDescription( "startDate" )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      id={id}
                                      variant="outline"
                                      className={cn(
                                        "group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
                                        !date && "text-muted-foreground"
                                      )}
                                    >
                                      <span
                                        className={cn(
                                          "truncate",
                                          !date && "text-muted-foreground"
                                        )}
                                      >
                                        {date
                                          ? format( date, "PPP", {
                                            locale: ptBR,
                                          } )
                                          : "Selecione uma data"}
                                      </span>
                                      <CalendarIcon
                                        size={16}
                                        className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                                        aria-hidden="true"
                                      />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={date}
                                      onSelect={( selected ) => {
                                        if ( selected ) {
                                          field.onChange(
                                            selected.toISOString()
                                          ); // salva no formato string
                                        }
                                      }}
                                      locale={ptBR}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      {/* Default Value */}
                      <FormField
                        control={form.control}
                        name="amount"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">
                                Valor Padrão
                              </FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "defaultValue" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <NumberField
                                value={field.value}
                                onChange={( value ) => field.onChange( value )}
                                formatOptions={{
                                  style: "currency",
                                  currency: "BRL",
                                  currencySign: "accounting",
                                  minimumFractionDigits: 2,
                                }}
                              >
                                <Group className="border-input doutline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive relative inline-flex h-9 w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] data-disabled:opacity-50 data-focus-within:ring-[3px]">
                                  <AriaInput className="bg-background text-foreground flex-1 px-3 py-2 tabular-nums" />
                                  <div className="flex h-[calc(100%+2px)] flex-col">
                                    <AriaButton
                                      slot="increment"
                                      className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <ChevronUpIcon
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    </AriaButton>
                                    <AriaButton
                                      slot="decrement"
                                      className="border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-foreground -me-px -mt-px flex h-1/2 w-6 flex-1 items-center justify-center border text-sm transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <ChevronDownIcon
                                        size={12}
                                        aria-hidden="true"
                                      />
                                    </AriaButton>
                                  </div>
                                </Group>
                              </NumberField>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Status */}
                      <FormField
                        control={form.control}
                        name="paymentStatus"
                        render={( { field } ) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel className="mr-1">
                                Status de Pagamento
                              </FormLabel>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span tabIndex={-1}>
                                      <HelpCircle
                                        size={16}
                                        className="text-muted-foreground cursor-pointer"
                                      />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="max-w-72"
                                  >
                                    {getDescription( "paymentStatus" )}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unpaid">Não pago</SelectItem>
                                <SelectItem value="paid">Pago</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
              </div>
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          {/* Botão de submit movido para o footer */}
          <Button
            type="submit"
            form="dialog-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Criando...
              </>
            ) : (
              "Criar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
