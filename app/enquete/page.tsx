"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import { Plus, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import loader from "@/assets/loader.gif";
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
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

type Enquete = {
  id: string;
  nomEnquete: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  nomRepondant?: string;
  dateEnquete?: Date;
  secteur?: {
    id: string;
    nom: string;
  };
  enqueteur?: {
    id: string;
    nom: string;
  };
  membresFamille?: {
    id: string;
    nom: string;
    age?: number;
    sexe?: "M" | "F";
    estChefMenage?: boolean;
    lienFamilial?: string;
    frequentationEcole?: boolean;
    niveauEducation?: string;
    enqueteId: string;
  }[];
};

type MembreFamille = {
  id: string;
  nom: string;
  age?: number;
  sexe?: "MASCCULIN" | "FEMININ" | "AUTRE";
  estChefMenage?: boolean;
  lienFamilial?: string;
  frequentationEcole?: boolean;
  niveauEducation?: string;

  enqueteId: string;
};

export default function ListeEnquetes() {
  const [enquetes, setEnquetes] = useState<Enquete[]>([]);
  const [membresFamille, setMembresFamille] = useState<MembreFamille[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // const [selectedEnqueteId, setSelectedEnqueteId] = useState<string | null>(
  //   null
  // );

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          // Fetch enquetes
          const enqueteResponse = await fetch("/api/enquetes");
          const enqueteData = await enqueteResponse.json();
          setEnquetes(enqueteData);
          console.log("Enquêtes:", enqueteData);

          // Fetch membres famille
          const familleResponse = await fetch("/api/membre-famille");
          const familleData = await familleResponse.json();
          setMembresFamille(familleData);
          console.log("Membres de famille:", familleData);

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchData();
    },
    [
      // This dependency is not needed here, but kept for consistency
    ]
  );

  const filteredEnquetes = enquetes.filter((enquete) =>
    enquete.nomEnquete.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMembresByEnqueteId = (enqueteId: string) => {
    return membresFamille.filter((membre) => membre.enqueteId === enqueteId);
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Non spécifiée";
    return format(new Date(date), "PPP", { locale: fr });
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="flex justify-center h-screen items-center">
          <Image src={loader} width={150} height={150} alt="Loading ..." />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Gestion des Enquêtes</h2>
            <p className="text-gray-600">
              Liste des enquêtes en cours et passées
            </p>
          </div>
          <Link href="/formulaire/ajout-enquete">
            <Button className="cursor-pointer">
              <div className="flex justify-center items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden md:block">Nouvelle enquête</span>
              </div>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-center md:justify-between items-center">
                  <CardTitle>
                    <span className="hidden md:block">
                      Liste des Enquêtes ({filteredEnquetes.length})
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher une enquête..."
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
                      <TableHead>Nom enquête</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Répondant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Secteur</TableHead>
                      <TableHead>Enquêteur</TableHead>
                      <TableHead>Famille</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnquetes.map((enquete) => {
                      const membres = getMembresByEnqueteId(enquete.id);
                      return (
                        <TableRow key={enquete.id}>
                          <TableCell className="font-medium">
                            {enquete.nomEnquete}
                          </TableCell>
                          <TableCell>
                            {enquete.estPecheur && "Pêcheur "}
                            {enquete.estCollecteur && "Collecteur "}
                            {enquete.touteActivite && "Toute activité"}
                          </TableCell>
                          <TableCell>{enquete.nomRepondant || "-"}</TableCell>
                          <TableCell>
                            {formatDate(enquete.dateEnquete)}
                          </TableCell>
                          <TableCell>{enquete.secteur?.nom || "-"}</TableCell>
                          <TableCell>{enquete.enqueteur?.nom || "-"}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  // onClick={() =>
                                  //   setSelectedEnqueteId(enquete.id)
                                  // }
                                >
                                  <Users className="h-4 w-4" />
                                  <span className="ml-2">{membres.length}</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="min-w-4xl overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Membres de la famille
                                  </DialogTitle>
                                  <p className="text-sm text-gray-500">
                                    Enquête: {enquete.nomEnquete}
                                  </p>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Âge</TableHead>
                                        <TableHead>Sexe</TableHead>
                                        <TableHead>
                                          Niveau d&apos;éducation
                                        </TableHead>
                                        <TableHead>
                                          Niveau d&apos;éducation
                                        </TableHead>
                                        <TableHead>Lien familial</TableHead>
                                        <TableHead>
                                          Fréquentation école
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {membres.map((membre) => (
                                        <TableRow key={membre.id}>
                                          <TableCell>{membre.nom}</TableCell>
                                          <TableCell>
                                            {membre.age || "-"}
                                          </TableCell>
                                          <TableCell>
                                            {membre.sexe === "MASCCULIN"
                                              ? "Homme"
                                              : membre.sexe === "FEMININ"
                                              ? "Femme"
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {membre.lienFamilial || "-"}
                                          </TableCell>
                                          <TableCell>
                                            {membre.frequentationEcole
                                              ? "Oui"
                                              : "Non"}
                                          </TableCell>
                                          <TableCell>
                                            {membre.niveauEducation || "-"}
                                          </TableCell>
                                          <TableCell>
                                            {membre.estChefMenage
                                              ? "Oui"
                                              : "Non"}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
