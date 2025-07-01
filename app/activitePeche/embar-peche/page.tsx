"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, Ship, Eye } from "lucide-react";
import { useEffect, useState } from "react";

import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type EmbarcationPeche = {
  id: string;
  nombre: number | null;
  proprietaire: boolean | null;
  statutPropriete: string | null;
  nombreEquipage: number | null;
  partageCaptures: number | null;
  coutAcquisition: number | null;
  modeAcquisition: string | null;
  typeFinancement: string | null;
  montantFinancement: number | null;
  dureeFinancement: number | null;
  remboursementMensuel: number | null;
  typeEmbarcation: string | null;
  systemePropulsion: string | null;
  longueur: number | null;
  capacitePassagers: number | null;
  ageMois: number | null;
  materiauxConstruction: string | null;
  typeBois: string | null;
  dureeVieEstimee: number | null;
  pecheurId: string;
  pecheur: { id: string; enquete: { nomRepondant: string } } | null;
};

type Pecheur = {
  id: string;
  enquete: { nomRepondant: string };
};

export default function EmbarcationsPeche() {
  const [embarcations, setEmbarcations] = useState<EmbarcationPeche[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmbarcations = async () => {
      try {
        const response = await fetch("/api/embarc_peche");
        const data = await response.json();
        setEmbarcations(data);
      } catch (error) {
        console.error("Error fetching embarcations:", error);
      }
    };

    const fetchPecheurs = async () => {
      try {
        const response = await fetch("/api/pecheur");
        const data = await response.json();
        setPecheurOptions(data);
      } catch (error) {
        console.error("Error fetching pecheurs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmbarcations();
    fetchPecheurs();
  }, []);

  const filteredEmbarcations = embarcations.filter(
    (embarcation) =>
      (embarcation?.pecheur?.enquete?.nomRepondant &&
        embarcation.pecheur.enquete.nomRepondant
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (embarcation?.typeEmbarcation &&
        embarcation.typeEmbarcation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const handleDelete = () => {
    if (!deletingId) return;

    fetch(`/api/embarc_peche/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'embarcation");
        }
        return response.json();
      })
      .then(() => {
        setEmbarcations((prev) =>
          prev.filter((embarcation) => embarcation.id !== deletingId)
        );
        toast("Suppression réussie");
      })
      .catch((error) => {
        console.error("Erreur:", error);
        toast("Erreur lors de la suppression");
      })
      .finally(() => {
        setIsDeleteModal(false);
        setDeletingId(null);
      });
  };

  const getPecheurName = (pecheurId: string) => {
    const pecheur = pecheurOptions.find((p) => p.id === pecheurId);
    return pecheur?.enquete?.nomRepondant || "Inconnu";
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Ship className="h-8 w-8 text-blue-600" />
              Gestion des Embarcations de Pêche
            </h2>
            <p className="text-gray-600">
              Enregistrement des embarcations utilisées par les pêcheurs
            </p>
          </div>
          <div>
            <Link href="/activitePeche/embar-peche/ajout">
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle embarcation
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Liste des Embarcations ({filteredEmbarcations.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par type ou pêcheur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Pêcheur</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Propriétaire</TableHead>
                      <TableHead>Longueur</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmbarcations.length === 0 && !loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-2xl">
                          Aucune embarcation trouvée
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {loading
                      ? Array.from({
                          length:
                            filteredEmbarcations.length > 0
                              ? filteredEmbarcations.length
                              : 5,
                        }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
                            <TableCell>
                              <Skeleton className="h-[20px] w-full rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-full rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-3/4 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-2/3 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-1/2 rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Skeleton className="h-[16px] w-full rounded" />
                                <Skeleton className="h-[16px] w-3/4 rounded" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Skeleton className="h-[32px] w-[32px] rounded" />
                                <Skeleton className="h-[32px] w-[32px] rounded" />
                                <Skeleton className="h-[32px] w-[32px] rounded" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      : filteredEmbarcations.map((embarcation) => (
                          <TableRow key={embarcation?.id}>
                            <TableCell className="font-medium">
                              {embarcation?.typeEmbarcation ||
                                "Inconnu"}
                            </TableCell>
                            <TableCell>
                              {embarcation?.pecheur
                                ? getPecheurName(embarcation.pecheur.id)
                                : "Inconnu"}
                            </TableCell>
                            <TableCell>{embarcation?.nombre}</TableCell>
                            <TableCell>
                              {embarcation?.proprietaire ? "Oui" : "Non"}
                            </TableCell>
                            <TableCell>
                              {embarcation?.longueur
                                ? `${embarcation.longueur} m`
                                : "Non renseignée"}
                            </TableCell>
                            <TableCell>
                              {embarcation?.capacitePassagers
                                ? `${embarcation.capacitePassagers} passagers`
                                : "Non renseignée"}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Link
                                  href={`/activitePeche/embar-peche/details/${embarcation.id}`}
                                >
                                  <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Eye className="h-3 w-3 text-blue-500" />
                                  </Button>
                                </Link>
                                <Link
                                  href={`/activitePeche/embar-peche/modifier/${embarcation.id}`}
                                >
                                  <Button
                                    className="cursor-pointer"
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Edit className="h-3 w-3 text-green-500" />
                                  </Button>
                                </Link>
                                <AlertDialog
                                  open={
                                    isDeleteModal &&
                                    deletingId === embarcation.id
                                  }
                                  onOpenChange={(open) => {
                                    if (!open) {
                                      setIsDeleteModal(false);
                                      setDeletingId(null);
                                    }
                                  }}
                                >
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      className="cursor-pointer"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setDeletingId(embarcation.id);
                                        setIsDeleteModal(true);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Voulez-vous supprimer cette embarcation?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Cette action est irréversible.
                                        L&apos;embarcation sera définitivement
                                        supprimée.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Annuler
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete()}
                                      >
                                        Confirmer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
