"use client";
import { useRouter } from "next/navigation";
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
  email: z.string().email( "Please enter a valid email." ),
  password: z.string().min( 6, "Password must be at least 6 characters." ),
} );

export default function Login() {
  const [ isPasswordVisible, setIsPasswordVisible ] = useState<boolean>( false );

  // Valores padrão para demonstração
  const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@exemplo.com";
  const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "visitante@2025";

  const form = useForm( {
    resolver: zodResolver( FormSchema ),
    defaultValues: {
      email: demoEmail,
      password: demoPassword,
    },
  } );
  const { loginUser } = useUser();

  const togglePasswordVisibility = () => setIsPasswordVisible( ( prevState ) => !prevState );

  const router = useRouter();
  async function onSubmit( data: z.infer<typeof FormSchema> ) {
    try {

      const response = await fetch( `/api/bff/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify( { email: data.email, password: data.password } ),
      } );

      const responseUser = await response.json();
      console.log( responseUser );

      if ( response.ok && responseUser ) {
        loginUser( responseUser.user )
        toast.success( "Login realizado com sucesso!" );
        router.push( "/private" );
      } else {
        toast.error( responseUser.message || "Falha no login." );
      }
    } catch ( error ) {
      console.error( "Error during login:", error );
      toast.error( "Login failed. Please try again." );
      return;
    }
  }

  return (
    <ContainerCenter>
      <div className="min-h-screen flex justify-center items-center py-8">
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
                <form
                  onSubmit={form.handleSubmit( onSubmit )}
                  className="space-y-5"
                >
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
                          {/* <Link href="#" className="ml-auto text-sm underline">
                            Forgot your password?
                          </Link> */}
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              placeholder="senha"
                              className="pe-9"
                              type={isPasswordVisible ? "text" : "password"}
                              {...field}
                            />
                            <button
                              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                              type="button"
                              onClick={togglePasswordVisibility}
                              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                              aria-pressed={isPasswordVisible}
                              aria-controls="password"
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
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </Form>

              {/* Botão para entrar como visitante */}
              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    form.setValue( 'email', demoEmail );
                    form.setValue( 'password', demoPassword );
                    form.handleSubmit( onSubmit )();
                  }}
                >
                  Entrar como visitante
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <span className="font-medium">Quer sua própria conta?</span> Entre em contato pelo{" "}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </ContainerCenter>
  );
}
