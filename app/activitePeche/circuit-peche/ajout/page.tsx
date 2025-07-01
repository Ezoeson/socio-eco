"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Pecheur = {
  id: string;
  enquete: { nomRepondant: string };
};

type Destination = {
  nom: string;
  pourcentage: number;
};

export default function AjoutCircuitCommercial() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pecheurId: "",
    typeProduit: "",
    modeLivraison: "",
    dureeDeplacement: null as number | null,
    prixAvantCorona: null as number | null,
    prixApresCorona: null as number | null,
    prixPendantCorona: null as number | null,
    methodeDeconservation: "",
    avanceFinanciere: false,
    montantAvance: null as number | null,
    determinePrix: false,
    prixUnitaire: null as number | null,
    restrictionQuantite: false,
    quantiteLivree: null as number | null,
    modePaiement: "",
    periodeDemandeElevee: "",
    periodeDemandeFaible: "",

    destinations: [] as Destination[],
  });
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPecheurs = async () => {
      try {
        const response = await fetch("/api/pecheur");
        const data = await response.json();
        setPecheurOptions(data);
      } catch (error) {
        console.error("Error fetching pecheurs:", error);
      }
    };
    fetchPecheurs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/circ_commerc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout");

      toast.success("Circuit ajouté avec succès");
      router.push("/activitePeche/circuit-peche");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsLoading(false);
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
    field: keyof Destination,
    value: string | number
  ) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = {
      ...newDestinations[index],
      [field]: field === "pourcentage" ? Number(value) : (value as string),
    };
    setFormData((prev) => ({ ...prev, destinations: newDestinations }));
  };

  const addDestination = () => {
    setFormData((prev) => ({
      ...prev,
      destinations: [...prev.destinations, { nom: "", pourcentage: 0 }],
    }));
  };

  const removeDestination = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold">Ajouter un circuit commercial</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section Informations de base */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                          {pecheur.enquete.nomRepondant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeProduit">Type de produit</Label>
                  <Input
                    id="typeProduit"
                    name="typeProduit"
                    value={formData.typeProduit}
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
                <div className="flex items-center space-x-2 space-y-2">
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
                  <div className="space-y-2">
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

                <div className="flex items-center space-x-2 space-y-2">
                  <input
                    type="checkbox"
                    id="determinePrix"
                    name="determinePrix"
                    checked={formData.determinePrix}
                    onChange={handleChange}
                  />
                  <Label htmlFor="determinePrix">Faiseur de prix</Label>
                </div>
                {formData.determinePrix && (
                  <div className="space-y-2">
                    <Label htmlFor="prixUnitaire">Prix unitaire</Label>
                    <input
                      id="prixUnitaire"
                      name="prixUnitaire"
                      type="number"
                      value={formData.prixUnitaire || ""}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="restrictionQuantite"
                    name="restrictionQuantite"
                    checked={formData.restrictionQuantite}
                    onChange={handleChange}
                  />
                  <Label htmlFor="restrictionQuantite">
                    Limitation quantité
                  </Label>
                </div>

                {formData.restrictionQuantite && (
                  <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="modePaiement">Mode de paiement</Label>
                  <Input
                    id="modePaiement"
                    name="modePaiement"
                    value={formData.modePaiement}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Section Périodes */}
            <Card>
              <CardHeader>
                <CardTitle>Périodes de demande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="periodeDemandeElevee">
                    Période demande élevée
                  </Label>
                  <Input
                    id="periodeDemandeElevee"
                    name="periodeDemandeElevee"
                    value={formData.periodeDemandeElevee}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodeDemandeFaible">
                    Période demande faible
                  </Label>
                  <Input
                    id="periodeDemandeFaible"
                    name="periodeDemandeFaible"
                    value={formData.periodeDemandeFaible}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Prix et mode livraison et stockage */}
            <Card>
              <CardHeader>
                <CardTitle>Prix et mode de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="modeLivraison">Mode de livraison</Label>
                  <Input
                    id="modeLivraison"
                    name="modeLivraison"
                    value={formData.modeLivraison}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodeDeconservation">
                    Méthode de conservation
                  </Label>
                  <Input
                    id="methodeDeconservation"
                    name="methodeDeconservation"
                    value={formData.methodeDeconservation}
                    onChange={handleChange}
                  />
                </div>

                <div className=" gap-4">
                  <div className="space-y-2">
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prixAvantCorona">Prix avant COVID</Label>
                    <Input
                      id="prixAvantCorona"
                      name="prixAvantCorona"
                      type="number"
                      value={formData.prixAvantCorona || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
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
                <div className="space-y-2">
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

            {/* Section Destinations */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Destinations commerciales</CardTitle>
                  <Button type="button" size="sm" onClick={addDestination}>
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
                    <div className="col-span-5  space-y-2 ">
                      <Label>Nom destination</Label>
                      <Input
                        value={dest.nom}
                        onChange={(e) =>
                          handleDestinationChange(index, "nom", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-5 space-y-2">
                      <Label>Pourcentage (%)</Label>
                      <Input
                        type="number"
                        value={dest.pourcentage}
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
              onClick={() => router.push("/circuits-commerciaux")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
