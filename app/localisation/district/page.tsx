"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";

type District = {
  id: string;
  nom: string;
  regionId: string;
  region: { id: string; nom: string };
};

type Region = {
  id: string;
  nom: string;
};

export default function Districts() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [formData, setFormData] = useState<{ nom?: string; regionId: string }>({
    regionId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionOptions, setRegionOptions] = useState<Region[]>([]);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const response = await fetch("/api/district");
        const data = await response.json();
        setDistricts(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegions = async () => {
      try {
        const response = await fetch("/api/region");
        const data = await response.json();
        setRegionOptions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistrict();
    fetchRegions();
  }, [setDistricts, setRegionOptions, setFormData, setEditingId, isDialogOpen]);

  const filteredDistricts = districts?.filter((district) =>
    district?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.regionId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/district/${editingId}` : "/api/district";

    try {
      // create
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          regionId: formData.regionId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            // update
            setDistricts(
              districts.map((district) =>
                district.id === editingId
                  ? { ...district, ...formData }
                  : district
              )
            );
            setLoading(true);
          } else {
            setDistricts([...districts, data]);
            setLoading(true);
          }
          setIsDialogOpen(false);
          setFormData({ regionId: "" });
          setEditingId(null);
          setLoading(false);
        });

      // update
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (district: District) => {
    setFormData({ nom: district.nom, regionId: district.regionId });
    setEditingId(district.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/district/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du district");
        }
        return response.json();
      })
      .then(() => {
        setDistricts((prev) =>
          prev.filter((district) => district.id !== deletingId)
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
              <MapPin className="h-8 w-8 text-green-600" />
              Gestion des Districts
            </h2>
            <p className="text-gray-600">
              Administration territoriale - Niveau district
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className=" cursor-pointer  flex items-center gap-2 ">
                <div className="flex justify-center items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden md:block">Nouveau district</span>
                </div>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md" aria-description="formulaire">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier un district" : "Ajouter un district"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
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
                    value={formData.regionId || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, regionId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionOptions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {loading ? "en cours..." : editingId ? "Modifier" : "Ajouter"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-center md:justify-between items-center">
                  <CardTitle>
                    <span className="hidden md:block">
                      Liste des Districts ({filteredDistricts.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un district..."
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
                      <TableHead>Nom du district</TableHead>
                      <TableHead>Région</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDistricts.length === 0 && !loading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-2xl">
                          Aucune district trouvé
                        </TableCell>
                      </TableRow>
                    ) : null}

                    {loading
                      ? Array.from({
                          length:
                            filteredDistricts.length > 0
                              ? filteredDistricts.length
                              : 5,
                        }).map((_, index) => (
                          <TableRow key={`skeleton-${index}`}>
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
                      : filteredDistricts
                      ? filteredDistricts?.map((district) => (
                          <TableRow key={district?.id}>
                            <TableCell className="font-medium">
                              {district?.nom}
                            </TableCell>
                            <TableCell>{district?.region.nom}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  className="cursor-pointer"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(district)}
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
                                        setDeletingId(district.id);
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
                                        Êtes-vous sûr de vouloir supprimer le
                                        district <strong>{district.nom}</strong>
                                        ? Cette action est irréversible.
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
                        ))
                      : "Loading"}
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
