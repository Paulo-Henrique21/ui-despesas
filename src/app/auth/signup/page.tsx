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
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[!@#$%^&*]/, { message: "Must include a special character." })
      .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
      .regex(/[a-z]/, { message: "Must include a lowercase letter." })
      .regex(/[0-9]/, { message: "Must include a number." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export default function Signup() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const criteriaList = [
    { label: "one lowercase character", isValid: /[a-z]/.test(password) },
    { label: "one special character", isValid: /[!@#$%^&*]/.test(password) },
    { label: "one uppercase character", isValid: /[A-Z]/.test(password) },
    { label: "8 character minimum", isValid: password.length >= 8 },
    { label: "one number", isValid: /[0-9]/.test(password) },
    {
      label: "passwords match",
      isValid: password === confirmPassword && confirmPassword.length > 0,
    },
  ];

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.custom(
      (t) => (
        <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <CircleCheckIcon
                className="mt-0.5 shrink-0 text-emerald-500"
                size={16}
                aria-hidden="true"
              />
              <div className="flex grow justify-between gap-12">
                {/* <p className="text-sm">Message sent</p> */}
                <code>{JSON.stringify(data, null, 2)}</code>
              </div>
            </div>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              onClick={() => toast.dismiss(t)}
              aria-label="Close banner"
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </div>
        </div>
      ),
      { duration: 1000 } // Duration in milliseconds (3 seconds)
    );
  }

  return (
    <ContainerCenter>
      <div className="h-screen flex justify-center items-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Fill in the details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-lg space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setPassword(e.target.value);
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
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setConfirmPassword(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2 mt-4 text-xs whitespace-nowrap">
                  {criteriaList.map((criterion, index) => (
                    <div key={index} className="flex items-center">
                      {criterion.isValid ? (
                        <CircleCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <CircleX className="w-5 h-5 text-red-800" />
                      )}
                      <span
                        className={`ml-1.5 font-normal ${
                          criterion.isValid ? "text-green-500" : "text-red-800"
                        }`}
                      >
                        {criterion.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full mt-4">
                  Sign Up
                </Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline">
                    Login
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
