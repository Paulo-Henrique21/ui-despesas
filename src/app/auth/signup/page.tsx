"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CircleCheck, CircleCheckIcon, CircleX, XIcon } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { ContainerCenter } from "@/components/customized/container-center";

const FormSchema = z
  .object( {
    name: z.string().min( 2, { message: "Nome deve ter pelo menos 2 caracteres." } ),
    email: z.string().email( { message: "Endereço de email inválido." } ),
    password: z
      .string()
      .min( 8, { message: "Senha deve ter pelo menos 8 caracteres." } )
      .regex( /[!@#$%^&*]/, { message: "Deve incluir um caractere especial." } )
      .regex( /[A-Z]/, { message: "Deve incluir uma letra maiúscula." } )
      .regex( /[a-z]/, { message: "Deve incluir uma letra minúscula." } )
      .regex( /[0-9]/, { message: "Deve incluir um número." } ),
    confirmPassword: z.string(),
    authPassword: z.string().min( 1, { message: "Senha de autorização é obrigatória." } ),
  } )
  .refine( ( data ) => data.password === data.confirmPassword, {
    path: [ "confirmPassword" ],
    message: "Senhas não coincidem.",
  } );

export default function Signup() {
  const [ password, setPassword ] = useState( "" );
  const [ confirmPassword, setConfirmPassword ] = useState( "" );
  const [ isSubmitting, setIsSubmitting ] = useState( false );

  const form = useForm( {
    resolver: zodResolver( FormSchema ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      authPassword: "",
    },
  } );

  const criteriaList = [
    { label: "uma letra minúscula", isValid: /[a-z]/.test( password ) },
    { label: "um caractere especial", isValid: /[!@#$%^&*]/.test( password ) },
    { label: "uma letra maiúscula", isValid: /[A-Z]/.test( password ) },
    { label: "mínimo 8 caracteres", isValid: password.length >= 8 },
    { label: "um número", isValid: /[0-9]/.test( password ) },
    {
      label: "senhas coincidem",
      isValid: password === confirmPassword && confirmPassword.length > 0,
    },
  ];

  function onSubmit( data: z.infer<typeof FormSchema> ) {
    handleSignup( data );
  }

  async function handleSignup( data: z.infer<typeof FormSchema> ) {
    setIsSubmitting( true );
    try {
      const response = await fetch( "/api/bff/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify( {
          name: data.name,
          email: data.email,
          password: data.password,
          registerPassword: data.authPassword,
        } ),
      } );

      if ( !response.ok ) {
        const errorData = await response.json().catch( () => ( {} ) );
        throw new Error( errorData.message || "Erro ao criar conta" );
      }

      toast.success( "Conta criada com sucesso! Você será redirecionado para o login." );

      // Redirecionar para login após 2 segundos
      setTimeout( () => {
        window.location.href = "/auth/login";
      }, 2000 );

    } catch ( error ) {
      console.error( "Erro no cadastro:", error );
      toast.error( error instanceof Error ? error.message : "Erro ao criar conta" );
    } finally {
      setIsSubmitting( false );
    }
  }

  return (
    <ContainerCenter>
      <div className="min-h-[calc(100vh-7rem)] flex justify-center items-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit( onSubmit )}
                className="w-full max-w-lg space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={( { field } ) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={( { field } ) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={( { field } ) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Sua senha"
                          {...field}
                          onChange={( e ) => {
                            field.onChange( e );
                            setPassword( e.target.value );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={( { field } ) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirme sua senha"
                          {...field}
                          onChange={( e ) => {
                            field.onChange( e );
                            setConfirmPassword( e.target.value );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authPassword"
                  render={( { field } ) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Senha de Autorização</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Senha fornecida pelo administrador"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs whitespace-nowrap">
                  {criteriaList.map( ( criterion, index ) => (
                    <div key={index} className="flex items-center">
                      {criterion.isValid ? (
                        <CircleCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <CircleX className="w-5 h-5 text-red-800" />
                      )}
                      <span
                        className={`ml-1.5 font-normal ${ criterion.isValid ? "text-green-500" : "text-red-800"
                          }`}
                      >
                        {criterion.label}
                      </span>
                    </div>
                  ) )}
                </div>

                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Criando conta..." : "Criar Conta"}
                </Button>
                <div className="mt-4 text-center text-xs text-muted-foreground">
                  <span className="font-medium">Já tem uma conta?</span>{" "}
                  <Link href="/auth/login" className="underline hover:text-foreground text-primary">
                    Entrar
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ContainerCenter>
  );
}
