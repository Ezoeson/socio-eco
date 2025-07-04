import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { EmbarcationPeche } from "@/type/localType";

interface FishingBoatsProps {
  boats: EmbarcationPeche[];
  onChange: (boats: EmbarcationPeche[]) => void;
}

export function FishingBoats({ boats, onChange }: FishingBoatsProps) {
  const addBoat = () => {
    const newBoat: EmbarcationPeche = {
      id: crypto.randomUUID(),
      typeEmbarcation: "avec balancier",
      systemePropulsion: "voile rame pagaie",
      proprietaire: true,
      nombre: 1,
      nombreEquipage: undefined,
      partageCaptures: undefined,
      statutPropriete: "",
      coutAcquisition: 0,
      modeAcquisition: "",
      typeFinancement: "",
      montantFinancement: 0,
      dureeFinancement: 0,
      remboursementMensuel: 0,
      longueur: 0,
      capacitePassagers: 0,
      ageMois: 0,
      dureeVieEstimee: 0,
      materiauxConstruction: "bois",
      typeBois: "",
    };
    onChange([...boats, newBoat]);
  };

  const removeBoat = (id: string) => {
    onChange(boats.filter((b) => b.id !== id));
  };

  const updateBoat = <K extends keyof EmbarcationPeche>(
    id: string,
    field: K,
    value: EmbarcationPeche[K]
  ) => {
    onChange(boats.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Embarcations ({boats.length})</h3>
        <Button type="button" onClick={addBoat} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {boats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune embarcation enregistrée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {boats.map((boat) => (
            <Card key={boat.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Embarcation
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBoat(boat.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations de base</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="number"
                          value={boat.nombre || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "nombre",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombreEquipage">
                          Nombre d&apos;équipage
                        </Label>
                        <Input
                          id="nombreEquipage"
                          name="nombreEquipage"
                          type="number"
                          min="0"
                          value={boat.nombreEquipage || ""}
                          onChange={(e) => {
                            const rawValue = e.target.value;

                            if (/[eE]/.test(rawValue)) {
                              return;
                            }

                            const numValue = parseInt(rawValue);

                            // Si c'est un nombre valide et positif (ou zéro)
                            if (!isNaN(numValue) && numValue >= 0) {
                              updateBoat(boat.id, "nombreEquipage", numValue);
                            } else if (rawValue === "") {
                              updateBoat(boat.id, "nombreEquipage", undefined);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (["e", "E", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Propriétaire</Label>
                        <div className="flex gap-4 mt-2">
                          <Button
                            type="button"
                            variant={boat.proprietaire ? "default" : "outline"}
                            onClick={() =>
                              updateBoat(boat.id, "proprietaire", true)
                            }
                          >
                            Oui
                          </Button>
                          <Button
                            type="button"
                            variant={
                              boat.proprietaire === false
                                ? "default"
                                : "outline"
                            }
                            onClick={() =>
                              updateBoat(boat.id, "proprietaire", false)
                            }
                          >
                            Non
                          </Button>
                        </div>
                      </div>

                      {boat.proprietaire === false && (
                        <div className="space-y-2">
                          <Label htmlFor="statutPropriete">
                            Statut de propriété
                          </Label>
                          <Input
                            id="statutPropriete"
                            name="statutPropriete"
                            value={boat.statutPropriete || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "statutPropriete",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  {/* Section Partage des captures */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Partage des captures</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="partageCaptures">
                          Partage des captures (%)
                        </Label>
                        <Input
                          id="partageCaptures"
                          name="partageCaptures"
                          type="number"
                          min="0" // Empêche les valeurs négatives
                          step="0.1" // Autorise les décimales (0.1, 0.5, etc.)
                          value={boat.partageCaptures ?? ""}
                          onChange={(e) => {
                            const rawValue = e.target.value;

                            // Rejette la notation exponentielle (comme "1e5")
                            if (/[eE]/.test(rawValue)) {
                              return; // Ne fait rien si notation exponentielle
                            }

                            // Convertit en nombre seulement si la valeur est valide
                            const numValue = parseFloat(rawValue);

                            // Si c'est un nombre valide et positif (ou zéro)
                            if (!isNaN(numValue) && numValue >= 0) {
                              updateBoat(boat.id, "partageCaptures", numValue);
                            } else if (rawValue === "") {
                              updateBoat(boat.id, "partageCaptures", undefined);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Empêche la saisie des caractères 'e', 'E', '-'
                            if (["e", "E", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
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
                      <div className="space-y-2">
                        <Label htmlFor="prixAcquisition">
                          Prix d&apos;achat (MGA)
                        </Label>
                        <Input
                          id="coutAcquisition"
                          name="coutAcquisition"
                          type="number"
                          value={boat.coutAcquisition || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "coutAcquisition",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modeAcquisition">
                          Mode d&rsquo;acquisition
                        </Label>
                        <Input
                          id="modeAcquisition"
                          name="modeAcquisition"
                          value={boat.modeAcquisition || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "modeAcquisition",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="typeFinancement">Type de Prêt</Label>
                        <Input
                          id="typeFinancement"
                          name="typeFinancement"
                          value={boat.typeFinancement || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "typeFinancement",
                              e.target.value
                            )
                          }
                          className="uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="montantFinancement">
                            Montant Prêt
                          </Label>
                          <Input
                            id="montantFinancement"
                            name="montantFinancement"
                            type="number"
                            value={boat.montantFinancement || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "montantFinancement",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dureeFinancement">Durée (mois)</Label>
                          <Input
                            id="dureeFinancement"
                            name="dureeFinancement"
                            type="number"
                            value={boat.dureeFinancement || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "dureeFinancement",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="remboursementMensuel">
                          Remboursement mensuel
                        </Label>
                        <Input
                          id="remboursementMensuel"
                          name="remboursementMensuel"
                          type="number"
                          value={boat.remboursementMensuel || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "remboursementMensuel",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section Caractéristiques techniques */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Caractéristiques techniques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="typeEmbarcation">
                          Type d&rsquo;embarcation
                        </Label>
                        <Input
                          id="typeEmbarcation"
                          name="typeEmbarcation"
                          value={boat.typeEmbarcation}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "typeEmbarcation",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="systemePropulsion">
                          Système de propulsion
                        </Label>
                        <Input
                          id="systemePropulsion"
                          name="systemePropulsion"
                          value={boat.systemePropulsion}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "systemePropulsion",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="longueur">Longueur (m)</Label>
                          <Input
                            id="longueur"
                            name="longueur"
                            type="number"
                            step="0.1"
                            value={boat.longueur || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "longueur",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="capacitePassagers">
                            Capacité passagers
                          </Label>
                          <Input
                            id="capacitePassagers"
                            name="capacitePassagers"
                            type="number"
                            value={boat.capacitePassagers || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "capacitePassagers",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ageMois">Âge (mois)</Label>
                          <Input
                            id="ageMois"
                            name="ageMois"
                            type="number"
                            value={boat.ageMois || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "ageMois",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dureeVieEstimee">
                            Durée de vie estimée (ans)
                          </Label>
                          <Input
                            id="dureeVieEstimee"
                            name="dureeVieEstimee"
                            type="number"
                            value={boat.dureeVieEstimee || ""}
                            onChange={(e) =>
                              updateBoat(
                                boat.id,
                                "dureeVieEstimee",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="materiauxConstruction">
                          Matériaux de construction
                        </Label>
                        <Input
                          id="materiauxConstruction"
                          name="materiauxConstruction"
                          value={boat.materiauxConstruction || ""}
                          onChange={(e) =>
                            updateBoat(
                              boat.id,
                              "materiauxConstruction",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {boat.materiauxConstruction
                        ?.toLowerCase()
                        .includes("bois") && (
                        <div className="space-y-2">
                          <Label htmlFor="typeBois">Type de bois</Label>
                          <Input
                            id="typeBois"
                            name="typeBois"
                            value={boat.typeBois || ""}
                            onChange={(e) =>
                              updateBoat(boat.id, "typeBois", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
