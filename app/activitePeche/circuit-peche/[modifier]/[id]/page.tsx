"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CircuitCommercial = {
  pecheurId: string;
  typeProduit: string | null;
  modeLivraison: string | null;
  dureeDeplacement: number | null;
  prixAvantCorona: number | null;
  prixApresCorona: number | null;
  prixPendantCorona: number | null;
  methodeDeconservation: string | null;
  avanceFinanciere: boolean;
  montantAvance: number | null;
  determinePrix: boolean;
  prixUnitaire: number | null;
  restrictionQuantite: boolean;
  quantiteLivree: number | null;
  modePaiement: string | null;
  periodeDemandeElevee: string | null;
  periodeDemandeFaible: string | null;
  partMarche: number | null;
  destinations: {
    nom: string | null;
    pourcentage: number | null;
  }[];
};

type Pecheur = {
  id: string;
  enquete: { nomEnquete: string };
};

const initialFormData: CircuitCommercial = {
  pecheurId: "",
  typeProduit: null,
  modeLivraison: null,
  dureeDeplacement: null,
  prixAvantCorona: null,
  prixApresCorona: null,
  prixPendantCorona: null,
  methodeDeconservation: null,
  avanceFinanciere: false,
  montantAvance: null,
  determinePrix: false,
  prixUnitaire: null,
  restrictionQuantite: false,
  quantiteLivree: null,
  modePaiement: null,
  periodeDemandeElevee: null,
  periodeDemandeFaible: null,
  partMarche: null,
  destinations: [],
};

