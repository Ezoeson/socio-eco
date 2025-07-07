"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  ChevronLeft,
  Fish,
  MoreHorizontal,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { EnqueteFormData } from "@/type/localType";
import FishermanTab from "./pecheur/FishermanTab";
import { MembreFamilleForm } from "./MembreFamilleForm";
import { Skeleton } from "../ui/skeleton";
import { ActiviteEconomiqueForm } from "./ActiviteEconomiqueForm";

export function ActeurDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;

  const [loading, setLoading] = useState(true);

  const [enqueteurs, setEnqueteurs] = useState<{ id: string; nom: string }[]>(
    []
  );
  const [secteurs, setSecteurs] = useState<{ id: string; nom: string }[]>([]);

  const [formData, setFormData] = useState<EnqueteFormData>({
    id: "",
    nomPerscible: "",
    nomRepondant: "",
    estPecheur: false,
    estCollecteur: false,
    touteActivite: false,
    membresFamille: [],
    Pecheur: [],
    activites: [],
    dateEnquete: new Date().toISOString().split("T")[0],
    enqueteurId: "",
    secteurId: "",
    ethnie: "",
    districtOrigine: "",
    anneeArriveeVillage: undefined,
    possessionAncienMetier: false,
    ancienMetier: "",
    localFokontany: false,
  });

  const tabsConfig = [
    {
      value: "general",
      label: "Informations générales",
      icon: User,
      show: true,
    },
    {
      value: "famille",
      label: "Famille",
      icon: Users,
      show: true,
    },
    {
      value: "pecheur",
      label: "Pêcheur",
      icon: Fish,
      show: formData?.estPecheur,
    },
    {
      value: "collecteur",
      label: "Collecteur",
      icon: ShoppingCart,
      show: formData?.estCollecteur,
    },
    {
      value: "autreActivite",
      label: "Autre activité",
      icon: MoreHorizontal,
      show: formData?.touteActivite,
    },
  ];

  const visibleTabs = tabsConfig?.filter((tab) => tab.show);
  const tabCount = visibleTabs?.length;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [enqueteursRes, secteursRes] = await Promise.all([
          fetch("/api/enqueteur"),
          fetch("/api/secteur"),
        ]);

        if (!enqueteursRes.ok || !secteursRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [enqueteursData, secteursData] = await Promise.all([
          enqueteursRes.json(),
          secteursRes.json(),
        ]);

        setEnqueteurs(enqueteursData);
        setSecteurs(secteursData.data);

        if (id) {
          const enqueteRes = await fetch(`/api/enquete_famille/${id}`);
          if (!enqueteRes.ok) throw new Error("Enquête non trouvée");

          const enqueteData = await enqueteRes.json();
          // Transformez la structure des données
          const transformedPecheur = enqueteData.pecheur
            ? {
                id: enqueteData.pecheur.id,
                PratiquePeche: enqueteData.pecheur.pratiquesPeche || [],
                EquipementPeche: enqueteData.pecheur.equipementsPeche || [],
                EmbarcationPeche: enqueteData.pecheur.embarcations || [],
                CircuitCommercial: enqueteData.pecheur.circuitsCommercial || [],
              }
            : null;

          setFormData({
            ...enqueteData,
            dateEnquete: enqueteData.dateEnquete.split("T")[0],
            Pecheur: transformedPecheur ? [transformedPecheur] : [],
          });
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des données initiales");
        if (id) router.push("/enquete");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        <div>
          <div className="grid w-full grid-cols-2 gap-2 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <Skeleton className="h-6 w-48 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card shadow-sm p-6">
              <Skeleton className="h-6 w-48 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-md space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">Details d&apos; Enquête</h2>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">
            {" "}
            Créée le {formData?.dateEnquete}{" "}
          </h1>
        </div>
      </div>

      <div>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList
            className="grid w-full  gap-2 "
            style={{
              gridTemplateColumns: `repeat(${tabCount}, minmax(0, 1fr))`,
            }}
          >
            {visibleTabs?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden md:block">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secteur *</Label>
                    <Select value={formData.secteurId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un secteur">
                          {formData.secteurId
                            ? secteurs.find((s) => s.id === formData.secteurId)
                                ?.nom
                            : "Non sélectionné"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {secteurs.map((sec) => (
                          <SelectItem key={sec.id} value={sec.id}>
                            {sec.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Enquêteur *</Label>
                    <Select value={formData.enqueteurId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un enquêteur">
                          {formData.enqueteurId
                            ? enqueteurs.find(
                                (e) => e.id === formData.enqueteurId
                              )?.nom
                            : "Non sélectionné"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {enqueteurs.map((enq) => (
                          <SelectItem key={enq.id} value={enq.id}>
                            {enq.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateEnquete">
                      Date de l&apos;enquête *
                    </Label>
                    <Input value={formData.dateEnquete} readOnly />
                  </div>

                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="estPecheur" checked={formData.estPecheur} />
                      <Label htmlFor="estPecheur">Est pêcheur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="estCollecteur"
                        checked={formData.estCollecteur}
                      />
                      <Label htmlFor="estCollecteur">Est collecteur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="touteActivite"
                        checked={formData.touteActivite}
                      />
                      <Label htmlFor="touteActivite">Autre activité</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomRepondant">Nom du répondant</Label>
                    <Input value={formData.nomRepondant || ""} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomPerscible">
                      Nom de la personne cible *
                    </Label>
                    <Input value={formData.nomPerscible || ""} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnie">Ethnie</Label>
                    <Input value={formData.ethnie || ""} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="districtOrigine">
                      District d&apos;origine
                    </Label>
                    <Input value={formData.districtOrigine || ""} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anneeArriveeVillage">
                      Année d&apos;arrivée au village
                    </Label>
                    <Input
                      value={formData.anneeArriveeVillage || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-y-2">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ancienMetier"
                        checked={formData.possessionAncienMetier || false}
                      />
                      <Label htmlFor="ancienMetier">
                        Possédait un ancien métier
                      </Label>
                    </div>

                    {formData.possessionAncienMetier && (
                      <div className="space-y-2">
                        <Label htmlFor="ancienMetierDesc">
                          Description de l&apos;ancien métier
                        </Label>
                        <Input
                          id="ancienMetierDesc"
                          value={formData.ancienMetier || ""}
                          readOnly
                        />
                      </div>
                    )}
                  </div>
                  {formData?.estCollecteur && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="localFokontany"
                        checked={formData.localFokontany}
                      />
                      <Label htmlFor="localFokontany">Issu du fokontany</Label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="famille">
            <Card>
              <CardHeader>
                <CardTitle>Composition familiale</CardTitle>
              </CardHeader>
              <CardContent>
                <MembreFamilleForm
                  membres={formData.membresFamille}
                  onChange={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {formData.estPecheur && (
            <TabsContent value="pecheur">
              <FishermanTab
                pecheur={formData.Pecheur?.[0] || { id: crypto.randomUUID() }}
                onPecheurChange={() => {}}
              />
            </TabsContent>
          )}

          {formData.estCollecteur && (
            <TabsContent value="collecteur">
              <Card>
                <CardHeader>
                  <CardTitle>Informations sur le collecteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Informations spécifiques au collecteur à venir.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          {formData.touteActivite && (
            <TabsContent value="autreActivite">
              <Card>
                <CardHeader>
                  <CardTitle>Informations sur les activites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActiviteEconomiqueForm
                    activites={formData.activites}
                    onChange={() => {}}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
