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

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ActiviteEconomique,
  EnqueteFormData,
  MembreFamille,
  Pecheur,
} from "@/type/localType";
import FishermanTab from "./pecheur/FishermanTab";
import { MembreFamilleForm } from "./MembreFamilleForm";
import { Skeleton } from "../ui/skeleton";
import { ActiviteEconomiqueForm } from "./ActiviteEconomiqueForm";

export function ActeurForm() {
  const router = useRouter();
  const [tabCount, setTabCount] = useState(2);
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
      show: true, // Toujours visible
    },
    {
      value: "famille",
      label: "Famille",
      icon: Users,
      show: true, // Toujours visible
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
  useEffect(() => {
    setTabCount(visibleTabs?.length);
  }, [visibleTabs?.length]);

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
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement des données initiales");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (
    field: keyof EnqueteFormData,
    value:
      | string
      | number
      | boolean
      | MembreFamille[]
      | Pecheur[]
      | ActiviteEconomique[]
      | undefined
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
      const response = await fetch("/api/enquete_famille", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());

      toast.success("Enquête enregistrée avec succès");
      router.push("/enquete");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'enregistrement");
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
      {/* En-tête... */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold">Enquête</h2>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Nouvelle Enquête</h1>
          <p className="text-gray-600">Enregistrer une nouvelle enquête</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
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

          {/* Contenu des onglets... */}
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

                <div className="grid md:grid-cols-2 gap-y-2">
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
                  {formData?.estCollecteur && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="localFokontany"
                        checked={formData.localFokontany}
                        onCheckedChange={(checked) =>
                          handleInputChange("localFokontany", checked)
                        }
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
                  onChange={(membres: MembreFamille[]) =>
                    handleInputChange("membresFamille", membres)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
          {formData.estPecheur && (
            <TabsContent value="pecheur">
              <FishermanTab
                pecheur={formData.Pecheur?.[0] || { id: crypto.randomUUID() }}
                onPecheurChange={(pecheur) =>
                  handleInputChange("Pecheur", [pecheur])
                }
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
                  {/* Contenu du collecteur à implémenter */}
                  <p>Informations spécifiques au collecteur à venir.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
          {formData?.touteActivite && (
            <TabsContent value="autreActivite">
              <Card>
                <CardHeader>
                  <CardTitle>Informations sur les activites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ActiviteEconomiqueForm
                    activites={formData.activites}
                    onChange={(activites: ActiviteEconomique[]) =>
                      handleInputChange("activites", activites)
                    }
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
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
            {isSubmitting ? "Enregistrement..." : "Enregistrer l'enquête"}
          </Button>
        </div>
      </form>
    </div>
  );
}
