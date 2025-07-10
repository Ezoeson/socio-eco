import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stockage } from "@/type/localType";

interface StockageInfoProps {
  stockages: Stockage[];
  onChange: (stockages: Stockage[]) => void;
}

export function StockageInfo({ stockages, onChange }: StockageInfoProps) {
  const addStockage = () => {
    onChange([
      ...stockages,
      {
        id: crypto.randomUUID(),
        typeProduit: "",
        lieux: [],
        techniques: [],
        dureesStockage: 0,
        tauxPertes: 0,
        gestionDechets: "",
      },
    ]);
  };

  const removeStockage = (id: string) => {
    onChange(stockages.filter((s) => s.id !== id));
  };

  const updateStockage = <K extends keyof Stockage>(
    id: string,
    field: K,
    value: Stockage[K]
  ) => {
    onChange(
      stockages.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addLieu = (stockageId: string) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      updateStockage(stockageId, "lieux", [...stockage.lieux, ""]);
    }
  };

  const removeLieu = (stockageId: string, index: number) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      const updatedLieux = [...stockage.lieux];
      updatedLieux.splice(index, 1);
      updateStockage(stockageId, "lieux", updatedLieux);
    }
  };

  const updateLieu = (stockageId: string, index: number, value: string) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      const updatedLieux = [...stockage.lieux];
      updatedLieux[index] = value;
      updateStockage(stockageId, "lieux", updatedLieux);
    }
  };

  const addTechnique = (stockageId: string) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      updateStockage(stockageId, "techniques", [...stockage.techniques, ""]);
    }
  };

  const removeTechnique = (stockageId: string, index: number) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      const updatedTechniques = [...stockage.techniques];
      updatedTechniques.splice(index, 1);
      updateStockage(stockageId, "techniques", updatedTechniques);
    }
  };

  const updateTechnique = (
    stockageId: string,
    index: number,
    value: string
  ) => {
    const stockage = stockages.find((s) => s.id === stockageId);
    if (stockage) {
      const updatedTechniques = [...stockage.techniques];
      updatedTechniques[index] = value;
      updateStockage(stockageId, "techniques", updatedTechniques);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Stockages ({stockages.length})
        </h3>
        <Button type="button" onClick={addStockage} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {stockages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun stockage enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stockages.map((stockage) => (
            <div key={stockage.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  Stockage:{" "}
                  <span className="font-bold">
                    {stockage.typeProduit || "Nouveau stockage"}
                  </span>
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStockage(stockage.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de produit</Label>
                      <Input
                        value={stockage.typeProduit}
                        onChange={(e) =>
                          updateStockage(
                            stockage.id,
                            "typeProduit",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Durée de stockage (jours)</Label>
                      <Input
                        type="number"
                        value={stockage.dureesStockage}
                        onChange={(e) =>
                          updateStockage(
                            stockage.id,
                            "dureesStockage",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Taux de pertes (%)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={stockage.tauxPertes}
                        onChange={(e) =>
                          updateStockage(
                            stockage.id,
                            "tauxPertes",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Gestion */}
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Gestion des déchets</Label>
                      <Input
                        value={stockage.gestionDechets}
                        onChange={(e) =>
                          updateStockage(
                            stockage.id,
                            "gestionDechets",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Lieux */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Lieux de stockage</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addLieu(stockage.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un lieu
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stockage.lieux.map((lieu, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-end"
                      >
                        <div className="col-span-10 space-y-2">
                          <Input
                            value={lieu}
                            onChange={(e) =>
                              updateLieu(stockage.id, index, e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeLieu(stockage.id, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Section Techniques */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Techniques de conservation</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addTechnique(stockage.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une technique
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stockage.techniques.map((technique, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-end"
                      >
                        <div className="col-span-10 space-y-2">
                          <Input
                            value={technique}
                            onChange={(e) =>
                              updateTechnique(
                                stockage.id,
                                index,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTechnique(stockage.id, index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
