import { Plus, Trash2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActiviteEconomique } from "@/type/localType";

interface ActiviteEconomiqueFormProps {
  activites?: ActiviteEconomique[];
  onChange: (activites: ActiviteEconomique[]) => void;
}

const typesActivite = [
  { value: "mangrove", label: "Mangrove" },
  { value: "agriculture", label: "Agriculture" },
  { value: "elevage", label: "Élevage" },
  { value: "salariat", label: "Salariat" },
  { value: "AGR", label: "AGR" },
];

const importances = [
  { value: "principale", label: "Principale" },
  { value: "secondaire", label: "Secondaire" },
  { value: "tertiaire", label: "Tertiaire" },
];

const utilisations = [
  { value: "vente", label: "Vente" },
  { value: "autoconsommation", label: "Autoconsommation" },
];

export function ActiviteEconomiqueForm({
  activites = [],
  onChange,
}: ActiviteEconomiqueFormProps) {
  const ajouterActivite = () => {
    onChange([
      ...activites,
      {
        id: crypto.randomUUID(),
        typeActivite: "mangrove",
        importanceActivite: undefined,

        // Champs pour la mangrove
        autreRessourceExploitee: undefined,
        utilisationRessource: undefined,
        prixVente: undefined,
        frequenceCollecte: undefined,
        frequenceVente: undefined,
        saisonHaute: undefined,
        saisonBasse: undefined,

        // Champs pour l'agriculture
        activiteAgricole: undefined,
        complementaritePeche: undefined,
        frequenceActiviteAgricole: undefined,
        superficieCultivee: undefined, // en hectares
        quantiteProduite: undefined, // en kg
        statutFoncier: undefined,
        lieuExploitationAgricole: undefined,
        outilsProduction: undefined,

        // Champs pour l'élevage
        sousTypeElevage: undefined,
        effectifElevage: undefined,
        zonePaturage: undefined,
        frequenceSoins: undefined,

        // Champs pour le salariat
        activiteSalariale: undefined,
        dureeConsacreeSalariat: undefined, // en jours/mois
        frequenceMensuelleSalariat: undefined,
        lieuExerciceSalariat: undefined,
        revenuMensuelSalariat: undefined, // en MGA

        // Champs pour les AGR
        activiteGeneratrice: undefined,
        dureeActiviteAGR: undefined, // en jours
        frequenceMensuelleAGR: undefined,
        lieuExerciceAGR: undefined,
        revenuMensuelAGR: undefined, // en MGA
      },
    ]);
  };

  const supprimerActivite = (id: string) => {
    onChange(activites.filter((a: ActiviteEconomique) => a.id !== id));
  };

  const modifierActivite = <K extends keyof ActiviteEconomique>(
    id: string,
    champ: K,
    valeur: ActiviteEconomique[K]
  ) => {
    onChange(
      activites.map((a: ActiviteEconomique) =>
        a.id === id ? { ...a, [champ]: valeur } : a
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <span className="hidden md:block">
            {" "}
            Activités économiques ({activites.length})
          </span>
        </h3>
        <Button
          type="button"
          onClick={ajouterActivite}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter activité
        </Button>
      </div>

      {activites.map((activite: ActiviteEconomique) => (
        <ActiviteCard
          key={activite.id}
          activite={activite}
          onModifier={modifierActivite}
          onSupprimer={supprimerActivite}
        />
      ))}

      {activites?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune activité économique enregistrée</p>
          <p className="text-sm">Cliquez sur Ajouter activité pour commencer</p>
        </div>
      )}
    </div>
  );
}

interface ActiviteCardProps {
  activite: ActiviteEconomique;
  onModifier: <K extends keyof ActiviteEconomique>(
    id: string,
    champ: K,
    valeur: ActiviteEconomique[K]
  ) => void;
  onSupprimer: (id: string) => void;
}

function ActiviteCard({
  activite,
  onModifier,
  onSupprimer,
}: ActiviteCardProps) {
  const renderChampsSpecifiques = () => {
    switch (activite.typeActivite) {
      case "mangrove":
        return (
          <>
            <div className="space-y-2">
              <Label>Ressource exploitée *</Label>
              <Input
                value={activite.autreRessourceExploitee || ""}
                onChange={(e) =>
                  onModifier(
                    activite.id,
                    "autreRessourceExploitee",
                    e.target.value
                  )
                }
                placeholder="Ex: Bois, miel, plantes médicinales..."
              />
            </div>

            <div className="space-y-2">
              <Label>Utilisation principale *</Label>
              <Select
                value={activite.utilisationRessource || ""}
                onValueChange={(v) =>
                  onModifier(activite.id, "utilisationRessource", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {utilisations.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activite.utilisationRessource === "vente" && (
              <>
                <div className="space-y-2">
                  <Label>Prix de vente unitaire (MGA)</Label>
                  <Input
                    type="number"
                    value={activite.prixVente || ""}
                    onChange={(e) =>
                      onModifier(
                        activite.id,
                        "prixVente",
                        Number(e.target.value)
                      )
                    }
                    placeholder="Prix pour une unité"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fréquence de vente (par mois)</Label>
                  <Input
                    type="number"
                    value={activite.frequenceVente || ""}
                    onChange={(e) =>
                      onModifier(
                        activite.id,
                        "frequenceVente",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Fréquence de collecte (par mois)</Label>
              <Input
                type="number"
                value={activite.frequenceCollecte || ""}
                onChange={(e) =>
                  onModifier(
                    activite.id,
                    "frequenceCollecte",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Saison haute</Label>
                <Input
                  value={activite.saisonHaute || ""}
                  onChange={(e) =>
                    onModifier(activite.id, "saisonHaute", e.target.value)
                  }
                  placeholder="Ex: Octobre-Décembre"
                />
              </div>
              <div className="space-y-2">
                <Label>Saison basse</Label>
                <Input
                  value={activite.saisonBasse || ""}
                  onChange={(e) =>
                    onModifier(activite.id, "saisonBasse", e.target.value)
                  }
                  placeholder="Ex: Janvier-Mars"
                />
              </div>
            </div>
          </>
        );

      case "agriculture":
        return (
          <>
            <div className="space-y-2">
              <Label>Type de culture *</Label>
              <Input
                value={activite.activiteAgricole || ""}
                onChange={(e) =>
                  onModifier(activite.id, "activiteAgricole", e.target.value)
                }
                placeholder="Ex: Riz, maïs, légumes..."
              />
            </div>

            <div className="space-y-2">
              <Label>Relation avec la pêche</Label>
              <Select
                value={activite.complementaritePeche || ""}
                onValueChange={(v) =>
                  onModifier(activite.id, "complementaritePeche", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cumulé">Activité cumulée</SelectItem>
                  <SelectItem value="alternative">
                    Alternative à la pêche
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequence agricole</Label>
              <Input
                value={activite.frequenceActiviteAgricole || ""}
                onChange={(e) =>
                  onModifier(
                    activite.id,
                    "frequenceActiviteAgricole",
                    e.target.value
                  )
                }
                placeholder="Ex: novembre-juin..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Superficie (hectares)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={activite.superficieCultivee || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "superficieCultivee",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Production annuelle (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  value={activite.quantiteProduite || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "quantiteProduite",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Statut foncier</Label>
              <Input
                value={activite.statutFoncier || ""}
                onChange={(e) =>
                  onModifier(activite.id, "statutFoncier", e.target.value)
                }
                placeholder="Ex: Propriétaire, locataire..."
              />
            </div>

            <div className="space-y-2">
              <Label>Lieu d&apos;exploitation</Label>
              <Input
                value={activite.lieuExploitationAgricole || ""}
                onChange={(e) =>
                  onModifier(
                    activite.id,
                    "lieuExploitationAgricole",
                    e.target.value
                  )
                }
                placeholder="Localisation précise"
              />
            </div>

            <div className="space-y-2">
              <Label>Outils de production</Label>
              <Input
                value={activite.outilsProduction || ""}
                onChange={(e) =>
                  onModifier(activite.id, "outilsProduction", e.target.value)
                }
                placeholder="Ex: Charrue, tracteur..."
              />
            </div>
          </>
        );

      case "elevage":
        return (
          <>
            <div className="space-y-2">
              <Label>Type d&apos;élevage *</Label>
              <Select
                value={activite.sousTypeElevage || ""}
                onValueChange={(v) =>
                  onModifier(activite.id, "sousTypeElevage", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bovin">Bovins</SelectItem>
                  <SelectItem value="caprin_ovin">Caprins/Ovins</SelectItem>
                  <SelectItem value="porcin">Porcins</SelectItem>
                  <SelectItem value="volaille">Volailles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre d&apos;animaux</Label>
                <Input
                  type="number"
                  min="0"
                  value={activite.effectifElevage || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "effectifElevage",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Fréquence des soins</Label>
                <Input
                  value={activite.frequenceSoins || ""}
                  onChange={(e) =>
                    onModifier(activite.id, "frequenceSoins", e.target.value)
                  }
                  placeholder="Ex: Hebdomadaire"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Zone de pâturage</Label>
              <Input
                value={activite.zonePaturage || ""}
                onChange={(e) =>
                  onModifier(activite.id, "zonePaturage", e.target.value)
                }
                placeholder="Localisation"
              />
            </div>
          </>
        );

      case "salariat":
        return (
          <>
            <div className="space-y-2">
              <Label>Type d&apos;emploi *</Label>
              <Input
                value={activite.activiteSalariale || ""}
                onChange={(e) =>
                  onModifier(activite.id, "activiteSalariale", e.target.value)
                }
                placeholder="Ex: Employé de ferme, ouvrier..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Revenu mensuel (MGA)</Label>
                <Input
                  type="number"
                  min="0"
                  value={activite.revenuMensuelSalariat || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "revenuMensuelSalariat",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Jours travaillés/mois</Label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={activite.dureeConsacreeSalariat || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "dureeConsacreeSalariat",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu de travail</Label>
              <Input
                value={activite.lieuExerciceSalariat || ""}
                onChange={(e) =>
                  onModifier(
                    activite.id,
                    "lieuExerciceSalariat",
                    e.target.value
                  )
                }
                placeholder="Localisation précise"
              />
            </div>
          </>
        );

      case "AGR":
        return (
          <>
            <div className="space-y-2">
              <Label>Type d&apos;activité *</Label>
              <Input
                value={activite.activiteGeneratrice || ""}
                onChange={(e) =>
                  onModifier(activite.id, "activiteGeneratrice", e.target.value)
                }
                placeholder="Ex: Vente, artisanat..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Revenu mensuel (MGA)</Label>
                <Input
                  type="number"
                  min="0"
                  value={activite.revenuMensuelAGR || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "revenuMensuelAGR",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Jours d&apos;activité/mois</Label>
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={activite.dureeActiviteAGR || ""}
                  onChange={(e) =>
                    onModifier(
                      activite.id,
                      "dureeActiviteAGR",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lieu d&apos;exercice</Label>
              <Input
                value={activite.lieuExerciceAGR || ""}
                onChange={(e) =>
                  onModifier(activite.id, "lieuExerciceAGR", e.target.value)
                }
                placeholder="Localisation précise"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Select
            value={activite.typeActivite}
            onValueChange={(v) => onModifier(activite.id, "typeActivite", v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typesActivite.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSupprimer(activite.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Importance *</Label>
          <Select
            value={activite.importanceActivite || ""}
            onValueChange={(v) =>
              onModifier(activite.id, "importanceActivite", v)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {importances.map((imp) => (
                <SelectItem key={imp.value} value={imp.value}>
                  {imp.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderChampsSpecifiques()}
      </CardContent>
    </Card>
  );
}
