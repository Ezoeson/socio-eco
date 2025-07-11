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
import * as XLSX from "xlsx";

interface Enquete {
  id: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  nomRepondant: string;
  dateEnquete?: string;
  enqueteur?: {
    nom: string;
    prenom: string;
  };
  secteur?: {
    nom: string;
    fokontany: {
      nom: string;
      commune: {
        nom: string;
        district: {
          nom: string;
          region: {
            nom: string;
          };
        };
      };
    };
  };
  membresFamille?: Array<{
    nom: string;
    age: number;
    sexe: string;
    lienFamilial: string;
  }>;
  pecheur?: any;
  collecteur?: any;
  activites?: Array<any>;
}

export default function Dashboard() {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/dashboard/recenet-activity");
      if (!response.ok) throw new Error("Erreur de réseau");
      const data = await response.json();
      setRecentActivity(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Erreur lors du chargement des activités");
    }
  };

  const flattenEnqueteData = (enquete: Enquete) => {
    const baseData = {
      "ID Enquête": enquete.id,
      "Date Enquête": enquete.dateEnquete
        ? new Date(enquete.dateEnquete).toLocaleDateString()
        : "N/A",
      Enquêteur: enquete.enqueteur
        ? `${enquete.enqueteur.prenom} ${enquete.enqueteur.nom}`
        : "N/A",
      "Nom Répondant": enquete.nomRepondant,
      Type: enquete.estPecheur
        ? "Pêcheur"
        : enquete.estCollecteur
        ? "Collecteur"
        : "Autre",
      Région:
        enquete.secteur?.fokontany?.commune?.district?.region?.nom || "N/A",
      District: enquete.secteur?.fokontany?.commune?.district?.nom || "N/A",
      Commune: enquete.secteur?.fokontany?.commune?.nom || "N/A",
      Fokontany: enquete.secteur?.fokontany?.nom || "N/A",
      Secteur: enquete.secteur?.nom || "N/A",
    };

    const membresData = (enquete.membresFamille || []).reduce(
      (acc, membre, index) => ({
        ...acc,
        [`Membre ${index + 1} - Nom`]: membre.nom,
        [`Membre ${index + 1} - Age`]: membre.age,
        [`Membre ${index + 1} - Sexe`]: membre.sexe,
        [`Membre ${index + 1} - Lien`]: membre.lienFamilial,
      }),
      {}
    );

    const pecheurData = enquete.pecheur
      ? {
          "Pêcheur - Année Début":
            enquete.pecheur.pratiquesPeche?.[0]?.anneeDebut || "N/A",
          "Pêcheur - Espèces":
            enquete.pecheur.pratiquesPeche
              ?.map((p: any) => p.especeCible)
              .join(", ") || "N/A",
          "Pêcheur - Équipements":
            enquete.pecheur.equipementsPeche
              ?.map((e: any) => `${e.typeEquipement} (${e.quantite}x)`)
              .join(", ") || "N/A",
          "Pêcheur - Embarcation":
            enquete.pecheur.EmbarcationPeche?.typeEmbarcation || "N/A",
          "Pêcheur - Circuits":
            enquete.pecheur.circuitsCommercial
              ?.map(
                (c: any) =>
                  `${c.typeProduit}: ${c.destinations
                    ?.map((d: any) => `${d.nom} (${d.pourcentage}%)`)
                    .join(", ")}`
              )
              .join("; ") || "N/A",
        }
      : {};

    const collecteurData = enquete.collecteur
      ? {
          "Collecteur - Produits":
            enquete.collecteur.produitsAchetes
              ?.map((p: any) => p.typeProduit)
              .join(", ") || "N/A",
          "Collecteur - Capital": enquete.collecteur.capitalTotal || "N/A",
        }
      : {};

    return {
      ...baseData,
      ...membresData,
      ...pecheurData,
      ...collecteurData,
    };
  };

  const handleExport = async () => {
    setIsExporting(true);
    toast.info("Préparation de l'exportation...");

    try {
      const response = await fetch("/api/enquete_famille");
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const result = await response.json();
      const enquetes = result?.data || [];

      if (enquetes.length === 0) {
        toast.warning("Aucune donnée à exporter");
        return;
      }

      // Préparation des données
      const mainSheetData = enquetes.map(flattenEnqueteData);

      // Création du classeur Excel
      const wb = XLSX.utils.book_new();

      // Feuille principale
      const wsMain = XLSX.utils.json_to_sheet(mainSheetData);
      XLSX.utils.book_append_sheet(wb, wsMain, "Enquêtes");

      // Feuille détaillée pour les membres de famille
      const membresSheetData = enquetes.flatMap((enquete: any) =>
        (enquete.membresFamille || []).map((membre: any) => ({
          "ID Enquête": enquete.id,
          Nom: membre.nom,
          Age: membre.age,
          Sexe: membre.sexe,
          "Lien Familial": membre.lienFamilial,
          "Niveau Éducation": membre.niveauEducation,
          "Ancien Lieu": membre.ancienLieuResidence,
          "Année Arrivée": membre.anneeArrivee,
        }))
      );

      if (membresSheetData.length > 0) {
        const wsMembres = XLSX.utils.json_to_sheet(membresSheetData);
        XLSX.utils.book_append_sheet(wb, wsMembres, "Membres");
      }

      // Export du fichier
      XLSX.writeFile(
        wb,
        `enquetes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success(`${enquetes.length} enquêtes exportées avec succès`);
    } catch (error) {
      console.error("Erreur export:", error);
      toast.error(
        `Échec de l'export: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleRefresh = () => {
    fetchRecentActivity();
    toast.info("Actualisation des données...");
  };

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
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button size="sm" onClick={handleExport} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exportation..." : "Exporter"}
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
                {recentActivity?.map((activity, index) => (
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