export default function ModifierCircuitCommercial() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;
  const isEditMode = !!id;

  const [formData, setFormData] = useState<CircuitCommercial>(initialFormData);
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pecheursRes, circuitCommerceRes] = await Promise.all([
          fetch("/api/pecheur"),
          isEditMode ? fetch(`/api/circ_commerc/${params.id}`) : null,
        ]);

        const [pecheurs, circuitCommerceData] = await Promise.all([
          pecheursRes.json(),
          circuitCommerceRes?.json(),
        ]);

        setPecheurOptions(pecheurs);

        if (isEditMode && circuitCommerceData) {
          const { pecheur, ...cleanData } = circuitCommerceData;
          setFormData({
            ...cleanData,
            pecheurId: pecheur?.id || "",
            destinations: cleanData.destinations || [],
          });
        } else {
          setFormData(initialFormData);
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        isEditMode ? `/api/circ_commerc/${params.id}` : "/api/circ_commerc",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la soumission");

      toast.success(
        isEditMode ? "Circuit modifié avec succès" : "Circuit créé avec succès"
      );
      router.push("/activitePeche/circuit-peche");
    } catch (error) {
      console.error(error);
      toast.error(
        isEditMode
          ? "Erreur lors de la modification"
          : "Erreur lors de la création"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value
            ? parseFloat(value)
            : null
          : value,
    }));
  };

  const handleDestinationChange = (
    index: number,
    field: keyof CircuitCommercial["destinations"][0],
    value: string | number | null
  ) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = {
      ...newDestinations[index],
      [field]: field === "pourcentage" ? Number(value) : value,
    };
    setFormData((prev) => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setFormData((prev) => ({
      ...prev,
      destinations: [...prev.destinations, { nom: null, pourcentage: 0 }],
    }));
  };

  const removeDestination = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <Wrapper>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-9 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-9 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold">
            {isEditMode ? "Modifier" : "Créer"} un circuit commercial
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pecheurId">Pêcheur *</Label>
                  <Select
                    value={formData.pecheurId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pecheurId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pêcheur" />
                    </SelectTrigger>
                    <SelectContent>
                      {pecheurOptions.map((pecheur) => (
                        <SelectItem key={pecheur.id} value={pecheur.id}>
                          {pecheur.enquete.nomEnquete}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="typeProduit">Type de produit</Label>
                  <Input
                    id="typeProduit"
                    name="typeProduit"
                    value={formData.typeProduit || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="modeLivraison">Mode de livraison</Label>
                  <Input
                    id="modeLivraison"
                    name="modeLivraison"
                    value={formData.modeLivraison || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="methodeDeconservation">
                    Méthode de conservation
                  </Label>
                  <Input
                    id="methodeDeconservation"
                    name="methodeDeconservation"
                    value={formData.methodeDeconservation || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dureeDeplacement">
                      Durée de déplacement (jours)
                    </Label>
                    <Input
                      id="dureeDeplacement"
                      name="dureeDeplacement"
                      type="number"
                      value={formData.dureeDeplacement || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prixUnitaire">Prix unitaire</Label>
                    <Input
                      id="prixUnitaire"
                      name="prixUnitaire"
                      type="number"
                      value={formData.prixUnitaire || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Prix */}
            <Card>
              <CardHeader>
                <CardTitle>Prix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prixAvantCorona">Prix avant COVID</Label>
                    <Input
                      id="prixAvantCorona"
                      name="prixAvantCorona"
                      type="number"
                      value={formData.prixAvantCorona || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prixPendantCorona">
                      Prix pendant COVID
                    </Label>
                    <Input
                      id="prixPendantCorona"
                      name="prixPendantCorona"
                      type="number"
                      value={formData.prixPendantCorona || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="prixApresCorona">Prix après COVID</Label>
                  <Input
                    id="prixApresCorona"
                    name="prixApresCorona"
                    type="number"
                    value={formData.prixApresCorona || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Financement */}
            <Card>
              <CardHeader>
                <CardTitle>Financement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="avanceFinanciere"
                    name="avanceFinanciere"
                    checked={formData.avanceFinanciere}
                    onChange={handleChange}
                  />
                  <Label htmlFor="avanceFinanciere">Avance financière</Label>
                </div>

                {formData.avanceFinanciere && (
                  <div>
                    <Label htmlFor="montantAvance">Montant avance</Label>
                    <Input
                      id="montantAvance"
                      name="montantAvance"
                      type="number"
                      value={formData.montantAvance || ""}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="determinePrix"
                    name="determinePrix"
                    checked={formData.determinePrix}
                    onChange={handleChange}
                  />
                  <Label htmlFor="determinePrix">Prix déterminé</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restrictionQuantite"
                    name="restrictionQuantite"
                    checked={formData.restrictionQuantite}
                    onChange={handleChange}
                  />
                  <Label htmlFor="restrictionQuantite">
                    Restriction quantité
                  </Label>
                </div>

                {formData.restrictionQuantite && (
                  <div>
                    <Label htmlFor="quantiteLivree">Quantité livrée</Label>
                    <Input
                      id="quantiteLivree"
                      name="quantiteLivree"
                      type="number"
                      step="0.1"
                      value={formData.quantiteLivree || ""}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Périodes */}
            <Card>
              <CardHeader>
                <CardTitle>Périodes de demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="periodeDemandeElevee">
                    Période demande élevée
                  </Label>
                  <Input
                    id="periodeDemandeElevee"
                    name="periodeDemandeElevee"
                    value={formData.periodeDemandeElevee || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="periodeDemandeFaible">
                    Période demande faible
                  </Label>
                  <Input
                    id="periodeDemandeFaible"
                    name="periodeDemandeFaible"
                    value={formData.periodeDemandeFaible || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="partMarche">Part de marché (%)</Label>
                  <Input
                    id="partMarche"
                    name="partMarche"
                    type="number"
                    step="0.1"
                    value={formData.partMarche || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Destinations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Destinations commerciales</CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addDestination}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter destination
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.destinations.map((dest, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-end"
                  >
                    <div className="col-span-5">
                      <Label>Nom destination</Label>
                      <Input
                        value={dest.nom || ""}
                        onChange={(e) =>
                          handleDestinationChange(index, "nom", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-5">
                      <Label>Pourcentage (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={dest.pourcentage || ""}
                        onChange={(e) =>
                          handleDestinationChange(
                            index,
                            "pourcentage",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeDestination(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/activitePeche/circuit-peche")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? isEditMode
                  ? "Modification..."
                  : "Création..."
                : isEditMode
                ? "Modifier"
                : "Créer"}
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
