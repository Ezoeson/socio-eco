"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Users,
  MessagesSquare,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PagePagination } from "@/components/pagination";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Enquete {
  id: string;
  nomPerscible: string;
  nomRepondant?: string;
  dateEnquete: Date;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  secteur: {
    id: string;
    nom: string;
    fokontany: {
      nom: string;
    };
  };
  enqueteur: {
    id: string;
    nom: string;
    prenom: string;
    code: string;
  };
  membresFamille: {
    id: string;
    nom: string;
    age: number;
    lienFamilial: string;
  }[];
}

interface PaginatedResponse {
  data: Enquete[];
  total: number;
  page: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function ListeEnquetes() {
  const [data, setData] = useState<PaginatedResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    start: "",
    end: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      let url = `/api/enquete_famille?page=${data.page}`;

      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (dateFilter.start) {
        url += `&dateDebut=${dateFilter.start}`;
      }
      if (dateFilter.end) {
        url += `&dateFin=${dateFilter.end}`;
      }

      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch enquetes");

      const responseData = await response.json();
      const paginatedData = Array.isArray(responseData)
        ? {
            data: responseData,
            total: responseData.length,
            page: 1,
            totalPages: 1,
          }
        : responseData;

      setData(paginatedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Erreur lors du chargement des enquêtes");
    } finally {
      setIsLoading(false);
    }
  }, [data.page, searchTerm, dateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchData]);

  const handlePageChange = (page: number) => {
    setData((prev) => ({ ...prev, page }));
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "PPP", { locale: fr });
  };

  const getEnqueteType = (enquete: Enquete) => {
    const types = [];
    if (enquete.estPecheur) types.push("Pêcheur");
    if (enquete.estCollecteur) types.push("Collecteur");
    if (enquete.touteActivite) types.push("Autres activités");
    return types.join(" / ");
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsMutating(true);
      const response = await fetch(`/api/enquete_famille/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Enquête supprimée avec succès");

      if (data.data.length === 1 && data.page > 1) {
        setData((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchData();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Échec de la suppression");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setIsMutating(false);
    }
  };
  const validateDates = (start: string, end: string): boolean => {
    if (start && end) {
      return new Date(start) <= new Date(end);
    }
    return true;
  };
  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <p className="tracking-widest animate-pulse bg-gradient-to-r from-blue-700 to-rose-700 text-transparent bg-clip-text text-4xl font-extrabold">
                {" "}
                Gestion des Enquêtes
              </p>
            </h1>
            <p className="text-muted-foreground">
              {data.total} enquêtes enregistrées
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une enquête..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => {
                    const newStart = e.target.value;
                    setDateFilter((prev) => {
                      // Si la date de fin existe et est inférieure à la nouvelle date de début
                      if (
                        prev.end &&
                        newStart &&
                        new Date(newStart) > new Date(prev.end)
                      ) {
                        return { ...prev, start: newStart, end: newStart }; // Réinitialise la date de fin
                      }
                      return { ...prev, start: newStart };
                    });
                  }}
                  className="w-full"
                  placeholder="Date début"
                />
                {dateFilter.start ? (
                  <Input
                    type="date"
                    value={dateFilter.end}
                    onChange={(e) => {
                      const newEnd = e.target.value;
                      if (validateDates(dateFilter.start, newEnd)) {
                        setDateFilter((prev) => ({ ...prev, end: newEnd }));
                      } else {
                        toast.error(
                          "La date de fin doit être après la date de début"
                        );
                      }
                    }}
                    min={dateFilter.start} // Définit le minimum comme la date de début
                    className="w-full"
                    placeholder="Date fin"
                    disabled={!dateFilter.start} // Désactive tant que la date de début n'est pas définie
                  />
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <Input
                        type="date"
                        // Définit le minimum comme la date de début
                        className="w-full"
                        placeholder="Date fin"
                        disabled={!dateFilter.start} // Désactive tant que la date de début n'est pas définie
                      />
                    </TooltipTrigger>
                    <TooltipContent className=" flex flex-col justify-center items-center">
                      <MessagesSquare className="text-red-500 animate-pulse" />
                      <p className="text-gray-950">
                        {" "}
                        La date de fin doit être après la date de début
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            <Link href="/enquete/ajout" className="w-full md:w-auto">
              <Button className="bg-gradient-to-r from-blue-700 to-rose-700  text-white w-full ">
                <Plus className="h-4 w-4 mr-2" />
                <p className="  font-bold"> Nouvelle enquête</p>
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Enquêtes</CardTitle>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={`skeleton-cell-${i}-${j}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      {searchTerm || dateFilter.start || dateFilter.end
                        ? "Aucune enquête trouvée"
                        : "Aucune enquête enregistrée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((enquete) => (
                    <TableRow key={enquete.id}>
                      <TableCell>
                        {enquete.nomRepondant || "Non spécifié"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {enquete.nomPerscible}
                      </TableCell>
                      <TableCell>{getEnqueteType(enquete)}</TableCell>
                      <TableCell>{formatDate(enquete.dateEnquete)}</TableCell>
                      <TableCell>
                        {enquete.secteur?.nom || "Non spécifié"}
                      </TableCell>
                      <TableCell>
                        {enquete.enqueteur?.prenom} {enquete.enqueteur?.nom}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-2" />
                              {enquete.membresFamille.length}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Membres de la famille</DialogTitle>
                              <p className="text-sm text-muted-foreground">
                                Enquête: {enquete.nomPerscible}
                              </p>
                            </DialogHeader>
                            <div className="space-y-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Âge</TableHead>
                                    <TableHead>Lien familial</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {enquete.membresFamille.map((membre) => (
                                    <TableRow key={membre.id}>
                                      <TableCell>{membre.nom}</TableCell>
                                      <TableCell>{membre.age}</TableCell>
                                      <TableCell>
                                        {membre.lienFamilial}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Link href={`/enquete/details/${enquete.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/enquete/modifier/${enquete.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <AlertDialog
                          open={isDeleteModalOpen && deletingId === enquete.id}
                          onOpenChange={(open) => {
                            setIsDeleteModalOpen(open);
                            if (!open) setDeletingId(null);
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setDeletingId(enquete.id);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmer la suppression
                              </AlertDialogTitle>
                              <AlertDialogDescription className="flex flex-col justify-center items-center">
                                Êtes-vous sûr de vouloir supprimer
                                l&apos;enquête de {enquete.nomPerscible} ?
                                <br />
                                <span className="text-red-500">
                                  Cette action est irréversible.
                                </span>
                                <Trash2 className="text-red-500 h-28 w-28 animate-bounce animate-infinite animate-ease-in-out " />
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isMutating}>
                                Annuler
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isMutating}
                              >
                                {isMutating ? "Suppression..." : "Confirmer"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {data.total > ITEMS_PER_PAGE && (
          <div className="flex justify-center">
            <PagePagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
}
