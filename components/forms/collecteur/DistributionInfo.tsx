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
    destination_produit: [],
    lieu_vente: [],
    moyensTransport: [],
    techniquesTransport: [],
    frequenceLivraisons: undefined,
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
    field:
      | "destination_produit"
      | "lieu_vente"
      | "moyensTransport"
      | "techniquesTransport",
    defaultValue: string = ""
  ) => {
    const currentItems = dist[field];
    updateField(field, [...currentItems, defaultValue]);
  };

  const removeItem = (
    field:
      | "destination_produit"
      | "lieu_vente"
      | "moyensTransport"
      | "techniquesTransport",
    index: number
  ) => {
    const updatedItems = [...dist[field]];
    updatedItems.splice(index, 1);
    updateField(field, updatedItems);
  };

  const updateItem = (
    field:
      | "destination_produit"
      | "lieu_vente"
      | "moyensTransport"
      | "techniquesTransport",
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
        {/* Destination produit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Destination produit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dist.destination_produit.map((destination, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Input
                    value={destination}
                    onChange={(e) =>
                      updateItem("destination_produit", index, e.target.value)
                    }
                    placeholder="Destination des produits"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("destination_produit", index)}
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
              onClick={() =>
                addItem("destination_produit", "Nouvelle destination")
              }
            >
              <Plus className="h-4 w-4" />
              Ajouter une destination
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
            {dist.lieu_vente.map((point, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Input
                    value={point}
                    onChange={(e) =>
                      updateItem("lieu_vente", index, e.target.value)
                    }
                    placeholder="Nom du point de vente"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("lieu_vente", index)}
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
              onClick={() => addItem("lieu_vente", "Nouveau point de vente")}
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
            {dist.moyensTransport.map((transport, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Select
                    value={transport}
                    onValueChange={(value) => {
                      updateItem("moyensTransport", index, value);
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
                    onClick={() => removeItem("moyensTransport", index)}
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
              onClick={() => addItem("moyensTransport", transportOptions[0])}
            >
              <Plus className="h-4 w-4" />
              Ajouter un transport
            </Button>
          </CardContent>
        </Card>

        {/* Techniques de transport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Techniques de transport
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dist.techniquesTransport.map((technique, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-10 space-y-2">
                  <Input
                    value={technique}
                    onChange={(e) =>
                      updateItem("techniquesTransport", index, e.target.value)
                    }
                    placeholder="Technique de transport"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem("techniquesTransport", index)}
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
              onClick={() =>
                addItem("techniquesTransport", "Nouvelle technique")
              }
            >
              <Plus className="h-4 w-4" />
              Ajouter une technique
            </Button>
          </CardContent>
        </Card>

        {/* Fréquence de livraisons */}
        <Card>
          <CardHeader>
            <CardTitle>Fréquence de livraisons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Fréquence de livraisons (par mois)</Label>
              <Input
                type="number"
                value={dist.frequenceLivraisons || ""}
                onChange={(e) =>
                  updateField(
                    "frequenceLivraisons",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
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
