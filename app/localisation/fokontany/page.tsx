"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";

type Fokontany = {
  id: string;
  nom: string;
  communeId: string;
  commune: { id: string; nom: string };
};

type Commune = {
  id: string;
  nom: string;
};

export default function Fokontanys() {
  const [fokontanys, setFokontanys] = useState<Fokontany[]>([]);
  const [formData, setFormData] = useState<{
    nom?: string;
    communeId: string;
  }>({
    communeId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [communeOptions, setCommuneOptions] = useState<Commune[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFokontany = async () => {
      try {
        const response = await fetch("/api/fokontany");
        const data = await response.json();
        setFokontanys(data);
      } catch (error) {
        console.error("Error fetching fokontany:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCommunes = async () => {
      try {
        const response = await fetch("/api/commune");
        const data = await response.json();
        setCommuneOptions(data);
      } catch (error) {
        console.error("Error fetching communes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFokontany();
    fetchCommunes();
  }, [
    setFokontanys,
    setCommuneOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredFokontanys = fokontanys.filter((fokontany) =>
    fokontany?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.communeId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/fokontany/${editingId}` : "/api/fokontany";

    try {
      // create
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          communeId: formData.communeId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            // update
            setFokontanys(
              fokontanys.map((fokontany) =>
                fokontany.id === editingId
                  ? { ...fokontany, ...formData }
                  : fokontany
              )
            );
          } else {
            // create
            setFokontanys([...fokontanys, data]);
          }
          setIsDialogOpen(false);
          setFormData({ communeId: "" });
          setEditingId(null);
        });

      // update
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (fokontany: Fokontany) => {
    setFormData({ nom: fokontany.nom, communeId: fokontany.communeId });
    setEditingId(fokontany.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/fokontany/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de fokontany");
        }
        return response.json();
      })
      .then(() => {
        setFokontanys((prev) =>
          prev.filter((region) => region.id !== deletingId)
        );
        toast(<p className="text-red-700-">Suppression réussi</p>);
      })
      .catch((error) => {
        console.error("Erreur:", error);
      })
      .finally(() => {
        setIsDialogOpen(false);
        setDeletingId(null);
      });
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <MapPin className="h-8 w-8 text-green-600" />
              Gestion des Fokontany
            </h2>
            <p className="text-gray-600">
              Administration territoriale - Niveau fokontany
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ communeId: "" });
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block"> Nouveau fokontany</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier un fokontany" : "Ajouter un fokontany"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nom">Nom du secteur</Label>
                  <Input
                    id="nom"
                    value={formData.nom || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nom: e.target.value }))
                    }
                    required
                  />
                  <Select
                    value={formData.communeId || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, communeId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un commune" />
                    </SelectTrigger>
                    <SelectContent>
                      {communeOptions.map((commune) => (
                        <SelectItem key={commune.id} value={commune.id}>
                          {commune.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingId ? "Modifier" : "Ajouter"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex md:justify-between items-center">
                  <CardTitle>
                    <p className="hidden md:block">
                      Liste des Fokontany ({filteredFokontanys.length})
                    </p>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un fokontany..."
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
                      <TableHead>Nom du fokontany</TableHead>
                      <TableHead>Commune</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredFokontanys.length === 0 && !loading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-2xl">
                          Aucune fokontany trouvée
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {loading
                      ? Array.from({
                          length:
                            filteredFokontanys.length > 0
                              ? filteredFokontanys.length
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
                      : filteredFokontanys.map((fokontany) => (
                          <TableRow key={fokontany?.id}>
                            <TableCell className="font-medium">
                              {fokontany?.nom}
                            </TableCell>
                            <TableCell>{fokontany?.commune.nom}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(fokontany)}
                                >
                                  <Edit className="h-3 w-3 text-green-500" />
                                </Button>
                                <AlertDialog
                                  open={isDeleteModal}
                                  onOpenChange={setIsDeleteModal}
                                >
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setDeletingId(fokontany.id);
                                        setIsDeleteModal(true);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Voulez-vous supprimer?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Annuler
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete()}
                                      >
                                        Continue
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
