"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { ChevronLeft, Save } from "lucide-react";
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
  enquete: { nomEnquete: string };
};

export default function AjoutEmbarcation() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pecheurId: "",
    typeEmbarcation: "",
    nombre: null as number | null,
    proprietaire: null as boolean | null,
    statutPropriete: "",
    nombreEquipage: null as number | null,
    partageCaptures: null as number | null,
    coutAcquisition: null as number | null,
    modeAcquisition: "",
    typeFinancement: "",
    montantFinancement: null as number | null,
    dureeFinancement: null as number | null,
    remboursementMensuel: null as number | null,
    systemePropulsion: "",
    longueur: null as number | null,
    capacitePassagers: null as number | null,
    ageMois: null as number | null,
    materiauxConstruction: "",
    typeBois: "",
    dureeVieEstimee: null as number | null,
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
      const response = await fetch("/api/embarc_peche", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout");

      toast.success("Embarcation ajoutée avec succès");
      router.push("/activitePeche/embar-peche");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseFloat(value) : null) : value,
    }));
  };

  const handleBooleanChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      proprietaire: value,
      ...(value === false ? { statutPropriete: "" } : {}),
    }));
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold">Ajouter une embarcation</h2>
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
                  <Label htmlFor="typeEmbarcation">
                    Type d&rsquo;embarcation
                  </Label>
                  <Input
                    id="typeEmbarcation"
                    name="typeEmbarcation"
                    value={formData.typeEmbarcation}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="number"
                      value={formData.nombre || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nombreEquipage">
                      Nombre d&apos;équipage
                    </Label>
                    <Input
                      id="nombreEquipage"
                      name="nombreEquipage"
                      type="number"
                      value={formData.nombreEquipage || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Propriétaire</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      type="button"
                      variant={formData.proprietaire ? "default" : "outline"}
                      onClick={() => handleBooleanChange(true)}
                    >
                      Oui
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.proprietaire === false ? "default" : "outline"
                      }
                      onClick={() => handleBooleanChange(false)}
                    >
                      Non
                    </Button>
                  </div>
                </div>

                {formData.proprietaire === false && (
                  <div>
                    <Label htmlFor="statutPropriete">Statut de propriété</Label>
                    <Input
                      id="statutPropriete"
                      name="statutPropriete"
                      value={formData.statutPropriete}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Caractéristiques techniques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="systemePropulsion">
                    Système de propulsion
                  </Label>
                  <Input
                    id="systemePropulsion"
                    name="systemePropulsion"
                    value={formData.systemePropulsion}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="longueur">Longueur (m)</Label>
                    <Input
                      id="longueur"
                      name="longueur"
                      type="number"
                      step="0.1"
                      value={formData.longueur || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacitePassagers">
                      Capacité passagers
                    </Label>
                    <Input
                      id="capacitePassagers"
                      name="capacitePassagers"
                      type="number"
                      value={formData.capacitePassagers || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ageMois">Âge (mois)</Label>
                    <Input
                      id="ageMois"
                      name="ageMois"
                      type="number"
                      value={formData.ageMois || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dureeVieEstimee">
                      Durée de vie estimée (ans)
                    </Label>
                    <Input
                      id="dureeVieEstimee"
                      name="dureeVieEstimee"
                      type="number"
                      value={formData.dureeVieEstimee || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="materiauxConstruction">
                    Matériaux de construction
                  </Label>
                  <Input
                    id="materiauxConstruction"
                    name="materiauxConstruction"
                    value={formData.materiauxConstruction}
                    onChange={handleChange}
                  />
                </div>

                {formData.materiauxConstruction
                  ?.toLowerCase()
                  .includes("bois") && (
                  <div>
                    <Label htmlFor="typeBois">Type de bois</Label>
                    <Input
                      id="typeBois"
                      name="typeBois"
                      value={formData.typeBois}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Financement */}
            <Card>
              <CardHeader>
                <CardTitle>Financement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coutAcquisition">
                    Coût d&apos;acquisition
                  </Label>
                  <Input
                    id="coutAcquisition"
                    name="coutAcquisition"
                    type="number"
                    value={formData.coutAcquisition || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="modeAcquisition">
                    Mode d&rsquo;acquisition
                  </Label>
                  <Input
                    id="modeAcquisition"
                    name="modeAcquisition"
                    value={formData.modeAcquisition}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="typeFinancement">Type de financement</Label>
                  <Input
                    id="typeFinancement"
                    name="typeFinancement"
                    value={formData.typeFinancement}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="montantFinancement">
                      Montant financement
                    </Label>
                    <Input
                      id="montantFinancement"
                      name="montantFinancement"
                      type="number"
                      value={formData.montantFinancement || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dureeFinancement">Durée (mois)</Label>
                    <Input
                      id="dureeFinancement"
                      name="dureeFinancement"
                      type="number"
                      value={formData.dureeFinancement || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="remboursementMensuel">
                    Remboursement mensuel
                  </Label>
                  <Input
                    id="remboursementMensuel"
                    name="remboursementMensuel"
                    type="number"
                    value={formData.remboursementMensuel || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section Partage des captures */}
            <Card>
              <CardHeader>
                <CardTitle>Partage des captures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="partageCaptures">
                    Partage des captures (%)
                  </Label>
                  <Input
                    id="partageCaptures"
                    name="partageCaptures"
                    type="number"
                    step="0"
                    value={formData.partageCaptures || ""}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/embarcations-peche")}
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
