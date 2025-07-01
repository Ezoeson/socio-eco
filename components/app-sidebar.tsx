"use client";

import * as React from "react";
import {
  Briefcase,
  Building,
  ClipboardList,
  GalleryVerticalEnd,
  Globe,
  Home,
  Layers,
  Map,
  MapPin,
  PieChart,
  RefreshCw,
  Settings,
  Ship,
  UserSearch,
  Waves,
  Fish,
  ShoppingCart,
  Warehouse,
  Package,
  Archive,
  Truck,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Ezoeson",
    email: "nambinintsoa6017@gmail.com",
    avatar: "",
  },
  teams: [
    {
      name: "Magnirike",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    // {
    //   name: 'Acme Corp.',
    //   logo: AudioWaveform,
    //   plan: 'Startup',
    // },
    // {
    //   name: 'Evil Corp.',
    //   logo: Command,
    //   plan: 'Free',
    // },
  ],
  navMain: [
    {
      title: "Enquêteur",
      url: "/enqueteur",
      icon: UserSearch,
    },
    {
      title: "Enquête",
      url: "/enquete",
      icon: ClipboardList,
    },
    {
      title: "Localisation",
      url: "",
      icon: Globe,
      items: [
        {
          title: "Région",
          url: "/localisation/region",
          icon: Map,
        },
        {
          title: "District",
          url: "/localisation/district",
          icon: MapPin,
        },
        {
          title: "Commune",
          url: "/localisation/commune",
          icon: Home,
        },
        {
          title: "Fokontany",
          url: "/localisation/fokontany",
          icon: Building,
        },
        {
          title: "Secteur",
          url: "/localisation/secteur",
          icon: Layers,
        },
      ],
    },
    {
      title: "Activité de pêche",
      url: "#",
      icon: Fish,
      items: [
        {
          title: "Pratique de pêche",
          url: "/activitePeche/pratique-peche",
          icon: Waves,
        },
        {
          title: "Embarcation",
          url: "/activitePeche/embar-peche",
          icon: Ship,
        },
        {
          title: "Équipement",
          url: "/activitePeche/equip-peche",
          icon: Settings,
        },

        {
          title: "Circuit commercial",
          url: "/activitePeche/circuit-peche",
          icon: RefreshCw,
        },
      ],
    },
    {
      title: "Activité de collecte",
      url: "",
      icon: ShoppingCart,
      items: [
        {
          title: "Lieu d'approvisionnement",
          url: "#",
          icon: Warehouse,
        },
        {
          title: "Produit acheté",
          url: "",
          icon: Package,
        },
        {
          title: "Méthode de stockage",
          url: "#",
          icon: Archive,
        },
        {
          title: "Canal de distribution",
          url: "#",
          icon: Truck,
        },
      ],
    },
    {
      title: "Activité économique",
      url: "#",
      icon: Briefcase,
      // items: [
      //   {
      //     title: "Commerce de gros",
      //     url: "#",
      //   },
      //   {
      //     title: "Agriculture",
      //     url: "#",
      //   },
      //   {
      //     title: "Élevage",
      //     url: "#",
      //   },
      //   {
      //     title: "Salariat",
      //     url: "#",
      //   },
      // ],
    },
  ],
  projects: [
    {
      name: "Enquêteur",
      url: "#",
      icon: UserSearch,
    },
    {
      name: "Enquêtes",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
