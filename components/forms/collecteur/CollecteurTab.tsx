"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collecteur,
  ProduitAchete,
  Stockage,
  Distribution,
  ContratAcheteur,
} from "@/type/localType";
import {
  Truck,
  ShoppingCart,
  Warehouse,
  User,
  MapPin,
  Plus,
  Trash2,
  DollarSign,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProduitsAchetes } from "./ProduitsAchetes";
import { StockageInfo } from "./StockageInfo";
import { DistributionInfo } from "./DistributionInfo";
import { useState } from "react";
import ContratInfo from "./ContratInfo";

interface CollecteurTabsProps {
  collecteur?: Collecteur;
  onCollecteurChange: (updated: Collecteur) => void;
}

const defaultCollecteur: Collecteur = {
  id: "",
  lieuCollecte: [],
  produitsAchetes: [],
  stockages: [],
  distributions: [],
  contratsAcheteur: [],
  estMareyeur: false,
  estStockage: true,
  estContrat: false,
};

export default function CollecteurTabs({
  collecteur = defaultCollecteur,
  onCollecteurChange,
}: CollecteurTabsProps) {
  const [activeTab, setActiveTab] = useState("infos");
  console.log(collecteur);

  const handleBaseInfoChange = <K extends keyof Collecteur>(
    field: K,
    value: Collecteur[K]
  ) => {
    onCollecteurChange({ ...collecteur, [field]: value });
  };

  const handleProduitsChange = (produits: ProduitAchete[]) => {
    handleBaseInfoChange("produitsAchetes", produits);
  };

  const handleStockageChange = (stockage: Stockage[]) => {
    handleBaseInfoChange("stockages", stockage);
  };

  const handleDistributionChange = (distribution: Distribution[]) => {
    handleBaseInfoChange("distributions", distribution);
  };
  const handleContratChange = (contratsAcheteur: ContratAcheteur[]) => {
    handleBaseInfoChange("contratsAcheteur", contratsAcheteur);
  };
  // Vérification supplémentaire pour s'assurer que lieuCollecte est un tableau
  const safeCollecteur = {
    ...collecteur,
    lieuCollecte: Array.isArray(collecteur.lieuCollecte)
      ? collecteur.lieuCollecte
      : [],
  };
  const addLieuCollecte = () => {
    onCollecteurChange({
      ...safeCollecteur,
      lieuCollecte: [...safeCollecteur.lieuCollecte, ""],
    });
  };
  const removeLieuCollecte = (index: number) => {
    const updated = [...collecteur.lieuCollecte];
    updated.splice(index, 1);
    handleBaseInfoChange("lieuCollecte", updated);
  };

  const updateLieuCollecte = (index: number, value: string) => {
    const updated = [...collecteur.lieuCollecte];
    updated[index] = value;
    handleBaseInfoChange("lieuCollecte", updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Profil du Collecteur</h3>
      </div>

      <Tabs defaultValue="infos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5  bg-gray-950 ">
          <TabsTrigger value="infos" className="flex gap-2">
            <User className="h-4 w-4 text-lime-600 font-bold" />

            <span className="hidden md:block"> Informations</span>
          </TabsTrigger>
          <TabsTrigger value="produits" className="flex gap-2">
            <ShoppingCart className="h-4 w-4 text-lime-600 font-bold " />

            <span className="hidden md:block"> Produits</span>
          </TabsTrigger>
          {collecteur.estStockage && (
            <TabsTrigger value="stockage" className="flex gap-2">
              <Warehouse className="h-4 w-4 text-lime-600 font-bold" />
              <span className="hidden md:block"> Methode de Stockage</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="distribution" className="flex gap-2">
            <Truck className="h-4 w-4 text-lime-600 font-bold" />

            <span className="hidden md:block"> Distribution</span>
          </TabsTrigger>
          {collecteur.estContrat && (
            <TabsTrigger value="contrat" className="flex gap-2">
              <FileText className="h-4 w-4 text-lime-600 font-bold" />

              <span className="hidden md:block"> Contrat</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="infos" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Localisation & Activité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Lieux de collecte</Label>
                {collecteur?.lieuCollecte?.map((lieu, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-end"
                  >
                    <div className="col-span-10">
                      <Input
                        value={lieu}
                        onChange={(e) =>
                          updateLieuCollecte(index, e.target.value)
                        }
                        placeholder="Nom du lieu de collecte"
                      />
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeLieuCollecte(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={addLieuCollecte}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un lieu
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6  justify-center items-center ">
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="estMareyeur"
                    checked={collecteur.estMareyeur || false}
                    onCheckedChange={(checked) =>
                      handleBaseInfoChange("estMareyeur", !!checked)
                    }
                  />
                  <Label htmlFor="estMareyeur">Est mareyeur</Label>
                </div>
                <div className="space-y-2">
                  <Label>Année de démarrage d&apos;activité</Label>
                  <Input
                    type="number"
                    value={collecteur.anneeDemarrageActivite || ""}
                    onChange={(e) =>
                      handleBaseInfoChange(
                        "anneeDemarrageActivite",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Effectif du personnel</Label>
                  <Input
                    type="number"
                    value={collecteur.effectifPersonnel || ""}
                    onChange={(e) =>
                      handleBaseInfoChange(
                        "effectifPersonnel",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Durée hebdomadaire de collecte (jours)</Label>
                  <Input
                    type="number"
                    value={collecteur.dureeCollecteHebdo || ""}
                    onChange={(e) =>
                      handleBaseInfoChange(
                        "dureeCollecteHebdo",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fréquence de passage</Label>
                  <Input
                    value={collecteur.frequencePassage || ""}
                    onChange={(e) =>
                      handleBaseInfoChange("frequencePassage", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Informations Financières
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Capital total (MGA)</Label>
                <Input
                  type="number"
                  value={collecteur.capitalTotal || ""}
                  onChange={(e) =>
                    handleBaseInfoChange("capitalTotal", Number(e.target.value))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Part capital propre (%)</Label>
                <Input
                  type="number"
                  value={collecteur.partCapitalPropre || ""}
                  onChange={(e) =>
                    handleBaseInfoChange(
                      "partCapitalPropre",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Part capital emprunté (%)</Label>
                <Input
                  type="number"
                  value={collecteur.partCapitalEmprunte || ""}
                  onChange={(e) =>
                    handleBaseInfoChange(
                      "partCapitalEmprunte",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Investissement équipement (MGA)</Label>
                <Input
                  type="number"
                  value={collecteur.investissementEquipement || ""}
                  onChange={(e) =>
                    handleBaseInfoChange(
                      "investissementEquipement",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Investissement location (MGA)</Label>
                <Input
                  type="number"
                  value={collecteur.investissementLocation || ""}
                  onChange={(e) =>
                    handleBaseInfoChange(
                      "investissementLocation",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Coût ressources humaines (MGA)</Label>
                <Input
                  type="number"
                  value={collecteur.coutRessourcesHumaines || ""}
                  onChange={(e) =>
                    handleBaseInfoChange(
                      "coutRessourcesHumaines",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="estStockage"
              checked={collecteur.estStockage || false}
              onCheckedChange={(checked) => {
                handleBaseInfoChange("estStockage", !!checked);
                if (checked) setActiveTab("stockage");
              }}
            />
            <Label htmlFor="estStockage">Pratique le stockage</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="estContrat"
              checked={collecteur.estContrat || false}
              onCheckedChange={(checked) => {
                handleBaseInfoChange("estContrat", !!checked);
                if (checked) setActiveTab("contrat");
              }}
            />
            <Label htmlFor="estContrat">A des contrats avec acheteurs</Label>
          </div>
        </TabsContent>

        {/* Onglet Produits */}
        <TabsContent value="produits" className="mt-6">
          <ProduitsAchetes
            produits={collecteur.produitsAchetes || []}
            onChange={handleProduitsChange}
          />
        </TabsContent>

        {/* Onglet Stockage */}
        <TabsContent value="stockage" className="mt-6">
          <StockageInfo
            stockages={collecteur.stockages || []}
            onChange={handleStockageChange}
          />
        </TabsContent>

        {/* Onglet Distribution */}
        <TabsContent value="distribution" className="mt-6">
          <DistributionInfo
            distribution={collecteur.distributions || []}
            onChange={handleDistributionChange}
          />
        </TabsContent>

        {/* Onglet Contrat */}
        <TabsContent value="contrat" className="mt-6">
          <ContratInfo
            contrats={collecteur.contratsAcheteur}
            onChange={handleContratChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
