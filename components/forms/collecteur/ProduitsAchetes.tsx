import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProduitAchete } from "@/type/localType";

interface ProduitsAchetesProps {
  produits: ProduitAchete[];
  onChange: (produits: ProduitAchete[]) => void;
}

export function ProduitsAchetes({ produits, onChange }: ProduitsAchetesProps) {
  const addProduit = () => {
    onChange([
      ...produits,
      {
        id: crypto.randomUUID(),
        operateurId: "",
        typeProduit: "",
        volumeHebdomadaireKg: undefined,
        criteresQualite: "",
        systemeAvance: false,
        montantAvance: undefined,
        possedeCarteProfession: false,
        varieteProduit: [],
      },
    ]);
  };

  const removeProduit = (id: string) => {
    onChange(produits.filter((p) => p.id !== id));
  };

  const updateProduit = <K extends keyof ProduitAchete>(
    id: string,
    field: K,
    value: ProduitAchete[K]
  ) => {
    onChange(produits.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addVariete = (produitId: string) => {
    const produit = produits.find((p) => p.id === produitId);
    if (produit) {
      updateProduit(produitId, "varieteProduit", [
        ...produit.varieteProduit,
        "",
      ]);
    }
  };

  const removeVariete = (produitId: string, index: number) => {
    const produit = produits.find((p) => p.id === produitId);
    if (produit) {
      const updatedVarietes = [...produit.varieteProduit];
      updatedVarietes.splice(index, 1);
      updateProduit(produitId, "varieteProduit", updatedVarietes);
    }
  };

  const updateVariete = (produitId: string, index: number, value: string) => {
    const produit = produits.find((p) => p.id === produitId);
    if (produit) {
      const updatedVarietes = [...produit.varieteProduit];
      updatedVarietes[index] = value;
      updateProduit(produitId, "varieteProduit", updatedVarietes);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Produits Achetés ({produits.length})
        </h3>
        <Button type="button" onClick={addProduit} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {produits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun produit enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {produits.map((produit) => (
            <div key={produit.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  Produit:{" "}
                  <span className="font-bold">
                    {produit.typeProduit || "Nouveau produit"}
                  </span>
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProduit(produit.id)}
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
                        value={produit.typeProduit}
                        onChange={(e) =>
                          updateProduit(
                            produit.id,
                            "typeProduit",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Volume hebdomadaire (kg)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={produit.volumeHebdomadaireKg || ""}
                        onChange={(e) =>
                          updateProduit(
                            produit.id,
                            "volumeHebdomadaireKg",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Critères de qualité</Label>
                      <Input
                        value={produit.criteresQualite}
                        onChange={(e) =>
                          updateProduit(
                            produit.id,
                            "criteresQualite",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Financement */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={produit.systemeAvance}
                        onCheckedChange={(checked) =>
                          updateProduit(produit.id, "systemeAvance", !!checked)
                        }
                      />
                      <Label>Système d&apos;avance</Label>
                    </div>

                    {produit.systemeAvance && (
                      <div className="space-y-2">
                        <Label>Montant avance (MGA)</Label>
                        <Input
                          type="number"
                          value={produit.montantAvance || ""}
                          onChange={(e) =>
                            updateProduit(
                              produit.id,
                              "montantAvance",
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={produit.possedeCarteProfession}
                        onCheckedChange={(checked) =>
                          updateProduit(
                            produit.id,
                            "possedeCarteProfession",
                            !!checked
                          )
                        }
                      />
                      <Label>Possède carte professionnelle</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Variétés */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Variétés</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addVariete(produit.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter variété
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {produit.varieteProduit.map((variete, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-end"
                      >
                        <div className="col-span-10 space-y-2">
                          <Input
                            value={variete}
                            onChange={(e) =>
                              updateVariete(produit.id, index, e.target.value)
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeVariete(produit.id, index)}
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
