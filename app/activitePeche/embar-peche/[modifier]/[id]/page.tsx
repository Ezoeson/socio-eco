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
import { Skeleton } from "@/components/ui/skeleton";

type Pecheur = {
  id: string;
  enquete: { nomRepondant: string };
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.pecheurId) {
      toast.error("Veuillez sélectionner un pêcheur");
      return;
    }
    if (formData.proprietaire === null) {
      toast.error("Veuillez indiquer si l'embarcation est propriétaire");
      return;
    }

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
      setIsSubmitting(false);
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
          <Button
            className="cursor-pointer"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold">Modifier une embarcation</h2>
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
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    type="number"
                    value={formData.nombre || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombreEquipage">Nombre d&apos;équipage</Label>
                  <Input
                    id="nombreEquipage"
                    name="nombreEquipage"
                    type="number"
                    value={formData.nombreEquipage || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Propriétaire</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      className="cursor-pointer"
                      type="button"
                      variant={formData.proprietaire ? "default" : "outline"}
                      onClick={() => handleBooleanChange(true)}
                    >
                      Oui
                    </Button>
                    <Button
                      type="button"
                      className="cursor-pointer"
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
                  <div className="space-y-2">
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
            {/* Section Partage des captures */}
            <Card>
              <CardHeader>
                <CardTitle>Partage des captures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
            {/* Section Financement */}
            <Card>
              <CardHeader>
                <CardTitle>Financement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prixAcquisition">Prix d&apos;achat</Label>
                  <Input
                    id="coutAcquisition"
                    name="coutAcquisition"
                    type="number"
                    value={formData.coutAcquisition || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="typeFinancement">Type de Prêt</Label>
                  <Input
                    id="typeFinancement"
                    name="typeFinancement"
                    value={formData.typeFinancement}
                    onChange={handleChange}
                    className="uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="montantFinancement">Montant Prêt</Label>
                    <Input
                      id="montantFinancement"
                      name="montantFinancement"
                      type="number"
                      value={formData.montantFinancement || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="space-y-2">
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
            {/* Section Caractéristiques techniques */}
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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
                  <div className="space-y-2">
                    <Label htmlFor="ageMois">Âge (mois)</Label>
                    <Input
                      id="ageMois"
                      name="ageMois"
                      type="number"
                      value={formData.ageMois || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="space-y-2">
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
                  <div className="space-y-2">
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
          </div>

          <div className="flex justify-end gap-4">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => router.push("/activitePeche/embar-peche")}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? "Modification en cours..."
                : "Modifier l'embarcation"}
            </Button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
}
