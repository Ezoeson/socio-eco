import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ContratAcheteur } from "@/type/localType";

interface ContratInfoProps {
  contrats: ContratAcheteur[];
  onChange: (contrats: ContratAcheteur[]) => void;
}

export default function ContratInfo({ contrats, onChange }: ContratInfoProps) {
  const addContrat = () => {
    onChange([
      ...contrats,
      {
        id: crypto.randomUUID(),
        typeProduit: "",
        perceptionAvance: false,
        montantAvance: undefined,
        acheteurDeterminePrix: false,
        prixVenteKg: undefined,
      },
    ]);
  };

  const removeContrat = (id: string) => {
    onChange(contrats.filter((c) => c.id !== id));
  };

  const updateContrat = <K extends keyof ContratAcheteur>(
    id: string,
    field: K,
    value: ContratAcheteur[K]
  ) => {
    onChange(contrats.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Contrats Acheteur ({contrats.length})
        </h3>
        <Button type="button" onClick={addContrat} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {contrats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun contrat enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contrats.map((contrat) => (
            <div key={contrat.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  Contrat:{" "}
                  <span className="font-bold">
                    {contrat.typeProduit || "Nouveau contrat"}
                  </span>
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContrat(contrat.id)}
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
                        value={contrat.typeProduit || ""}
                        onChange={(e) =>
                          updateContrat(
                            contrat.id,
                            "typeProduit",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Prix de vente (par kg)</Label>
                      <Input
                        type="number"
                        value={contrat.prixVenteKg || ""}
                        onChange={(e) =>
                          updateContrat(
                            contrat.id,
                            "prixVenteKg",
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Conditions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={contrat.perceptionAvance || false}
                        onCheckedChange={(checked) =>
                          updateContrat(
                            contrat.id,
                            "perceptionAvance",
                            !!checked
                          )
                        }
                      />
                      <Label>Perception d&apos;avance</Label>
                    </div>

                    {contrat.perceptionAvance && (
                      <div className="space-y-2">
                        <Label>Montant avance (MGA)</Label>
                        <Input
                          type="number"
                          value={contrat.montantAvance || ""}
                          onChange={(e) =>
                            updateContrat(
                              contrat.id,
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
                        checked={contrat.acheteurDeterminePrix || false}
                        onCheckedChange={(checked) =>
                          updateContrat(
                            contrat.id,
                            "acheteurDeterminePrix",
                            !!checked
                          )
                        }
                      />
                      <Label>Acheteur détermine le prix</Label>
                    </div>
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
