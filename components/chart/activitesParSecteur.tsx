"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const data = [
  { secteur: "Nord", peche: 20, agriculture: 15, artisanat: 8 },
  { secteur: "Sud", peche: 10, agriculture: 25, artisanat: 5 },
  { secteur: "Est", peche: 15, agriculture: 18, artisanat: 12 },
];

const config = {
  peche: {
    label: "Pêche",
    color: "hsl(221, 83%, 53%)",
  },
  agriculture: {
    label: "Agriculture",
    color: "hsl(213, 94%, 68%)",
  },
  artisanat: {
    label: "Artisanat",
    color: "hsl(221, 100%, 80%)",
  },
} satisfies ChartConfig;

export function ActivitesParSecteur() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Activités par Secteur</CardTitle>
        <CardDescription>Répartition des activités économiques</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[350px]">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="secteur"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="peche"
              stackId="a"
              fill="hsl(221, 83%, 53%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="agriculture"
              stackId="a"
              fill="hsl(213, 94%, 68%)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="artisanat"
              stackId="a"
              fill="hsl(221, 100%, 80%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
