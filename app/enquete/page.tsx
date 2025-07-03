"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import {
  CircleAlert,
  Edit,
  Eye,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Skeleton } from "@/components/ui/skeleton";
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
import { toast } from "sonner";

type Enquete = {
  id: string;
  nomPerscible: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  nomRepondant?: string;
  dateEnquete?: Date;
  secteur?: {
    id: string;
    nom: string;
  };
  enqueteur?: {
    id: string;
    nom: string;
  };
  membresFamille?: {
    id: string;
    nom: string;
    age?: number;
    sexe?: "MASCULIN" | "FEMININ";
    estChefMenage?: boolean;
    lienFamilial?: string;
    frequentationEcole?: boolean;
    niveauEducation?: string;
    enqueteId: string;
  }[];
};

export default function ListeEnquetes() {
  const [enquetes, setEnquetes] = useState<Enquete[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  // const [selectedEnqueteId, setSelectedEnqueteId] = useState<string | null>(
  //   null
  // );

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          // Fetch enquetes
          const enqueteResponse = await fetch("/api/enquete_famille");
          const enqueteData = await enqueteResponse.json();
          setEnquetes(enqueteData);
          console.log("Enquêtes:", enqueteData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    },
    [
      // This dependency is not needed here, but kept for consistency
    ]
  );

  const filteredEnquetes = enquetes?.filter((enquete) =>
    enquete.nomPerscible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date?: Date) => {
    if (!date) return "Non spécifiée";
    return format(new Date(date), "PPP", { locale: fr });
  };
  const handleDelete = () => {
    if (!deletingId) return;

    fetch(`/api/enquete_famille/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'enquête");
        }
        return response.json();
      })
      .then(() => {
        setEnquetes((prev) =>
          prev.filter((enquete) => enquete.id !== deletingId)
        );
        toast.success("Suppression réussie");
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

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Gestion des Enquêtes</h2>
            <p className="text-gray-600">
              Liste des enquêtes en cours et passées
            </p>
          </div>
          <Link href="/enquete/ajout">
            <Button className="cursor-pointer">
              <div className="flex justify-center items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block">Nouvelle enquête</span>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-center md:justify-between items-center">
                  <CardTitle>
                    <span className="hidden md:block">
                      Liste des Enquêtes ({filteredEnquetes.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une enquête..."
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
                      <TableHead>Répondant</TableHead>
                      <TableHead>Personne cible</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Enquêteur</TableHead>
                      <TableHead>Famille</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnquetes.length === 0 && !loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-2xl">
                          Aucune enquête trouvée
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {loading
                      ? Array.from({
                          length:
                            filteredEnquetes?.length > 0
                              ? filteredEnquetes?.length
                              : 5,
                        }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
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
                              <Skeleton className="h-[20px] w-full rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-3/4 rounded" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-[20px] w-2/3 rounded" />
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
                      : filteredEnquetes.map((enquete) => {
                          const membres = enquete.membresFamille || [];
                          return (
                            <TableRow key={enquete.id}>
                              <TableCell>
                                {enquete.nomRepondant || "Non spécifié"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {enquete.nomPerscible}
                              </TableCell>
                              <TableCell>
                                {enquete.estPecheur && "Pêcheur "}
                                {enquete.estCollecteur && "Collecteur "}
                                {enquete.touteActivite && "Toute activité"}
                              </TableCell>
                              <TableCell>
                                {formatDate(enquete.dateEnquete)}
                              </TableCell>
                              <TableCell>
                                {enquete.secteur
                                  ? enquete.secteur.nom
                                  : "Non spécifié"}
                              </TableCell>
                              <TableCell>
                                {enquete.enqueteur?.nom || "Non spécifié"}
                              </TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      className="cursor-pointer"
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Users className="h-4 w-4" />
                                      <span className="ml-2">
                                        {membres.length}
                                      </span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="md:min-w-4xl overflow-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Membres de la famille
                                      </DialogTitle>
                                      <p className="text-sm text-gray-500">
                                        Enquête: {enquete.nomPerscible}
                                      </p>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Âge</TableHead>
                                            <TableHead>Sexe</TableHead>
                                            <TableHead>Lien familial</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {membres.map((membre) => (
                                            <TableRow key={membre.id}>
                                              <TableCell>
                                                {membre.nom}
                                              </TableCell>
                                              <TableCell>
                                                {membre.age || "Non spécifié"}
                                              </TableCell>
                                              <TableCell>
                                                {membre.sexe === "MASCULIN"
                                                  ? "Homme"
                                                  : membre.sexe === "FEMININ"
                                                  ? "Femme"
                                                  : "-"}
                                              </TableCell>
                                              <TableCell>
                                                {membre.lienFamilial ||
                                                  "Non spécifié"}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Link href={`/enquete/details/${enquete.id}`}>
                                    <Button
                                      className="cursor-pointer"
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Eye className="h-3 w-3 text-blue-500" />
                                    </Button>
                                  </Link>
                                  <Link
                                    href={`/enquete/modifier/${enquete.id}`}
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
                                      isDeleteModal && deletingId === enquete.id
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
                                          setDeletingId(enquete.id);
                                          setIsDeleteModal(true);
                                        }}
                                      >
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Voulez-vous supprimer cette enquête ?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action est irréversible.
                                          Êtes-vous sûr de vouloir supprimer
                                          cette enquête et toutes les données
                                          associées ?
                                          <br />
                                          <strong>
                                            Nom de l&apos;enquête :{" "}
                                            {enquete.nomPerscible}
                                          </strong>
                                          <CircleAlert className="h-12 w-12 text-red-500 inline-block ml-2  animate-pulse" />
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
                          );
                        })}
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
