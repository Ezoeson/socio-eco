"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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

type EquipementPeche = {
  id: string;
  typeEquipement: string | null;
  quantite: number | null;
  utilisationHebdomadaire: number | null;
  dureeUtilisation: number | null;
  rendementEstime: number | null;
  pecheurId: string;
  pecheur: { id: string; enquete: { nomEnquete: string } } | null;
};

type Pecheur = {
  id: string;
  enquete: { nomEnquete: string };
};

export default function EquipementsPeche() {
  const [equipements, setEquipements] = useState<EquipementPeche[]>([]);
  const [formData, setFormData] = useState<{
    typeEquipement?: string | null;
    quantite?: number | null;
    utilisationHebdomadaire?: number | null;
    dureeUtilisation?: number | null;
    rendementEstime?: number | null;
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

  useEffect(() => {
    const fetchEquipements = async () => {
      try {
        const response = await fetch("/api/equip_peche");
        const data = await response.json();
        setEquipements(data);
      } catch (error) {
        console.error("Error fetching equipements:", error);
      }
    };

    const fetchPecheurs = async () => {
      try {
        const response = await fetch("/api/pecheur");
        const data = await response.json();
        setPecheurOptions(data);
      } catch (error) {
        console.error("Error fetching pecheurs:", error);
      }
    };

    fetchEquipements();
    fetchPecheurs();
  }, [
    setEquipements,
    setPecheurOptions,
    setFormData,
    setEditingId,
    isDialogOpen,
  ]);

  const filteredEquipements = equipements.filter((equipement) =>
    equipement?.typeEquipement?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.typeEquipement || !formData.pecheurId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/equip_peche/${editingId}`
      : "/api/equip_peche";

    try {
      fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          typeEquipement: formData.typeEquipement,
          quantite: formData.quantite,
          utilisationHebdomadaire: formData.utilisationHebdomadaire,
          dureeUtilisation: formData.dureeUtilisation,
          rendementEstime: formData.rendementEstime,
          pecheurId: formData.pecheurId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (editingId) {
            setEquipements(
              equipements.map((equipement) =>
                equipement.id === editingId
                  ? { ...equipement, ...formData }
                  : equipement
              )
            );
            toast.success("Modification réussie");
          } else {
            setEquipements([...equipements, data]);
            toast.success("Ajout réussie");
          }
          setIsDialogOpen(false);
          setFormData({ pecheurId: "" });
          setEditingId(null);
        });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de l'enregistrement de l'équipement");
    }
  };

  const handleEdit = (equipement: EquipementPeche) => {
    setFormData({
      typeEquipement: equipement.typeEquipement,
      quantite: equipement.quantite,
      utilisationHebdomadaire: equipement.utilisationHebdomadaire,
      dureeUtilisation: equipement.dureeUtilisation,
      rendementEstime: equipement.rendementEstime,
      pecheurId: equipement.pecheurId,
    });
    setEditingId(equipement.id);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`/api/equip_peche/${deletingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'équipement");
        }
        return response.json();
      })
      .then(() => {
        setEquipements((prev) =>
          prev.filter((equipement) => equipement.id !== deletingId)
        );
        toast.success("Suppression réussie");
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
              {/* <FishingPole className="h-8 w-8 text-blue-600" /> */}
              Gestion des Équipements de Pêche
            </h2>
            <p className="text-gray-600">
              Enregistrement des équipements utilisés par les pêcheurs
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer"
                disabled={isDialogOpen}
                size="sm"
                onClick={() => {
                  setFormData({ pecheurId: "" });
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block">Nouvel équipement</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingId
                    ? "Modifier un équipement"
                    : "Ajouter un équipement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="typeEquipement">
                      Type d&lsquo;équipement
                    </Label>
                    <Input
                      id="typeEquipement"
                      value={formData.typeEquipement || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          typeEquipement: e.target.value,
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
                      <Label htmlFor="quantite">Quantité</Label>
                      <Input
                        id="quantite"
                        type="number"
                        value={formData.quantite || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            quantite: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="utilisationHebdomadaire">
                        Utilisation hebdomadaire (heures)
                      </Label>
                      <Input
                        id="utilisationHebdomadaire"
                        type="number"
                        value={formData.utilisationHebdomadaire || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            utilisationHebdomadaire: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dureeUtilisation">
                        Durée d&apos;utilisation (mois)
                      </Label>
                      <Input
                        id="dureeUtilisation"
                        type="number"
                        value={formData.dureeUtilisation || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dureeUtilisation: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="rendementEstime">
                        Rendement estimé (%)
                      </Label>
                      <Input
                        id="rendementEstime"
                        type="number"
                        value={formData.rendementEstime || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rendementEstime: e.target.value
                              ? parseInt(e.target.value)
                              : null,
                          }))
                        }
                      />
                    </div>
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
                      Liste des Équipements ({filteredEquipements.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par type d'équipement..."
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
                      <TableHead>Type d&apos;équipement</TableHead>
                      <TableHead>Pêcheur</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Utilisation (h/semaine)</TableHead>
                      <TableHead>Durée (mois)</TableHead>
                      <TableHead>Rendement (%)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipements.map((equipement) => (
                      <TableRow key={equipement?.id}>
                        <TableCell className="font-medium">
                          {equipement?.typeEquipement}
                        </TableCell>
                        <TableCell>
                          {equipement?.pecheur?.enquete?.nomEnquete}
                        </TableCell>
                        <TableCell>{equipement?.quantite}</TableCell>
                        <TableCell>
                          {equipement?.utilisationHebdomadaire}
                        </TableCell>
                        <TableCell>{equipement?.dureeUtilisation}</TableCell>
                        <TableCell>{equipement?.rendementEstime}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(equipement)}
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
                                    setDeletingId(equipement.id);
                                    setIsDeleteModal(true);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Voulez-vous supprimer cet équipement?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible.
                                    L&apos;équipement sera définitivement
                                    supprimé.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
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
