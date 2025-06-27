"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { ChevronLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
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

type EmbarcationFormData = {
  pecheurId: string;
  typeEmbarcation: string;
  nombre: number | null;
  proprietaire: boolean | null;
  statutPropriete: string;
  nombreEquipage: number | null;
  partageCaptures: number | null;
  coutAcquisition: number | null;
  modeAcquisition: string;
  typeFinancement: string;
  montantFinancement: number | null;
  dureeFinancement: number | null;
  remboursementMensuel: number | null;
  systemePropulsion: string;
  longueur: number | null;
  capacitePassagers: number | null;
  ageMois: number | null;
  materiauxConstruction: string;
  typeBois: string;
  dureeVieEstimee: number | null;
};

export default function ModifEmbarcation() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;
  const isEditMode = !!id;

  const initialFormData: EmbarcationFormData = {
    pecheurId: "",
    typeEmbarcation: "",
    nombre: null,
    proprietaire: null,
    statutPropriete: "",
    nombreEquipage: null,
    partageCaptures: null,
    coutAcquisition: null,
    modeAcquisition: "",
    typeFinancement: "",
    montantFinancement: null,
    dureeFinancement: null,
    remboursementMensuel: null,
    systemePropulsion: "",
    longueur: null,
    capacitePassagers: null,
    ageMois: null,
    materiauxConstruction: "",
    typeBois: "",
    dureeVieEstimee: null,
  };

  const [formData, setFormData] =
    useState<EmbarcationFormData>(initialFormData);
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pecheursRes, embarcationRes] = await Promise.all([
          fetch("/api/pecheur"),
          isEditMode
            ? fetch(`/api/embarc_peche/${params.id}`)
            : Promise.resolve(null),
        ]);

        const pecheurs = await pecheursRes.json();
        setPecheurOptions(pecheurs);

        if (isEditMode && embarcationRes) {
          const embarcationData = await embarcationRes.json();
          // Nettoyage des données pour ne garder que le pecheurId
          const { pecheur, ...cleanData } = embarcationData;
          setFormData({
            ...cleanData,
            pecheurId: pecheur?.id || "",
          });
        }
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [params.id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.pecheurId) {
      toast.error("Veuillez sélectionner un pêcheur");
      return;
    }

    setIsLoading(true);

    try {
      // Création d'un objet de soumission propre
      const submissionData = {
        ...formData,
        // Conversion des champs vides en null pour la cohérence
        nombre: formData.nombre || null,
        nombreEquipage: formData.nombreEquipage || null,
        // ... autres champs numériques
      };

      const response = await fetch(`/api/embarc_peche/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Modification réussie");
      router.push("/activitePeche/embar-peche");
    } catch (error) {
      console.error("Erreur de soumission:", error);
      toast.error("Échec de la modification");
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
          <h2 className="text-3xl font-bold">
            {isEditMode
              ? "Modifier une embarcation"
              : "Ajouter une embarcation"}
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
                  <Label htmlFor="typeEmbarcation">
                    Type d&apos;embarcation
                  </Label>
                  <Input
                    id="typeEmbarcation"
                    name="typeEmbarcation"
                    value={formData.typeEmbarcation}
                    onChange={handleChange}
                    placeholder="Ex: Pirogue, Chalutier..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      type="number"
                      min="1"
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
                      min="0"
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
                      placeholder="Ex: Location, Prêt..."
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
                    placeholder="Ex: Moteur, Voile, Rame..."
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
                      min="0"
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
                      min="1"
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
                      min="0"
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
                      min="1"
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
                    placeholder="Ex: Bois, Fibre de verre, Métal..."
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
                      placeholder="Ex: Acajou, Teak..."
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
                    Coût d&lsquo;acquisition
                  </Label>
                  <Input
                    id="coutAcquisition"
                    name="coutAcquisition"
                    type="number"
                    min="0"
                    value={formData.coutAcquisition || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="modeAcquisition">
                    Mode d&lsquo;acquisition
                  </Label>
                  <Input
                    id="modeAcquisition"
                    name="modeAcquisition"
                    value={formData.modeAcquisition}
                    onChange={handleChange}
                    placeholder="Ex: Achat neuf, Occasion..."
                  />
                </div>

                <div>
                  <Label htmlFor="typeFinancement">Type de financement</Label>
                  <Input
                    id="typeFinancement"
                    name="typeFinancement"
                    value={formData.typeFinancement}
                    onChange={handleChange}
                    placeholder="Ex: Prêt bancaire, Autofinancement..."
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
                      min="0"
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
                      min="1"
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
                    min="0"
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
                    step="0.1"
                    min="0"
                    max="100"
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
              onClick={() => router.push("/activitePeche/embar-peche")}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? isEditMode
                  ? "Modification..."
                  : "Enregistrement..."
                : isEditMode
                ? "Modifier"
                : "Enregistrer"}
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
