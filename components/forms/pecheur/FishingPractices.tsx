import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PratiquePeche } from "@/type/localType";

interface FishingPracticesProps {
  practices: PratiquePeche[];
  onChange: (practices: PratiquePeche[]) => void;
}

export function FishingPractices({
  practices,
  onChange,
}: FishingPracticesProps) {
  const addPractice = () => {
    const newPractice: PratiquePeche = {
      id: crypto.randomUUID(),
      anneeDebut: undefined,
      especeCible: "",
      dureeSaisonHaute: undefined,
      dureeSaisonBasse: undefined,
      frequenceSortiesSaisonHaute: undefined,
      frequenceSortiesSaisonBasse: undefined,
      capturesMoyennesSaisonHaute: undefined,
      capturesMoyennesSaisonBasse: undefined,
      classificationActivite: "",
    };
    onChange([...practices, newPractice]);
  };

  const removePractice = (id: string) => {
    onChange(practices.filter((p) => p.id !== id));
  };

  const updatePractice = <K extends keyof PratiquePeche>(
    id: string,
    field: K,
    value: PratiquePeche[K]
  ) => {
    onChange(
      practices.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };
  console.log(practices);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Pratiques de pêche ({practices.length})
        </h3>
        <Button type="button" onClick={addPractice} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {practices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune pratique de pêche enregistrée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {practices.map((practice) => (
            <Card key={practice.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg  font-bold">
                  Pratique de pêche{" "}
                  <span className=" text-2xl uppercase  tracking-widest animate-pulse bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text ">
                    {practice?.especeCible}
                  </span>{" "}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePractice(practice.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Année de début</Label>
                    <Input
                      type="number"
                      value={practice.anneeDebut || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "anneeDebut",
                          parseInt(e.target.value) || undefined
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Espèce cible</Label>
                    <Input
                      value={practice.especeCible || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "especeCible",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dureeSaisonHaute">
                      Durée saison haute (jours)
                    </Label>
                    <Input
                      id="dureeSaisonHaute"
                      value={practice.dureeSaisonHaute || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "dureeSaisonHaute",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dureeSaisonBasse">
                      Durée saison basse (jours)
                    </Label>
                    <Input
                      id="dureeSaisonBasse"
                      type="number"
                      value={practice.dureeSaisonBasse || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "dureeSaisonBasse",
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="frequenceSortiesSaisonHaute">
                      Fréquence sorties saison haute
                    </Label>
                    <Input
                      id="frequenceSortiesSaisonHaute"
                      type="number"
                      step="0.1"
                      value={practice.frequenceSortiesSaisonHaute || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "frequenceSortiesSaisonHaute",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequenceSortiesSaisonBasse">
                      Fréquence sorties saison basse
                    </Label>
                    <Input
                      id="frequenceSortiesSaisonBasse"
                      type="number"
                      step="0.1"
                      value={practice.frequenceSortiesSaisonBasse || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "frequenceSortiesSaisonBasse",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capturesMoyennesSaisonHaute">
                      Captures moyennes saison haute (kg)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={practice.capturesMoyennesSaisonHaute || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "capturesMoyennesSaisonHaute",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="capturesMoyennesSaisonBasse">
                      Captures moyennes saison basse (kg)
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={practice.capturesMoyennesSaisonBasse || ""}
                      onChange={(e) =>
                        updatePractice(
                          practice.id,
                          "capturesMoyennesSaisonBasse",
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="classificationActivite">
                    Classification activité
                  </Label>
                  <Input
                    id="classificationActivite"
                    value={practice.classificationActivite || ""}
                    onChange={(e) =>
                      updatePractice(
                        practice.id,
                        "classificationActivite",
                        e.target.value ? e.target.value : undefined
                      )
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
