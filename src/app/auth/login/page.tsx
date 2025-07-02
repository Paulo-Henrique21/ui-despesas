"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
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

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { loginUser } = useUser();


  // async function onSubmit(data: z.infer<typeof FormSchema>) {
  //   try {
  //     const response = await fetch("http://localhost:8000/api/users/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: data.email,
  //         password: data.password,
  //       }),
  //     });
  //     const responseUser = await response.json();
  //     console.log(responseUser);

  //     toast.custom(
  //       (t) => (
  //         <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
  //           <div className="flex gap-2">
  //             <div className="flex grow gap-3">
  //               <CircleCheckIcon
  //                 className="mt-0.5 shrink-0 text-emerald-500"
  //                 size={16}
  //                 aria-hidden="true"
  //               />
  //               <div className="flex grow justify-between gap-12">
  //                 <p className="text-sm">{responseUser.message}</p>
  //                 {/* <code>{JSON.stringify(data, null, 2)}</code> */}
  //               </div>
  //             </div>
  //             <Button
  //               variant="ghost"
  //               className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
  //               onClick={() => toast.dismiss(t)}
  //               aria-label="Close banner"
  //             >
  //               <XIcon
  //                 size={16}
  //                 className="opacity-60 transition-opacity group-hover:opacity-100"
  //                 aria-hidden="true"
  //               />
  //             </Button>
  //           </div>
  //         </div>
  //       ),
  //       { duration: 1000 } // Duration in milliseconds (3 seconds)
  //     );
  //   } catch (error) {
  //     console.error("Error during login:", error);
  //     toast.error("Login failed. Please try again.");
  //     return;
  //   }
  // }
  const router = useRouter();
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANTE: permite que o cookie HTTP-only venha da resposta
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseUser = await response.json();
      console.log(responseUser);

      if (response.ok && responseUser) {
        loginUser(responseUser.user)
        toast.success("Login realizado com sucesso!");
        // Aqui você pode salvar no estado/contexto apenas os dados do usuário, se quiser,
        // mas **não salve o token no localStorage nem no Cookies do frontend**
        router.push("/private");
      } else {
        toast.error(responseUser.message || "Falha no login.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please try again.");
      return;
    }
  }

  return (
    <ContainerCenter>
      <div className="h-screen flex justify-center items-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
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
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <Link href="#" className="ml-auto text-sm underline">
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input id="password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContainerCenter>
  );
}
