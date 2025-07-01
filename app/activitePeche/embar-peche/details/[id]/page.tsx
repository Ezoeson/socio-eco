"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Wrapper from "@/components/Wrapper";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface EmbarcationDetails {
  pecheurId: "";
  typeEmbarcation: "";
  nombre: null;
  proprietaire: null;
  statutPropriete: "";
  nombreEquipage: null;
  partageCaptures: null;
  coutAcquisition: null;
  modeAcquisition: "";
  typeFinancement: "";
  montantFinancement: null;
  dureeFinancement: null;
  remboursementMensuel: null;
  systemePropulsion: "";
  longueur: null;
  capacitePassagers: null;
  ageMois: null;
  materiauxConstruction: "";
  typeBois: "";
  dureeVieEstimee: null;
  pecheur: {
    id: string;
    enquete: {
      id: string;
      nomRepondant: string;
    };
  };
}

export default function EmbarcationDetailPage() {
  const router = useRouter();
  const [embarcation, setEmbarcation] = useState<EmbarcationDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/embarc_peche/${params.id}`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setEmbarcation(data);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError("Échec du chargement des données");
        toast.error("Impossible de charger les détails de l'embarcation");
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

  if (!embarcation) {
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
        <h2 className="text-2xl font-bold">Détails de l&apos;embarcation</h2>
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
              value={embarcation.pecheur.enquete.nomRepondant}
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Nombre" value={embarcation.nombre} />
              <DetailItem
                label="Nombre d'équipage"
                value={embarcation.nombreEquipage}
              />
            </div>

            <DetailItem
              label="Propriétaire"
              value={embarcation.proprietaire ? "Oui" : "Non"}
            />

            {!embarcation.proprietaire && (
              <DetailItem
                label="Statut de propriété"
                value={embarcation.statutPropriete}
              />
            )}
          </CardContent>
        </Card>
        {/* Section Partage des captures */}
        <Card>
          <CardHeader>
            <CardTitle>Partage des captures</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailItem
              label="Partage des captures (%)"
              value={embarcation.partageCaptures}
            />
          </CardContent>
        </Card>

        {/* Section Caractéristiques techniques */}
        <Card>
          <CardHeader>
            <CardTitle>Caractéristiques techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Type d'embarcation"
              value={embarcation.typeEmbarcation}
            />
            <DetailItem
              label="Système de propulsion"
              value={embarcation.systemePropulsion}
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Longueur (m)" value={embarcation.longueur} />
              <DetailItem
                label="Capacité passagers"
                value={embarcation.capacitePassagers}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="Âge (mois)" value={embarcation.ageMois} />
              <DetailItem
                label="Durée de vie estimée (ans)"
                value={embarcation.dureeVieEstimee}
              />
            </div>

            <DetailItem
              label="Matériaux de construction"
              value={embarcation.materiauxConstruction}
            />

            {embarcation.materiauxConstruction
              ?.toLowerCase()
              .includes("bois") && (
              <DetailItem label="Type de bois" value={embarcation.typeBois} />
            )}
          </CardContent>
        </Card>

        {/* Section Financement */}
        <Card>
          <CardHeader>
            <CardTitle>Financement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailItem
              label="Prix d'achat"
              value={embarcation.coutAcquisition}
            />
            <DetailItem
              label="Mode d'acquisition"
              value={embarcation.modeAcquisition}
            />
            <DetailItem
              label="Type de Prêt"
              value={embarcation.typeFinancement}
            />

            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Montant prêt"
                value={embarcation.montantFinancement}
              />
              <DetailItem
                label="Durée (mois)"
                value={embarcation.dureeFinancement}
              />
            </div>

            <DetailItem
              label="Remboursement mensuel"
              value={embarcation.remboursementMensuel}
            />
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
  value: string | number | null;
}) {
  const displayValue = value !== null ? value : "-";
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm">{displayValue}</p>
    </div>
  );
}
