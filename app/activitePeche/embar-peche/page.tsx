"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, Ship } from "lucide-react";
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
  pecheur: { id: string; enquete: { nomEnquete: string } } | null;
};

type Pecheur = {
  id: string;
  enquete: { nomEnquete: string };
};

export default function EmbarcationsPeche() {
  const [embarcations, setEmbarcations] = useState<EmbarcationPeche[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

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
      }
    };

    fetchEmbarcations();
    fetchPecheurs();
  }, []);

  const filteredEmbarcations = embarcations.filter(
    (embarcation) =>
      embarcation?.pecheur?.enquete?.nomEnquete
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      embarcation?.typeEmbarcation
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
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
    return pecheur?.enquete?.nomEnquete || "Inconnu";
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
              <Button>
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
                    {filteredEmbarcations.map((embarcation) => (
                      <TableRow key={embarcation?.id}>
                        <TableCell className="font-medium">
                          {embarcation?.typeEmbarcation}
                        </TableCell>
                        <TableCell>
                          {embarcation?.pecheur?.enquete?.nomEnquete ||
                            getPecheurName(embarcation.pecheurId)}
                        </TableCell>
                        <TableCell>{embarcation?.nombre}</TableCell>
                        <TableCell>
                          {embarcation?.proprietaire ? "Oui" : "Non"}
                        </TableCell>
                        <TableCell>
                          {embarcation?.longueur
                            ? `${embarcation.longueur}m`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {embarcation?.capacitePassagers || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link
                              href={`/activitePeche/embar-peche/modifier/${embarcation.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 text-green-500" />
                              </Button>
                            </Link>
                            <AlertDialog
                              open={
                                isDeleteModal && deletingId === embarcation.id
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
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
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
