"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calculator,
  Command,
  // Frame,
  GalleryVerticalEnd,
  HandCoins,
  // Home,
  // Map,
  // PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

// import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  // SidebarRail,
} from "@/components/ui/sidebar";
import { NavSection } from "./nav-section";
import { LucideIcon } from "lucide-react";

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface SidebarSubItem {
  title: string;
  url: string;
}

export interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SidebarSubItem[];
}

export interface SidebarSection {
  label: string | null;
  items: SidebarItem[];
}

export interface AppSidebarData {
  user: User;
  teams: Team[];
  sidebarSections: SidebarSection[];
}

const data: AppSidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  sidebarSections: [
    {
      label: "",
      items: [
        { title: "Despesas", url: "/private", icon: HandCoins },
        {
          title: "Calculadoras",
          url: "#",
          icon: Calculator,
          items: [
            { title: "Juros compostos", url: "/private/dashboard" },
            { title: "Juros simples", url: "#" },
          ],
        },
        {
          title: "Configurações",
          url: "#",
          icon: Settings2,
          items: [
            { title: "Perfil", url: "#" },
            { title: "Segurança", url: "#" },
            { title: "Notificações", url: "#" },
            { title: "Integrações", url: "#" },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="min-h-16 max-h-16 border-b">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {data.sidebarSections.map((section, index) => (
          <NavSection key={index} label={section.label} items={section.items} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
