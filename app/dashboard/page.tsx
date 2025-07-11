"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "@/components/Wrapper";
import { StatsCards } from "@/components/chart/StatsCards";
import { Button } from "@/components/ui/button";
import { CalendarDays, Download, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState<any>([]);
  useEffect(() => {
    const recenteActivity = async () => {
      try {
        const data = await fetch("/api/dashboard/recenet-activity");
        const res = await data.json();

        setRecentActivity(res);
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Erreur lors du chargement des activites");
      }
    };
    recenteActivity();
  }, []);
  console.log(recentActivity);

  return (
    <Wrapper>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Tableau de Bord
              </h1>
              <p className="text-muted-foreground">
                Vue d&apos;ensemble des enquêtes socio-économiques
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CalendarDays className="h-4 w-4 mr-2" />
                Dernière mise à jour: Aujourd&apos;hui
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards />

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>
                Dernières enquêtes saisies et mises à jour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity?.map((activity: any, index: any) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "Pêcheur"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{activity.nom}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type} - {activity.region}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {activity.date}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
}
