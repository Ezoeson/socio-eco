"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";

interface MembreFamille {
  id: string;
  nom: string;
  age?: number;
  ancienLieuResidence?: string;
  villageOrigine?: string;
  anneeArrivee?: number;
  niveauEducation?: string;
  lienFamilial?: string;
  sexe?: string;
  frequentationEcole?: boolean;
}

interface EnqueteFormData {
  id: string;
  nomPerscible: string;
  nomRepondant?: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete: string;
  enqueteurId: string;
  secteurId: string;
  membresFamille: MembreFamille[];
}

export function ActeurDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [enquete, setEnquete] = useState<EnqueteFormData | null>(null);
  const [enqueteurs, setEnqueteurs] = useState<{ id: string; nom: string }[]>(
    []
  );
  const [secteurs, setSecteurs] = useState<{ id: string; nom: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enqueteRes, enqueteursRes, secteursRes] = await Promise.all([
          fetch(`/api/enquete_famille/${id}`),
          fetch("/api/enqueteur"),
          fetch("/api/secteur"),
        ]);

        if (!enqueteRes.ok || !enqueteursRes.ok || !secteursRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [enqueteData, enqueteursData, secteursData] = await Promise.all([
          enqueteRes.json(),
          enqueteursRes.json(),
          secteursRes.json(),
        ]);

        setEnquete({
          ...enqueteData,
          dateEnquete: enqueteData.dateEnquete.split("T")[0],
        });
        setEnqueteurs(enqueteursData);
        setSecteurs(secteursData);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des données");
        router.push("/enquete");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-48" />
        </div>

        {/* En-tête avec avatar */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
        </div>

        {/* Formulaire skeleton */}
        <div>
          {/* Onglets */}
          <div className="grid w-full grid-cols-2 gap-2 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-6">
            {/* Carte générale */}
            <div className="rounded-lg border bg-card shadow-sm p-6">
              <Skeleton className="h-6 w-48 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Champs de formulaire */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              {/* Section conditionnelle */}
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

            {/* Carte famille */}
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

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!enquete) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Enquête non trouvée</p>
      </div>
    );
  }

  const getEnqueteurName = (id: string) => {
    return enqueteurs.find((e) => e.id === id)?.nom || "Inconnu";
  };

  const getSecteurName = (id: string) => {
    return secteurs.find((s) => s.id === id)?.nom || "Inconnu";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">Détails de l&apos;Enquête</h2>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Détails de l&apos;enquête</h1>
          <p className="text-gray-600">
            Informations complètes sur cette enquête
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informations générales
          </TabsTrigger>
          <TabsTrigger value="famille" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Famille
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informations de base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Secteur</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {getSecteurName(enquete.secteurId)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Enquêteur</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {getEnqueteurName(enquete.enqueteurId)}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date de l&apos;enquête</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {new Date(enquete.dateEnquete).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nom de la personne cible</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.nomPerscible}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Nom du répondant</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.nomRepondant || "Non renseigné"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Activités</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 space-y-1">
                    {enquete.estPecheur && <div>Pêcheur</div>}
                    {enquete.estCollecteur && <div>Collecteur</div>}
                    {enquete.touteActivite && <div>Autre activité</div>}
                    {!enquete.estPecheur &&
                      !enquete.estCollecteur &&
                      !enquete.touteActivite && (
                        <div>Aucune activité renseignée</div>
                      )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ethnie</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.ethnie || "Non renseigné"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>District d&apos;origine</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.districtOrigine || "Non renseigné"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Année d&apos;arrivée au village</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.anneeArriveeVillage || "Non renseigné"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Ancien métier</Label>
                  <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                    {enquete.possessionAncienMetier
                      ? enquete.ancienMetier || "Non spécifié"
                      : "Aucun ancien métier"}
                  </div>
                </div>
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
              {enquete.membresFamille.length === 0 ? (
                <div className="text-gray-500">
                  Aucun membre de famille enregistré
                </div>
              ) : (
                <div className="space-y-4">
                  {enquete.membresFamille.map((membre) => (
                    <Card key={membre.id} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nom</Label>
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                            {membre.nom}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Âge</Label>
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                            {membre.age || "Non renseigné"}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Lien familial</Label>
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                            {membre.lienFamilial || "Non renseigné"}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Sexe</Label>
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                            {membre.sexe || "Non renseigné"}
                          </div>
                        </div>

                        {/* special pour conjoint */}
                        {membre.lienFamilial === "Conjoint" && (
                          <div className="space-y-2">
                            <div className="space-y-2">
                              <Label>Village d&lsquo;origine</Label>
                              <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                                {membre.villageOrigine || "Non renseigné"}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Ancien lieu de résidence</Label>
                              <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                                {membre.ancienLieuResidence || "Non renseigné"}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Année d&apos;arrivée</Label>
                              <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                                {membre.anneeArrivee || "Non renseigné"}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Niveau d&lsquo;éducation</Label>
                          <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 ">
                            {membre.niveauEducation || "Non renseigné"}
                          </div>
                        </div>

                        {membre.lienFamilial === "ENFANT" && (
                          <div className="space-y-2">
                            <Label>Fréquentation scolaire</Label>
                            <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700">
                              {membre.frequentationEcole ? "Oui" : "Non"}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
