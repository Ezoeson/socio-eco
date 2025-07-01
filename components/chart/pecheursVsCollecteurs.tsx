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
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = ["#3E63DD", "#0BD8B6"]; 

const config = {
  value: {
    label: "Total",
  },
  Pêcheurs: {
    label: "Pêcheurs",
    color: "hsl(221, 83%, 53%)", // Bleu
  },
  Collecteurs: {
    label: "Collecteurs",
    color: "hsl(0, 84%, 60%)", // Rouge
  },
} satisfies ChartConfig;

export function PecheursVsCollecteurs({
  data,
}: {
  data?: { pecheurs: number; collecteurs: number };
}) {
  const pieData = data
    ? [
        { name: "Pêcheurs", value: data.pecheurs }, // Doit être en premier pour COLORS[0] (bleu)
        { name: "Collecteurs", value: data.collecteurs }, // COLORS[1] (rouge)
      ]
    : [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Répartition Pêcheurs/Collecteurs</CardTitle>
        <CardDescription>Activités principales déclarées</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[250px] relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={config}>
              <PieChart width={400} height={250}>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ zIndex: 10 }}
                />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
