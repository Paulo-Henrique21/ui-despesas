"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/hooks/user-context";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavUser() {
  const { user, logoutUser, loading, isLoggingOut } = useUser();
  const [ isProcessingLogout, setIsProcessingLogout ] = useState( false );

  const { isMobile } = useSidebar();
  const router = useRouter();

  async function handleLogout() {
    if ( isProcessingLogout ) return; // Evita cliques múltiplos

    setIsProcessingLogout( true );

    try {
      // Usa o BFF em vez de chamar a API diretamente
      await fetch( "/api/bff/users/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      } );

      // Limpa o estado do contexto do usuário
      logoutUser();

      // Limpa qualquer cache do navegador
      if ( 'caches' in window ) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map( cacheName => caches.delete( cacheName ) )
        );
      }

      // Força uma navegação completa (não client-side routing) para garantir que o middleware seja executado
      window.location.href = "/auth/login";
    } catch ( error ) {
      console.error( "Erro ao fazer logout:", error );
      // Mesmo se houver erro na API, ainda redireciona para o login
      logoutUser();
      window.location.href = "/auth/login";
    } finally {
      setIsProcessingLogout( false );
    }
  }

  if ( loading || isLoggingOut ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if ( !user ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="p-2 text-sm">Usuário não autenticado</div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.avatar || "/default-avatar.png"}
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.[ 0 ]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.name || "Usuário"}
                </span>
                <span className="truncate text-xs">
                  {user?.email || "email@exemplo.com"}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.avatar || "/default-avatar.png"}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.[ 0 ]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.name || "Usuário"}
                  </span>
                  <span className="truncate text-xs">
                    {user?.email || "email@exemplo.com"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isProcessingLogout}>
              {isProcessingLogout ? <Loader2 className="animate-spin" /> : <LogOut />}
              {isProcessingLogout ? "Saindo..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
