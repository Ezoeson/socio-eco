"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ChevronLeft, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { MembreFamilleForm } from "@/components/forms/MembreFamilleForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

export function ActeurEditForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    dateEnquete: new Date().toISOString().split("T")[0],
    enqueteurId: "",
    secteurId: "",
  });

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
        setSecteurs(secteursData);

        // Charger les données de l'enquête seulement si on est en mode édition
        if (id) {
          const enqueteRes = await fetch(`/api/enquete_famille/${id}`);
          if (!enqueteRes.ok) {
            throw new Error("Enquête non trouvée");
          }
          const enqueteData = await enqueteRes.json();
          setFormData({
            ...enqueteData,
            dateEnquete: enqueteData.dateEnquete.split("T")[0],
          });
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des données initiales");
        if (id) {
          router.push("/enquete");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id, router]);

  const handleInputChange = (
    field: keyof EnqueteFormData,
    value: string | number | boolean | undefined | MembreFamille[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (
    field: "secteurId" | "enqueteurId",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateEnquete = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/enquete_famille/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          // On peut ajouter ici des champs spécifiques pour la modification si nécessaire
          // Par exemple, on pourrait vouloir suivre qui a modifié l'enquête
          //   updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      return response.json();
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !formData.nomPerscible ||
      !formData.enqueteurId ||
      !formData.secteurId
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      setIsSubmitting(false);
      return;
    }

    try {
      if (id) {
        // Mode modification
        await handleUpdateEnquete();
        toast.success("Enquête mise à jour avec succès");
      } else {
        // Mode création
        const response = await fetch("/api/enquete_famille", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error(await response.text());

        toast.success("Enquête enregistrée avec succès");
      }

      router.push("/enquete");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(
        `Erreur lors de ${id ? "la mise à jour" : "l'enregistrement"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">
          {id ? "Modifier" : "Nouvelle"} Enquête
        </h2>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">
            {id ? "Modifier l'enquête" : "Nouvelle Enquête"}
          </h1>
          <p className="text-gray-600">
            {id
              ? "Modifier les détails de l'enquête"
              : "Enregistrer une nouvelle enquête"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
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
                  {/* Secteur - Version améliorée */}
                  <div className="space-y-2">
                    <Label>Secteur *</Label>
                    <Select
                      value={formData.secteurId}
                      onValueChange={(value) =>
                        handleSelectChange("secteurId", value)
                      }
                    >
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

                  {/* Enquêteur */}
                  <div className="space-y-2">
                    <Label>Enquêteur *</Label>
                    <Select
                      value={formData.enqueteurId}
                      onValueChange={(value) =>
                        handleSelectChange("enqueteurId", value)
                      }
                    >
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ... autres champs */}

                    <div className="space-y-2">
                      <Label htmlFor="dateEnquete">
                        Date de l&apos;enquête *
                      </Label>
                      <Input
                        id="dateEnquete"
                        type="date"
                        value={formData.dateEnquete}
                        onChange={(e) =>
                          handleInputChange("dateEnquete", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  {/* Checkboxes groupées */}
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="estPecheur"
                        checked={formData.estPecheur}
                        onCheckedChange={(checked) =>
                          handleInputChange("estPecheur", checked)
                        }
                      />
                      <Label htmlFor="estPecheur">Est pêcheur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="estCollecteur"
                        checked={formData.estCollecteur}
                        onCheckedChange={(checked) =>
                          handleInputChange("estCollecteur", checked)
                        }
                      />
                      <Label htmlFor="estCollecteur">Est collecteur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="touteActivite"
                        checked={formData.touteActivite}
                        onCheckedChange={(checked) =>
                          handleInputChange("touteActivite", checked)
                        }
                      />
                      <Label htmlFor="touteActivite">Autre activité</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomRepondant">Nom du répondant</Label>
                    <Input
                      id="nomRepondant"
                      value={formData.nomRepondant || ""}
                      onChange={(e) =>
                        handleInputChange("nomRepondant", e.target.value)
                      }
                      placeholder="Nom de la personne interrogée"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nomEnquete">
                      Nom de la personne cible *
                    </Label>
                    <Input
                      id="nomEnquete"
                      value={formData.nomPerscible || ""}
                      onChange={(e) =>
                        handleInputChange("nomPerscible", e.target.value)
                      }
                      placeholder="Nom de l'enquête"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnie">Ethnie</Label>
                    <Input
                      id="ethnie"
                      value={formData.ethnie || ""}
                      onChange={(e) =>
                        handleInputChange("ethnie", e.target.value)
                      }
                      placeholder="Ethnie"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="districtOrigine">
                      District d&apos;origine
                    </Label>
                    <Input
                      id="districtOrigine"
                      value={formData.districtOrigine || ""}
                      onChange={(e) =>
                        handleInputChange("districtOrigine", e.target.value)
                      }
                      placeholder="District d'origine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anneeArrivee">
                      Année d&apos;arrivée au village
                    </Label>
                    <Input
                      id="anneeArrivee"
                      type="number"
                      value={formData.anneeArriveeVillage || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "anneeArriveeVillage",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      placeholder="Année d'arrivée"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ancienMetier"
                      checked={formData.possessionAncienMetier || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("possessionAncienMetier", checked)
                      }
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
                        onChange={(e) =>
                          handleInputChange("ancienMetier", e.target.value)
                        }
                        placeholder="Décrire l'ancien métier"
                      />
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
                  onChange={(membres) =>
                    handleInputChange("membresFamille", membres)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/enquete")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Modification en cours..." : "Modifier l'enquête"}
          </Button>
        </div>
      </form>
    </div>
  );
}
