"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { ReactNode } from "react";

export function Navbar({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Despesas", href: "/private" },
    { label: "Dashboard", href: "#" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky flex justify-center top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 md:justify-center items-center mx-4 max-w-5xl">
          <div className="hidden md:flex w-full items-center">
            <nav>
              <ul className="flex items-center space-x-6 text-sm font-medium">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`transition-colors hover:text-foreground/80 ${
                        pathname === item.href
                          ? "text-primary font-semibold"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size={"icon"} className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <nav>
                <ul className="grid gap-6 px-2 py-6">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block hover:text-foreground/80 ${
                          pathname === item.href
                            ? "text-primary font-semibold"
                            : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
