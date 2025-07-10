import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pecheur } from "@/type/localType";

import {
  PratiquePeche,
  EquipementPeche,
  EmbarcationPeche,
  CircuitCommercial,
} from "@/type/localType";
import { CommercialCircuit } from "./CommercCircuit";
import { FishingBoats } from "./FishingBoats";
import { FishingEquipment } from "./FishingEquipment";
import { FishingPractices } from "./FishingPractices";
import { RefreshCw, Settings, Ship, Waves } from "lucide-react";

interface FishermanTabsProps {
  pecheur: Pecheur;
  onPecheurChange: (updated: Pecheur) => void;
}

export default function FishermanTabs({
  pecheur,
  onPecheurChange,
}: FishermanTabsProps) {
  // Utilisez les mêmes noms que l'API
  const handlePracticesChange = (practices: PratiquePeche[]) => {
    onPecheurChange({ ...pecheur, PratiquePeche: practices });
  };

  const handleEquipmentChange = (equipment: EquipementPeche[]) => {
    onPecheurChange({ ...pecheur, EquipementPeche: equipment });
  };

  const handleBoatsChange = (boats: EmbarcationPeche[]) => {
    onPecheurChange({ ...pecheur, EmbarcationPeche: boats });
  };

  const handleCircuitsChange = (circuits: CircuitCommercial[]) => {
    onPecheurChange({ ...pecheur, CircuitCommercial: circuits });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités de Pêche</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="practices">
          <TabsList className="grid w-full grid-cols-4 bg-gray-950 ">
            <TabsTrigger value="practices">
              <Waves className="h-4 w-4 text-lime-600 font-bold" />
              <span className="hidden md:block">Activité peche</span>
            </TabsTrigger>
            <TabsTrigger value="boats">
              <Ship className="h-4 w-4 text-lime-600 font-bold" />
              <span className="hidden md:block">Embarcations</span>
            </TabsTrigger>
            <TabsTrigger value="equipment">
              <Settings className="h-4 w-4 text-lime-600 font-bold" />
              <span className="hidden md:block"> Équipements</span>
            </TabsTrigger>
            <TabsTrigger value="circuits">
              <RefreshCw className="h-4 w-4 text-lime-600 font-bold" />
              <span className="hidden md:block"> Circuits Commerciaux</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practices">
            <FishingPractices
              practices={pecheur.PratiquePeche || []}
              onChange={handlePracticesChange}
            />
          </TabsContent>
          <TabsContent value="boats">
            <FishingBoats
              boats={pecheur?.EmbarcationPeche || []}
              onChange={handleBoatsChange}
            />
          </TabsContent>
          <TabsContent value="equipment">
            <FishingEquipment
              equipment={pecheur?.EquipementPeche || []}
              onChange={handleEquipmentChange}
            />
          </TabsContent>

          <TabsContent value="circuits">
            <CommercialCircuit
              circuits={pecheur?.CircuitCommercial || []}
              onChange={handleCircuitsChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
