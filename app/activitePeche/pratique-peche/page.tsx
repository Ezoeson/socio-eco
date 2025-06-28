"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, Fish } from "lucide-react";
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

type PratiquePeche = {
  id: string;
  especeCible: string;
  dureeSaisonHaute: number | null;
  dureeSaisonBasse: number | null;
  frequenceSortiesSaisonHaute: number | null;
  frequenceSortiesSaisonBasse: number | null;
  capturesMoyennesSaisonHaute: number | null;
  capturesMoyennesSaisonBasse: number | null;
  classificationActivite: string | null;
  pecheurId: string;
  pecheur: { id: string; enquete: { nomEnquete: string } } | null;
};

type Pecheur = {
  id: string;
  enquete: { nomEnquete: string };
};

export default function PratiquesPeche() {
  const [pratiques, setPratiques] = useState<PratiquePeche[]>([]);
  const [formData, setFormData] = useState<{
    especeCible?: string;
    dureeSaisonHaute?: number | null;
    dureeSaisonBasse?: number | null;
    frequenceSortiesSaisonHaute?: number | null;
    frequenceSortiesSaisonBasse?: number | null;
    capturesMoyennesSaisonHaute?: number | null;
    capturesMoyennesSaisonBasse?: number | null;
    classificationActivite?: string | null;
    pecheurId: string;
  }>({
    pecheurId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [pecheurOptions, setPecheurOptions] = useState<Pecheur[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPratiques = async () => {
      try {
        const response = await fetch("/api/activite_peche");
        const data = await response.json();
        setPratiques(data);
      } catch (error) {
        console.error("Error fetching pratiques:", error);
      } finally {
        setLoading(false);
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

    fetchPratiques();
    fetchPecheurs();
  }, [
    setPratiques,
    setPecheurOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredPratiques = pratiques.filter((pratique) =>
    pratique?.especeCible?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.especeCible || !formData.pecheurId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/activite_peche/${editingId}`
      : "/api/activite_peche";

    try {
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          especeCible: formData.especeCible,
          dureeSaisonHaute: formData.dureeSaisonHaute,
          dureeSaisonBasse: formData.dureeSaisonBasse,
          frequenceSortiesSaisonHaute: formData.frequenceSortiesSaisonHaute,
          frequenceSortiesSaisonBasse: formData.frequenceSortiesSaisonBasse,
          capturesMoyennesSaisonHaute: formData.capturesMoyennesSaisonHaute,
          capturesMoyennesSaisonBasse: formData.capturesMoyennesSaisonBasse,
          classificationActivite: formData.classificationActivite,
          pecheurId: formData.pecheurId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            setPratiques(
              pratiques.map((pratique) =>
                pratique.id === editingId
                  ? { ...pratique, ...formData }
                  : pratique
              )
            );
            toast.success("Modification réussie");
          } else {
            setPratiques([...pratiques, data]);
            toast.success("Ajout réussie");
          }
          setIsDialogOpen(false);
          setFormData({ pecheurId: "" });
          setEditingId(null);
        });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (pratique: PratiquePeche) => {
    setFormData({
      especeCible: pratique.especeCible,
      dureeSaisonHaute: pratique.dureeSaisonHaute,
      dureeSaisonBasse: pratique.dureeSaisonBasse,
      frequenceSortiesSaisonHaute: pratique.frequenceSortiesSaisonHaute,
      frequenceSortiesSaisonBasse: pratique.frequenceSortiesSaisonBasse,
      capturesMoyennesSaisonHaute: pratique.capturesMoyennesSaisonHaute,
      capturesMoyennesSaisonBasse: pratique.capturesMoyennesSaisonBasse,
      classificationActivite: pratique.classificationActivite,
      pecheurId: pratique.pecheurId,
    });
    setEditingId(pratique.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/activite_peche/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la pratique");
        }
        return response.json();
      })
      .then(() => {
        setPratiques((prev) =>
          prev.filter((pratique) => pratique.id !== deletingId)
        );
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
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Fish className="h-8 w-8 text-blue-600" />
              Gestion des Pratiques de Pêche
            </h2>
            <p className="text-gray-600">
              Enregistrement des pratiques de pêche des pêcheurs
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className=" cursor-pointer"
                onClick={() => {
                  setFormData({ pecheurId: "" });
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block">Nouvelle pratique</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier une pratique" : "Ajouter une pratique"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="especeCible">Espèce cible</Label>
                    <Input
                      id="especeCible"
                      value={formData.especeCible || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          especeCible: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <Select
                    value={formData.pecheurId || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pecheurId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un pêcheur" />
                    </SelectTrigger>
                    <SelectContent>
                      {pecheurOptions.map((pecheur) => (
                        <SelectItem key={pecheur.id} value={pecheur.id}>
                          {pecheur.enquete.nomEnquete}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dureeSaisonHaute">
                        Durée saison haute (jours)
                      </Label>
                      <Input
                        id="dureeSaisonHaute"
                        type="number"
                        value={formData.dureeSaisonHaute || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dureeSaisonHaute: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dureeSaisonBasse">
                        Durée saison basse (jours)
                      </Label>
                      <Input
                        id="dureeSaisonBasse"
                        type="number"
                        value={formData.dureeSaisonBasse || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dureeSaisonBasse: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="frequenceSortiesSaisonHaute">
                        Fréquence sorties saison haute
                      </Label>
                      <Input
                        id="frequenceSortiesSaisonHaute"
                        type="number"
                        step="0.1"
                        value={formData.frequenceSortiesSaisonHaute || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frequenceSortiesSaisonHaute: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequenceSortiesSaisonBasse">
                        Fréquence sorties saison basse
                      </Label>
                      <Input
                        id="frequenceSortiesSaisonBasse"
                        type="number"
                        step="0.1"
                        value={formData.frequenceSortiesSaisonBasse || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            frequenceSortiesSaisonBasse: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capturesMoyennesSaisonHaute">
                        Captures moyennes saison haute (kg)
                      </Label>
                      <Input
                        id="capturesMoyennesSaisonHaute"
                        type="number"
                        step="0.1"
                        value={formData.capturesMoyennesSaisonHaute || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            capturesMoyennesSaisonHaute: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="capturesMoyennesSaisonBasse">
                        Captures moyennes saison basse (kg)
                      </Label>
                      <Input
                        id="capturesMoyennesSaisonBasse"
                        type="number"
                        step="0.1"
                        value={formData.capturesMoyennesSaisonBasse || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            capturesMoyennesSaisonBasse: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="classificationActivite">
                      Classification activité
                    </Label>
                    <Input
                      id="classificationActivite"
                      value={formData.classificationActivite || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          classificationActivite: e.target.value,
                        }))
                      }
                    />
                  </div>
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
                    <span className="hidden md:block">
                      Liste des Pratiques de Pêche ({filteredPratiques.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par espèce cible..."
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
                      <TableHead>Espèce cible</TableHead>
                      <TableHead>Pêcheur</TableHead>
                      <TableHead>Durée (H/B)</TableHead>
                      <TableHead>Fréquence (H/B)</TableHead>
                      <TableHead>Captures (H/B)</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? Array.from({
                          length:
                            filteredPratiques.length > 0
                              ? filteredPratiques.length
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
                      : filteredPratiques.map((pratique) => (
                          <TableRow key={pratique?.id}>
                            <TableCell className="font-medium">
                              {pratique?.especeCible}
                            </TableCell>
                            <TableCell>
                              {pratique?.pecheur?.enquete?.nomEnquete}
                            </TableCell>
                            <TableCell>
                              {pratique?.dureeSaisonHaute}/
                              {pratique?.dureeSaisonBasse}
                            </TableCell>
                            <TableCell>
                              {pratique?.frequenceSortiesSaisonHaute?.toFixed(
                                1
                              )}
                              /
                              {pratique?.frequenceSortiesSaisonBasse?.toFixed(
                                1
                              )}
                            </TableCell>
                            <TableCell>
                              {pratique?.capturesMoyennesSaisonHaute?.toFixed(
                                1
                              )}
                              /
                              {pratique?.capturesMoyennesSaisonBasse?.toFixed(
                                1
                              )}
                            </TableCell>
                            <TableCell>
                              {pratique?.classificationActivite}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(pratique)}
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
                                        setDeletingId(pratique.id);
                                        setIsDeleteModal(true);
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Voulez-vous supprimer cette pratique?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Cette action est irréversible. La
                                        pratique de pêche sera définitivement
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
