import { Plus, Trash2, Users } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { MembreFamille } from "@/type/localType";



interface MembreFamilleFormProps {
  membres: MembreFamille[];
  onChange: (membres: MembreFamille[]) => void;
}

const niveauxEducation = [
  "AUCUN",
  "PRESCOLAIRE",
  "PRIMAIRE_NON_COMPLET",
  "PRIMAIRE_COMPLET",
  "COLLEGE_NON_COMPLET",
  "COLLEGE_COMPLET",
  "SECONDAIRE_NON_COMPLET",
  "SECONDAIRE_COMPLET",
];

const lienssFamiliaux = ["CONJOINT", "ENFANT"];
const sexes = ["MASCULIN", "FEMININ"];

export function MembreFamilleForm({
  membres,
  onChange,
}: MembreFamilleFormProps) {
  const ajouterMembre = () => {
    const nouveauMembre: MembreFamille = {
      id: crypto.randomUUID(), // ou une autre méthode pour générer un ID unique
      nom: "",
      age: undefined,
      lienFamilial: "ENFANT",
      sexe: undefined,
      niveauEducation: undefined,
      frequentationEcole: false,
    };
    onChange([...membres, nouveauMembre]);
  };

  const supprimerMembre = (id: string) => {
    onChange(membres.filter((membre) => membre.id !== id));
  };

  const modifierMembre = <K extends keyof MembreFamille>(
    id: string,
    champ: K,
    valeur: MembreFamille[K]
  ) => {
    onChange(
      membres.map((membre) =>
        membre.id === id ? { ...membre, [champ]: valeur } : membre
      )
    );
  };

  const CONJOINTs = membres.filter((m) => m.lienFamilial === "CONJOINT");
  const ENFANTs = membres.filter((m) => m.lienFamilial === "ENFANT");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Membres de la famille ({membres.length})
        </h3>
        <Button
          type="button"
          onClick={ajouterMembre}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter membre
        </Button>
      </div>

      {/* Section CONJOINTs */}
      {CONJOINTs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>CONJOINTs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {CONJOINTs.map((membre) => (
              <MembreCard
                key={membre.id}
                membre={membre}
                onModifier={modifierMembre}
                onSupprimer={supprimerMembre}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Section ENFANTs */}
      {ENFANTs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>ENFANTs ({ENFANTs.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ENFANTs.map((membre, index) => (
              <MembreCard
                key={membre.id}
                membre={membre}
                onModifier={modifierMembre}
                onSupprimer={supprimerMembre}
                index={index + 1}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {membres.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun membre de famille ajouté</p>
          <p className="text-sm">
            Cliquez sur &quot;Ajouter membre&quot; pour commencer
          </p>
        </div>
      )}
    </div>
  );
}

interface MembreCardProps {
  membre: MembreFamille;
  onModifier: <K extends keyof MembreFamille>(
    id: string,
    champ: K,
    valeur: MembreFamille[K]
  ) => void;
  onSupprimer: (id: string) => void;
  index?: number;
}

function MembreCard({
  membre,
  onModifier,
  onSupprimer,
  index,
}: MembreCardProps) {
  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">
          {index ? `ENFANT ${index}` : "CONJOINT"}
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSupprimer(membre.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <div className="space-y-2">
          <Label htmlFor={`nom-${membre.id}`}>Nom *</Label>
          <Input
            id={`nom-${membre.id}`}
            value={membre.nom}
            onChange={(e) => onModifier(membre.id, "nom", e.target.value)}
            placeholder="Nom complet"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`age-${membre.id}`}>Âge</Label>
          <Input
            id={`age-${membre.id}`}
            type="number"
            value={membre.age || ""}
            onChange={(e) =>
              onModifier(
                membre.id,
                "age",
                parseInt(e.target.value) || undefined
              )
            }
            placeholder="Âge en années"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
          <div className="space-y-2 w-full">
            <Label>Lien familial</Label>
            <Select
              value={membre.lienFamilial}
              onValueChange={(value) =>
                onModifier(membre.id, "lienFamilial", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {lienssFamiliaux.map((lien) => (
                  <SelectItem key={lien} value={lien}>
                    {lien.charAt(0).toUpperCase() + lien.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sexe</Label>
            <Select
              value={membre.sexe}
              onValueChange={(value) => onModifier(membre.id, "sexe", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {sexes.map((sexe) => (
                  <SelectItem key={sexe} value={sexe}>
                    {sexe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Niveau d&apos;éducation</Label>
            <Select
              value={membre.niveauEducation}
              onValueChange={(value) =>
                onModifier(membre.id, "niveauEducation", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {niveauxEducation.map((niveau) => (
                  <SelectItem key={niveau} value={niveau}>
                    {niveau.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {
          // Pour le conjoint, on peut ajouter des champs supplémentaires
          membre.lienFamilial === "CONJOINT" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
              <div className="space-y-2">
                <Label htmlFor={`village-${membre.id}`}>
                  Village d&apos;origine
                </Label>
                <Input
                  id={`village-${membre.id}`}
                  value={membre.villageOrigine || ""}
                  onChange={(e) =>
                    onModifier(membre.id, "villageOrigine", e.target.value)
                  }
                  placeholder="Village d'origine"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ancien-lieu-${membre.id}`}>
                  Ancien lieu de résidence
                </Label>
                <Input
                  id={`ancien-lieu-${membre.id}`}
                  value={membre.ancienLieuResidence || ""}
                  onChange={(e) =>
                    onModifier(membre.id, "ancienLieuResidence", e.target.value)
                  }
                  placeholder="Ancien lieu de résidence"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`annee-${membre.id}`}>
                  Année d&apos;arrivée
                </Label>
                <Input
                  id={`annee-${membre.id}`}
                  type="number"
                  value={membre.anneeArrivee || ""}
                  onChange={(e) =>
                    onModifier(
                      membre.id,
                      "anneeArrivee",
                      parseInt(e.target.value) || undefined
                    )
                  }
                  placeholder="Année d'arrivée"
                />
              </div>
            </div>
          )
        }

        {
          // this checkbox is for children only
          membre.lienFamilial === "ENFANT" && (
            <div className="space-y-2 col-span-2">
              <Checkbox
                id={`frequentation-${membre.id}`}
                checked={membre.frequentationEcole || false}
                onCheckedChange={(checked) =>
                  onModifier(membre.id, "frequentationEcole", checked === true)
                }
              />
              <Label htmlFor={`frequentation-${membre.id}`}>
                Fréquentation de l&apos;école
              </Label>
            </div>
          )
        }
      </div>
    </div>
  );
}
