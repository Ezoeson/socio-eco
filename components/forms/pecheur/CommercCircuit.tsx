import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircuitCommercial } from "@/type/localType";

type Destination = {
  nom: string;
  pourcentage: number;
};

interface CommercialCircuitProps {
  circuits: CircuitCommercial[];

  onChange: (circuits: CircuitCommercial[]) => void;
}

export function CommercialCircuit({
  circuits,
  onChange,
}: CommercialCircuitProps) {
  // Gestion des circuits
  const addCircuit = () => {
    const newCircuit: CircuitCommercial = {
      id: crypto.randomUUID(),
      typeProduit: "",
      avanceFinanciere: false,
      montantAvance: undefined,
      determinePrix: false,
      prixUnitaire: undefined,
      restrictionQuantite: false,
      quantiteLivree: undefined,
      modePaiement: "",
      periodeDemandeElevee: "",
      periodeDemandeFaible: "",
      modeLivraison: "",
      methodeDeconservation: "",
      dureeDeplacement: undefined,
      prixAvantCorona: undefined,
      prixPendantCorona: undefined,
      prixApresCorona: undefined,
      destinations: [],
    };
    onChange([...circuits, newCircuit]);
  };

  const removeCircuit = (id: string) => {
    onChange(circuits.filter((c) => c.id !== id));
  };

  const updateCircuit = <K extends keyof CircuitCommercial>(
    id: string,
    field: K,
    value: CircuitCommercial[K]
  ) => {
    onChange(circuits.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  // Gestion des destinations
  const addDestination = (circuitId: string) => {
    onChange(
      circuits.map((c) => ({
        ...c,
        destinations:
          c.id === circuitId
            ? [...c.destinations, { nom: "", pourcentage: 0 }]
            : c.destinations,
      }))
    );
  };

  const removeDestination = (circuitId: string, index: number) => {
    onChange(
      circuits.map((c) => ({
        ...c,
        destinations:
          c.id === circuitId
            ? c.destinations.filter((_, i) => i !== index)
            : c.destinations,
      }))
    );
  };

  const updateDestination = (
    circuitId: string,
    index: number,
    field: keyof Destination,
    value: string | number
  ) => {
    onChange(
      circuits.map((c) => {
        if (c.id !== circuitId) return c;

        const updatedDestinations = [...c.destinations];
        updatedDestinations[index] = {
          ...updatedDestinations[index],
          [field]: field === "pourcentage" ? Number(value) : value,
        };

        return { ...c, destinations: updatedDestinations };
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Circuits commerciaux ({circuits.length})
        </h3>
        <Button type="button" onClick={addCircuit} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {circuits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun circuit commercial enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {circuits.map((circuit) => (
            <div key={circuit.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  Circuit:{" "}
                  <span className="font-bold">
                    {circuit.typeProduit || "Nouveau circuit"}
                  </span>
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCircuit(circuit.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sections restantes inchangées mais utilisant updateCircuit */}
                {/* Section Informations de base */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informations de base</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de produit</Label>
                      <Input
                        value={circuit.typeProduit}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "typeProduit",
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
                      <input
                        type="checkbox"
                        checked={circuit.avanceFinanciere}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "avanceFinanciere",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label>Avance financière</Label>
                    </div>

                    {circuit.avanceFinanciere && (
                      <div className="space-y-2">
                        <Label>Montant avance</Label>
                        <Input
                          type="number"
                          value={circuit.montantAvance || ""}
                          onChange={(e) =>
                            updateCircuit(
                              circuit.id,
                              "montantAvance",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={circuit.determinePrix}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "determinePrix",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label>Faiseur de prix</Label>
                    </div>

                    {circuit.determinePrix && (
                      <div className="space-y-2">
                        <Label>Prix unitaire (MGA)</Label>
                        <Input
                          type="number"
                          value={circuit.prixUnitaire || ""}
                          onChange={(e) =>
                            updateCircuit(
                              circuit.id,
                              "prixUnitaire",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={circuit.restrictionQuantite}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "restrictionQuantite",
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <Label>Limitation quantité</Label>
                    </div>

                    {circuit.restrictionQuantite && (
                      <div className="space-y-2">
                        <Label>Quantité livrée</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={circuit.quantiteLivree || ""}
                          onChange={(e) =>
                            updateCircuit(
                              circuit.id,
                              "quantiteLivree",
                              parseFloat(e.target.value)
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Mode de paiement</Label>
                      <Input
                        value={circuit.modePaiement}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "modePaiement",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Périodes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Périodes de demande</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Période demande élevée</Label>
                      <Input
                        value={circuit.periodeDemandeElevee}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "periodeDemandeElevee",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Période demande faible</Label>
                      <Input
                        value={circuit.periodeDemandeFaible}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "periodeDemandeFaible",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section Prix et mode livraison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Prix et mode de livraison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mode de livraison</Label>
                      <Input
                        value={circuit.modeLivraison}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "modeLivraison",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Méthode de conservation</Label>
                      <Input
                        value={circuit.methodeDeconservation}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "methodeDeconservation",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Durée de déplacement (jours)</Label>
                      <Input
                        type="number"
                        value={circuit.dureeDeplacement || ""}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "dureeDeplacement",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prix avant COVID (MGA)</Label>
                        <Input
                          type="number"
                          value={circuit.prixAvantCorona || ""}
                          onChange={(e) =>
                            updateCircuit(
                              circuit.id,
                              "prixAvantCorona",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Prix pendant COVID (MGA)</Label>
                        <Input
                          type="number"
                          value={circuit.prixPendantCorona || ""}
                          onChange={(e) =>
                            updateCircuit(
                              circuit.id,
                              "prixPendantCorona",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Prix après COVID (MGA)</Label>
                      <Input
                        type="number"
                        value={circuit.prixApresCorona || ""}
                        onChange={(e) =>
                          updateCircuit(
                            circuit.id,
                            "prixApresCorona",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                {/* Section Destinations */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Destinations commerciales</CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addDestination(circuit.id)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter destination
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {circuit.destinations.map((dest, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-4 items-end"
                      >
                        <div className="col-span-5 space-y-2">
                          <Label>Nom destination</Label>
                          <Input
                            value={dest.nom}
                            onChange={(e) =>
                              updateDestination(
                                circuit.id,
                                index,
                                "nom",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="col-span-5 space-y-2">
                          <Label>Pourcentage (%)</Label>
                          <Input
                            type="number"
                            value={dest.pourcentage}
                            onChange={(e) =>
                              updateDestination(
                                circuit.id,
                                index,
                                "pourcentage",
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
                            onClick={() => removeDestination(circuit.id, index)}
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
