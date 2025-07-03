import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipementPeche } from "@/type/localType";

interface FishingEquipmentProps {
  equipment: EquipementPeche[];
  onChange: (equipment: EquipementPeche[]) => void;
}

export function FishingEquipment({
  equipment,
  onChange,
}: FishingEquipmentProps) {
  const addEquipment = () => {
    const newItem: EquipementPeche = {
      id: crypto.randomUUID(),
      typeEquipement: "",
      quantite: undefined,
      utilisationHebdomadaire: undefined,
      dureeUtilisation: undefined,
      rendementEstime: undefined,
    };
    onChange([...equipment, newItem]);
  };

  const removeEquipment = (id: string) => {
    onChange(equipment.filter((e) => e.id !== id));
  };

  const updateEquipment = <K extends keyof EquipementPeche>(
    id: string,
    field: K,
    value: EquipementPeche[K]
  ) => {
    onChange(
      equipment.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Équipements ({equipment.length})
        </h3>
        <Button
          type="button"
          onClick={addEquipment}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {equipment.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun équipement enregistré</p>
        </div>
      ) : (
        <div className="space-y-4">
          {equipment.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Équipement:{" "}
                  <span className="text-2xl font-bold uppercase tracking-widest animate-pulse bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                    {item.typeEquipement}
                  </span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEquipment(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="typeEquipement">
                      Type d&lsquo;équipement
                    </Label>
                    <Input
                      id="typeEquipement"
                      value={item.typeEquipement || ""}
                      onChange={(e) =>
                        updateEquipment(
                          item.id,
                          "typeEquipement",
                          e.target.value ? e.target.value : undefined
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      value={item.quantite || ""}
                      onChange={(e) =>
                        updateEquipment(
                          item.id,
                          "quantite",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Utilisation hebdomadaire (heures)</Label>
                    <Input
                      type="number"
                      value={item.utilisationHebdomadaire || ""}
                      onChange={(e) =>
                        updateEquipment(
                          item.id,
                          "utilisationHebdomadaire",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Durée d&apos;utilisation (mois)</Label>
                    <Input
                      type="number"
                      value={item.dureeUtilisation || ""}
                      onChange={(e) =>
                        updateEquipment(
                          item.id,
                          "dureeUtilisation",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label>Rendement estimé (%)</Label>
                    <Input
                      type="number"
                      value={item.rendementEstime || ""}
                      onChange={(e) =>
                        updateEquipment(
                          item.id,
                          "rendementEstime",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
