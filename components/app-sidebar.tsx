"use client";

import {
  Building,
  ClipboardList,
  // GalleryVerticalEnd,
  Globe,
  Home,
  Layers,
  Map,
  MapPin,
  PieChart,
  UserSearch,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
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
  // teams: [
  //   {
  //     name: "Magnirike",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   // {
  //   //   name: 'Acme Corp.',
  //   //   logo: AudioWaveform,
  //   //   plan: 'Startup',
  //   // },
  //   // {
  //   //   name: 'Evil Corp.',
  //   //   logo: Command,
  //   //   plan: 'Free',
  //   // },
  // ],
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
        {/* <TeamSwitcher teams={data.teams} /> */}
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
