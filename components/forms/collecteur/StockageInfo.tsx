import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stockage } from "@/type/localType";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface StockageInfoProps {
  stockage: Stockage[];
  onChange: (stockage: Stockage[]) => void;
}

export function StockageInfo({ stockage, onChange }: StockageInfoProps) {
  // Comme on n'a qu'un seul stockage, on travaille avec le premier élément
  const stock = stockage[0] || {
    id: crypto.randomUUID(),
    lieuStockage: [],
    techniqueConservation: "",
    dureeStockageJours: undefined,
    tauxPerte: undefined,
    gestionDechets: "",
  };

  const updateField = <K extends keyof Stockage>(
    field: K,
    value: Stockage[K]
  ) => {
    const updated = { ...stock, [field]: value };
    onChange([updated]);
  };

  const handleLieuStockageChange = (index: number, value: string) => {
    const newLieux = [...stock.lieuStockage];
    newLieux[index] = value;
    updateField("lieuStockage", newLieux);
  };

  const addLieuStockage = () => {
    updateField("lieuStockage", [...stock.lieuStockage, ""]);
  };

  const removeLieuStockage = (index: number) => {
    const newLieux = stock.lieuStockage.filter((_, i) => i !== index);
    updateField("lieuStockage", newLieux);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de Stockage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lieux de stockage */}
        <div className="space-y-2">
          <Label>Lieux de stockage</Label>
          {stock.lieuStockage.map((lieu, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={lieu}
                onChange={(e) =>
                  handleLieuStockageChange(index, e.target.value)
                }
                placeholder="Localisation du stockage"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeLieuStockage(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={addLieuStockage}
          >
            <Plus className="h-4 w-4" />
            Ajouter un lieu
          </Button>
        </div>

        {/* Technique de conservation */}
        <div className="space-y-2">
          <Label>Technique de conservation</Label>
          <Input
            value={stock.techniqueConservation || ""}
            onChange={(e) =>
              updateField("techniqueConservation", e.target.value)
            }
            placeholder="Méthode utilisée pour conserver les produits"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Durée de stockage */}
          <div className="space-y-2">
            <Label>Durée moyenne de stockage (jours)</Label>
            <Input
              type="number"
              value={stock.dureeStockageJours || ""}
              onChange={(e) =>
                updateField(
                  "dureeStockageJours",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Taux de perte */}
          <div className="space-y-2">
            <Label>Taux de perte (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={stock.tauxPerte || ""}
              onChange={(e) =>
                updateField(
                  "tauxPerte",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </div>
        </div>

        {/* Gestion des déchets */}
        <div className="space-y-2">
          <Label>Gestion des déchets</Label>
          <Input
            value={stock.gestionDechets || ""}
            onChange={(e) => updateField("gestionDechets", e.target.value)}
            placeholder="Comment les déchets sont gérés"
          />
        </div>
      </CardContent>
    </Card>
  );
}
