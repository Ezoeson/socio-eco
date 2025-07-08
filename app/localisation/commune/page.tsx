"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PagePagination } from "@/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface District {
  id: string;
  nom: string;
  region: {
    id: string;
    nom: string;
  };
}

interface Commune {
  id: string;
  nom: string;
  district: District;
  fokontanyCount: number;
}

interface PaginatedResponse {
  data: Commune[];
  total: number;
  page: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function Communes() {
  // États
  const [data, setData] = useState<PaginatedResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<{ nom: string; districtId: string }>(
    {
      nom: "",
      districtId: "",
    }
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);

  // Fetch data avec pagination et recherche
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `/api/commune?page=${data.page}&search=${encodeURIComponent(
        searchTerm
      )}`;
      const [communesRes, districtsRes] = await Promise.all([
        fetch(url),
        fetch("/api/district"),
      ]);

      if (!communesRes.ok) throw new Error("Failed to fetch communes");
      if (!districtsRes.ok) throw new Error("Failed to fetch districts");

      const communesData: PaginatedResponse = await communesRes.json();
      const districtsData = await districtsRes.json();

      setData(communesData);
      setDistricts(districtsData.data || districtsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [data.page, searchTerm]);

  // Modifiez l'effet pour réinitialiser la page quand la recherche change
  useEffect(() => {
    setData((prev) => ({ ...prev, page: 1 })); // Réinitialise à la page 1
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchData]);

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.districtId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsMutating(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/commune/${editingId}` : "/api/commune";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(editingId ? "Update failed" : "Create failed");

      toast.success(editingId ? "Commune mise à jour" : "Commune créée");
      setIsDialogOpen(false);
      fetchData(); // Recharger les données
    } catch (error) {
      console.error("Form error:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsMutating(false);
    }
  };

  // Suppression robuste avec gestion des erreurs
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsMutating(true);
      const response = await fetch(`/api/commune/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Commune supprimée");

      // Gestion intelligente de la pagination après suppression
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

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setData((prev) => ({ ...prev, page }));
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6 text-green-600" />
              Gestion des Communes
            </h1>
            <p className="text-muted-foreground">
              {data.total} communes enregistrées
            </p>
          </div>

          <div className="flex gap-4 justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une commune..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-64"
              />
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingId(null);
                  setFormData({ nom: "", districtId: "" });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-700 to-rose-700  text-white ">
                  <Plus className="h-4 w-4 mr-2" />
                  <p className="  font-bold md:block hidden ">Nouvelle commune</p>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Modifier commune" : "Créer une commune"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la commune</Label>
                    <Input
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select
                      value={formData.districtId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, districtId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.nom} ({district.region.nom})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={isMutating}
                    className="w-full"
                  >
                    {isMutating
                      ? "En cours..."
                      : editingId
                      ? "Modifier"
                      : "Créer"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tableau */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Région</TableHead>
                  <TableHead>Fokontany</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-3/4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-1/2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-1/2" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-1/4" />
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      {searchTerm
                        ? "Aucune commune trouvée"
                        : "Aucune commune enregistrée"}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((commune) => (
                    <TableRow key={commune.id}>
                      <TableCell className="font-medium">
                        {commune.nom}
                      </TableCell>
                      <TableCell>{commune.district.nom}</TableCell>
                      <TableCell>{commune.district.region.nom}</TableCell>
                      <TableCell>{commune.fokontanyCount}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              nom: commune.nom,
                              districtId: commune.district.id,
                            });
                            setEditingId(commune.id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog
                          open={isDeleteModalOpen && deletingId === commune.id}
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
                                setDeletingId(commune.id);
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
                                Êtes-vous sûr de vouloir supprimer la commune{" "}
                                <strong>{commune.nom}</strong> ? Cette action
                                supprimera également {commune.fokontanyCount}{" "}
                                fokontanys associés.
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

        {/* Pagination */}
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
