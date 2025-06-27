"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Wrapper from "@/components/Wrapper";

import { Plus, Search, Edit, Trash2, User, Camera } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

interface Enqueteur {
  id: string;
  nom: string;
  prenom?: string;
  code?: string;
  telephone?: string;
  image?: string;
  email?: string;
  actif: boolean;
}

export default function Enqueteur() {
  const [enqueteurs, setEnqueteurs] = useState<Enqueteur[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<Partial<Enqueteur>>({
    actif: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  useEffect(() => {
    const fetchEnqueteurs = async () => {
      try {
        const response = await fetch("/api/enqueteur");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des enquêteurs");
        }
        const data = await response.json();
        setEnqueteurs(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de la récupération des enquêteurs");
      }
    };
    fetchEnqueteurs();
  }, [isDialogOpen, isDeleteModal]);

  const filteredEnqueteurs = enqueteurs?.filter((enqueteur) =>
    `${enqueteur.nom} ${enqueteur.prenom || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (enqueteur: Enqueteur) => {
    console.log("Editing enqueteur with ID:", enqueteur.id);
    // Create a clean copy without any undefined values
    const cleanData = {
      nom: enqueteur.nom,
      prenom: enqueteur.prenom ?? undefined,
      code: enqueteur.code ?? undefined,
      telephone: enqueteur.telephone ?? undefined,
      image: enqueteur.image ?? undefined,
      email: enqueteur.email ?? undefined,
      actif: enqueteur.actif,
    };

    setFormData(cleanData);
    setEditingId(enqueteur.id);
    setIsDialogOpen(true);
  };
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/enqueteur/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setEnqueteurs((prev) =>
        prev.filter((enqueteur) => enqueteur.id !== deletingId)
      );
      toast.success("Enquêteur supprimé avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleteModal(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom) {
      toast.error("Le nom est obligatoire");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/enqueteur/${editingId}` : "/api/enqueteur";

      // Prepare the request body
      const requestBody = editingId
        ? { ...formData, id: undefined } // Remove id for updates
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // First check if response is empty
      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Empty response from server");
      }

      // Try to parse as JSON
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingId
              ? "Erreur lors de la modification"
              : "Erreur lors de la création")
        );
      }

      if (editingId) {
        setEnqueteurs((prev) =>
          prev.map((enqueteur) =>
            enqueteur.id === editingId ? data : enqueteur
          )
        );
        toast.success("Enquêteur modifié avec succès");
      } else {
        setEnqueteurs((prev) => [...prev, data]);
        toast.success("Enquêteur ajouté avec succès");
      }

      // Reset form
      setFormData({ actif: true });
      setEditingId(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erreur complète:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Erreur inconnue");
      } else {
        toast.error("Une erreur inconnue est survenue");
      }
    }
  };

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
      setFormData((prev) => ({ ...prev, image: data.path })); // Enregistre seulement le chemin
      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'upload de l'image");
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold  flex items-center gap-2">
              <User className="h-8 w-8 text-blue-600" />
              Gestion des Enquêteurs
            </h2>
            <p className="">Administration des enquêteurs terrain</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer flex justify-center items-center gap-2 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setFormData({ actif: true });
                  setEditingId(null);
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:block">Ajouter un enquêteur</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-6 rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold  text-center">
                  {editingId ? "Modifier un enquêteur" : "Ajouter un enquêteur"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Section photo de profil */}
                <div className="flex flex-col items-center space-y-3">
                  <Label className="text-sm font-medium ">
                    Photo de profil
                  </Label>

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
                    <Label className="text-sm font-medium ">Nom *</Label>
                    <Input
                      value={formData.nom || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, nom: e.target.value })
                      }
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium ">Prénom</Label>
                    <Input
                      value={formData.prenom || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, prenom: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium ">Code</Label>
                    <Input
                      value={formData.code || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium ">Téléphone</Label>
                    <Input
                      value={formData.telephone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, telephone: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium ">Email</Label>
                    <Input
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      type="email"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="actif"
                      checked={formData.actif || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, actif: checked as boolean })
                      }
                      className="h-4 w-4 border-gray-300 data-[state=checked]:bg-primary"
                    />
                    <Label htmlFor="actif" className="text-sm font-medium ">
                      Actif
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-primary hover:bg-primary/90"
                >
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
                <div className="flex md:justify-between justify-center items-center">
                  <CardTitle>
                    <span className="hidden md:block">
                      Liste des Enquêteurs ({filteredEnqueteurs.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un enquêteur..."
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
                      <TableHead>Image</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnqueteurs?.map((enqueteur) => (
                      <TableRow key={enqueteur.id}>
                        <TableCell>
                          {enqueteur.image ? (
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              <Image
                                src={enqueteur.image}
                                alt={`${enqueteur.nom} ${enqueteur.prenom}`}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // Fallback si l'image ne charge pas
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
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(enqueteur)}
                            >
                              <Edit className="h-3 w-3" />
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
                                    setDeletingId(enqueteur.id);
                                    setIsDeleteModal(true);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Voulez-vous supprimer cet enquêteur?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Cette action est irréversible.
                                    L&apos;enquêteur sera définitivement
                                    supprimé du système.
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
