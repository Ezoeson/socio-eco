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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type Commune = {
  id: string;
  nom: string;
  districtId: string;
  district: { id: string; nom: string };
};

type District = {
  id: string;
  nom: string;
};

export default function Communes() {
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [formData, setFormData] = useState<{
    nom?: string;
    districtId: string;
  }>({
    districtId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [districtOptions, setDistrictOptions] = useState<District[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCommune = async () => {
      try {
        const response = await fetch("/api/commune");
        const data = await response.json();
        setCommunes(data);
      } catch (error) {
        console.error("Error fetching communes:", error);
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/district");
        const data = await response.json();
        setDistrictOptions(data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchCommune();
    fetchDistricts();
  }, [
    setCommunes,
    setDistrictOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredCommunes = communes.filter((commune) =>
    commune?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.districtId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/commune/${editingId}` : "/api/commune";

    try {
      // create
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: formData.nom,
          districtId: formData.districtId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            // update
            setCommunes(
              communes.map((commune) =>
                commune.id === editingId ? { ...commune, ...formData } : commune
              )
            );
          } else {
            // create
            setCommunes([...communes, data]);
          }
          setIsDialogOpen(false);
          setFormData({ districtId: "" });
          setEditingId(null);
        });

      // update
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (commune: Commune) => {
    setFormData({ nom: commune.nom, districtId: commune.districtId });
    setEditingId(commune.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/commune/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de la région");
        }
        return response.json();
      })
      .then(() => {
        setCommunes((prev) =>
          prev.filter((commune) => commune.id !== deletingId)
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
              Gestion des Communes
            </h2>
            <p className="text-gray-600">
              Administration territoriale - Niveau commune
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setFormData({ districtId: "" });
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau commune
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Modifier un commune" : "Ajouter un commune"}
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
                    value={formData.districtId || ""}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, districtId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtOptions.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.nom}
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
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Liste des Communes ({filteredCommunes.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un commune..."
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
                      <TableHead>Nom du commune</TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommunes.map((commune) => (
                      <TableRow key={commune?.id}>
                        <TableCell className="font-medium">
                          {commune?.nom}
                        </TableCell>
                        <TableCell>{commune?.district.nom}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(commune)}
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
                                    setDeletingId(commune.id);
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
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
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
