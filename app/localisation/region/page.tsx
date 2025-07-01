"use client";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import Wrapper from "@/components/Wrapper";

import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
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

interface Region {
  id: string;
  nom: string;
  districts: number;
  communes: number;
  fokontany: number;
}

export default function Region() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<Partial<Region>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await fetch("/api/region");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des régions");
        }
        const data = await response.json();
        setRegions(data);
        console.log(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegion();
  }, [isDialogOpen, isDeleteModal]);

  const filteredRegions = regions?.filter((region) =>
    region?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) return;
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/region/${editingId}` : "/api/region";
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nom: formData.nom }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la sauvegarde de la région");
        }
        return response.json();
      })
      .then((data) => {
        if (editingId) {
          setRegions((prev) =>
            prev.map((region) =>
              region.id === editingId ? { ...region, nom: data.nom } : region
            )
          );
          toast.success("Modification réussie");
        } else {
          setRegions((prev) => [...prev, { ...data, id: data.id }]);
          toast.success("Ajout réussi");
        }
        setFormData({});
        setEditingId(null);
        setIsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Erreur:", error);
      });
  };

  const handleEdit = (region: Region) => {
    setFormData(region);
    setEditingId(region.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/region/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la région");
        }
        return response.json();
      })
      .then(() => {
        setRegions((prev) => prev.filter((region) => region.id !== deletingId));
        toast("Suppression réussie");
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
            <h2 className="text-3xl font-bold  flex items-center gap-2">
              <MapPin className="h-8 w-8 text-green-600" />
              Gestion des Régions
            </h2>
            <p className="text-gray-600">
              Administration territoriale - Niveau régional
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer flex justify-center items-center gap-2 shadow-md dark:shadow-blue-800 "
                onClick={() => {
                  setFormData({});
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block"> Ajouter région</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier une region" : "Ajouter une region"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <Label>Nom de la région</Label>
                  <Input
                    value={formData.nom || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    required
                  />
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
            <Card className="shadow-md dark:shadow-blue-800 ">
              <CardHeader>
                <div className="flex md:justify-between justify-center items-center">
                  <CardTitle>
                    <span className="hidden md:block">
                      Liste des Régions ({filteredRegions.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une région..."
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
                      <TableHead>Nom de la région</TableHead>
                      <TableHead>Districts</TableHead>
                      <TableHead>Communes</TableHead>
                      <TableHead>Fokontany</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {!loading && filteredRegions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-2xl">
                          Aucune région trouvée
                        </TableCell>
                      </TableRow>
                    )}
                    {loading
                      ? Array.from({
                          length:
                            filteredRegions.length > 0
                              ? filteredRegions.length
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
                      : filteredRegions?.map((region) => (
                          <TableRow key={region.id}>
                            <TableCell className="font-medium">
                              {region.nom}
                            </TableCell>
                            <TableCell>{region.districts}</TableCell>
                            <TableCell>{region.communes}</TableCell>
                            <TableCell>{region.fokontany}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(region)}
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
                                        setDeletingId(region.id);
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
