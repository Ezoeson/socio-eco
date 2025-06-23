'use client';

import * as React from 'react';
import {
  Frame,
  // AudioWaveform,
  // Command,
  GalleryVerticalEnd,
  PieChart,
  SquareTerminal,
  Store,
  Waves,
  Workflow,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'Ezoeson',
    email: 'nambinintsoa6017@gmail.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Magnirike',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
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
      title: 'Enqueteur',
      url: '/enqueteur',
      icon: Store,
    },
    {
      title: 'Enquetes',
      url: '/enquete',
      icon: Store,
    },
    {
      title: 'Localisation',
      url: '#',
      icon: SquareTerminal,

      items: [
        {
          title: 'Region',
          url: '/localisation/region',
        },
        {
          title: 'District',
          url: '/localisation/district',
        },
        {
          title: 'Commune',
          url: '/localisation/commune',
        },
        {
          title: 'Fokontany',
          url: '/localisation/fokontany',
        },
        {
          title: 'Secteur',
          url: '/localisation/secteur',
        },
      ],
    },
    {
      title: 'Activite  Peches',
      url: '#',
      icon: Waves,
      items: [
        {
          title: 'PratiquePeche',
          url: '#',
        },
        {
          title: 'Equipement',
          url: '#',
        },
        {
          title: 'Embarcation',
          url: '#',
        },
        {
          title: 'Circuits commerciaux',
          url: '#',
        },
      ],
    },
    {
      title: 'Activites Collectes',
      url: '#',
      icon: Store,
      items: [
        {
          title: "Lieux d'approvisionnement",
          url: '#',
        },
        {
          title: 'Produits achetés',
          url: '#',
        },
        {
          title: 'Méthodes de stockage',
          url: '#',
        },
        {
          title: 'Canaux de distribution',
          url: '#',
        },
      ],
    },
    {
      title: 'Activités économiques',
      url: '#',
      icon: Workflow,
      items: [
        {
          title: 'Commerce de gros',
          url: '#',
        },
        {
          title: 'Agriculture',
          url: '#',
        },
        {
          title: 'Elevage',
          url: '#',
        },
        {
          title: ' Salariale',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Enqueteur',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Enquetes',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
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
