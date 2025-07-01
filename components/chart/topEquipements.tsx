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



const config = {
  count: {
    label: "Quantité",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;
interface StatData {
  topEquipements?: {
    equipement: string;
    count: number;
  }[];
}

export function TopEquipements({ data }: { data?: StatData["topEquipements"] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Équipements de Pêche</CardTitle>
        <CardDescription>Types les plus utilisés</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[250px] w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="equipement"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="hsl(221, 83%, 53%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
