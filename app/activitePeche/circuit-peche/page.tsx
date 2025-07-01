"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Edit, Trash2, Truck, Eye } from "lucide-react";
import Link from "next/link";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type CircuitCommercial = {
  id: string;
  typeProduit: string | null;
  modeLivraison: string | null;
  prixUnitaire: number | null;
  pecheurId: string;
  pecheur: { id: string; enquete: { nomRepondant: string } };
  destinations: {
    nom: string | null;
    pourcentage: number | null;
  }[];
};

export default function CircuitsCommerciaux() {
  const [circuits, setCircuits] = useState<CircuitCommercial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCircuits = async () => {
      try {
        const response = await fetch("/api/circ_commerc");
        const data = await response.json();
        setCircuits(data);
      } catch (error) {
        console.error("Error fetching circuits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCircuits();
  }, []);

  const filteredCircuits = circuits.filter(
    (circuit) =>
      circuit.typeProduit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      circuit.pecheur.enquete.nomRepondant
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const response = await fetch(`/api/circuit_commerc/${deletingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      setCircuits((prev) => prev.filter((c) => c.id !== deletingId));
      toast.success("Circuit supprimé avec succès");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Truck className="h-8 w-8 text-blue-600" />
              Circuits Commerciaux
            </h2>
            <p className="text-gray-600">
              Gestion des circuits de commercialisation
            </p>
          </div>

          <Link href="/activitePeche/circuit-peche/ajout">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau circuit
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Liste des circuits ({filteredCircuits.length})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
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
                  <TableHead>Pêcheur</TableHead>
                  <TableHead>Type de produit</TableHead>
                  <TableHead>Mode livraison</TableHead>
                  <TableHead>Prix unitaire</TableHead>
                  <TableHead>Destinations</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCircuits.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-2xl">
                      Aucune circuit trouvé
                    </TableCell>
                  </TableRow>
                ) : null}

                {loading
                  ? Array.from({
                      length:
                        filteredCircuits.length > 0
                          ? filteredCircuits.length
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
                  : filteredCircuits.map((circuit) => (
                      <TableRow key={circuit.id}>
                        <TableCell>
                          {circuit.pecheur.enquete.nomRepondant}
                        </TableCell>
                        <TableCell>{circuit.typeProduit || "-"}</TableCell>
                        <TableCell>{circuit.modeLivraison || "-"}</TableCell>
                        <TableCell>{circuit.prixUnitaire || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {circuit.destinations.map((dest, i) => (
                              <div key={i} className="text-sm">
                                {dest.nom} ({dest.pourcentage}%)
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link
                              href={`/activitePeche/circuit-peche/details/${circuit.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 text-blue-500" />
                              </Button>
                            </Link>
                            <Link
                              href={`/activitePeche/circuit-peche/modifier/${circuit.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 text-green-500" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDeletingId(circuit.id)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmer la suppression
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer ce
                                    circuit ?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction onClick={handleDelete}>
                                    Supprimer
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
    </Wrapper>
  );
}
