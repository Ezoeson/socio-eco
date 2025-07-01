"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";

const COLOR_PALETTE = [
  "#3E63DD", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];

export interface StatData {
  acquisitionEmbarcations?: {
    mode: string;
    count: number;
  }[];
}

export function AcquisitionEmbarcations({
  data,
}: {
  data?: StatData["acquisitionEmbarcations"];
}) {
  // Create color mapping
  const modeColorMap = new Map<string, string>();
  data?.forEach((entry, index) => {
    if (!modeColorMap.has(entry.mode)) {
      modeColorMap.set(entry.mode, COLOR_PALETTE[index % COLOR_PALETTE.length]);
    }
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Acquisition Embarcations</CardTitle>
        <CardDescription>Modes d&apos;obtention des bateaux</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={{
                pie: {
                  label: "Répartition",
                  color: "#3b82f6",
                },
                tooltip: {
                  label: "Mode",
                },
              }}
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ zIndex: 10 }}
                />
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="mode"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {(data ?? []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={modeColorMap.get(entry.mode) ?? "#3E63DD"}
                      fillOpacity={0.8}
                      stroke="white"
                      strokeWidth={2}
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

export default AcquisitionEmbarcations;
