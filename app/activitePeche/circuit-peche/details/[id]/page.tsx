"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Wrapper from "@/components/Wrapper";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface CircuitCommercialDetails {
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

  destinations: {
    nom: string | null;
    pourcentage: number | null;
  }[];
  pecheur: {
    id: string;
    enquete: {
      id: string;
      nomRepondant: string;
    };
  };
}

export default function CircuitCommercialDetailPage() {
  const router = useRouter();
  const [circuit, setCircuit] = useState<CircuitCommercialDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/circ_commerc/${params.id}`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setCircuit(data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Échec du chargement des données");
        toast.error("Impossible de charger les détails du circuit commercial");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

  if (error) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </Wrapper>
    );
  }

  if (!circuit) {
    return (
      <Wrapper>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p>Aucune donnée disponible</p>
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Détails du circuit commercial</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Pêcheur"
              value={circuit.pecheur.enquete.nomRepondant}
            />
            <DetailItem label="Type de produit" value={circuit.typeProduit} />
          </CardContent>
        </Card>
        {/* Section Financement */}
        <Card>
          <CardHeader>
            <CardTitle>Financement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Avance financière"
              value={circuit.avanceFinanciere ? "Oui" : "Non"}
            />

            {circuit.avanceFinanciere && (
              <DetailItem
                label="Montant avance"
                value={circuit.montantAvance}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem
                label="Faiseur de prix"
                value={circuit.determinePrix ? "Oui" : "Non"}
              />
              <DetailItem
                label="Prix unitaire"
                value={circuit.prixUnitaire || "Non spécifié"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Restriction quantité"
                value={circuit.restrictionQuantite ? "Oui" : "Non"}
              />

              {circuit.restrictionQuantite && (
                <DetailItem
                  label="Quantité livrée"
                  value={circuit.quantiteLivree}
                />
              )}
            </div>
            <DetailItem
              label="Mode de paiement"
              value={circuit.modePaiement || "Non spécifié"}
            />
          </CardContent>
        </Card>

        {/* Section Périodes */}
        <Card>
          <CardHeader>
            <CardTitle>Périodes de demande</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Période demande élevée"
              value={circuit.periodeDemandeElevee}
            />
            <DetailItem
              label="Période demande faible"
              value={circuit.periodeDemandeFaible}
            />
          </CardContent>
        </Card>
        {/* Section Prix et mode livraison */}
        <Card>
          <CardHeader>
            <CardTitle>Mode de livraison et conservation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem
                label="Mode de livraison"
                value={circuit.modeLivraison || "Non spécifié"}
              />
              <DetailItem
                label="Méthode de conservation"
                value={circuit.methodeDeconservation || "Non spécifié"}
              />
              <DetailItem
                label="Durée déplacement (jours)"
                value={
                  circuit.dureeDeplacement !== null
                    ? circuit.dureeDeplacement
                    : "Non spécifié"
                }
              />
            </div>
            <CardHeader>
              <CardTitle>Évolution des prix</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DetailItem
                label="Prix avant COVID"
                value={circuit.prixAvantCorona || "Non spécifié"}
              />
              <DetailItem
                label="Prix pendant COVID"
                value={circuit.prixPendantCorona || "Non spécifié"}
              />
              <DetailItem
                label="Prix après COVID"
                value={circuit.prixApresCorona || "Non spécifié"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section Destinations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Destinations commerciales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {circuit.destinations.length > 0 ? (
                circuit.destinations.map((dest, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    <div className="col-span-5">
                      <DetailItem label="Nom" value={dest.nom} />
                    </div>
                    <div className="col-span-5">
                      <DetailItem
                        label="Pourcentage"
                        value={dest.pourcentage}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  Aucune destination enregistrée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}

// Composant helper pour afficher les détails
function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null;
}) {
  const displayValue =
    value !== null && value !== undefined ? String(value) : "Non spécifié";
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{displayValue}</p>
    </div>
  );
}
