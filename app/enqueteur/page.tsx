"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, User, Camera } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { PagePagination } from "@/components/pagination";

interface Enqueteur {
  id: string;
  nom: string;
  prenom?: string;
  code?: string;
  telephone?: string;
  image?: string;
  email?: string;
  actif: boolean;
  // À typer plus précisément si nécessaire
}

interface PaginatedResponse {
  data: Enqueteur[];
  total: number;
  page: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 10;

export default function EnqueteurPage() {
  // États
  const [data, setData] = useState<PaginatedResponse>({
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Enqueteur>>({
    actif: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  // Fetch data avec pagination et recherche
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `/api/enqueteur?page=${data.page}&search=${encodeURIComponent(
        searchTerm
      )}`;
      const response = await fetch(url);

      if (!response.ok) throw new Error("Failed to fetch enqueteurs");

      const responseData = await response.json();

      // Adapte la réponse si elle n'est pas déjà paginée
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
      toast.error("Erreur lors du chargement des enquêteurs");
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
    if (!formData.nom) {
      toast.error("Le nom est obligatoire");
      return;
    }

    try {
      setIsMutating(true);
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/enqueteur/${editingId}` : "/api/enqueteur";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(editingId ? "Update failed" : "Create failed");
      }

      toast.success(
        editingId ? "Enquêteur mis à jour" : "Enquêteur créé avec succès"
      );
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Form error:", error);
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsMutating(false);
    }
  };

  // Suppression
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setIsMutating(true);
      const response = await fetch(`/api/enqueteur/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      toast.success("Enquêteur supprimé avec succès");

      // Gestion de la pagination après suppression
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

  // Gestion de l'upload d'image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload de l'image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.path }));
      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erreur lors de l'upload de l'image");
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <User className="h-6 w-6 text-blue-600" />
              Gestion des Enquêteurs
            </h1>
            <p className="text-muted-foreground">
              {data.total} enquêteurs enregistrés
            </p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un enquêteur..."
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
                  setFormData({ actif: true });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel enquêteur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Modifier enquêteur" : "Créer un enquêteur"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Photo de profil */}
                  <div className="flex flex-col items-center space-y-3">
                    <Label>Photo de profil</Label>
                    <div className="relative group">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`cursor-pointer flex items-center justify-center h-24 w-24 rounded-full border-2 border-dashed border-gray-300 hover:border-primary transition-all ${
                          formData.image ? "hidden" : "flex"
                        }`}
                      >
                        <Camera className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                      </label>

                      {formData.image && (
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer block h-24 w-24 rounded-full overflow-hidden relative group"
                        >
                          <Image
                            src={formData.image}
                            alt="Photo de profil"
                            fill
                            sizes="96px"
                            className="object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                            <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Champs du formulaire */}
                  <div className="space-y-3">
                    <div>
                      <Label>Nom *</Label>
                      <Input
                        value={formData.nom || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, nom: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Prénom</Label>
                      <Input
                        value={formData.prenom || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, prenom: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Code</Label>
                      <Input
                        value={formData.code || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        value={formData.telephone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            telephone: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        type="email"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="actif"
                        checked={formData.actif || false}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            actif: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="actif">Actif</Label>
                    </div>
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
                  <TableHead>Photo</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                      {searchTerm
                        ? "Aucun enquêteur trouvé"
                        : "Aucun enquêteur enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((enqueteur) => (
                    <TableRow key={enqueteur.id}>
                      <TableCell>
                        {enqueteur.image ? (
                          <div className="h-10 w-10 rounded-full overflow-hidden relative">
                            <Image
                              src={enqueteur.image}
                              alt={`${enqueteur.nom} ${enqueteur.prenom || ""}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {enqueteur.nom}
                      </TableCell>
                      <TableCell>{enqueteur.prenom || "-"}</TableCell>
                      <TableCell>{enqueteur.code || "-"}</TableCell>
                      <TableCell>{enqueteur.telephone || "-"}</TableCell>
                      <TableCell>{enqueteur.email || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            enqueteur.actif
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {enqueteur.actif ? "Actif" : "Inactif"}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              nom: enqueteur.nom,
                              prenom: enqueteur.prenom,
                              code: enqueteur.code,
                              telephone: enqueteur.telephone,
                              email: enqueteur.email,
                              image: enqueteur.image,
                              actif: enqueteur.actif,
                            });
                            setEditingId(enqueteur.id);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog
                          open={
                            isDeleteModalOpen && deletingId === enqueteur.id
                          }
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
                                setDeletingId(enqueteur.id);
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
                                Êtes-vous sûr de vouloir supprimer
                                l&apos;enquêteur {enqueteur.nom}{" "}
                                {enqueteur.prenom || ""} ?
                                <>
                                  <br />
                                  <span className="text-red-500">
                                    Attention enquête(s) associée(s) seront
                                    également supprimées.
                                  </span>
                                </>
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
