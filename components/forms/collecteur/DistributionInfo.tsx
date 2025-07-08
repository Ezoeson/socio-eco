import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Truck,
  RefreshCw,
  Activity,
  Calendar,
} from "lucide-react";
import { Distribution } from "@/type/localType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DistributionInfoProps {
  distribution: Distribution[];
  onChange: (distribution: Distribution[]) => void;
}

const transportOptions = [
  "Camion frigorifique",
  "Camion non frigorifique",
  "Véhicule léger",
  "Moto",
  "Bateau",
  "Autre",
];

export function DistributionInfo({
  distribution,
  onChange,
}: DistributionInfoProps) {
  const dist = distribution[0] || {
    id: crypto.randomUUID(),
    circuitDistribution: [],
    pointVente: [],
    moyenTransport: [],
    frequenceLivraisonsMois: undefined,
    techniqueTransport: "",
    periodeDemandeElevee: "",
    periodeDemandeFaible: "",
  };

  const updateField = <K extends keyof Distribution>(
    field: K,
    value: Distribution[K]
  ) => {
    const updated = { ...dist, [field]: value };
    onChange([updated]);
  };

  const addItem = (
    field: "circuitDistribution" | "pointVente" | "moyenTransport",
    defaultValue: string = ""
  ) => {
    const currentItems = dist[field];
    updateField(field, [...currentItems, defaultValue]);
  };

  const removeItem = (
    field: "circuitDistribution" | "pointVente" | "moyenTransport",
    index: number
  ) => {
    const updatedItems = [...dist[field]];
    updatedItems.splice(index, 1);
    updateField(field, updatedItems);
  };

  const updateItem = (
    field: "circuitDistribution" | "pointVente" | "moyenTransport",
    index: number,
    value: string
  ) => {
    const updatedItems = [...dist[field]];
    updatedItems[index] = value;
    updateField(field, updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Réseau de distribution</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Circuits de distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Circuits de distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dist.circuitDistribution.map((circuit, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Input
                    value={circuit}
                    onChange={(e) =>
                      updateItem("circuitDistribution", index, e.target.value)
                    }
                    placeholder="Nom du circuit"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("circuitDistribution", index)}
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
              onClick={() => addItem("circuitDistribution", "Nouveau circuit")}
            >
              <Plus className="h-4 w-4" />
              Ajouter un circuit
            </Button>
          </CardContent>
        </Card>

        {/* Points de vente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Points de vente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dist.pointVente.map((point, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Input
                    value={point}
                    onChange={(e) =>
                      updateItem("pointVente", index, e.target.value)
                    }
                    placeholder="Nom du point de vente"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("pointVente", index)}
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
              onClick={() => addItem("pointVente", "Nouveau point de vente")}
            >
              <Plus className="h-4 w-4" />
              Ajouter un point
            </Button>
          </CardContent>
        </Card>

        {/* Moyens de transport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Moyens de transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dist.moyenTransport.map((transport, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Select
                    value={transport}
                    onValueChange={(value) => {
                      updateItem("moyenTransport", index, value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un transport" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("moyenTransport", index)}
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
              onClick={() => addItem("moyenTransport", transportOptions[0])}
            >
              <Plus className="h-4 w-4" />
              Ajouter un transport
            </Button>
          </CardContent>
        </Card>

        {/* Fréquence et technique */}
        <Card>
          <CardHeader>
            <CardTitle>Fréquence et technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fréquence de livraisons (par mois)</Label>
              <Input
                type="number"
                value={dist.frequenceLivraisonsMois || ""}
                onChange={(e) =>
                  updateField(
                    "frequenceLivraisonsMois",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Technique de transport</Label>
              <Input
                value={dist.techniqueTransport || ""}
                onChange={(e) =>
                  updateField("techniqueTransport", e.target.value)
                }
                placeholder="Ex: Emballage sous vide"
              />
            </div>
          </CardContent>
        </Card>

        {/* Périodes de demande */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Périodes de demande
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Période de demande élevée</Label>
              <Input
                value={dist.periodeDemandeElevee || ""}
                onChange={(e) =>
                  updateField("periodeDemandeElevee", e.target.value)
                }
                placeholder="Ex: Juillet-Septembre"
              />
            </div>

            <div className="space-y-2">
              <Label>Période de demande faible</Label>
              <Input
                value={dist.periodeDemandeFaible || ""}
                onChange={(e) =>
                  updateField("periodeDemandeFaible", e.target.value)
                }
                placeholder="Ex: Janvier-Mars"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
