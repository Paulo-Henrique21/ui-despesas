"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { ContainerCenter } from "@/components/customized/container-center";
import { useUser } from "@/hooks/user-context";

const FormSchema = z.object( {
  email: z.string().email( "Por favor, insira um email válido." ),
  password: z.string().min( 1, "Senha é obrigatória." ),
} );

export default function Login() {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState( false );
  const [ submitting, setSubmitting ] = useState( false );

  // Valores padrão para demonstração
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@exemplo.com";
  const demoPassword =
    process.env.NEXT_PUBLIC_DEMO_PASSWORD || "visitante@2025";

  const form = useForm( {
    resolver: zodResolver( FormSchema ),
    defaultValues: { email: demoEmail, password: demoPassword },
  } );

  const { loginUser } = useUser();
  const router = useRouter();

  const togglePasswordVisibility = () =>
    setIsPasswordVisible( ( prev ) => !prev );

  async function onSubmit( data: z.infer<typeof FormSchema> ) {
    try {
      const resp = await fetch( "/api/bff/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( { email: data.email, password: data.password } ),
      } );

      const payload = await resp.json().catch( () => ( {} as any ) );

      if ( resp.ok && payload?.user ) {
        loginUser( payload.user );
        toast.success( "Login realizado com sucesso!" );
        router.push( "/private" );
        return;
      }

      if ( resp.status === 502 ) {
        toast.error( "API indisponível no momento. Tente novamente em alguns segundos." );
        return;
      }

      toast.error( payload?.message || "Falha no login." );
    } catch ( e ) {
      console.error( "Login error:", e );
      toast.error( "Erro de rede. Tente novamente." );
    }
  }


  return (
    <ContainerCenter>
      <div className="flex justify-center items-center py-8 min-h-[calc(100vh-7rem)]">
        <div className="max-w-md w-full space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Digite o email e senha para fazer login em sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={( { field } ) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={( { field } ) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel>Senha</FormLabel>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              placeholder="senha"
                              className="pe-9"
                              type={isPasswordVisible ? "text" : "password"}
                              {...field}
                              disabled={submitting}
                            />
                            <button
                              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
                              type="button"
                              onClick={togglePasswordVisibility}
                              aria-label={
                                isPasswordVisible ? "Hide password" : "Show password"
                              }
                              aria-pressed={isPasswordVisible}
                              aria-controls="password"
                              disabled={submitting}
                            >
                              {isPasswordVisible ? (
                                <EyeOffIcon size={16} aria-hidden="true" />
                              ) : (
                                <EyeIcon size={16} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Entrando..." : "Login"}
                  </Button>
                </form>
              </Form>

              {/* Botão para entrar como visitante */}
              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    form.setValue( "email", demoEmail );
                    form.setValue( "password", demoPassword );
                    form.handleSubmit( onSubmit )();
                  }}
                  disabled={submitting}
                >
                  Entrar como visitante
                </Button>

                <div className="text-center text-xs text-muted-foreground space-y-2">
                  <div>
                    <span className="font-medium">Não tem uma conta?</span>{" "}
                    <Link
                      href="/auth/signup"
                      className="underline hover:text-foreground text-primary"
                    >
                      Cadastre-se aqui
                    </Link>
                  </div>
                  <div>
                    <span className="font-medium">Quer sua própria conta?</span>{" "}
                    Entre em contato pelo{" "}
                    <a
                      href="https://www.linkedin.com/in/paulo-henrique-souza-dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContainerCenter>
  );
}
