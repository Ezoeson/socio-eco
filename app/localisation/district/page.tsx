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
  communeCount: number;
  totalFokontany: number;
}

interface Region {
  id: string;
  nom: string;
}

interface PaginatedResponse {
  data: District[];
  total: number;
  page: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function Districts() {
  // États
  const [data, setData] = useState<PaginatedResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<{ nom: string; regionId: string }>({
    nom: "",
    regionId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);

  // Fetch data avec pagination et recherche
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `/api/district?page=${data.page}&search=${encodeURIComponent(
        searchTerm
      )}`;
      const [districtsRes, regionsRes] = await Promise.all([
        fetch(url),
        fetch("/api/region"),
      ]);

      if (!districtsRes.ok) throw new Error("Failed to fetch districts");
      if (!regionsRes.ok) throw new Error("Failed to fetch regions");

      const districtsData: PaginatedResponse = await districtsRes.json();
      const regionsData = await regionsRes.json();

      setData(districtsData);
      setRegions(regionsData.data || regionsData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, [data.page, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchData]);

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.regionId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsMutating(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/district/${editingId}` : "/api/district";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(editingId ? "Update failed" : "Create failed");

      toast.success(editingId ? "District mis à jour" : "District créé");
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
      const response = await fetch(`/api/district/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("District supprimé");

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
              Gestion des Districts
            </h1>
            <p className="text-muted-foreground">
              {data.total} districts enregistrés
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
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
                  setFormData({ nom: "", regionId: "" });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Modifier district" : "Créer un district"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom du district</Label>
                    <Input
                      value={formData.nom}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Région</Label>
                    <Select
                      value={formData.regionId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, regionId: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une région" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.id}>
                            {region.nom}
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
                  <TableHead>Région</TableHead>
                  <TableHead>Communes</TableHead>
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
                        <Skeleton className="h-4 w-1/4" />
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
                        ? "Aucun résultat trouvé"
                        : "Aucun district enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((district) => (
                    <TableRow key={district.id}>
                      <TableCell className="font-medium">
                        {district.nom}
                      </TableCell>
                      <TableCell>{district.region.nom}</TableCell>
                      <TableCell>{district.communeCount}</TableCell>
                      <TableCell>{district.totalFokontany}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              nom: district.nom,
                              regionId: district.region.id,
                            });
                            setEditingId(district.id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog
                          open={isDeleteModalOpen && deletingId === district.id}
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
                                setDeletingId(district.id);
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
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer le district
                                {district.nom} ? Cette action supprimera
                                également {district.communeCount} communes et{" "}
                                {district.totalFokontany} fokontanys associés.
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
