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
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { produit: "Poisson", avant: 5000, pendant: 6000, après: 7500 },
  { produit: "Crevettes", avant: 8000, pendant: 6500, après: 10000 },
  { produit: "Crabe", avant: 12000, pendant: 9000, après: 15000 },
];

const config = {
  avant: {
    label: "Avant COVID",
    color: "hsl(221, 83%, 53%)",
  },
  pendant: {
    label: "Pendant COVID",
    color: "hsl(213, 94%, 68%)",
  },
  après: {
    label: "Après COVID",
    color: "hsl(221, 100%, 80%)",
  },
} satisfies ChartConfig;

export function PrixCOVID() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Évolution des Prix</CardTitle>
        <CardDescription>Impact de la COVID sur les prix</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={config}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="produit"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b" }}
                  padding={{ left: 20, right: 20 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b" }}
                  width={60}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="avant"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  dataKey="pendant"
                  stroke="hsl(213, 94%, 68%)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(213, 94%, 68%)" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  dataKey="après"
                  stroke="hsl(221, 100%, 80%)"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(221, 100%, 80%)" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
