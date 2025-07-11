import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Database, Fish, Users } from "lucide-react";

type StatsData = {
  totals: {
    enquetes: number;
    pecheurs: number;
    collecteurs: number;
    activites: number;
  };
};

export function StatsCards() {
  const [data, setData] = useState<StatsData>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };
    console.log(data);

    fetchStats();
  }, []);

  if (error) return <div>Error loading stats: {error}</div>;

  const stats = [
    {
      title: "Enquêtes Totales",
      value: data?.totals?.enquetes || 0,
      description: "Nombre total d'enquêtes réalisées",
      icon: Database,
      color: "text-blue-600",
    },
    {
      title: "Pêcheurs",
      value: data?.totals?.pecheurs || 0,
      description: "Nombre de pêcheurs enquêtés",
      icon: Fish,
      color: "text-cyan-600",
    },
    {
      title: "Collecteurs",
      value: data?.totals?.collecteurs || 0,
      description: "Nombre de collecteurs enquêtés",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Activités",
      value: data?.totals?.activites || 0,
      description: "Activités économiques recensées",
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <div className="text-2xl font-bold">{stat?.value}</div>
            )}
            <p className="text-xs text-muted-foreground">{stat?.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
