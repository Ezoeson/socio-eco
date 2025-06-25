"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { MembreFamilleForm } from "./MembreFamilleForm";
import { ArrowRightLeftIcon, User, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import Link from "next/link";

interface MembreFamille {
  id: string;
  nom: string;
  age?: number;
  ancienLieuResidence?: string;
  villageOrigine?: string;
  anneeArrivee?: number;
  niveauEducation?: string;
  lienFamilial?: string;
  sexe?: string;
  frequentationEcole?: boolean;
}

interface EnqueteFormData {
  id: string;
  nomEnquete: string;
  nomRepondant?: string;
  estPecheur: boolean;
  estCollecteur: boolean;
  touteActivite: boolean;
  ethnie?: string;
  districtOrigine?: string;
  anneeArriveeVillage?: number;
  possessionAncienMetier?: boolean;
  ancienMetier?: string;
  dateEnquete?: Date;
  membresFamille: MembreFamille[];
}

export function ActeurForm() {
  const [formData, setFormData] = useState<EnqueteFormData>({
    id: "", // Généré automatiquement normalement
    nomEnquete: "",
    estPecheur: false,
    estCollecteur: false,
    touteActivite: false,
    membresFamille: [],
  });

  const handleInputChange = (
    field: keyof EnqueteFormData,
    value: string | number | boolean | Date | MembreFamille[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Données du formulaire:", formData);
    // Traitement des données
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link href="/enquete">
        {/* icon retour */}
        <Button variant="outline" className="mb-4 ">
          <span className="flex items-center gap-2 cursor-pointer ">
            <ArrowRightLeftIcon className="h-4 w-4 text-blue-500" />
            Retour vers les listes
          </span>
        </Button>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Nouvelle Enquête</h1>
          <p className="text-gray-600">Enregistrer une nouvelle enquête</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations générales
            </TabsTrigger>
            <TabsTrigger value="famille" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Famille
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Secteur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner son secteur " />
                    </SelectTrigger>
                    <SelectContent></SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nomEnquete">
                      Nom de la personne cible *
                    </Label>
                    <Input
                      id="nomEnquete"
                      value={formData.nomEnquete}
                      onChange={(e) =>
                        handleInputChange("nomEnquete", e.target.value)
                      }
                      placeholder="Nom de l'enquête"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomRepondant">Nom du répondant</Label>
                    <Input
                      id="nomRepondant"
                      value={formData.nomRepondant || ""}
                      onChange={(e) =>
                        handleInputChange("nomRepondant", e.target.value)
                      }
                      placeholder="Nom de la personne interrogée"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="estPecheur"
                      checked={formData.estPecheur}
                      onCheckedChange={(checked) =>
                        handleInputChange("estPecheur", checked)
                      }
                    />
                    <Label htmlFor="estPecheur">Est pêcheur</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="estCollecteur"
                      checked={formData.estCollecteur}
                      onCheckedChange={(checked) =>
                        handleInputChange("estCollecteur", checked)
                      }
                    />
                    <Label htmlFor="estCollecteur">Est collecteur</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="touteActivite"
                      checked={formData.touteActivite}
                      onCheckedChange={(checked) =>
                        handleInputChange("touteActivite", checked)
                      }
                    />
                    <Label htmlFor="touteActivite">Toute activité</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ethnie">Ethnie</Label>
                    <Input
                      id="ethnie"
                      value={formData.ethnie || ""}
                      onChange={(e) =>
                        handleInputChange("ethnie", e.target.value)
                      }
                      placeholder="Ethnie"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="districtOrigine">
                      District d&apos;origine
                    </Label>
                    <Input
                      id="districtOrigine"
                      value={formData.districtOrigine || ""}
                      onChange={(e) =>
                        handleInputChange("districtOrigine", e.target.value)
                      }
                      placeholder="District d'origine"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anneeArrivee">
                      Année d&apos;arrivée au village
                    </Label>
                    <Input
                      id="anneeArrivee"
                      type="number"
                      value={formData.anneeArriveeVillage || ""}
                      onChange={(e) =>
                        handleInputChange("anneeArriveeVillage", e.target.value)
                      }
                      placeholder="Année d'arrivée"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ancienMetier"
                      checked={formData.possessionAncienMetier || false}
                      onCheckedChange={(checked) =>
                        handleInputChange("possessionAncienMetier", checked)
                      }
                    />
                    <Label htmlFor="ancienMetier">
                      Possédait un ancien métier
                    </Label>
                  </div>

                  {formData.possessionAncienMetier && (
                    <div className="space-y-2">
                      <Label htmlFor="ancienMetierDesc">
                        Description de l&apos;ancien métier
                      </Label>
                      <Input
                        id="ancienMetierDesc"
                        value={formData.ancienMetier || ""}
                        onChange={(e) =>
                          handleInputChange("ancienMetier", e.target.value)
                        }
                        placeholder="Décrire l'ancien métier"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="famille">
            <Card>
              <CardHeader>
                <CardTitle>Composition familiale</CardTitle>
              </CardHeader>
              <CardContent>
                <MembreFamilleForm
                  membres={formData.membresFamille}
                  onChange={(membres) =>
                    handleInputChange("membresFamille", membres)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit">Enregistrer l&rsquo;enquête</Button>
        </div>
      </form>
    </div>
  );
}
